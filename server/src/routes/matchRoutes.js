const express = require('express');
const router = express.Router();
const { getMyMatches } = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMyMatches);

module.exports = router;