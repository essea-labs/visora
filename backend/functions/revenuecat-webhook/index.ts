// revenuecat-webhook — Innerproof
// ===========================================================
// Receives RevenueCat webhook events and mirrors subscription state
// to public.profiles.tier and tier_expires_at.
//
// POST /functions/v1/revenuecat-webhook
// Auth: shared-secret in `Authorization: Bearer <REVENUECAT_WEBHOOK_AUTH>` header
//       (set in RevenueCat dashboard → Project → Integrations → Webhooks → Authorization header)
//
// Event types we handle:
//  - INITIAL_PURCHASE       → tier=paid
//  - RENEWAL                → tier=paid (extend tier_expires_at)
//  - CANCELLATION           → keep tier=paid until expires_at, then EXPIRATION will fire
//  - EXPIRATION             → tier=expired
//  - PRODUCT_CHANGE         → tier=paid (tier_expires_at recomputed)
//  - SUBSCRIPTION_PAUSED    → keep tier=paid until expires_at
//  - UNCANCELLATION         → tier=paid
//  - BILLING_ISSUE          → log; don't change tier yet
//
// We ignore SANDBOX_*, TEST events in production.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const REVENUECAT_WEBHOOK_AUTH = Deno.env.get("REVENUECAT_WEBHOOK_AUTH")!;

interface RevenueCatEvent {
  type: string;
  app_user_id: string;        // we set this to profiles.id (UUID) on iOS via RevenueCat
  expiration_at_ms?: number;
  product_id?: string;
  environment?: "PRODUCTION" | "SANDBOX";
  [key: string]: unknown;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // 1. Verify shared-secret
  const auth = req.headers.get("Authorization");
  if (!auth || auth !== `Bearer ${REVENUECAT_WEBHOOK_AUTH}`) {
    console.warn("revenuecat-webhook: unauthorized request");
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. Parse body
  let payload: { event: RevenueCatEvent };
  try {
    payload = await req.json();
  } catch (_err) {
    return new Response("Invalid JSON", { status: 400 });
  }

  const event = payload.event;
  if (!event || !event.type || !event.app_user_id) {
    return new Response("Missing event fields", { status: 400 });
  }

  // 3. Skip sandbox events in production
  if (event.environment === "SANDBOX" && Deno.env.get("REVENUECAT_ALLOW_SANDBOX") !== "true") {
    return json({ ignored: "sandbox" });
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // 4. Map event to tier change
  const update = mapEventToTierUpdate(event);
  if (!update) {
    // Event we don't act on (BILLING_ISSUE, TRANSFER, etc.)
    return json({ ignored: event.type });
  }

  const { error } = await admin
    .from("profiles")
    .update(update)
    .eq("id", event.app_user_id);

  if (error) {
    console.error("revenuecat-webhook: profile update failed", error, event);
    return new Response("Update failed", { status: 500 });
  }

  return json({ ok: true, applied: update });
});

function mapEventToTierUpdate(event: RevenueCatEvent): { tier?: string; tier_expires_at?: string | null } | null {
  const expiresAt = event.expiration_at_ms ? new Date(event.expiration_at_ms).toISOString() : null;

  switch (event.type) {
    case "INITIAL_PURCHASE":
    case "RENEWAL":
    case "PRODUCT_CHANGE":
    case "UNCANCELLATION":
      return { tier: "paid", tier_expires_at: expiresAt };

    case "TRIAL_STARTED":
    case "INTRO_TRIAL_STARTED":
      return { tier: "trial", tier_expires_at: expiresAt };

    case "EXPIRATION":
      return { tier: "expired", tier_expires_at: expiresAt };

    case "CANCELLATION":
    case "SUBSCRIPTION_PAUSED":
      // User canceled but is paid until expires_at — leave tier=paid; EXPIRATION will fire later
      return { tier_expires_at: expiresAt };

    case "BILLING_ISSUE":
    case "TRANSFER":
    case "NON_RENEWING_PURCHASE":
    default:
      return null;
  }
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
