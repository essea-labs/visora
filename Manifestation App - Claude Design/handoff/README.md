# The Anchor Method — Engineering Handoff

> A 90-second daily ritual for becoming the future version of yourself.
> Manifest · Visualize · Document.

This folder is the complete handoff for building Anchor as a real product. The HTML mocks in this project (`/index.html`) are the source of truth for visual fidelity; this folder translates them into specifications a backend + iOS team can build against.

---

## What's in here

| File | For |
|---|---|
| `README.md` (this file) | Orientation. Read first. |
| `01-product-spec.md` | What Anchor *is*. The promise, the loop, the unit economics. Read before writing code. |
| `02-architecture.md` | Stack recommendation, data model, sync model, voice/audio pipeline. |
| `03-design-system.md` | Tokens (colors, type, spacing, motion), the warm-cosmic register, photography rules. |
| `04-components.md` | Reusable primitives — orbs, slips, vision photos, tab bar, status bar — with props and visual specs. |
| `05-screens.md` | Every screen, every state. Maps each mock artboard to its real-world spec. |
| `06-interaction-map.md` | The flows. What happens when a user taps anywhere. |
| `07-copy-deck.md` | All voice + UI copy in one place. The brand voice belongs here, not in components. |

The HTML mocks are React+JSX in this project root (`screen-*.jsx`, `shared.jsx`). They're the **visual** reference. These markdown docs are the **product** reference. Where they disagree, the markdown wins.

---

## The product, in 60 seconds

Anchor is a **daily-ritual app** for personal becoming, in three acts:

1. **Manifest** — once, the user builds a *vision board* for one life area (Career, Health, Love, Finance, Joy, or custom). It has a name ("The Studio of My Own"), a present-tense identity statement ("I am a sought-after designer…"), and 3–5 photographs.
2. **Visualize** — every morning, a 90-second voiced ritual walks the user through her vision. Five beats: Settle → Breathe → Picture → Anchor → Send-off.
3. **Document** — throughout the day, the user captures tiny "wins" (text + optional photo, tagged to a vision area). Wins are evidence she's already becoming her.

A **witness** (one paired buddy) optionally sees her wins in a one-way feed. No likes, no comments — just attention.

There is no streak counter. No leaderboard. No public profile. The whole product is intimate and quiet.

---

## What we built (mocks)

The mocks cover **16 artboards** across 7 sections:

- **Onboarding** (11 beats) — welcome → method → why → loop → pick area → name → identity → photos → board reveal → buddy → ready
- **Three tabs** — Today / Vision / Wins
- **Morning Ritual** — 5 beats, full sequence
- **Vision world** — Player (immersive), Detail (manage)
- **Vision creation** — 4 steps (area → name → identity → photo)
- **Wins** — Capture (3 modes), Detail, Search
- **Buddy** — The Witness pair
- **Settings & Devotion** — Quiet keeping, Paywall

All mocks live in `/index.html`. Open it in any browser to navigate the canvas.

---

## What we did NOT mock (and you'll need)

- Streak recovery / "I missed a day" empty state
- Vision area re-mapping (quarterly, on the Year tier)
- Notification copy / lock-screen previews
- Sign-in / account creation (we only show the marketing entry)
- Apple Health, Calendar, or Photo Library integration prompts (if scoped)
- Server-side audio generation pipeline for voiced rituals
- Witness invite flow on the receiver's side
- Sunday "integration session" recap (deferred from mocks)

These are listed in `05-screens.md` as **gaps** so you know to design them before shipping.

---

## Recommended build order

1. **Foundations** — design system, navigation shell, auth, base data model.
2. **Manifest flow** — onboarding through first vision board. This is the conversion moment.
3. **Document loop** — Wins capture, archive, search. Daily-active depends on this.
4. **Visualize flow** — Morning Ritual + voice/audio. Most expensive piece.
5. **Witness** — buddy pairing + one-way feed.
6. **Devotion** — paywall, subscription plumbing, quiet upsells.
7. **Polish** — settings, milestones, recovery, integrations.

Phase 1–3 is shippable as a free product. Phase 4 unlocks the magic. Phase 5+ are upgrades.

---

## Brand voice — the one rule

Every word in the product is written from a **soft, deliberate, slightly literary** voice. We say "she" for the future self. We say "quietly," "gently," "the work." We never say "achievement," "goal," "productivity," "streak," "score."

The voice is in `07-copy-deck.md`. Read it before you write any new microcopy.

---

## Questions / discrepancies

If you find a place where the mocks and these docs disagree, or where something is unspecified, file it in your tracker as `anchor-handoff-gap`. We'll resolve in the design review.
