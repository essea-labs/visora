// pair-witness — Innerproof
// ===========================================================
// Accepts a witness invite token and creates a symmetric pair
// between the inviter and the recipient (caller).
//
// POST /functions/v1/pair-witness
// Headers: Authorization: Bearer <recipient's JWT>
// Body:    { "token": "<invite_token>" }
//
// Returns: { pair: { id, user_a_id, user_b_id, paired_at } }

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Authenticate the recipient
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing Authorization header" }, 401);
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return json({ error: "Invalid auth token" }, 401);
    }

    // 2. Parse body
    const body = await req.json();
    const token = body?.token;
    if (typeof token !== "string" || token.length === 0) {
      return json({ error: "Missing or invalid token" }, 400);
    }

    // Use service role for the validation + insert operations
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // 3. Look up invite, validate
    const { data: invite, error: inviteErr } = await admin
      .from("witness_invites")
      .select("id, inviter_user_id, expires_at, accepted_at")
      .eq("token", token)
      .single();

    if (inviteErr || !invite) {
      return json({ error: "Invite not found" }, 404);
    }

    if (invite.accepted_at !== null) {
      return json({ error: "Invite already accepted" }, 409);
    }

    if (new Date(invite.expires_at) < new Date()) {
      return json({ error: "Invite expired" }, 410);
    }

    if (invite.inviter_user_id === user.id) {
      return json({ error: "Cannot pair with yourself" }, 400);
    }

    // 4. Verify neither party already has an active pair
    const { data: existingPairs, error: existingErr } = await admin
      .from("witness_pairs")
      .select("id")
      .or(
        `user_a_id.eq.${invite.inviter_user_id},user_b_id.eq.${invite.inviter_user_id},` +
        `user_a_id.eq.${user.id},user_b_id.eq.${user.id}`
      )
      .is("ended_at", null);

    if (existingErr) {
      console.error("existingPairs check failed", existingErr);
      return json({ error: "Internal error" }, 500);
    }

    if (existingPairs && existingPairs.length > 0) {
      return json({ error: "One of you is already in an active pair" }, 409);
    }

    // 5. Create the pair (user_a_id < user_b_id ordering)
    const [a, b] = [invite.inviter_user_id, user.id].sort();
    const { data: pair, error: pairErr } = await admin
      .from("witness_pairs")
      .insert({ user_a_id: a, user_b_id: b })
      .select("id, user_a_id, user_b_id, paired_at")
      .single();

    if (pairErr) {
      console.error("pair insert failed", pairErr);
      return json({ error: "Failed to create pair" }, 500);
    }

    // 6. Mark invite accepted
    const { error: acceptErr } = await admin
      .from("witness_invites")
      .update({ accepted_at: new Date().toISOString(), accepted_by_user_id: user.id })
      .eq("id", invite.id);

    if (acceptErr) {
      console.error("invite accept update failed", acceptErr);
      // Pair was created — don't fail the request, but log
    }

    // 7. Queue notification to inviter ("they accepted")
    await admin.from("notification_batches").insert({
      recipient_user_id: invite.inviter_user_id,
      kind: "witness_pair_accepted",
      payload: { paired_user_id: user.id, pair_id: pair.id },
    });

    return json({ pair });
  } catch (err) {
    console.error("pair-witness error", err);
    return json({ error: "Internal error" }, 500);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
