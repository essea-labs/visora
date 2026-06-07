# Components

These are the reusable primitives. Every screen is built from them. They are defined in JSX in `shared.jsx` (and a few in screen-specific files); these specs translate them to native.

---

## `<Phone>` (mock-only)

The iOS frame for the design canvas. **Not** a real component; do not port. Use for understanding viewport: 390 × 844 (iPhone 14/15).

---

## `<StatusBar>`

Top status bar. Two tones:
- `tone="dark"` — dark text on light bg (daylit screens)
- `tone="light"` — cream text on dark bg (cosmic screens)

Time is set per-mock; in production this is the real device clock.
Right side: signal / wifi / battery glyphs (standard iOS).

## `<HomeIndicator>`

The 134-wide × 5-tall pill at the bottom. Same tone API.

---

## `<TabBar>`

Bottom navigation. **Three tabs only**:

| Tab | Icon | Label | Screen |
|---|---|---|---|
| `home` | small home glyph | "Today" | Home / Today |
| `vision` | compass glyph | "Vision" | Vision Board |
| `wins` | anchor glyph | "Wins" | Archive |

States:
- Active: terra-deep label + 2px terra-deep dot beneath the icon
- Inactive: muted label, no dot
- On cosmic register: cream label, amber dot when active

Frosted background: `rgba(252, 245, 232, 0.78)` + `backdrop-filter: blur(20px)` on daylit; `rgba(20, 12, 6, 0.6)` + blur on cosmic.

There is **no center "+" tab**. Capture is launched from a long-press on Wins, or from the Today screen's primary CTA.

---

## `<BreathingOrb>`

The brand mark. A radial gradient sphere with a soft halo, breathing at 4s in / 4s out.

**Anatomy:**
1. Outer halo — `radial-gradient(circle at 50% 55%, terra-light 33, amber-pale 22, transparent 65%)`, blurred 20px, scales 1.0 → 1.08
2. Inner glow — `radial-gradient(circle at 50% 50%, amber 55, terra 33, transparent 75%)`, blurred 8px
3. Core — radial gradient with **highlight at 38% / 32%** (key light), terracotta body, sage rim shadow at 110%
4. Inner shadow at bottom — sage-deep for grounding
5. Exterior shadow — terra at 30px y, terra-rust at 8px y for warmth

Sizes commonly used: 64 (mini), 132 (medium), 180 (hero), 220 (ritual).

**Animation:** scale 1.0 → 1.04, opacity 0.95 → 1.0, 4s ease-in-out infinite.

The orb is also the **completion indicator** — when the morning ritual finishes, the orb pulses brighter for 600ms, then settles.

---

## `<Slip>`

A small "slip of paper" card used for intentions. Two kinds:

| Kind | Eyebrow color | Dot |
|---|---|---|
| `am` (I am…) | amber-deep | amber |
| `do` (Today I will…) | terra-deep | terra |

