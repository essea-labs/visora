# Innerproof — Architecture

**Status:** Build-ready blueprint
**Last updated:** 2026-05-04
**Product name:** Innerproof
**Method (framework):** The Anchor Method
**Domain:** innerproof.app
**Bundle ID:** com.essealabs.innerproof

This document is the bridge between [SPEC.md](SPEC.md) (product) and the actual code. Where SPEC says *what*, this says *how*.

---

## 0. References

| Source | What's there |
|---|---|
| [SPEC.md](SPEC.md) | Product spec — features, monetization, copy rules. **Source of truth where it disagrees with handoff.** |
| [handoff/02-architecture.md](Manifestation App - Claude Design/handoff/02-architecture.md) | Designer's recommended stack, data model, sync model |
| [handoff/03-design-system.md](Manifestation App - Claude Design/handoff/03-design-system.md) | Tokens, typography, motion |
| [handoff/04-components.md](Manifestation App - Claude Design/handoff/04-components.md) | Component primitives with native-port specs |
| [handoff/05-screens.md](Manifestation App - Claude Design/handoff/05-screens.md) | Screen-by-screen spec |
| [handoff/06-interaction-map.md](Manifestation App - Claude Design/handoff/06-interaction-map.md) | Navigation graph, gestures, edge states |
| [handoff/07-copy-deck.md](Manifestation App - Claude Design/handoff/07-copy-deck.md) | All copy (needs gender-neutral pass per SPEC §8) |

---

## 1. Principles & key decisions

### Principles
1. **Native-iOS-first.** The cinematic ritual demands it. Android is a Phase 2 rewrite.
2. **Lean MVP.** No frameworks we don't need. SwiftUI + SwiftData + Supabase SDK + RevenueCat. That's it.
3. **Offline-first writes.** Wins capture works on a plane. Sync is best-effort.
4. **Pre-baked audio.** The morning ritual cannot have a spinner at 7am. Audio is generated the night before and pre-fetched on device.
5. **Server-enforced privacy.** Witness visibility, identity-statement access, vision-board ownership — all enforced by RLS, never trusted to the client.
6. **Hard paywall after trial.** Locks ritual access; archive remains read-only. No dark patterns elsewhere.

### Locked technical decisions

| Decision | Choice | Why |
|---|---|---|
| Mobile stack | **Expo (React Native)** | Aligns with Mobile Playbook two-track workflow + Replay precedent; unblocks dev during Apple Developer enrollment; Android Phase 2 free. See Appendix D for polish mitigations. |
| iOS minimum | **iOS 16.0** | RN Fabric + Reanimated 3 work well on 16; small reach gain over 17. |
| Android minimum (Phase 2) | **Android 13 (API 33)** | Modern enough for Reanimated worklets + photo picker. |
| UI framework | **React Native (New Architecture / Fabric)** | Bridgeless renderer; better animation parity with native. |
| Navigation | **Expo Router (file-based)** | Type-safe, deep-linkable, minimal boilerplate. |
| State management | **Zustand + React Query** | Zustand for app state; React Query for Supabase data fetching/caching. No Redux. |
| Local persistence | **MMKV** for key-value + **expo-sqlite** for relational | MMKV for tokens/flags (fast); SQLite for offline win cache. |
| Animation | **Reanimated 3 + react-native-skia** | Worklets on UI thread, 60fps for orb + register transitions. |
| Auth tokens | **expo-secure-store** (Keychain on iOS) | Standard secure storage. |
| Backend | **Supabase** (Postgres + auth + storage + edge functions) | Unchanged from prior plan. JS SDK is the same one RN uses. |
| Auth provider | **Sign In with Apple only** | via `expo-apple-authentication`. Frictionless; no email/password. |
| Subscriptions | **RevenueCat** via `react-native-purchases` | Same SDK shape as Swift; identical billing semantics. |
| Crash reporting | **Sentry** via `@sentry/react-native` | Generous free tier (5K errors/month). |
| Analytics | **PostHog** via `posthog-react-native` | Identity statements never logged. |
| Audio playback | **expo-av** | Mature; supports background, silent-mode override, interruptions. See Appendix D for sync mitigations. |
| LLM provider | **None for MVP.** No per-user generation. | The "Today, I will…" line is captured from the user during R04, not LLM-generated. |
| Ritual audio | **One pre-recorded MP3** (~90s), bundled in app | Per SPEC §6.1 / §9.4. No per-user generation, no nightly cron. Recording done once via ElevenLabs library voice. |
| Edge function runtime | **Deno + TypeScript** | Supabase native. Unchanged from prior plan. |
| Background work | **None required for ritual.** Audio is bundled. | Optional later: `expo-task-manager` for low-priority sync. |
| Image loading | **expo-image** with disk cache | Replaces native AsyncImage; better caching + fade-in. |
| Push notifications | **expo-notifications** + APNs | Same APNs delivery as native iOS. |
| Universal Links | **expo-linking** | Witness invites; same iOS plumbing under the hood. |
| Photo picker | **expo-image-picker** | Wraps PHPicker on iOS. |
| Keyboard handling | **react-native-keyboard-controller** | Replaces buggy `KeyboardAvoidingView`. See Appendix D. |
| Gesture handling | **react-native-gesture-handler v2** | Long-press, swipe-down dismiss. Tuned thresholds in Appendix D. |
| Build / distribution | **EAS Build + EAS Submit** | Cloud-built dev/preview/production; OTA updates via EAS Update. |
| Bundle ID | **com.essealabs.innerproof** | Reserve in App Store Connect. |
| Code signing (iOS) | **Apple Developer ($99/yr)** | Required for TestFlight + App Store. Not blocking JS/UI dev work via Expo Go. |

---

## 2. Repo layout

