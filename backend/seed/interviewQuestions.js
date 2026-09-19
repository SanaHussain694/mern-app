// ================= LOAD ENV FIRST =================
require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
});

// ================= IMPORTS =================
const mongoose = require('mongoose');
const InterviewQuestion = require('../models/InterviewQuestion');

// ================= DEBUG (optional) =================
console.log('MONGO_URI:', process.env.MONGO_URI);

// ================= QUESTIONS DATA =================
const questions = [

  // ===== WEB DEV (Technical) =====
  {
    domain: 'web-dev',
    type: 'technical',
    difficulty: 'easy',
    question: 'React mein useState aur useEffect ka kya kaam hai? Ek example ke saath explain karein.',
    followUpQuestions: [
      'useEffect mein cleanup function kab use karte hain?',
      'useState aur useReducer mein kya farq hai?',
    ],
    timeLimit: 150,
  },
  {
    domain: 'web-dev',
    type: 'technical',
    difficulty: 'medium',
    question: 'REST API design karein jo ek blog application ke liye ho — endpoints, methods, aur response format batayein.',
    followUpQuestions: [
      'Authentication kaise handle karenge?',
      'Rate limiting kyun zaroori hai?',
    ],
    timeLimit: 180,
  },
  {
    domain: 'web-dev',
    type: 'technical',
    difficulty: 'hard',
    question: 'Database indexing kya hai aur MongoDB mein performance optimize karne ke liye kaise use karenge?',
    followUpQuestions: [
      'Compound index kab use karenge?',
      'Index ka koi disadvantage bhi hai?',
    ],
    timeLimit: 180,
  },

  // ===== WEB DEV (Behavioral) =====
  {
    domain: 'web-dev',
    type: 'behavioral',
    difficulty: 'medium',
    question: 'Koi aise project ka zikr karein jisme aapko mushkil bug fix karna pada. Kya approach use ki?',
    followUpQuestions: [
      'Team member se madad maangi?',
      'Aage se aisa situation avoid kaise karenge?',
    ],
    timeLimit: 150,
  },

  // ===== DATA SCIENCE =====
  {
    domain: 'data-science',
    type: 'technical',
    difficulty: 'easy',
    question: 'Machine Learning pipeline explain karein — data collection se model deployment tak.',
    followUpQuestions: [
      'Feature engineering kya hai?',
      'Model drift kaise detect karenge?',
    ],
    timeLimit: 180,
  },
  {
    domain: 'data-science',
    type: 'technical',
    difficulty: 'medium',
    question: 'Overfitting aur underfitting kya hai? Kaise fix karte hain?',
    followUpQuestions: [
      'Cross-validation kaise kaam karta hai?',
      'Regularization kya hai?',
    ],
    timeLimit: 150,
  },

  // ===== MOBILE =====
  {
    domain: 'mobile',
    type: 'technical',
    difficulty: 'easy',
    question: 'React Native mein navigation kaise implement karte hain?',
    followUpQuestions: [
      'Stack vs Tab Navigator?',
      'Deep linking kya hai?',
    ],
    timeLimit: 150,
  },

  // ===== GENERAL BEHAVIORAL =====
  {
    domain: 'behavioral',
    type: 'behavioral',
    difficulty: 'easy',
    question: 'Apne aap ko 3 sentences mein introduce karein.',
    followUpQuestions: [
      '5 saal baad khud ko kahan dekhte hain?',
    ],
    timeLimit: 120,
  },
];

// ================= SEED FUNCTION =================
const seed = async () => {
  try {
    // Connect DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear old data
    await InterviewQuestion.deleteMany({});
    console.log('🧹 Old questions removed');

    // Insert new data
    await InterviewQuestion.insertMany(questions);
    console.log(`✅ ${questions.length} questions inserted`);

    // Count per domain
    const counts = {};
    questions.forEach(q => {
      counts[q.domain] = (counts[q.domain] || 0) + 1;
    });

    console.log('📊 Questions per domain:', counts);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

// ================= RUN =================
seed();