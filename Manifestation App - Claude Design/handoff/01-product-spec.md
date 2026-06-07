# Product Specification

## The promise

> "Become her, quietly."

Anchor helps a user reach the future version of themselves through a daily 90-second practice. It is a **ritual app**, not a goal-tracker. The difference matters: we never measure performance, only the showing-up.

## The three-act loop

The whole product is one loop:

```
MANIFEST   →   VISUALIZE   →   DOCUMENT   →   (loop)
(once)         (daily AM)       (all day)
```

| Act | When | What happens | Frequency |
|---|---|---|---|
| **Manifest** | First open + occasionally | User builds/edits a *vision board* — a named, photographed, identity-stated picture of who they are becoming, scoped to one life area. | Initial setup; quarterly re-mapping; ad-hoc additions. |
| **Visualize** | Every morning at user-set time (default 7am) | A 90-second voiced ritual: Settle → Breathe → Picture → Anchor → Send-off. The vision board breathes behind a soft cosmic field. | Daily. The atomic unit of the product. |
| **Document** | Throughout the day | User captures *wins* — small text+photo notes proving the vision is real-in-progress. Tagged to a vision area. | 0–N times per day. Average target: 1–3. |

## The anatomy of a vision board

A vision board is a single object the user creates and re-creates over time. It has:

- **Area** — one of `Career | Health | Love | Finance | Joy | Custom`. The photo aesthetic and default copy hint at this.
- **Name** — 2–5 words, italic-sentence-cased. e.g. "The Studio of My Own", "A Body That Trusts Me".
- **Identity statement** — present-tense, 1–4 sentences, beginning with "I am". e.g. *"I am a sought-after designer. My calendar is mine. My work travels."* This is what the morning ritual will read.
- **Photographs** — 3–5 images chosen from a curated library and/or uploaded. Warm, desaturated, film-grain. Texture, not aspiration.

Users may have **multiple vision boards** (multi-area). Free tier: 1 board, 3 areas. Devoted+: unlimited.

## The anatomy of a win

A win is a single captured moment. It has:

- **Body** — text, 1–~280 chars, plain. e.g. *"Sent the proposal without a single 'just'."*
- **Photo** — optional, single image. If present, the win renders photo-first.
- **Linked vision area** — required. One tap to assign at capture time.
- **Timestamp** — auto.
- **Visibility** — `private | witness`. If witness, the paired buddy sees it.

Wins are immutable once captured (edit window: 5 minutes). The archive is meant to be trusted as proof.

## Roles

- **The user** — the only first-class role.
- **The witness** — one paired buddy per user. Sees the user's `witness` wins. Can react with a single soft acknowledgement (no comments, no likes — see Witness spec). Witness pairing is symmetric: A's witness is B, and B's witness is A.

There are no groups, no public profiles, no follower graph. Anchor is intentionally not social.

## Subscription tiers

| Tier | Price | Includes |
|---|---|---|
| **Curious** | Free | 1 board, 3 areas, daily ritual, basic voice. |
| **Devoted** | $12/mo (7-day free trial) | Unlimited boards/seasons, paired witness, three voices, full archive, Sunday integration. |
| **The Year** | $108/yr (save $36) | Everything in Devoted, printed proof book mailed in winter, quarterly re-mapping with a guide. |

The paywall is shown after the user completes their first **3 mornings**, not before. Anchor must earn trust before it asks.

## The metrics we care about

In priority order:

1. **Mornings completed in week 1** — leading indicator of habit formation.
2. **Wins captured per active day** — depth of engagement.
3. **Day-30 retention** — the only retention number that matters; this is a habit product.
4. **Witness pair rate** — drives Day-90 retention.
5. **Curious → Devoted conversion** — at day 7, day 30, day 90.

We do **not** show streak counts, badges, level-ups, or scores anywhere in the product. Internal dashboards only.

## What Anchor is not

- Not a journaling app (the unit is "wins," not "entries")
- Not a habit tracker (no checkboxes, no streak punishment)
- Not a meditation app (the ritual is identity work, not presence work)
- Not a goal app (no deadlines, no metrics)
- Not a social network (one witness, one-way, soft)
- Not a productivity tool (we never use the word)

If a feature doesn't fit the three-act loop, it doesn't ship.