**Anatomy:**
- Background: `--paper` (#FCF5E8)
- 1px hairline border
- Slight rotation: -1.5deg to +1.5deg, randomly assigned per render
- Eyebrow ("I AM" / "TODAY I WILL") in 9.5px caps + 2px tracking
- Body in italic, 16px, ink

Stack 2 slips on Today: the AM slip on top (rotated -1°), DO slip beneath (rotated +1.5°), staggered 14px down and 8px right.

---

## `<VisionPhoto>`

A photograph rendered as a polaroid-feeling card.

**Anatomy:**
- Outer: `--paper` background, **6px padding**, radius 8px
- Inner image: radius 4px, `object-fit: cover`, `filter: saturate(0.85) contrast(1.02)`
- Optional rotation: -3° to +3° (set per-instance, never randomized at render time)
- Shadow: `photo-tilt` (default) or `photo-hero` (when this photo is the "primary" of the board)

Sizes: thumbnail (44×44 square no padding, just clipped), small (120×150), medium (138×170), large (150×188).

When laid out as a vision board, photos overlap by ~24px and rotate independently. Treat as a 2D scatter, not a grid.

---

## `<IdentityCard>`

The card that holds the user's "I am…" statement. Two variants:

**Daylit variant** (Vision Detail):
- Background: `--paper`
- Eyebrow: "I AM" in amber-deep
- Body: 22px italic, ink
- Quote-mark glyph at top-left, amber, 38px, 30% opacity
- 22px radius, 24×22px padding

**Cosmic variant** (Onboarding step 7, Vision Player, Board reveal):
- Background: `rgba(250, 246, 239, 0.06)` over cosmic gradient
- 1px terracotta-tinted border `var(--amber)55`
- backdrop-filter: blur 20px
- Same content; cream type instead of ink

---

## `<AreaPill>`

A small label denoting which life area something belongs to.

```
[•] Career     ←  amber dot, amber-pale background, amber-deep text
[•] Health     ←  sage dot, sage-pale, sage-deep
[•] Love       ←  terra dot, terra-pale, terra-deep
[•] Finance    ←  amber dot, amber-pale, amber-deep (same as career, distinct icon)
[•] Joy        ←  terra-light dot
[•] Custom     ←  ink dot, bg-soft, ink
```

8px padding, 99px radius, 11px / 600 / +1.4 caps, single-line.

---

## `<WitnessOrb>`

A small orb representing a witness in the buddy pair. Like `<BreathingOrb>` but at 28–44px and using **terra** as the core color (not amber). Distinguishes "the other person" from "you" (whose orb is always amber-cored).

---

## `<BoardGrid>` (Vision Board · canonical)

A 2-column grid of `<AreaCard>` tiles. One tile per life area; one photo per tile.

**Layout rules:**
- CSS Grid, `gridTemplateColumns: '1fr 1fr'`, `gap: 14px`
- Each card: `aspect-ratio: 0.78` (taller than square, shorter than 4:5) so 5 cards + a 6th "Add an area" placeholder fit in one scroll on a 390×844 device
- Card chrome: full-bleed photo · `filter: saturate(0.88) brightness(0.92)` · bottom gradient `linear-gradient(180deg, transparent 38%, rgba(20,12,6,0.82) 100%)` · overlay text in three lines (AREA eyebrow / identity title italic / N proofs muted)
- Empty / placeholder card: dashed border, centered "+" in an amber-tinted ring, area label uppercase + "Tap to fill" italic hint
- Background: same cosmic gradient as Settings + Ritual screens

**Why grid, not scatter:** the user should be able to *read* the whole life in one glance. A scatter layout buries the structure; a grid surfaces it. See `screen-vision.jsx` for the canonical implementation.

In the production app, store the area's photo + identity statement on the server; no positions to persist since the grid is auto-laid-out.

## `<VisionPlayerStack>` (Vision Player · immersive)

The full-bleed single-vision view reached by tapping a `<BoardGrid>` tile. Stories-like card stack with page indicators. See `screen-vision-player.jsx`.

---

## `<ScreenHeader>`

The "back chevron + tiny eyebrow + spacer" pattern at the top of secondary screens. Components: a 36–38px circular ghost button with chevron, a centered eyebrow caption, an empty 36–38px spacer for symmetry.

---

## `<PrimaryButton>`, `<GhostButton>`

**Primary:** Full-width 60×30 pill (radius), terra→terra-deep gradient, cream label, 16px / 600. Soft 18×40 terra-tinted shadow.

**Ghost:** Full-width 60×30 pill, transparent, 1px cream-soft border, cream-soft label.

On cosmic register, both work; on daylit, the primary uses the same terra gradient and the ghost uses ink-soft border + ink-soft label.

---

## `<DotProgress>`

The 11-dot progress indicator at the top of onboarding. The current step is a 18×3 pill (amber); past + present are filled, future are 5×3 dots at 18% opacity.

---

## `<CosmicBg>`

The warm-cosmic gradient background. Two flavors:

```
default: radial(70% 50% at 50% 0%, terraDeep55, transparent 55%) + cosmicA
terra:   radial(80% 60% at 50% 30%, terra44, transparent 60%) + cosmicA
```

Plus a low-opacity star-speck layer (small radial gradients with mix-blend-mode: screen) for cosmic dust.

---

## Voice cue components

For the morning ritual, three text styles overlay the orb:

- **Beat eyebrow** — eyebrow style, amber, fades in/out per beat
- **Voice line** — 22–28px italic cream, fades in 400ms, holds, fades out 400ms before next line
- **Breath cue** — 14px caps "INHALE / HOLD / EXHALE", 80% opacity cream, slow pulse
