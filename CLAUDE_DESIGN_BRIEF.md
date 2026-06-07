# Claude Design Brief — One-Shot Prompt

A single self-contained prompt for generating the full app design in Claude (claude.ai artifacts, Claude Code with `frontend-design` skill, or any code-design subagent). Paste verbatim. The full spec lives in [SPEC.md](SPEC.md) — Claude can read it for deeper context on any feature.

**Last updated:** 2026-05-02

---

```
You are designing a mobile app called "The Anchor Method" (working name).

Use the `frontend-design` skill if available. If a code-design subagent is
available, use it. I want distinctive, opinionated, production-grade
HTML/CSS mockups — NOT generic AI-styled designs. If something feels safe
or generic to you, scrap it and try harder.

The full product spec is in SPEC.md in this directory. Read it before
designing — it has the why behind every decision.

═══════════════════════════════════════════════════════════════════
THE APP IN ONE PARAGRAPH
═══════════════════════════════════════════════════════════════════

A personalized 90-second daily audio ritual that uses your specific visions
and identity statements to walk you through visualization, breath, and
intention-setting. Throughout the day you capture wins. Over months a
constellation visualization fills with proof of your becoming.

Tagline: "A personalized ritual that turns your intentions into evidence."

It is NOT a journaling app. NOT a meditation app. NOT a goals app.
It is a personalized identity-based practice with a visceral proof loop.

Audience: 25-40, all genders, "spiritual but skeptical" — people who read
Robbins/Dispenza/yoga literature but want evidence-based framing, not woo.

═══════════════════════════════════════════════════════════════════
ARCHITECTURE
═══════════════════════════════════════════════════════════════════

Three bottom tabs:
  HOME    — daily ritual surface (greeting, ritual CTA, quote, intentions)
  WINS    — pure chronological gallery (FAB "Add win" — Wins tab only)
  VISION  — vision board (scrapbook style) + constellation visualization

The morning ritual is the heart of the app. It runs as a full-screen
audio + visual experience launched from a CTA on Home. 90 seconds.
Personalized to the user's actual visions and identity statement.

Daily loop: Morning ritual → auto-populates today's intentions on Home →
user captures wins throughout the day → wins linked to visions →
constellation grows → tomorrow's ritual references yesterday's wins.

═══════════════════════════════════════════════════════════════════
VISUAL SYSTEM — LOCKED. DO NOT DEVIATE.
═══════════════════════════════════════════════════════════════════

TYPOGRAPHY
- General Sans (Fontshare CDN: api.fontshare.com/v2/css?f[]=general-sans)
- Weights: 300, 400, 500, 600, 700
- NO Inter, NO SF Pro, NO system sans only, NO serif for UI body
- Single exception: decorative `"` mark in sage quote card uses Georgia
- Scale: display 28-32px / titles 17-20px / body 14-15px / meta 10-11px uppercase

COLOR PALETTE (use these EXACT hex values)
--bg:            #FAF6EF  /* warm cream page background */
--bg-soft:       #F4EEE2  /* deeper cream, section backgrounds */
--surface:       #FFFFFF  /* card white */
--paper:         #FCF5E8  /* paper-slip cream */
--hairline:      rgba(62,47,34,0.08)

--terra:         #C06848  /* primary action / FAB */
--terra-deep:    #9E4F32  /* active states */
--terra-light:   #E8A07A  /* gradients */
--terra-pale:    #F5DBC9  /* chips, tags */

--sage:          #7A9470  /* quote card, balance */
--sage-deep:     #556B4F
--sage-pale:     #D8E4D2

--amber:         #D89A5A  /* identity tags, streak, warmth */
--amber-deep:    #9B6B2F  /* I AM label */
--amber-pale:    #F5E4CF

--ink:           #3E2F22  /* TEXT — warm espresso, NEVER pure black */
--ink-soft:      #6B5847
--muted:         #9A8D7E
--muted-soft:    #C9BEB0

VISUAL MOTIFS (the brand DNA)
1. Paper slips — cream paper, slight rotation (-1.2° to 0.6°), 1px amber
   border, tape detail at top, warm shadow. Used for: morning intentions.
2. Sage "framed wisdom" quote card — deep sage gradient bg, large
   decorative `"` in Georgia (10% white opacity), italic cream body,
   amber radial glow bottom-right.
