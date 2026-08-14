const Session = require('../models/Session');
const User = require('../models/User');

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

    // Prevent illogical transitions, e.g. completing a session that was never confirmed
    if (status === 'completed' && session.status !== 'confirmed') {
      return res.status(400).json({ message: 'Only confirmed sessions can be marked completed' });
    }

    // Prevent double-processing credits if someone spams the request
    if (status === 'completed' && session.status === 'completed') {
      return res.status(400).json({ message: 'Session already marked completed' });
    }

    // Handle credit transfer only when a session newly becomes completed
    if (status === 'completed') {
      const learner = await User.findById(session.learner);
      const teacher = await User.findById(session.teacher);

      const CREDIT_COST = 5; // flat cost per session — could later scale with durationMinutes

      if (learner.credits < CREDIT_COST) {
        return res.status(400).json({ message: 'Learner does not have enough credits' });
      }

      learner.credits -= CREDIT_COST;
      teacher.credits += CREDIT_COST;

      await learner.save();
      await teacher.save();
    }

    session.status = status;
    await session.save();

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createSession, getMySessions, updateSessionStatus };
