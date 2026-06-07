# Manifestation App (Visora)

## Brand copy rules
Apply to ALL user-facing Visora copy: the website (`site/`), App Store listing (`marketing/`), and in-app strings (`mobile/`).

- **No dash punctuation.** Never use em-dashes (—), en-dashes (–), or " - " as punctuation. Rewrite with periods, commas, or colons. Also avoid hyphenated compounds in body copy where a spaced or reworded form reads fine ("voice guided" not "voice-guided"; "3 minute" not "3-minute"; "7 day" not "7-day"). Code/CSS identifiers (class names, etc.) are exempt. (User instruction, 2026-06: "remove all - in the website and remember this.")
- **Don't use "prove" or "proof"** in copy. Users should never feel they have to prove anything. Use "evidence", or just describe capturing wins.
- **"Who you want to become", not "who you're becoming".** The vision board holds an aspiration the user chooses, so label the future self as "who you want to become". Reserve the bare verb/noun "becoming" for brand lines ("Practice becoming. Daily.", "Become who you envision.", "your timeline of becoming") and leave present-tense affirmations ("I am becoming…") exactly as written. (User instruction, 2026-06.)
- **Don't advertise unbuilt features as if they exist.** At MVP the app is local-only. There is no sign-in, no cross-device sync, no streaks, and no social/accountability features yet. Sync (Supabase + Apple sign-in), streaks, and an accountability buddy are planned but NOT shipped. Mention them only as roadmap, never as current behaviour.
- Keep the voice quiet and concrete. Avoid vague slogans.

## Pricing (as of 2026-06)
**$2.99 / month** or **$29.00 / year** (≈$2.42/mo, ~19% off), **7 day free trial**.
Update everywhere together: `site/index.html`, `site/terms.html`, `mobile/app/(onboarding)/paywall.tsx`, `marketing/APP-STORE-COPY.md`, AND the real products in **App Store Connect / RevenueCat** (copy alone does not change what users are billed).

## Architecture quick facts (verified 2026-06)
- All user data persists on-device via **AsyncStorage + Zustand persist** (`mobile/src/core/stores/`). The app makes **no Supabase calls today**; Supabase is only used by `backend/` Edge Functions for future sync / witness / RevenueCat webhooks.
- Ritual audio is **bundled** (`mobile/assets/audio/ritual/ritual.m4a`, `require()`'d into the JS bundle), so the core experience is **fully offline**. Internet is only needed to start a subscription (App Store) once RevenueCat is wired.
- Audio session uses `playsInSilentModeIOS: true` but `staysActiveInBackground: false` — it plays in silent mode but does **not** currently keep playing when the phone is locked or backgrounded. Don't claim lock-screen/background playback until that flag flips.
