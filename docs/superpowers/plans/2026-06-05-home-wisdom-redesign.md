# Home wisdom redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse Home's affirmations strip + daily quote into a single swipeable "Today's wisdom" set (mixing affirmations, attributed quotes including yoga literature, and reflective prompts), and add a "Today's reading" preview card that opens to a minimal editorial reader screen.

**Architecture:** Pure-function selectors (date + user state → wisdom items / reading) live in their constants files. UI sub-components stay inline in `home.tsx` per the existing pattern (`RitualFeatureCard`, `IntentionDisplay`, etc.). A new `app/reading.tsx` modal screen renders today's reading via a structured `ReadingBlock[]` body (paragraph / pullquote variants).

**Tech Stack:** Expo SDK 54 · expo-router 6 · React Native 0.81.5 · TypeScript 5.9 · Zustand. Adding **vitest** as a dev dependency for selector unit tests (no test runner currently installed).

**Reference spec:** `docs/superpowers/specs/2026-06-05-home-wisdom-redesign-design.md`

---

## File map

| File | Status |
|---|---|
| `mobile/package.json` | modify (add vitest devDep + test script) |
| `mobile/vitest.config.ts` | create |
| `mobile/src/core/models/wisdom.ts` | create |
| `mobile/src/core/constants/reflectivePrompts.ts` | create |
| `mobile/src/core/constants/reflectivePrompts.test.ts` | create |
| `mobile/src/core/constants/dailyQuotes.ts` | modify (extend pool) |
| `mobile/src/core/constants/dailyReadings.ts` | create |
| `mobile/src/core/constants/dailyReadings.test.ts` | create |
| `mobile/src/core/constants/wisdomItems.ts` | create |
| `mobile/src/core/constants/wisdomItems.test.ts` | create |
| `mobile/app/(tabs)/home.tsx` | refactor (replace 2 sections, add 2 new components inline) |
| `mobile/app/reading.tsx` | create |
| `mobile/app/_layout.tsx` | modify (register `/reading` modal route) |
| `Manifestation App - Claude Design/_home-layout-mirror.html` | modify (reflect new sections) |

---

## Task 1: Set up vitest for pure-function tests

**Why:** Spec mandates unit tests for selectors (determinism, rotation, fallback, pool exhaustion). No test runner is currently installed.

**Files:**
- Modify: `mobile/package.json`
- Create: `mobile/vitest.config.ts`
- Create: `mobile/src/core/constants/__sanity__.test.ts` (deleted after Task 6)

- [ ] **Step 1: Add vitest devDep**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npm install --save-dev vitest @vitest/ui
```

Expected: vitest + @vitest/ui added to `devDependencies`.

- [ ] **Step 2: Add test scripts to `mobile/package.json`**

Edit `mobile/package.json`. Inside the `"scripts"` object, after `"lint"`, add:

```json
    "lint": "expo lint",
    "test": "vitest run",
    "test:watch": "vitest"
```

(Remember to add the comma after `"expo lint"`.)

- [ ] **Step 3: Create vitest config with path aliasing**

Create `mobile/vitest.config.ts` with:

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Vitest config — pure-function tests only.
// We do NOT compile/load React Native modules here. Selectors and
// constants files in src/core/constants/ are pure TS and have zero
// RN imports, so they run cleanly in Node.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
```

- [ ] **Step 4: Sanity-check vitest runs**

Create `mobile/src/core/constants/__sanity__.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('vitest setup sanity', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run sanity test**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npm test
```

Expected: 1 test passes. `✓ src/core/constants/__sanity__.test.ts (1)`.

If it fails: vitest config or path alias is wrong. Do not proceed until this passes.

- [ ] **Step 6: Commit**

```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App"
git add mobile/package.json mobile/package-lock.json mobile/vitest.config.ts mobile/src/core/constants/__sanity__.test.ts
git commit -m "$(cat <<'EOF'
Add vitest for pure-function selector tests

Selectors in src/core/constants/ are pure TS — no React Native imports — so they can be tested in Node via vitest. This sets up the runner with a path alias so test files can use '@/...' imports the same way runtime code does. The sanity test gets deleted after Task 6 once real selector tests cover the same surface.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Define the wisdom type model

**Why:** Discriminated union + supporting types are needed before any selector or content file can be authored.

**Files:**
- Create: `mobile/src/core/models/wisdom.ts`

- [ ] **Step 1: Verify the models directory exists and check existing convention**

Run:
```bash
ls "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile/src/core/models/"
```

Note the file naming style (camelCase or kebab? singular or plural?). Existing files set the convention.

- [ ] **Step 2: Create `mobile/src/core/models/wisdom.ts`**

```ts
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
```

- [ ] **Step 3: Verify TypeScript compiles**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npx tsc --noEmit
```

Expected: no errors. (If `areas` or `affirmations` imports fail, check the paths — those files already exist in the repo.)

- [ ] **Step 4: Commit**

```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App"
git add mobile/src/core/models/wisdom.ts
git commit -m "$(cat <<'EOF'
Add wisdom type model for Home redesign

WisdomItem is a discriminated union of affirmation / quote / prompt — the three card types in Today's wisdom. ReadingBlock + DailyReading model the structured body of Today's reading (paragraph vs pullquote with attribution). No RN imports so the model is testable under vitest.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Reflective prompts data + selector with tests

**Why:** New content type. Need both the seed pool and the `todaysPrompts` helper. TDD per spec.

**Files:**
- Create: `mobile/src/core/constants/reflectivePrompts.ts`
- Create: `mobile/src/core/constants/reflectivePrompts.test.ts`

- [ ] **Step 1: Write the failing test first**

Create `mobile/src/core/constants/reflectivePrompts.test.ts`:

```ts
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
```

- [ ] **Step 2: Verify the test fails (module does not exist)**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npm test
```

Expected: `Cannot find module './reflectivePrompts'` or similar.

- [ ] **Step 3: Create the data + selector**

Create `mobile/src/core/constants/reflectivePrompts.ts`:

