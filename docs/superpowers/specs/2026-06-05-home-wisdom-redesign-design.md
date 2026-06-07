# Home wisdom redesign — design spec

**Date:** 2026-06-05
**Status:** Approved, ready for plan
**Brainstorm session:** `.superpowers/brainstorm/99495-1780652423/`

## Problem

The current Home tab has two adjacent content surfaces — an Affirmations strip (horizontal scroll, 5 photo-backed glass cards) and a Daily wisdom quote (single editorial card). Both serve "consume on a low-write day" purposes but read as separate sections, and the layout is at its budget ceiling (~660pt of 620pt available — tight enough that adding any content forces a compression elsewhere).

Users who don't write their own content (intentions, wins) on a given day need an engagement floor — something to consume that still feels like practice. Two daily items (one affirmation set, one quote) is a thin floor. We want richer, more varied content without breaking the no-scroll Home contract.

## Goals

1. Combine the affirmations strip and daily wisdom quote into a single unified "Today's wisdom" surface.
2. Increase per-day content variety beyond a single quote — multiple wisdom items per day, mixed types.
3. Add a longer-form daily reading surface for deeper engagement when users have time to sit.
4. Stay inside the no-scroll Home layout contract (≤ ~620pt content on iPhone 14).
5. Include yoga literature and other public-domain wisdom sources without copyright risk.

## Non-goals (v1)

- Audio narration of daily readings (deferred to v1.1 — pipeline exists via ElevenLabs).
- Saved-readings library / favorites surface (deferred to v1.1).
- Reflection-to-Wins bridge (prompt card opens Wins capture pre-filled) (deferred to v1.2).
- Per-category personalisation of the daily reading (deferred to v1.2 — MVP serves the same daily reading to all users).
- Original-reflection content engine beyond a 14-reading seed (ongoing content effort, tracked separately).

## High-level design

Home tab structure after the redesign, top to bottom:

1. **Greeting row** (unchanged)
2. **Ritual card** (unchanged)
3. **Intention card** (unchanged — appears only after ritual is complete today)
4. **Today's wisdom** (NEW combined surface, replaces Affirmations strip + Daily wisdom quote)
5. **Today's reading** (NEW preview card, opens to full reader screen)

A new modal screen — **Reader** — opens when the user taps "Continue reading →" on the Today's reading card.

## Section: Today's wisdom

A horizontal swipeable strip containing 8 cards per day. Three card types interleave:

### Card types

| Type | Voice | Visual treatment | Source pool |
|---|---|---|---|
| Affirmation | First-person ("I am…") | Warm filled card — `linear-gradient(135deg, rgba(192,104,72,0.4), rgba(192,104,72,0.18))`, solid amber border | Existing `affirmations.ts` (30+ items, no changes) |
| Quote | Third-person attributed (e.g., Buddha, Patanjali, Lao Tzu) | Outlined card — `rgba(216,154,90,0.08)` bg, solid amber border at 22% opacity | Existing `dailyQuotes.ts` (32 items) + 15+ new yoga literature additions |
| Prompt | Second-person question ("What are you…?") | Dashed-border card — transparent bg, dashed amber border at 40% opacity, "SIT WITH" eyebrow tag | New `reflectivePrompts.ts` (~20 items seeded) |

All three card types share the same footprint: **115 × 80pt**, italic Georgia serif body for affirmations and quotes, sans for prompts.

### Selection algorithm (`todaysWisdomSet`)

Input: user's active vision categories (array), limit (default 8), date (default now).
Output: `WisdomItem[]` of length `limit` (or pool size if smaller).

Behavior:
1. Build the pool: union of affirmations matching active categories + all quotes + all prompts. Fall back to all affirmations if no categories.
2. Day-of-year deterministic rotation seed (same approach as existing `todaysAffirmations`).
3. Walk the pool starting from the day-offset, taking `limit` items, avoiding two consecutive items of the same type where possible.
4. Mix tone variety within each type (existing logic from `todaysAffirmations`).

### Layout

- Section heading: "Today's wisdom" — 22pt amber, weight 500, marginBottom 10
- `ScrollView horizontal`, `gap: 9`, `paddingRight: 12`, no scroll indicator
- 8-dot paginator below, current dot wider and amber, rest 5pt circles at 18% opacity cream
- Section vertical footprint: ~130pt (heading 32 + cards 80 + paginator gap 8 + paginator 10)

## Section: Today's reading

Single preview card per day, sits beneath the wisdom strip. **No external section heading** — the card is self-contained with its eyebrow tag inside (contrast: "Today's wisdom" has an external heading because it labels a strip of multiple cards).

### Card content

- Top row (flex space-between):
  - Eyebrow tag: "TODAY'S READING" (uppercase amber, 7pt, letter-spacing 1.5)
  - Read time meta on right (e.g., "3 min") — 7pt cream at 50% opacity
