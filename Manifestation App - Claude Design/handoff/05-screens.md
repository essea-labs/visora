# Screens — Spec by Spec

Each artboard from `index.html` mapped to its real-world implementation. Order follows the canvas. **All sizes assume iPhone 14 (390×844 logical px).**

> Convention: each screen lists `purpose · entry · exit · states · gaps`.

---

## ONBOARDING (8 beats)

> **v2 change (feedback round 1):** the old 11-beat sequence had five Manifest
> steps (pick area → name → identity → photos → reveal) for *one* vision.
> Decision fatigue. Replaced with a multi-select areas screen + a build-the-
> board canvas where the user fills any area in any order via a single mini-
> sheet (one photo per area, one identity line). The board they see at O06
> is *the same board* they'll live with in the Vision tab — no separate
> "reveal" moment needed.

### O01 · Welcome
- **Purpose:** First impression. State the promise.
- **Entry:** First app open.
- **Exit:** "Begin" → O02. "I already have an account" → sign-in flow (out of scope of mocks).
- **States:** Single state. Background photo with linen/morning light.
- **Gaps:** sign-in screen.

### O02 · The Method
- **Purpose:** Name the three-act loop (Manifest · Visualize · Document).
- **Entry:** O01.
- **Exit:** "Show me the loop" → O03.
- **States:** Single. Three numbered orb cards with a dashed thread connecting them.

### O03 · Why this works
- **Purpose:** Soft credibility. The visualization → identity → behavior bridge.
- **Exit:** "I'm ready to manifest" → O04.

### O04 · The daily loop
- **Purpose:** Concretize what tomorrow feels like.
- **Exit:** "Let's build her" → O05.

### O05 · Pick areas
- **Purpose:** Choose the life areas that matter most. Multi-select.
- **States:** 5 default areas (Career · Health · Love · Finance · Joy) + "Something else" (custom). Selected = amber tint + check pill.
- **Validation:** CTA gated until ≥3 selected; cap at 5.
- **Exit:** "Continue" → O06.

### O06 · Build your vision board (canvas)
- **Purpose:** The user *builds* the board they'll live with — same grid as the Vision tab, one tile per area they selected at O05. Tapping a tile opens the mini-sheet (see VISION CREATION below) where they pick **one photo**, **name it**, and write the **identity line**.
- **States:**
  - **Empty** — every tile is a dashed placeholder labelled with the area name + "Tap to fill."
  - **Partial** — at least one tile filled; remaining tiles still tappable.
- **Validation:** CTA enabled when ≥1 area is filled; the rest can be filled later from the Vision tab.
- **No reveal screen.** The user *built* the board live; there's nothing to reveal.
- **Exit:** "Continue" → O07.

### O07 · Witness invite (was O10)
- **Purpose:** Optional witness pairing.
- **Exit:** "Invite a witness" → contacts/share sheet → O08. "Skip for now" → O08.

### O08 · Morning ritual time (was O11)
- **Purpose:** Set morning time, end onboarding.
- **Exit:** "Save my time" → Home (Today).
- **State:** Default morning time = 7:00 AM. Allowed range: 5:00–10:00.

---

## THE THREE TABS

### 01 · Today (Home)
- **Purpose:** The daily landing. Shows: greeting, today's identity slip + intention slip, soft "morning ritual" CTA if not yet completed today, last few wins.
- **Empty states:** Pre-first-ritual, the orb is the dominant element.
- **Pull-to-refresh:** soft amber glow during the pull, breath-rate spring back.

### 02 · Vision Board (canonical 2-col grid)
- **Purpose:** The visual home of the user's becoming. **One photo per area, one identity line per area** — the whole life in a single scannable grid. Reading top-to-bottom should feel like reading a self-portrait ("I am sought-after. I am strong. I am chosen. …").
- **Layout:** 2-column card grid, `aspect-ratio: 0.78`, full-bleed photo + bottom gradient + AREA eyebrow / identity title / "N proofs" overlay. The 6th slot is an "Add an area" dashed placeholder when fewer than 6 areas exist.
- **Interactions:** Tap a card → Vision Player (immersive). Long-press a card → Vision Detail (manage / replace photo / change identity).
- **v2 change:** Replaced the scattered-collage explorations (concept-a "scrapbook" and concept-c "future self with golden threads"). The grid is the canonical view — no concept variants in the canvas.

### 03 · Wins (Archive)
- **Purpose:** Pinterest-masonry archive of captured wins.
- **Interactions:** Tap a tile → Win Detail. Long-press → quick-react (witness only). Pull-down → Search. FAB or pinned bottom = Capture.
- **Empty state:** soft prompt, breathing orb, "Your first win is somewhere in today."

---

## MORNING RITUAL (5 beats)

A single full-screen sequence that auto-advances through 5 beats over 90 seconds. **No taps required** — passive experience.

| Beat | Length | Visual | Voice copy (paraphrase) |
|---|---|---|---|
| R01 Settle | 15s | Orb breathing, cosmic dim | "Take a breath. You don't have to do anything yet." |
| R02 Breathe | 20s | Orb + breath cue text "INHALE / EXHALE" | breath-only, no language |
| R03 Picture | 35s | Vision photo blurred behind orb (or orb-only if user prefers) | reads identity statement, twice, with a long pause |
| R04 Anchor | 15s | Orb + today's intentions appear | "Today, you will…" + the "Today I will" line |
| R05 Send-off | 5s | Orb pulses, soft fade-up | "She's already moving. Go." |

