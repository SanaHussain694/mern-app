// src/hooks/useWebcam.js
import { useState, useRef, useEffect, useCallback } from 'react';

export default function useWebcam() {
  const videoRef      = useRef(null);
  const streamRef     = useRef(null);
  const [status, setStatus]   = useState('idle');
  // idle | requesting | active | denied | error

  const startWebcam = useCallback(async () => {
    setStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width:  { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setStatus('active');
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setStatus('denied');
      } else {
        setStatus('error');
      }
      console.error('Webcam error:', err.message);
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStatus('idle');
  }, []);

  // Component unmount pe auto-stop
  useEffect(() => {
    return () => stopWebcam();
  }, [stopWebcam]);

  return { videoRef, status, startWebcam, stopWebcam };
}