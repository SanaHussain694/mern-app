// src/pages/AssessmentResult.jsx
import { useLocation, useNavigate } from 'react-router-dom';

export default function AssessmentResult() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const result     = state?.result;

  if (!result) return <div style={{ padding: '2rem' }}>
    Result nahi mila! <a href="/assessment">Wapis jao</a>
  </div>;

  const { score, total, percent, result: assessment } = result;
  const answers   = assessment?.answers || [];
  const questions = assessment?.questions || [];

  const getGrade = (pct) => {
    if (pct >= 80) return { label: 'Excellent! 🏆', color: '#16A34A', bg: '#F0FDF4' };
    if (pct >= 60) return { label: 'Good Job! 👍',  color: '#D97706', bg: '#FEF3C7' };
    if (pct >= 40) return { label: 'Keep Trying 💪', color: '#EA580C', bg: '#FFF7ED' };
    return { label: 'Needs Improvement 📚', color: '#DC2626', bg: '#FEF2F2' };
  };

  const grade = getGrade(percent);

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Score Summary */}
        <div style={{ ...s.scoreBanner, background: grade.bg }}>
          <div style={s.scoreCircle}>
            <span style={{ ...s.scoreNum, color: grade.color }}>{score}</span>
            <span style={s.scoreTotal}>/{total}</span>
          </div>
          <div>
            <h2 style={{ ...s.grade, color: grade.color }}>{grade.label}</h2>
            <p style={s.percent}>{percent}% Score</p>
          </div>
        </div>

        {/* Stats Row */}
        <div style={s.stats}>
          {[
            { label: 'Correct',  value: answers.filter(a => a.status === 'correct').length,  color: '#16A34A' },
            { label: 'Wrong',    value: answers.filter(a => a.status === 'wrong').length,    color: '#DC2626' },
            { label: 'Skipped',  value: answers.filter(a => a.status === 'skipped').length,  color: '#6b7280' },
            { label: 'Pending',  value: answers.filter(a => a.status === 'pending').length,  color: '#D97706' },
          ].map(stat => (
            <div key={stat.label} style={s.statBox}>
              <span style={{ ...s.statNum, color: stat.color }}>{stat.value}</span>
              <span style={s.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Answer Review */}
        <h3 style={s.reviewTitle}>Answer Review</h3>
        <div style={s.answers}>
          {questions.map((q, i) => {
            const ans    = answers[i];
            const status = ans?.status;
            const colors = {
              correct: { bg: '#F0FDF4', border: '#BBF7D0' },
              wrong:   { bg: '#FEF2F2', border: '#FECACA' },
              pending: { bg: '#FEF3C7', border: '#FDE68A' },
              skipped: { bg: '#F9FAFB', border: '#e5e7eb' },
            };
            const c = colors[status] || colors.skipped;

            return (
              <div key={i} style={{ ...s.answerCard,
                background: c.bg, borderColor: c.border }}>
                <div style={s.qHeader}>
                  <span style={s.qNum}>Q{i + 1}</span>
                  <span style={{ ...s.statusBadge, background: c.border }}>
                    {status === 'correct' ? '✅ Correct' :
                     status === 'wrong'   ? '❌ Wrong'   :
                     status === 'pending' ? '⏳ Pending Review' : '⏭ Skipped'}
                  </span>
                </div>
                <p style={s.qText}>{q?.question}</p>

                {ans?.userAnswer && (
                  <p style={s.answer}>
                    <strong>Your answer:</strong> {ans.userAnswer}
                  </p>
                )}

                {status === 'wrong' && (
                  <p style={{ ...s.answer, color: '#16A34A' }}>
                    <strong>Correct:</strong> {ans?.correctAnswer}
                  </p>
                )}

                {status === 'pending' && (
                  <p style={{ ...s.answer, color: '#D97706' }}>
                    📝 Subjective — Manual review hoga
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button style={s.retryBtn}
            onClick={() => navigate('/assessment')}>
            🔄 Try Again
          </button>
          <button style={s.dashBtn}
            onClick={() => navigate('/dashboard')}>
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
                 padding: '2rem', maxWidth: '680px', margin: '0 auto',
                 boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
  scoreBanner: { borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem',
                 display: 'flex', alignItems: 'center', gap: '20px' },
  scoreCircle: { display: 'flex', alignItems: 'baseline', gap: '4px' },
  scoreNum:    { fontSize: '52px', fontWeight: '700', lineHeight: 1 },
  scoreTotal:  { fontSize: '22px', color: '#6b7280' },
  grade:       { fontSize: '22px', fontWeight: '600', margin: '0 0 4px' },
  percent:     { fontSize: '15px', color: '#6b7280', margin: 0 },
  stats:       { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px',
                 marginBottom: '24px' },
  statBox:     { background: '#f9fafb', borderRadius: '10px', padding: '12px',
                 textAlign: 'center', border: '1px solid #e5e7eb',
                 display: 'flex', flexDirection: 'column', gap: '4px' },
  statNum:     { fontSize: '24px', fontWeight: '700' },
  statLabel:   { fontSize: '12px', color: '#6b7280' },
  reviewTitle: { fontSize: '18px', fontWeight: '600', color: '#111827',
                 marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' },
  answers:     { display: 'flex', flexDirection: 'column', gap: '10px' },
  answerCard:  { border: '1px solid', borderRadius: '10px', padding: '14px' },
  qHeader:     { display: 'flex', justifyContent: 'space-between',
                 alignItems: 'center', marginBottom: '8px' },
  qNum:        { fontSize: '13px', fontWeight: '600', color: '#6b7280' },
  statusBadge: { padding: '2px 10px', borderRadius: '20px', fontSize: '12px',
                 fontWeight: '500', color: '#374151' },
  qText:       { fontSize: '14px', color: '#111827', margin: '0 0 8px', lineHeight: 1.5 },
  answer:      { fontSize: '13px', color: '#374151', margin: '4px 0' },
  retryBtn:    { flex: 1, padding: '11px', border: '1px solid #185FA5', color: '#185FA5',
                 background: '#fff', borderRadius: '8px', cursor: 'pointer',
                 fontSize: '14px', fontWeight: '500' },
  dashBtn:     { flex: 1, padding: '11px', background: '#185FA5', color: '#fff',
                 border: 'none', borderRadius: '8px', cursor: 'pointer',
                 fontSize: '14px', fontWeight: '500' },
};