const express = require('express');
const router = express.Router();
const { createSession, getMySessions, updateSessionStatus } = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createSession);
router.get('/', protect, getMySessions);
router.patch('/:id/status', protect, updateSessionStatus);

module.exports = router;