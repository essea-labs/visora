# Innerproof — Product Spec

**Status:** MVP Feature Spec (locked; design handoff complete)
**Last updated:** 2026-05-04
**Product name:** Innerproof
**Method (framework):** The Anchor Method
**Domain:** innerproof.app
**Tagline:** *A daily ritual for becoming.*

---

## Changelog — 2026-05-04 reconciliation pass

This SPEC was reconciled against the design-handoff package at `Manifestation App - Claude Design/handoff/` (8 docs + 24 JSX screens). Where handoff and SPEC disagreed, decisions were made deliberately.

### Locked decisions
- **Product name:** Innerproof (the app); **The Anchor Method** is the underlying framework
- **Domain:** innerproof.app (purchased 2026-05-04)
- **Tagline:** *A daily ritual for becoming.*
- **IA tabs:** Today · Vision · Wins (Home renamed Today; tab order updated)
- **Stack:** **Expo (React Native)** for MVP — iOS first, Android Phase 2 with same codebase. Switched from Swift native on 2026-05-06 to align with Mobile Playbook + unblock dev during Apple Developer enrollment. See ARCHITECTURE Appendix D for polish mitigations.
- **Backend:** Supabase for MVP (Postgres + auth + storage). Migrate components (S3, RevenueCat) when pain hits — not preemptively.
- **Auth:** Sign In with Apple only. Deferred until the first vision-board save.
- **Monetization:** 7-day free trial → **$2.99/mo or $24.99/yr** (yearly saves ~30%), hard paywall, no free tier.
- **Audience copy:** Gender-neutral throughout (overrides handoff's "she/her" voice rule).

### Design evolutions absorbed from handoff
- **Vision-board model:** A single named object with identity + 1 to 5 photos (was "collection of single-photo cards"). Users may hold multiple boards. Quarterly "season" re-mapping (post-MVP).
- **Ritual beats:** Settle (15s) → Breathe (20s) → Picture (35s) → Anchor (15s) → Send-off (5s). Total 90s.
- **Buddy → Witness:** One-way feed, single soft "seen" pulse. No nudges, no emoji, no chat. Invites still drive growth, framed in soft copy only.
- **Onboarding:** 11 beats (was 7).
- **Two visual registers:** Daylit (tabs/manage) + Cosmic (ritual/onboarding/Vision Player).
- **Brand mark:** the breathing orb.
- **Vision tab:** split into Vision Player (immersive) + Vision Detail (manage).
- Voice / motion / photography spec lives in `handoff/03-design-system.md`. SPEC references rather than duplicates.

### Removed
- Constellation visualization — dropped from MVP and roadmap
- Voice mode for win capture — text + optional photo only
- AI 3-option picker at Anchor beat — single pre-baked "Today, I will…" line
- Buddy nudge palette (emoji-based)
- Printed proof book (revisit post-launch as annual upsell)
- Free tier (replaced with 7-day trial)

### Kept despite handoff omission
- **Streak system (§6.10):** kept mechanically, but display softened — no fire emoji, no "streak" word in user-facing copy. Reads as *"7 mornings"* / *"Day 7 of practice."*
- **Daily quote (§6.11):** kept on the Today tab as the warmth layer.

### Open
- Sacred-phrase rewrite pass for gender neutrality (see §8.3).

---

## 1. Product Summary

**One-liner:** A daily 90-second ritual for becoming the future version of yourself.

**Elevator pitch:** Innerproof is a personalized daily practice that walks you through visualization, breath, and intention-setting in 90 seconds. Throughout the day, you capture small wins — proof of who you're becoming. Over months, your vision board fills in with evidence. Built for the *spiritual-but-skeptical* 25–40 crowd who want personalized practice, not another empty journaling app.

**The three-act loop:**

```
MANIFEST   →   VISUALIZE   →   DOCUMENT
(once)         (daily AM)      (all day)
```

| Act | When | What happens | Frequency |
|---|---|---|---|
| **Manifest** | Onboarding + occasional updates | Build a *vision board*: a named, photographed, identity-stated picture of who you're becoming, scoped to one life area. | Initial setup; quarterly re-mapping (post-MVP); ad-hoc additions. |
| **Visualize** | Every morning at user-set time (default 7am) | A 90-second voiced ritual: Settle → Breathe → Picture → Anchor → Send-off. The vision board breathes behind a soft cosmic field. | Daily — the atomic unit of the product. |
| **Document** | Throughout the day | Capture *wins* — small text+photo notes proving the vision is real-in-progress. Tagged to a vision area. | 0–N per day. Target: 1–3. |

**The category-of-one positioning:**
- **Not Notes** — Notes is text. We're audio + visual + ritual.
- **Not Calm/Headspace** — they don't know who you are or what you're working toward. We do.
- **Not generic manifestation apps** — they push generic content. Ours is generated from your visions.

---

## 2. Pivots

### May 2026: ritual-first
The app pivoted from **"capture-first journaling"** to **"ritual-first personalized practice."**

| Before | After |
|--------|-------|
| Open app → blank-page intention input | Open app → 90-second guided audio ritual |
| Capture-heavy, ritual-light | Ritual-heavy; capture is fuel for tomorrow's ritual |
| Generic daily quote | AI-personalized identity affirmation per user |
| Solo from day 1 | Witness pairing offered at onboarding |

**Why:** the capture-first journaling category is a graveyard (Reflectly, Stoic, Five Minute Journal — all niche). What works in this space is *passive consumption* (Calm, I Am). The wedge: **personalized passive ritual that knows you**, plus an active proof loop that makes becoming visible.

### May 4 2026: design-handoff reconciliation
Vision-board model formalized as a single named object (identity + 1 to 5 photos), buddy renamed and simplified to Witness, two visual registers (Daylit/Cosmic) introduced, breathing orb adopted as brand mark, monetization simplified to single trial-paywall tier. See Changelog above.

---

## 3. Target Audience

- **Age:** 25–40
- **Gender:** All. **All in-product copy is gender-neutral.** No "she/her" defaults; speak in second person ("you") or to the future-you ("the version of you you're becoming").
- **Life stage:** Career / relationship / identity transitions. The "what do I actually want?" phase.
- **Psychographic:** Spiritual but skeptical. Read Robbins / Dispenza / yoga literature but burnt out on woo. Want personalized practice with evidence-based framing — not toxic positivity, not aggressive paywalls.

---

## 4. The Anchor Method Framework

**Be → Do → Have** — identity-first manifestation, drawn from Dispenza / Clear / Roxie.

> You don't get the thing first and become the person. You become the person first; the actions follow; the outcome arrives.

### How the loop expresses Be → Do → Have

```
MANIFEST  (vision board: identity + photos)         → Be
VISUALIZE (morning ritual surfaces identity on screen) → Be (reinforced)
DOCUMENT  (wins captured, tagged to a vision area)  → Do → Have (proof)
```

### Two-layer model

```
VISION BOARD (one named object per life area)
  └── Identity statement ("I am someone who…")
        └── Daily ritual (today's I AM + I WILL)
              └── Wins captured (proof of becoming)
```

---

## 5. Information Architecture

**Three bottom tabs.**

```
┌─────────────────────────────────────┐
│                                     │
│   TODAY      VISION      WINS       │
│   (today)    (board)     (archive)  │
│                                     │
└─────────────────────────────────────┘
```

| Tab | Role | Add affordance |
|-----|------|----------------|
| **Today** | Daily ritual surface. Greeting, today's intentions (I AM + I WILL slips), morning ritual CTA, daily quote. | None on Today (no FAB). |
| **Vision** | The user's vision board(s). Tap a photo → Vision Player. Tap area pill → Vision Detail. | Inline "+ Add a vision" → Vision Creation. |
| **Wins** | Pinterest-masonry archive. Pull-down → Search. Tap tile → Win Detail. | Pinned bottom CTA → Capture. |

**Outside the tab bar:**
- **Settings** — top-right gear on Today
- **Witness** — bottom-right ghost button on Today, or via witness-win notification
- **Premium** — Settings → Membership row, or contextual upsells (first soft prompt on day 4, after 3 mornings)

**No center "+" tab.** Capture launches from the Wins pinned CTA.

---

## 6. MVP Feature Set

### 6.1 Morning Ritual (the heart)

**What it is:** A 90-second voice-guided experience that walks the user through identity work and intention-setting. **One pre-recorded audio track for all users** — no per-user generation, no LLM, no nightly cron. The user's specific identity statement and today's intention are rendered on-screen during the appropriate beats; the user reads/types in the pauses.

**The 90-second structure:**

| Beat | Duration | Visual | Audio (same for all users) | User action |
|------|----------|--------|------------|---|
| **R01 Settle** | 15s | Orb breathing, cosmic dim | "Take a breath. You don't have to do anything yet." | Listen |
| **R02 Breathe** | 20s | Orb + breath cue text "INHALE / EXHALE" | Breath-only, no language | Breathe |
| **R03 Picture** | 35s | Vision photo blurred behind orb; **identity statement displayed on screen** | "Picture yourself today, the way you described. Read your identity. Hear it as already true. *(long silent pause)*" | Read identity statement silently along with the audio's pause |
| **R04 Anchor** | 15s | Orb + intention input field | "What's one thing you'll do today? Just one." | **User types today's intention** (or accepts yesterday's if unchanged) |
| **R05 Send-off** | 5s | Orb pulses, soft fade-up | "Already in motion. Go." | Tap to finish |