```
Manifestation App/
├── SPEC.md                              # product spec (locked)
├── ARCHITECTURE.md                      # this doc
├── Manifestation App - Claude Design/   # design canvas + handoff (read-only reference)
│
├── mobile/                              # Expo project root (Phase A.1)
│   ├── app.config.ts                    # Expo config (bundle ID, plugins, EAS)
│   ├── eas.json                         # EAS Build profiles (dev, preview, production)
│   ├── package.json
│   ├── tsconfig.json
│   ├── app/                             # Expo Router file-based routes
│   │   ├── _layout.tsx                  # root layout, providers
│   │   ├── (onboarding)/                # 11 beats grouped
│   │   │   ├── welcome.tsx
│   │   │   ├── method.tsx
│   │   │   ├── …
│   │   │   └── ready.tsx
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx              # tab bar
│   │   │   ├── today.tsx
│   │   │   ├── vision.tsx
│   │   │   └── wins.tsx
│   │   ├── ritual.tsx                   # full-screen ritual modal
│   │   ├── witness/[id].tsx             # witness feed + invite-accept
│   │   ├── premium.tsx                  # paywall
│   │   └── settings.tsx
│   ├── src/
│   │   ├── core/                        # cross-cutting infra
│   │   │   ├── models/                  # TypeScript types matching Supabase schema
│   │   │   ├── persistence/             # MMKV + expo-sqlite wrappers
│   │   │   ├── networking/              # Supabase client, edge-function wrappers
│   │   │   ├── audio/                   # RitualPlayer (expo-av) + beat scheduler
│   │   │   ├── subscription/            # RevenueCat wrapper, paywall gates
│   │   │   ├── auth/                    # Apple sign-in, deferred-login state machine
│   │   │   ├── analytics/               # PostHog wrapper, event spec
│   │   │   └── notifications/           # expo-notifications setup
│   │   ├── features/
│   │   │   ├── onboarding/              # screen components, hooks, copy
│   │   │   ├── today/
│   │   │   ├── vision/                  # board, player, detail, creation
│   │   │   ├── wins/                    # archive, capture, detail, search
│   │   │   ├── witness/
│   │   │   ├── ritual/
│   │   │   ├── settings/
│   │   │   └── premium/
│   │   ├── ui/
│   │   │   ├── components/              # BreathingOrb, Slip, VisionPhoto, IdentityCard, AreaPill, TabBar…
│   │   │   ├── tokens/                  # colors.ts, typography.ts, spacing.ts, motion.ts
│   │   │   └── hooks/                   # useRegister, useBreathing, etc.
│   │   └── test/
│   │       ├── fixtures/                # User.fixture(.firstRun), VisionBoard.fixture(.career)
│   │       └── snapshots/               # snapshot tests for 6 hero screens
│   ├── assets/
│   │   ├── fonts/                       # General Sans
│   │   ├── images/                      # app icon, splash
│   │   ├── audio/
│   │   │   └── ritual.mp3               # the bundled 90-second VO
│   │   └── stock/                       # ~200 curated photos (or fetched from CDN)
│   └── ios/ + android/                  # native projects (managed by Expo prebuild; usually .gitignored)
│
├── backend/                             # Supabase project files
│   ├── migrations/                      # SQL migrations applied via supabase db push
│   │   ├── 0001_initial_schema.sql
│   │   ├── 0002_rls_policies.sql
│   │   ├── 0003_indexes_triggers.sql
│   │   └── 0004_pg_cron.sql
│   ├── functions/                       # Deno/TypeScript edge functions
│   │   ├── pair-witness/
│   │   │   └── index.ts
│   │   ├── notify-witness-win/
│   │   │   └── index.ts
│   │   └── revenuecat-webhook/
│   │       └── index.ts
│   ├── seed/                            # data seeds
│   │   └── photo_library.sql
│   └── README.md                        # how to apply migrations / deploy functions
│
├── content/                             # canonical copy + curated assets
│   ├── copy/
│   │   ├── tagline-shortlist.md
│   │   ├── sacred-phrases.md
│   │   ├── onboarding.md
│   │   ├── notifications.md
│   │   └── settings.md
│   ├── photos/
│   │   └── manifest.json                # Unsplash photo IDs by area
│   └── quotes/
│       └── library.json                 # daily quote library (target 365)
│
└── landing/                             # marketing landing page
    ├── index.html
    └── assets/
```

---

## 3. Mobile architecture (Expo / React Native)

### 3.1 Module organization

The app uses **feature folders** under `src/features/`. Each feature contains its screen components, hooks, and feature-local types. Cross-cutting code lives in `src/core/`.

Routing is **file-based** via Expo Router (`app/` directory). Each route is a `.tsx` file; route params are typed via search params or path params. The folder layout in §2 shows the canonical structure.

### 3.2 State management

**Zustand** for app state (auth, tier, ritual progress) + **React Query** for server data (vision boards, wins, witness feed). No Redux, no Context-based stores.

```ts
// src/core/auth/useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/core/persistence/mmkv';

type Tier = 'anonymous' | 'trial' | 'paid' | 'expired';

interface AuthState {
  userId: string | null;
  tier: Tier;
  tierExpiresAt: string | null;
  setSession: (userId: string, tier: Tier, expiresAt: string | null) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      tier: 'anonymous',
      tierExpiresAt: null,
      setSession: (userId, tier, tierExpiresAt) =>
        set({ userId, tier, tierExpiresAt }),
      signOut: () =>
        set({ userId: null, tier: 'anonymous', tierExpiresAt: null }),
    }),
    { name: 'auth', storage: createJSONStorage(() => mmkvStorage) }
  )
);
```

```ts
// src/features/vision/useVisionBoards.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/core/networking/supabase';

export function useVisionBoards() {
  return useQuery({
    queryKey: ['visionBoards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vision_boards')
        .select('*, vision_photos(*)')
        .is('archived_at', null)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}
```

### 3.3 Navigation

**Expo Router** — file-based, type-safe, deep-linkable. Layout at `app/_layout.tsx`. Tab bar at `app/(tabs)/_layout.tsx`. Modals (Ritual, Witness, Premium, Capture) are rendered as full-screen modal stacks via `presentation: 'modal'`.

The **Morning Ritual** at `app/ritual.tsx` is presented modally and sealed (no header, no swipe-down dismiss until R05). The **Witness** screen at `app/witness/[id].tsx` is also modal.

### 3.4 Persistence

Two-layer local store:

| Layer | Lib | Used for |
|---|---|---|
| Fast key-value | **MMKV** (`react-native-mmkv`) | Auth tokens, tier flag, last-known intention, feature flags |
| Relational cache | **expo-sqlite** | Wins archive (offline-first), vision boards, witness pair |

Reads come from local cache first, then refresh from Supabase (React Query handles this). Writes optimistic-update local cache; sync to Supabase via background queue. On conflict (rare; wins are immutable after 5 min, vision-board edits are last-write-wins), local wins.

### 3.5 Networking

**`@supabase/supabase-js`** — same SDK Inner Maps uses. Wrapped in a singleton at `src/core/networking/supabase.ts`.

```ts
// src/core/networking/edge-functions.ts
import { supabase } from './supabase';

export async function pairWitness(inviteToken: string) {
  const { data, error } = await supabase.functions.invoke('pair-witness', {
    body: { token: inviteToken },
  });
  if (error) throw error;
  return data.pair;
}
```

### 3.6 Audio playback

**`expo-av`** plays the bundled `assets/audio/ritual.mp3`. Beat transitions are driven by **a wall-clock schedule pegged to `play()` start time** rather than polling — see Appendix D §D.1 for why and how.

```ts
// src/core/audio/RitualPlayer.ts
import { Audio } from 'expo-av';

export const BEAT_BOUNDARIES = {
  settle:   0,
  breathe:  15_000,
  picture:  35_000,  // identity statement appears on screen
  anchor:   70_000,  // intention input appears
  sendOff:  85_000,
  end:      90_000,
};

export class RitualPlayer {
  private sound: Audio.Sound | null = null;
  private startedAt: number = 0;
  private timeouts: NodeJS.Timeout[] = [];

  async play(onBeat: (beat: keyof typeof BEAT_BOUNDARIES) => void) {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
    });
    const { sound } = await Audio.Sound.createAsync(
      require('@/assets/audio/ritual.mp3'),
      { shouldPlay: true }
    );
    this.sound = sound;
    this.startedAt = Date.now();

    // Pre-schedule all beat transitions pegged to startedAt
    Object.entries(BEAT_BOUNDARIES).forEach(([beat, offset]) => {
      const t = setTimeout(() => onBeat(beat as keyof typeof BEAT_BOUNDARIES), offset);
      this.timeouts.push(t);
    });
  }

  async stop() {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
    await this.sound?.unloadAsync();
    this.sound = null;
  }
}
```

