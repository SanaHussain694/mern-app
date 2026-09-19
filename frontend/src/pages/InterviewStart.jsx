// src/pages/InterviewStart.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function InterviewStart() {
  const { token }         = useAuth();
  const navigate          = useNavigate();
  const [domain, setDomain]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const domains = [
    { value: 'web-dev',      label: '🌐 Web Development',  count: '8 Tech + 2 Behavioral' },
    { value: 'data-science', label: '📊 Data Science',     count: '8 Tech + 2 Behavioral' },
    { value: 'mobile',       label: '📱 Mobile Dev',       count: '8 Tech + 2 Behavioral' },
    { value: 'general',      label: '💼 General',           count: '10 Behavioral' },
  ];

  const handleStart = async () => {
    if (!domain) return setError('Domain select karein!');
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/interviews/start',
        { domain },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/interview/${res.data.interview._id}`, {
        state: { interview: res.data.interview }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}>🎤</div>
        <h2 style={s.title}>AI Interview</h2>
        <p style={s.sub}>Domain select karein aur interview shuru karein</p>

        {error && <div style={s.error}>{error}</div>}

        <div style={s.domains}>
          {domains.map(d => (
            <div key={d.value}
              onClick={() => { setDomain(d.value); setError(''); }}
              style={{ ...s.card2, ...(domain === d.value ? s.active : {}) }}>
              <span style={s.dLabel}>{d.label}</span>
              <span style={s.dCount}>{d.count} questions</span>
            </div>
          ))}
        </div>

        <div style={s.info}>
          <span>🎥 Video record hoga</span>
          <span>⏱ 2-3 min per question</span>
          <span>🤖 AI follow-up questions</span>
        </div>

        <button onClick={handleStart} disabled={loading || !domain}
          style={{ ...s.btn, opacity: (!domain || loading) ? 0.6 : 1 }}>
          {loading ? 'Starting...' : '🚀 Start Interview'}
        </button>
      </div>
    </div>
  );
}

const s = {
  page:    { minHeight: '100vh', background: '#f5f7fa', display: 'flex',
             alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  card:    { background: '#fff', borderRadius: '16px', padding: '2.5rem',
             maxWidth: '480px', width: '100%', textAlign: 'center',
             border: '1px solid #e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
  icon:    { fontSize: '52px', marginBottom: '12px' },
  title:   { fontSize: '26px', fontWeight: '700', color: '#111827', margin: '0 0 8px' },
  sub:     { fontSize: '14px', color: '#6b7280', margin: '0 0 24px' },
  error:   { background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
             borderRadius: '8px', padding: '10px', fontSize: '14px', marginBottom: '16px' },
  domains: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  card2:   { padding: '14px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px',
             cursor: 'pointer', textAlign: 'left', display: 'flex',
             flexDirection: 'column', gap: '4px', background: '#fafafa' },
  active:  { borderColor: '#185FA5', background: '#EFF6FF' },
  dLabel:  { fontSize: '15px', fontWeight: '500', color: '#111827' },
  dCount:  { fontSize: '12px', color: '#6b7280' },
  info:    { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap',
             gap: '8px', background: '#F9FAFB', borderRadius: '10px',
             padding: '12px 16px', fontSize: '13px', color: '#6b7280', marginBottom: '20px' },
  btn:     { width: '100%', background: '#185FA5', color: '#fff', border: 'none',
             padding: '13px', borderRadius: '10px', fontSize: '16px',
             fontWeight: '600', cursor: 'pointer' },
};