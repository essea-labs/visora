// Affirmation library — seed content for the Home tab strip + future
// full-screen feed + library screens.
//
// Each affirmation:
//   • text — first-person, present tense statement to embody.
//   • category — life-area for personalisation against the user's visions.
//   • tone — gentle / bold / playful — used to vary the day's rotation.
//   • photoLibraryId — backdrop photo id (must exist in photoLibrary.ts).
//
// Selection algorithm (in useAffirmationsStore.todaysSelection):
//   1. Filter by the categories of the user's active visions.
//   2. Rotate by day-of-year so the user sees a stable set per-day,
//      shuffling weekly.
//   3. Mix tones (no two consecutive gentle, etc.) for variety.

import type { AreaKind } from './areas';

export type AffirmationTone = 'gentle' | 'bold' | 'playful';

export interface Affirmation {
  id: string;
  text: string;
  category: AreaKind;
  tone: AffirmationTone;
  /** Reference into src/core/constants/photoLibrary.ts. */
  photoLibraryId: string;
}

export const AFFIRMATIONS: Affirmation[] = [
  // ── CAREER ─────────────────────────────────────────
  { id: 'c-1',  text: 'I am the person who finishes what I start.',           category: 'career', tone: 'bold',    photoLibraryId: 'work-paris'  },
  { id: 'c-2',  text: 'My work matters, even when no one is watching.',       category: 'career', tone: 'gentle',  photoLibraryId: 'work-window' },
  { id: 'c-3',  text: 'I am building something only I can build.',            category: 'career', tone: 'bold',    photoLibraryId: 'work-laptop' },
  { id: 'c-4',  text: 'Quiet effort compounds.',                              category: 'career', tone: 'gentle',  photoLibraryId: 'work-coffee' },
  { id: 'c-5',  text: 'I say yes to what is mine and no to the rest.',        category: 'career', tone: 'bold',    photoLibraryId: 'work-window' },
  { id: 'c-6',  text: 'I am becoming sought after for the way I think.',      category: 'career', tone: 'bold',    photoLibraryId: 'work-laptop' },
  { id: 'c-7',  text: 'Today is one move in a long game I am winning.',       category: 'career', tone: 'playful', photoLibraryId: 'work-beach'  },

  // ── HEALTH ─────────────────────────────────────────
  { id: 'h-1',  text: 'My body is becoming what I ask of it.',                category: 'health', tone: 'bold',    photoLibraryId: 'health-runner' },
  { id: 'h-2',  text: 'I am someone who shows up for my body, gently.',       category: 'health', tone: 'gentle',  photoLibraryId: 'health-yoga'   },
  { id: 'h-3',  text: 'I rest as a practice, not as a reward.',               category: 'health', tone: 'gentle',  photoLibraryId: 'health-shoes'  },
  { id: 'h-4',  text: 'Strong is the version of me that already exists.',    category: 'health', tone: 'bold',    photoLibraryId: 'health-medal'  },
  { id: 'h-5',  text: 'Every glass of water is a small love letter.',         category: 'health', tone: 'playful', photoLibraryId: 'health-yoga'   },

  // ── LOVE ───────────────────────────────────────────
  { id: 'l-1',  text: 'I am chosen, and I choose.',                           category: 'love',   tone: 'bold',    photoLibraryId: 'love-hero' },
  { id: 'l-2',  text: 'Love finds the version of me that is honest.',         category: 'love',   tone: 'gentle',  photoLibraryId: 'love-hero' },
  { id: 'l-3',  text: 'I let myself be seen.',                                category: 'love',   tone: 'gentle',  photoLibraryId: 'love-hero' },
  { id: 'l-4',  text: 'My presence is enough — today and tomorrow.',          category: 'love',   tone: 'gentle',  photoLibraryId: 'love-hero' },
  { id: 'l-5',  text: 'I am magnetic to the right people.',                   category: 'love',   tone: 'bold',    photoLibraryId: 'love-hero' },

  // ── FINANCE ───────────────────────────────────────
  { id: 'f-1',  text: 'Money flows toward what I am becoming.',               category: 'finance', tone: 'bold',    photoLibraryId: 'work-plant'  },
  { id: 'f-2',  text: 'I am free from the story that more is needed to start.', category: 'finance', tone: 'gentle', photoLibraryId: 'work-window' },
  { id: 'f-3',  text: 'I receive without flinching.',                         category: 'finance', tone: 'gentle',  photoLibraryId: 'work-plant'  },
  { id: 'f-4',  text: 'Abundance is a posture I can practise.',               category: 'finance', tone: 'gentle',  photoLibraryId: 'work-paris'  },
  { id: 'f-5',  text: "I trust that what's mine will arrive.",                category: 'finance', tone: 'gentle',  photoLibraryId: 'work-coffee' },

  // ── JOY ────────────────────────────────────────────
  { id: 'j-1',  text: 'I notice the small lights.',                           category: 'joy', tone: 'gentle',  photoLibraryId: 'warm-bright' },
  { id: 'j-2',  text: 'I am allowed to want what I want.',                    category: 'joy', tone: 'bold',    photoLibraryId: 'warm-bright' },
  { id: 'j-3',  text: 'Play is data about who I am.',                         category: 'joy', tone: 'playful', photoLibraryId: 'work-coffee' },
  { id: 'j-4',  text: 'Today already has a moment for me — I will not miss it.', category: 'joy', tone: 'gentle', photoLibraryId: 'work-beach' },
  { id: 'j-5',  text: 'I let lit-up be a baseline, not a peak.',              category: 'joy', tone: 'bold',    photoLibraryId: 'warm-bright' },

  // ── CUSTOM / UNIVERSAL ────────────────────────────
  { id: 'u-1',  text: "I am becoming who I'm meant to be.",                   category: 'custom', tone: 'bold',    photoLibraryId: 'hero-warm-bright' },
  { id: 'u-2',  text: "The version of me a year from now is already cheering.", category: 'custom', tone: 'gentle', photoLibraryId: 'warm-bright' },
  { id: 'u-3',  text: 'I trust the slow yes.',                                category: 'custom', tone: 'gentle',  photoLibraryId: 'work-coffee' },
];

