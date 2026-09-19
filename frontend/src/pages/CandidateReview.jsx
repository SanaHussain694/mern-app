// src/pages/CandidateReview.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CandidateReview() {
  const { token }                       = useAuth();
  const [candidates, setCandidates]     = useState([]);
  const [selected, setSelected]         = useState(null);
  const [detail, setDetail]             = useState(null);
  const [search, setSearch]             = useState('');
  const [loading, setLoading]           = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/candidates?search=${search}`,
        { headers }
      );
      setCandidates(res.data.candidates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (userId) => {
    setDetailLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/candidates/${userId}/detail`,
        { headers }
      );
      setDetail(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSelect = (c) => {
    setSelected(c);
    fetchDetail(c.user._id);
  };

  const behaviorIcons = {
    no_face: '👁️', multiple_faces: '👥',
    tab_switch: '🔀', fullscreen_exit: '🖥️',
  };

  return (
    <div style={s.page}>
      <h2 style={s.title}>👥 Candidate Review</h2>

      <div style={s.layout}>

        {/* ── LEFT: Candidate List ────────────────── */}
        <div style={s.sidebar}>
          <div style={s.searchRow}>
            <input style={s.searchInput}
              placeholder="🔍 Candidate search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchCandidates()} />
            <button style={s.searchBtn} onClick={fetchCandidates}>Go</button>
          </div>

          {loading ? (
            <p style={s.loadingText}>Loading...</p>
          ) : candidates.length === 0 ? (
            <p style={s.loadingText}>Koi candidate nahi mila</p>
          ) : (
            candidates.map(c => (
              <div key={c.user._id}
                onClick={() => handleSelect(c)}
                style={{
                  ...s.candidateItem,
                  background: selected?.user._id === c.user._id ? '#EFF6FF' : '#fff',
                  borderColor: selected?.user._id === c.user._id ? '#185FA5' : '#e5e7eb',
                }}>
                <div style={s.candidateAvatar}>
                  {c.user.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={s.candidateName}>{c.user.name}</p>
                  <p style={s.candidateEmail}>{c.user.email}</p>
                  <div style={s.candidateMeta}>
                    {c.lastAssessment && (
                      <span style={s.metaBadge}>
                        📋 Score: {c.lastAssessment.score}/15
                      </span>
                    )}
                    {c.behaviorEvents > 0 && (
                      <span style={{ ...s.metaBadge, background: '#FEF2F2', color: '#DC2626' }}>
                        ⚠️ {c.behaviorEvents}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── RIGHT: Detail View ──────────────────── */}
        <div style={s.detail}>
          {!selected ? (
            <div style={s.placeholder}>
              <span style={{ fontSize: '48px' }}>👈</span>
              <p>Candidate select karein details dekhne ke liye</p>
            </div>
          ) : detailLoading ? (
            <div style={s.placeholder}>Loading detail...</div>
          ) : detail ? (
            <div>

              {/* Profile Header */}
              <div style={s.detailHeader}>
                <div style={s.detailAvatar}>
                  {detail.user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={s.detailName}>{detail.user.name}</h3>
                  <p style={s.detailEmail}>{detail.user.email}</p>
                  {detail.profile?.city && (
                    <p style={s.detailCity}>📍 {detail.profile.city}</p>
                  )}
                </div>
              </div>

              {/* Skills */}
              {detail.profile?.skills?.length > 0 && (
                <DetailSection title="🛠 Skills">
                  <div style={s.chips}>
                    {detail.profile.skills.map(sk => (
                      <span key={sk} style={s.chip}>{sk}</span>
                    ))}
                  </div>
                </DetailSection>
              )}

              {/* CV Download */}
              {detail.profile?.cvUrl && (
                <DetailSection title="📄 CV">
                  <a href={`http://localhost:5000${detail.profile.cvUrl}`}
                    target="_blank" rel="noreferrer" style={s.cvLink}>
                    📥 Download CV
                  </a>
                </DetailSection>
              )}

              {/* Assessment Scores */}
              {detail.assessments?.length > 0 && (
                <DetailSection title="📋 Assessments">
                  {detail.assessments.map((a, i) => (
                    <div key={i} style={s.assessCard}>
                      <span style={s.assessDomain}>{a.domain}</span>
                      <span style={{ ...s.assessScore,
                        color: a.score >= 10 ? '#16A34A' :
                               a.score >= 6  ? '#D97706' : '#DC2626' }}>
                        {a.score}/15 ({Math.round(a.score/15*100)}%)
                      </span>
                      <span style={s.assessDate}>
                        {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </DetailSection>
              )}

              {/* Interview Recording */}
              {detail.interviews?.length > 0 && (
                <DetailSection title="🎤 Interview Recordings">
                  {detail.interviews.map((iv, i) => (
                    <div key={i} style={s.interviewCard}>
                      <div style={s.interviewMeta}>
                        <span>{iv.domain}</span>
                        <span style={{ color: '#6b7280', fontSize: '12px' }}>
                          {new Date(iv.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {iv.videoUrl ? (
                        <video controls style={s.video}
                          src={`http://localhost:5000${iv.videoUrl}`}>
                          Your browser does not support video.
                        </video>
                      ) : (
                        <p style={{ color: '#9ca3af', fontSize: '13px' }}>
                          🎥 Video available nahi
                        </p>
                      )}
                    </div>
                  ))}
                </DetailSection>
              )}

              {/* Behavior Logs */}
              {detail.behaviorLogs?.length > 0 && (
                <DetailSection title="⚠️ Behavior Logs">
                  <div style={s.logList}>
                    {detail.behaviorLogs.slice(0, 10).map((log, i) => (
                      <div key={i} style={s.logItem}>
                        <span style={s.logIcon}>
                          {behaviorIcons[log.eventType] || '📋'}
                        </span>
                        <div style={{ flex: 1 }}>
                          <p style={s.logType}>
                            {log.eventType.replace(/_/g, ' ').toUpperCase()}
                          </p>
                          <p style={s.logMsg}>{log.message}</p>
                        </div>
                        <span style={s.logTime}>
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </DetailSection>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const DetailSection = ({ title, children }) => (
  <div style={{ marginBottom: '20px' }}>
    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151',
      borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' }}>
      {title}
    </h4>
    {children}
  </div>
);

const s = {
  page:           { minHeight: '100vh', background: '#f5f7fa', padding: '2rem' },
  title:          { fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '1.5rem' },
  layout:         { display: 'grid', gridTemplateColumns: '320px 1fr', gap: '16px',
                    alignItems: 'flex-start' },
  sidebar:        { background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
                    overflow: 'hidden' },
  searchRow:      { display: 'flex', gap: '8px', padding: '12px' },
  searchInput:    { flex: 1, padding: '8px 12px', border: '1px solid #d1d5db',
                    borderRadius: '8px', fontSize: '13px', outline: 'none' },
  searchBtn:      { background: '#185FA5', color: '#fff', border: 'none', padding: '8px 14px',
                    borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  loadingText:    { padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' },
  candidateItem:  { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px',
                    cursor: 'pointer', borderBottom: '1px solid #f3f4f6',
                    border: '1px solid transparent', borderRadius: '0', transition: 'all 0.15s' },
  candidateAvatar:{ width: '36px', height: '36px', borderRadius: '50%', background: '#185FA5',
                    color: '#fff', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '14px', fontWeight: '600', flexShrink: 0 },
  candidateName:  { margin: 0, fontSize: '14px', fontWeight: '500', color: '#111827' },
  candidateEmail: { margin: '2px 0 4px', fontSize: '12px', color: '#6b7280',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  candidateMeta:  { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  metaBadge:      { background: '#EFF6FF', color: '#185FA5', borderRadius: '20px',
                    padding: '1px 8px', fontSize: '11px' },
  detail:         { background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
                    padding: '1.5rem', minHeight: '400px' },
  placeholder:    { display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', minHeight: '300px', color: '#9ca3af',
                    gap: '12px', fontSize: '14px' },
  detailHeader:   { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px',
                    padding: '16px', background: '#f9fafb', borderRadius: '10px' },
  detailAvatar:   { width: '56px', height: '56px', borderRadius: '50%', background: '#185FA5',
                    color: '#fff', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '22px', fontWeight: '700', flexShrink: 0 },
  detailName:     { margin: '0 0 4px', fontSize: '18px', fontWeight: '600', color: '#111827' },
  detailEmail:    { margin: '0 0 4px', fontSize: '14px', color: '#6b7280' },
  detailCity:     { margin: 0, fontSize: '13px', color: '#6b7280' },
  chips:          { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  chip:           { background: '#EFF6FF', color: '#185FA5', borderRadius: '20px',
                    padding: '3px 10px', fontSize: '12px' },
  cvLink:         { display: 'inline-block', background: '#185FA5', color: '#fff',
                    padding: '8px 16px', borderRadius: '8px', textDecoration: 'none',
                    fontSize: '14px' },
  assessCard:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px', background: '#f9fafb', borderRadius: '8px',
                    marginBottom: '8px', border: '1px solid #e5e7eb' },
  assessDomain:   { fontSize: '14px', fontWeight: '500', color: '#374151', textTransform: 'capitalize' },
  assessScore:    { fontSize: '16px', fontWeight: '700' },
  assessDate:     { fontSize: '12px', color: '#9ca3af' },
  interviewCard:  { background: '#f9fafb', borderRadius: '10px', padding: '12px',
                    marginBottom: '10px', border: '1px solid #e5e7eb' },
  interviewMeta:  { display: 'flex', justifyContent: 'space-between', marginBottom: '10px',
                    fontSize: '14px', fontWeight: '500', color: '#374151' },
  video:          { width: '100%', borderRadius: '8px', maxHeight: '200px' },
  logList:        { display: 'flex', flexDirection: 'column', gap: '6px' },
  logItem:        { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 10px',
                    background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' },
  logIcon:        { fontSize: '16px', flexShrink: 0 },
  logType:        { margin: 0, fontSize: '11px', fontWeight: '600', color: '#374151' },
  logMsg:         { margin: 0, fontSize: '11px', color: '#6b7280' },
  logTime:        { fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap' },
};