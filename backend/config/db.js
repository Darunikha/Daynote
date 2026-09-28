const mongoose = require('mongoose');

/**
 * Connects to MongoDB. Works with both a local mongod and MongoDB Atlas.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not set. Copy .env.example to .env and fill it in.');
  }

  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  await dropStaleIndexes(conn);
  return conn;
};

/**
 * One-time cleanup for indexes an earlier schema created that the current
 * schema no longer wants. Mongoose only ever adds missing indexes on
 * connect, it never removes ones a previous version left behind, so an old
 * `moods` collection can still be carrying a unique index that now rejects
 * writes the app is supposed to allow (multiple mood check-ins per day).
 */
const dropStaleIndexes = async (conn) => {
  try {
    const moods = conn.connection.db.collection('moods');
    const indexes = await moods.indexes();
    const stale = indexes.find(
      (idx) => idx.unique && JSON.stringify(idx.key) === JSON.stringify({ userId: 1, date: 1 })
    );
    if (stale) {
      await moods.dropIndex(stale.name);
      console.log(`Dropped stale unique index "${stale.name}" on moods (one check-in per day is no longer enforced).`);
    }
  } catch (err) {
    // Collection may not exist yet on a fresh database - nothing to clean up.
    if (err.codeName !== 'NamespaceNotFound') {
      console.warn('Could not check for stale mood indexes:', err.message);
    }
  }
};

module.exports = connectDB;
