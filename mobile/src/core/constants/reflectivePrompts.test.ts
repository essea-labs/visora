import { describe, it, expect } from 'vitest';
import { PROMPTS, todaysPrompts } from './reflectivePrompts';

describe('reflectivePrompts', () => {
  it('seeds at least 10 prompts', () => {
    expect(PROMPTS.length).toBeGreaterThanOrEqual(10);
  });

  it('every prompt has unique id', () => {
    const ids = PROMPTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every prompt has non-empty text', () => {
    for (const p of PROMPTS) {
      expect(p.text.length).toBeGreaterThan(0);
    }
  });

  describe('todaysPrompts', () => {
    it('is deterministic for the same date', () => {
      const date = new Date(2026, 5, 5);
      const a = todaysPrompts(3, date);
      const b = todaysPrompts(3, date);
      expect(a).toEqual(b);
    });

    it('rotates across days', () => {
      const a = todaysPrompts(3, new Date(2026, 5, 5));
      const b = todaysPrompts(3, new Date(2026, 5, 6));
      // First items should differ between adjacent days (with a pool of ≥10).
      expect(a[0].id).not.toBe(b[0].id);
    });

    it('returns the requested limit (or pool size if smaller)', () => {
      expect(todaysPrompts(3, new Date(2026, 5, 5))).toHaveLength(3);
      expect(todaysPrompts(PROMPTS.length + 5, new Date(2026, 5, 5)))
        .toHaveLength(PROMPTS.length);
    });
  });
});
