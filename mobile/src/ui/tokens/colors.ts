// Visora — color tokens
// Locked in SPEC §7.2. Palette A is canonical. Two visual registers:
//   Daylit  → cream background, ink type
//   Cosmic  → deep warm-black gradient, cream type, amber accents

export const colors = {
  // ── Surfaces (Daylit register) ──────────────────────────────
  bg: '#FAF6EF',          // page background
  bgSoft: '#F4EEE2',      // recessed surfaces, dividers
  surface: '#FFFFFF',     // cards
  paper: '#FCF5E8',       // warm paper, slip notes

  // ── Cosmic register ─────────────────────────────────────────
  cosmicA: '#2A1F15',     // deepest base
  cosmicB: '#4B2E1E',     // mid
  cosmicC: '#7A4530',     // top edge / glow

  // ── Hierarchy (text + dividers) ─────────────────────────────
  ink: '#3E2F22',         // headlines + body (warm espresso, never black)
  inkSoft: '#6B5847',     // secondary
  muted: '#9A8D7E',       // tertiary, captions
  mutedSoft: '#C9BEB0',   // placeholder, hairline labels
  hairline: 'rgba(62, 47, 34, 0.08)',  // 1px dividers — never gray

  // ── Brand: terra (primary action) ───────────────────────────
  terra: '#C06848',
  terraDeep: '#9E4F32',
  terraLight: '#E8A07A',
  terraPale: '#F5DBC9',

  // ── Brand: sage (tips, hints, soft confirmations) ───────────
  sage: '#7A9470',
  sageDeep: '#556B4F',
  sagePale: '#D8E4D2',

  // ── Brand: amber (ritual glow, eyebrow accents) ─────────────
  amber: '#D89A5A',
  amberDeep: '#9B6B2F',
  amberPale: '#F5E4CF',

  // ── Cream-on-dark variants (for Cosmic register text) ───────
  cream: '#FAF6EF',
  creamSoft: 'rgba(250, 246, 239, 0.85)',
  creamMuted: 'rgba(250, 246, 239, 0.65)',
  creamFaint: 'rgba(250, 246, 239, 0.4)',
} as const;

export type ColorToken = keyof typeof colors;

// Shadow recipes from SPEC §7. All shadows are TINTED (amber/terra/sage),
// never neutral gray. Use these as starting points; tweak per surface.
export const shadows = {
  slip: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 4, // android
  },
  photoTilt: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 8,
  },
  photoHero: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 22 },
    shadowOpacity: 0.6,
    shadowRadius: 42,
    elevation: 12,
  },
  buttonCta: {
    shadowColor: colors.terra,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.55,
    shadowRadius: 40,
    elevation: 8,
  },
  orb: {
    shadowColor: colors.terra,
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.55,
    shadowRadius: 80,
    elevation: 12,
  },
} as const;
