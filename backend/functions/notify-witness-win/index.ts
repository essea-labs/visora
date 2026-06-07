// notify-witness-win — Innerproof
// ===========================================================
// Reads the notification_batches outbox and sends APNs pushes
// for batches whose window has expired (or who have N pending wins).
//
// Trigger: invoked on a 5-minute cron OR via direct HTTP from the trigger
// in 0003_triggers.sql when a witness-visible win is captured.
//
// For MVP we run this as a recurring cron (every 5 min) — keeps the
// implementation simple and respects the 4-hour batch window.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// APNs settings (set in Supabase project secrets)
const APNS_TEAM_ID = Deno.env.get("APNS_TEAM_ID");
const APNS_KEY_ID = Deno.env.get("APNS_KEY_ID");
const APNS_PRIVATE_KEY_PEM = Deno.env.get("APNS_PRIVATE_KEY_PEM");
const APNS_BUNDLE_ID = Deno.env.get("APNS_BUNDLE_ID") || "com.essealabs.innerproof";
const APNS_HOST = Deno.env.get("APNS_HOST") || "api.push.apple.com"; // sandbox: api.sandbox.push.apple.com

serve(async (_req) => {
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // Pick up batches that have expired their window OR have ≥1 win and are
  // older than 5 min (send promptly if the batch is "established")
  const { data: batches, error } = await admin
    .from("notification_batches")
    .select("id, recipient_user_id, kind, payload, batch_window_end, batch_window_start")
    .is("sent_at", null)
    .lte("batch_window_end", new Date().toISOString())
    .limit(100);

  if (error) {
    console.error("batch select failed", error);
    return new Response(JSON.stringify({ error: "select failed" }), { status: 500 });
  }

  if (!batches || batches.length === 0) {
    return new Response(JSON.stringify({ sent: 0 }), { status: 200 });
  }

  let sent = 0;
  let failed = 0;

  for (const batch of batches) {
    try {
      // Look up recipient's device tokens
      const { data: profile } = await admin
        .from("profiles")
        .select("device_tokens, name")
        .eq("id", batch.recipient_user_id)
        .single();

      if (!profile || !profile.device_tokens || profile.device_tokens.length === 0) {
        // No device tokens — mark sent so we don't retry
        await admin
          .from("notification_batches")
          .update({ sent_at: new Date().toISOString() })
          .eq("id", batch.id);
        continue;
      }

      // Build push payload by kind
      const payload = buildApnsPayload(batch.kind, batch.payload);
      if (!payload) {
        await admin
          .from("notification_batches")
          .update({ sent_at: new Date().toISOString() })
          .eq("id", batch.id);
        continue;
      }

      // Send to all device tokens (most users have 1)
      for (const token of profile.device_tokens) {
        await sendApnsPush(token, payload);
      }

      await admin
        .from("notification_batches")
        .update({ sent_at: new Date().toISOString() })
        .eq("id", batch.id);
      sent++;
    } catch (err) {
      console.error(`batch ${batch.id} failed`, err);
      failed++;
    }
  }

  return new Response(JSON.stringify({ sent, failed }), { status: 200 });
});

// =========================================================
// Push payload builders by kind
// =========================================================

interface ApnsPayload {
  aps: {
    alert: { title?: string; body: string };
    sound?: string;
    "content-available"?: number;
    badge?: number;
  };
  data?: Record<string, unknown>;
}

function buildApnsPayload(kind: string, payload: Record<string, unknown>): ApnsPayload | null {
  switch (kind) {
    case "witness_win": {
      const winIds = (payload?.win_ids as string[]) ?? [];
      const count = winIds.length;
      const body = count === 1
        ? "They captured a win — just for you to see."
        : `${count} wins from your witness — just for you to see.`;
      return {
        aps: {
          alert: { title: "A new witness win", body },
          sound: "default",
        },
        data: { kind: "witness_win", win_ids: winIds },
      };
    }
    case "witness_pair_accepted": {
      return {
        aps: {
          alert: { body: "Your witness accepted. You're paired." },
          sound: "default",
        },
        data: { kind: "witness_pair_accepted" },
      };
    }
    default:
      return null;
  }
}

// =========================================================
// APNs HTTP/2 sender (uses fetch — Deno Deploy supports HTTP/2)
// =========================================================

async function sendApnsPush(deviceToken: string, payload: ApnsPayload): Promise<void> {
  if (!APNS_TEAM_ID || !APNS_KEY_ID || !APNS_PRIVATE_KEY_PEM) {
    console.warn("APNs credentials not set — skipping push");
    return;
  }

  const jwt = await buildApnsJwt();
  const url = `https://${APNS_HOST}/3/device/${deviceToken}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "authorization": `bearer ${jwt}`,
      "apns-topic": APNS_BUNDLE_ID,
      "apns-push-type": "alert",
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`APNs push failed for ${deviceToken.substring(0, 8)}…: ${res.status} ${text}`);
  }
}

// =========================================================
// JWT signing for APNs auth (ES256 / p8 key)
// =========================================================

let cachedJwt: { token: string; expiresAt: number } | null = null;

async function buildApnsJwt(): Promise<string> {
  // APNs JWTs are valid up to 60 minutes; refresh every 50 min.
  if (cachedJwt && cachedJwt.expiresAt > Date.now() + 60_000) {
    return cachedJwt.token;
  }

  const header = { alg: "ES256", kid: APNS_KEY_ID, typ: "JWT" };
  const claims = { iss: APNS_TEAM_ID, iat: Math.floor(Date.now() / 1000) };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const claimsB64 = base64UrlEncode(JSON.stringify(claims));
  const signingInput = `${headerB64}.${claimsB64}`;

  const key = await importApnsKey(APNS_PRIVATE_KEY_PEM!);
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: { name: "SHA-256" } },
    key,
    new TextEncoder().encode(signingInput),
  );
  const sigB64 = base64UrlEncodeBytes(new Uint8Array(sig));

  const token = `${signingInput}.${sigB64}`;
  cachedJwt = { token, expiresAt: Date.now() + 50 * 60_000 };
  return token;
}

async function importApnsKey(pem: string): Promise<CryptoKey> {
  // Accept either escaped \n or real newlines in env
  const cleaned = pem.replace(/\\n/g, "\n");
  const b64 = cleaned
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const der = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return await crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
}

function base64UrlEncode(s: string): string {
  return base64UrlEncodeBytes(new TextEncoder().encode(s));
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  const b64 = btoa(String.fromCharCode(...bytes));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
