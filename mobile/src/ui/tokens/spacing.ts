// Visora — spacing tokens
// SPEC §7 — multiples of 4. Common rhythms: 6, 8, 12, 14, 18, 22, 28, 32.

export const spacing = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 22,    // outer screen gutters
  xxl: 28,   // section vertical rhythm
  xxxl: 32,
} as const;

export const radii = {
  xs: 4,     // photo inner border, chip inside cards
  s: 8,      // small chips
  m: 12,     // image thumbs
  l: 18,     // slips, list rows
  xl: 22,    // cards, modals, hero blocks
  full: 999, // buttons, pills, orbs
} as const;

// Outer screen gutter — applied at the screen container level
export const screenGutter = 22;

// Card padding — applied inside cards
export const cardPadding = 18;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radii;
