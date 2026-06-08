// Daily readings — original Visora-voice reflections that embed
// attributed pull quotes from public-domain sacred texts.
//
// 50 readings seeded. The selector handles any pool size via modulo
// rotation; same calendar day always returns the same reading. To add
// more, follow the existing pattern:
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
  {
    id: 'r-004',
    dayNumber: 4,
    title: 'On the Mind as a Lake',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'The mind, the yogis say, is like a lake. When it’s still, you can see all the way to the bottom. When the wind agitates the surface, you can’t see anything at all — not even what’s right beneath you.' },
      { type: 'pullquote', text: 'Yoga is the cessation of the modifications of the mind.', source: 'Yoga Sutras 1.2 (Vivekananda, 1896)' },
      { type: 'paragraph', text: 'You don’t still the lake by reaching into it. You still it by stopping the wind — by not adding to the noise. Today, when something agitates you, try doing nothing for ten seconds. Watch the ripples subside on their own.' },
    ],
  },
  {
    id: 'r-005',
    dayNumber: 5,
    title: 'On What You Repeat',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'Whatever you do most often, you become. Not because the universe is keeping score, but because attention shapes a brain. The thoughts you rehearse build the grooves your mind defaults to. The actions you take twice become the actions you take a hundred times.' },
      { type: 'pullquote', text: 'All that we are is the result of what we have thought. The mind is everything. What we think, we become.', source: 'Dhammapada 1 (Müller, 1881)' },
      { type: 'paragraph', text: 'This is the comfort and the warning. The version of you you’re building is being built right now, by whatever you’re repeating. Today is one repetition. Choose well.' },
    ],
  },
  {
    id: 'r-006',
    dayNumber: 6,
    title: 'On Beginning Before Ready',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'There is no version of you, in any future, that feels fully ready. Ready is not a feeling that arrives. It is a story you tell yourself after you have already begun.' },
      { type: 'pullquote', text: 'It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.', source: 'Seneca, Letters to Lucilius 104 (Stewart, 1900)' },
      { type: 'paragraph', text: 'You will not feel different the day before you start. You will feel different the week after. The threshold is not on the other side of your fear — it is on the other side of one small act of beginning.' },
      { type: 'paragraph', text: 'Today: begin. Imperfectly, even badly. But begin.' },
    ],
  },
  {
    id: 'r-007',
    dayNumber: 7,
    title: 'On the Long Game',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'The thing you are building is slower than you want it to be. The version of you you can almost see is taking longer to arrive than feels fair.' },
      { type: 'paragraph', text: 'This is not a sign that something is wrong. This is the texture of becoming anything real.' },
      { type: 'pullquote', text: 'Heaven and earth are long-lasting. The reason that they are long-lasting is because they do not live for themselves.', source: 'Tao Te Ching 7 (Legge, 1891)' },
      { type: 'paragraph', text: 'What lasts is what does not strain for its own quick reward. The oak takes a hundred years to look like an oak. You are allowed to be slow.' },
    ],
  },
  {
    id: 'r-008',
    dayNumber: 8,
    title: 'On What You Water',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'There is an old line — old enough that no one remembers who said it first — about two wolves inside you, one made of fear and one made of love. Which one wins, the elder said, is the one you feed.' },
      { type: 'paragraph', text: 'In your own life: the resentment you keep rehearsing is being fed. The vision you keep returning to is being fed. The story about why it’s too late is being fed.' },
      { type: 'pullquote', text: 'A disciplined mind brings happiness.', source: 'Dhammapada 35 (Müller, 1881)' },
      { type: 'paragraph', text: 'Discipline is not punishment. It is choosing, today, what gets your water.' },
    ],
  },
  {
    id: 'r-009',
    dayNumber: 9,
    title: 'On Letting Go',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'The Bhagavad Gita has one of the strangest pieces of life advice ever written down. It is given to a warrior, at the edge of a battlefield, who does not want to fight.' },
      { type: 'pullquote', text: 'You have the right to work, but never to the fruit of work.', source: 'Bhagavad Gita 2.47 (Arnold, 1885)' },
      { type: 'paragraph', text: 'Do your part. Then release the outcome. Not because outcomes don’t matter — they do — but because clinging to them is what makes the work brittle. The person who can give the work everything and want the result without grasping it is the person who can keep showing up.' },
      { type: 'paragraph', text: 'Today, do the work. Let the result be what it is.' },
    ],
  },
  {
    id: 'r-010',
    dayNumber: 10,
    title: 'On the Quiet Practice',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'The practice that changes you is the one no one applauds. The exercise no one sees. The kindness no one credits you for. The honest sentence you wrote and deleted because it would have hurt.' },
      { type: 'pullquote', text: 'The superior man is modest in his speech, but exceeds in his actions.', source: 'Analects 14.27 (Legge, 1893)' },
      { type: 'paragraph', text: 'You don’t need the audience. The you watching is enough.' },
    ],
  },
  {
    id: 'r-011',
    dayNumber: 11,
    title: 'On the Bow’s Tension',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'A bow held loose can’t launch the arrow. A bow held too taut snaps. The yogis taught this not as a metaphor but as a practical instruction: too much effort destroys; too little dissolves.' },
      { type: 'pullquote', text: 'Yoga is skill in action.', source: 'Bhagavad Gita 2.50 (Arnold, 1885)' },
      { type: 'paragraph', text: 'The right effort is the one that holds the tension just enough. Today, ask of any difficult thing: am I gripping it, or am I letting it lie limp? Find the middle.' },
    ],
  },
  {
    id: 'r-012',
    dayNumber: 12,
    title: 'On Becoming Whole',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'You are not, as the world sometimes seems to insist, a project to be optimised. You are something closer to a garden — a particular configuration of soil and light, with certain things that already grow easily in you and certain things that don’t.' },
      { type: 'paragraph', text: 'The work of becoming is less about fixing what is missing and more about tending what already wants to grow.' },
      { type: 'pullquote', text: 'When friendliness, compassion, gladness, and indifference are practised, the mind becomes pure.', source: 'Yoga Sutras 1.33 (Vivekananda, 1896)' },
      { type: 'paragraph', text: 'Patanjali’s four — friendliness, compassion, gladness, indifference. Each one is a quality you already have access to. The work is to water them.' },
    ],
  },
  {
    id: 'r-013',
    dayNumber: 13,
    title: 'On Each Morning',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'Marcus Aurelius wrote himself a morning instruction, nearly every day, for years. He was the most powerful man in the world, and he still needed to remind himself how to wake up.' },
      { type: 'pullquote', text: 'When you arise in the morning, think of what a precious privilege it is to be alive — to breathe, to think, to enjoy, to love.', source: 'Meditations (Long, 1862)' },
      { type: 'paragraph', text: 'Today is the same day, only the privilege has come back around to you. Begin in the same place he did: aware that the day did not have to arrive.' },
    ],
  },
  {
    id: 'r-014',
    dayNumber: 14,
    title: 'On Choosing Your Field',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'You cannot be all things. You cannot pour yourself into every cup. The energy you spend trying to live every possible life is energy not spent living the one that is yours.' },
      { type: 'pullquote', text: 'Better is one’s own duty, though imperfectly performed, than the duty of another well discharged.', source: 'Bhagavad Gita 3.35 (Arnold, 1885)' },
      { type: 'paragraph', text: 'This is the strange permission the Gita gives. Your particular work — the work shaped by who you actually are — is more yours than someone else’s impressive work could ever be. Better imperfect and yours than perfect and borrowed.' },
      { type: 'paragraph', text: 'What is yours, today, to do imperfectly?' },
    ],
  },
  {
    id: 'r-015',
    dayNumber: 15,
    title: 'On the Weight You Carry',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'Epictetus, born a slave, taught a kind of inner freedom that no one could take from him. He divided everything you might ever encounter into two piles: things in your power, and things not.' },
      { type: 'pullquote', text: 'Some things are in our control and others are not. Things in our control are opinion, pursuit, desire, aversion; things not in our control are body, property, reputation, command.', source: 'Discourses 1.1 (Long, 1877)' },
      { type: 'paragraph', text: 'Most of what exhausts you is the second pile — the things you cannot control but keep trying to. The reputation. The reaction. The weather.' },
      { type: 'paragraph', text: 'Today, sort one thing out of the second pile and into the first. Watch what happens to its weight.' },
    ],
  },
  {
    id: 'r-016',
    dayNumber: 16,
    title: 'On What Stays',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'Lao Tzu watched water carve canyons out of stone and noticed something. The softest thing in the world was changing the hardest, not by force, but by patience.' },
      { type: 'pullquote', text: 'Water is the softest thing on earth, yet it overcomes the hard and strong.', source: 'Tao Te Ching 78 (Legge, 1891)' },
      { type: 'paragraph', text: 'You do not need to be louder, harder, more forceful. You need to keep going. The thing you are building does not need to be impressive in a day. It needs to still be there in a year.' },
    ],
  },
  {
    id: 'r-017',
    dayNumber: 17,
    title: 'On Naming the Truth',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'Confucius was asked what he would do if he became the ruler of a state. The first thing, he said, was the rectification of names — making sure that what is called a thing actually is that thing.' },
      { type: 'pullquote', text: 'If names be not correct, language is not in accordance with the truth of things.', source: 'Analects 13.3 (Legge, 1893)' },
      { type: 'paragraph', text: 'Apply this to yourself. What in your life is being called by the wrong name? The job you call a passion. The exhaustion you call commitment. The avoidance you call patience. When you name something correctly, you can finally respond to what it actually is.' },
    ],
  },
  {
    id: 'r-018',
    dayNumber: 18,
    title: 'On Saying Less',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'You will rarely regret what you didn’t say. You will regularly regret what you did.' },
      { type: 'pullquote', text: 'Better than a thousand hollow words is one word that brings peace.', source: 'Dhammapada 100 (Müller, 1881)' },
      { type: 'paragraph', text: 'Speech is a use of yourself. Pour yourself into a few sentences that matter rather than spreading thin across many that don’t. Today, listen more than you talk. Notice what fills the silence when you stop filling it.' },
    ],
  },
  {
    id: 'r-019',
    dayNumber: 19,
    title: 'On the Slow Build',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'The thing you are building does not need to be impressive yet. It needs to keep being built.' },
      { type: 'pullquote', text: 'Difficult things in the world must have their beginnings in the easy. The greatest things must have their beginnings in the small.', source: 'Tao Te Ching 63 (Legge, 1891)' },
      { type: 'paragraph', text: 'The grand thing you can see is downstream of a hundred small things you can do today. Pick one. Do it. Tomorrow, do another.' },
    ],
  },
  {
    id: 'r-020',
    dayNumber: 20,
    title: 'On Loving the Work',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'There is a hunger in modern life for the result without the work — for the body without the lifting, the writing without the revising, the relationship without the rupture and repair.' },
      { type: 'paragraph', text: 'But you cannot have the result and not the work. The work IS the result, repeated.' },
      { type: 'pullquote', text: 'Let your concern be with action alone, never with the fruits of action.', source: 'Bhagavad Gita 2.47 (Arnold, 1885)' },
      { type: 'paragraph', text: 'If you can fall in love with the work — not the trophy at the end of the work — you have built yourself something no one can take away.' },
    ],
  },
  {
    id: 'r-021',
    dayNumber: 21,
    title: 'On Sitting With Difficulty',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'There is a difficulty in your life right now that you are spending energy trying not to feel. Notice that the energy of avoidance is, often, more exhausting than the feeling itself.' },
      { type: 'pullquote', text: 'The obstacle is the way.', source: 'Meditations 5.20 (Long, 1862, condensed)' },
      { type: 'paragraph', text: 'Marcus was writing about how the very thing standing in your path becomes the path itself — not by getting around it, but by going through it. The fear you keep walking around is the door you need to walk through.' },
      { type: 'paragraph', text: 'Today, sit with the difficulty for five minutes. Don’t fix it. Just sit.' },
    ],
  },
  {
    id: 'r-022',
    dayNumber: 22,
    title: 'On the Future Self',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'Picture the version of you a year from now. Specifically. What are they wearing? Where are they standing? Who is in the room with them?' },
      { type: 'pullquote', text: 'A man is made by his belief. As he believes, so he is.', source: 'Bhagavad Gita 17.3 (Arnold, 1885)' },
      { type: 'paragraph', text: 'They already exist somewhere — in your imagination, in your potential, in the choices you have not yet made but will. The work of today is to vote for them with one small action.' },
    ],
  },
  {
    id: 'r-023',
    dayNumber: 23,
    title: 'On Receiving',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'You may have learned, somewhere along the way, that to receive is to owe. That to accept help is to admit weakness. That you should be the one giving, not the one taking.' },
      { type: 'pullquote', text: 'The sage does not accumulate. The more he gives to others, the more he has for his own.', source: 'Tao Te Ching 81 (Legge, 1891)' },
      { type: 'paragraph', text: 'The giving and the receiving are the same circuit. To refuse to receive is to break the circuit. Today, when someone offers you something — a compliment, a hand, an idea — say thank you, and let yourself actually have it.' },
    ],
  },
  {
    id: 'r-024',
    dayNumber: 24,
    title: 'On the Hidden Roots',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'The tree in your garden grew its visible part above ground over years you could see. But it grew its roots — the part that holds it through every storm — in the dark, where no one watched.' },
      { type: 'pullquote', text: 'The tree which fills the arms grew from the tiniest sprout.', source: 'Tao Te Ching 64 (Legge, 1891)' },
      { type: 'paragraph', text: 'What you are doing now, in the unwatched hours, is rooting. It will not look like growth. It is.' },
    ],
  },
  {
    id: 'r-025',
    dayNumber: 25,
    title: 'On the Body as Teacher',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'The body is older than the mind. It knew you before you had words for yourself. When the mind says one thing and the body says another, the body is usually closer to the truth.' },
      { type: 'pullquote', text: 'When posture is steady and easy, the seat is established.', source: 'Yoga Sutras 2.46 (Vivekananda, 1896)' },
      { type: 'paragraph', text: 'A steady seat is not a posture. It is a relationship with your body — the willingness to listen to what it tells you about who you are with, what you’re doing, where you should not be.' },
      { type: 'paragraph', text: 'Today, ask your body once. Then act on what it answers.' },
    ],
  },
  {
    id: 'r-026',
    dayNumber: 26,
    title: 'On Quiet Confidence',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'The loudest people in the room are not usually the most certain. They are often the most afraid of being unnoticed. Real confidence has no need to announce itself.' },
      { type: 'pullquote', text: 'He who knows others is wise. He who knows himself is enlightened.', source: 'Tao Te Ching 33 (Legge, 1891)' },
      { type: 'paragraph', text: 'When you know yourself, you don’t need anyone else to confirm that you exist. You can be in the room without performing being in the room.' },
    ],
  },
  {
    id: 'r-027',
    dayNumber: 27,
    title: 'On Returning',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'You will leave this practice. You will leave your intentions. You will leave your future self for the comfort of an old pattern. This is not failure.' },
      { type: 'pullquote', text: 'Come, come, whoever you are. Wanderer, worshipper, lover of leaving. Come, even though you have broken your vow a thousand times. Come, yet again, come.', source: 'Attributed to Rumi (early 20th-century rendering)' },
      { type: 'paragraph', text: 'The practice is not in never leaving. The practice is in returning. Today, return. That’s all today is asking of you.' },
    ],
  },
  {
    id: 'r-028',
    dayNumber: 28,
    title: 'On Naming Yourself',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'The world will keep trying to give you names. Some will fit; most won’t. The most powerful act in becoming is to name yourself from the inside.' },
      { type: 'pullquote', text: 'I am the Self seated in the hearts of all creatures.', source: 'Bhagavad Gita 10.20 (Arnold, 1885)' },
      { type: 'paragraph', text: 'You are not the label they handed you. You are not the diagnosis or the role or the way you were described in school. Underneath all of it, something quieter and truer waits to be claimed.' },
    ],
  },
  {
    id: 'r-029',
    dayNumber: 29,
    title: 'On the Cost of Maybe',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'Indecision costs more than the wrong decision. The wrong decision teaches you. Indecision just drains you, slowly, in a way you mostly don’t notice until you’re empty.' },
      { type: 'pullquote', text: 'No man can live happily who regards himself alone, who turns everything to his own advantage.', source: 'Seneca, Letters to Lucilius 48 (Stewart, 1900)' },
      { type: 'paragraph', text: 'Today, take one maybe off the shelf. Decide. Even badly. Even quickly. The decision is what frees the energy you’re leaking on it.' },
    ],
  },
  {
    id: 'r-030',
    dayNumber: 30,
    title: 'On Listening',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'You probably think you’re a good listener. Most people do. What most people actually do is wait for the other person to finish so they can say the thing they’ve been holding.' },
      { type: 'pullquote', text: 'When you know a thing, to hold that you know it; when you do not know a thing, to allow that you do not know it — this is knowledge.', source: 'Analects 2.17 (Legge, 1893)' },
      { type: 'paragraph', text: 'Real listening starts with admitting you don’t already know what the other person is about to say. Today, listen with the assumption that you don’t know yet. Notice what arrives in the gap.' },
    ],
  },
  {
    id: 'r-031',
    dayNumber: 31,
    title: 'On the Hidden Garden',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'The most important work of your life is happening in a part of you that no one — including you, on most days — can see.' },
      { type: 'pullquote', text: 'The sage manages affairs without doing anything, and conveys his instructions without the use of speech.', source: 'Tao Te Ching 2 (Legge, 1891)' },
      { type: 'paragraph', text: 'Wu wei: action without strain, doing without forcing. The work that is actually changing you is the slow, hidden, ordinary work — the conversations you don’t cut short, the disciplines you don’t skip, the kindnesses you don’t advertise.' },
    ],
  },
  {
    id: 'r-032',
    dayNumber: 32,
    title: 'On Forgiving the Past',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'You cannot become the next version of yourself while still litigating the previous one. The energy is the same energy. You have to choose where to spend it.' },
      { type: 'pullquote', text: 'The pain that has not yet come is to be avoided.', source: 'Yoga Sutras 2.16 (Vivekananda, 1896)' },
      { type: 'paragraph', text: 'Patanjali is precise. The pain already lived — you cannot avoid. The pain not yet come — you can. Most of what is dragging you is the pain you keep re-living, in a loop, hoping the past will somehow turn out differently.' },
      { type: 'paragraph', text: 'It won’t. Forgive yourself the loop. Begin tending what is in front of you.' },
    ],
  },
  {
    id: 'r-033',
    dayNumber: 33,
    title: 'On Right Effort',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'There is an effort that exhausts you and an effort that energises you. Both look like work from the outside. From the inside, they are completely different.' },
      { type: 'pullquote', text: 'Better than a thousand years lived in idleness is a single day spent in earnest effort.', source: 'Dhammapada 112 (Müller, 1881)' },
      { type: 'paragraph', text: 'The effort that energises is the one aligned with what you actually want. The effort that exhausts is the one you are doing to be approved of. Notice which one today’s work is.' },
    ],
  },
  {
    id: 'r-034',
    dayNumber: 34,
    title: 'On the Witness',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'There is a part of you that watches you. It’s been there your whole life, never anxious, never grasping. It watched you as a child. It will watch you when you’re old.' },
      { type: 'pullquote', text: 'Yoga is the cessation of the modifications of the mind. Then the seer rests in his own true nature.', source: 'Yoga Sutras 1.2–1.3 (Vivekananda, 1896)' },
      { type: 'paragraph', text: 'Patanjali calls this the seer. Most days you are so caught up in the modifications — the worry, the planning, the rehearsing — that you forget the seer is here too.' },
      { type: 'paragraph', text: 'Today, three times, ask: who is watching this thought? You won’t get an answer. You will feel a settling.' },
    ],
  },
  {
    id: 'r-035',
    dayNumber: 35,
    title: 'On What Money Cannot Buy',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'Seneca was one of the richest men in Rome. He also wrote some of the most honest things ever written about why riches don’t cure anything.' },
      { type: 'pullquote', text: 'It is not the man who has too little, but the man who craves more, that is poor.', source: 'Seneca, Letters to Lucilius 2 (Stewart, 1900)' },
      { type: 'paragraph', text: 'Money is a useful tool. It is not the thing your becoming is for. Notice what you actually want when you say you want more money. Often it’s permission, safety, or time. Money buys some of one and very little of the others.' },
    ],
  },
  {
    id: 'r-036',
    dayNumber: 36,
    title: 'On Friendship as Practice',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'Friendship is not a feeling you have toward a person. It is a practice you do with them — the showing up, the asking honest questions, the staying through the boring middle.' },
      { type: 'pullquote', text: 'When you meet a virtuous man, think of becoming his equal. When you meet one of unworthy character, look inward and examine yourself.', source: 'Analects 4.17 (Legge, 1893)' },
      { type: 'paragraph', text: 'The people around you are showing you who you can be and who you’re drifting toward becoming. Choose carefully who you spend your hours with. They are shaping you while you’re looking the other way.' },
    ],
  },
  {
    id: 'r-037',
    dayNumber: 37,
    title: 'On the Inner Voice',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'You already know. Underneath the noise of opinion and worry and second-guessing, there is a voice that knows. It is quiet because it doesn’t need to argue.' },
      { type: 'pullquote', text: 'When concentration is unmoved, the seeing is true.', source: 'Yoga Sutras 1.43 (Vivekananda, 1896, paraphrased)' },
      { type: 'paragraph', text: 'The reason you can’t hear it is that you have not yet sat quiet enough for it to be the loudest thing in the room. Today, give it five minutes. Ask it one question. Don’t reach for the answer. Let it surface.' },
    ],
  },
  {
    id: 'r-038',
    dayNumber: 38,
    title: 'On Being Seen',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'You spend most of your life being looked at. You spend less of it being seen. The difference is the difference between performing and being known.' },
      { type: 'pullquote', text: 'I am the same to all beings; to me there is none hateful or dear.', source: 'Bhagavad Gita 9.29 (Arnold, 1885)' },
      { type: 'paragraph', text: 'The version of you that wants to be seen is also afraid of it. To be seen is to risk not being loved for the visible thing. Show up anyway. Let one person, today, see slightly more of you than is comfortable.' },
    ],
  },
  {
    id: 'r-039',
    dayNumber: 39,
    title: 'On the Reservoir',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'You cannot pour from an empty cup. Everyone says this. Almost no one acts on it.' },
      { type: 'pullquote', text: 'He who is contented is rich.', source: 'Tao Te Ching 33 (Legge, 1891)' },
      { type: 'paragraph', text: 'Rest is not a reward for finishing. Rest is the soil from which finishing becomes possible. Today, refill before you’re empty. Notice what you have, before you reach for what you don’t.' },
    ],
  },
  {
    id: 'r-040',
    dayNumber: 40,
    title: 'On Showing Up Anyway',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'Some days the work will feel hollow. Some days the practice will feel pointless. Most of becoming happens on the days when the practice feels hollow and you show up anyway.' },
      { type: 'pullquote', text: 'Begin — to begin is half the work; let half still remain. Again begin this, and thou wilt have finished.', source: 'Attributed to Ausonius, Epigram (Loeb, 1919)' },
      { type: 'paragraph', text: 'You will not always feel like the person you’re becoming. You will need to act like them anyway. The feeling follows the act, not the other way around.' },
    ],
  },
  {
    id: 'r-041',
    dayNumber: 41,
    title: 'On the Empty Cup',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'There is an old story about a master who poured tea for a visitor and kept pouring after the cup was full. The tea spilled across the table. The visitor protested. The master said: like this cup, you are full of your own opinions. How can I show you anything until you empty it?' },
      { type: 'pullquote', text: 'When you know a thing, to hold that you know it; when you do not know a thing, to allow that you do not know it.', source: 'Analects 2.17 (Legge, 1893)' },
      { type: 'paragraph', text: 'Today, in one conversation, pretend you don’t already know. See what comes in.' },
    ],
  },
  {
    id: 'r-042',
    dayNumber: 42,
    title: 'On the Quiet After Practice',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'The most important moment of a ritual is not the ritual. It is the minute after. The minute where you carry the stillness, undefended, back into the day.' },
      { type: 'pullquote', text: 'Practice becomes firmly grounded when well attended to for a long time, without break, in earnest.', source: 'Yoga Sutras 1.14 (Vivekananda, 1896)' },
      { type: 'paragraph', text: 'You don’t need a longer practice. You need an unbroken one. Today, do the small thing. Then carry the after into the next hour.' },
    ],
  },
  {
    id: 'r-043',
    dayNumber: 43,
    title: 'On Becoming a Mountain',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'A mountain is not impressive because it is large. It is impressive because it is still. The weather happens around it. The seasons happen around it. The mountain remains.' },
      { type: 'pullquote', text: 'He whose mind is unshaken in pain, who has lost desire for pleasures, who is free from attachment, fear, and anger — he is the sage of steady wisdom.', source: 'Bhagavad Gita 2.56 (Arnold, 1885)' },
      { type: 'paragraph', text: 'You are allowed to be a mountain. Allowed to not bend toward every wind that visits. Today, be still inside one situation that usually moves you.' },
    ],
  },
  {
    id: 'r-044',
    dayNumber: 44,
    title: 'On the One Thing',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'The list of what you could do today is infinite. The list of what you can actually do well today is short. The art of becoming is choosing one thing from the second list, and not letting the first list win.' },
      { type: 'pullquote', text: 'The superior man may indeed have to endure want, but the mean man, when he is in want, gives way to unbridled license.', source: 'Analects 15.1 (Legge, 1893)' },
      { type: 'paragraph', text: 'Discipline is the willingness to do less so that what you do can be real. Pick one thing for today. Then actually do it.' },
    ],
  },
  {
    id: 'r-045',
    dayNumber: 45,
    title: 'On Becoming Less Reactive',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'Between what happens and what you do, there is a gap. The gap is where you live. The size of the gap is the size of your freedom.' },
      { type: 'pullquote', text: 'When the mind becomes free from the modifications, then alone is the seer established in himself.', source: 'Yoga Sutras 1.3 (Vivekananda, 1896)' },
      { type: 'paragraph', text: 'Today, in one moment that usually triggers a reaction in you, pause for one breath before answering. The gap will feel awkward. Stay in it. The response that comes from the gap is closer to who you want to be.' },
    ],
  },
  {
    id: 'r-046',
    dayNumber: 46,
    title: 'On the Old Wound',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'There is a place in you that was hurt a long time ago and never fully tended. It still organises some of your reactions. You can call it whatever you want. The work is the same: to stop pretending it isn’t there.' },
      { type: 'pullquote', text: 'The wound is the place where the Light enters you.', source: 'Attributed to Rumi (early 20th-century rendering)' },
      { type: 'paragraph', text: 'You don’t need to fix it today. You need to acknowledge it. The energy you spend not feeling it is the energy not available for the rest of your becoming.' },
      { type: 'paragraph', text: 'Today, place a hand where the old hurt lives. Just for a moment. Just to say: I know you’re there.' },
    ],
  },
  {
    id: 'r-047',
    dayNumber: 47,
    title: 'On Soft Power',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'You were probably taught that to be strong is to be hard. To make yourself unbendable. To never need anyone.' },
      { type: 'pullquote', text: 'There is nothing in the world more soft and weak than water, and yet for attacking things that are firm and strong, there is nothing that can take precedence of it.', source: 'Tao Te Ching 78 (Legge, 1891)' },
      { type: 'paragraph', text: 'Lao Tzu noticed the opposite. The thing that endures is the thing flexible enough to bend without breaking. Today, soften one place where you have been hard. Notice if anything actually gets weaker, or if more becomes possible.' },
    ],
  },
  {
    id: 'r-048',
    dayNumber: 48,
    title: 'On What You Cannot Force',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'You can plant a seed. You cannot make it grow on your schedule. You can extend the invitation. You cannot make someone arrive.' },
      { type: 'pullquote', text: 'Surrendering all your actions to Me, with your mind fixed on the Self — be free from longing and the sense of ownership; fight, free from anguish.', source: 'Bhagavad Gita 3.30 (Arnold, 1885)' },
      { type: 'paragraph', text: 'Surrender is not giving up. It is releasing your grip on the part you were never holding anyway. The work is still yours. The harvest is not.' },
    ],
  },
  {
    id: 'r-049',
    dayNumber: 49,
    title: 'On Daily Bread',
    readTimeMinutes: 2,
    body: [
      { type: 'paragraph', text: 'You woke up. The day arrived. Most of the world’s spiritual traditions, in some form, ask you to begin here — not with what is missing, but with what already came.' },
      { type: 'pullquote', text: 'When you arise in the morning, think of what a precious privilege it is to be alive.', source: 'Meditations (Long, 1862)' },
      { type: 'paragraph', text: 'Gratitude is not the same as denial. It is not pretending nothing is hard. It is choosing to start the day from what already arrived, before reaching for what hasn’t.' },
    ],
  },
  {
    id: 'r-050',
    dayNumber: 50,
    title: 'On the Person You Are Becoming',
    readTimeMinutes: 3,
    body: [
      { type: 'paragraph', text: 'You are not the same person who started reading these. You are a few weeks of small attention closer to who you want to be. That is not nothing. That is, actually, the whole thing.' },
      { type: 'pullquote', text: 'Whatever a man’s belief is, that he is, even in this world; what he believes hereafter, that also he becomes.', source: 'Bhagavad Gita 17.3 (Arnold, 1885)' },
      { type: 'paragraph', text: 'The Gita is precise. You are not just becoming because of what you do. You are becoming because of what you keep believing about who you are.' },
      { type: 'paragraph', text: 'Today, believe the version of you you are walking toward is already, in some small way, here. Then live the day as if that were true. It will be.' },
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