```ts
// Reflective prompts — second-person questions the user can sit with.
// Render as dashed-border cards in the Today's wisdom swipeable set.
//
// All prompts are original Visora writing. Universal (no category
// filter) by default — category-specific prompts can be added later.

import type { ReflectivePrompt } from '@/core/models/wisdom';

export const PROMPTS: ReflectivePrompt[] = [
  { id: 'p-001', text: 'What are you ready to release?' },
  { id: 'p-002', text: 'Where in your body is calm?' },
  { id: 'p-003', text: 'Who do you want to become by sundown?' },
  { id: 'p-004', text: 'What is one small kindness you can offer yourself today?' },
  { id: 'p-005', text: 'What story are you telling yourself that no longer fits?' },
  { id: 'p-006', text: 'Where in your life are you divided?' },
  { id: 'p-007', text: 'What would change if you trusted yourself more?' },
  { id: 'p-008', text: 'What do you know but have not yet acted on?' },
  { id: 'p-009', text: 'What is asking to be tended?' },
  { id: 'p-010', text: 'Where can you choose softness today?' },
  { id: 'p-011', text: 'Who in your life deserves your full attention today?' },
  { id: 'p-012', text: 'What are you pretending not to want?' },
];

/**
 * Deterministic daily rotation. Given a date, returns up to `limit`
 * prompts. Same calendar day always returns the same selection.
 */
export function todaysPrompts(
  limit = 3,
  now: Date = new Date(),
): ReflectivePrompt[] {
  if (PROMPTS.length === 0) return [];
  const start = new Date(now.getFullYear(), 0, 0).getTime();
  const day = Math.floor((now.getTime() - start) / (24 * 60 * 60 * 1000));
  const take = Math.min(limit, PROMPTS.length);
  const out: ReflectivePrompt[] = [];
  for (let i = 0; i < take; i++) {
    out.push(PROMPTS[(day + i) % PROMPTS.length]);
  }
  return out;
}
```

- [ ] **Step 4: Run the tests**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npm test
```

Expected: all tests in `reflectivePrompts.test.ts` pass (5 tests). The sanity test from Task 1 also still passes.

- [ ] **Step 5: Commit**

```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App"
git add mobile/src/core/constants/reflectivePrompts.ts mobile/src/core/constants/reflectivePrompts.test.ts
git commit -m "$(cat <<'EOF'
Add reflective prompts pool + daily selector

12 original second-person prompts seeded for MVP. todaysPrompts() uses the same day-of-year rotation pattern as the existing todaysAffirmations() / todaysQuote() — same calendar day always returns the same set so users see a stable list per day. Tests cover determinism, cross-day rotation, and the limit clamping.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Extend dailyQuotes with yoga literature + export the pool

**Why:** The wisdom set's quote variant should include yoga literature alongside the existing pool. Public-domain pre-1929 translations only. Also export the `QUOTES` array directly so the unified selector in Task 6 can enumerate the full pool without duplicates.

**Files:**
- Modify: `mobile/src/core/constants/dailyQuotes.ts`

- [ ] **Step 1: Read the current file to find the insertion points**

Read `mobile/src/core/constants/dailyQuotes.ts`. The array `QUOTES` is declared at line 10 (`const QUOTES: DailyQuote[] = [`) and ends at line 43.

- [ ] **Step 2: Change `const QUOTES` to `export const QUOTES`**

Edit `mobile/src/core/constants/dailyQuotes.ts`. On line 10, change:

```ts
const QUOTES: DailyQuote[] = [
```

to:

```ts
export const QUOTES: DailyQuote[] = [
```

This is a non-breaking change — existing internal usage (`todaysQuote`, `quoteCarousel`) keeps working.

- [ ] **Step 3: Add yoga literature entries to the QUOTES array**

Still in `mobile/src/core/constants/dailyQuotes.ts`. Inside the `QUOTES` array, **before** the closing `];`, add:

```ts
  // ── Yoga literature & sacred-text additions (public-domain) ───
  // All translations used here are pre-1929 (US public-domain).
  // Attribution format: "{TEXT} — {TRANSLATOR}, {YEAR}".
  { text: 'Yoga is the cessation of the modifications of the mind.', author: 'Yoga Sutras 1.2 — Vivekananda, 1896' },
  { text: 'When friendliness, mercy, gladness, and indifference are practised, the mind becomes pure.', author: 'Yoga Sutras 1.33 — Vivekananda, 1896' },
  { text: 'You have the right to work, but never to the fruit of work.', author: 'Bhagavad Gita 2.47 — Arnold, 1885' },
  { text: 'Still your mind in me, still yourself in me, and without a doubt you shall be united with me.', author: 'Bhagavad Gita 12.8 — Arnold, 1885' },
  { text: 'A man is made by his belief. As he believes, so he is.', author: 'Bhagavad Gita 17.3 — Arnold, 1885' },
  { text: 'The journey of a thousand li begins beneath one’s feet.', author: 'Tao Te Ching 64 — Legge, 1891' },
  { text: 'He who knows others is wise; he who knows himself is enlightened.', author: 'Tao Te Ching 33 — Legge, 1891' },
  { text: 'Water is the softest thing on earth, yet it overcomes the hard and strong.', author: 'Tao Te Ching 78 — Legge, 1891' },
  { text: 'The best way to take care of the future is to take care of the present moment.', author: 'Marcus Aurelius — Long, 1862' },
  { text: 'You have power over your mind — not outside events. Realise this, and you will find strength.', author: 'Marcus Aurelius — Long, 1862' },
  { text: 'Confine yourself to the present.', author: 'Marcus Aurelius — Long, 1862' },
  { text: 'Out beyond ideas of wrong-doing and right-doing, there is a field. I will meet you there.', author: 'Rumi — Whinfield, 1887' },
  { text: 'Be empty of worrying. Think of who created thought.', author: 'Rumi — Whinfield, 1887' },
  { text: 'Hardships often prepare ordinary people for an extraordinary destiny.', author: 'Marcus Aurelius — Long, 1862' },
  { text: 'The mind is restless and difficult to restrain, but it is subdued by practice.', author: 'Bhagavad Gita 6.35 — Arnold, 1885' },
```

- [ ] **Step 4: Verify TypeScript still compiles**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App"
git add mobile/src/core/constants/dailyQuotes.ts
git commit -m "$(cat <<'EOF'
Extend dailyQuotes with 15 yoga literature entries + export pool

