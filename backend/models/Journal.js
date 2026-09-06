const mongoose = require('mongoose');

const MOODS = [
  'happy',
  'calm',
  'loved',
  'excited',
  'neutral',
  'sad',
  'angry',
  'anxious',
  'tired',
];

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, trim: true, maxlength: 140, default: 'Untitled entry' },
    content: {
      type: String,
      required: [true, 'Write something before saving'],
      trim: true,
    },
    mood: { type: String, enum: MOODS, default: 'neutral' },
    tags: {
      type: [String],
      default: [],
      set: (tags) =>
        (Array.isArray(tags) ? tags : [])
          .map((t) => String(t).trim().toLowerCase())
          .filter(Boolean)
          .slice(0, 12),
    },
    date: { type: Date, default: Date.now, index: true },
    isFavorite: { type: Boolean, default: false },
    isDraft: { type: Boolean, default: false },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

// Text search across title + content, scoped per-user at query time.
journalSchema.index({ title: 'text', content: 'text', tags: 'text' });
journalSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Journal', journalSchema);
module.exports.MOODS = MOODS;
