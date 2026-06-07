# Visora — App Store submission checklist

Last updated: R46. Use this as the single source of truth for what's needed to ship to the App Store. Tick boxes as you complete them.

---

## A · Code state (R45 sweep results)

### ✅ Passing
- [x] TypeScript: `npx tsc --noEmit` clean (zero errors)
- [x] iOS bundle compiles: HTTP 200, ~11.7MB
- [x] Navigation graph: all `router.push/replace` targets are registered routes
- [x] Audio file: variant-4.m4a is valid AAC M4A, 1.0MB, ~2:49 runtime
- [x] Permission strings: `NSPhotoLibraryUsageDescription` + `NSPhotoLibraryAddUsageDescription` in `app.config.ts`
- [x] Bundle ID set up with dev/preview/production variants
- [x] Background audio mode enabled (`UIBackgroundModes: ['audio']`)
- [x] Version mismatch fixed (was app.config.ts 0.1.0 vs settings.tsx 0.13.0 — now both 0.13.0)
- [x] Home tab layout verified across iPhone 14 / 15 Pro Max via `_home-layout-mirror.html`
- [x] Onboarding flow chain valid: welcome → why → pick-areas → build-board → paywall → complete → home

### ⚠️ Pre-submission work needed (code)

| # | Item | File / location | Status |
|---|---|---|---|
| A1 | Wire RevenueCat in place of subscription stub | `src/core/stores/useSubscriptionStore.ts`, `app/(onboarding)/paywall.tsx` | ⏳ Phase B.8 — stub flips local flag. **Needs:** RevenueCat account + API key |
| A2 | Wire Supabase auth (Sign in with Apple) | `app/(onboarding)/welcome.tsx` "Sign in" button is a no-op | ⏳ Phase B.7. **Needs:** Supabase anon key, Apple Sign In configured in dev portal |
| A3 | "Manage subscription" → real iOS Subscriptions deep link | `app/settings.tsx` | ✅ R46 done — `itms-apps://apps.apple.com/account/subscriptions` |
| A4 | Remove "Export my data" stub | `app/settings.tsx` | ✅ R46 done — row removed |
| A5 | Sign out behaviour | `app/profile.tsx` — currently just `router.back()` | ⏳ Implement when A2 wired |
| A6 | Profile email + name hard-coded | `app/profile.tsx`, `app/settings.tsx` (`EMAIL = 'shellena@example.com'`) | ⏳ Will read from auth session after A2 |
| A7 | ~~Regenerate variants 1-3 + 5~~ | — | ❌ R46: **removed from MVP scope** — single voice (Daniel) for launch |
| A8 | ~~Restore day-of-week voice rotation~~ | — | ❌ R46: removed from MVP scope |
| A9 | Delete orphan onboarding screens | 10 files in `app/(onboarding)/` | ✅ R46 done — all 10 deleted |
| A10 | Delete `app/_dev/` developer-only routes | `_dev/index.tsx`, `_dev/orb.tsx` | ✅ R46 done — folder removed |
| A11 | Profile "Support" placeholder | `app/profile.tsx` | ✅ R46 done — now opens `mailto:support@tryvisora.com` |
| A12 | ~~Restore variant pill~~ | — | ❌ R46: removed from MVP scope |
| A13 | Collapse multi-voice system to single voice | `src/core/audio/ritualVoice.ts`, `useRitualAudio.ts`, audio dir, generator script | ✅ R46 done — `ritual.m4a` is now THE voice |
| A14 | Calmer voice processing | `assets/audio/ritual/ritual.m4a` | ✅ R46 done — lowpass + acompressor + gain reduction applied |
| A15 | Delete deprecated `useOnboardingStore` | `src/core/stores/` | ✅ R46 done — store and all references removed |
| A16 | Ritual backdrop reads from `visions[]`, not deprecated store | `app/ritual.tsx` | ✅ R46 done — first active vision's first photo |
| A17 | Real `support@tryvisora.com` mailbox set up | external | ⏳ **Needs:** working email forwarding from this address |
| A18 | Real privacy policy + terms URLs | `app/(onboarding)/paywall.tsx`, `app/settings.tsx` (currently `example.com`) | ⏳ **Drafts ready at `legal/PRIVACY-POLICY.md` + `legal/TERMS-OF-SERVICE.md`**. Needs: publish + paste URLs |
| A19 | Sentry crash reporting wired | `app/_layout.tsx` | ✅ R47 done — initialises iff `EXPO_PUBLIC_SENTRY_DSN` set, disabled in dev. **Needs:** DSN |
| A20 | App Store description, keywords, copy | `marketing/APP-STORE-COPY.md` | ✅ R47 drafted — name, subtitle, promo, description (~2150 chars), keywords (97 chars), age rating, privacy questionnaire, review notes |
| A21 | Marketing screenshots (6.9" iPhone) | `Manifestation App - Claude Design/_app-store-screenshots.html` | ✅ R47 drafted — 5 shots: hero, ritual, vision board, capture-win, vision detail. **You:** screenshot each at 2× Retina or use Puppeteer for proper 1320×2868 export |

### 🔐 Environment keys (`mobile/.env`)

| Key | Used for | Status |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Auth + data sync | ✅ set |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Client-scoped Supabase access | ✅ set (R49 — JWT verified, `role: anon`) |
| `EXPO_PUBLIC_REVENUECAT_KEY` | iOS SDK subscription | ❌ **Needs:** public iOS SDK key (`appl_...`) — user pasted secret `sk_*` key, can't ship |
| `EXPO_PUBLIC_POSTHOG_KEY` | Analytics (optional) | Skipped for MVP |
| `EXPO_PUBLIC_SENTRY_DSN` | Crash reports | ✅ set (R49) — auto-activates in production builds |

### 🌐 Hosted assets

| Asset | Where | Status |
|---|---|---|
| Privacy Policy | `tryvisora.com/privacy` | ✅ R50 deployed to Vercel — also at https://visora-virid.vercel.app/privacy. Awaiting DNS pointer at registrar |
| Terms of Service | `tryvisora.com/terms` | ✅ R50 deployed — also at https://visora-virid.vercel.app/terms |
| Landing page | `tryvisora.com/` | ✅ R50 deployed — also at https://visora-virid.vercel.app/ |
| RevenueCat public SDK key | `mobile/.env` | ✅ R50 set (`test_*` format — newer RC keys) |
| App's privacy/terms link targets | `paywall.tsx`, `settings.tsx` | ✅ R50 — point to `tryvisora.com/privacy` + `/terms`, ready for DNS propagation |
| App icon (1024×1024 PNG) | `mobile/assets/images/icon.png` | ✅ R49 — Visora "V + dot" mark on dawn gradient |
| App icon source SVG | `mobile/assets/images/icon.svg` | ✅ R49 — iterable |
| Marketing screenshots | `Manifestation App - Claude Design/_app-store-screenshots.html` | ✅ R47 HTML mockups; real screenshots deferred to post-TestFlight |

---

## B · Apple Developer Program

- [ ] Active **Apple Developer Program** membership ($99/year)
- [ ] Team ID + Apple ID linked
- [ ] Bundle ID `com.essealabs.visora` registered in [developer.apple.com](https://developer.apple.com/account)
- [ ] Capabilities enabled on App ID:
  - [ ] Background Modes — Audio (matches `UIBackgroundModes: ['audio']`)
  - [ ] Sign In with Apple (if A2 done)
  - [ ] Associated Domains (`applinks:tryvisora.com` — already in config)
  - [ ] In-App Purchase (if A1 done)
- [ ] Distribution certificate created (EAS handles this if using EAS Build)
- [ ] Provisioning profile for App Store distribution

---

## C · App Store Connect

- [ ] Create app record in [App Store Connect](https://appstoreconnect.apple.com)
  - [ ] App name: **Visora**
  - [ ] Subtitle (30 chars): e.g. *"Daily ritual for becoming"*
  - [ ] Primary category: **Health & Fitness** or **Lifestyle**
  - [ ] Secondary category: optional
  - [ ] Bundle ID: `com.essealabs.visora`
  - [ ] SKU: anything unique (e.g. `visora-001`)
- [ ] Age rating questionnaire completed (likely 4+)
- [ ] Pricing & Availability (territories, paid/free)
- [ ] App Information:
  - [ ] **Privacy Policy URL** (REQUIRED — currently `example.com/privacy` in app)
  - [ ] Support URL
  - [ ] Marketing URL (optional)
- [ ] App Store version metadata:
  - [ ] Description (max 4000 chars)
  - [ ] Promotional text (max 170 chars, editable without re-submission)
  - [ ] Keywords (max 100 chars total, comma-separated)
  - [ ] Copyright string
  - [ ] What's New in this Version (max 4000 chars)
- [ ] Banking & tax forms (if A1 done)

---

## D · Visual assets

- [ ] **App icon** 1024×1024 PNG (no transparency, no rounded corners, sRGB)
  - Current `assets/images/icon.png` is 384KB — verify dimensions
  - Expo generates the other sizes automatically
- [ ] **Screenshots** (required, JPEG or PNG, RGB, sRGB)
  - [ ] 6.9" (iPhone 16 Pro Max / 1320×2868) — 3-10 screenshots, **required**
  - [ ] 6.5" (iPhone 11 Pro Max / 1242×2688) — required as backup
  - [ ] 5.5" (iPhone 8 Plus / 1242×2208) — optional but improves search
- [ ] **App Preview** video (optional, 15-30s, .mov/.mp4)
- [ ] Screenshot content recommendations:
  - [ ] Home tab (ritual card + affirmations + daily wisdom)
  - [ ] Vision board (with filled visions)
  - [ ] Capture-win sheet
  - [ ] Ritual playing
  - [ ] Vision detail with linked wins
- [ ] Marketing copy / taglines on screenshots (designed in Figma/Pencil before uploading)

---

## E · Privacy & permissions

- [ ] **Privacy Policy** published and reachable (REQUIRED before submission)
  - Currently links to `example.com/privacy` — replace
- [ ] **Terms of Service** published (REQUIRED if paywall is present)
- [ ] **Apple App Privacy questionnaire** in App Store Connect:
  - [ ] Data collected? (photos for vision board — stored on device only)
  - [ ] Data linked to identity? (yes once auth wired)
  - [ ] Data used for tracking? (likely no — confirm)
- [ ] Permission usage strings in `app.config.ts`:
  - [x] `NSPhotoLibraryUsageDescription` (already set)
  - [x] `NSPhotoLibraryAddUsageDescription` (already set)
  - [ ] `NSUserTrackingUsageDescription` (only if you add ATT — typically not needed)
- [ ] Encryption export compliance (`usesNonExemptEncryption: false` — already set)

---

## F · In-app purchases (if A1 done)

- [ ] Create IAP products in App Store Connect:
  - [ ] **Yearly subscription** — auto-renewable, $69.99 (matches paywall display)
  - [ ] **Monthly subscription** — auto-renewable, $9.99
  - [ ] Subscription group (e.g. "Visora Full Access")
- [ ] Product IDs match what RevenueCat expects (e.g. `visora.yearly`, `visora.monthly`)
- [ ] Localized display names + descriptions for each product
- [ ] App Store promotional images per product (optional)
- [ ] 7-day free trial introductory offer configured (matches paywall copy)
- [ ] **Demo account & instructions** for App Review (since paywall gates Home access — explain how to test or provide a coupon)

---

## G · Build & TestFlight

- [ ] EAS configured (`eas.json`) — production profile
- [ ] `EAS_PROJECT_ID` in `.env` after running `eas init`
- [ ] Run a production build: `eas build --platform ios --profile production`
- [ ] Upload to TestFlight (automatic after build) or via Transporter
- [ ] Internal TestFlight with team for QA
- [ ] External TestFlight beta (optional — invites up to 10,000 testers)
- [ ] At least one full E2E test on a real device:
  - [ ] First launch → onboarding → home
  - [ ] Ritual plays audio end-to-end
  - [ ] Vision creation with photo
  - [ ] Capture win with photo
  - [ ] Reload app — onboarding state persists
  - [ ] Subscription purchase flow (use sandbox account)
  - [ ] Sign out (when A5 done)

---

## H · App Review compliance

- [ ] **Apple's 4.2 (Minimum Functionality)**: app does more than a single utility — Visora is fine (multi-feature wellness app)
- [ ] **Apple's 3.1.1 (In-App Purchase)**: subscription must be IAP, not external billing
- [ ] **Apple's 3.1.2 (Subscriptions)**: paywall must clearly state:
  - [ ] Length of trial
  - [ ] Price after trial
  - [ ] Renewal terms
  - [ ] Auto-renewal note
  - [ ] Link to Privacy Policy + Terms
- [ ] **Apple's 5.1.1 (Data Collection)**: clear in-app explanation when permissions requested
- [ ] **Apple's 5.1.5 (Location, Health, etc)**: N/A unless we add location
- [ ] No placeholder text/Lorem Ipsum
- [ ] No broken links
- [ ] No links to other platforms ("Get it on Android" — don't)
- [ ] No mention of beta / coming soon (except in "What's New")
- [ ] Demo video for App Review if paywall first (required if reviewer can't test without paying)
- [ ] App Review notes: explain test account, how to bypass paywall for review, location of any special features

---

## I · Pre-submission final pass

- [ ] All "Coming soon" / "in a future update" Alerts removed or implemented
- [ ] All dead code paths deleted (orphan onboarding screens, `_dev/` folder)
- [ ] Console logs that leak debug info removed
- [ ] Sentry + PostHog wired (so you catch crashes in the wild)
- [ ] Build & install fresh on a clean device (no AsyncStorage state) — test the full first-time-user experience
- [ ] App icon renders correctly on iOS home screen
- [ ] Splash screen transitions cleanly to welcome
- [ ] No layout breaks on iPhone SE (or accept it's not supported — declare in App Store Connect)
- [ ] Voiceover / accessibility labels on key buttons (Apple gives soft pushback if completely missing)
- [ ] App passes "airplane mode" test (graceful when no network)

---

## J · Post-launch

- [ ] Set up App Store optimization (ASO) — title keywords, description, screenshots
- [ ] Monitor Sentry / crash reports
- [ ] Monitor App Store Connect for first reviews
- [ ] Reply to negative reviews (significantly affects discoverability)
- [ ] App Store Connect → Analytics for installs, retention, subscription metrics
- [ ] RevenueCat dashboard for subscription health
- [ ] Plan next version: which user-feedback items make it into v0.14, v0.15

---

## Recommended order

**Week 1 — Core blockers** (A1, A2, A3, A6, A11, env keys, real privacy URLs)

**Week 2 — Polish & cleanup** (A4 or remove, A9, A10, regenerate audio after July 3 = A7+A8+A12)

**Week 3 — Submission assets** (Section D — screenshots, icon verify, App Store Connect record, IAP products)

**Week 4 — TestFlight + submission** (Section G, fix anything beta surfaces, submit to App Review)

App Review turnaround is typically 24–72 hours but plan a week buffer for any back-and-forth.
