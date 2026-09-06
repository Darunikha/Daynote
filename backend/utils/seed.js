/**
 * DEVELOPMENT / DEMO DATA ONLY.
 *
 * Creates one demo account and a month of sample journal entries so the
 * dashboard, calendar and mood tracker have something to show while you build.
 * Do not run this against a production database.
 *
 *   npm run seed
 *
 * Demo login:  demo@daynote.app  /  daynote123
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Journal = require('../models/Journal');

const DEMO_EMAIL = 'demo@daynote.app';
const DEMO_PASSWORD = 'daynote123';

// Dates are expressed as "days ago" so the sample month always looks current.
const SAMPLE_ENTRIES = [
  {
    daysAgo: 0,
    title: 'A Slow & Lovely Day',
    mood: 'calm',
    tags: ['gratitude', 'self care'],
    isFavorite: true,
    content:
      "Today felt really peaceful. I spent the morning with my playlist on low, had a good lunch, and just breathed for a while.\n\nI also got some work done, which felt good — not because I had to, but because I wanted to.\n\nIt's funny how a simple day can feel so full when you're not constantly rushing. Little moments like these are the ones I want to remember.\n\nGrateful for today.",
  },
  {
    daysAgo: 2,
    title: 'Books & Cozy Corners',
    mood: 'happy',
    tags: ['books', 'weekend'],
    isFavorite: true,
    content:
      "Finished another chapter today. I love how books can make a rainy afternoon feel like the best plan I've ever made.\n\nMade tea twice and forgot about both cups. Classic.\n\nI think I'm slowly building the kind of quiet life I used to daydream about.",
  },
  {
    daysAgo: 4,
    title: 'Overthinking Again...',
    mood: 'anxious',
    tags: ['thoughts', 'honesty'],
    content:
      "My mind was everywhere today. I kept replaying a conversation from last week that nobody else is probably thinking about.\n\nTrying to be kinder to myself about it. Thoughts are not facts, and a bad hour isn't a bad life.\n\nTomorrow I'll go for a walk before I open my laptop.",
  },
  {
    daysAgo: 6,
    title: 'Little Wins',
    mood: 'excited',
    tags: ['study', 'progress'],
    content:
      "Did something I'd been putting off for weeks — I finally sent the email. Two minutes of courage for three weeks of dread, which is a terrible exchange rate.\n\nSo proud of small me for doing it anyway.\n\nAlso finished my study block without checking my phone once. Progress counts even when it's tiny.",
  },
  {
    daysAgo: 8,
    title: 'Rainy Thoughts',
    mood: 'neutral',
    tags: ['weather', 'quiet'],
    content:
      "It rained all afternoon and I didn't mind at all. There's something about grey light through the window that makes the room feel softer.\n\nIt's amazing how a little rain can change your mood — sometimes for the better.",
  },
  {
    daysAgo: 11,
    title: 'Things I Want to Remember',
    mood: 'loved',
    tags: ['friends', 'gratitude'],
    isFavorite: true,
    content:
      "The way my friend laughed so hard she had to put her cup down.\n\nWalking home when the sky was that impossible orange.\n\nMy mother calling for no reason at all, just to ask if I'd eaten.\n\nI want to keep these somewhere safe, so here they are.",
  },
  {
    daysAgo: 14,
    title: 'A Long, Tiring Week',
    mood: 'tired',
    tags: ['work', 'rest'],
    content:
      "Everything took twice as long as it should have. I'm not upset about it, just very ready for a weekend.\n\nGoing to sleep early tonight and letting tomorrow be tomorrow's problem.",
  },
  {
    daysAgo: 17,
    title: 'Missing Home',
    mood: 'sad',
    tags: ['family', 'honesty'],
    content:
      "Cooked something my mum used to make and got it almost right. Almost was enough to make me quiet for a while.\n\nI think missing people is just love with nowhere to go today.",
  },
  {
    daysAgo: 20,
    title: 'Small Steps, Big Dreams',
    mood: 'happy',
    tags: ['goals', 'study'],
    content:
      "Made a list of what I actually want this year, not what I think I should want. It was shorter than I expected and that felt honest.\n\nOne step at a time. That's the whole plan.",
  },
  {
    daysAgo: 23,
    title: 'Not My Best Day',
    mood: 'angry',
    tags: ['honesty'],
    content:
      "Snapped at someone who didn't deserve it and spent the rest of the day feeling small about it. Apologised properly in the evening.\n\nWriting it down so I remember that fixing it is always an option.",
  },
  {
    daysAgo: 26,
    title: 'Morning Walk',
    mood: 'calm',
    tags: ['self care', 'walk'],
    content:
      "Left the house before the street woke up. Cold air, empty pavement, the bakery light already on.\n\nI should do this more often. I always say that.",
  },
  {
    daysAgo: 29,
    title: 'Starting Over, Gently',
    mood: 'neutral',
    tags: ['new start'],
    content:
      "New month, same me, slightly better rested. Not making resolutions this time, just paying attention.\n\nSame girl, new chapter.",
  },
];

const run = async () => {
  await connectDB();

  let user = await User.findOne({ email: DEMO_EMAIL });
  if (!user) {
    user = await User.create({
      name: 'Darunikha',
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      bio: 'Just a girl with a lot of thoughts.',
    });
    console.log(`Created demo user ${DEMO_EMAIL} (password: ${DEMO_PASSWORD})`);
  } else {
    console.log(`Demo user already exists: ${DEMO_EMAIL}`);
  }

  const removed = await Journal.deleteMany({ userId: user._id });
  if (removed.deletedCount) console.log(`Cleared ${removed.deletedCount} old sample entries`);

  const startOfDay = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(20, 30, 0, 0);
    return d;
  };

  const docs = SAMPLE_ENTRIES.map(({ daysAgo, ...entry }) => ({
    ...entry,
    userId: user._id,
    date: startOfDay(daysAgo),
  }));

  await Journal.insertMany(docs);
  console.log(`Inserted ${docs.length} sample journal entries.`);
  console.log('\nSample data ready. Sign in with:');
  console.log(`  email:    ${DEMO_EMAIL}`);
  console.log(`  password: ${DEMO_PASSWORD}\n`);

  await mongoose.connection.close();
  process.exit(0);
};

// Only seed when this file is executed directly (`npm run seed`), so the
// sample data can also be imported by other tooling without connecting.
if (require.main === module) {
  run().catch(async (err) => {
    console.error('Seeding failed:', err.message);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  });
}

module.exports = { SAMPLE_ENTRIES, DEMO_EMAIL, DEMO_PASSWORD };