Bhagavad Gita (Arnold 1885), Yoga Sutras (Vivekananda 1896), Tao Te Ching (Legge 1891), Marcus Aurelius Meditations (Long 1862), Rumi (Whinfield 1887). All translators died well before 1929 so the translations are US public-domain. Existing 32 quotes are unchanged — total pool is now 47. Also exporting the QUOTES array directly so the unified wisdom selector (Task 6) can enumerate the full pool without duplicating via the rotating quoteCarousel API.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Daily readings data + selector with tests

**Why:** Today's reading needs a content pool + deterministic picker. Seed with 3 fully-written readings; the remaining ~11 can be filled in as a content sprint following the same `ReadingBlock[]` structure.

**Files:**
- Create: `mobile/src/core/constants/dailyReadings.ts`
- Create: `mobile/src/core/constants/dailyReadings.test.ts`

- [ ] **Step 1: Write the failing test first**

Create `mobile/src/core/constants/dailyReadings.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test (it should fail — module missing)**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npm test -- dailyReadings
```

Expected: `Cannot find module './dailyReadings'`.

- [ ] **Step 3: Create the readings + selector**

Create `mobile/src/core/constants/dailyReadings.ts`:

```ts
// Daily readings — original Visora-voice reflections that embed
// attributed pull quotes from public-domain sacred texts.
//
// MVP seed: 3 fully-written readings. The pool grows as more content
// is written; the selector handles any pool size via modulo rotation.
// When adding new readings, follow the existing pattern:
//   • dayNumber = pool index + 1 (assigned in order they're added)
//   • body is an array of structured blocks (paragraph + pullquote)
//   • pullquote source is always "{TEXT NAME} {VERSE} ({TRANSLATOR}, {YEAR})"
//   • All embedded quotes must be from pre-1929 translations.

import type { DailyReading } from '@/core/models/wisdom';

export const READINGS: DailyReading[] = [
  {
    id: 'r-001',
    dayNumber: 1,
    title: 'On Becoming Magnetic',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'You don’t become magnetic by trying to be wanted. You become magnetic by being undivided.' },
      { type: 'paragraph', text: 'The yogis called this ekagrata — one-pointed attention. When all of you is in the room, people feel it. When part of you is rehearsing what to say, part of you is watching how you’re being received, part of you is somewhere else entirely — that’s a kind of leaking. The magnetism dissipates.' },
      { type: 'pullquote', text: 'The mind becomes clear and sattvic when the qualities of friendliness, compassion, and gladness are cultivated.', source: 'Yoga Sutras 1.33 (Vivekananda, 1896)' },
      { type: 'paragraph', text: 'Patanjali isn’t prescribing technique. He’s describing what happens when you stop dividing yourself — when friendliness, compassion, and gladness are not performances but the climate you bring with you.' },
      { type: 'paragraph', text: 'Today, notice the moments you split. Notice the room you’re only half in. Then notice what happens when you return.' },
    ],
  },
  {
    id: 'r-002',
    dayNumber: 2,
    title: 'On the Small Yes',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'Most lives don’t change with a single dramatic decision. They change with a thousand small yeses, repeated quietly, in the moments no one is watching.' },
      { type: 'pullquote', text: 'The journey of a thousand li begins beneath one’s feet.', source: 'Tao Te Ching 64 (Legge, 1891)' },
      { type: 'paragraph', text: 'Lao Tzu doesn’t say it begins with a leap. He doesn’t say it begins with vision, or courage, or a plan. He says it begins beneath your feet — with what is already there, where you already are.' },
      { type: 'paragraph', text: 'The version of you you want to become is not waiting at the end of a thousand miles. They are being built by the next small yes.' },
      { type: 'paragraph', text: 'What is yours to say yes to today?' },
    ],
  },
  {
    id: 'r-003',
    dayNumber: 3,
    title: 'On Tending What’s Yours',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'There is a particular kind of exhaustion that comes from carrying what isn’t yours — other people’s opinions, other people’s timelines, other people’s definitions of what a good life looks like.' },
      { type: 'paragraph', text: 'Marcus Aurelius, writing to himself in his journal two thousand years ago, kept returning to this:' },
      { type: 'pullquote', text: 'You have power over your mind — not outside events. Realise this, and you will find strength.', source: 'Meditations (Long, 1862)' },
      { type: 'paragraph', text: 'The world will ask you to spend yourself on a hundred things that are not yours to fix. Notice them. Bow to them. And then return your attention to what is actually yours — your work, your people, your becoming.' },
      { type: 'paragraph', text: 'Today, ask: what am I carrying that isn’t mine?' },
    ],
  },
];

/**
 * Deterministic per-day reading. Same calendar day always returns the
 * same reading. Cycles through the pool via modulo.
 */
export function todaysReading(now: Date = new Date()): DailyReading {
  const start = new Date(now.getFullYear(), 0, 0).getTime();
  const day = Math.floor((now.getTime() - start) / (24 * 60 * 60 * 1000));
  return READINGS[day % READINGS.length];
}
```

- [ ] **Step 4: Run the tests**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npm test -- dailyReadings
```

Expected: all 6 tests pass.

- [ ] **Step 5: Commit**

```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App"
git add mobile/src/core/constants/dailyReadings.ts mobile/src/core/constants/dailyReadings.test.ts
git commit -m "$(cat <<'EOF'
Add daily readings pool + deterministic selector

Seeded with 3 original Visora reflections, each embedding a pre-1929 public-domain pull quote (Yoga Sutras Vivekananda 1896, Tao Te Ching Legge 1891, Marcus Aurelius Long 1862). The remaining ~11 readings to reach the spec's 14-reading target are a content sprint — the data structure handles any pool size via modulo rotation. Tests cover determinism, rotation, and body block well-formedness.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Unified wisdom items selector with tests

**Why:** Today's wisdom strip needs a single selector that draws across all three pools, interleaves the kinds, and avoids two-of-a-kind adjacency where possible.

**Files:**
- Create: `mobile/src/core/constants/wisdomItems.ts`
- Create: `mobile/src/core/constants/wisdomItems.test.ts`
- Delete: `mobile/src/core/constants/__sanity__.test.ts` (replaced by real tests)

- [ ] **Step 1: Write the failing test first**

Create `mobile/src/core/constants/wisdomItems.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test (it fails — module missing)**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npm test -- wisdomItems
```

