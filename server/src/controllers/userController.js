const User = require('../models/User');

// @desc   Get any user's public profile by ID
// @route  GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Update logged-in user's own profile (skills, name)
// @route  PUT /api/users/me
const updateProfile = async (req, res) => {
  try {
    const { name, skillsToTeach, skillsToLearn } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name !== undefined) user.name = name;
    if (skillsToTeach !== undefined) user.skillsToTeach = skillsToTeach;
    if (skillsToLearn !== undefined) user.skillsToLearn = skillsToLearn;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      skillsToTeach: updatedUser.skillsToTeach,
      skillsToLearn: updatedUser.skillsToLearn,
      credits: updatedUser.credits,
      reputationScore: updatedUser.reputationScore,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Search users by skill (used for browsing before matching)
// @route  GET /api/users/search?skill=React
const searchUsersBySkill = async (req, res) => {
  try {
    const { skill } = req.query;

    if (!skill) {
      return res.status(400).json({ message: 'Skill query parameter is required' });
    }

    // Case-insensitive partial match on skillsToTeach array
    const users = await User.find({
      skillsToTeach: { $regex: skill, $options: 'i' },
    }).select('-password -email');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUserById, updateProfile, searchUsersBySkill };