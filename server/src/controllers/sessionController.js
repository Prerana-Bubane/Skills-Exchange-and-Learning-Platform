const Session = require('../models/Session');

// @desc   Request a new session with a match
// @route  POST /api/sessions
const createSession = async (req, res) => {
  try {
    const { teacherId, skill, scheduledAt, durationMinutes, notes } = req.body;

    if (!teacherId || !skill || !scheduledAt) {
      return res.status(400).json({ message: 'teacherId, skill, and scheduledAt are required' });
    }

    // Can't book a session with yourself
    if (teacherId === req.user.id) {
      return res.status(400).json({ message: 'You cannot book a session with yourself' });
    }

    const session = await Session.create({
      teacher: teacherId,
      learner: req.user.id,
      skill,
      scheduledAt,
      durationMinutes: durationMinutes || 60,
      notes,
    });

    const populatedSession = await session.populate(['teacher', 'learner']);

    res.status(201).json(populatedSession);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Get all sessions for the logged-in user (as teacher OR learner)
// @route  GET /api/sessions
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ teacher: req.user.id }, { learner: req.user.id }],
    })
      .populate('teacher', 'name email')
      .populate('learner', 'name email')
      .sort({ scheduledAt: 1 }); // soonest first

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc   Update session status (confirm, cancel, complete)
// @route  PATCH /api/sessions/:id/status
const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Only the teacher or learner involved in this session can update it
    const isParticipant =
      session.teacher.toString() === req.user.id || session.learner.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to update this session' });
    }

    session.status = status;
    await session.save();

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createSession, getMySessions, updateSessionStatus };