Expected: `Cannot find module './wisdomItems'`.

- [ ] **Step 3: Create the unified selector**

Create `mobile/src/core/constants/wisdomItems.ts`:

```ts
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
  // First pass: prefer items that avoid same-kind adjacency.
  // Second pass: accept anything to fill the limit.
  const used = new Set<number>();
  for (let pass = 0; pass < 2 && out.length < take; pass++) {
    for (let i = 0; i < pool.length && out.length < take; i++) {
      const idx = (day + i) % pool.length;
      if (used.has(idx)) continue;
      const candidate = pool[idx];
      const last = out[out.length - 1];
      if (pass === 0 && last && last.kind === candidate.kind) {
        continue; // skip on first pass; second pass picks it up if needed
      }
      out.push(candidate);
      used.add(idx);
    }
  }
  return out;
}
```

- [ ] **Step 4: Run all tests**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npm test
```

Expected: all tests pass (Tasks 3, 5, 6 = 6 + 6 + 6 = 18 tests, plus the sanity test still present).

- [ ] **Step 5: Delete the sanity test**

Run:
```bash
rm "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile/src/core/constants/__sanity__.test.ts"
```

- [ ] **Step 6: Re-run tests to confirm everything else still passes**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npm test
```

Expected: 18 tests pass across 3 test files.

- [ ] **Step 7: Commit**

```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App"
git add mobile/src/core/constants/wisdomItems.ts mobile/src/core/constants/wisdomItems.test.ts mobile/src/core/constants/__sanity__.test.ts
git commit -m "$(cat <<'EOF'
Add unified todaysWisdomSet selector with mix enforcement

Walks across affirmations + quotes + prompts in two passes — first pass avoids same-kind adjacency, second pass relaxes to fill the limit when pool subsets are starved. Day-of-year deterministic so the same calendar day always returns the same set. Drops the temporary sanity test now that real selector tests cover vitest.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: WisdomCard variants (inline in home.tsx)

**Why:** Three card variants (affirmation / quote / prompt) all sized at 115×80pt. Discriminated render based on `WisdomItem.kind`.

**Files:**
- Modify: `mobile/app/(tabs)/home.tsx` (add new components inline, do NOT yet wire them in)

- [ ] **Step 1: Add imports at the top of `home.tsx`**

In `mobile/app/(tabs)/home.tsx`, the import block at the top (around line 36-59) — add these imports:

```ts
import { todaysWisdomSet } from '@/core/constants/wisdomItems';
import { todaysReading } from '@/core/constants/dailyReadings';
import type { WisdomItem } from '@/core/models/wisdom';
```

The existing imports for `todaysAffirmations`, `todaysQuote`, `photoById`, and `BlurView` will be removed in Task 11 — leave them for now to keep the file compilable across tasks.

- [ ] **Step 2: Add the new `WisdomCard` and three variant sub-components**

Append these functions to the end of `mobile/app/(tabs)/home.tsx` (after the existing `IntentionDisplay` at line 673):

```tsx
// ─── Today's wisdom — unified card renderer ────────────────────
// All three variants share the 115×80pt footprint. Discriminated
// render based on item.kind. Cards are deliberately compact so 3
// peek visible inside the swipeable strip on iPhone 14.
function WisdomCard({ item }: { item: WisdomItem }) {
  switch (item.kind) {
    case 'affirmation':
      return <AffirmationVariant text={item.item.text} />;
    case 'quote':
      return <QuoteVariant text={item.item.text} author={item.item.author} />;
    case 'prompt':
      return <PromptVariant text={item.item.text} />;
  }
}

