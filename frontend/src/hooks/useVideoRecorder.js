// src/hooks/useVideoRecorder.js
import { useState, useRef, useCallback } from 'react';

export default function useVideoRecorder() {
  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);
  const streamRef        = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob,   setVideoBlob]   = useState(null);
  const [error,       setError]       = useState('');

  // Recording shuru karo
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus',
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
      };

      // Har 5 min pe chunk save karo
      recorder.start(5 * 60 * 1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setError('');

    } catch (err) {
      setError(err.name === 'NotAllowedError'
        ? 'Camera/mic permission denied!'
        : 'Recording start nahi hui!');
    }
  }, []);

  // Recording band karo
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach(t => t.stop());
    setIsRecording(false);
  }, []);

  // Video server pe upload karo
  const uploadVideo = useCallback(async (blob, token) => {
    if (!blob) return null;
    try {
      const formData = new FormData();
      formData.append('video', blob, `interview-${Date.now()}.webm`);

      const res = await fetch('http://localhost:5000/api/interviews/upload-video', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      return data.videoUrl || null;
    } catch (err) {
      console.error('Upload error:', err);
      return null;
    }
  }, []);

  return {
    isRecording, videoBlob, error,
    startRecording, stopRecording, uploadVideo,
  };
}