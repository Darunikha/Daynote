const mongoose = require('mongoose');
const { MOODS } = require('./Journal');

/**
 * A standalone mood check-in, separate from journal entries. This is what
 * the Mood Tracker page reads and writes — recording how someone feels is
 * not tied to writing a journal entry at all.
 *
 * A user can log more than one of these for the same day (people rarely
 * feel just one thing in a day), so `date` + `createdAt` together order a
 * day's check-ins rather than uniquely identifying one.
 */
const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Normalized to a calendar day (local midnight from a "YYYY-MM-DD" input).
    date: { type: Date, required: true },
    mood: { type: String, enum: MOODS, required: true },
    note: { type: String, trim: true, maxlength: 280, default: '' },
  },
  { timestamps: true }
);

// Not unique: a day can hold several check-ins now. Still indexed together
// since every query (list, stats, "today") filters by user + date range.
moodSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Mood', moodSchema);