3. Hairline borders — 1px @ 8% ink opacity. NEVER gray.
4. Warm shadows — always tinted (amber/terra/sage). NEVER neutral gray.
5. Real photography on vision cards — handmade subtle rotations
   (-1.8° to 1.6°). No illustrations, no icons in place of photos.
6. Constellation — stars on warm cosmic gradient (espresso → terra-deep →
   deep amber, NOT blue/purple). Amber line connectors weighted by
   recency: recent wins glow at 100%, older wins fade to 30%.
7. Breathing orb (ritual screens) — 200px radial gradient (amber → terra
   → sage), pulses 4s in / 6s out for ~6 breaths/min cadence.

ANTI-PATTERNS (NEVER USE — these will make the design generic AI)
- Glass-morphism / heavy backdrop-filter blur as decoration
- Purple, blue, neon, or cool gradients
- Pure black (#000) — always warm espresso (#3E2F22)
- Sterile gray hairlines or shadows
- Inter / SF Pro / system sans
- Generic SaaS aesthetic (clean white minimalism, default Tailwind UI)
- Apple HIG default look
- "Wellness app" cliché (light pink, soft lavender, watercolor swirls)
- Cosmic/woo imagery in main UI (galaxies, crystals, rainbow auras) —
  exception: Constellation view CAN feel cosmic, but warm-toned only
- Toxic positivity copy ("YOU GOT THIS QUEEN", "MANIFEST YOUR DREAMS")
- Emoji-heavy interfaces
- Generic placeholder copy ("Add a new entry", "Tap here to begin")

REFERENCE AESTHETIC (taste calibration)
- Warmth of: Day One journal, Tara Brach's website, Marfa desert luxury
- Editorial of: Cereal magazine, Kinfolk, Wirecutter
- Craft of: Frank app, Notion's softer surfaces, Things 3
- AVOID copying: Calm (too cosmic), Headspace (too primary-color),
  Stoic (too stark), Manifest by Roxie (too gold-luxe)

═══════════════════════════════════════════════════════════════════
CORE COMPONENTS (REUSE EXACTLY)
═══════════════════════════════════════════════════════════════════

DEVICE FRAME
- 390x844, 48px radius, multilayer warm shadow:
  0 0 0 1px rgba(62,47,34,0.04), 0 30px 60px -10px rgba(62,47,34,0.20)
- Background wash: radial gradients (warm) at 20%/-5% terra-light, 50%/120% sage

PAPER SLIP
.slip {
  background: var(--paper);
  border: 1px solid rgba(216,154,90,0.15);
  border-radius: 8px;
  padding: 14px 16px 16px;
  box-shadow: 0 3px 8px rgba(62,47,34,0.08);
  position: relative;
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

SLIP LABELS
- "I AM" → color: var(--amber-deep), 5px dot
- "TODAY, I WILL" → color: var(--terra-deep), 5px dot
- 10px / 700 weight / 1.2px letter-spacing / uppercase

FAB (Wins tab only — NEVER global)
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
3 items: Home (house) · Wins (anchor) · Vision (compass/sparkle)
Active: terra-deep + 2.4 stroke-width. Inactive: muted.

QUOTE CARD (sage framed wisdom)
margin: 4px 24px 28px; padding: 30px 26px 24px;
background: linear-gradient(160deg, #7A9470 0%, #556B4F 100%);
border-radius: 22px;
::before — large decorative `"` (Georgia 130px, 10% white opacity, top-left)
::after — radial amber glow bottom-right (rgba(216,154,90,0.28))
Body: italic 18px cream (#FAF6EF), line-height 1.5
Meta: 10.5px / uppercase / 1.5px letter-spacing / cream-78% opacity

═══════════════════════════════════════════════════════════════════
SCREENS TO DESIGN (in this priority order)
═══════════════════════════════════════════════════════════════════

Build each as a self-contained HTML file in design/preview/. Mobile device
frame (390x844). Show 2-3 directions side-by-side when there's a real
open question. Otherwise build the strongest single direction.

PRIORITY 1 — THE HEART
1. MORNING RITUAL (5-frame sequence in one HTML file)
   The 90s personalized audio experience. Five beats:
   (a) Enter — "Begin?" CTA, breathing orb forming
   (b) Breath — orb pulses to breath cadence, "Inhale… exhale…"
   (c) Picture — user's vision photo blurred behind orb, copy:
       "Picture yourself today as someone who already has [vision title]…"
   (d) Be + Do — identity statement displayed; user picks one of 3
       AI-suggested "Today, I will…" actions from a soft chip selector
   (e) Close — "Carry this with you." Orb dims, soft fade.
   Audio leads, text supports. Skip button top-right (small, muted).
   Background: blurred vision photo with warm overlay.
   Make it feel sacred and rare — not another wellness app screen.

PRIORITY 1 — THE MOAT
2. CONSTELLATION ("Your sky" view, full-screen)
   Background: warm cosmic gradient (espresso → terra-deep → deep amber),
   NOT blue/purple. Each VISION = large star (24-36px), each WIN =
   smaller star (6-12px) connected to its vision via thin amber line.
   Lines weighted by recency. 4-5 vision-galaxies in space.
   Tap vision star → vision info expands. Tap win star → win detail modal.
   Header: toggle "Sky" ↔ "Board" (current scrapbook view).
   Show 2 directions: A. Sparse + elegant.  B. Dense + alive (50+ wins).
   This is the visualization moat — Notes/Pinterest cannot do this.

PRIORITY 2 — FIRST IMPRESSION
3. ONBOARDING (7-screen flow in one HTML file)
   Tone: warm, low-pressure. ONE required step (Screen 3, first vision).
   Everything else skippable with graceful fallback.
   1. Welcome — "This is your space. No pressure. No judgment. A place
      to get clear and keep proof." Subtle breathing orb behind.
   2. Teach the loop — Be → Do → Have framing as a flowing diagram.
      "Vision" → "Identity" → "Action" → "Proof".
   3. First vision (REQUIRED — no skip link) — Title + 6 life-area chips
      (Career/Love/Health/Finance/Growth/Joy) + 3 image-source buttons
      (My Photos / Browse Library / Paste URL). CTA disabled until
      title + life area chosen. Microcopy: "We'll use this to
      personalize your morning ritual."
   4. Identity statement — "Who are you becoming?" placeholder
      "I am someone who…" + 3 example statements. Skip link.
   5. Buddy — TWO options ONLY: (a) Invite a friend (SMS/share link),
      (b) Skip for now. NO AI-match / anonymous / pseudonym option —
      that mechanic was cut. Mechanic explained: "They see your vision
      titles + streak. Wins stay private. One-tap nudges only."
   6. First ritual preview — 30s scaled ritual using just-created
      vision OR "Schedule for tomorrow morning."
   7. Notification permission — "We'll send you the ritual cue each
      morning. Tap a time." Time picker.
   Skip link bottom on screens 4-7 (NOT on 3).

PRIORITY 2 — DAILY CORE
4. WIN CAPTURE SHEET (3 states side-by-side)
   Bottom sheet, 90% height, 24px top radius, drag handle, frosted-cream
   bg with warm glow.
   States: (a) Initial text mode, keyboard auto-focused. Mode selector
   [Text] [Voice] [Photo]. (b) Text filled with optional vision-link
   chip + 3 vision thumbnails + tags. (c) Voice recording with
   waveform visualizer + timer.
   Empty-state placeholder: "What just happened that's worth
   remembering?" — never generic.
   <10s to log a text win.

5. VISION CREATION FLOW (4-step bottom sheet)
   1. Title — "What are you calling in?"
   2. Image — My Photos / Browse Library / Paste URL
   3. Life area — single-tap chip (Career/Love/Health/Finance/Growth/Joy)
   4. Identity (optional) — "Who are you becoming?"
   Subtle entrance animation as the new vision lands on the board.

6. VISION DETAIL (when user taps a vision card on board)
   Hero photo full-bleed (60vh) with vision title overlay (large white) +
   identity statement (italic cream). Back arrow top-left, edit/menu
   top-right. Below hero: "X wins linked" mini-constellation (~120px
   height) showing this vision as central star. Below: chronological list
   of linked wins as small cards. Bottom: "Edit vision" + "View in sky."

PRIORITY 3 — RETENTION + GROWTH
7. BUDDY UI (3 states on Home tab strip)
   (a) NO BUDDY YET — invite-prompt strip "Invite someone to build with
       you" + small Invite CTA. Subtle, not nagging.
   (b) BUDDY ACTIVE — buddy real first name + "active this week" status
       + vision they're working toward (title only) + nudge button (taps
       to expand 4-emoji palette: 🌱 🔥 💎 🌅).
   (c) NUDGE SENT — confirmation + small celebration animation.
   Privacy microcopy: "They see your vision titles + streak. Wins stay
   private."
   IMPORTANT: NO anonymous / AI-matched / pseudonym states. Every buddy
   is a real friend invited via SMS/share-link.

PRIORITY 3 — CONFIDENCE LAYER
8. EMPTY STATES (one HTML file, 3-4 variants)
   - No wins yet (Wins tab) — warm encouragement, never empty-shrug
   - No vision yet (Vision tab — edge case after deletion) — gentle CTA
     to create a vision
   - No buddy yet (Home strip already covers, but a settings-page version)
   Microcopy is human and specific. No "Nothing here yet" generic.

9. MILESTONE CELEBRATIONS (one HTML file, 3 milestone screens)
   7-day streak / 30-day streak / 50 wins anchored. Full-screen takeover
   moments — warm, brief (5s), dismissible. NOT confetti-spam — think
   a single beautiful image + line of copy. "You just anchored 50 wins ⚓"

10. SETTINGS SCREEN
    Notification time pickers (per-type), buddy management (mute/swap),
    audio voice preference, premium status, privacy controls.
    Standard mobile settings list but using our visual system —
    paper-cream rows, amber dividers, no iOS gray.

11. PREMIUM UPGRADE SCREEN
    NOT a paywall takeover. Triggered at natural expansion moments
    (4th vision attempt, end of 3rd weekly audio ritual, etc.).
    $29.99-39.99/yr. Lead with the hybrid audio experience and
    constellation visualization. Trust-first — generous free tier
    explicitly highlighted.

═══════════════════════════════════════════════════════════════════
QUALITY CHECKLIST — VERIFY BEFORE LOCKING ANY SCREEN
═══════════════════════════════════════════════════════════════════

- General Sans only (no system sans)
- Ink color #3E2F22 (warm espresso), never #000
- Hairlines @ 8% ink opacity, never gray
- Shadows warm-tinted, never neutral gray
- No glass-morphism / heavy blur as decoration
- No cool gradients (purple/blue/neon)
- Microcopy is human, specific, not generic ("What just happened
  that's worth remembering?" beats "Add a new entry")
- FAB only on Wins tab — never global
- Tab bar terra-deep on active state
- Real photography on vision cards (not illustrations or icons)
- No toxic positivity copy
- Identity-first framing where applicable (I AM / TODAY, I WILL)
- Skip-friendly except where required (vision in onboarding)
- No anonymous / AI-matched buddy states anywhere

═══════════════════════════════════════════════════════════════════
HOW TO RESPOND
═══════════════════════════════════════════════════════════════════

1. Read SPEC.md for full context before designing.
2. Ask 1-2 clarifying questions ONLY if essential. Otherwise build.
3. Show 2-3 directions when there's a real open question. Don't give
   me three variations of the same idea — give me genuinely different
   opinions.
4. NEVER deviate from the locked visual system above.
5. If a screen feels generic AI, scrap it and try harder. Reference
   specific apps that nail this aesthetic (Day One, Things 3, Frank,
   Cereal magazine).
6. Aim for "this feels like nothing else on the App Store."

START WITH: Screen 1 (Morning Ritual, 5-frame sequence). This is the
heart of the app — if the ritual screen doesn't feel sacred and rare,
nothing else matters. Show me your strongest single direction first;
if I push back, you can show variants.
```

---

## Notes on usage

- **Where to paste:** Claude Code (this session, with the `frontend-design` skill triggering automatically) OR claude.ai web artifacts (paste this entire prompt as your first message).
- **Iteration tip:** when output feels generic, escalate with "this feels generic AI to me — specifically [name what feels generic]. Try harder. Reference [Day One / Frank / Things 3]." Don't accept the first try.
- **Output location:** all generated HTML mockups should land in `design/preview/` so they're browser-viewable.
- **Spec dependency:** `SPEC.md` is the source of truth for any feature detail not covered in this brief — Claude will read it on demand.
