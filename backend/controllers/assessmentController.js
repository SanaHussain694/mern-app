// backend/controllers/assessmentController.js
const Assessment = require('../models/Assessment');
const Question   = require('../models/Question');

// ─── POST /api/assessments/generate ─────────────────────
exports.generateAssessment = async (req, res) => {
  try {
    const { domain } = req.body;
    const userId = req.user.id;

    if (!domain) return res.status(400).json({ message: 'Domain required!' });

    // MCQs random 15 pick karo
    const mcqs = await Question.aggregate([
      { $match: { domain, type: 'MCQ' } },
      { $sample: { size: 15 } },
    ]);

    // Subjective random 5 pick karo
    const subjective = await Question.aggregate([
      { $match: { domain, type: 'subjective' } },
      { $sample: { size: 5 } },
    ]);

    const allQuestions = [...mcqs, ...subjective];

    if (allQuestions.length < 5) {
      return res.status(400).json({ message: 'Is domain mein enough questions nahi hain!' });
    }

    // Assessment create karo
    const assessment = await Assessment.create({
      userId,
      domain,
      questions: allQuestions.map(q => q._id),
      answers:   allQuestions.map(q => ({
        questionId:    q._id,
        correctAnswer: q.correctAnswer,
        type:          q.type,
        userAnswer:    '',
        status:        'skipped',
      })),
    });

    // Questions ke saath populate karke bhejo
    const populated = await Assessment.findById(assessment._id)
      .populate('questions');

    res.status(201).json({ success: true, assessment: populated });

  } catch (err) {
    console.error('❌ Generate error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ─── POST /api/assessments/submit ───────────────────────
exports.submitAssessment = async (req, res) => {
  try {
    const { assessmentId, answers, timeTaken } = req.body;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment nahi mili!' });
    }

    let mcqScore = 0;

    // Har answer grade karo
    const gradedAnswers = assessment.answers.map((ans, idx) => {
      const userAnswer = answers[idx] || '';
      let status = 'skipped';
      let isCorrect = false;

      if (!userAnswer) {
        status = 'skipped';
      } else if (ans.type === 'MCQ') {
        isCorrect = userAnswer.trim() === ans.correctAnswer.trim();
        status = isCorrect ? 'correct' : 'wrong';
        if (isCorrect) mcqScore++;
      } else {
        // Subjective — manual review
        status = 'pending';
      }

      return {
        ...ans.toObject(),
        userAnswer,
        isCorrect,
        status,
      };
    });

    // Assessment update karo
    assessment.answers     = gradedAnswers;
    assessment.score       = mcqScore;
    assessment.status      = 'submitted';
    assessment.completedAt = new Date();
    assessment.timeTaken   = timeTaken || 0;
    await assessment.save();

    // Populated result bhejo
    const result = await Assessment.findById(assessmentId)
      .populate('questions', 'question options correctAnswer type');

    res.json({
      success: true,
      score:   mcqScore,
      total:   15,
      percent: Math.round((mcqScore / 15) * 100),
      result,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/assessments/my ─────────────────────────────
exports.getMyAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user.id })
      .select('domain score status completedAt createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, assessments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};