const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who wrote it
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who it's about
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

// Prevent the same person from reviewing the same session twice
reviewSchema.index({ session: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);