**Audio model:**
- **One MP3 file (~90s),** ~1MB, recorded once (ElevenLabs library voice or human VO — TBD).
- Bundled with the app on install, OR fetched once from CDN and cached locally. No per-user generation.
- Same file for every user. The personalization comes from on-screen text (identity, intention) + the pauses built into the audio.

**Cost:** ~$0/user/month for audio (one-time recording cost only). Drops the previously-budgeted ~$0.30/user/month ElevenLabs spend.

**Failure modes:**
- Audio file missing/corrupt → fall back to silent ritual: orb + on-screen text + chimes per beat
- User backgrounds during ritual → pause, save position; resume within 60s; abort after
- Skip button visible after 8s → flagged `skipped: true`, ritual marked complete

**Ritual content states (graceful degradation):**

| User state | Ritual behavior |
|------------|-----------------|
| **1+ vision boards + identity** (ideal) | R03 displays user's identity statement; R04 captures user's intention input |
| **No vision** (edge: user deleted all boards) | R03 displays a generic prompt ("Picture the version of you you're becoming"). Onboarding requires at least 1 vision, so this is rare. |

---

### 6.2 Vision Tab — Vision Board

**What it is:** The visual home of becoming. A scattered collage of vision photos + identity card.

**Vision-board model:**

A vision board is a single named object the user creates and re-creates over time:

- **Area** — one of `Career | Health | Love | Finance | Joy | Custom`
- **Name** — 2–5 words, italic-sentence-cased. e.g. *"The Studio of My Own"*, *"A Body That Trusts Me"*.
- **Identity statement** — present-tense, 1–4 sentences, beginning with "I am." e.g. *"I am a sought-after designer. My calendar is mine."* This is what appears on screen during the morning ritual's R03 Picture beat (the user reads it silently while the audio pauses).
- **Photographs** — 1 to 5 images chosen from a curated library (~200 photos across 5 areas) and/or uploaded. Warm, desaturated, film-grain. Texture, not aspiration. *(Lowered from 3-min on 2026-05-08 — 1 photo is sufficient for the morning ritual visualization; users can always add more later.)*

**Multi-board:** Users may have multiple vision boards (one per area). Single tier post-trial — no board-count gating. Boards are versioned by **season**: re-mapping archives the old season and creates a new one (never overwrite). Quarterly remap flow ships post-MVP.

**Two views:**

**Vision Player (immersive):**
- Tap a board photo → fullscreen experience. Photos breathe and parallax. Identity statement reads as voice.
- Cosmic register. Tap dismiss / swipe down → return to Vision tab.

**Vision Detail (manage):**
- Tap area pill → manage screen. Daylit register.
- Sections: hero photo + name, identity card, area pill, photos rail, linked wins, "re-map this season" entry point (post-MVP).

**Add affordance:** Inline "+ Add a vision" → Vision Creation flow (§6.6).

---

### 6.3 Wins Tab — Archive

**What it is:** Pinterest-masonry archive of every win captured.

**Structure:**
- Header: "Wins" + search icon (pull-down to reveal Search)
- Masonry grid; photo-first tiles or text-only color tiles (terra/sage/amber gradient backgrounds)
- Pinned bottom CTA: "+ Add a win" → Capture
- Tap tile → Win Detail

**Win Detail:**
- Photo-first layout if photo present; text-first otherwise
- Linked-area chip ("PROOF TOWARD → The Studio of My Own") — *the loop made explicit*
- Time + witness state
- Soft delete with 5-second undo
- 5-minute edit window from capture; after that, the win is immutable (the archive is meant to be trusted as proof)

**Search:** swipe down → search by text or area chip.

---

### 6.4 Today Tab — Daily Surface

**What it is:** The user's "today" home. Where the ritual lives, where the day's intentions surface.

**Structure (top to bottom):**
1. Status bar
2. Greeting row — *"Good morning, [Name]"* + practice count (subtle, see §6.10) + avatar
3. **Ritual CTA card** — *"Begin morning · 90s"* (or *"Today's ritual ✓"* if complete)
4. Daily quote (sage card with decorative quote mark) — warmth layer
5. **Today's intentions** (populated by ritual or manually edited):
   - 1× I AM slip (amber tag) — identity statement
   - 1× TODAY, I WILL slip (terra tag) — single action
   - Each editable inline (pencil)
6. Witness ghost button (bottom-right)
7. Settings gear (top-right)
8. Tab bar

**No FAB on Today.** Capture is on Wins.

---

### 6.5 Win Capture

**What it is:** The fastest possible way to record a win. <10 seconds for text.

**Trigger:** Pinned bottom CTA on Wins tab.

**Capture sheet:**
1. **Body** — keyboard auto-focused, ≤500 chars (display warns at 280)
2. **Photo** (optional) — single image, camera or roll
3. **Area tag** (required) — one tap from area chip strip (Career / Health / Love / Finance / Joy / Custom)
4. **Witness toggle** — *"Share with witness"* off / *"Sharing with witness"* on (per-win opt-in)
5. **"Keep this"** button (terra) → returns to Wins archive (new tile fades in at top)

