const express = require('express');
const router = express.Router();
const { getUserById, updateProfile, searchUsersBySkill } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Order matters here — specific routes before dynamic :id routes
router.get('/search', protect, searchUsersBySkill);
router.put('/me', protect, updateProfile);
router.get('/:id', protect, getUserById);

module.exports = router;