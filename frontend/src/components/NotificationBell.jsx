// src/components/NotificationBell.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell() {
  const { user, token }             = useAuth();
  const [notifs, setNotifs]         = useState([]);
  const [unread, setUnread]         = useState(0);
  const [open, setOpen]             = useState(false);
  const panelRef                    = useRef(null);

  const headers = { Authorization: `Bearer ${token}` };

  // Notifications fetch
  const fetchNotifs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/notifications/${user.id}`,
        { headers }
      );
      setNotifs(res.data.notifications);
      setUnread(res.data.unreadCount);
    } catch { /* silent */ }
  };

  // Poll har 30 second
  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  // Outside click se band karo
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {}, { headers }
      );
      setNotifs(prev => prev.map(n =>
        n._id === id ? { ...n, isRead: true } : n
      ));
      setUnread(prev => Math.max(0, prev - 1));
    } catch { /* silent */ }
  };

  const markAllRead = async () => {
    try {
      await axios.put(
        'http://localhost:5000/api/notifications/read-all',
        {}, { headers }
      );
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnread(0);
    } catch { /* silent */ }
  };

  const typeIcons = {
    job_match:        '💼',
    application:      '📋',
    assessment_done:  '✅',
    interview_invite: '🎤',
    profile_view:     '👁️',
    general:          '🔔',
  };

  const timeAgo = (date) => {
    const secs = Math.floor((Date.now() - new Date(date)) / 1000);
    if (secs < 60)   return 'Just now';
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400)return `${Math.floor(secs / 3600)}h ago`;
    return `${Math.floor(secs / 86400)}d ago`;
  };

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>

      {/* Bell Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={s.bell}>
        🔔
        {unread > 0 && (
          <span style={s.badge}>{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div style={s.panel}>

          {/* Header */}
          <div style={s.panelHeader}>
            <span style={s.panelTitle}>Notifications</span>
            {unread > 0 && (
              <button style={s.markAllBtn} onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={s.list}>
            {notifs.length === 0 ? (
              <div style={s.empty}>
                <span style={{ fontSize: '32px' }}>🔔</span>
                <p>Koi notification nahi!</p>
              </div>
            ) : (
              notifs.map(n => (
                <div
                  key={n._id}
                  onClick={() => markRead(n._id)}
                  style={{
                    ...s.item,
                    background: n.isRead ? '#fff' : '#EFF6FF',
                  }}>
                  <span style={s.itemIcon}>
                    {typeIcons[n.type] || '🔔'}
                  </span>
                  <div style={s.itemContent}>
                    <p style={s.itemMsg}>{n.message}</p>
                    <span style={s.itemTime}>{timeAgo(n.createdAt)}</span>
                  </div>
                  {!n.isRead && <div style={s.dot} />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  bell:        { position: 'relative', background: 'none', border: 'none',
                 fontSize: '22px', cursor: 'pointer', padding: '6px' },
  badge:       { position: 'absolute', top: '-2px', right: '-2px',
                 background: '#DC2626', color: '#fff', borderRadius: '50%',
                 width: '18px', height: '18px', fontSize: '10px',
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 fontWeight: '700' },
  panel:       { position: 'absolute', right: 0, top: '40px', width: '340px',
                 background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
                 boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 1000, overflow: 'hidden' },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                 padding: '14px 16px', borderBottom: '1px solid #e5e7eb' },
  panelTitle:  { fontSize: '15px', fontWeight: '600', color: '#111827' },
  markAllBtn:  { fontSize: '12px', color: '#185FA5', background: 'none',
                 border: 'none', cursor: 'pointer' },
  list:        { maxHeight: '360px', overflowY: 'auto' },
  empty:       { padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '14px' },
  item:        { display: 'flex', alignItems: 'flex-start', gap: '10px',
                 padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6',
                 transition: 'background 0.15s' },
  itemIcon:    { fontSize: '20px', flexShrink: 0, marginTop: '2px' },
  itemContent: { flex: 1 },
  itemMsg:     { margin: '0 0 4px', fontSize: '13px', color: '#374151', lineHeight: 1.4 },
  itemTime:    { fontSize: '11px', color: '#9ca3af' },
  dot:         { width: '8px', height: '8px', borderRadius: '50%',
                 background: '#185FA5', flexShrink: 0, marginTop: '6px' },
};