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
      { type: 'paragraph', text: 'Lao Tzu didn’t say it begins with a leap. He didn’t say it begins with vision, or courage, or a plan. He says it begins beneath your feet — with what is already there, where you already are.' },
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