Background audio: enabled via `staysActiveInBackground: true`. Interruptions (phone call) handled via `setOnPlaybackStatusUpdate` — see Appendix D §D.6.

### 3.7 Background fetch

**Not required for MVP.** Ritual audio is bundled in the app via Expo asset bundling — no fetch at runtime. If dynamic audio variants ship later, use `expo-task-manager` + EAS Update for OTA delivery.

---

## 4. Backend architecture (Supabase)

### 4.1 What lives where

| Concern | Where |
|---|---|
| User profiles, vision boards, wins | Postgres (RLS-secured) |
| Photo uploads | Supabase Storage (`user-photos` bucket) |
| Ritual audio | **Bundled in app binary** — single MP3, same for all users |
| Curated photo library | Supabase Storage (`library-photos` bucket; public read) |
| Subscription state | RevenueCat (canonical), mirrored to `profiles.tier` via webhook |
| Push notifications | APNs (morning reminder, witness wins, re-engagement) |

### 4.2 Edge functions (overview)

| Name | Trigger | What it does |
|---|---|---|
| `pair-witness` | HTTP (called by iOS) | Validate invite token, create symmetric WitnessPair, notify both users |
| `notify-witness-win` | DB trigger on `wins` insert with `visibility='witness'` | Send batched push to paired witness |
| `revenuecat-webhook` | RevenueCat webhook | Mirror tier changes to `profiles.tier` |

Detail in §6. **No ritual-generation function** — the ritual audio is bundled in the app on install.

### 4.3 pg_cron schedule

No cron schedule required for ritual audio. Optional jobs (post-MVP):

```sql
-- Optional: daily re-engagement check for inactive users (post-MVP)
-- SELECT cron.schedule('reengagement-check', '0 12 * * *', $$ ... $$);
```

---

## 5. Database schema

Full SQL in [backend/migrations/0001_initial_schema.sql](backend/migrations/0001_initial_schema.sql). Summary:

### Core tables

```
auth.users           (Supabase-managed)
public.profiles      (1:1 with auth.users — app-specific fields)
public.vision_boards (n per user; one per area+season)
public.vision_photos (3-5 per board)
public.wins          (chronological, immutable after 5 min)
public.witness_pairs (0 or 1 active per user; symmetric)
public.ritual_sessions (one row per completed/skipped ritual; tracks intention + completion)
public.photo_library_assets (curated stock; public read)
```

### Key invariants enforced in DB

- **Vision board has 3-5 photos** — CHECK constraint via trigger
- **Win is immutable after 5 min** — UPDATE trigger blocks writes after `created_at + 5min`
- **One active witness pair per user** — partial unique index
- **Identity statement starts with "I am"** — CHECK constraint
- **Vision board name length 2-80 chars** — CHECK constraint
- **Win body length 4-500 chars** — CHECK constraint

### RLS policies (summary)

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | self only | self only | self only | (no — soft delete via `deleted_at`) |
| `vision_boards` | self only | self only | self only | self only (soft) |
| `vision_photos` | self (via board ownership) | self | self | self |
| `wins` | self + paired witness if `visibility='witness'` | self | (blocked by trigger after 5min) | self (soft) |
| `witness_pairs` | both members | edge function only | edge function only | both members (ends pair) |
| `ritual_sessions` | self only | self (insert on completion) | self only (within 5 min) | (none) |
| `photo_library_assets` | all authenticated | service role only | service role only | service role only |

Witness can SEE wins where `visibility='witness' AND user_id IN (paired user)`. Server-enforced — never trust client.

---

## 6. Edge functions (specs)

### 6.1 `pair-witness`

**Trigger:** HTTP from iOS app.

**Input:** `{ "invite_token": string }`

**Purpose:** Validate invite token and create symmetric pair.

**Algorithm:**
1. Look up `witness_invites.token = input.invite_token`.
2. Validate: not expired, not already accepted, inviter still has no active pair.
3. Verify caller (the recipient) also has no active pair.
4. Insert two `witness_pairs` rows (A→B and B→A, or single row with both user IDs — single row via partial unique index).
5. Mark invite accepted.
6. Send "they accepted" push to inviter.
7. Return pair info.

### 6.2 `notify-witness-win`

**Trigger:** Postgres AFTER INSERT trigger on `wins` where `visibility='witness'`.

**Purpose:** Notify the paired witness, batched to avoid spam.

**Algorithm:**
1. Look up paired witness via `witness_pairs`.
2. Check `notification_batches` table: if a batch was sent in last 4 hours, append to existing batch.
3. Otherwise schedule push for now.
4. Push copy: *"{user_first_name} kept something — Just for you to see."*

### 6.3 `revenuecat-webhook`

**Trigger:** RevenueCat webhook on subscription state change.

**Purpose:** Mirror tier to `profiles.tier`.

**Algorithm:**
1. Verify webhook signature.
2. Map RevenueCat event to internal tier:
   - `INITIAL_PURCHASE` / `RENEWAL` → `paid`
   - `CANCELLATION` → keep `paid` until `expiration_at_ms`
   - `EXPIRATION` → `expired` (paywall hard-locks ritual; archive remains read-only)
   - `INTRO_TRIAL_STARTED` → `trial`
3. UPDATE `profiles SET tier = ?, tier_expires_at = ? WHERE id = ?`.

---

## 7. Authentication

### 7.1 Sign In with Apple flow

```
First-run app launch
  ├── No session in Keychain → onboarding O01-O08 plays anonymously
  │     Vision board built in local SwiftData; no server persistence yet.
  │
  └── At end of O08 (photos selected, "Continue with N" tapped):
        1. Show Apple Sign In sheet
        2. User taps Apple button → AuthorizationController returns identity token
        3. Send token to Supabase: client.auth.signInWithIdToken(provider: .apple, idToken: token)
        4. Supabase creates auth.users row + session
        5. Trigger creates profiles row
        6. iOS POSTs vision board (with photos) to server
        7. Server creates vision_board + vision_photos rows (with user_id)
        8. Local SwiftData updates with returned IDs
        9. App proceeds to O09 reveal
```

**Why deferred:** the cosmic onboarding flow shouldn't be interrupted by an auth screen. By the time we ask for sign-in, the user has built something — they're committed.

### 7.2 Subsequent launches

- App reads session from Keychain (Supabase SDK handles this)
- Refresh token if expired
- Skip onboarding; route to Today

### 7.3 Sign-out

- Settings → Quiet exit → confirmation modal → `client.auth.signOut()` → clear local SwiftData → return to O01

### 7.4 Account deletion (legal req)

- Settings → Account → Delete
- Confirmation modal with 7-day recovery window
- Soft-delete: `profiles.deleted_at = now()`, RLS hides all data
- Cron after 7 days: hard-delete (DELETE CASCADE on profiles → boards → photos → wins; auth.users delete via admin API)

