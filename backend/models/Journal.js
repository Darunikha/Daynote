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

// Keep in sync with frontend/src/utils/decorations.js
const DECORATIONS = [
  'none',
  'paper-clip',
  'washi-tape',
  'torn-paper',
  'tiny-flower',
  'pressed-flower',
  'heart',
  'star',
  'butterfly',
  'postage-stamp',
  'tiny-tag',
  'note',
  'pressed-leaf',
  'tiny-bow',
  'doodle',
  'divider',
  'checklist',
  'pin',
  'photo-corner',
];

// How many charms a single entry can wear at once — keep in sync with
// frontend/src/utils/decorations.js MAX_DECORATIONS.
const MAX_DECORATIONS = 6;

// Entry customization options — keep in sync with frontend/src/utils/entryStyle.js
const FONTS = ['clean', 'serif', 'handwritten', 'typewriter'];
const LAYOUTS = ['classic', 'scrapbook', 'photo-focused', 'minimal'];
const PHOTO_STYLES = ['plain', 'polaroid', 'pinned', 'taped', 'framed'];
const HEADING_STYLES = ['classic', 'handwritten', 'boxed', 'underline'];
const DIVIDERS = ['none', 'dashed', 'floral', 'scallop'];

// Sticky notes — keep in sync with frontend/src/utils/stickyNotes.js
const STICKY_NOTE_DESIGNS = [
  'floral',
  'grid',
  'lined',
  'scalloped',
  'cloud',
  'heart',
  'animal',
  'pastel',
  'taped',
];
const STICKY_NOTE_FONTS = ['clean', 'serif', 'handwritten', 'typewriter'];
const STICKY_NOTE_SIZES = ['sm', 'md', 'lg'];
const STICKY_NOTE_ALIGN = ['left', 'center', 'right'];
const MAX_STICKY_NOTES = 10;

const stickyNoteSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    design: { type: String, enum: STICKY_NOTE_DESIGNS, default: 'pastel' },
    color: { type: String, default: '' },
    text: { type: String, default: '', trim: true, maxlength: 400 },
    x: { type: Number, default: 50, min: 0, max: 100 },
    y: { type: Number, default: 20, min: 0, max: 100 },
    rotation: { type: Number, default: 0, min: -45, max: 45 },
    font: { type: String, enum: STICKY_NOTE_FONTS, default: 'handwritten' },
    fontSize: { type: String, enum: STICKY_NOTE_SIZES, default: 'md' },
    align: { type: String, enum: STICKY_NOTE_ALIGN, default: 'left' },
  },
  { _id: false }
);

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
    // Legacy single-charm field, kept only so entries saved before multi-charm
    // support still read back correctly (see withDecorations in the controller).
    decoration: { type: String, enum: DECORATIONS, default: 'none' },
    decorations: {
      type: [{ type: String, enum: DECORATIONS }],
      default: [],
      set: (values) =>
        [...new Set((Array.isArray(values) ? values : []).filter((v) => v && v !== 'none'))].slice(
          0,
          MAX_DECORATIONS
        ),
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) =>
        (Array.isArray(tags) ? tags : [])
          .map((t) => String(t).trim().toLowerCase())
          .filter(Boolean)
          .slice(0, 12),
    },
    // Entry customization — whole-entry style choices, all optional/subtle.
    font: { type: String, enum: FONTS, default: 'clean' },
    layout: { type: String, enum: LAYOUTS, default: 'classic' },
    photoStyle: { type: String, enum: PHOTO_STYLES, default: 'plain' },
    headingStyle: { type: String, enum: HEADING_STYLES, default: 'classic' },
    divider: { type: String, enum: DIVIDERS, default: 'none' },
    stickyNotes: {
      type: [stickyNoteSchema],
      default: [],
      set: (notes) => (Array.isArray(notes) ? notes : []).slice(0, MAX_STICKY_NOTES),
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
module.exports.DECORATIONS = DECORATIONS;
module.exports.MAX_DECORATIONS = MAX_DECORATIONS;
module.exports.FONTS = FONTS;
module.exports.LAYOUTS = LAYOUTS;
module.exports.PHOTO_STYLES = PHOTO_STYLES;
module.exports.HEADING_STYLES = HEADING_STYLES;
module.exports.DIVIDERS = DIVIDERS;
module.exports.STICKY_NOTE_DESIGNS = STICKY_NOTE_DESIGNS;
module.exports.STICKY_NOTE_FONTS = STICKY_NOTE_FONTS;
module.exports.STICKY_NOTE_SIZES = STICKY_NOTE_SIZES;
module.exports.STICKY_NOTE_ALIGN = STICKY_NOTE_ALIGN;
module.exports.MAX_STICKY_NOTES = MAX_STICKY_NOTES;

