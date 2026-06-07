# Innerproof Backend

Supabase project — schema, RLS, edge functions.

## Layout

```
backend/
├── migrations/
│   ├── 0001_initial_schema.sql    # tables + enums + auto-create-profile trigger
│   ├── 0002_rls_policies.sql      # row-level security
│   └── 0003_triggers.sql          # win immutability, photo count, witness queue, board focus
├── functions/
│   ├── pair-witness/              # POST: validate invite token + create pair
│   ├── notify-witness-win/        # cron: drain notification_batches → APNs
│   └── revenuecat-webhook/        # POST: mirror sub state to profiles.tier
└── seed/                          # optional content seeds (photo library, etc.)
```

## Deploy

Once Supabase project is created and CLI is authed:

```bash
# Apply migrations
supabase db push

# Deploy edge functions
supabase functions deploy pair-witness
supabase functions deploy notify-witness-win
supabase functions deploy revenuecat-webhook
```

## Env vars to set in Supabase project

| Var | Used by | Source |
|---|---|---|
| `SUPABASE_URL` | all functions | auto-set by Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | all functions | auto-set by Supabase |
| `REVENUECAT_WEBHOOK_AUTH` | revenuecat-webhook | shared secret you create + paste into RC dashboard |
| `APNS_TEAM_ID` | notify-witness-win | Apple Developer account |
| `APNS_KEY_ID` | notify-witness-win | Apple Developer → Keys → APNs key |
| `APNS_PRIVATE_KEY_PEM` | notify-witness-win | contents of the .p8 file (with BEGIN/END markers) |
| `APNS_BUNDLE_ID` | notify-witness-win | `com.essealabs.innerproof` |
| `APNS_HOST` | notify-witness-win | `api.push.apple.com` (prod) or `api.sandbox.push.apple.com` (TestFlight before App Store) |

## Cron schedule for `notify-witness-win`

In Supabase SQL editor (after migrations + functions deployed):

```sql
SELECT cron.schedule(
  'notify-witness-win-drain',
  '*/5 * * * *',  -- every 5 min
  $$
    SELECT net.http_post(
      url := 'https://<project-ref>.supabase.co/functions/v1/notify-witness-win',
      headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))
    );
  $$
);
```

(Adjust frequency post-launch based on volume. 5 min is a fine default.)

## RevenueCat webhook setup

1. RevenueCat dashboard → Project → Integrations → Webhooks → Add new
2. URL: `https://<project-ref>.supabase.co/functions/v1/revenuecat-webhook`
3. Authorization header: `Bearer <random-secret>` — paste this same value as `REVENUECAT_WEBHOOK_AUTH` env var in Supabase

## Storage buckets

Create via dashboard or `supabase storage`:

- `user-photos` — private; RLS by path prefix `<user_id>/...`
- `library-photos` — public read; service role write only

(No `ritual-audio` bucket — audio is bundled in the iOS app.)
