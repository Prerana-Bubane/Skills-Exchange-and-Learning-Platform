const Review = require('../models/Review');
const User = require('../models/User');

/**
 * Recalculate and save a user's reputation score based on all reviews they've received.
 * Simple version: weighted average that gives slightly more weight to recent reviews.
 */
const recalculateReputation = async (userId) => {
  const reviews = await Review.find({ reviewee: userId }).sort({ createdAt: -1 });

  if (reviews.length === 0) {
    return 0;
  }

  // Weight recent reviews slightly more — most recent review gets full weight,
  // weight decreases slightly for older ones, floor at 0.5 so old reviews still count somewhat
  let weightedSum = 0;
  let totalWeight = 0;

  reviews.forEach((review, index) => {
    const weight = Math.max(1 - index * 0.05, 0.5);
    weightedSum += review.rating * weight;
    totalWeight += weight;
  });

  const score = weightedSum / totalWeight;
  const roundedScore = Math.round(score * 10) / 10; // round to 1 decimal place

  await User.findByIdAndUpdate(userId, { reputationScore: roundedScore });

  return roundedScore;
};

module.exports = { recalculateReputation };