---

## 8. Subscriptions & paywall

### 8.1 Tier states

```
anonymous       — pre-signin (during O01-O08); local-only, no server data
trial           — signed in, 7-day Apple intro offer active
paid            — active subscription
expired         — past trial or canceled & expired
```

### 8.2 Trial flow

1. User signs in at end of O08 → server creates `profiles` row with `tier='trial', tier_expires_at=now()+7days`.
2. App shows Apple subscription sheet (StoreKit 2 `Product.purchase`) with intro offer (7-day free).
3. RevenueCat tracks; webhook mirrors to `profiles`.
4. Day 4: soft prompt at end of Today screen — *"You've shown up 3 mornings. There's more here when you're ready."*
5. Day 7: trial expires.
6. Day 8: hard paywall. Ritual locked; tapping shows paywall sheet. Archive remains read-only.

### 8.3 Hard paywall enforcement

```swift
// Core/Subscription/SubscriptionGate.swift
@Observable
final class SubscriptionGate {
    var tier: Tier = .anonymous
    
    var canStartRitual: Bool {
        tier == .trial || tier == .paid
    }
    
    var canCreateNewBoard: Bool {
        tier == .trial || tier == .paid
    }
    
    var canCaptureWin: Bool {
        tier == .trial || tier == .paid
    }
    
    var archiveIsReadOnly: Bool {
        tier == .expired
    }
}
```

Each feature checks the gate before its primary action. Tapping a locked action presents the paywall sheet.

### 8.4 RevenueCat configuration

- Single offering: `default`
- Two products: `innerproof_monthly` ($2.99/mo, 7-day intro) + `innerproof_yearly` ($24.99/yr, 7-day intro)
- Configured in App Store Connect; mirrored in RevenueCat dashboard

---

## 9. Audio model

The ritual audio is **one MP3, ~90s, same for every user**, recorded once and bundled in the iOS app binary at build time. There is no server pipeline, no per-user generation, no LLM, no cron.

### 9.1 Asset

- `Anchor/Resources/ritual.mp3` — 90 seconds, ~1MB at 96kbps mono
- Recorded once via ElevenLabs library voice export OR a one-shot human VO session (decision pending in SPEC §13)
- Bundled in app binary on every install — no download, no fetch, no cache invalidation
- Updates ship with new app versions only

### 9.2 Beat timing

Beat boundaries are **fixed constants** in `RitualPlayer.swift` (same audio for everyone):
```
settle:   0–15s
breathe:  15–35s
picture:  35–70s   ← user's identity statement displayed on screen during this beat
anchor:   70–85s   ← intention input field appears
send_off: 85–90s
```

iOS schedules visual transitions on `AVAudioPlayer.currentTime` reaching each cumulative boundary.

### 9.3 Personalization (on-screen, not in audio)

| Beat | What's on screen | Source |
|---|---|---|
| Picture (35–70s) | User's identity statement | `VisionBoard.identityStatement` from local SwiftData |
| Anchor (70–85s) | Intention input field, prefilled with yesterday's value if any | User types or accepts; saved to `RitualSession.intention` on Send-off |

The audio has built-in pauses during Picture and Anchor. Users read silently / type during the pauses.

### 9.4 Failure modes & fallbacks

| Failure | Behavior |
|---|---|
| Audio file missing from bundle | Should never happen (bundled); if it does, silent ritual: orb + on-screen beat text + chimes |
| Network down | No impact — everything is local |
| User backgrounds during ritual | Pause; resume within 60s; abort after; mark `skipped` |

---

## 10. Witness pairing

### 10.1 Universal Links

Domain: `innerproof.app` (or final domain choice).

`apple-app-site-association` file:
```json
{
  "applinks": {
    "details": [{
      "appIDs": ["TEAMID.com.essealabs.innerproof"],
      "components": [{ "/": "/witness/invite/*" }]
    }]
  }
}
```

### 10.2 Invite flow

```
Inviter on Witness screen with no pair
  └── Tap "Invite one person"
        └── App generates witness_invites row with token
              └── iOS Share sheet pre-fills:
                    "I'd like you to witness the small things.
                     innerproof.app/witness/invite/<token>"
              └── User shares via iMessage/SMS/email/etc.

Recipient receives link
  └── If app installed: tap → opens Innerproof → witness/invite/accept screen
  │     ├── If recipient has account → pair-witness function
  │     └── If recipient is new → onboard first → then pair
  └── If app not installed: tap → App Store → install → universal link resumes flow on first launch
```

### 10.3 Notification flow

When inviter has paired buddy capture a `witness`-visible win:
1. Postgres trigger fires `notify-witness-win`
2. Function batches with any other witness wins from last 4h
3. Schedules push at end of 4h window or immediately if first

---

## 11. Sync & offline

### 11.1 Write strategy (optimistic, local-first)

| Object | Local immediate | Server sync | Conflict |
|---|---|---|---|
| Win | ✓ insert into SwiftData | ✓ background URLSession; retries on failure | last-write-wins (rare; immutable after 5min anyway) |
| Vision board edit | ✓ | ✓ | last-write-wins |
| Vision board create | local-anonymous → committed at sign-in | committed at sign-in | n/a |
| Ritual completion | ✓ | ✓ fire-and-forget | n/a |

Photos: upload to Supabase Storage on background URLSession. Reference URL in DB once upload completes. Until then, local file path.

### 11.2 Read strategy

- App start → fetch from local SwiftData (instant render)
- In parallel → refresh from Supabase, merge updates
- Witness feed (network only) → show kind empty state if offline

### 11.3 Audio caching

- Generated ritual audio: cached in Caches dir; survives until iOS evicts (low memory) or 7-day cron deletes server-side
- Curated library photos: cached in NSCache + disk; rotate weekly via manifest version

---

## 12. Privacy & PII

### 12.1 What's PII

- **Identity statements** (extra-sensitive — never log, never include in analytics events)
- **Win bodies** (sensitive)
- **Vision board names** (sensitive)
- **Photos** (sensitive)
- Email is in Apple-managed `auth.users.email` (often Apple's relay address — never user's real email)

### 12.2 Logging rules

```
NEVER log:
  - identity_statement (any source)
  - win.body
  - vision_board.name
  - photo URLs (path → user_id leakage)

ALLOWED to log:
  - user_id (UUID, opaque)
  - timestamps
  - feature names ("ritual_completed", "win_captured")
  - tier
  - error categories (NOT error messages that may contain user data)
```

PostHog event payloads are reviewed via lint rule (custom Swift script in CI) that fails build if a forbidden field name appears in event properties.

### 12.3 At-rest encryption

- Supabase Storage: SSE on by default
- SwiftData on device: NSFileProtectionComplete (file unreadable when device locked)

### 12.4 Third-party data sharing

- ElevenLabs receives **only the script for the one-time ritual recording** — no per-user data ever sent (the recording happens once during dev). Not used at runtime.
- RevenueCat receives transaction data (no app content).
- PostHog receives event metadata (no PII per §12.2).

---

## 13. Analytics events

PostHog event spec. All events include common properties: `user_id`, `tier`, `app_version`, `os_version`, `timezone`.