- Title (Georgia serif, 13pt, weight 500)
- Opening sentence(s) — Georgia serif italic body, `max-height: 26pt`, fade mask to transparent at 60%
- "CONTINUE READING →" link (amber, uppercase, 9pt, letter-spacing 1)

Card container: `rgba(216,154,90,0.05)` bg, 1px amber border at 22% opacity, border-radius 14, padding 12.

### Selection algorithm (`todaysReading`)

Input: date (default now).
Output: `DailyReading`.

Day-of-year deterministic — `pool[dayOfYear % pool.length]`. Same calendar day always returns the same reading. MVP pool size: 14 (2 weeks of unique readings before rotation).

### Layout

- Card vertical footprint: ~90pt (padding-top 12 + tag row 10 + title line 16 + body 26 + continue line 14 + padding-bottom 12). Add `marginTop: 14` from the wisdom strip above.
- Total section footprint including margin: **~105pt**
- No personalisation for v1.

## Reader screen (modal)

Opened via `router.push('/reading')` — single route, always serves today's reading (no `[id]` param for v1 since we don't surface past readings).

### Layout

- Background: `colors.cosmicA` with same cosmic-warm gradient overlay as Home
- Top-right close X — 26pt circular button, `rgba(250,246,239,0.1)` bg
- Body content: 22pt horizontal padding
  - Eyebrow tag: "VISORA · DAY {N}" — uppercase amber, 9pt, letter-spacing 2
  - Title — Georgia serif, 22pt, weight 500, line-height 26
  - Submeta — read time, 9pt, 55% opacity cream
  - Body paragraphs — Georgia serif, 12.5pt, line-height 19
  - Pull quotes — `border-left: 2px solid amber`, padding-left 12, italic Georgia 12pt; source attribution as small caps amber line below
- Dismissal: tap close X, or swipe down (native modal behavior)

### Body structure

Each `DailyReading.body` is an array of structured blocks:
- `{ type: 'paragraph', text: string }`
- `{ type: 'pullquote', text: string, source: string }`

Renderer maps over blocks. Keeps content authoring flexible without committing to markdown parsing for v1.

## Data layer

### New types

```ts
// src/core/models/wisdom.ts (new)
export type WisdomItem =
  | { kind: 'affirmation'; item: Affirmation }
  | { kind: 'quote'; item: WisdomQuote }
  | { kind: 'prompt'; item: ReflectivePrompt };

export interface ReflectivePrompt {
  id: string;
  text: string;
  category?: AreaKind;  // optional — most prompts are universal
}

export interface DailyReading {
  id: string;
  dayNumber: number;      // "VISORA · DAY {N}" — pool index + 1 for now
  title: string;
  readTimeMinutes: number;
  body: ReadingBlock[];
}

export type ReadingBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'pullquote'; text: string; source: string };
```

### Files changed/added

All paths relative to `mobile/`. The codebase convention is **selectors live in their constants file** (e.g. `todaysAffirmations` is exported from `affirmations.ts`). No separate `selectors/` directory.

| File | Status | Purpose |
|---|---|---|
| `src/core/constants/affirmations.ts` | unchanged | Existing affirmation pool — also keeps existing `todaysAffirmations` export until cleanup pass |
| `src/core/constants/dailyQuotes.ts` | extended in place | Add 15+ yoga literature entries (Gita, Sutras, Tao Te Ching, Rumi, Marcus Aurelius). Keep existing entries. Keep existing `todaysQuote` export until cleanup pass. **Not renamed** — keeps git diff smaller. |
| `src/core/constants/reflectivePrompts.ts` | new | ~20 reflective prompts ("What are you ready to release?", "Where in your body is calm?", etc.) + a `todaysPrompts(limit)` helper |
| `src/core/constants/wisdomItems.ts` | new | Re-exports the unified `WisdomItem` type + the `todaysWisdomSet(categories, limit, now)` selector that draws across affirmations + quotes + prompts |
| `src/core/constants/dailyReadings.ts` | new | 14 seeded readings (data + `todaysReading(now)` selector) — original Visora-voice reflections with embedded public-domain pull quotes |
| `src/core/models/wisdom.ts` | new | Type definitions for `WisdomItem`, `ReflectivePrompt`, `DailyReading`, `ReadingBlock` |

The old `todaysAffirmations` and `todaysQuote` functions stay defined (no consumers after refactor, but kept for safety + tests until a cleanup pass after the redesign ships and stabilises).

## Component changes

The existing pattern in `home.tsx` is to define all sub-components inline in the same file (see `RitualFeatureCard`, `AffirmationStrip`, `QuotePostcard`, `IntentionDisplay`). We follow that pattern for the new sub-components rather than extracting to a separate dir — keeps the diff small and matches what's already there.