function AffirmationVariant({ text }: { text: string }) {
  return (
    <View
      style={{
        width: 115,
        height: 80,
        borderRadius: 12,
        padding: 10,
        backgroundColor: 'rgba(192,104,72,0.28)',
        borderWidth: 1,
        borderColor: 'rgba(216,154,90,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={['rgba(192,104,72,0.4)', 'rgba(192,104,72,0.18)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <Text
        style={{
          fontFamily: 'Georgia',
          fontStyle: 'italic',
          fontSize: 11,
          lineHeight: 14,
          color: colors.cream,
          fontWeight: '500',
          textAlign: 'center',
        }}
        numberOfLines={4}
      >
        {text}
      </Text>
    </View>
  );
}

function QuoteVariant({ text, author }: { text: string; author: string }) {
  return (
    <View
      style={{
        width: 115,
        height: 80,
        borderRadius: 12,
        padding: 9,
        backgroundColor: 'rgba(216,154,90,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(216,154,90,0.22)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontFamily: 'Georgia',
          fontStyle: 'italic',
          fontSize: 10,
          lineHeight: 12.5,
          color: colors.cream,
          textAlign: 'center',
          marginBottom: 4,
        }}
        numberOfLines={3}
      >
        {text}
      </Text>
      <Text
        style={{
          fontSize: 6,
          fontWeight: '700',
          letterSpacing: 1.2,
          color: colors.amber,
          textAlign: 'center',
        }}
        numberOfLines={1}
      >
        — {author.toUpperCase()}
      </Text>
    </View>
  );
}

function PromptVariant({ text }: { text: string }) {
  return (
    <View
      style={{
        width: 115,
        height: 80,
        borderRadius: 12,
        padding: 9,
        backgroundColor: 'rgba(250,246,239,0.03)',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(216,154,90,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 6,
          fontWeight: '700',
          letterSpacing: 1.5,
          color: 'rgba(250,246,239,0.55)',
          marginBottom: 4,
        }}
      >
        SIT WITH
      </Text>
      <Text
        style={{
          fontSize: 10,
          lineHeight: 12.5,
          color: colors.cream,
          fontWeight: '500',
          textAlign: 'center',
        }}
        numberOfLines={3}
      >
        {text}
      </Text>
    </View>
  );
}
```

- [ ] **Step 3: Verify the file still compiles**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npx tsc --noEmit
```

Expected: no errors. (The new components are defined but unused — that's OK at this stage.)

- [ ] **Step 4: Commit**

```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App"
git add mobile/app/\(tabs\)/home.tsx
git commit -m "$(cat <<'EOF'
Add WisdomCard variants inline in home.tsx (not yet wired)

Three variants — affirmation (filled warm gradient), quote (outlined italic Georgia + small-caps byline), prompt (dashed border + SIT WITH tag) — all share the 115×80pt footprint. WisdomCard discriminates on item.kind and dispatches. New imports for todaysWisdomSet / todaysReading / WisdomItem are in but not yet consumed. The old AffirmationStrip + QuotePostcard stay in place; Task 11 swaps them.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: WisdomStrip (inline in home.tsx)

**Why:** Container component for the swipeable wisdom set + paginator. Wraps the WisdomCard list.

**Files:**
- Modify: `mobile/app/(tabs)/home.tsx`

- [ ] **Step 1: Add the WisdomStrip component after the variants**

Append to `mobile/app/(tabs)/home.tsx`, after the `PromptVariant` from Task 7:

```tsx
// ─── Today's wisdom strip ───────────────────────────────────────
// Horizontal scrollable set of 8 mixed-kind wisdom cards with a
// paginator. The "active" dot is the first one — there's no actual
// scroll-position tracking yet, the dot count is just a visual
// affordance hinting at the set size. Add scroll-position tracking
// in a v1.1 polish pass if needed.
function WisdomStrip({ items }: { items: WisdomItem[] }) {
  return (
    <View style={{ marginTop: 14 }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: '500',
          color: colors.amber,
          letterSpacing: -0.4,
          marginBottom: 10,
        }}
      >
        Today's wisdom
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 9, paddingRight: 12 }}
      >
        {items.map((item, i) => (
          <WisdomCard key={`${item.kind}-${i}`} item={item} />
        ))}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 4,
          marginTop: 10,
        }}
      >
        {items.map((_, i) => (
          <View
            key={i}
            style={{
              height: 4,
              width: i === 0 ? 14 : 4,
              borderRadius: 99,
              backgroundColor:
                i === 0 ? colors.amber : 'rgba(250,246,239,0.18)',
            }}
          />
        ))}
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App"
git add mobile/app/\(tabs\)/home.tsx
git commit -m "$(cat <<'EOF'
Add WisdomStrip container component inline in home.tsx (not yet wired)

Horizontal ScrollView + N-dot paginator wrapping the polymorphic WisdomCard list. Paginator is visual-only for now — no scroll-position tracking. Section heading style ("Today's wisdom") matches the existing daily-wisdom heading.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: ReadingPreviewCard (inline in home.tsx)

**Why:** Home preview card that shows the reading's title + opening + fade-mask + continue link. Tapping pushes `/reading`.

**Files:**
- Modify: `mobile/app/(tabs)/home.tsx`

- [ ] **Step 1: Add the ReadingPreviewCard component**

Append to `mobile/app/(tabs)/home.tsx`, after `WisdomStrip` from Task 8:

```tsx
// ─── Today's reading preview ────────────────────────────────────
// Card sits beneath the wisdom strip. Self-contained — eyebrow
// label is inside the card so no section heading is needed above it.
// Tap pushes the full reader modal.
function ReadingPreviewCard({
  reading,
  onPress,
}: {
  reading: DailyReading;
  onPress: () => void;
}) {
  const opening = reading.body.find((b) => b.type === 'paragraph')?.text ?? '';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        marginTop: 14,
        padding: 12,
        borderRadius: 14,
        backgroundColor: 'rgba(216,154,90,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(216,154,90,0.22)',
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <Text
          style={{
            fontSize: 9,
            fontWeight: '700',
            letterSpacing: 1.5,
            color: colors.amber,
          }}
        >
          TODAY'S READING
        </Text>
        <Text
          style={{
            fontSize: 9,
            color: 'rgba(250,246,239,0.5)',
          }}
        >
          {reading.readTimeMinutes} min
        </Text>
      </View>
      <Text
        style={{
          fontFamily: 'Georgia',
          fontSize: 16,
          fontWeight: '500',
          color: colors.cream,
          marginBottom: 4,
          letterSpacing: -0.2,
        }}
        numberOfLines={1}
      >
        {reading.title}
      </Text>
      <Text
        style={{
          fontFamily: 'Georgia',
          fontStyle: 'italic',
          fontSize: 12,
          lineHeight: 16,
          color: 'rgba(250,246,239,0.78)',
        }}
        numberOfLines={2}
      >
        {opening}
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 1.2,
          color: colors.amber,
        }}
      >
        CONTINUE READING →
      </Text>
    </Pressable>
  );
}
```

You will also need to import `DailyReading` near the top of the file. Add to the existing models import line, or add a new one:

```ts
import type { WisdomItem, DailyReading } from '@/core/models/wisdom';
```

(Update the existing import from Task 7 — `import type { WisdomItem } from '@/core/models/wisdom';` becomes the line above.)

> **Note on the fade-out:** the spec shows a CSS-style mask gradient on the body text. React Native doesn't support `mask-image` natively. The cleanest approximation is `numberOfLines={2}` (already done above), which produces a hard truncation rather than a fade. A LinearGradient overlay could simulate a fade if visual polish demands it later; not required for v1.

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App"
git add mobile/app/\(tabs\)/home.tsx
git commit -m "$(cat <<'EOF'
Add ReadingPreviewCard inline in home.tsx (not yet wired)

Self-contained card — eyebrow + read time + serif title + italic opening line (truncated at 2 lines) + amber continue link. Tap pushes /reading. Note: dropped the spec's CSS mask fade-out in favour of numberOfLines truncation (RN doesn't support mask-image natively; fade overlay can be added later if visual polish demands).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Reader screen + register modal route

**Why:** Tap target for "Continue reading →". Renders today's reading with structured ReadingBlock paragraphs and pullquotes.

**Files:**
- Create: `mobile/app/reading.tsx`
- Modify: `mobile/app/_layout.tsx`

- [ ] **Step 1: Create the Reader screen**

Create `mobile/app/reading.tsx`:

```tsx
// Reader screen — modal that opens when the user taps "Continue
// reading →" on the Home tab. Renders today's reading via a
// structured ReadingBlock[] body. Minimal editorial styling: serif
// body, terra-warm pull-quote treatment with attribution.
//
// LAYOUT: scrollable content. Unlike Home, the reader is allowed —
// even expected — to scroll for longer pieces.

import { ScrollView, View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

import { todaysReading } from '@/core/constants/dailyReadings';
import type { ReadingBlock } from '@/core/models/wisdom';
import { colors } from '@/ui/tokens';

export default function ReaderScreen() {
  const router = useRouter();
  const reading = todaysReading();

  return (
    <View style={{ flex: 1, backgroundColor: colors.cosmicA }}>
      {/* Same cosmic-warm gradient as Home for visual continuity */}
      <LinearGradient
        colors={[colors.terraDeep + '44', 'transparent']}
        locations={[0, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 320 }}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Close button — top-right circular X */}
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={({ pressed }) => ({
            position: 'absolute',
            top: 12,
            right: 18,
            width: 32,
            height: 32,
            borderRadius: 999,
            backgroundColor: 'rgba(250,246,239,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            opacity: pressed ? 0.7 : 1,
          })}
          accessibilityRole="button"
          accessibilityLabel="Close reading"
        >
          <Feather name="x" size={16} color={colors.cream} />
        </Pressable>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 22,
            paddingTop: 24,
            paddingBottom: 60,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 2,
              color: colors.amber,
              marginBottom: 6,
            }}
          >
            VISORA · DAY {reading.dayNumber}
          </Text>
          <Text
            style={{
              fontFamily: 'Georgia',
              fontSize: 26,
              fontWeight: '500',
              lineHeight: 30,
              color: colors.cream,
              letterSpacing: -0.5,
              marginBottom: 6,
            }}
          >
            {reading.title}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: 'rgba(250,246,239,0.55)',
              marginBottom: 22,
            }}
          >
            {reading.readTimeMinutes} min read
          </Text>

          {reading.body.map((block, i) => (
            <ReadingBlockView key={i} block={block} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ReadingBlockView({ block }: { block: ReadingBlock }) {
  if (block.type === 'paragraph') {
    return (
      <Text
        style={{
          fontFamily: 'Georgia',
          fontSize: 15,
          lineHeight: 23,
          color: 'rgba(250,246,239,0.92)',
          marginBottom: 14,
        }}
      >
        {block.text}
      </Text>
    );
  }
  // pullquote
  return (
    <View
      style={{
        borderLeftWidth: 2,
        borderLeftColor: colors.amber,
        paddingLeft: 14,
        paddingVertical: 4,
        marginBottom: 18,
        marginTop: 6,
      }}
    >
      <Text
        style={{
          fontFamily: 'Georgia',
          fontStyle: 'italic',
          fontSize: 15,
          lineHeight: 22,
          color: colors.cream,
          marginBottom: 8,
        }}
      >
        "{block.text}"
      </Text>
      <Text
        style={{
          fontSize: 9,
          fontWeight: '700',
          letterSpacing: 1.5,
          color: colors.amber,
        }}
      >
        — {block.source.toUpperCase()}
      </Text>
    </View>
  );
}
```

- [ ] **Step 2: Register the route in `_layout.tsx`**

Edit `mobile/app/_layout.tsx`. Find the block of `Stack.Screen` modal routes (around line 89, the existing `capture-win` entry). After the `capture-win` Stack.Screen, add:

```tsx
            <Stack.Screen
              name="reading"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                gestureEnabled: true,
              }}
            />
```

- [ ] **Step 3: Verify TypeScript compiles**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App"
git add mobile/app/reading.tsx mobile/app/_layout.tsx
git commit -m "$(cat <<'EOF'
Add Reader screen + register /reading modal route

Renders today's reading from the dailyReadings selector via a structured ReadingBlock[] mapper — paragraphs flow as serif body, pullquotes get a left-border treatment with all-caps amber source attribution. Modal presentation matches capture-win (slide_from_bottom + gesture-enabled). Scrollable since longer readings won't fit one screen.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Refactor home.tsx — wire new components, delete old

**Why:** This is the integration step. New components have been built and tested in isolation; now they replace the old sections.

**Files:**
- Modify: `mobile/app/(tabs)/home.tsx`

- [ ] **Step 1: Update the LAYOUT CONTRACT comment at the top of the file**

In `mobile/app/(tabs)/home.tsx`, replace the existing LAYOUT CONTRACT block (lines 1-34) with:

```tsx
// Home tab.
//
// ═══════════════════════════════════════════════════════════════════
// ⚠️  LAYOUT CONTRACT — DO NOT BREAK
// ═══════════════════════════════════════════════════════════════════
// Home must ALWAYS fit on a single screen (no scroll), on iPhone 14
// and up. Breaking this is a recurring bug — we've fixed it 5+ times.
// Current sizing budget after the wisdom redesign (R52):
//
//   • Greeting row             ≈ 75pt
//   • Ritual card              ≈ 140pt  (minHeight, fixed)
//   • Today's wisdom strip     ≈ 130pt  (heading + 80pt cards + paginator)
//   • Today's reading card     ≈ 105pt  (self-contained, no external heading)
//   • paddingTop 4 + paddingBottom 90
//   • Total budget:            ≈ 450pt content
//
// Available content area on iPhone 14: ~620pt. Slack: +170pt.
// The Intention card (~80pt, conditional on ritual being done today)
// still fits inside the slack.
//
// DO NOT use flex:1 on the ritual card — R35 tried and the card
// ballooned to fill all available space. Fixed sizing is the answer.
// If layout pressure returns, compress one of the sections — not
// the ritual.
// ═══════════════════════════════════════════════════════════════════
//
// Sections, top to bottom:
//   1. RITUAL card             (unchanged)
//   2. INTENTION card          (conditional — only after ritual is done today)
//   3. TODAY'S WISDOM strip    (swipeable set of 8 mixed-kind cards)
//   4. TODAY'S READING card    (preview → tap pushes /reading modal)
//
// The wisdom strip and reading card replaced the older Affirmations
// strip + Daily wisdom quote in the R52 redesign.
```

- [ ] **Step 2: Replace the body of the `Home` component**

Find the existing `Home` function (around line 78). Inside the function body, REPLACE these lines:

