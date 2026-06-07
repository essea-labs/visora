import { describe, it, expect } from 'vitest';
import { READINGS, todaysReading } from './dailyReadings';

describe('dailyReadings', () => {
  it('seeds at least 3 readings (MVP minimum to verify rotation)', () => {
    expect(READINGS.length).toBeGreaterThanOrEqual(3);
  });

  it('every reading has unique id', () => {
    const ids = READINGS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every reading has dayNumber, title, body, and a sensible read time', () => {
    for (const r of READINGS) {
      expect(r.dayNumber).toBeGreaterThan(0);
      expect(r.title.length).toBeGreaterThan(0);
      expect(r.body.length).toBeGreaterThan(0);
      expect(r.readTimeMinutes).toBeGreaterThanOrEqual(1);
      expect(r.readTimeMinutes).toBeLessThanOrEqual(10);
    }
  });

  it('body blocks are well-formed paragraph or pullquote', () => {
    for (const r of READINGS) {
      for (const block of r.body) {
        if (block.type === 'paragraph') {
          expect(block.text.length).toBeGreaterThan(0);
        } else if (block.type === 'pullquote') {
          expect(block.text.length).toBeGreaterThan(0);
          expect(block.source.length).toBeGreaterThan(0);
        } else {
          throw new Error(`Unknown block type in reading ${r.id}`);
        }
      }
    }
  });

  describe('todaysReading', () => {
    it('is deterministic for the same date', () => {
      const date = new Date(2026, 5, 5);
      expect(todaysReading(date)).toBe(todaysReading(date));
    });

    it('cycles through the pool across days', () => {
      const ids = new Set<string>();
      for (let d = 0; d < READINGS.length * 2; d++) {
        ids.add(todaysReading(new Date(2026, 0, 1 + d)).id);
      }
      // Every reading in the pool should appear within 2 cycles.
      expect(ids.size).toBe(READINGS.length);
    });
  });
});
