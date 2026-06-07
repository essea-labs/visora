# Interaction Map

This is the navigation graph and the moments where things happen. Read it as: "user is at X → does Y → arrives at Z."

## Top-level navigation

```
                 ┌──────────────┐
                 │  Onboarding  │ (11 beats, run once)
                 └──────┬───────┘
                        ▼
        ┌───────────────────────────────┐
        │       MAIN TAB BAR            │
        │  Today  ·  Vision  ·  Wins    │
        └─────┬──────────┬───────┬──────┘
              │          │       │
              ▼          ▼       ▼
            (01)        (02)   (03)
```

Settings (15), Premium (16), Witness (14) sit **outside** the tab bar. They're reached from:
- Settings → top-right gear on Today
- Premium → Settings → Membership row, or contextual upsells
- Witness → bottom-right "witness" ghost button on Today, or from a witness win notification

## Today (01) — the morning home

```
TODAY screen
├── If today's ritual not completed
│   └── Big amber CTA "Begin morning · 90s" → MORNING RITUAL (R01–R05)
├── If today's ritual completed
│   ├── Two slips visible (AM, DO)
│   └── Small "Today's intentions read" caption
├── Tap top-right gear → Settings (15)
├── Tap witness orb → The Witness (14)
└── Tap "+ Add a win" or pull-up → Capture · Empty (10)
```

## Morning Ritual flow

The ritual is a **sealed sequence**. Once started, all top-level navigation is hidden.

```
Today CTA / Push notification
        │
        ▼
   R01 Settle (15s, auto)
        │
        ▼
   R02 Breathe (20s, auto)
        │
        ▼
   R03 Picture (35s, auto)        ← identity statement read
        │
        ▼
   R04 Anchor (15s, auto)         ← today's intentions revealed
        │
        ▼
   R05 Send-off (5s, auto)
        │
        ▼
   Today screen, ritual marked complete
```

**Interrupts:**
- Skip button (appears after 8s) → straight to Today.
- Phone call / app backgrounded → pause; resume within 60s; abort after.
- Audio failure mid-ritual → silent fallback with on-screen text + chimes.

## Vision tab (02) — Vision Board flow

```
VISION BOARD (02 · 2-col grid of life areas)
├── Tap a filled card
│   └── VISION PLAYER (04, immersive) — tap to dismiss
├── Tap an empty card  ─┐
├── Tap "+ Add an area" ─┤
│                        └── VISION-AREA MINI-SHEET
│                               (one photo + name + identity → Add to board)
└── Long-press a filled card
    └── VISION DETAIL (05, manage)
        ├── Edit identity
        ├── Replace photo
        ├── See linked wins
        └── Re-map this season (Year tier only)
```

## Wins tab (03) — archive + capture

```
WINS ARCHIVE
├── Pull down → SEARCH (13)
├── Tap a tile → WIN DETAIL (12)
├── Pinned bottom CTA → CAPTURE EMPTY (10)
└── Tap area filter chip → filtered archive

CAPTURE flow:
  10 (empty)
  ├── type → 11a (text)
  │   └── attach photo → 11b (with photo)
  ├── tag area → required to send
  ├── tap "Witness" toggle → marks visibility
  └── Send → returns to Wins archive (new tile fades in at top)

WIN DETAIL (12)
├── 5-min edit window: tap "edit" if within
├── Share-to-witness toggle (one-way)
└── Soft delete (5s undo)
```

## Witness flow

```
THE WITNESS (14)
├── No pair yet
│   └── Tap "Invite" → contacts → SMS deep link → recipient app open → Onboarding (if new) → accept screen [GAP] → paired
├── Pair active
│   ├── Buddy's recent wins (one-way feed)
│   └── Tap a win → soft "seen" pulse (no comments)
└── Settings → Witness → "End pair" (with confirmation)
```

## Premium / Devotion flow

Trigger contexts:
1. **First soft prompt:** day 4, end of Today screen ("you've shown up 3 mornings — there's more")
2. **Feature gate:** trying to add a 2nd vision board on Curious tier
3. **Settings → Membership row tap**

```
PREMIUM (16)
├── Hero pitch + 3 tiers
├── Tap "Begin · 7 days free" (Devoted)
│   └── Apple subscription sheet → success → Today (with subtle "welcome to Devoted" toast)
├── Tap "Commit to the year"
│   └── Apple subscription sheet → success → Today
└── Tap close → returns to entry context
```

## Settings flow

Most rows just open a sub-screen. The dangerous ones:

- **Sign out** → confirmation modal → marketing entry
- **Account → delete** → confirmation modal → 7-day recovery window → permanent deletion

## Notification map

| Trigger | Type | Destination |
|---|---|---|
| Morning ritual time | Push, soft sound | Direct → Morning Ritual R01 |
| Buddy captured a win | Push, silent | The Witness (14) |
| 3-day "we miss you" | Push, kind copy | Today |
| Sunday integration ready | Push | Sunday recap (gap — not yet designed) |
| Yearly proof book ships | Push (Year tier) | Settings → Membership |

All notifications respect Quiet Hours (default 9pm–7am). Witness notifications batch in 4-hour windows — never more than one per window.

## Empty / edge states (a checklist)

- [ ] First open, no boards yet → Onboarding
- [ ] Today, ritual not yet completed
- [ ] Today, ritual completed
- [ ] Vision tab, multiple boards (board switcher)
- [ ] Vision tab, no boards (shouldn't happen post-onboarding, but handle: redirect to creation)
- [ ] Wins archive, zero wins → soft prompt
- [ ] Wins archive, < 5 wins → no masonry, single column
- [ ] Wins capture, no area selected → CTA disabled
- [ ] Witness, no pair → invite affordance
- [ ] Witness, pair pending → "she hasn't accepted yet"
- [ ] Witness, pair active, no wins this week → "she's quiet today"
- [ ] Offline mode → wins still capture; ritual falls back if no audio
- [ ] Audio generation failed → silent ritual with chimes
- [ ] Subscription expired → graceful downgrade to Curious; gated features show soft upgrade prompt
- [ ] Photo upload failed → retry with breathing orb spinner
- [ ] Identity statement too long → soft truncation indicator at 350/400 chars

## Gestures

- **Tap** — primary action
- **Long-press** — secondary (open Vision Detail on a board card, quick-react on witness wins)
- **Swipe down on Wins** — reveal Search
- **Swipe down on a fullscreen** (Vision Player, Win Detail) — dismiss
- **Pull-to-refresh** — Today only; respects breath rhythm

We do **not** use:
- Pinch / zoom (the photos do not zoom — they breathe)
- Multi-finger gestures
- 3D Touch / haptic-press menus (use long-press instead, accessibility-friendly)
