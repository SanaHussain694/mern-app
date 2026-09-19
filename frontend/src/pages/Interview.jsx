import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Interview() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const [loading, setLoading] = useState(false);

  // ================= START INTERVIEW =================
  const startInterview = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/interviews/start",
        {
          userId: user._id,
          domain: "technical",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setInterview(res.data);
      setCurrent(0);
      setAnswer("");
      setTimeLeft(180);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= TIMER =================
  useEffect(() => {
    if (!interview) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleNext();
          return 180;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [interview, current]);

  // ================= SAVE ANSWER =================
  const saveAnswer = async (index, value) => {
    try {
      await axios.post(
        "http://localhost:5000/api/interviews/answer",
        {
          interviewId: interview._id,
          index,
          answer: value,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ================= NEXT =================
  const handleNext = async () => {
    if (!interview) return;

    const updated = [...interview.questions];
    updated[current].answer = answer;

    await saveAnswer(current, answer);

    setAnswer("");

    if (current + 1 < interview.questions.length) {
      setCurrent(current + 1);
      setTimeLeft(180);
    } else {
      handleComplete();
    }
  };

  // ================= COMPLETE =================
  const handleComplete = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/interviews/complete",
        { interviewId: interview._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  // ================= UI =================
  if (!interview) {
    return (
      <div style={{ padding: 20 }}>
        <h2>AI Interview</h2>
        <button onClick={startInterview} disabled={loading}>
          {loading ? "Starting..." : "Start Interview"}
        </button>
      </div>
    );
  }

  const question = interview.questions[current];

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "auto" }}>
      <h2>AI Interview Session</h2>

      <div style={{ fontWeight: "bold", marginBottom: 10 }}>
        ⏱ {timeLeft}s
      </div>

      <div style={{ padding: 15, border: "1px solid #ddd", borderRadius: 10 }}>
        <h3>Q{current + 1}: {question?.question}</h3>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          style={{ width: "100%", height: 120, marginTop: 10 }}
        />
      </div>

      <button onClick={handleNext} style={{ marginTop: 10 }}>
        {current + 1 === interview.questions.length ? "Finish" : "Next"}
      </button>
    </div>
  );
}