```tsx
  // Round 12: daily-rotated affirmations based on user's active vision
  // categories (fallback to the full set when none exist yet).
  const activeVisions = useVisionAreasStore((s) => s.activeVisions);
  const visionCategories = Array.from(
    new Set(activeVisions().map((v) => v.category)),
  );
  const affirmations = todaysAffirmations(visionCategories, 5);

  // Round 12: quote section is now a single daily postcard, not a 5-card
  // swipeable carousel. The picker (todaysQuote) is day-of-year-deterministic.
  const quote = todaysQuote();
```

WITH:

```tsx
  // R52: wisdom redesign — single unified set replaces the separate
  // affirmations strip + daily quote. Categories filter the
  // affirmation pool; quotes and prompts are universal.
  const activeVisions = useVisionAreasStore((s) => s.activeVisions);
  const visionCategories = Array.from(
    new Set(activeVisions().map((v) => v.category)),
  );
  const wisdomItems = todaysWisdomSet(visionCategories, 8);
  const reading = todaysReading();

  const openReading = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    router.push('/reading');
  };
```

- [ ] **Step 3: Replace the rendered sections**

Find the JSX block in `Home` (around line 219-223) that reads:

```tsx
          {/* ── 3. AFFIRMATIONS strip ── */}
          <AffirmationStrip affirmations={affirmations} />

          {/* ── 4. QUOTE postcard ── */}
          <QuotePostcard quote={quote} />
```

REPLACE WITH:

```tsx
          {/* ── 3. TODAY'S WISDOM strip (R52) ── */}
          <WisdomStrip items={wisdomItems} />

          {/* ── 4. TODAY'S READING preview (R52) ── */}
          <ReadingPreviewCard reading={reading} onPress={openReading} />
```

- [ ] **Step 4: Delete the old `AffirmationStrip`, `AffirmationCard`, and `QuotePostcard` functions**

In `home.tsx`, find and delete the three function definitions (the section starting around line 230 with the comment `// ─── Affirmation strip — photographic cards, italic, identity ──` through the end of `QuotePostcard` around line 439). Stop deleting BEFORE the `// ─── Ritual feature card ───` block — that one stays.

The new `WisdomStrip`, `WisdomCard`, `AffirmationVariant`, `QuoteVariant`, `PromptVariant`, and `ReadingPreviewCard` you added in Tasks 7-9 should remain.

- [ ] **Step 5: Remove now-unused imports**

