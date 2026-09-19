// src/pages/InterviewSession.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import InterviewTimer   from '../components/InterviewTimer';
import useVideoRecorder from '../hooks/useVideoRecorder';

export default function InterviewSession() {
  const { state }    = useLocation();
  const navigate     = useNavigate();
  const { token }    = useAuth();
  const interview    = state?.interview;
  const questions    = interview?.questions || [];

  const [current, setCurrent]       = useState(0);
  const [answers, setAnswers]       = useState(
    questions.map(q => ({ questionId: q._id, questionText: q.question, answer: '', skipped: false }))
  );
  const [followUp, setFollowUp]     = useState('');
  const [loadingFU, setLoadingFU]   = useState(false);
  const [timerKey, setTimerKey]     = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showDone, setShowDone]     = useState(false);

  const startTimeRef = useRef(Date.now());

  const {
    isRecording, videoBlob, error: recError,
    startRecording, stopRecording, uploadVideo,
  } = useVideoRecorder();

  // Start recording on mount
  useEffect(() => {
    startRecording();
    return () => stopRecording();
  }, []);

  // Current question answer update
  const updateAnswer = (val) => {
    const updated = [...answers];
    updated[current].answer = val;
    setAnswers(updated);
  };

  // AI Follow-up generate karo
  const generateFollowUp = useCallback(async () => {
    const q = questions[current];
    const a = answers[current].answer;
    if (!a.trim() || a.length < 20) return;

    setLoadingFU(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/interviews/followup',
        { question: q.question, answer: a },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFollowUp(res.data.followUp || '');
    } catch { setFollowUp(''); }
    finally { setLoadingFU(false); }
  }, [questions, answers, current, token]);

  // Next question
  const handleNext = () => {
    setFollowUp('');
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
      setTimerKey(k => k + 1);
    } else {
      setShowDone(true);
    }
  };

  // Skip question
  const handleSkip = () => {
    const updated = [...answers];
    updated[current].skipped = true;
    setAnswers(updated);
    handleNext();
  };

  // Submit interview
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      stopRecording();

      // Video upload karo
      let videoUrl = '';
      if (videoBlob) {
        videoUrl = await uploadVideo(videoBlob, token) || '';
      }

      const totalTime = Math.floor((Date.now() - startTimeRef.current) / 1000);

      const res = await axios.post(
        'http://localhost:5000/api/interviews/submit',
        { interviewId: interview._id, answers, totalTime, videoUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate('/interview/result', { state: { interview: res.data.interview } });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!interview) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      Interview nahi mili! <a href="/interview">Wapis jao</a>
    </div>
  );

  const q          = questions[current];
  const answered   = answers.filter(a => a.answer.trim()).length;
  const skipped    = answers.filter(a => a.skipped).length;

  return (
    <div style={s.page}>

      {/* Top Bar */}
      <div style={s.topBar}>
        <div>
          <span style={s.qCounter}>Q {current + 1} / {questions.length}</span>
          <span style={{ ...s.badge,
            background: q?.type === 'technical' ? '#EFF6FF' : '#FEF3C7',
            color: q?.type === 'technical' ? '#185FA5' : '#D97706' }}>
            {q?.type}
          </span>
        </div>

        {/* Timer */}
        <InterviewTimer
          key={timerKey}
          duration={q?.timeLimit || 120}
          isRunning={!showDone}
          onTimeUp={handleNext}
        />

        {/* Recording indicator */}
        <div style={s.recIndicator}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%',
            background: isRecording ? '#EF4444' : '#6b7280',
            animation: isRecording ? 'pulse 1.5s infinite' : 'none' }} />
          <span style={{ fontSize: '12px', color: isRecording ? '#EF4444' : '#6b7280' }}>
            {isRecording ? 'REC' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={s.progressBar}>
        <div style={{ ...s.fill, width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Main Card */}
      <div style={s.card}>

        {/* Question */}
        <div style={s.questionBox}>
          <p style={s.qLabel}>Question {current + 1}</p>
          <h3 style={s.question}>{q?.question}</h3>

          {/* Follow-up questions (from model) */}
          {q?.followUpQuestions?.length > 0 && (
            <div style={s.hintBox}>
              <p style={s.hintTitle}>💡 Cover karne ki koshish karein:</p>
              {q.followUpQuestions.map((fq, i) => (
                <p key={i} style={s.hint}>• {fq}</p>
              ))}
            </div>
          )}
        </div>

        {/* Answer */}
        <div style={s.answerBox}>
          <label style={s.answerLabel}>Aapka Jawab:</label>
          <textarea
            style={s.textarea}
            placeholder="Yahan apna detailed jawab likhein..."
            value={answers[current]?.answer}
            onChange={e => updateAnswer(e.target.value)}
            rows={6}
          />
          <p style={s.charCount}>
            {answers[current]?.answer.length} characters
          </p>
        </div>

        {/* AI Follow-up */}
        {answers[current]?.answer.length > 20 && !followUp && (
          <button style={s.fuBtn} onClick={generateFollowUp} disabled={loadingFU}>
            {loadingFU ? '🤖 Generating...' : '🤖 AI Follow-up Generate Karo'}
          </button>
        )}

        {followUp && (
          <div style={s.fuBox}>
            <p style={s.fuLabel}>🤖 AI ka Follow-up Question:</p>
            <p style={s.fuText}>{followUp}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={s.nav}>
        <button style={s.skipBtn} onClick={handleSkip}>
          ⏭ Skip
        </button>

        {current < questions.length - 1 ? (
          <button style={s.nextBtn} onClick={handleNext}>
            Next →
          </button>
        ) : (
          <button style={s.finishBtn} onClick={() => setShowDone(true)}>
            Finish ✓
          </button>
        )}
      </div>

      {/* Question Navigator */}
      <div style={s.navigator}>
        {questions.map((_, i) => (
          <div key={i} onClick={() => { setCurrent(i); setTimerKey(k => k + 1); setFollowUp(''); }}
            style={{
              ...s.dot,
              background: answers[i]?.skipped ? '#FEF3C7' :
                          answers[i]?.answer   ? '#185FA5' :
                          i === current        ? '#e5e7eb' : '#f3f4f6',
              color: answers[i]?.answer && !answers[i]?.skipped ? '#fff' : '#374151',
              border: i === current ? '2px solid #185FA5' : '1px solid #e5e7eb',
            }}>
            {answers[i]?.skipped ? '⏭' : i + 1}
          </div>
        ))}
      </div>

      {/* Confirm Submit Dialog */}
      {showDone && (
        <div style={s.overlay}>
          <div style={s.dialog}>
            <h3 style={{ margin: '0 0 8px', fontSize: '20px' }}>Interview Submit karein?</h3>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center',
              margin: '12px 0 20px', fontSize: '14px', color: '#6b7280' }}>
              <span>✅ Answered: {answered}</span>
              <span>⏭ Skipped: {skipped}</span>
            </div>
            {isRecording && (
              <p style={{ fontSize: '13px', color: '#D97706', marginBottom: '16px' }}>
                🎥 Video upload hoga submit pe...
              </p>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={s.cancelBtn} onClick={() => setShowDone(false)}>
                Cancel
              </button>
              <button style={s.confirmBtn} onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Interview'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

const s = {
  page:        { minHeight: '100vh', background: '#f5f7fa', padding: '1rem' },
  topBar:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                 background: '#fff', borderRadius: '10px', padding: '12px 16px',
                 marginBottom: '8px', border: '1px solid #e5e7eb' },
  qCounter:    { fontSize: '14px', fontWeight: '600', color: '#374151', marginRight: '10px' },
  badge:       { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  recIndicator:{ display: 'flex', alignItems: 'center', gap: '6px' },
  progressBar: { height: '4px', background: '#e5e7eb', borderRadius: '4px', marginBottom: '16px' },
  fill:        { height: '100%', background: '#185FA5', borderRadius: '4px', transition: 'width 0.4s' },
  card:        { background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
                 padding: '1.5rem', marginBottom: '12px',
                 boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  questionBox: { marginBottom: '20px' },
  qLabel:      { fontSize: '12px', color: '#9ca3af', margin: '0 0 8px', fontWeight: '500' },
  question:    { fontSize: '18px', fontWeight: '600', color: '#111827',
                 lineHeight: 1.5, margin: '0 0 16px' },
  hintBox:     { background: '#F0FDF4', border: '1px solid #BBF7D0',
                 borderRadius: '8px', padding: '12px' },
  hintTitle:   { margin: '0 0 6px', fontSize: '13px', fontWeight: '500', color: '#16A34A' },
  hint:        { margin: '4px 0 0', fontSize: '13px', color: '#374151' },
  answerBox:   { display: 'flex', flexDirection: 'column', gap: '6px' },
  answerLabel: { fontSize: '13px', fontWeight: '500', color: '#374151' },
  textarea:    { width: '100%', padding: '12px', border: '1.5px solid #d1d5db',
                 borderRadius: '10px', fontSize: '15px', boxSizing: 'border-box',
                 outline: 'none', resize: 'vertical', lineHeight: 1.6,
                 fontFamily: 'inherit' },
  charCount:   { fontSize: '11px', color: '#9ca3af', margin: 0, textAlign: 'right' },
  fuBtn:       { background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE',
                 padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                 fontSize: '13px', marginTop: '12px', width: '100%' },
  fuBox:       { background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '10px',
                 padding: '14px', marginTop: '12px' },
  fuLabel:     { margin: '0 0 8px', fontSize: '13px', fontWeight: '600', color: '#7C3AED' },
  fuText:      { margin: 0, fontSize: '15px', color: '#374151', fontWeight: '500',
                 lineHeight: 1.5 },
  nav:         { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '12px' },
  skipBtn:     { padding: '10px 24px', border: '1px solid #d1d5db', borderRadius: '8px',
                 background: '#fff', cursor: 'pointer', fontSize: '14px', color: '#6b7280' },
  nextBtn:     { padding: '10px 28px', background: '#185FA5', color: '#fff',
                 border: 'none', borderRadius: '8px', cursor: 'pointer',
                 fontSize: '14px', fontWeight: '500' },
  finishBtn:   { padding: '10px 28px', background: '#16A34A', color: '#fff',
                 border: 'none', borderRadius: '8px', cursor: 'pointer',
                 fontSize: '14px', fontWeight: '500' },
  navigator:   { display: 'flex', flexWrap: 'wrap', gap: '8px', background: '#fff',
                 borderRadius: '10px', padding: '12px', border: '1px solid #e5e7eb' },
  dot:         { width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer',
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 fontSize: '12px', fontWeight: '500', transition: 'all 0.15s' },
  overlay:     { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  dialog:      { background: '#fff', borderRadius: '16px', padding: '2rem',
                 maxWidth: '380px', width: '90%', textAlign: 'center' },
  cancelBtn:   { flex: 1, padding: '10px', border: '1px solid #e5e7eb',
                 borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '14px' },
  confirmBtn:  { flex: 1, padding: '10px', background: '#185FA5', color: '#fff',
                 border: 'none', borderRadius: '8px', cursor: 'pointer',
                 fontSize: '14px', fontWeight: '500' },
};