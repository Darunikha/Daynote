const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Keep in sync with frontend/src/utils/paperStyles.js
const PAPER_STYLES = [
  'plain',
  'pink-gingham',
  'lavender-gingham',
  'soft-pink-check',
  'blue-gingham',
  'brown-check',
  'sage-green-check',
  'cream-beige-check',
  'vintage-beige-paper',
  'old-book-paper',
  'vintage-handwritten-paper',
  'kraft-paper',
  'aged-notebook-paper',
  'soft-parchment',
  'cream-grid',
  'beige-grid',
  'fine-graph-paper',
  'dot-grid',
  'ruled-notebook',
  'handwritten-notebook',
  'tiny-pink-floral',
  'vintage-floral',
  'dainty-flowers',
  'botanical-leaves',
  'pressed-flowers',
  'wildflower-paper',
  'soft-green-botanical',
  'blush-stripes',
  'cream-stripes',
  'soft-lavender-stripes',
  'tiny-dots',
  'subtle-hearts',
  'little-stars',
  'soft-clouds',
  'scattered-doodles',
  'linen',
  'warm-cream',
  'soft-beige',
  'cocoa-paper',
  'muted-brown',
  'minimal-paper',
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
    paperStyle: { type: String, enum: PAPER_STYLES, default: 'plain' },
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
    isLocked: { type: Boolean, default: false },
    lockPassword: { type: String, select: false },
    imageUrl: { type: String, default: '' },
    isTimeCapsule: { type: Boolean, default: false },
    unlockDate: { type: Date },
    audioUrl: { type: String, default: '' },
    audioTranscript: { type: String, default: '' },
  },
  { timestamps: true }
);

journalSchema.methods.matchLockPassword = async function matchLockPassword(entered) {
  if (!this.lockPassword) return false;
  return bcrypt.compare(entered, this.lockPassword);
};

journalSchema.methods.setLockPassword = async function setLockPassword(password) {
  const salt = await bcrypt.genSalt(10);
  this.lockPassword = await bcrypt.hash(password, salt);
  this.isLocked = true;
};

// Text search across title + content, scoped per-user at query time.
journalSchema.index({ title: 'text', content: 'text', tags: 'text' });
journalSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Journal', journalSchema);
module.exports.MOODS = MOODS;
module.exports.PAPER_STYLES = PAPER_STYLES;

