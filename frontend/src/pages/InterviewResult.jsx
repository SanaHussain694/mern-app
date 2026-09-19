// src/pages/InterviewResult.jsx
import { useLocation, useNavigate } from 'react-router-dom';

export default function InterviewResult() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const interview  = state?.interview;

  if (!interview) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      Result nahi mila! <a href="/interview">Wapis jao</a>
    </div>
  );

  const answered = interview.answers.filter(a => a.answer.trim()).length;
  const skipped  = interview.answers.filter(a => a.skipped).length;
  const total    = interview.answers.length;
  const mins     = Math.floor((interview.totalTime || 0) / 60);
  const secs     = (interview.totalTime || 0) % 60;

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Header */}
        <div style={s.header}>
          <span style={s.emoji}>🎉</span>
          <h2 style={s.title}>Interview Complete!</h2>
          <p style={s.sub}>Domain: <strong>{interview.domain}</strong></p>
        </div>

        {/* Stats */}
        <div style={s.stats}>
          {[
            { label: 'Answered',   value: answered, color: '#16A34A', icon: '✅' },
            { label: 'Skipped',    value: skipped,  color: '#D97706', icon: '⏭' },
            { label: 'Total Qs',   value: total,    color: '#185FA5', icon: '📋' },
            { label: 'Time Taken', value: `${mins}m ${secs}s`, color: '#374151', icon: '⏱' },
          ].map(stat => (
            <div key={stat.label} style={s.statCard}>
              <span style={s.statIcon}>{stat.icon}</span>
              <span style={{ ...s.statVal, color: stat.color }}>{stat.value}</span>
              <span style={s.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Video recording info */}
        {interview.videoUrl && (
          <div style={s.videoBox}>
            <p style={s.videoText}>
              🎥 Video recorded aur save ho gaya!
            </p>
            <video controls style={s.video}
              src={`http://localhost:5000${interview.videoUrl}`} />
          </div>
        )}

        {/* Answers Review */}
        <h3 style={s.reviewTitle}>Answers Review</h3>
        <div style={s.answers}>
          {interview.answers.map((ans, i) => (
            <div key={i} style={s.ansCard}>
              <div style={s.ansHeader}>
                <span style={s.ansNum}>Q{i + 1}</span>
                {ans.skipped && <span style={s.skippedBadge}>Skipped</span>}
                {ans.aiFollowUp && <span style={s.aiBadge}>🤖 AI Follow-up</span>}
              </div>
              <p style={s.ansQ}>{ans.questionText}</p>
              {ans.answer && (
                <p style={s.ansA}><strong>Jawab:</strong> {ans.answer}</p>
              )}
              {ans.aiFollowUp && (
                <p style={s.ansFollow}>
                  <strong>🤖 AI Question:</strong> {ans.aiFollowUp}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button style={s.retryBtn} onClick={() => navigate('/interview')}>
            🔄 Try Again
          </button>
          <button style={s.dashBtn} onClick={() => navigate('/dashboard')}>
            🏠 Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

const s = {
  page:        { minHeight: '100vh', background: '#f5f7fa', padding: '2rem 1rem' },
  card:        { background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                 padding: '2rem', maxWidth: '700px', margin: '0 auto',
                 boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
  header:      { textAlign: 'center', marginBottom: '24px' },
  emoji:       { fontSize: '52px' },
  title:       { margin: '12px 0 4px', fontSize: '26px', fontWeight: '700', color: '#111827' },
  sub:         { margin: 0, fontSize: '14px', color: '#6b7280' },
  stats:       { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
                 gap: '10px', marginBottom: '24px' },
  statCard:    { background: '#f9fafb', borderRadius: '10px', padding: '14px',
                 textAlign: 'center', border: '1px solid #e5e7eb',
                 display: 'flex', flexDirection: 'column', gap: '4px' },
  statIcon:    { fontSize: '20px' },
  statVal:     { fontSize: '22px', fontWeight: '700' },
  statLabel:   { fontSize: '11px', color: '#6b7280' },
  videoBox:    { background: '#F0FDF4', border: '1px solid #BBF7D0',
                 borderRadius: '10px', padding: '14px', marginBottom: '20px',
                 textAlign: 'center' },
  videoText:   { margin: '0 0 10px', fontSize: '14px', color: '#16A34A', fontWeight: '500' },
  video:       { width: '100%', maxWidth: '400px', borderRadius: '8px' },
  reviewTitle: { fontSize: '18px', fontWeight: '600', color: '#111827',
                 borderBottom: '1px solid #e5e7eb', paddingBottom: '10px', marginBottom: '16px' },
  answers:     { display: 'flex', flexDirection: 'column', gap: '10px' },
  ansCard:     { background: '#f9fafb', borderRadius: '10px', padding: '14px',
                 border: '1px solid #e5e7eb' },
  ansHeader:   { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  ansNum:      { fontSize: '12px', fontWeight: '600', color: '#6b7280' },
  skippedBadge:{ background: '#FEF3C7', color: '#D97706', borderRadius: '20px',
                 padding: '2px 8px', fontSize: '11px' },
  aiBadge:     { background: '#F5F3FF', color: '#7C3AED', borderRadius: '20px',
                 padding: '2px 8px', fontSize: '11px' },
  ansQ:        { margin: '0 0 8px', fontSize: '14px', fontWeight: '500', color: '#111827' },
  ansA:        { margin: '0 0 6px', fontSize: '13px', color: '#374151', lineHeight: 1.5 },
  ansFollow:   { margin: 0, fontSize: '13px', color: '#7C3AED',
                 background: '#F5F3FF', borderRadius: '6px', padding: '8px' },
  retryBtn:    { flex: 1, padding: '11px', border: '1px solid #185FA5',
                 color: '#185FA5', background: '#fff', borderRadius: '8px',
                 cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  dashBtn:     { flex: 1, padding: '11px', background: '#185FA5', color: '#fff',
                 border: 'none', borderRadius: '8px', cursor: 'pointer',
                 fontSize: '14px', fontWeight: '500' },
};