- **Skip:** subtle "skip" affordance top-right after 8s into the session. Tracks as `skipped: true`.
- **Backgrounding:** if the user backgrounds the app, pause audio, save position. Resume on return for 60s; after, end session.
- **Atmosphere tweak:** `vision-photo-blurred` (default) vs `orb-only` (minimal). Per-user preference.
- **Gaps:** "missed yesterday" recovery state.

---

## VISION WORLD

### 04 · Vision Player (immersive)
- **Purpose:** Tap a board photo → fullscreen feeling experience. Identity statement reads as voice. Photos breathe and parallax.
- **Exit:** Tap dismiss / swipe down → return to Vision tab.

### 05 · Vision Detail (manage)
- **Purpose:** Edit the board. Linked wins. Identity statement preview. "Re-map this season" entry point.
- **Sections:** Hero photo + name, identity card, area pill, photos rail, linked wins, dangerous zone (archive season).

---

## VISION CREATION (one mini-sheet)

Single bottom-sheet over the Vision board. Replaces the old 4-step
(pick area → name → identity → photographs) flow. Same sheet used in
onboarding O06 and post-onboarding when the user taps any empty tile.

### Sheet anatomy (one screen, three inputs)

1. **Photo** — single-select photo picker with a "Replace" affordance. *One* photo per area, not 3–5.
2. **Name it** — short title (2–5 words), e.g. *"The Studio of My Own."*
3. **Who you're becoming** — identity line, starts with *"I am"*, ≤ 200 chars.

CTA: **Add to board** (filled terra). Skip: dismiss the sheet — the area
stays empty, fillable later.

### Canvas states (shown side-by-side in the design canvas)

| Slot | State | What's visible |
|---|---|---|
| 06 | `board-empty` | All tiles dashed placeholders. "Let's begin." |
| 07 | `sheet-open` | Same board, scrim + mini-sheet open over the Career tile. |
| 08 | `board-partial` | Career filled (Sought-after). Three other tiles still tap-to-fill. "Building." |

No reveal screen; the board itself is the destination. Subtle entrance
animation as the new card lands on the grid on `Add to board`.

---

## WINS FLOW

### 10 · Capture · Empty
- **Purpose:** First state when user opens the composer. Cursor in text field, tags pinned at bottom.
- **Inputs:** body (req'd), photo (opt'l), area tag (req'd before send).
- **Validation:** body ≥ 4 chars to send.

### 11a · Capture · Text
- **State:** typing. The **Save** button activates terra; tag bar shifts to suggestions based on text. *(v2: button was "Anchor it"; renamed to neutral "Save" so the anchor metaphor stays reserved for the method name.)*

### 11b · Capture · With photo
- **State:** photo attached. Photo shows above text; tap to remove.

### 12 · Win Detail
- **Purpose:** Cinematic single-win view. Photo-first if photo present, text-first otherwise. Shows linked vision area, time, witness state.
- **Actions:** soft delete (with 5s undo), share-to-witness toggle (if not yet shared).

### 13 · Search
- **Purpose:** Search wins by text or area.
- **State:** empty → recent searches; typing → live results.

---

## WITNESS

### 14 · The Witness
- **Purpose:** The paired buddy view. Two orbs side by side at top, then a one-way feed of their wins.
- **Interactions:** Tap a buddy win → soft acknowledgement (single tap, sends a "seen" pulse). No comments.
- **Edge cases:** no pair yet → invite affordance. Pair pending → "she hasn't accepted yet" empty state.
- **Gaps:** the receiver's accept-invite screen.

---

## SETTINGS & DEVOTION

### 15 · Settings (Quiet keeping)
- **Purpose:** Personal config. Sections (12 rows total, post-v2 trim):
  - **Identity hero** — user's hero orb + vision name (display only)
  - **The ritual** — morning time, voice on/off, voice select
  - **The vision** — areas (single row, "5 active" → manage)
  - **The witness** — pair status, manage
  - **The archive** — capture reminders, export
  - **Membership** — current tier (taps to Premium if upgrading)
  - **Account** — email, privacy, help
  - **Quiet exit** — sign out
- **Tone:** Cosmic register; rows are soft cards.
- **v2 cuts (3 rows removed):**
  - ~~Atmosphere~~ — MVP ships only the blurred-vision-photo atmosphere
  - ~~Re-read identity statements~~ — already reachable by tapping a vision card
  - ~~Reshuffle photographs~~ — with one photo per area, nothing to shuffle

### 16 · Devotion (Premium paywall)
- **Purpose:** Conversion to Devoted/Year tier.
- **Trigger:** Shown after 3 completed mornings, on the Settings → Membership tap, or from soft prompts in Vision Board (e.g., "add another season" — Devoted only).
- **States:** First-time view (full pitch), returning view (skip the testimonials, focus on tiers).
- **Trust strip:** Cancel anytime / archive stays yours / no ads, sold data, or noise.

---

## GAPS / NOT MOCKED — TO DESIGN BEFORE SHIP

1. **Sign-in / sign-up** (the Onboarding O01 "I have an account" path).
2. **Streak recovery** ("you missed yesterday — that's okay").
3. **Witness invite — receiver side** (deep-linked accept screen).
4. **Notification copy / lock screen previews** (morning ritual, witness wins).
5. **Vision board re-mapping flow** (quarterly, on Year tier).
6. **Sunday integration session** (deferred from mocks; one-page weekly recap).
7. **Photo upload + cropping flow** (we show the picker; not the editor).
8. **Account deletion confirmation** (legal req).
9. **Witness "ended" state** (when a pair dissolves).
10. **App Store onboarding screenshots** (marketing artifacts).

Each of these should be designed before the corresponding code lands.