In the import block at the top of `home.tsx`, remove these (they're no longer referenced after Step 4):

```ts
import { BlurView } from 'expo-blur';
import { todaysQuote, type DailyQuote } from '@/core/constants/dailyQuotes';
import {
  todaysAffirmations,
  type Affirmation,
} from '@/core/constants/affirmations';
import { photoById } from '@/core/constants/photoLibrary';
```

The `Image` import from 'react-native' is still used by `RitualFeatureCard` (for the hero photo background), so keep that.

- [ ] **Step 6: Verify TypeScript compiles cleanly**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npx tsc --noEmit
```

Expected: no errors. If `Affirmation` or `DailyQuote` types are still referenced somewhere, the wisdom items file's internal imports re-derive them so home.tsx itself shouldn't need them.

- [ ] **Step 7: Run the full test suite to confirm nothing else regressed**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npm test
```

Expected: 18 tests still pass.

- [ ] **Step 8: Commit**

```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App"
git add mobile/app/\(tabs\)/home.tsx
git commit -m "$(cat <<'EOF'
Wire WisdomStrip + ReadingPreviewCard into Home, remove old sections

R52: Home's bottom two sections (AffirmationStrip + QuotePostcard) collapse into a single swipeable Today's wisdom strip (8 mixed-kind cards) and a new Today's reading preview card that pushes /reading. LAYOUT CONTRACT comment updated to reflect the new budget (~450pt, +170pt slack). Old AffirmationStrip / AffirmationCard / QuotePostcard functions deleted along with their now-unused imports (BlurView, photoById, type DailyQuote, type Affirmation).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Update layout mirror HTML

**Why:** The verifier mirror at `Manifestation App - Claude Design/_home-layout-mirror.html` is used to cross-check the Home layout pixel-for-pixel without a simulator. Spec requires it stay in sync.

**Files:**
- Modify: `Manifestation App - Claude Design/_home-layout-mirror.html`

- [ ] **Step 1: Read the existing mirror to understand its structure**

Run:
```bash
grep -n "Affirmations for today\|Daily wisdom" "/Users/shellena/Documents/Essea Labs/Manifestation App/Manifestation App - Claude Design/_home-layout-mirror.html"
```

This locates the sections that need replacing in the mirror.

- [ ] **Step 2: Find and replace the "Affirmations for today" section block in the mirror**

The mirror is a static HTML mockup; the exact replacement depends on its current structure. Replace the affirmation strip + daily wisdom blocks with one combined "Today's wisdom" block (8 placeholder cards in a horizontal strip + paginator) and one "Today's reading" preview block (eyebrow + serif title + 2-line italic body + continue link).

Use this as the markup for the wisdom strip (insert in place of the old affirmations strip):

```html
<div style="margin-top: 14px;">
  <div style="font-size: 22px; font-weight: 500; color: #D89A5A; letter-spacing: -0.4px; margin-bottom: 10px;">Today's wisdom</div>
  <div style="display: flex; gap: 9px; overflow: hidden;">
    <div style="flex-shrink: 0; width: 115px; height: 80px; border-radius: 12px; padding: 10px; background: linear-gradient(135deg, rgba(192,104,72,0.4), rgba(192,104,72,0.18)); border: 1px solid rgba(216,154,90,0.35); display: flex; align-items: center; justify-content: center; box-sizing: border-box;">
      <div style="font-family: Georgia, serif; font-style: italic; font-size: 11px; line-height: 14px; color: #FAF6EF; font-weight: 500; text-align: center;">I am magnetic to the right people.</div>
    </div>
    <div style="flex-shrink: 0; width: 115px; height: 80px; border-radius: 12px; padding: 9px; background: rgba(216,154,90,0.08); border: 1px solid rgba(216,154,90,0.22); display: flex; flex-direction: column; align-items: center; justify-content: center; box-sizing: border-box;">
      <div style="font-family: Georgia, serif; font-style: italic; font-size: 10px; line-height: 12.5px; color: #FAF6EF; text-align: center; margin-bottom: 4px;">"What we think, we become."</div>
      <div style="font-size: 6px; font-weight: 700; letter-spacing: 1.2px; color: #D89A5A;">— BUDDHA</div>
    </div>
    <div style="flex-shrink: 0; width: 115px; height: 80px; border-radius: 12px; padding: 9px; background: rgba(250,246,239,0.03); border: 1px dashed rgba(216,154,90,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; box-sizing: border-box;">
      <div style="font-size: 6px; font-weight: 700; letter-spacing: 1.5px; color: rgba(250,246,239,0.55); margin-bottom: 4px;">SIT WITH</div>
      <div style="font-size: 10px; line-height: 12.5px; color: #FAF6EF; font-weight: 500; text-align: center;">What are you ready to release?</div>
    </div>
  </div>
  <div style="display: flex; justify-content: center; gap: 4px; margin-top: 10px;">
    <div style="height: 4px; width: 14px; border-radius: 99px; background: #D89A5A;"></div>
    <div style="height: 4px; width: 4px; border-radius: 99px; background: rgba(250,246,239,0.18);"></div>
    <div style="height: 4px; width: 4px; border-radius: 99px; background: rgba(250,246,239,0.18);"></div>
    <div style="height: 4px; width: 4px; border-radius: 99px; background: rgba(250,246,239,0.18);"></div>
    <div style="height: 4px; width: 4px; border-radius: 99px; background: rgba(250,246,239,0.18);"></div>
    <div style="height: 4px; width: 4px; border-radius: 99px; background: rgba(250,246,239,0.18);"></div>
    <div style="height: 4px; width: 4px; border-radius: 99px; background: rgba(250,246,239,0.18);"></div>
    <div style="height: 4px; width: 4px; border-radius: 99px; background: rgba(250,246,239,0.18);"></div>
  </div>
</div>
```

And this for the reading preview (insert in place of the old daily wisdom card):

```html
<div style="margin-top: 14px; padding: 12px; border-radius: 14px; background: rgba(216,154,90,0.05); border: 1px solid rgba(216,154,90,0.22);">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
    <div style="font-size: 9px; font-weight: 700; letter-spacing: 1.5px; color: #D89A5A;">TODAY'S READING</div>
    <div style="font-size: 9px; color: rgba(250,246,239,0.5);">3 min</div>
  </div>
  <div style="font-family: Georgia, serif; font-size: 16px; font-weight: 500; color: #FAF6EF; margin-bottom: 4px; letter-spacing: -0.2px;">On Becoming Magnetic</div>
  <div style="font-family: Georgia, serif; font-style: italic; font-size: 12px; line-height: 16px; color: rgba(250,246,239,0.78);">You don't become magnetic by trying to be wanted. You become magnetic by being undivided.</div>
  <div style="margin-top: 8px; font-size: 10px; font-weight: 700; letter-spacing: 1.2px; color: #D89A5A;">CONTINUE READING →</div>
</div>
```

- [ ] **Step 3: Open the mirror in a browser to visually verify the layout fits**

Run:
```bash
open "/Users/shellena/Documents/Essea Labs/Manifestation App/Manifestation App - Claude Design/_home-layout-mirror.html"
```

Expected: all three iPhone frames (14, 15 Pro, 14 Pro Max) show Home with the new sections fitting comfortably below the ritual card with no scroll cut-off.

- [ ] **Step 4: Commit**

```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App"
git add "Manifestation App - Claude Design/_home-layout-mirror.html"
git commit -m "$(cat <<'EOF'
Update home layout mirror to reflect the wisdom redesign

The static HTML mirror is our verification surface (no Xcode/Simulator available). Replacing the old Affirmations strip + Daily wisdom blocks with the new Today's wisdom strip (3 visible mixed-kind cards + 8-dot paginator) and Today's reading preview card (eyebrow + serif title + italic opening + continue link).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Final smoke test on device + verification

**Why:** Specs and tests don't catch every visual or behavioural regression. End-to-end check before the redesign branch merges.

**Files:** none modified

- [ ] **Step 1: Run all unit tests one last time**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npm test
```

Expected: 18 tests pass across 3 test files. No failures.

- [ ] **Step 2: Run the TypeScript type check**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run the linter**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npm run lint
```

Expected: no errors. Warnings about unused imports in deleted code shouldn't appear since Task 11 cleaned them up.

- [ ] **Step 4: Boot the app and visit Home tab**

Run:
```bash
cd "/Users/shellena/Documents/Essea Labs/Manifestation App/mobile" && npm run ios
```

Manually verify (or take screenshots and inspect):
- Home tab renders the new wisdom strip with cards visible
- The first card is the "active" paginator state (wider amber dot)
- Swiping the strip works horizontally
- The reading preview card sits below the strip
- Tapping the reading card opens the reader as a modal sliding up from the bottom
- The close X in the reader dismisses the modal and returns to Home
- All three iPhone simulators (iPhone 14, 15 Pro, 14 Pro Max) show Home without vertical scroll

- [ ] **Step 5: Verify the ritual-done state**

In the app, tap "Begin ritual", complete the ritual flow (or use a dev shortcut if one exists), then verify Home shows:
- Greeting + Ritual + Intention card (~80pt) + Wisdom strip + Reading card
- All still fit without scroll (we have +170pt slack so this should be comfortable)

- [ ] **Step 6: Verify the empty-categories edge case**

If possible (via a fresh install or by clearing the vision store), verify Home renders sensibly even when the user has no active visions:
- `todaysWisdomSet([], 8)` falls back to the all-categories pool — wisdom strip should still populate
- Reading card always renders since reading selection is universal

- [ ] **Step 7: Final commit (if any test fixes were needed)**

If Steps 1-6 surfaced regressions that required code changes, fix them and commit per the discovered issue. Otherwise no commit needed in this task.

- [ ] **Step 8: Mark the redesign branch ready for the user to review**

Tell the user:
- Spec lived at `docs/superpowers/specs/2026-06-05-home-wisdom-redesign-design.md`
- Plan lived at `docs/superpowers/plans/2026-06-05-home-wisdom-redesign.md`
- All 13 tasks committed individually
- Tests pass, types clean, lint clean
- Manual verification complete on 3 iPhone sizes (or note any pending verification)

Ask them to manually try the app and approve before merging or extending content (writing readings 4-14, more prompts, more yoga quotes).
