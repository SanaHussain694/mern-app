// src/components/InterviewTimer.jsx
import { useState, useEffect, useRef } from 'react';

export default function InterviewTimer({ duration, onTimeUp, isRunning }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, onTimeUp]);

  const pct     = (timeLeft / duration) * 100;
  const color   = timeLeft > 60 ? '#16A34A' : timeLeft > 30 ? '#D97706' : '#DC2626';
  const mins    = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs    = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Circular timer */}
      <svg width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="26" cy="26" r="22" fill="none"
          stroke="#e5e7eb" strokeWidth="4" />
        <circle cx="26" cy="26" r="22" fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={`${2 * Math.PI * 22}`}
          strokeDashoffset={`${2 * Math.PI * 22 * (1 - pct / 100)}`}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }} />
      </svg>
      <span style={{ fontSize: '20px', fontWeight: '700',
        color, fontVariantNumeric: 'tabular-nums' }}>
        {mins}:{secs}
      </span>
    </div>
  );
}