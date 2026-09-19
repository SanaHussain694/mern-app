// src/components/WarningAlert.jsx
import { useState, useEffect } from 'react';

export default function WarningAlert({ warning, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!warning) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 5000);
    return () => clearTimeout(t);
  }, [warning]);

  if (!visible || !warning) return null;

  const configs = {
    no_face:       { icon: '👁️', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
    multiple_faces:{ icon: '👥', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
    tab_switch:    { icon: '🔀', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
    fullscreen_exit:{ icon:'🖥️', color: '#6b7280', bg: '#F9FAFB', border: '#e5e7eb' },
  };

  const c = configs[warning.eventType] || configs.tab_switch;

  return (
    <div style={{
      position:    'fixed',
      top:         '20px',
      left:        '50%',
      transform:   'translateX(-50%)',
      zIndex:      10000,
      background:  c.bg,
      border:      `1px solid ${c.border}`,
      borderRadius:'12px',
      padding:     '14px 20px',
      display:     'flex',
      alignItems:  'center',
      gap:         '12px',
      boxShadow:   '0 8px 24px rgba(0,0,0,0.12)',
      maxWidth:    '420px',
      animation:   'slideDown 0.3s ease',
    }}>
      <span style={{ fontSize: '24px' }}>{c.icon}</span>
      <div>
        <p style={{ margin: 0, fontWeight: '600', color: c.color, fontSize: '14px' }}>
          ⚠️ Warning #{warning.count}
        </p>
        <p style={{ margin: 0, fontSize: '13px', color: '#374151' }}>
          {warning.message}
        </p>
      </div>
      <button
        onClick={() => { setVisible(false); onDismiss?.(); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '18px', color: '#6b7280', marginLeft: 'auto' }}>
        ✕
      </button>
    </div>
  );
}