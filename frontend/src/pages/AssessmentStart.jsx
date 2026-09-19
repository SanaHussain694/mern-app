// src/pages/AssessmentStart.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AssessmentStart() {
  const [domain, setDomain]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { token }  = useAuth();
  const navigate   = useNavigate();

  const domains = [
    { value: 'web-dev',      label: '🌐 Web Development',  desc: '15 MCQ + 5 Subjective' },
    { value: 'data-science', label: '📊 Data Science',     desc: '15 MCQ + 5 Subjective' },
    { value: 'mobile',       label: '📱 Mobile Development', desc: '15 MCQ + 5 Subjective' },
  ];

  const handleStart = async () => {
    if (!domain) return setError('Domain select karo!');
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/assessments/generate',
        { domain },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Assessment ID ke saath test page pe bhejo
      navigate(`/assessment/${res.data.assessment._id}`, {
        state: { assessment: res.data.assessment }
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
        <div style={s.icon}>🎯</div>
        <h2 style={s.title}>Assessment Start Karo</h2>
        <p style={s.sub}>Domain select karo aur test shuru karo</p>

        {error && <div style={s.error}>{error}</div>}

        <div style={s.domains}>
          {domains.map(d => (
            <div key={d.value}
              onClick={() => { setDomain(d.value); setError(''); }}
              style={{ ...s.domainCard, ...(domain === d.value ? s.active : {}) }}>
              <span style={s.domainLabel}>{d.label}</span>
              <span style={s.domainDesc}>{d.desc}</span>
            </div>
          ))}
        </div>

        <div style={s.infoBox}>
          <p>⏱ 30 minutes time limit</p>
          <p>✅ 15 MCQ auto-graded</p>
          <p>📝 5 Subjective manually reviewed</p>
        </div>

        <button
          onClick={handleStart} disabled={loading || !domain}
          style={{ ...s.btn, opacity: (!domain || loading) ? 0.6 : 1 }}>
          {loading ? 'Generating...' : '🚀 Start Assessment'}
        </button>
      </div>
    </div>
  );
}

const s = {
  page:       { minHeight: '100vh', background: '#f5f7fa', display: 'flex',
                alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  card:       { background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                padding: '2.5rem', maxWidth: '480px', width: '100%',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)', textAlign: 'center' },
  icon:       { fontSize: '48px', marginBottom: '16px' },
  title:      { fontSize: '24px', fontWeight: '600', color: '#111827', margin: '0 0 8px' },
  sub:        { fontSize: '14px', color: '#6b7280', margin: '0 0 24px' },
  error:      { background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
                borderRadius: '8px', padding: '10px', fontSize: '14px', marginBottom: '16px' },
  domains:    { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  domainCard: { padding: '14px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px',
                cursor: 'pointer', textAlign: 'left', display: 'flex',
                flexDirection: 'column', gap: '4px', background: '#fafafa' },
  active:     { borderColor: '#185FA5', background: '#EFF6FF' },
  domainLabel:{ fontSize: '15px', fontWeight: '500', color: '#111827' },
  domainDesc: { fontSize: '12px', color: '#6b7280' },
  infoBox:    { background: '#F9FAFB', borderRadius: '8px', padding: '12px 16px',
                fontSize: '13px', color: '#6b7280', marginBottom: '20px',
                display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' },
  btn:        { width: '100%', background: '#185FA5', color: '#fff', border: 'none',
                padding: '12px', borderRadius: '10px', fontSize: '16px',
                fontWeight: '500', cursor: 'pointer' },
};