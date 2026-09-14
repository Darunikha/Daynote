const mongoose = require('mongoose');
const { MOODS } = require('./Journal');

/**
 * A standalone daily mood check-in, separate from journal entries. This is
 * what the Mood Tracker page reads and writes — recording how someone feels
 * is no longer tied to writing a journal entry at all.
 */
const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Normalized to a calendar day (local midnight from a "YYYY-MM-DD" input) so
    // there is at most one check-in per user per day.
    date: { type: Date, required: true },
    mood: { type: String, enum: MOODS, required: true },
    note: { type: String, trim: true, maxlength: 280, default: '' },
  },
  { timestamps: true }
);

moodSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Mood', moodSchema);