### 13.1 Onboarding funnel

| Event | When | Properties |
|---|---|---|
| `onboarding_started` | App first open | — |
| `onboarding_beat_completed` | Each O01-O11 advance | `beat: O01..O11` |
| `vision_area_picked` | O05 | `area` |
| `vision_named` | O06 advance | `name_length` (NOT name) |
| `identity_written` | O07 advance | `length`, `starts_with_i_am: bool` |
| `photos_selected` | O08 advance | `count`, `library_count`, `upload_count` |
| `signed_in` | After O08 sign-in success | `provider: apple` |
| `vision_board_revealed` | O09 reveal complete | `area` |
| `witness_invite_sent` | O10 invite sent | — |
| `witness_skipped` | O10 skip | — |
| `morning_time_set` | O11 | `morning_time_hour` |
| `onboarding_completed` | After O11 | `total_duration_sec` |

### 13.2 Daily loop

| Event | When | Properties |
|---|---|---|
| `today_opened` | Today tab visible | `ritual_state: ready|complete|none` |
| `ritual_started` | Tap Begin morning | — |
| `ritual_beat_advanced` | Each beat boundary | `beat: settle..send_off` |
| `ritual_skipped` | Skip button tapped | `at_beat`, `at_time_sec` |
| `ritual_completed` | Send-off ends | `duration_sec` |
| `intention_edited` | Inline pencil edit | `slip_type: am|do` |
| `quote_viewed` | Today open with quote rendered | — |

### 13.3 Wins

| Event | When | Properties |
|---|---|---|
| `win_capture_opened` | Tap Add a win | — |
| `win_captured` | Send tap | `has_photo: bool`, `has_witness: bool`, `area`, `body_length` |
| `win_detail_opened` | Tap tile | — |
| `win_deleted` | Soft delete | `age_seconds` |
| `wins_searched` | Pull-to-search submit | `query_length`, `result_count` |

### 13.4 Vision

| Event | When | Properties |
|---|---|---|
| `vision_board_viewed` | Vision tab visible | `board_count` |
| `vision_player_opened` | Tap photo | `board_id` |
| `vision_detail_opened` | Tap area pill | `board_id` |
| `vision_create_started` | Tap + Add a vision | — |
| `vision_create_completed` | After reveal | `area`, `photo_count` |

### 13.5 Witness

| Event | When | Properties |
|---|---|---|
| `witness_screen_opened` | — | `pair_state: none|pending|active|ended` |
| `witness_acknowledged` | Tap a buddy win | — |
| `witness_pair_created` | Pair function success | — |
| `witness_pair_ended` | End pair | — |

### 13.6 Subscription

| Event | When | Properties |
|---|---|---|
| `paywall_shown` | Paywall sheet presented | `trigger: day_8|board_create|...` |
| `paywall_subscribed` | Purchase success | `product: monthly|yearly` |
| `paywall_dismissed` | Sheet dismissed without purchase | — |
| `trial_started` | RevenueCat webhook | `product` |
| `subscription_renewed` | Webhook | `product` |
| `subscription_canceled` | Webhook | `product`, `reason` |
| `subscription_expired` | Webhook | — |

### 13.7 Founder exclusion

Per memory note: founder distinct_id must be set in PostHog to exclude Shellena's sessions from production metrics. To be configured once distinct_id is captured (TBD — flag in Open Questions).

---

## 14. Build sequencing

The order below front-loads the highest-risk pieces (audio pipeline, sign-in, paywall) so we discover problems early.

### Phase A — Foundations (week 1)

Apple Developer is NOT blocking — Expo Go gives real-device preview without a paid account.

| # | Task | Blocked by | Output |
|---|---|---|---|
| A.1 | `npx create-expo-app` + EAS init + Expo Router scaffold | — | `mobile/` builds empty Hello-World on Expo Go |
| A.2 | Design tokens (colors, typography, spacing, motion) | — | `src/ui/tokens/*.ts` |
| A.3 | BreathingOrb component (Reanimated 3 + radial gradient) | A.2 | Storybook-style preview in `app/_dev/orb.tsx` |
| A.4 | Supabase project init + 0001 migration | Supabase keys | Schema deployed; can query via Supabase JS SDK |
| A.5 | RLS policies (0002 migration) | Supabase | All tables locked; tested with anon vs authenticated |
| A.6 | Ritual script (already done — `content/copy/ritual-script.md`) | — | ✅ |
| A.7 | Tagline + sacred-phrase rewrite (already done) | — | ✅ |
| A.8 | Domain WhoIs + TESS — innerproof.app already purchased | — | ✅ partial |

### Phase B — Auth + first-data (week 2)

| # | Task | Blocked by | Output |
|---|---|---|---|
| B.1 | Onboarding O01–O04 (welcome → loop teaser) | A.2, A.3 | First-run flow viewable on Expo Go |
| B.2 | Onboarding O05–O08 (vision creation, anonymous local) | A.2 | Vision board built in MMKV/SQLite, no server yet |
| B.3 | Sign In with Apple via `expo-apple-authentication` (dev build) | Apple Developer | Working Apple Sign In → Supabase session |
| B.4 | O09 reveal + sign-in commit (board persists to Supabase) | B.3 | Vision board on server with `user_id` |
| B.5 | Today screen scaffold (post-onboarding state) | B.4 | Tab bar + Today shell |

**Note:** B.1 + B.2 work in Expo Go (no Apple Developer needed). B.3 onward needs an EAS dev build, which needs Apple Developer.

### Phase C — Document loop (week 3)

| # | Task | Blocked by | Output |
|---|---|---|---|
| C.1 | Wins archive screen (FlatList masonry) | A.2 | Empty masonry; pull-to-search shell |
| C.2 | Win capture sheet | A.2 | Text + photo + area tag → save |
| C.3 | Win detail | A.2 | Photo-first / text-first layouts |
| C.4 | Search | C.1 | Local SQLite search + Supabase search |
| C.5 | Curated photo library | — | `content/photos/manifest.json` w/ ~200 Unsplash refs |

### Phase D — Visualize (week 4)

| # | Task | Blocked by | Output |
|---|---|---|---|
| D.1 | Record ritual audio (ElevenLabs library voice export) | ElevenLabs key + voice pick | `mobile/assets/audio/ritual.mp3` bundled |
| D.2 | Morning Ritual modal (Expo Router modal) + RitualPlayer w/ pre-scheduled beats | A.3, D.1 | Full 5-beat sequence |
| D.3 | Today CTA wiring | D.2 | Tap Begin → ritual plays |
| D.4 | Identity-on-screen + intention input during R03/R04 | D.2 | Personalization via UI |
| D.5 | Daily quote library | — | `content/quotes/library.json` (60 to start) |

### Phase E — Witness (week 5)

| # | Task | Blocked by | Output |
|---|---|---|---|
| E.1 | Witness screen scaffold | C.1 | Empty witness UI with invite affordance |
| E.2 | Universal Link via `expo-linking` + `pair-witness` function | Domain (innerproof.app ✅) | Pair flow E2E |
| E.3 | `notify-witness-win` trigger + APNs push | Apple Dev (APNs key) | Buddy gets notified when witness-visible win lands |

