import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// ✅ NEW COMPONENTS
import WebcamMonitor from '../components/WebcamMonitor';
import WarningAlert from '../components/WarningAlert';

export default function AssessmentTest() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [assessment, setAssessment] = useState(state?.assessment || null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ✅ WARNING SYSTEM
  const [warning, setWarning] = useState(null);
  const [isMinimized, setMinimized] = useState(false);
  const [warningCount, setWarningCount] = useState(0);

  const questions = assessment?.questions || [];

  // ==============================
  // LOAD ASSESSMENT
  // ==============================
  useEffect(() => {
    if (!assessment && id) {
      axios
        .get(`http://localhost:5000/api/assessments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setAssessment(res.data))
        .catch((err) => console.log('Load error:', err));
    }
  }, [assessment, id, token]);

  // ==============================
  // INIT ANSWERS
  // ==============================
  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(Array(questions.length).fill(''));
    }
  }, [questions]);

  // ==============================
  // TIMER
  // ==============================
  useEffect(() => {
    if (!assessment) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assessment]);

  // ==============================
  // WARNING HANDLER
  // ==============================
  const handleWarning = (w) => {
    setWarning(w);
    setWarningCount((c) => c + 1);
  };

  // ==============================
  // FORMAT TIME
  // ==============================
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ==============================
  // HANDLE ANSWER
  // ==============================
  const handleAnswer = (value) => {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);
  };

  // ==============================
  // SUBMIT
  // ==============================
  const handleSubmit = useCallback(async () => {
    if (!assessment) return;

    setSubmitting(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/assessments/submit',
        {
          assessmentId: assessment?._id,
          answers,
          timeTaken: 30 * 60 - timeLeft,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate('/assessment/result', { state: { result: res.data } });
    } catch (err) {
      console.log('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  }, [assessment, answers, timeLeft, token, navigate]);

  // ==============================
  // LOADING
  // ==============================
  if (!assessment) {
    return <div style={{ padding: '2rem' }}>Loading assessment...</div>;
  }

  const q = questions[current];
  const answered = answers.filter((a) => a !== '').length;
  const isMCQ = q?.type === 'MCQ';

  return (
    <div style={s.page}>

      {/* WARNING ALERT */}
      <WarningAlert
        warning={warning}
        onDismiss={() => setWarning(null)}
      />

      {/* WARNING COUNT */}
      {warningCount > 0 && (
        <div style={s.warningBadge}>
          ⚠️ {warningCount} warning{warningCount > 1 ? 's' : ''}
        </div>
      )}

      {/* TOP BAR */}
      <div style={s.topBar}>
        <div>Q {current + 1} / {questions.length}</div>

        <div style={{ color: timeLeft < 300 ? '#DC2626' : '#111' }}>
          ⏱ {formatTime(timeLeft)}
        </div>

        <div>✅ {answered}/{questions.length}</div>
      </div>

      {/* QUESTION */}
      <div style={s.card}>
        <h3>Q{current + 1}. {q?.question}</h3>

        {isMCQ ? (
          <div style={s.options}>
            {q?.options?.map((opt, i) => (
              <div
                key={i}
                onClick={() => handleAnswer(opt)}
                style={{
                  ...s.option,
                  ...(answers[current] === opt ? s.optionSelected : {}),
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        ) : (
          <textarea
            style={s.textarea}
            value={answers[current] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
          />
        )}
      </div>

      {/* NAV */}
      <div style={s.nav}>
        <button onClick={() => setCurrent((c) => c - 1)} disabled={current === 0}>
          Previous
        </button>

        <button onClick={() => setCurrent((c) => c + 1)} disabled={current === questions.length - 1}>
          Next
        </button>

        <button onClick={() => setShowConfirm(true)}>
          Submit
        </button>
      </div>

      {/* CONFIRM */}
      {showConfirm && (
        <div style={s.overlay}>
          <div style={s.dialog}>
            <h3>Submit Assessment?</h3>

            <button onClick={() => setShowConfirm(false)}>Cancel</button>
            <button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Confirm'}
            </button>
          </div>
        </div>
      )}

      {/* WEBCAM */}
      <WebcamMonitor
        assessmentId={assessment?._id}
        onWarning={handleWarning}
        isMinimized={isMinimized}
      />

      {/* MINIMIZE BUTTON */}
      <button
        onClick={() => setMinimized((m) => !m)}
        style={s.minimizeBtn}
      >
        {isMinimized ? '🔼 Expand' : '🔽 Minimize'}
      </button>

    </div>
  );
}

/* ================= STYLES ================= */
const s = {
  page: { padding: '1rem' },

  topBar: { display: 'flex', justifyContent: 'space-between' },

  card: { background: '#fff', padding: '1rem', margin: '10px 0' },

  options: { display: 'flex', flexDirection: 'column', gap: '8px' },

  option: {
    padding: '10px',
    border: '1px solid #ddd',
    cursor: 'pointer',
  },

  optionSelected: {
    background: '#dbeafe',
  },

  textarea: { width: '100%', padding: '10px' },

  nav: { display: 'flex', gap: '10px' },

  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dialog: {
    background: '#fff',
    padding: '20px',
  },

  warningBadge: {
    position: 'fixed',
    top: '16px',
    left: '16px',
    background: '#fee2e2',
    padding: '6px 12px',
    borderRadius: '8px',
  },

  minimizeBtn: {
    position: 'fixed',
    right: '16px',
    bottom: '200px',
  },
};