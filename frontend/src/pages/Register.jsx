import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'job_seeker',
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(form.name, form.email, form.password, form.role);
      setSuccess('Account ban gaya! Login karo.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    
// ✅ BAAD MEIN (sahi — model ke enum se match)
{ value: 'jobSeeker',   label: '🔍  Job Seeker',},
{ value: 'jobProvider', label: '🏢  Job Provider',},
{ value: 'admin',       label: '⚙️  Admin' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconBox}>✨</div>
          <h2 style={styles.title}>Create account</h2>
          <p style={styles.subtitle}>AI Recruitment Platform par join karein</p>
        </div>

        {/* Alerts */}
        {error   && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Name */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              name="name"
              placeholder="Zaid Ahmed"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* Email */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* Role Selection — Card Style */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>I am a...</label>
            <div style={styles.roleGrid}>
              {roles.map((r) => (
                <div
                  key={r.value}
                  onClick={() => setForm({ ...form, role: r.value })}
                  style={{
                    ...styles.roleCard,
                    ...(form.role === r.value ? styles.roleCardActive : {}),
                  }}
                >
                  <span style={styles.roleLabel}>{r.label}</span>
                  <span style={styles.roleDesc}>{r.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={styles.footer}>
          Pehle se account hai?{' '}
          <Link to="/login" style={styles.link}>Login karo</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f7fa',
    padding: '1.5rem 1rem',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '2rem 2.5rem',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '1.75rem',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    background: '#185FA5',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
    fontSize: '22px',
  },
  title: {
    margin: '0 0 4px',
    fontSize: '22px',
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
  },
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#DC2626',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    marginBottom: '1rem',
  },
  successBox: {
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
    color: '#16A34A',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#111827',
    background: '#fff',
  },
  // Role cards grid
  roleGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  roleCard: {
    padding: '10px 14px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    transition: 'all 0.15s',
    background: '#fafafa',
  },
  roleCardActive: {
    borderColor: '#185FA5',
    background: '#EFF6FF',
  },
  roleLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
  },
  roleDesc: {
    fontSize: '12px',
    color: '#6b7280',
  },
  button: {
    width: '100%',
    background: '#185FA5',
    color: 'white',
    border: 'none',
    padding: '11px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    marginTop: '6px',
    transition: 'background 0.2s',
  },
  footer: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '1.5rem',
    marginBottom: 0,
  },
  link: {
    color: '#185FA5',
    textDecoration: 'none',
    fontWeight: '500',
  },
};