### Phase F — Subscriptions (week 6)

| # | Task | Blocked by | Output |
|---|---|---|---|
| F.1 | `react-native-purchases` integration + product config | RevenueCat + ASC products | StoreKit purchases work in sandbox |
| F.2 | Paywall screen | A.2 | Premium screen renders |
| F.3 | Hard-paywall gates throughout app | F.1 | Day-8 expiration locks ritual + capture |
| F.4 | RevenueCat webhook + `revenuecat-webhook` function | F.1 | Tier mirrors to DB |

### Phase G — Polish + ship (week 7–9)

| # | Task | Output |
|---|---|---|
| G.1 | Settings screen | All sections from handoff/05-screens §15 |
| G.2 | Push notification copy + scheduling via `expo-notifications` | All notification types from §6.9 of SPEC |
| G.3 | Analytics integration via `posthog-react-native` + founder exclusion | PostHog events firing |
| G.4 | Crash reporting via `@sentry/react-native` | Errors visible in dashboard |
| G.5 | Privacy policy + ToS (Termly) | Linked from Settings |
| G.6 | App icon | Multi-resolution PNGs via `expo-app-icon` plugin |
| G.7 | App Store metadata + screenshots | ASC submission-ready |
| G.8 | Landing page | Live at innerproof.app |
| G.9 | TestFlight beta + bugfix loop via EAS Submit | TestFlight build with ~10 testers |
| G.10 | App Store submission | Live |
| G.11 | **Polish-pass against Appendix D mitigations** — verify audio sync, register transitions, keyboard, gestures, cold start on iPhone 12 mini | Pass/fail per mitigation |

---

## 15. Blocked-on-accounts checklist

| Need | Blocks | Once provided |
|---|---|---|
| Apple Developer Team ID | Phase B.3 onward (Apple Sign In, push, StoreKit, TestFlight, App Store) | Required for any device testing of native features. Not blocking Phase A or Phase B.1–B.2 (Expo Go covers UI dev). |
| Supabase project URL + keys | Phase A.4, A.5; all backend; E.2 | Schema deploys in minutes. |
| ElevenLabs API key | Phase D.1 (one-time ritual recording) | Library voice export, no runtime usage. |
| RevenueCat API keys + ASC subscription products | Phase F.1–F.4 | Yes |
| PostHog project key | Phase G.3 | Yes |
| Domain (innerproof.app) | Phase E.2, G.8 | ✅ purchased |

Things I can do **right now with zero accounts**:

- Phase A.1 (Expo project scaffold) — Expo Go runs unsigned JS bundles on real devices for free
- Phase A.2 (design tokens), A.3 (BreathingOrb) — pure JS/RN
- Phase B.1 (Onboarding O01–O04) — viewable on Expo Go
- Phase B.2 (Onboarding O05–O08, anonymous local) — local persistence only
- Phase C.1–C.4 (wins archive + capture + detail + search) — local-only mode
- Phase C.5 (photo library curation), D.5 (quote library) — pure content
- Phase G.5 first draft (privacy policy via Termly questionnaire) — I draft answers
- Database schema + RLS + edge function code — already written ✅

**The Apple Developer block now only affects Phase B.3 onward.** That's ~3 weeks of pre-Apple-required work I can do today.

---

## Appendix A — Cost model at scale

Assuming 1,000 paid users by month 6:

