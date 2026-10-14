const mongoose = require('mongoose');

const CRY_INTENSITY = ['teary', 'full-cry', 'sobbing'];
const CRY_FELT = ['better', 'same', 'worse'];
const CRY_TRIGGERS = ['overwhelmed', 'sad', 'frustrated', 'lonely', 'anxious', 'grief', 'relief', 'happy-tears', 'other'];

/**
 * A single cry logged for a day — a gentle emotional check-in alongside
 * Mood and Sleep, not a clinical record. Like Mood (and unlike Sleep),
 * there's no unique index on userId+date: a day can hold more than one of
 * these, since people genuinely can cry more than once in a day.
 */
const crySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Normalized to a calendar day (local midnight from a "YYYY-MM-DD" input).
    date: { type: Date, required: true },
    intensity: { type: String, enum: CRY_INTENSITY, required: true, default: 'teary' },
    trigger: { type: String, enum: CRY_TRIGGERS, default: 'other' },
    felt: { type: String, enum: CRY_FELT, default: 'same' },
    note: { type: String, trim: true, maxlength: 280, default: '' },
  },
  { timestamps: true }
);

crySchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Cry', crySchema);
module.exports.CRY_INTENSITY = CRY_INTENSITY;
module.exports.CRY_FELT = CRY_FELT;
module.exports.CRY_TRIGGERS = CRY_TRIGGERS;
