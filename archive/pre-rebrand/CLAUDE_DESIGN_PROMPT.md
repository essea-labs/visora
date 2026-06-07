# Claude Design Prompts — The Anchor Method

Copy-paste-ready prompts for high-quality design generation in Claude (claude.ai web artifacts, Claude Code, design subagents).

**Version:** Post-pivot · 2026-05-01
**Use:** Paste the MASTER PROMPT first, then issue specific screen requests as follow-ups.

---

## 🎯 MASTER PROMPT

Paste this verbatim to establish full context. Then issue screen-specific follow-up prompts.

```
I'm designing a mobile app called "The Anchor Method" and I need production-grade
HTML/CSS mockups (browser-viewable) — NOT generic AI-styled designs.

Use the frontend-design skill if available. If you have a code-design subagent,
use it. I want distinctive, opinionated design — not safe defaults.

═══════════════════════════════════════════════════════════════════
WHAT THE APP IS (one sentence)
═══════════════════════════════════════════════════════════════════

A personalized 90-second daily audio ritual that uses your specific visions
and identity statements to walk you through visualization, breath, and intention.
Throughout the day you capture wins. Over months a constellation visualization
fills with proof of your becoming.

It is NOT a journaling app. It is NOT a meditation app. It is NOT a goals app.
It is a personalized identity-based practice with a visceral proof loop.

Tagline: "A personalized ritual that turns your intentions into evidence."

Target audience: 25-40, all genders, "spiritual but skeptical" — people who
read Robbins/Dispenza/yoga literature but want evidence-based framing, not woo.

═══════════════════════════════════════════════════════════════════
ARCHITECTURE
═══════════════════════════════════════════════════════════════════

Three bottom tabs:
  HOME    — daily ritual surface (greeting, ritual CTA, quote, intentions)
  WINS    — pure chronological gallery of captured wins (FAB "Add win")
  VISION  — vision board (scrapbook style) + constellation visualization

Anchor FAB ("Add win") lives ONLY on the Wins tab. Not global.
Bottom tab bar present on all three. No tab bar on detail/modal views.

═══════════════════════════════════════════════════════════════════
VISUAL SYSTEM — LOCKED. DO NOT DEVIATE.
═══════════════════════════════════════════════════════════════════

TYPOGRAPHY
- General Sans (Fontshare CDN: api.fontshare.com/v2/css?f[]=general-sans)
- Weights: 300, 400, 500, 600, 700
- NO serifs for UI (one exception: decorative `"` mark in quote card uses Georgia)
- NO Inter, NO SF Pro, NO system sans only
- Scale: display 28-32px / titles 17-20px / body 14-15px / meta 10-11px uppercase

COLOR PALETTE (use these EXACT hex values)
--bg:            #FAF6EF  /* warm cream page */
--bg-soft:       #F4EEE2
--surface:       #FFFFFF
--paper:         #FCF5E8  /* paper slips */
--hairline:      rgba(62,47,34,0.08)

--terra:         #C06848  /* primary action / FAB */
--terra-deep:    #9E4F32
--terra-light:   #E8A07A
--terra-pale:    #F5DBC9

--sage:          #7A9470  /* quote card, balance */
--sage-deep:     #556B4F
--sage-pale:     #D8E4D2

--amber:         #D89A5A  /* identity tags, streak */
--amber-deep:    #9B6B2F
--amber-pale:    #F5E4CF

--ink:           #3E2F22  /* text — warm espresso, NOT BLACK */
--ink-soft:      #6B5847
--muted:         #9A8D7E
--muted-soft:    #C9BEB0

VISUAL MOTIFS (the brand)
1. Paper slips — cream paper, slight rotation (-1.2° to 0.6°), 1px amber
   border, tape detail at top. Used for: morning intentions, affirmations.
2. Sage "framed wisdom" quote card — deep sage gradient bg, large decorative
   `"` mark in Georgia (10% white opacity), italic cream text, amber radial
   glow bottom-right.
3. Hairline borders — 1px @ 8% ink opacity. Never gray.
4. Warm shadows — always tinted (amber/terra/sage). Never neutral gray.
5. Real photography on vision cards — handmade subtle rotations.
6. Constellation — stars on deep cosmic gradient, amber line connectors
   weighted by recency (recent = brighter).

