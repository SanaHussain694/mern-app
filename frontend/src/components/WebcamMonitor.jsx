// src/components/WebcamMonitor.jsx
import { useEffect, useRef, useCallback } from 'react';
import useWebcam from '../hooks/useWebcam';
import useFaceDetection from '../hooks/useFaceDetection';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function WebcamMonitor({
  assessmentId,
  onWarning,        // parent ko warning bhejo
  isMinimized = false,
}) {
  const { token }                           = useAuth();
  const { videoRef, status, startWebcam }   = useWebcam();
  const { canvasRef, faceCount, isLoaded }  = useFaceDetection(
    videoRef, status === 'active'
  );

  const lastEventRef   = useRef({});   // spam prevent karo
  const warningCountRef = useRef(0);
  const tabHiddenRef   = useRef(false);

  // Backend mein log save karo
  const logEvent = useCallback(async (eventType, severity, message) => {
    const now       = Date.now();
    const lastTime  = lastEventRef.current[eventType] || 0;

    // Same event 10 sec mein dobara log mat karo
    if (now - lastTime < 10000) return;
    lastEventRef.current[eventType] = now;

    try {
      await axios.post(
        'http://localhost:5000/api/behavior-logs',
        { assessmentId, eventType, severity, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Log error:', err.message);
    }

    // Parent ko bhi batao
    warningCountRef.current++;
    onWarning?.({
      eventType, severity, message,
      count: warningCountRef.current,
    });
  }, [assessmentId, token, onWarning]);

  // Face detection ke results pe react karo
  useEffect(() => {
    if (status !== 'active' || !isLoaded) return;

    if (faceCount === 0) {
      logEvent('no_face', 'high', 'Koi face detect nahi hua!');
    } else if (faceCount > 1) {
      logEvent('multiple_faces', 'high', `${faceCount} faces detect hue!`);
    }
  }, [faceCount, status, isLoaded, logEvent]);

  // Tab switch detect karo
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !tabHiddenRef.current) {
        tabHiddenRef.current = true;
        logEvent('tab_switch', 'medium', 'User ne tab switch kiya!');
      } else {
        tabHiddenRef.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [logEvent]);

  // Fullscreen exit detect karo
  useEffect(() => {
    const handleFullscreen = () => {
      if (!document.fullscreenElement) {
        logEvent('fullscreen_exit', 'low', 'Fullscreen exit kiya!');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreen);
    return () => document.removeEventListener('fullscreenchange', handleFullscreen);
  }, [logEvent]);

  // Webcam start on mount
  useEffect(() => {
    startWebcam();
  }, [startWebcam]);

  // Status messages
  const statusMessages = {
    idle:       { text: 'Camera idle',          color: '#6b7280' },
    requesting: { text: 'Camera permission...',  color: '#D97706' },
    active:     { text: 'Camera active ✅',      color: '#16A34A' },
    denied:     { text: 'Camera blocked ❌',     color: '#DC2626' },
    error:      { text: 'Camera error ❌',        color: '#DC2626' },
  };

  const st = statusMessages[status] || statusMessages.idle;

  const faceStatus = !isLoaded      ? { text: 'Loading...',        bg: '#F3F4F6', color: '#6b7280' }
    : faceCount === 0               ? { text: '⚠️ No Face!',        bg: '#FEF2F2', color: '#DC2626' }
    : faceCount === 1               ? { text: '✅ 1 Face',           bg: '#F0FDF4', color: '#16A34A' }
    :                                 { text: `🚨 ${faceCount} Faces!`, bg: '#FEF2F2', color: '#DC2626' };

  return (
    <div style={{
      ...s.container,
      width:  isMinimized ? '160px' : '240px',
      bottom: isMinimized ? '12px'  : '16px',
    }}>

      {/* Video + Canvas overlay */}
      <div style={s.videoWrap}>
        <video
          ref={videoRef}
          style={s.video}
          autoPlay
          muted
          playsInline
        />
        <canvas ref={canvasRef} style={s.canvas} />

        {/* Face status badge */}
        <div style={{ ...s.faceBadge, background: faceStatus.bg, color: faceStatus.color }}>
          {faceStatus.text}
        </div>
      </div>

      {/* Camera status */}
      <div style={s.statusBar}>
        <span style={{ ...s.dot, background: st.color }} />
        <span style={{ fontSize: '11px', color: st.color }}>{st.text}</span>
      </div>

      {/* Permission denied warning */}
      {status === 'denied' && (
        <div style={s.deniedBox}>
          <p style={s.deniedText}>
            ⚠️ Camera permission denied!<br />
            Browser settings mein allow karo.
          </p>
          <button style={s.retryBtn} onClick={startWebcam}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

const s = {
  container: {
    position:   'fixed',
    right:      '16px',
    borderRadius: '12px',
    background: '#1f2937',
    border:     '2px solid #374151',
    overflow:   'hidden',
    zIndex:     9999,
    boxShadow:  '0 8px 32px rgba(0,0,0,0.3)',
    transition: 'width 0.3s',
  },
  videoWrap: {
    position:   'relative',
    width:      '100%',
    aspectRatio: '4/3',
    overflow:   'hidden',
    background: '#000',
  },
  video: {
    width:      '100%',
    height:     '100%',
    objectFit:  'cover',
    transform:  'scaleX(-1)', // mirror effect
  },
  canvas: {
    position:  'absolute',
    top: 0, left: 0,
    width:     '100%',
    height:    '100%',
    transform: 'scaleX(-1)',
    pointerEvents: 'none',
  },
  faceBadge: {
    position:     'absolute',
    bottom:       '6px',
    left:         '50%',
    transform:    'translateX(-50%)',
    padding:      '2px 8px',
    borderRadius: '20px',
    fontSize:     '10px',
    fontWeight:   '600',
    whiteSpace:   'nowrap',
  },
  statusBar: {
    display:        'flex',
    alignItems:     'center',
    gap:            '6px',
    padding:        '6px 10px',
    background:     '#111827',
  },
  dot: {
    width:        '6px',
    height:       '6px',
    borderRadius: '50%',
    flexShrink:   0,
  },
  deniedBox: {
    padding:    '10px',
    background: '#7f1d1d',
    textAlign:  'center',
  },
  deniedText: {
    color:      '#fca5a5',
    fontSize:   '11px',
    margin:     '0 0 8px',
    lineHeight: 1.4,
  },
  retryBtn: {
    background:   '#DC2626',
    color:        '#fff',
    border:       'none',
    padding:      '4px 12px',
    borderRadius: '6px',
    cursor:       'pointer',
    fontSize:     '12px',
  },
};