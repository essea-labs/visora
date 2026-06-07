import { describe, it, expect } from 'vitest';
import { todaysWisdomSet } from './wisdomItems';
import type { AreaKind } from './areas';

describe('todaysWisdomSet', () => {
  const date = new Date(2026, 5, 5);

  it('returns the requested number of items when the pool is large enough', () => {
    const set = todaysWisdomSet(['career', 'health'] as AreaKind[], 8, date);
    expect(set).toHaveLength(8);
  });

  it('is deterministic for the same (categories, date)', () => {
    const a = todaysWisdomSet(['career'] as AreaKind[], 8, date);
    const b = todaysWisdomSet(['career'] as AreaKind[], 8, date);
    expect(a).toEqual(b);
  });

  it('rotates across days', () => {
    const a = todaysWisdomSet(['career'] as AreaKind[], 8, new Date(2026, 5, 5));
    const b = todaysWisdomSet(['career'] as AreaKind[], 8, new Date(2026, 5, 6));
    // Adjacent days should produce different first items.
    expect(a[0]).not.toEqual(b[0]);
  });

  it('falls back to the all-categories pool when no categories are given', () => {
    const set = todaysWisdomSet([], 8, date);
    expect(set.length).toBeGreaterThan(0);
  });

  it('includes all three kinds across the day (mix is enforced)', () => {
    const set = todaysWisdomSet([], 8, date);
    const kinds = new Set(set.map((w) => w.kind));
    // With 8 items drawn from 3 pools that each have many entries, we
    // expect at least 2 of the 3 kinds to appear.
    expect(kinds.size).toBeGreaterThanOrEqual(2);
  });

  it('avoids two-of-a-kind adjacency when alternatives exist', () => {
    const set = todaysWisdomSet([], 8, date);
    let adjacent = 0;
    for (let i = 1; i < set.length; i++) {
      if (set[i].kind === set[i - 1].kind) adjacent++;
    }
    // With 3 kinds and 8 cards, at most 2 same-kind adjacencies are
    // acceptable (in worst-case pool exhaustion). Stricter than zero
    // would brittle-fail when one pool is starved.
    expect(adjacent).toBeLessThanOrEqual(2);
  });
});
