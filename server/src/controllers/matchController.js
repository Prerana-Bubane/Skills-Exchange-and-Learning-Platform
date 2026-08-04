const { getMatchesForUser } = require('../services/matchingEngine');

// @desc   Get all matches (direct + chain) for the logged-in user
// @route  GET /api/matches
const getMyMatches = async (req, res) => {
  try {
    const matches = await getMatchesForUser(req.user.id);
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMyMatches };