// src/pages/PostJob.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function PostJob() {
  const { token } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    title: '', description: '', location: '',
    experience: 'fresher', jobType: 'full-time',
    salary: { min: '', max: '' },
    requiredSkills: [],
  });

  const [skillInput, setSkillInput] = useState('');
  const [message, setMessage]       = useState('');
  const [loading, setLoading]       = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSalary = (e) =>
    setForm({ ...form, salary: { ...form.salary, [e.target.name]: e.target.value } });

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !form.requiredSkills.includes(skill)) {
      setForm({ ...form, requiredSkills: [...form.requiredSkills, skill] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) =>
    setForm({ ...form, requiredSkills: form.requiredSkills.filter(s => s !== skill) });

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/jobs', form, { headers });
      setMessage('✅ Job post ho gayi!');
      setTimeout(() => navigate('/my-jobs'), 1500);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Error!'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>📝 Post a New Job</h2>

        {message && (
          <div style={{
            ...s.alert,
            background: message.startsWith('✅') ? '#F0FDF4' : '#FEF2F2',
            borderColor: message.startsWith('✅') ? '#BBF7D0' : '#FECACA',
            color: message.startsWith('✅') ? '#16A34A' : '#DC2626',
          }}>
            {message}
          </div>
        )}

        {/* Title */}
        <Field label="Job Title *">
          <input style={s.input} name="title" value={form.title}
            onChange={handleChange} placeholder="e.g. Frontend Developer" />
        </Field>

        {/* Description */}
        <Field label="Job Description *">
          <textarea style={{ ...s.input, height: '100px', resize: 'vertical' }}
            name="description" value={form.description}
            onChange={handleChange} placeholder="Job ki details likhein..." />
        </Field>

        {/* Location */}
        <Field label="Location *">
          <input style={s.input} name="location" value={form.location}
            onChange={handleChange} placeholder="e.g. Lahore, Remote" />
        </Field>

        {/* Experience + Job Type */}
        <div style={s.row}>
          <Field label="Experience Required">
            <select style={s.input} name="experience"
              value={form.experience} onChange={handleChange}>
              <option value="fresher">Fresher</option>
              <option value="1-2 years">1-2 Years</option>
              <option value="2-5 years">2-5 Years</option>
              <option value="5+ years">5+ Years</option>
            </select>
          </Field>
          <Field label="Job Type">
            <select style={s.input} name="jobType"
              value={form.jobType} onChange={handleChange}>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="remote">Remote</option>
              <option value="contract">Contract</option>
            </select>
          </Field>
        </div>

        {/* Salary */}
        <div style={s.row}>
          <Field label="Min Salary (PKR)">
            <input style={s.input} type="number" name="min"
              value={form.salary.min} onChange={handleSalary}
              placeholder="e.g. 50000" />
          </Field>
          <Field label="Max Salary (PKR)">
            <input style={s.input} type="number" name="max"
              value={form.salary.max} onChange={handleSalary}
              placeholder="e.g. 100000" />
          </Field>
        </div>

        {/* Skills */}
        <Field label="Required Skills">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input style={{ ...s.input, flex: 1 }} value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="Skill likhein aur Enter dabayein" />
            <button style={s.addBtn} onClick={addSkill}>Add</button>
          </div>
          <div style={s.chips}>
            {form.requiredSkills.map(skill => (
              <span key={skill} style={s.chip}>
                {skill}
                <span onClick={() => removeSkill(skill)} style={s.chipX}>×</span>
              </span>
            ))}
          </div>
        </Field>

        {/* Submit */}
        <button
          style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit} disabled={loading}>
          {loading ? 'Posting...' : '🚀 Post Job'}
        </button>
      </div>
    </div>
  );
}

// Helper
const Field = ({ label, children }) => (
  <div style={{ marginBottom: '14px' }}>
    <label style={{ display: 'block', fontSize: '13px',
      fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
      {label}
    </label>
    {children}
  </div>
);

const s = {
  page:      { minHeight: '100vh', background: '#f5f7fa', padding: '2rem 1rem' },
  card:      { background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
               padding: '2rem', maxWidth: '640px', margin: '0 auto',
               boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
  title:     { fontSize: '22px', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' },
  alert:     { border: '1px solid', borderRadius: '8px', padding: '10px 14px',
               fontSize: '14px', marginBottom: '1rem' },
  input:     { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db',
               borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box',
               outline: 'none', color: '#111827', background: '#fff' },
  row:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  chips:     { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  chip:      { background: '#EFF6FF', color: '#185FA5', border: '1px solid #BFDBFE',
               borderRadius: '20px', padding: '4px 12px', fontSize: '13px',
               display: 'flex', alignItems: 'center', gap: '6px' },
  chipX:     { cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', lineHeight: 1 },
  addBtn:    { background: 'transparent', border: '1px solid #185FA5',
               color: '#185FA5', padding: '9px 16px', borderRadius: '8px',
               cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' },
  submitBtn: { width: '100%', background: '#185FA5', color: 'white', border: 'none',
               padding: '12px', borderRadius: '8px', fontSize: '15px',
               fontWeight: '500', cursor: 'pointer', marginTop: '8px' },
};