/**
 * Deterministic daily rotation. Given today's date + the user's active
 * category set, return up to `limit` affirmations to show on Home. Cycles
 * so the user sees a fresh set roughly each day but doesn't get a
 * different one on every render.
 */
export function todaysAffirmations(
  categories: AreaKind[],
  limit = 5,
  now: Date = new Date(),
): Affirmation[] {
  const cats = categories.length > 0 ? categories : (['career', 'health', 'love', 'finance', 'joy'] as AreaKind[]);
  const pool = AFFIRMATIONS.filter((a) => cats.includes(a.category));
  if (pool.length === 0) return [];

  // Day-of-year as the rotation seed.
  const start = new Date(now.getFullYear(), 0, 0).getTime();
  const day = Math.floor((now.getTime() - start) / (24 * 60 * 60 * 1000));

  const out: Affirmation[] = [];
  const seen = new Set<string>();
  // Walk through pool starting from `day`-offset, take `limit` non-dupes,
  // avoiding two consecutive same-tone where possible.
  for (let i = 0; i < pool.length && out.length < limit; i++) {
    const candidate = pool[(day + i) % pool.length];
    if (seen.has(candidate.id)) continue;
    const last = out[out.length - 1];
    if (last && last.tone === candidate.tone && i + 1 < pool.length) {
      continue; // try the next index first; the outer loop catches us back if no alternative
    }
    out.push(candidate);
    seen.add(candidate.id);
  }
  return out;
}

export function affirmationById(id: string): Affirmation | undefined {
  return AFFIRMATIONS.find((a) => a.id === id);
}
