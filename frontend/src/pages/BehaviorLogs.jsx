// src/pages/BehaviorLogs.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function BehaviorLogs({ assessmentId }) {
  const { token }               = useAuth();
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/behavior-logs/${assessmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (assessmentId) fetch();
  }, [assessmentId]);

  if (loading) return <p>Loading logs...</p>;
  if (!data)   return <p>Koi logs nahi mili.</p>;

  const { logs, summary } = data;

  const scoreColor =
    summary.suspicionScore >= 70 ? '#DC2626' :
    summary.suspicionScore >= 40 ? '#D97706' : '#16A34A';

  const eventIcons = {
    no_face:        '👁️',
    multiple_faces: '👥',
    tab_switch:     '🔀',
    fullscreen_exit:'🖥️',
    assessment_start:'🟢',
    assessment_end: '🔴',
    face_away:      '↩️',
  };

  return (
    <div style={s.wrap}>
      <h3 style={s.title}>🔍 Behavior Monitoring Report</h3>

      {/* Summary Cards */}
      <div style={s.summary}>
        <div style={{ ...s.summaryCard, borderColor: scoreColor }}>
          <span style={{ ...s.summaryNum, color: scoreColor }}>
            {summary.suspicionScore}
          </span>
          <span style={s.summaryLabel}>Suspicion Score</span>
        </div>
        <div style={s.summaryCard}>
          <span style={s.summaryNum}>{summary.no_face}</span>
          <span style={s.summaryLabel}>No Face Events</span>
        </div>
        <div style={s.summaryCard}>
          <span style={s.summaryNum}>{summary.multiple_faces}</span>
          <span style={s.summaryLabel}>Multiple Faces</span>
        </div>
        <div style={s.summaryCard}>
          <span style={s.summaryNum}>{summary.tab_switch}</span>
          <span style={s.summaryLabel}>Tab Switches</span>
        </div>
      </div>

      {/* Timeline */}
      <div style={s.timeline}>
        {logs.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>
            ✅ Koi suspicious activity nahi mili!
          </p>
        ) : (
          logs.map((log, i) => (
            <div key={i} style={s.logItem}>
              <span style={s.logIcon}>{eventIcons[log.eventType] || '📋'}</span>
              <div style={s.logContent}>
                <p style={s.logEvent}>{log.eventType.replace(/_/g, ' ').toUpperCase()}</p>
                <p style={s.logMessage}>{log.message}</p>
              </div>
              <span style={s.logTime}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const s = {
  wrap:         { background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.5rem' },
  title:        { fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' },
  summary:      { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' },
  summaryCard:  { background: '#f9fafb', borderRadius: '10px', padding: '12px', textAlign: 'center',
                  border: '1.5px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '4px' },
  summaryNum:   { fontSize: '28px', fontWeight: '700', color: '#111827' },
  summaryLabel: { fontSize: '11px', color: '#6b7280' },
  timeline:     { display: 'flex', flexDirection: 'column', gap: '8px' },
  logItem:      { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 12px',
                  background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' },
  logIcon:      { fontSize: '18px', flexShrink: 0 },
  logContent:   { flex: 1 },
  logEvent:     { margin: '0 0 2px', fontSize: '12px', fontWeight: '600', color: '#374151' },
  logMessage:   { margin: 0, fontSize: '12px', color: '#6b7280' },
  logTime:      { fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap' },
};