**Constraints:**
- Body ≥ 4 chars to send
- Area required
- Photo optional
- 5-minute edit window after send

**No voice mode.** Removed in design-handoff alignment.

---

### 6.6 Vision Creation / Editing

**Flow (4 steps):**
1. **Pick area** — single-tap chip selector (Career / Health / Love / Finance / Joy / Custom)
2. **Name** — free text 2–80 chars, suggested chips below (e.g. *"The Studio of My Own"*)
3. **Identity statement** — multiline, must start with "I am", ≤400 chars. Sage-tinted "tip" card with *"almost-but-not-quite true"* guidance.
4. **Photographs** — 1 to 5 from curated library (filtered by selected area) + Upload affordance via expo-image-picker. Selected photos show numbered amber badge. CTA disabled until ≥1 selected.

**Reveal:** New board comes together — photos drop in (~120ms apart, slight rotate-in); identity card fades in last with 600ms cosmic glow.

**Editing:** Same fields, prefilled. Available from Vision Detail.

**Re-mapping (post-MVP):** Quarterly guided flow that archives current season and starts a new one. The archive is sacred — never overwrite.

---

### 6.7 Witness System (Accountability)

**What it is:** A lightweight one-way visibility layer. The user pairs with one buddy ("the witness") who sees their wins.

**Mechanic:**
- During onboarding (Beat O10), user picks:
  - **Invite a witness** — SMS/share link. Friend installs and links back. (Invites quietly drive growth.)
  - **Skip** — unlockable from Settings anytime
- Each user has **0 or 1** active witness pair. Symmetric: A's witness is B; B's witness is A.

**What the witness sees:**
- The user's wins where `visibility = witness` (per-win opt-in)
- That's it.

**What the witness does NOT see:**
- Vision boards, photos, identity statements
- The user's intentions or ritual content
- Counts, practice continuity, or any metric

**Interaction model:**
- **Single soft "seen" pulse** on tap of a buddy's win (800ms amber glow). No comments. No likes. No emoji.
- Witness notifications batch in 4-hour windows; never more than one push per window.

**Display:**
- Witness ghost button on Today (bottom-right) → opens Witness screen
- Witness screen: two orbs side by side at top, then one-way feed of buddy's wins

**Empty / edge states:**
- No pair → soft invite affordance: *"Invite one person."*
- Pair pending → *"Waiting for them."*
- No wins this week → *"Quiet today."*
- End pair → confirmation modal; both users notified

**Why this works:**
- Privacy-respecting (no exposed content, just signal)
- Asymmetric attention (someone witnesses your work)
- Lightweight (one-tap = zero overhead)
- Invites still drive growth, but framing is intimacy, not virality

---

### 6.8 Onboarding — Storytelling format

**Updated 2026-05-08:** restructured to a three-phase storytelling flow.

1. **Sell phase** (5 screens) — full-bleed image backgrounds, single big statement + body per screen, bottom-anchored layout. The user understands the product before being asked to do anything.
2. **Setup phase** (4 screens + sign-in + reveal) — vision creation; clean cosmic gradient (no images so the user can focus on inputs).
3. **Daily-flow intro phase** (2 screens, post-reveal) — explains the daily ritual + win capture as next-step storytelling, full-bleed images. Bridges from "you've set up your vision" into the actual habit.

**Layout consistency rule:** every storytelling screen (sell + daily-flow phases) uses the **same bottom-anchored content block**: eyebrow → title (32px / 500 / -0.7) → body (15.5 / 24 lh / cream-soft). Reusable component: `HeroProofScreen` in `mobile/src/ui/components/`.

| # | Beat | Phase | Image bg? | Skippable? |
|---|------|---|---|---|
| O01 | **Welcome** | sell | yes | No |
| O02 | **Why this works (intro)** — *Identity beats goals.* | sell | yes | No |
| O03 | **Visualization rewires the brain.** | sell | yes | No |
| O04 | **Small wins build identity.** | sell | yes | No |
| O05 | **Then behavior follows.** CTA: *Set up my vision* | sell | yes | No |
| O06 | **Pick area** (Career / Health / Love / Finance / Joy / Custom) | setup | no (gradient) | Required |
| O07 | **Name your vision** (2–80 chars) | setup | no | Required |
| O08 | **Identity statement** (multiline, "I am…", ≤400 chars) | setup | no | Required |
| O09 | **Choose photographs** (1 to 5 from area-filtered curated library + upload) | setup | no | Required |
| — | **Sign in with Apple** (one-tap, deferred until O09 → O10) | setup | — | Apple required |
| O10 | **Vision board reveal** | setup | yes (cinematic) | Advance only |
| O11 | **Morning ritual intro** — *"Now, every morning…"* | daily-flow | yes | No |
| O12 | **Capture wins intro** — *"And throughout the day…"* | daily-flow | yes | No |
| O13 | **Witness invite** (optional pairing) | finalize | yes or no (TBD) | Yes |
| O14 | **Set morning time** (default 7am, range 5–10am) | finalize | no | Required |

