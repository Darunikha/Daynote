const mongoose = require('mongoose');

const SLEEP_QUALITY = ['poor', 'fair', 'good', 'great'];

/**
 * A night's sleep log — bedtime and wake time for one calendar day (the
 * morning you woke up), separate from journal entries and mood check-ins.
 * One log per day: logging again for a day you've already logged updates
 * it rather than adding a second entry, since a day has one night's sleep
 * in the common case (unlike mood, which can genuinely vary several times
 * in a day).
 *
 * Times are stored as plain "HH:MM" strings rather than full datetimes —
 * the user only ever picks a time, not a date, for bedtime/wake time (the
 * bedtime is implicitly "last night"), so there's no second calendar date
 * to track. Duration is derived (see durationMinutes below), assuming the
 * wake time is the next day whenever it's not later than the bed time.
 */
const sleepSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Normalized to a calendar day (local midnight from a "YYYY-MM-DD" input) —
    // the morning this sleep log is for.
    date: { type: Date, required: true },
    bedTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    wakeTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    quality: { type: String, enum: SLEEP_QUALITY, default: 'fair' },
    notes: { type: String, trim: true, maxlength: 280, default: '' },
  },
  { timestamps: true }
);

sleepSchema.index({ userId: 1, date: 1 }, { unique: true });

/** Minutes between bedTime and wakeTime, assuming wake is the next morning whenever it isn't later than bedtime. */
sleepSchema.methods.durationMinutes = function durationMinutes() {
  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };
  const bed = toMinutes(this.bedTime);
  const wake = toMinutes(this.wakeTime);
  return wake <= bed ? 1440 - bed + wake : wake - bed;
};

module.exports = mongoose.model('Sleep', sleepSchema);
module.exports.SLEEP_QUALITY = SLEEP_QUALITY;
