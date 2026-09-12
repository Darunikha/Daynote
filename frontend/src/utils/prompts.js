/**
 * Gentle, optional writing prompts shown when starting a new entry. Purely a
 * visual nudge — nothing here ever touches the entry's actual content, and
 * nothing here is persisted with the entry.
 */
export const PROMPT_CATEGORIES = [
  { id: 'self-reflection', label: 'Self-Reflection', emoji: '🪞' },
  { id: 'gratitude', label: 'Gratitude', emoji: '🌼' },
  { id: 'relationships', label: 'Relationships', emoji: '💌' },
  { id: 'personal-growth', label: 'Personal Growth', emoji: '🌱' },
  { id: 'memories', label: 'Memories', emoji: '📷' },
  { id: 'creativity', label: 'Creativity', emoji: '🎨' },
  { id: 'everyday-life', label: 'Everyday Life', emoji: '☕' },
];

const PROMPTS = {
  'self-reflection': [
    'What emotion has been quietly following you around today?',
    'When did you feel most like yourself this week?',
    "What's something you needed to hear today, that you can tell yourself now?",
    'What is one thing you did today that you were proud of, even a small one?',
    'What thought keeps returning to you lately? What might it be trying to tell you?',
    'If today had a title, what would it be called?',
    'What are you holding onto right now that might be okay to set down?',
    'What does "enough" feel like for you today?',
    'What part of yourself have you been ignoring lately?',
    'What would you say to yourself from a year ago, right now?',
    'What is calm feeling like in your body today, or where is it missing?',
    'What are you curious about, when it comes to your own life right now?',
  ],
  gratitude: [
    'What small thing made today a little softer?',
    'Who is someone you are quietly grateful for, and why?',
    "What's a comfort you don't often say thank you for?",
    'What is something ordinary that you would miss if it were gone?',
    'What made you smile today, even briefly?',
    'What is a part of your daily routine that you actually appreciate?',
    'What is something your body did for you today that deserves thanks?',
    'Who showed you kindness recently, even in a small way?',
    'What is a place that has been good to you?',
    'What is something you own that has quietly mattered more than expected?',
    'What is a sound, smell, or small sensation you were grateful for today?',
    "What's something imperfect in your life that you're still thankful for?",
  ],
  relationships: [
    'Who has been on your mind lately, and what would you want to tell them?',
    'What is a conversation that stayed with you recently?',
    'How did someone make you feel truly seen this week?',
    'What do you wish you could say to someone, but haven’t yet?',
    'What is something you appreciate about a person close to you?',
    'Who do you feel most like yourself around, and why?',
    'What is a small act of care you gave or received recently?',
    'What is something you learned about someone that surprised you?',
    'Is there a relationship that feels like it needs a little more attention right now?',
    'What is a memory with someone you love that still makes you feel warm?',
    'What boundary have you set (or wanted to set) recently, and how did it feel?',
    'Who do you want to reach out to, just to say hello?',
  ],
  'personal-growth': [
    'What is something you understand now that you didn’t a year ago?',
    'What is a habit you’re gently trying to build, and how is it going?',
    'What is a fear you’ve grown a little braver about?',
    'What did a recent mistake teach you, without judgment?',
    'What would "taking care of yourself" look like this week?',
    'What is something you’re proud of that no one else noticed?',
    'What old belief about yourself are you starting to let go of?',
    'What is a challenge you’re facing, and what is one gentle next step?',
    'What does growth feel like for you lately — steady, messy, slow?',
    'What is something you used to find hard that feels easier now?',
    'What would you tell a friend who was struggling with what you’re facing?',
    'What is one thing you want to be true about you, six months from now?',
  ],
  memories: [
    'What is a memory that came back to you unexpectedly recently?',
    'What is a smell or song that instantly takes you somewhere else?',
    'What is a small, ordinary day you still remember clearly, and why?',
    'What is something from your childhood you find yourself thinking about?',
    'Who is someone from your past you still think of fondly?',
    'What is a place you associate with feeling safe or happy?',
    'What is a moment this year you’d want to remember in ten years?',
    'What is a tradition or ritual that means more to you than it seems to?',
    'What is something you used to do that you miss doing?',
    'What is a memory that still makes you laugh when you think about it?',
    'What did an earlier version of you not know yet, that you know now?',
    'What is a photo (real or imagined) that captures how you feel today?',
  ],
  creativity: [
    'If today were a color, what would it be and why?',
    'What is a small idea you’ve been meaning to explore?',
    'If you could describe your mood right now using only weather, what would it be?',
    'What would you make if you had one free hour and no pressure to be good at it?',
    'What is a story you’ve never told anyone?',
    'If your day had a soundtrack, what would be playing right now?',
    'What is something beautiful you noticed today that most people would miss?',
    'Write a tiny scene, real or imagined, using only what you can see around you.',
    'What would your future self write in a letter to you, today?',
    'What is a "what if" that’s been quietly interesting to you?',
    'If this feeling had a shape, what would it look like?',
    'What is something ordinary you could describe as if it were magical?',
  ],
  'everyday-life': [
    'What did today actually feel like, hour by hour?',
    'What is something small that went right today?',
    'What did you eat, see, or do today that you’d want to remember?',
    'What is something you’re looking forward to, even a little?',
    'What was the most peaceful moment of your day?',
    'What is something that annoyed you today, and is it still bothering you?',
    'What did you do today just for yourself?',
    'What is one thing on your mind that hasn’t made it into words yet?',
    'How did your morning set the tone for the rest of the day?',
    'What is something you’re putting off, and how do you feel about it?',
    'What would make tomorrow feel a little easier than today?',
    'What is a small comfort you leaned on today?',
  ],
};

/** All prompts flattened with their category, used when no category is chosen. */
const ALL_PROMPTS = Object.entries(PROMPTS).flatMap(([category, list]) =>
  list.map((text) => ({ category, text }))
);

/**
 * Picks a random prompt, optionally scoped to a category, avoiding an exact
 * repeat of `exclude` when there's another option available.
 */
export const getRandomPrompt = (categoryId, exclude) => {
  const pool = categoryId ? PROMPTS[categoryId].map((text) => ({ category: categoryId, text })) : ALL_PROMPTS;
  const options = pool.length > 1 ? pool.filter((p) => p.text !== exclude) : pool;
  return options[Math.floor(Math.random() * options.length)];
};
