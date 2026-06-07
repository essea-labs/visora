// Visora — typography tokens
// SPEC §7.3. All copy uses General Sans (Fontshare). Italic for emphasis only,
// not pervasive. Numbers use digits in UI (e.g. "90 seconds", not "ninety").

import type { TextStyle } from 'react-native';

const FAMILY = 'GeneralSans';
const FAMILY_ITALIC = 'GeneralSans-Italic';

export const typography = {
  // ── Display (onboarding hero, premium hero, identity callouts) ──
  displayXl: {
    fontFamily: FAMILY,
    fontWeight: '500',
    fontSize: 40,
    letterSpacing: -1.0,
    lineHeight: 44,
  } satisfies TextStyle,

  displayL: {
    fontFamily: FAMILY_ITALIC,
    fontWeight: '400',
    fontSize: 32,
    letterSpacing: -0.6,
    lineHeight: 36,
    fontStyle: 'italic',
  } satisfies TextStyle,

  display: {
    fontFamily: FAMILY,
    fontWeight: '500',
    fontSize: 28,
    letterSpacing: -0.7,
    lineHeight: 32,
  } satisfies TextStyle,

  // ── Headings ────────────────────────────────────────────────
  heading: {
    fontFamily: FAMILY,
    fontWeight: '600',
    fontSize: 22,
    letterSpacing: -0.4,
    lineHeight: 28,
  } satisfies TextStyle,

  // ── Body ────────────────────────────────────────────────────
  bodyL: {
    fontFamily: FAMILY,
    fontWeight: '500',
    fontSize: 15.5,
    letterSpacing: -0.1,
    lineHeight: 22,
  } satisfies TextStyle,

  body: {
    fontFamily: FAMILY,
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
  } satisfies TextStyle,

  bodyS: {
    fontFamily: FAMILY,
    fontWeight: '500',
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 18,
  } satisfies TextStyle,

  // ── Eyebrows + meta (uppercase, tight tracking) ─────────────
  eyebrow: {
    fontFamily: FAMILY,
    fontWeight: '700',
    fontSize: 10.5,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  } satisfies TextStyle,

  meta: {
    fontFamily: FAMILY,
    fontWeight: '600',
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  } satisfies TextStyle,

  // ── Voice (italic ritual cues, soft instruction) ────────────
  voice: {
    fontFamily: FAMILY_ITALIC,
    fontWeight: '400',
    fontSize: 13.5,
    letterSpacing: -0.1,
    fontStyle: 'italic',
  } satisfies TextStyle,
} as const;

export type TypographyToken = keyof typeof typography;
