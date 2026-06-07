// Unified Today's wisdom selector — draws from three pools
// (affirmations, quotes, prompts), interleaves the kinds, and avoids
// two-of-a-kind adjacency where alternatives exist. Day-of-year
// deterministic so users see a stable set per calendar day.

import { AFFIRMATIONS } from './affirmations';
import { PROMPTS } from './reflectivePrompts';
import { QUOTES } from './dailyQuotes';
import type { AreaKind } from './areas';
import type { WisdomItem } from '@/core/models/wisdom';

function dayOfYear(now: Date): number {
  const start = new Date(now.getFullYear(), 0, 0).getTime();
  return Math.floor((now.getTime() - start) / (24 * 60 * 60 * 1000));
}

/**
 * Build the unified pool of WisdomItem for the user's active vision
 * categories. Affirmations are category-filtered; quotes and prompts
 * are universal.
 */
function buildPool(categories: AreaKind[]): WisdomItem[] {
  const fallback: AreaKind[] = ['career', 'health', 'love', 'finance', 'joy'];
  const cats = categories.length > 0 ? categories : fallback;
  const affs = AFFIRMATIONS.filter((a) => cats.includes(a.category));
  const out: WisdomItem[] = [];
  for (const a of affs) out.push({ kind: 'affirmation', item: a });
  for (const q of QUOTES) out.push({ kind: 'quote', item: q });
  for (const p of PROMPTS) out.push({ kind: 'prompt', item: p });
  return out;
}

/**
 * Today's wisdom set. Day-of-year rotation, interleaves kinds.
 *
 * Algorithm:
 *   1. Build the pool of all eligible items.
 *   2. Walk the pool starting at the day offset.
 *   3. For each candidate, take it unless taking it would create a
 *      same-kind adjacency AND an alternative is still available in the
 *      remaining pool.
 *   4. Stop when we have `limit` items or the pool is exhausted.
 */
export function todaysWisdomSet(
  categories: AreaKind[],
  limit = 8,
  now: Date = new Date(),
): WisdomItem[] {
  const pool = buildPool(categories);
  if (pool.length === 0) return [];
  const day = dayOfYear(now);
  const take = Math.min(limit, pool.length);
  const out: WisdomItem[] = [];
  const used = new Set<number>();

  // Walk through the pool candidates in day-rotated order, but allow
  // skipping same-kind adjacencies when alternatives exist.
  for (let step = 0; step < pool.length && out.length < take; step++) {
    // In pass 0, we prefer non-adjacency; in pass 1, we accept anything.
    for (let pass = 0; pass < 2; pass++) {
      if (out.length >= take) break;

      for (let i = 0; i < pool.length && out.length < take; i++) {
        const idx = (day + i) % pool.length;
        if (used.has(idx)) continue;

        const candidate = pool[idx];
        const last = out[out.length - 1];

        // Pass 0: skip if same-kind adjacency and alternatives exist
        if (pass === 0 && last && last.kind === candidate.kind) {
          let altExists = false;
          for (let j = 0; j < pool.length; j++) {
            if (!used.has(j) && pool[j].kind !== candidate.kind) {
              altExists = true;
              break;
            }
          }
          if (altExists) continue;
        }

        out.push(candidate);
        used.add(idx);
        break; // move to next step once we pick an item
      }
    }
  }

  return out;
}
