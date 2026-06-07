# Design System

The visual language is **warm, cinematic, and quiet**. Think: morning light through linen curtains, a single warm lamp, the cosmos at dusk. Never glossy, never neon, never aggressive.

## The two registers

Anchor lives in two visual modes that the user moves between:

| Register | Where it appears | Mood |
|---|---|---|
| **Daylit** (cream background, ink type) | Today, Wins, Vision detail, Search, Buddy detail, Settings sub-screens | Open, calm, readable. The day. |
| **Cosmic** (deep warm-black gradient, cream type, amber accents) | Onboarding, Morning Ritual, Vision Player, Vision Board reveal, Premium, Settings header | Intimate, ceremonial. The interior. |

The transition between them is a moment, not a glitch. Animate with a 400–600ms cross-fade when crossing registers.

## Color tokens

Three palettes are exposed; **A is canonical**. B and C exist for the brand-system tweak panel and seasonal moods.

### Palette A — Cream / Terracotta / Sage (default)

```
Surfaces
--bg          #FAF6EF   page background (daylit)
--bg-soft     #F4EEE2   recessed surfaces, dividers
--surface     #FFFFFF   cards
--paper       #FCF5E8   warm paper, slip notes

Cosmic register
--cosmic-a    #2A1F15   base (deepest)
--cosmic-b    #4B2E1E   mid
--cosmic-c    #7A4530   top edge / glow

Hierarchy
--ink         #3E2F22   headlines, body
--ink-soft    #6B5847   secondary
--muted       #9A8D7E   tertiary, captions
--muted-soft  #C9BEB0   placeholder, hairline labels
--hairline    rgba(62,47,34,0.08)   1px dividers

Brand colors
--terra       #C06848   primary action, identity
--terra-deep  #9E4F32   pressed, deep accent
--terra-light #E8A07A   highlights, italic emphasis
--terra-pale  #F5DBC9   tinted surfaces

--sage        #7A9470   secondary action, "tip"
--sage-deep   #556B4F
--sage-pale   #D8E4D2

--amber       #D89A5A   ritual glow, eyebrow accents
--amber-deep  #9B6B2F
--amber-pale  #F5E4CF
```

**Palette B (Blush/Sand/Gold)** and **Palette C (Butter/Rust/Olive)** are defined in `shared.jsx` `PALETTES.B` / `PALETTES.C`. Same token shape; different hex.

### Color usage rules

- **Terra** is the primary. Use for primary buttons, the orb, identity emphasis. Sparingly.
- **Amber** is the ritual color. Use for eyebrows, glows, the morning. It is the "warm star" hue.
- **Sage** is the soft second. Tips, hints, gentle confirmations.
- **Cosmic** colors only ever appear in the cosmic register, and only as gradient stops — never as a flat fill.
- We do **not** use cool colors. No blue. No teal. No pure gray.

## Typography

**General Sans** (Fontshare) for everything. Weights: 300 / 400 / 500 / 600 / 700.

| Token | Size / Weight / Tracking | Usage |
|---|---|---|
| `display-xl` | 40 / 500 / -1.0 | Onboarding hero only |
| `display-l`  | 32 / 400 italic / -0.6 | Premium hero, identity callouts |
| `display`    | 28–30 / 500 / -0.7 | Onboarding/screen titles |
| `heading`    | 22 / 600 / -0.4 | Section headers, slip titles |
| `body-l`     | 15.5 / 500 / -0.1 | Primary body |
| `body`       | 14 / 500 / 0 | Default body |
| `body-s`     | 13 / 500 / 0 | Compact body, captions |
| `eyebrow`    | 10–11 / 700 / +2.2 / **uppercase** | Section eyebrows, ritual labels |
| `meta`       | 11 / 600 / +1.4 / **uppercase** | Tags, area labels |
| `voice`      | 12.5–14.5 / 400 italic / -0.1 | Voiced ritual cues, soft instruction |

**Italic is the brand voice.** Use italic for emphasis, identity moments, and "she." Roman for instruction and UI.

`text-wrap: pretty` on every paragraph. `text-wrap: balance` on display titles.

## Spacing scale

Multiples of 4. Common rhythms: 6, 8, 12, 14, 18, 22, 28, 32.
Outer screen gutters: **22–24px**.
Card inner padding: **18–22px**.
Section vertical rhythm: **28–32px** between major blocks.

## Radii

| Size | Use |
|---|---|
| 4 | Photo inner border, chip borders inside cards |
| 8–12 | Small chips, image thumbs |
| 14–18 | Slips, list rows |
| 22 | Cards, modals, hero blocks |
| 99 | Buttons, pills, orbs |

## Elevation / shadow

Cards do not "float." Use shadows sparingly:

```
slip          0 8px 22px -6px rgba(0,0,0,0.08)
photo-tilt    0 14px 30px -6px rgba(0,0,0,0.5)
photo-hero    0 22px 42px -8px rgba(0,0,0,0.6) + 0 0 24px var(--amber)44
button-cta    0 18px 40px var(--terra)55 + inset 0 1px 0 rgba(255,255,255,0.25)
orb           0 30px 80px -10px var(--terra)55, 0 8px 24px var(--terra)44
```

## Photography rules

The look of Anchor depends more on photography than on UI. Photos must be:

1. **Warm** — golden hour, tungsten interiors, dawn light. No fluorescent, no cool blue.
2. **Desaturated** — apply `saturate(0.85) contrast(1.02)`. Never raw-camera vivid.
3. **Texture-first** — wood, linen, skin, paper, plants, water. Avoid hard edges, screens, devices.
4. **Anonymous** — no recognizable faces, no celebrity-y aspiration. The user must be able to project themselves into the scene.
5. **Quiet composition** — single subject, low contrast, lots of negative space.

We curate **~200 photos** across the five default areas (Career, Health, Love, Finance, Joy). User uploads pass through a server-side desaturation/grain filter to match.

## Motion

- **Breath** is the master tempo: 4s in, 4s out. The orb breathes at this rate. Buttons that "wait" pulse softly at this rate too.
- Page transitions: **400ms ease-out** for cosmic↔daylit; **240ms ease-out** within a register.
- Tap feedback: 95% scale, 80ms.
- The orb is **never static**. Even on settings screens, it should breathe at 0.3 amplitude.

Reserve high-velocity motion (>0.4 amplitude) for the morning ritual only. Everywhere else, motion is faint.

## The orb

The orb is the brand mark. Specs in `04-components.md`. Treat it as sacred — don't redraw it ad-hoc. Always use the component.

## What we do not use

- Drop shadows on text
- Gradients on text
- Glassmorphism (frosted glass) outside the cosmic register
- Emoji
- Iconography for decoration (only for affordance)
- Border colors > 1.5px
- Skeuomorphism beyond the slip-of-paper metaphor for slips
- Loading spinners — use the breathing orb for any wait > 1s