**Why O11–O12 come AFTER vision setup, not before:** users are more receptive to "here's how to use it daily" once they have something concrete to use it on. Telling them about the daily ritual upfront (when they don't have a vision yet) felt like a lecture; telling them after the reveal feels like a tour of their own setup.

**Sign-in placement:** Deferred until the moment the first vision board commits, between O09 (photos) and O10 (reveal). Sign In with Apple, one tap. No email/password, no Google.

**Empty-state strategy:**
- Witness skipped → unlockable from Settings
- All vision-creation beats are required for first-run completion (the ritual depends on one vision)

---

### 6.9 Push Notifications

**Philosophy:** Respectful, configurable, never spam. Quiet hours default 9pm–7am.

| Type | Trigger | Copy | Default time |
|------|---------|------|--------------|
| **Morning ritual** | Daily | (no title; soft sound) — *"Ninety seconds. Already in motion."* | User-set, default 8 AM |
| **Witness win** | Witness captures | *"{name} kept something"* — *"Just for you to see."* | Real-time (batched 4-hour windows) |
| **3-day check-in** | 3+ days absent | *"Quiet, not gone."* — *"Still here whenever you're ready."* | Once, silent |
| **Sunday integration** | Weekly (post-MVP) | *"Your week, kept."* — *"Five minutes. Look back."* | Sunday morning |
| **Milestone** | Practice continuity 7/30/100/365 | *"Seven mornings kept. The work is in you."* | Immediate, rare |

**User controls:**
- Per-type on/off
- Time-of-day picker
- Quiet-mode snooze for N days

---

### 6.10 Streak System (internal name) — "Practice continuity" (UI)

**What it is:** A consecutive-day count of showing up. The handoff philosophically rejected streaks; the SPEC keeps the mechanic but **softens display** to fit Innerproof's voice.

**Practice day = any one of:**
- Completed morning ritual
- Captured ≥1 win
- Manually updated intentions

**Grace:** 1 missed day per rolling 7 days is free.

**Soft recovery:** Miss 2 days → count goes amber (paused). Miss 3+ → resets with a kind message.

**Display rules:**
- **No fire emoji.** No "streak" word in user-facing copy.
- Inline pill on Today: *"7 mornings"* (count + word, no emoji)
- Detail line: *"You've shown up 7 mornings."*
- Witnesses see no counts at all (handoff alignment — privacy)
- Internal dashboards may continue to call it "streak"

**Celebrations** at 7 / 30 / 100 / 365 days: quiet milestone screen, no fanfare. Copy: *"Seven mornings kept. The work is in you."*

**No paid streak shields.** Dark pattern.

---

### 6.11 Daily Quote

**What it is:** A rotating piece of warmth on Today, sourced from public-domain or fair-use authors.

**Sources:**
- Tony Robbins, Joe Dispenza (short, fair use, attributed)
- Rumi, Lao Tzu, yoga sutras (public domain)
- Stoics — Marcus Aurelius, Seneca (public domain)
- Original copy in The Anchor Method voice

**Display:**
- Sage "framed wisdom" hero card on Today
- Decorative quotation mark (Georgia serif, large, faded white)
- Italic cream text body
- Attribution: *"RUMI · TODAY'S INSPIRATION"*

**Library:** Build to 365 quotes for year-one. All curated for warmth, agency, presence — no toxic positivity.

---

## 7. Visual Design

The full spec lives in `handoff/03-design-system.md` and `handoff/04-components.md`. SPEC summary:

### 7.1 Two registers

| Register | Where it appears | Mood |
|---|---|---|
| **Daylit** (cream bg, ink type) | Today, Wins, Vision Detail, Search, Settings, Witness | Open, calm, readable. The day. |
| **Cosmic** (deep warm-black gradient, cream type, amber accents) | Onboarding, Morning Ritual, Vision Player, Vision Board reveal, Premium | Intimate, ceremonial. The interior. |

Cross-fade between registers: 400–600ms.

### 7.2 Color palette (locked, Palette A canonical)

```css
/* Surfaces */
--bg          #FAF6EF   /* page background (daylit) */
--bg-soft     #F4EEE2   /* recessed surfaces */
--surface     #FFFFFF   /* cards */
--paper       #FCF5E8   /* warm paper, slip notes */

/* Cosmic */
--cosmic-a    #2A1F15   /* base (deepest) */
--cosmic-b    #4B2E1E   /* mid */
--cosmic-c    #7A4530   /* top edge / glow */

/* Hierarchy */
--ink         #3E2F22   /* headlines, body */
--ink-soft    #6B5847   /* secondary */
--muted       #9A8D7E   /* tertiary, captions */
--muted-soft  #C9BEB0   /* placeholder, hairline labels */
--hairline    rgba(62,47,34,0.08)

/* Brand */
--terra       #C06848   /* primary action, identity */
--terra-deep  #9E4F32
--terra-light #E8A07A
--terra-pale  #F5DBC9

--sage        #7A9470   /* tips, hints, soft confirmations */
--sage-deep   #556B4F
--sage-pale   #D8E4D2

--amber       #D89A5A   /* ritual glow, eyebrow accents */
--amber-deep  #9B6B2F
--amber-pale  #F5E4CF
```

Palettes B (Blush/Sand/Gold) and C (Butter/Rust/Olive) are defined in `shared.jsx` for future seasonal moods.

### 7.3 Typography

**General Sans** (Fontshare). Weights 300/400/500/600/700.

| Token | Size / Weight / Tracking | Usage |
|---|---|---|
| `display-xl` | 40 / 500 / -1.0 | Onboarding hero only |
| `display-l` | 32 / 400 italic / -0.6 | Premium hero, identity callouts |
| `display` | 28–30 / 500 / -0.7 | Onboarding/screen titles |
| `heading` | 22 / 600 / -0.4 | Section headers, slip titles |
| `body-l` | 15.5 / 500 / -0.1 | Primary body |
| `body` | 14 / 500 / 0 | Default body |
| `eyebrow` | 10–11 / 700 / +2.2 / **uppercase** | Section eyebrows, ritual labels |
| `meta` | 11 / 600 / +1.4 / **uppercase** | Tags, area labels |
| `voice` | 12.5–14.5 / 400 italic / -0.1 | Voiced ritual cues |

**Italic is the brand voice.** Use italic for emphasis and identity moments. Roman for instruction and UI.

### 7.4 Brand mark — the breathing orb

A radial-gradient sphere with a soft halo, breathing at 4s in / 4s out. Sizes: 64 (mini), 132 (medium), 180 (hero), 220 (ritual). Full anatomy in `handoff/04-components.md`.

The orb is **never static** — even on settings screens it breathes at 0.3 amplitude. It is the brand mark *and* the completion indicator (pulses brighter for 600ms when ritual ends).

### 7.5 Visual motifs

- **Paper slips** for intentions (cream paper, 1px amber border, slight rotation, "I AM" amber or "TODAY I WILL" terra eyebrow)
- **Polaroid vision photos** (paper border 6px, `saturate 0.85 contrast 1.02`, -3° to +3° rotation, scattered not gridded)
- **Identity card** (paper bg, italic body, quote-mark glyph top-left)
- **Hairlines** at 8% opacity ink — never gray
- **Warm shadows** — always tinted (amber/terra/sage), never neutral

### 7.6 Anti-patterns (never do)

- Drop shadows on text · gradients on text
- Glassmorphism (frosted glass) outside the cosmic register
- Emoji in product UI
- Iconography for decoration (only for affordance)
- Border colors > 1.5px
- Loading spinners — use the breathing orb for any wait > 1s
- Cool colors (blue, teal, pure gray)
- Pure black (#000) — always warm espresso (#3E2F22)
- Toxic positivity copy
- "Wellness app" cliché (light pink, lavender, watercolor swirls)
- Cosmic/woo imagery (galaxies, crystals, rainbow auras)

---

## 8. Voice & Copy

Full deck in `handoff/07-copy-deck.md`. **SPEC overrides — clarity-first.** The handoff voice was over-indexed on literary; for an app where users are figuring out a new product, clarity wins. Warm, but never at the cost of comprehension.

### 8.1 Voice principles

1. **Clarity over poetry.** Tell users what they're doing AND why, *before* any literary flourish. If a line is beautiful but cryptic, rewrite it.
2. **Concrete over abstract.** Say "the version of yourself you're becoming," not "her" or "it." Say "90 seconds in the morning, then your day is yours," not "Ninety seconds. Then live."
3. **Show the why for every action.** When a user is asked to set up something (vision, identity, photos), explain in one sentence: what they're doing, what it's used for, how long it takes.

### 8.2 Hard rules

- **Gender-neutral throughout.** Use "you," "yourself," or "the version of yourself you're becoming." Never "her/she."
- **No exclamation marks. Ever.**
- **One thought per line.** Period-break short sentences, never run-on. (But not so terse it loses warmth.)
- **Use digits for numbers in UI** ("90 seconds," not "ninety seconds"). Spelling out is reserved for marketing prose.
- **Never use the word "user."** Second-person ("you") or third-person ("they") only.
- **No em-dashes (—).** Use a period, comma, colon, or parentheses instead. *(Updated 2026-05-08 per founder feedback.)*
- **Italic for emphasis only** — single words or short phrases, never whole paragraphs. The handoff's "italic is the voice" pattern is rejected; italic is now reserved for emphasis (vision name, key word).
- **Microcopy must do work.** Every screen's body text should answer: what am I doing? why? how long?

### 8.3 Forbidden words

`achievement` · `goal` · `streak` *(in user-facing copy)* · `score` · `metric` · `crush` · `hustle` · `optimize` · `hack` · `level up` · `winner` · `journey` · `unlock` (except where literal) · `unleash` · `revolutionary` · `game-changer`

### 8.4 Sacred phrases (clarity-first working set)

Brand-thread phrases that may appear verbatim in product copy and marketing:

- *Innerproof.* (product name)
- *The Anchor Method.* (method name)
- *Manifest · Visualize · Document.* (the three-act loop name)
- *A daily practice for becoming who you want to be.* (one-liner)
- *90 seconds in the morning. The rest of the day is yours.* (the daily promise)
- *Capture small wins as proof.* (the loop in 5 words)
- *Almost-but-not-quite true.* (identity-statement tip)

Phrases retired from the original handoff for being too cryptic: *"Become her, quietly," "Ninety seconds. Then live.," "She's already moving.," "Already in motion.," "The work is already in you.," "Devotion is what keeps it close.," "Quietly."*

The handoff `07-copy-deck.md` is now reference-only. All shipping copy follows §8.1–8.4 above.

---

## 9. Tech Stack

### 9.1 Mobile
- **Expo (React Native, New Architecture / Fabric).** iOS first, Android Phase 2. Aligns with the Mobile Playbook two-track workflow (Expo Go preview + EAS dev build) used for Replay.
- **Orb / breathing visuals:** Reanimated 3 worklets on UI thread (60fps). `react-native-skia` available for the most demanding cosmic transitions if needed. See ARCHITECTURE Appendix D for polish targets and mitigations on iPhone 12 mini.
- **Android — Phase 2.** Compose. Full rewrite, not a port. Revisit specs before porting.

### 9.2 Backend (MVP on Supabase)
- **Supabase** — Postgres + auth + storage in one. Pragmatic for MVP.
- **RLS policies** for user-data isolation
- **Migration plan:** as scale pain hits, peel components off:
  - Photo storage → S3 + CloudFront direct (cost)
  - Subscription billing → RevenueCat (always — Supabase doesn't bill)
  - Auth → revisit if vendor lock-in becomes painful
- **Redis** (optional, post-MVP) for ritual generation queues

### 9.3 Auth
- **Sign In with Apple only** for MVP
- One tap, deferred until first vision-board commit (between O08 and O09)
- No email/password, no Google, no Facebook

### 9.4 Voice / audio
- **One pre-recorded MP3** (~90 seconds), same file for all users. Recorded once via ElevenLabs library voice (or a one-shot human VO — TBD). No per-user generation pipeline, no nightly cron, no LLM.
- **Distribution:** bundled in the app binary on install, OR fetched once from Supabase Storage / CDN and cached in app's Caches directory.
- **Personalization is on-screen, not in the audio:** the user's identity statement appears during R03; the user types today's intention during R04. The audio has built-in pauses for both.
- **Cost:** ~$0/user/month (one-time recording cost only).

### 9.5 Other
- **Notifications:** APNs via Supabase
- **Subscriptions:** RevenueCat (StoreKit wrapper)
- **Analytics:** PostHog (self-hosted preferred for privacy)
- **No third-party tracking pixels.** No social SDKs.

### 9.6 Privacy
- All photos encrypted at rest
- Identity statements treated as PII — never logged, never in analytics events
- Witness can only see wins where `visibility = witness`. Server-side enforced (RLS).
- No social sign-in, no contact-list scraping.

**Target MVP timeline:** 8–10 weeks → TestFlight beta → App Store launch.

---

## 10. Monetization

### 10.1 Single tier
- **No free tier.**
- 7-day free trial → hard paywall.
- **$2.99/month** or **$24.99/year** (yearly saves ~30% vs monthly · ~$11/yr)
- Subscription via StoreKit / RevenueCat

### 10.2 Trial flow
- User onboards → completes first vision board → trial begins automatically when sign-in commits the board.
- Apple StoreKit handles the "intro offer" pattern (card on file via Apple ID, no separate signup).
- Day 4: first soft prompt at end of Today screen — *"You've shown up 3 mornings. There's more here when you're ready."*
- Day 7: trial ends. Hard paywall blocks further ritual access until subscription.
- Apple subscription sheet handles cancellation flow.

### 10.3 What the subscription unlocks
The full app: unlimited vision boards, daily voiced ritual, wins archive, witness pair, daily quote, search, settings.

There is no feature-gated free tier. If the user is past trial and not subscribed, the ritual paywall-locks but the archive remains accessible (read-only) — your work stays yours.

### 10.4 No dark patterns
- No countdown urgency, no fake scarcity
- Cancel anytime via Settings (deep-link to Apple subscription management)
- Archive stays yours; export available post-MVP
- *No ads. No data sold. No noise.*

### 10.5 Year proof book — TBD
The handoff included a "printed proof book mailed in winter" perk on its Year tier. Dropped from MVP (single tier doesn't justify physical-product complexity). Revisit post-launch as an annual upsell or 1-year-anniversary surprise.

---

## 11. Legal Framework

### 11.1 Safe to use
- Visualization, meditation, breathwork, gratitude concepts (uncopyrightable)
- Be → Do → Have framing (general philosophy)
- Identity-based change concepts (mentioned in many works)

### 11.2 Avoid
- Author names in branding ("Robbins Method")
- Reproducing specific scripts or course structures
- Implying endorsement
- Voice clones that sound like real authors (use original actor)

### 11.3 Best practice
- Original framework name ("The Anchor Method")
- Original audio script library
- Short attributed quotes only (1–2 sentences, fair use)
- ElevenLabs library voices used under Creator/Pro plan commercial license (no custom voice actor for MVP)
- Privacy disclosure for ElevenLabs processing (audio is generated server-side from the user's identity statement)
- Privacy policy + ToS generated via Termly (or equivalent) for MVP; revisit lawyer review post-revenue
- Trademark filing deferred until post-launch traction; common-law protection from use only

---

## 12. Roadmap

### MVP (Months 1–3)
Sections 6.1–6.11. Expo / React Native (iOS first), Sign In with Apple, single-tier paywall, witness pair, voiced ritual.

### Phase 2 (Months 4–6)
- **Android rewrite** (Compose) — full second app, not a port
- Quarterly **vision-board re-mapping** flow (with guide)
- **Sunday integration session** (weekly recap)
- Photo upload + cropping editor (currently picker only, no editor)
- Archive export (PDF, shareable images)

### Post-PMF (Months 7+)
- Apple Watch companion (quick win capture from wrist)
- Inner Maps personality integration (personalize ritual by personality type)
- Year-anniversary upsell — printed proof book (revived from handoff Year tier)
- Couples/family witness mode (group accountability)

### Deferred / cut
- Constellation visualization (cut)
- Voice mode for win capture (cut)
- Drop Anchor mode (deferred)
- Open community / anonymous vision sharing (deferred)
- Therapist/coach version (post-PMF if at all)

---

## 13. Key Metrics

**North-star:** Daily ritual completion rate (% of DAU who complete the morning ritual).

**Leading indicators (priority order):**
1. **Mornings completed in week 1** — habit-formation signal
2. **Wins captured per active day** — depth of engagement
3. **D30 retention** — the only retention number that matters; this is a habit product
4. **Witness pair rate** — drives D90 retention (and quietly drives growth via invites)
5. **Trial → paid conversion** — at day 7

**Internal-only metrics (never shown in product):**
- Streak length (tracked; not displayed as "streak")
- Per-cohort ritual completion
- LTV by acquisition channel
- Audio ritual quality NPS

---

## 14. Open Questions / Decisions Needed

- [ ] Final tagline — *"Become her, quietly"* breaks gender-neutral rule. Working candidate: *"The future you, already in motion."*
- [ ] Sacred-phrase rewrite pass for gender neutrality (see §8.3)
- [ ] Onboarding context copy (§6.8) — proposed working text needs final writing pass aligned with brand voice
- [x] Ritual audio source — **ElevenLabs library voice** (one-time export). Locked 2026-05-06.
- [ ] Music bed under ritual audio (Soundstripe / Artlist) — or skip entirely
- [ ] Stock image library scope and curation — confirm ~200 photos across 5 areas (per handoff)
- [ ] Trademark search for "Innerproof" via USPTO TESS — filing deferred until post-launch traction
- [ ] Social handles for Innerproof (Instagram, TikTok, X) — check availability and reserve
- [ ] Apple subscription pricing localization (StoreKit tier choice for non-USD)
- [ ] Confirm streak softening (§6.10) — keep mechanic, no fire emoji, no "streak" word in UI

---

## 15. Design Status

**All 16+ artboards designed** in the JSX canvas at `Manifestation App - Claude Design/`:

- Onboarding (11 beats)
- Three tabs (Today / Vision / Wins)
- Morning Ritual (5 beats)
- Vision Player + Vision Detail + 3 board concepts (A/B/C — C canonical)
- Vision Creation (4 steps)
- Win Capture
- Win Detail
- Search
- Witness screen
- Settings
- Premium (paywall)
- Visual system locked (palette, typography, two registers, motion, photography rules)

**Gaps to design before ship** (per `handoff/05-screens.md`):
- Sign-in deep-link target (separate from onboarding sign-in)
- Streak/practice-continuity recovery ("you missed yesterday — that's okay")
- Witness invite — receiver side (deep-linked accept screen)
- Notification copy / lock-screen previews
- Vision-board re-mapping flow (Phase 2)
- Photo upload + cropping editor
- Account deletion confirmation (legal req)
- Witness "ended" state
- App Store onboarding screenshots (marketing artifacts)