ANTI-PATTERNS (NEVER USE — these will look generic AI)
❌ Glass-morphism, heavy backdrop-filter blur as decoration
❌ Purple, blue, neon, or cool gradients
❌ Pure black (#000) — always warm espresso (#3E2F22)
❌ Sterile gray hairlines or shadows
❌ Inter / SF Pro / generic system sans
❌ Generic SaaS aesthetic (clean white minimalism)
❌ Apple HIG default look
❌ "Wellness app" cliché (light pink, soft lavender, watercolor swirls)
❌ Cosmic/woo imagery in main UI (galaxies, crystals, rainbow auras)
   — exception: Constellation view CAN feel cosmic, just warm-toned
❌ Toxic positivity copy ("YOU GOT THIS QUEEN", "MANIFEST YOUR DREAMS")
❌ Generic emoji-heavy interfaces
❌ Default Bootstrap / Tailwind UI vibes

REFERENCE AESTHETIC (for taste calibration)
- Warmth of: Day One journal app, Tara Brach's website, Marfa-style desert luxury
- Editorial of: Cereal magazine, Kinfolk, Wirecutter
- Warmth + craft: Frank app, Notion's softer surfaces
- AVOID copying: Calm (too cosmic), Headspace (too primary-color), Stoic
  (too stark), Manifest by Roxie (too gold-luxe)

═══════════════════════════════════════════════════════════════════
CORE COMPONENTS (REUSE THESE EXACTLY)
═══════════════════════════════════════════════════════════════════

DEVICE FRAME
- 390x844, 48px radius, multilayer shadow:
  0 0 0 1px rgba(62,47,34,0.04), 0 30px 60px -10px rgba(62,47,34,0.20)
- Background wash: radial gradients (warm) at 20%/-5% terra-light, 50%/120% sage

STATUS BAR
- Sticky top, 14px font 600 weight, ink color
- Battery + signal SVGs at right
- Background: linear-gradient cream → translucent + 10px backdrop-blur

PAPER SLIP
.slip {
  background: var(--paper);
  border: 1px solid rgba(216,154,90,0.15);
  border-radius: 8px;
  padding: 14px 16px 16px;
  box-shadow: 0 3px 8px rgba(62,47,34,0.08);
}
.slip:nth-child(1) { transform: rotate(-1.2deg); }
.slip:nth-child(2) { transform: rotate(0.6deg); }
.slip:nth-child(3) { transform: rotate(-0.4deg); }
.slip::before {
  content: '';
  position: absolute; top: -6px; left: 50%;
  transform: translateX(-50%) rotate(-3deg);
  width: 22px; height: 10px;
  background: rgba(216,154,90,0.25);
  border-radius: 1px;
}

LABELS ON SLIPS
- "I AM" (identity) → color: var(--amber-deep), with a 5px dot
- "TODAY, I WILL" (action) → color: var(--terra-deep), with a 5px dot
- 10px font 700, 1.2px letter-spacing, uppercase

FAB (Wins tab only)
height: 56px; padding: 0 22px 0 18px; border-radius: 28px;
background: linear-gradient(135deg, var(--terra) 0%, var(--terra-light) 100%);
position: absolute; right: 24px; bottom: 94px;
box-shadow:
  0 10px 28px rgba(192,104,72,0.35),
  0 4px 10px rgba(158,79,50,0.2),
  inset 0 1px 0 rgba(255,255,255,0.22);
SVG anchor icon (Lucide style) + label "Add win"

TAB BAR
height: 78px; padding: 10px 16px 24px;
background: rgba(250,246,239,0.92); backdrop-filter: blur(24px);
border-top: 1px solid var(--hairline);
3 items: Home (house icon) · Wins (anchor icon) · Vision (compass/sparkle icon)
Active: terra-deep color + 2.4 stroke-width. Inactive: muted color.

QUOTE CARD (sage framed wisdom)
margin: 4px 24px 28px; padding: 30px 26px 24px;
background: linear-gradient(160deg, #7A9470 0%, #556B4F 100%);
border-radius: 22px;
::before — large decorative `"` (Georgia 130px, 10% white opacity, top-left)
::after — radial amber glow bottom-right (rgba(216,154,90,0.28))
Body: italic 18px cream (#FAF6EF) line-height 1.5
Meta: 10.5px uppercase 1.5px letter-spacing, cream-78% opacity

═══════════════════════════════════════════════════════════════════
WHAT TO DESIGN (I'll specify in follow-up)
═══════════════════════════════════════════════════════════════════

For each screen request:
- Build as a self-contained HTML file in design/preview/
- Show 2-3 variants side-by-side when there's an open design question
- Include thoughtful microcopy (avoid generic placeholder text)
- Use placeholder images from design/preview/vision-assets/ if needed
- Leave detailed comments in code so future me can navigate

═══════════════════════════════════════════════════════════════════
HOW TO RESPOND
═══════════════════════════════════════════════════════════════════

1. Ask 1-2 clarifying questions ONLY if essential. Otherwise just build.
2. Show 2-3 design directions when there's a real open question.
3. NEVER deviate from the locked visual system above.
4. If something feels generic AI to you, scrap it and try harder.
5. Aim for "this feels like nothing else on the App Store."

Ready. The first screen I want you to design is: [SPECIFY HERE]
```

---

## 🎨 SCREEN-SPECIFIC PROMPTS

After the master prompt is loaded, use these as the "first screen I want you to design" line:

---

### A. Morning Ritual — Audio + Breathing Orb Experience

```
The MORNING RITUAL is the heart of the app. It's a 90-second guided audio
experience with minimal visuals. Walk me through it as a sequence of 5 screens
side-by-side (mobile device frames).

Structure:
1. ENTER (3s) — "Begin?" with breathing-orb animation forming, ambient hint
2. BREATH (10s) — Orb pulses to breath cadence, "Inhale… exhale…" subtle text
3. PICTURE (40s) — User's vision photo subtly behind orb, copy: "Picture
   yourself today as someone who already has [Work for myself]…"
4. BE + DO (35s) — User picks one of 3 AI-suggested "Today, I will…" actions
   from a soft chip selector. Identity statement reads above: "Today, I am
   grounded, open, and unafraid."
5. CLOSE (10s) — "Carry this with you." Final breath. Subtle confetti? No,
   too celebratory. A soft fade with the orb dimming.

Visual goals:
- Feels like a meditation, not an app screen
- Audio is the lead — text is supporting, not primary
- Breathing orb: warm gradient (amber → terra → sage), 200px diameter,
  pulses 4s in / 6s out (~6 breaths/minute, calming)
- Background: subtle vision photo blurred 40px, warm overlay at 80%
- Skip button top-right (small, muted, never aggressive)
- "Listen" toggle if user wants text-only

Show me the 5 screens as one HTML file, side-by-side, mobile frames.
Make this feel sacred and rare — not like another wellness app screen.
```

---

### B. Constellation View — Visceral Proof Loop

```
The CONSTELLATION is our visceral proof loop — Notes/Pinterest/competitors
literally cannot show this. It's the visualization moat.

Build a full-screen view ("Your sky") accessible from the Vision tab.

Concept:
- Background: deep cosmic gradient (warm — espresso #3E2F22 to terra-deep
  #5A3E28 to deep amber #2A1F15). NOT blue/purple cosmic. Warm cosmic.
- Each VISION = a large star (24-36px diameter), positioned in space,
  glowing softly with a sage or amber halo. Vision title appears next
  to it as small caps.
- Each LINKED WIN = a smaller star (6-12px) connected to its vision via
  a thin amber line.
- Lines weighted by recency: recent wins glow at 100% opacity, older
  ones fade to 30%.
- Wins cluster around their vision-star — closest wins are recent, distant
  wins are older. Creates a galaxy-like density per vision.
- 4-5 visions = 4-5 mini-galaxies in space.

Interactions (annotate in design):
- Tap a vision star → expands to show that vision's full info
- Tap a win star → win detail modal slides up
- Pinch-zoom to dive deeper into a galaxy
- Top-right: toggle between "Sky" (constellation) and "Board" (current
  scrapbook view)

Don't make it cheesy or MySpace-y. Think: a real personal cosmos. Sparse,
elegant, warm. Sub-Reddit r/Astronomy meets Calm — but warmer.

Show me 2 directions:
A. Sparse + elegant (few wins, lots of breathing room)
B. Dense + alive (50+ wins per vision, looks like real galaxies)

This is the MOAT screen. Don't phone it in.
```

---

### C. Onboarding Flow — 7 Screens

```
Build the ONBOARDING FLOW — 7 screens side-by-side as one HTML file.

Tone: warm, low-pressure. ONE required step (first vision, Screen 3) because
the morning ritual depends on it. Everything else is skippable with graceful
fallback.

1. WELCOME — "This is your space. No pressure. No judgment. A place to
   get clear and keep proof." Single CTA "Begin." Subtle breathing orb
   in background.

2. TEACH THE LOOP — One screen showing the Be → Do → Have framing
   visually. Three nested circles or a flowing diagram: "Vision" >
   "Identity" > "Action" > "Proof". One paragraph of copy below.
   "Your vision is the destination. Your identity points the way.
   Your daily actions are the steps. Your wins are the proof."
   CTA: "Got it."

3. FIRST VISION (REQUIRED — no skip link) — "What are you calling in?"
   Free-text title input. Bottom: 6 life-area chips (Career, Love,
   Health, Finance, Growth, Joy). Below: 3 image-source buttons (My
   Photos, Browse Library, Paste URL). Continue CTA disabled until
   title + life area chosen. Microcopy: "We'll use this to personalize
   your morning ritual."

4. IDENTITY STATEMENT — "Who are you becoming?" Placeholder shows:
   "I am someone who…" Free-text input. Below: 3 example identity
   statements as gentle suggestions ("I am someone who chooses
   herself first", etc.). Skip link.

5. BUDDY — "Who's holding the rope with you?" Two options ONLY (no AI
   match):
     [a] "Invite a friend" → SMS / share-link to a friend who installs
         and links back. This is the growth loop — frame it as
         empowering, not a chore.
     [b] "I'll do this on my own for now" → skip, unlockable later
   Each option styled as a tappable card with an icon + 1-line
   description. Buddy mechanic explained briefly: "They see your vision
   titles + streak. Wins stay private. One-tap nudges only — no chat."
   IMPORTANT: do NOT include any "match me with a stranger / AI match /
   anonymous buddy" option. We removed that — friend invite is the only
   real-buddy path.

6. FIRST RITUAL PREVIEW — A taste of the morning ritual. 30-second
   scaled-down version using the user's just-created vision. Or
   a "Schedule for tomorrow morning" option.

7. NOTIFICATION PERMISSION — "We'll send you the ritual cue each morning.
   Tap a time." Time picker. Subtle disclaimer: "We never spam." iOS
   permission prompt fires on continue.

Each screen: full-bleed mobile, generous whitespace, single primary CTA.
Skip link bottom on screens 4-7 (NOT on 3 — required). Never use an "X"
close affordance.

Use the visual system. Show transitions between screens (subtle next-page
hints visible). This is someone's first impression of the app — make it
feel like the most beautiful onboarding they've ever done.
```

---

### D. Win Capture Sheet

```
Build the WIN CAPTURE SHEET — the bottom sheet that slides up when user
taps the "Add win" FAB on the Wins tab.

Show 3 states side-by-side:
1. INITIAL — sheet opens, text input mode (default), keyboard auto-focused.
   Mode selector at top: [Text] [Voice] [Photo].
2. TEXT FILLED — user has typed a win. Optional vision-link chip appears
   below the text ("Link to a vision? →" with 3 vision thumbnails).
   Tags chips. "Save" button bottom.
3. VOICE RECORDING — hold-to-record state. Big waveform visualizer in
   center. "Recording 0:08" timer. Release to save.

Sheet design:
- 90% height, top 24px radius, drag handle at top
- Frosted-cream background with warm glow
- Single primary action (terra) — "Save"
- Secondary action (muted) — "Cancel"

The capture should feel instant and frictionless. <10s to log a text win.
Show the empty-state placeholder text suggesting a moment: "What just
happened that's worth remembering?"
```

---

### E. Buddy Strip + Nudge Interaction

```
Build the BUDDY UI on the Home tab. Three states side-by-side:
1. NO BUDDY YET — invite-prompt strip: "Invite someone to build with you"
   + small "Invite" CTA. Subtle, not nagging. Lives above ritual CTA.
2. BUDDY ACTIVE — strip showing buddy's real first name, their current
   "active this week" status, vision they're working toward (title only),
   and a single nudge button (tap to expand into emoji palette: 🌱 🔥 💎 🌅).
3. NUDGE SENT — confirmation ("Nudge sent! [Buddy] will get it shortly")
   with small celebration animation.

Buddy strip should be subtle — not dominant. Lives above the ritual CTA on
Home. Single-line height by default; expandable on tap to show their visions
list (titles only) and a "send nudge" interface with 4 emoji options.

Privacy framing must be obvious — micro-copy: "They see your vision titles +
streak. Wins stay private."

IMPORTANT: there is NO anonymous / AI-matched buddy mode. Every buddy is a
real friend the user invited via SMS/share-link. Don't design pseudonym states
or "Sage from Boston" placeholder identities — that mechanic was cut.
```

---

### F. Vision Detail (with mini-constellation)

```
Build the VISION DETAIL screen — what users see when they tap a vision card
on the board.

Structure:
- Top: hero photo (full bleed, 60vh)
- Hero overlay: vision title (large, white) + identity statement (italic,
  cream, smaller). Back arrow top-left, edit/menu top-right.
- Below hero: "X wins linked" — a mini-constellation showing this vision
  as the central star with linked wins orbiting. ~120px height visualization.
- Below constellation: chronological list of linked wins as small cards
  (date + 1-line text + thumbnail if photo).
- Bottom: "Edit vision" + "View in sky" (links to full constellation)

This is where the loop becomes visible per-vision. The user sees "12 wins
toward this vision over 3 months" — visually, not as a number.

Design with care — this is a high-emotion screen. Every detail matters.
```

---

## 🔧 PROMPTING TIPS THAT WORK

When you're not happy with the output, escalate with these:

```
This feels generic AI to me. Specifically: [name what feels generic —
e.g., "the gradient is too boilerplate", "the spacing is too uniform",
"this could be any wellness app"]. Try harder. Reference specific apps
that nail this aesthetic: [Day One, Things 3, Frank, Cereal magazine].
```

```
Show me 3 directions with intentionally different opinions:
A. The safe choice — what most apps would do
B. The bold choice — what would make this app distinctive
C. The unexpected choice — what would surprise me
Don't give me three variations of the same idea.
```

```
The visual system is locked but the LAYOUT is open. Try a layout I haven't
seen — what if [give a specific direction: "the ritual entry was a single
giant pulsing button instead of a card", "the tab bar was floating instead
of bottom-attached", etc.]
```

---

## 📋 CHECKLIST BEFORE ACCEPTING A DESIGN

Before locking any screen, verify:

- [ ] General Sans only (no system sans)
- [ ] Ink color is `#3E2F22` (warm espresso), never pure black
- [ ] Hairlines at 8% ink opacity, never gray
- [ ] Shadows are warm-tinted, never neutral gray
- [ ] No glass-morphism / heavy blur as decoration
- [ ] No cool gradients (purple/blue/neon)
- [ ] Microcopy is human, specific, not generic ("What just happened
      that's worth remembering?" beats "Add a new entry")
- [ ] FAB only on Wins tab
- [ ] Tab bar terra-deep on active state
- [ ] Real photography on vision cards (not illustrations or icons)
- [ ] No toxic positivity copy
- [ ] Identity-first framing where applicable (I AM / TODAY, I WILL)
- [ ] Skip-friendly — every step has a graceful exit

---

## 🎯 NEXT STEPS RECOMMENDED ORDER

1. Hire a brand designer (1-2 weeks) to lock final visual identity refinements
2. Use Master Prompt + Screen A (Morning Ritual) — this is the core experience
3. Screen B (Constellation) — the visualization moat
4. Screen C (Onboarding) — first impression
5. Screen D (Capture) — the most-used flow
6. Screen E (Buddy) — the retention/growth hook
7. Screen F (Vision Detail) — high-emotion deep-dive
