// backend/controllers/behaviorLogController.js
const BehaviorLog = require('../models/BehaviorLog');

// POST /api/behavior-logs — event save karo
exports.logEvent = async (req, res) => {
  try {
    const { assessmentId, eventType, severity, message } = req.body;

    const log = await BehaviorLog.create({
      userId:       req.user.id,
      assessmentId,
      eventType,
      severity:     severity || 'medium',
      message:      message  || '',
    });

    res.status(201).json({ success: true, log });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/behavior-logs/:assessmentId — recruiter ke liye
exports.getLogsByAssessment = async (req, res) => {
  try {
    const logs = await BehaviorLog.find({
      assessmentId: req.params.assessmentId
    })
      .populate('userId', 'name email')
      .sort({ timestamp: 1 });

    // Summary banao
    const summary = {
      total:           logs.length,
      no_face:         logs.filter(l => l.eventType === 'no_face').length,
      multiple_faces:  logs.filter(l => l.eventType === 'multiple_faces').length,
      tab_switch:      logs.filter(l => l.eventType === 'tab_switch').length,
      suspicionScore:  0,
    };

    // Suspicion score calculate karo
    summary.suspicionScore = Math.min(
      100,
      summary.no_face        * 5 +
      summary.multiple_faces * 15 +
      summary.tab_switch     * 10
    );

    res.json({ success: true, logs, summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/behavior-logs/user/:userId — user ki sari logs
exports.getLogsByUser = async (req, res) => {
  try {
    const logs = await BehaviorLog.find({ userId: req.params.userId })
      .populate('assessmentId', 'domain score')
      .sort({ createdAt: -1 });

    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};