const Review = require('../models/Review');
const Session = require('../models/Session');
const { recalculateReputation } = require('../services/reputationEngine');

// @desc   Leave a review for a completed session
// @route  POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { sessionId, rating, comment } = req.body;

    if (!sessionId || !rating) {
      return res.status(400).json({ message: 'sessionId and rating are required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed sessions' });
    }

    const isParticipant =
      session.teacher.toString() === req.user.id || session.learner.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to review this session' });
    }

    // The reviewee is whichever participant is NOT the person submitting the review
    const revieweeId =
      session.teacher.toString() === req.user.id ? session.learner : session.teacher;

    const review = await Review.create({
      session: sessionId,
      reviewer: req.user.id,
      reviewee: revieweeId,
      rating,
      comment,
    });

    // Recalculate the reviewee's reputation score immediately
    await recalculateReputation(revieweeId);

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error — triggered by our unique index
      return res.status(400).json({ message: 'You already reviewed this session' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Get all reviews for a specific user
// @route  GET /api/reviews/user/:userId
const getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createReview, getReviewsForUser };