| Component | Status | Notes |
|---|---|---|
| `app/(tabs)/home.tsx` | refactor | Replace `<AffirmationStrip />` + `<QuotePostcard />` with new `<WisdomStrip />` + `<ReadingPreviewCard />` (both defined inline in this file). Update LAYOUT CONTRACT comment to reflect new budget (~450pt used, +170pt slack). |
| `AffirmationStrip` (inline) | delete | Superseded by `WisdomStrip` |
| `QuotePostcard` (inline) | delete | Superseded by `WisdomStrip` (quote variant) |
| `AffirmationCard` (inline) | refactor | Becomes one variant inside the new `WisdomCard` renderer. **Visual change:** drops the photo-backed `BlurView` treatment used in the current V3 design. New design is a solid-fill warm gradient card to keep all three card types (affirmation / quote / prompt) visually consistent at the same 115×80pt footprint. Photo library is no longer referenced by the Home strip. |
| `WisdomStrip` (new, inline) | new | Horizontal `ScrollView` + 8-dot paginator + maps over `WisdomItem[]` and dispatches to `WisdomCard` |
| `WisdomCard` (new, inline) | new | Discriminated render — renders one of three variants (`AffirmationVariant` / `QuoteVariant` / `PromptVariant`) based on `item.kind`. All three share the 115×80pt footprint. |
| `ReadingPreviewCard` (new, inline) | new | Preview card on Home — eyebrow + title + opening sentence with fade-mask + "Continue reading →" link. Tapping pushes `/reading`. |
| `app/reading.tsx` | new | Full reader screen — minimal editorial layout. Renders `todaysReading()` and maps over its `body: ReadingBlock[]` (paragraph vs pullquote). Close X top-right, swipe-down dismiss via modal presentation. |
| `app/_layout.tsx` | minor | Register `/reading` route in the Stack with `presentation: 'modal'` (or `'formSheet'` — pick whichever matches existing modal routes in the file) |

## Layout budget — verification

| Section | Old footprint | New footprint |
|---|---|---|
| Greeting row | 75pt | 75pt |
| Ritual card | 140pt | 140pt |
| Affirmations strip (old) | 200pt | — |
| Daily wisdom quote (old) | 145pt | — |
| Today's wisdom (new) | — | 130pt |
| Today's reading (new) | — | 105pt |
| **Total content** | **660pt** | **450pt** |
| iPhone 14 available | 620pt | 620pt |
| **Slack** | **-40pt (over budget)** | **+170pt** |

The redesign FREES 165pt of layout slack. No-scroll contract preserved comfortably. Intention card (~80pt when present) still fits within the new slack.

## Content sourcing — copyright posture

All MVP content is either authored by Visora (reflections, prompts) or sourced from public-domain texts:

- **Affirmations & prompts** — original Visora writing, fully owned IP
- **Quotes (existing pool)** — public-domain attributed sayings
- **Quotes (yoga additions)** — pre-1929 translations only:
  - Bhagavad Gita — Edwin Arnold translation (1885) or earlier
  - Yoga Sutras of Patanjali — Swami Vivekananda translation (1896)
  - Tao Te Ching — James Legge translation (1891)
  - Rumi — Edward Henry Whinfield translation (1887, *Masnavi I Ma'navi*) or earlier
  - Marcus Aurelius *Meditations* — George Long translation (1862)
- **Daily readings (body prose)** — original Visora writing
- **Daily readings (pull quotes)** — same public-domain translations as above, always attributed with text name + translator + year

No modern translators or modern authors (e.g., Tolle, Coleman Barks Rumi, Stephen Mitchell Tao Te Ching) anywhere in the content pool.

## Selection determinism & testing

Both `todaysWisdomSet` and `todaysReading` are pure functions of (date, user state). Unit tests cover:

- Same date → same result (determinism)
- Different dates → different sets (rotation)
- Empty active categories → falls back to all-categories pool
- Pool exhaustion → cycles modulo pool length
- Adjacent-type prevention in wisdom set (no two `prompt`s in a row when alternatives exist)

Layout verification: `Manifestation App - Claude Design/_home-layout-mirror.html` updated to reflect the new section structure for visual cross-check on iPhone 14 / 15 Pro / 14 Pro Max.

## Open questions resolved during brainstorm

| Question | Decision |
|---|---|
| Engagement model — scroll feed, tap-for-another, or daily set? | Daily set (bounded, completable, no-scroll contract) |
| Reading card on Home — full inline, link-only, or hybrid preview? | Hybrid preview with fade-out + continue link |
| Wisdom set composition — 2 types or 3? | 3 types (add reflective prompts) |
| Reading content sourcing — sacred texts, parables, original, or hybrid? | Original Visora reflections embedding attributed public-domain quotes |
| Reader screen — minimal, polished destination, or reflection bridge? | Minimal for v1; polished destination (audio + save) planned for v1.1 |

## Implementation phasing (high-level — detailed plan to follow)

1. Data layer — types, content files (affirmations stay, quotes extend, prompts new, readings new), selectors with tests
2. WisdomStrip + WisdomCard sub-components
3. ReadingPreviewCard
4. Reader screen + route registration
5. Home refactor — wire new components, delete old, update LAYOUT CONTRACT comment
6. Update layout mirror HTML
7. Manual verification: 3 iPhone sizes, ritual-done state, empty categories state
