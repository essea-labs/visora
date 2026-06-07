// Ritual voice — single voice for MVP.
//
// R46: collapsed the 5-variant day-of-week rotation down to one voice
// for MVP launch. The 4 other variants still had the older "they"
// script and faster pacing; rather than ship a mismatched experience
// while waiting on the ElevenLabs quota reset, we ship one good voice.
//
// To re-introduce voice variety post-MVP:
//   1. Generate additional clips via `scripts/generate-ritual-voices.mjs`
//      (the chunked-with-real-silences generator)
//   2. Drop them in `assets/audio/ritual/` (e.g. `ritual-evening.m4a`)
//   3. Add entries here + restore picker logic (see git history for the
//      day-of-week rotation we used pre-R46).

import type { AVPlaybackSource } from 'expo-av';

export interface RitualVoice {
  /** ElevenLabs voice name — for QA / display. */
  voiceName: string;
  /** Bundled audio asset, require()'d so Metro embeds it in the bundle. */
  source: AVPlaybackSource;
}

export const RITUAL_VOICE: RitualVoice = {
  voiceName: 'Daniel',
  source: require('@/assets/audio/ritual/ritual.m4a'),
};

/**
 * Returns the ritual voice. Date param kept so the public signature is
 * stable in case we re-introduce rotation later.
 */
export function ritualVoiceForDate(_now: Date = new Date()): RitualVoice {
  return RITUAL_VOICE;
}
