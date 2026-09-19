// backend/controllers/interviewController.js
const Interview         = require('../models/Interview');
const InterviewQuestion = require('../models/InterviewQuestion');
const OpenAI            = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── POST /api/interviews/start ──────────────────────────
exports.startInterview = async (req, res) => {
  try {
    const { domain } = req.body;
    const userId     = req.user.id;

    // 8 domain + 2 behavioral questions randomly pick karo
    const domainQs = await InterviewQuestion.aggregate([
      { $match: { domain } },
      { $sample: { size: 8 } },
    ]);

    const behavioralQs = await InterviewQuestion.aggregate([
      { $match: { domain: 'behavioral' } },
      { $sample: { size: 2 } },
    ]);

    const allQuestions = [...domainQs, ...behavioralQs];

    if (allQuestions.length < 3) {
      return res.status(400).json({ message: 'Enough questions nahi hain!' });
    }

    const interview = await Interview.create({
      userId,
      domain,
      questions: allQuestions.map(q => q._id),
      answers:   allQuestions.map(q => ({
        questionId:   q._id,
        questionText: q.question,
        answer:       '',
        skipped:      false,
      })),
    });

    const populated = await Interview.findById(interview._id)
      .populate('questions');

    res.status(201).json({ success: true, interview: populated });
  } catch (err) {
    console.error('❌ Start error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ─── POST /api/interviews/followup ───────────────────────
exports.getFollowUp = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        success: true,
        followUp: 'OpenAI key nahi hai — manual follow-up add karein.',
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Tum ek experienced technical interviewer ho. Candidate ke jawab ke basis pe 
          ek relevant follow-up question poocho. Sirf ek short question poocho — max 1 sentence. 
          Urdu/English mix (Hinglish) mein reply karo.`,
        },
        {
          role: 'user',
          content: `Interview question: "${question}"\nCandidate ka jawab: "${answer}"\n\nFollow-up question poocho:`,
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const followUp = completion.choices[0].message.content.trim();
    res.json({ success: true, followUp });
  } catch (err) {
    console.error('❌ OpenAI error:', err.message);
    res.json({ success: true, followUp: '' }); // fail silently
  }
};

// ─── POST /api/interviews/submit ─────────────────────────
exports.submitInterview = async (req, res) => {
  try {
    const { interviewId, answers, totalTime, videoUrl } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) return res.status(404).json({ message: 'Interview nahi mili!' });

    interview.answers     = answers;
    interview.status      = 'completed';
    interview.completedAt = new Date();
    interview.totalTime   = totalTime || 0;
    if (videoUrl) interview.videoUrl = videoUrl;

    await interview.save();

    res.json({ success: true, interview });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── POST /api/interviews/upload-video ───────────────────
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Video file required!' });

    const videoUrl = `/uploads/videos/${req.file.filename}`;
    res.json({ success: true, videoUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/interviews/my ──────────────────────────────
exports.getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id })
      .select('domain status completedAt totalTime videoUrl createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, interviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};