| Line | Calculation | Monthly cost |
|---|---|---|
| Ritual audio | One-time recording cost (~$50–500); no per-user runtime cost | $0 |
| Supabase Pro (10GB DB, 100GB storage) | flat | $25 |
| RevenueCat (free up to $10K MTR; we're at ~$3K) | flat | $0 |
| PostHog (1M events free; we're at ~500K) | flat | $0 |
| Sentry (free 5K errors) | flat | $0 |
| **Total** | | **~$25/mo** |

Revenue at 1,000 users (mix 60% monthly + 40% yearly): ~$2,800/mo. Margin: ~99%.

(Previous model with per-user audio generation: ~$340/mo. Cutting per-user generation saves ~$315/mo at 1,000 users, ~$3,800/year. At 10,000 users: $38K/year saved.)

---

## Appendix B — Open architectural questions

- [ ] **PostHog founder distinct_id** — set after first build install (memory note flags this)
- [ ] **Music bed during ritual** — currently silent; if added, switch from AVAudioPlayer to AVAudioEngine
- [ ] **Voice picker UX** — single locked voice for MVP; add picker post-launch
- [ ] **Re-mapping flow** (vision board season transitions) — Phase 2; specific UI deferred
- [ ] **Sunday integration recap** — Phase 2 feature; need design + content strategy
- [ ] **Witness "ended" state** — UX details for graceful pair dissolution
- [ ] **iOS 16 fallback strategy** — currently iOS 17 minimum; revisit if telemetry shows significant pre-iOS-17 audience

---

## Appendix C — Process learnings (Inner Maps retro + Mobile Playbook)

Sources: (1) [Mobile App Development Playbook (March 20 2026)](../Mobile%20App%20Development%20Playbook%20-%20Process%20Update%20%28March%2020%202026%29.md), (2) git-log + commit pattern audit of `~/Documents/Essea Labs/Inner Maps/` (Next.js + Stripe + Supabase, shipped earlier 2026).

### C.1 Top burns from Inner Maps — and how we'll prevent each on Innerproof

| What burned on Inner Maps | Cost | Innerproof prevention |
|---|---|---|
| **Fix chains (62% of commits were fixes).** Auth swap took 10 fix commits. PDF rendering took 6. Page flashing 5+. Each fix surfaced the next race condition. Root cause: happy-path coded, edge cases discovered in prod. | 2+ weeks of "should-be-done" features still being debugged | **Edge-case audit before any auth/session/sync code lands.** List affected files, trace happy path + 4 edge cases (logged-out, expired token, concurrent tabs/devices, network drop) before writing the implementation. Commit the audit list. |
| **Session state hell.** Profile cache leaking across users. Anon session overwriting real user. localStorage vs sessionStorage confusion on redirect flows. Duplicate `restoreUserState` calls causing races. | Recurring bug class, multiple fix passes | **Innerproof has the same risk on deferred sign-in (anonymous local data → Apple Sign In commit at O09).** Single state machine for tier + auth in `Core/Auth/`; only ONE place restores session; atomic state updates; transition diagram in code comments. |
| **Stripe webhook signature failed because `STRIPE_WEBHOOK_SECRET` env var had a trailing newline.** Same pattern hit PostHog. ~12 env vars total. Each took a separate redeploy to discover. | Days lost per occurrence | **Validate all env vars on Supabase function cold-start.** Trim whitespace, log obvious format errors. RevenueCat shared-secret + APNs key + PEM newlines are the highest risk. Smoke-test webhook signature at deploy time, not first-event time. |
| **Spacing/layout bugs reaching production.** CSS changes made without visual verification. No automated visual regression until late March. | 7+ commits of "fix spacing" | **SwiftUI snapshot tests in CI on the 6 hero screens** (Today, Vision, Wins, Win Detail, Onboarding O01/O09). Tests block PRs. Cost: ~3 min CI overhead. Worth it. |
| **Scoring logic divergence.** `MiniReveal` had its own S/N calculator that diverged from `calculateResults()`. When `flip` property added to questions, only one was updated. | Silent regression for weeks | **Single source of truth for any computed value.** No copy-paste. If two screens display the same derived value, they call the same function. Code review check: "is this re-implementing logic that exists elsewhere?" |
| **Profile cache + redirect-state bugs hit users on Stripe / OAuth callback flows.** Magic link flow had separate session state from email/password. | Confusing UX, multiple auth-flow rewrites | **Innerproof: Apple Sign In only.** No magic link / OAuth alternatives = fewer flows = fewer bugs. Single auth path. |
| **No deterministic test fixtures early on** → flaky E2E. | Slow iteration | **Build deterministic fixture factories from week 1.** `User.fixture(.firstRun)`, `User.fixture(.trialDay4)`, `VisionBoard.fixture(.career)` etc. Same fixtures used in unit tests, snapshot tests, and SwiftUI previews. |

### C.2 What worked on Inner Maps — copy these patterns

- **Deterministic test fixtures** (`GOLDEN_PATH`, `CONTRASTING_PROFILE` answer sets) → reliable E2E
- **Mobile-first E2E from day one** (Pixel 5 + iPhone 12) → caught mobile bugs that desktop testing missed. Innerproof is iOS-only so this is built-in.
- **Visual regression CI-blocking** (24 screenshots × browsers) → spacing bugs cannot ship
- **Stable session persistence design** (`localStorage` cache + atomic state restoration) → complex flows handle flash-free

### C.3 Two-track workflow (adapted from the Playbook for iOS)

The Playbook prescribes two parallel tracks for the Replay app: **preview-safe (Expo Go)** for fast UI iteration + **dev-build** for native/monetization validation. Innerproof is native iOS, so the equivalent is:

| Track | What | Use for |
|---|---|---|
| **Track 1: Xcode Previews + JSX canvas** | SwiftUI `#Preview` macros + the existing JSX canvas at `Manifestation App - Claude Design/` | Onboarding copy review, layout/typography polish, screen-by-screen design QA. **Fast loop — minutes per change.** |
| **Track 2: TestFlight builds** | Real device, full native stack, RevenueCat sandbox, Apple Sign In, APNs | Subscription flows, sign-in flows, ritual audio playback, witness pair flow, push notifications. **Slower loop — hours per build.** |

**Rule (from Playbook):** subscription/StoreKit/APNs are NEVER validated in previews. Only TestFlight or simulator with sandbox account.

### C.4 Definition of Done (from Playbook)

A feature is not done until ALL of:
- [ ] UI reviewed in Xcode preview / JSX canvas (visual + copy)
- [ ] Native behavior validated in simulator or TestFlight build (if applicable)
- [ ] Paywall / subscription impact considered (if feature gates content)
- [ ] Persistence behavior confirmed (offline write, sync round-trip)
- [ ] Edge cases documented (in PR description, not just code)
- [ ] Snapshot test added if it's one of the 6 hero screens

### C.5 Release cadence

| Frequency | What |
|---|---|
| Daily | Xcode Preview + JSX canvas iteration on whatever's in flight |
| 2–3× per week | Simulator validation pass on the day's changes |
| Weekly | TestFlight build pushed (you tap through on phone) |
| End of phase | Quality gate: full E2E on TestFlight; sign-off before next phase begins |

### C.6 My commitments (from the conversation retro on 2026-05-04)

Carrying forward from the retro earlier in this build:

1. **Smaller deltas per round.** Apply changes to 1–2 screens, get reaction, then propagate.
2. **Sample lines before full rewrites.** Tone-sensitive changes (copy, voice) get a sample for alignment first.
3. **Cross-reference grep on every substantive change.** When I touch X, find every other place X appears and either fix or call out.
4. **SPEC is a draft.** Validate spec items still hold before architecting on them. (Specifically why the audio pipeline got cut, and why we switched from Swift to Expo.)
5. **Tighter responses.** No bragging tables. Let the preview do the talking.

---

## Appendix D — Expo polish mitigations

Stack switched from Swift native → Expo on 2026-05-06 to unblock dev during Apple Developer enrollment + align with the team's Mobile Playbook + free up Android Phase 2.

This appendix is the explicit list of **places where Expo loses a few points to Swift native**, and the **engineering investment** required to close each gap. Treat ritual polish as a first-class concern, not "RN handles it."

### D.1 Audio-visual beat sync precision

**The risk:** `expo-av`'s `onPlaybackStatusUpdate` fires every ~250ms in practice. If beat transitions are driven by polling, on-screen identity / intention input can land 200–300ms after the audio cue. Native `AVAudioPlayer` + `CADisplayLink` is ~16ms.

**Mitigation: pre-scheduled timeouts pegged to `play()` start time.**

```ts
// src/core/audio/RitualPlayer.ts
async play(onBeat: (beat: Beat) => void) {
  const { sound } = await Audio.Sound.createAsync(audioAsset, { shouldPlay: true });
  const startedAt = Date.now();
  const beats = [
    { name: 'settle',  at:     0 },
    { name: 'breathe', at: 15_000 },
    { name: 'picture', at: 35_000 },
    { name: 'anchor',  at: 70_000 },
    { name: 'sendOff', at: 85_000 },
    { name: 'end',     at: 90_000 },
  ];
  beats.forEach(({ name, at }) => {
    setTimeout(() => onBeat(name), at);
  });
}
```

**Acceptance criteria:** measured drift between audio cue and on-screen change <50ms on a real iPhone 12 mini.

**Test:** record screen + audio simultaneously, frame-step in QuickTime, verify the identity statement appears within ±2 frames of "your identity will appear" cue.

**Fallback:** if drift exceeds 50ms even with pre-scheduling (rare; happens on backgrounding mid-play), restart from current `positionMillis`.

### D.2 Cosmic ↔ Daylit register transitions (cross-fade with blur)

**The risk:** RN with `expo-blur` doing animated `intensity` changes can drop frames on iPhone 12 mini and older. Native SwiftUI `.blur()` is smoother on the same hardware.

**Mitigation:**
- Use **Reanimated 3** with worklets running on the UI thread.
- Pre-render blur layers at fixed intensity rather than animating intensity.
- Cross-fade two layers (Daylit + Cosmic) using `opacity`, NOT `blur intensity`.
- Use `react-native-skia` for the most demanding transitions if Reanimated alone struggles.

```ts
// src/ui/components/RegisterTransition.tsx
const opacity = useSharedValue(0);
const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,  // animated on UI thread
}));
// Cross-fade via opacity, not blur intensity
```

**Acceptance criteria:** 60fps maintained during register transitions on iPhone 12 mini. Verified via Xcode Instruments or React Native Performance Monitor.

**Fallback:** if 60fps unattainable on older devices, disable blur during the transition (instant cut between solid gradients), re-enable after transition completes. User barely notices.

### D.3 Keyboard handling during R04 (intention typing)

**The risk:** RN's built-in `KeyboardAvoidingView` is buggy (1-frame jumps, content shift desync). Native iOS handles keyboard slide cleanly.

**Mitigation:** use **`react-native-keyboard-controller`** library — provides `useReanimatedKeyboardAnimation` hook for frame-perfect content offset.

```ts
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';

const { height } = useReanimatedKeyboardAnimation();
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: height.value }],
}));
```

**Acceptance criteria:** zero visible jump when keyboard appears in R04. Tested on iPhone 12 mini, 14, 15 Pro.

### D.4 Long-press / gesture micro-feel ("Hold to play this vision")

**The risk:** RN gesture timing can feel ~5–10% different from iOS native conventions. Users habituated to iOS notice subtly.

**Mitigation:**
- **`react-native-gesture-handler` v2** with explicit `LongPress` config.
- `minDurationMs: 500` to match iOS native long-press threshold.
- Add **`expo-haptics`** feedback (`impactAsync('medium')`) on gesture-acquire.
- Cancel-on-pan-distance threshold matches iOS conventions (10pt).

```ts
const longPress = Gesture.LongPress()
  .minDuration(500)
  .maxDistance(10)
  .onStart(() => {
    runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    runOnJS(openVisionPlayer)();
  });
```

**Acceptance criteria:** side-by-side feel test on real device. If it feels "off," tune `minDuration` and `maxDistance` values until it matches the user's iOS muscle memory.

### D.5 Cold start time (JS bundle load)

**The risk:** RN cold start is typically 500–800ms slower than equivalent Swift app. The morning ritual is supposed to feel immediate.

**Mitigation stack:**
1. **Hermes engine** (default in Expo SDK 51+) — faster JS startup than JSC.
2. **RAM bundles** + minified production builds via EAS Build production profile.
3. **Splash screen IS the breathing orb.** Turn the inevitable cold-start wait into part of the ritual feel — show the orb already breathing while JS loads. User perceives "intentional pause" not "app loading."
4. **Lazy-load non-Today features.** `app/(tabs)/today.tsx` is the entry; Vision/Wins lazy-load via Expo Router's automatic code-splitting.
5. **Pre-warm** ritual audio asset on Today open (not on Begin tap).

**Acceptance criteria:** cold start to interactive Today screen <1.2s on iPhone 12 mini. Measure via `expo-insights` or manual stopwatch from icon tap to first interaction.

### D.6 Background audio resilience (phone call mid-ritual)

**The risk:** `expo-av` can lose state on certain interruptions (phone calls, ringer/silent toggle).

**Mitigation:** explicit interruption handling.

```ts
await Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
  staysActiveInBackground: true,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
  shouldDuckAndroid: true,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
});

sound.setOnPlaybackStatusUpdate((status) => {
  if (status.isLoaded && !status.isPlaying && status.didJustFinish === false) {
    // Interrupted — pause UI, save position
    pauseRitual(status.positionMillis);
  }
});
```

**Acceptance criteria:** ritual can be backgrounded, ring-silenced, and phone-called without crashing or losing position. Resume within 60s window per SPEC §6.1.

**Test matrix:**
- Background app mid-R03 → return → continues
- Receive phone call mid-R03 → end call → continues or aborts (per spec)
- Toggle silent switch mid-R02 → audio respects (we want it to play in silent mode for ritual)
- Lock screen → audio continues (background audio mode set)

### D.7 Older device performance (iPhone 12 mini and older)

**The risk:** Reanimated worklets + Skia + blur can compound to drop frames on A14-and-older chips.

**Mitigation:** define performance budget AND test on the slowest supported device every phase.

**Performance budget:**
| Metric | Target | Hard floor |
|---|---|---|
| Cold start to Today interactive | <1.2s | <2.0s |
| Ritual transitions (60fps target) | 60fps | 50fps avg |
| Win capture submit-to-confirmation | <300ms | <600ms |
| Vision board scroll | 60fps | 55fps avg |

**If any hard floor is breached on iPhone 12 mini:** disable the offending animation/blur on devices with <6GB RAM (`react-native-device-info` for detection). Graceful degradation, not crash.

### D.8 Bundle size

**The risk:** RN ships with a JS bundle + native shell. Typical Expo IPA is 30–50MB vs ~10–20MB for equivalent Swift.

**Mitigation:**
- Hermes (already default) — smaller bundle than JSC.
- Tree-shake unused deps via Metro bundler config.
- Strip debug builds.
- Use `expo-image` for image caching (no extra image lib).

**Acceptance criteria:** final production IPA <40MB. Stretch: <30MB.

(Note: bundle size has minor effect on App Store conversion. Not worth obsessing over for MVP.)

### D.9 Visual regression

**The risk:** RN style tweaks ship without visual verification (Inner Maps' #1 burn — see Appendix C).

**Mitigation:** snapshot tests on the **6 hero screens** in CI, blocking PRs.

```ts
// src/test/snapshots/today.snap.test.tsx
import { render } from '@testing-library/react-native';
import { TodayScreen } from '@/features/today/TodayScreen';
import { fixtures } from '@/test/fixtures';

it('Today screen — fully populated', () => {
  const tree = render(
    <TodayScreen user={fixtures.user.firstRun} />
  );
  expect(tree.toJSON()).toMatchSnapshot();
});
```

Cover: Today (post-onboarding), Vision board, Win Detail, Onboarding O01, Onboarding O09 (reveal), Paywall.

Run via `react-native-snapshot-tests` or Detox + `pixelmatch` image diffing on a fixed simulator.

### D.10 Hot fixes via EAS Update (advantage)

This one is **better in Expo than native** — JS code can be hotfixed via OTA update without going through App Store review.

- Critical copy fix? Push via EAS Update, live in 1–2 hours.
- Native-module change? Still requires app review (4–24h on App Store).

**Use sparingly.** OTA updates are great for tiny fixes; major flow changes still go through review for App Store policy reasons.

### D.11 Things we accept (no mitigation needed)

- ~30MB IPA size — irrelevant for paid app
- Slightly different scroll physics on FlatList edge cases — acceptable
- Subtle haptic precision differences — acceptable for MVP (revisit if user research surfaces)
- No Apple Watch / Live Activities / Widgets — not in MVP scope; add Swift extension later if needed

### D.12 Acceptance gate before Phase G ships

Before App Store submission, walk through the Appendix D checklist on iPhone 12 mini and iPhone 15 Pro:

- [ ] D.1 Audio-visual sync drift <50ms (verified via screen recording frame-step)
- [ ] D.2 Register transitions 60fps (Performance Monitor)
- [ ] D.3 Keyboard slide is zero-jump in R04
- [ ] D.4 Long-press feel matches iOS conventions
- [ ] D.5 Cold start <1.2s on iPhone 12 mini
- [ ] D.6 All interruption matrix scenarios handled
- [ ] D.7 No hard-floor performance breaches on iPhone 12 mini
- [ ] D.8 IPA <40MB
- [ ] D.9 All 6 snapshot tests passing in CI

If any item fails on iPhone 12 mini, fix or graceful-degrade before submission. If any item fails on iPhone 15 Pro, fix — no degradation acceptable on flagship.
