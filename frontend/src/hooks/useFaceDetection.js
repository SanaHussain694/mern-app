// src/hooks/useFaceDetection.js
import { useState, useRef, useEffect, useCallback } from 'react';

export default function useFaceDetection(videoRef, isActive) {
  const canvasRef          = useRef(null);
  const detectionRef       = useRef(null);
  const animFrameRef       = useRef(null);
  const [faceCount, setFaceCount]     = useState(0);
  const [isLoaded, setIsLoaded]       = useState(false);
  const [detectionData, setDetectionData] = useState(null);

  // MediaPipe load karo
  useEffect(() => {
    if (!isActive) return;

    const loadMediaPipe = async () => {
      try {
        const { FaceDetection } = await import('@mediapipe/face_detection');

        const faceDetection = new FaceDetection({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        });

        faceDetection.setOptions({
          model:           'short',   // fast model
          minDetectionConfidence: 0.5,
        });

        faceDetection.onResults((results) => {
          const count = results.detections?.length || 0;
          setFaceCount(count);
          setDetectionData(results);
          drawBoundingBoxes(results);
        });

        detectionRef.current = faceDetection;
        setIsLoaded(true);

      } catch (err) {
        console.error('MediaPipe load error:', err);
        // Fallback: basic detection
        setIsLoaded(true);
      }
    };

    loadMediaPipe();
  }, [isActive]);

  // Bounding box canvas pe draw karo
  const drawBoundingBoxes = useCallback((results) => {
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!results.detections?.length) return;

    results.detections.forEach((detection, i) => {
      const box = detection.boundingBox;
      const x   = box.xCenter * canvas.width  - (box.width  * canvas.width)  / 2;
      const y   = box.yCenter * canvas.height - (box.height * canvas.height) / 2;
      const w   = box.width   * canvas.width;
      const h   = box.height  * canvas.height;

      // Box color — 1 face: green, multiple: red
      ctx.strokeStyle = results.detections.length === 1 ? '#22C55E' : '#EF4444';
      ctx.lineWidth   = 2;
      ctx.strokeRect(x, y, w, h);

      // Label
      ctx.fillStyle = results.detections.length === 1 ? '#22C55E' : '#EF4444';
      ctx.font      = '14px sans-serif';
      ctx.fillText(`Face ${i + 1}`, x, y - 6);
    });
  }, [videoRef]);

  // Detection loop chalaao
  useEffect(() => {
    if (!isLoaded || !isActive || !detectionRef.current) return;

    const detect = async () => {
      const video = videoRef.current;
      if (video && video.readyState >= 2 && detectionRef.current) {
        try {
          await detectionRef.current.send({ image: video });
        } catch (e) {
          // Silent fail
        }
      }
      animFrameRef.current = requestAnimationFrame(detect);
    };

    animFrameRef.current = requestAnimationFrame(detect);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isLoaded, isActive, videoRef]);

  return { canvasRef, faceCount, isLoaded, detectionData };
}