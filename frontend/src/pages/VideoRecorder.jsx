import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function VideoRecorder() {
  const videoRef = useRef(null);
  const recorderRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      });
  }, []);

  const start = () => {
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      setChunks((prev) => [...prev, e.data]);
    };

    recorder.start();
    recorderRef.current = recorder;
    setRecording(true);
  };

  const stop = async () => {
    recorderRef.current.stop();
    setRecording(false);

    const blob = new Blob(chunks, { type: "video/webm" });

    const formData = new FormData();
    formData.append("video", blob, "interview.webm");

    const res = await axios.post(
      "http://localhost:5000/api/interview/upload-video",
      formData
    );

    console.log(res.data.videoUrl);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ width: 300 }} />

      {!recording ? (
        <button onClick={start}>Start Recording</button>
      ) : (
        <button onClick={stop}>Stop Upload</button>
      )}
    </div>
  );
}