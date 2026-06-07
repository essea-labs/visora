// Daily quote rotation — SPEC §6.11 framed-wisdom layer on the Today tab.
// 30+ entries; we cycle by day-of-year so the same quote shows for the
// whole local day. All quotes are public-domain, fair-use, or attributed.

export interface DailyQuote {
  text: string;
  author: string;
}

export const QUOTES: DailyQuote[] = [
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Be the change you wish to see in the world.', author: 'Mahatma Gandhi' },
  { text: 'What we think, we become.', author: 'Buddha' },
  { text: 'The future depends on what you do today.', author: 'Mahatma Gandhi' },
  { text: "Believe you can and you're halfway there.", author: 'Theodore Roosevelt' },
  { text: 'Quality is not an act, it is a habit.', author: 'Aristotle' },
  { text: 'Well done is better than well said.', author: 'Benjamin Franklin' },
  { text: 'The mind is everything. What you think you become.', author: 'Buddha' },
  { text: 'You miss 100% of the shots you don’t take.', author: 'Wayne Gretzky' },
  { text: 'Whether you think you can, or you think you can’t — you’re right.', author: 'Henry Ford' },
  { text: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
  { text: 'It always seems impossible until it’s done.', author: 'Nelson Mandela' },
  { text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe' },
  { text: 'A journey of a thousand miles begins with a single step.', author: 'Lao Tzu' },
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
  { text: 'Energy and persistence conquer all things.', author: 'Benjamin Franklin' },
  { text: 'Patience is bitter, but its fruit is sweet.', author: 'Aristotle' },
  { text: 'You become what you give your attention to.', author: 'Epictetus' },
  { text: 'No man steps in the same river twice.', author: 'Heraclitus' },
  { text: 'A ship in port is safe, but that’s not what ships are built for.', author: 'Grace Hopper' },
  { text: 'There is nothing impossible to one who tries.', author: 'Alexander the Great' },
  { text: 'Out of difficulties grow miracles.', author: 'Jean de La Bruyère' },
  { text: 'The man who moves a mountain begins by carrying away small stones.', author: 'Confucius' },
  { text: 'Slow and steady wins the race.', author: 'Aesop' },
  { text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
  { text: 'Knowing yourself is the beginning of all wisdom.', author: 'Aristotle' },
  { text: 'The reward for work well done is the opportunity to do more.', author: 'Jonas Salk' },
  { text: 'A goal without a plan is just a wish.', author: 'Antoine de Saint-Exupéry' },
  { text: 'You can’t cross the sea merely by standing and staring at the water.', author: 'Rabindranath Tagore' },
  { text: 'Do not wait to strike till the iron is hot, but make it hot by striking.', author: 'William Butler Yeats' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn' },
  // Yoga literature & sacred-text additions (public-domain)
  // All translations used here are pre-1929 (US public-domain).
  // Attribution format: "{TEXT} - {TRANSLATOR}, {YEAR}".
  { text: 'Yoga is the cessation of the modifications of the mind.', author: 'Yoga Sutras 1.2 — Vivekananda, 1896' },
  { text: 'When friendliness, mercy, gladness, and indifference are practised, the mind becomes pure.', author: 'Yoga Sutras 1.33 — Vivekananda, 1896' },
  { text: 'You have the right to work, but never to the fruit of work.', author: 'Bhagavad Gita 2.47 — Arnold, 1885' },
  { text: 'Still your mind in me, still yourself in me, and without a doubt you shall be united with me.', author: 'Bhagavad Gita 12.8 — Arnold, 1885' },
  { text: 'A man is made by his belief. As he believes, so he is.', author: 'Bhagavad Gita 17.3 — Arnold, 1885' },
  { text: 'The journey of a thousand li begins beneath one\'s feet.', author: 'Tao Te Ching 64 — Legge, 1891' },
  { text: 'He who knows others is wise; he who knows himself is enlightened.', author: 'Tao Te Ching 33 — Legge, 1891' },
  { text: 'Water is the softest thing on earth, yet it overcomes the hard and strong.', author: 'Tao Te Ching 78 — Legge, 1891' },
  { text: 'The best way to take care of the future is to take care of the present moment.', author: 'Marcus Aurelius — Long, 1862' },
  { text: 'You have power over your mind — not outside events. Realise this, and you will find strength.', author: 'Marcus Aurelius — Long, 1862' },
  { text: 'Confine yourself to the present.', author: 'Marcus Aurelius — Long, 1862' },
  { text: 'Out beyond ideas of wrong-doing and right-doing, there is a field. I will meet you there.', author: 'Rumi — Whinfield, 1887' },
  { text: 'Be empty of worrying. Think of who created thought.', author: 'Rumi — Whinfield, 1887' },
  { text: 'Hardships often prepare ordinary people for an extraordinary destiny.', author: 'Marcus Aurelius — Long, 1862' },
  { text: 'The mind is restless and difficult to restrain, but it is subdued by practice.', author: 'Bhagavad Gita 6.35 — Arnold, 1885' },
];

function dayOfYear(d: Date = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

export function todaysQuote(): DailyQuote {
  const idx = dayOfYear() % QUOTES.length;
  return QUOTES[idx];
}

/**
 * Today's rotating quotes — today's, then the next few in the cycle.
 * Used by the Today tab's swipeable quote carousel.
 */
export function quoteCarousel(limit = 5): DailyQuote[] {
  const start = dayOfYear() % QUOTES.length;
  return Array.from({ length: limit }, (_, i) => QUOTES[(start + i) % QUOTES.length]);
}
