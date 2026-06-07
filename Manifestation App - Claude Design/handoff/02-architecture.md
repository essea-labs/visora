# Architecture

## Recommended stack

### Mobile
- **Native iOS** (Swift / SwiftUI) — primary platform.
  - Why native: the morning ritual is the core experience; it must feel cinematic, animate at 60+fps, and play voiced audio reliably even with the screen dimmed.
  - SwiftUI works for everything except the orb/breathing visuals — use Metal-backed `CAEmitterLayer` or a Lottie composition there.
- Android in Phase 2 (Compose). Mocks are iOS-first; revisit specs before porting.

### Backend
- **Postgres** for the relational core (users, boards, wins, witness pairs).
- **S3 + CloudFront** for user photo uploads and generated audio.
- **Redis** for ephemeral state (in-flight ritual sessions, voice generation queues).
- **Stripe** for subscription billing.
- **Voice generation**: ElevenLabs API for the voiced ritual. Generate per-user ritual audio asynchronously the night before each morning. Pre-bake = no spinner at 7am.

### Auth
- Sign in with Apple (primary), email magic link (fallback).
- We do NOT support social sign-in (no Google/Facebook).

## Data model

### Core entities

```
User
├── id, email, created_at, morning_time, voice_preference, palette_preference
├── timezone, name (display only — never shown publicly)
└── tier: curious | devoted | year

VisionBoard
├── id, user_id, area: career|health|love|finance|joy|custom, custom_label
├── name (string, ≤ 80 chars)
├── identity_statement (text, ≤ 400 chars, must start with "I am")
├── season: int (1, 2, 3… increments on each remap)
├── created_at, archived_at
└── → has many VisionPhoto

VisionPhoto
├── id, vision_board_id, position (0–4), source: library|upload
├── image_url, thumbnail_url, blurhash
└── library_asset_id (nullable; references curated library)

Win
├── id, user_id, vision_board_id (nullable — wins can be uncategorized)
├── body (text, ≤ 500 chars)
├── photo_url (nullable)
├── visibility: private | witness
├── created_at, edit_locked_at (created_at + 5min)
└── deleted_at (soft delete)

WitnessPair
├── id, user_a_id, user_b_id, paired_at, status: invited|active|ended
└── (uniqueness: each user is in at most one active pair)

RitualSession
├── id, user_id, scheduled_for (datetime in user's tz)
├── audio_url (pre-generated), duration_sec
├── completed_at (nullable), skipped: boolean
├── beat_durations: jsonb {settle:N, breathe:N, picture:N, anchor:N, send_off:N}
└── source_board_id, source_identity_snapshot (denormalized for replay fidelity)

PhotoLibraryAsset
├── id, area, tags[], image_url, thumbnail_url, attribution
└── (curated by us, not user-generated)
```

### Key invariants

- A user has **0 or 1** active witness pair. Inviting a second one ends the first (with a warm confirmation).
- Wins are **immutable after 5 minutes**. Soft-delete only; never overwrite.
- Vision boards are **versioned by season**. When a user re-maps, we don't mutate — we archive the old season and create a new one. The archive is sacred.
- Identity statements are **plain text**. No markdown, no rich text. Voice must be able to read them aloud cleanly.

## Sync model

### Reads
- Boards, wins, witness pair → cached locally in Core Data, synced via standard pull.
- Ritual session for the **upcoming morning** is pre-fetched the night before, including its audio file (downloaded on Wi-Fi when possible).
- Library assets cached aggressively; rotate ~weekly.

### Writes
- Wins: optimistic, local-first. Visible immediately, syncs in background. Photo uploads handled in a background URLSession.
- Vision board edits: optimistic, but blocking-spinner if the user is mid-creation flow.
- Ritual completion: fire-and-forget on completion; we don't block the send-off screen on network.

### Offline behavior
- Capturing wins works fully offline (text + photo).
- Morning ritual works offline if the audio was pre-fetched. If not, fall back to silent-with-text.
- Witness feed requires network; show a kind empty state if offline.

## Voice / audio pipeline

The morning ritual is the most technically delicate part of the product. Here's the pipeline:

```
NIGHT BEFORE (server cron, 4 hours before user's morning_time)
1. Pull active vision boards for the user
2. Generate ritual script:
   - Settle (15s) — fixed copy, voice-driven
   - Breathe (20s) — fixed copy + breath cues
   - Picture (35s) — interpolate user's identity statement + first vision name
   - Anchor (15s) — interpolate first intention prompt
   - Send-off (5s) — fixed
3. POST script to ElevenLabs (voice = user.voice_preference, default "Sage")
4. Store audio_url on RitualSession
5. iOS device pre-fetches over Wi-Fi if available before morning_time

MORNING (user opens at 7am)
1. Load RitualSession for today
2. Render orb + vision photo background
3. Begin audio playback synced to beat transitions (driver: audio time, not wall time)
4. On audio end: mark completed_at, transition to today's intentions screen
```

If audio generation fails (ElevenLabs down, etc.), serve a fallback "silent ritual" with on-screen text and an audible chime per beat.

## Privacy

- All photos stored encrypted at rest (S3 SSE).
- Witness can only see wins where `visibility = witness`. Server enforces; client-side filtering is not sufficient.
- Identity statements are deeply personal. Treat them as PII. Never log them. Never include them in analytics events.
- No tracking pixels. No third-party analytics SDKs. Self-hosted product analytics (Posthog OSS or equivalent).

## Cost notes

- ElevenLabs at scale is expensive (~$0.30/user/month at default voice settings, daily ritual). Budget into pricing model.
- Photo storage is cheap; user uploads are the bigger driver. Limit raw photos to 4MB after processing.
- The free tier is intentionally cheap to serve: no voice generation for Curious users (free voice = a single canned recording per area, or device TTS).
