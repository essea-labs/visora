// Visora — motion tokens
// SPEC §7. Breath is the master tempo: 4s in, 4s out.
// Reserve high-velocity motion (>0.4 amplitude) for the morning ritual only.

import { Easing } from 'react-native-reanimated';

export const motion = {
  // ── Breath cadence (the master tempo) ───────────────────────
  breathInMs: 4000,
  breathOutMs: 4000,
  breathCycleMs: 8000,

  // ── Page transitions ────────────────────────────────────────
  registerCrossFadeMs: 500,        // Daylit ↔ Cosmic (400–600 range per SPEC)
  withinRegisterMs: 240,           // navigation within a register

  // ── Tap feedback ────────────────────────────────────────────
  tapScaleAmount: 0.95,
  tapScaleMs: 80,

  // ── Orb amplitudes ──────────────────────────────────────────
  orbAmplitudeIdle: 0.3,           // settings, today screen — orb breathes faintly
  orbAmplitudeRitual: 0.4,         // morning ritual — fuller breath
  orbAmplitudeRitualPicture: 0.5,  // R03 Picture — heightened

  // ── Easing curves ───────────────────────────────────────────
  easeOut: Easing.out(Easing.cubic),
  easeInOut: Easing.inOut(Easing.cubic),
  breathEase: Easing.inOut(Easing.sin),  // sinusoidal feels most natural for breath
} as const;

export type MotionToken = keyof typeof motion;
