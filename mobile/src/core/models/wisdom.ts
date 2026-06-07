// Wisdom type model — shared between the daily wisdom set and the
// daily reading. Selectors in src/core/constants/ produce values of
// these types; the Home tab and the reader screen consume them.
//
// IMPORTANT: this file must have zero React Native imports so it
// remains testable under vitest's Node environment.

import type { Affirmation } from '@/core/constants/affirmations';
import type { DailyQuote } from '@/core/constants/dailyQuotes';
import type { AreaKind } from '@/core/constants/areas';

/**
 * A single reflective prompt — a second-person question for the user
 * to sit with. Cards render with a dashed border and a "SIT WITH" tag.
 */
export interface ReflectivePrompt {
  id: string;
  text: string;
  /** Optional — most prompts are universal and have no category filter. */
  category?: AreaKind;
}

/**
 * Discriminated union of everything that can appear in Today's wisdom
 * swipeable set. The card renderer in home.tsx dispatches on `kind`.
 */
export type WisdomItem =
  | { kind: 'affirmation'; item: Affirmation }
  | { kind: 'quote';       item: DailyQuote }
  | { kind: 'prompt';      item: ReflectivePrompt };

/**
 * One block inside a daily reading's body. The reader screen maps over
 * an array of these and renders paragraphs as flowing prose and
 * pullquotes with a left-border treatment + source attribution.
 */
export type ReadingBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'pullquote'; text: string; source: string };

/**
 * One daily reading — original Visora-voice reflection that embeds
 * attributed quotes from public-domain sacred texts.
 */
export interface DailyReading {
  id: string;
  /** "VISORA · DAY {N}" — the index in the pool + 1 for now. */
  dayNumber: number;
  title: string;
  readTimeMinutes: number;
  body: ReadingBlock[];
}
