// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProfilePage() {
  const { user, token } = useAuth();

  const [form, setForm] = useState({
    phone: '', city: '', bio: '', skills: [],
    education: [], experience: [],
  });

  const [skillInput, setSkillInput] = useState('');
  const [cvFile, setCvFile]         = useState(null);
  const [message, setMessage]       = useState('');
  const [loading, setLoading]       = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  // Profile fetch
  useEffect(() => {
    axios.get(`${API}/api/profile/${user.id}`, { headers })
      .then(res => {
        const { phone, city, bio, skills, education, experience } = res.data.profile;
        // ✅ Only pick known fields — never store _id, user, __v etc in form state
        setForm({
          phone:      phone      || '',
          city:       city       || '',
          bio:        bio        || '',
          skills:     skills     || [],
          education:  education  || [],
          experience: experience || [],
        });
      })
      .catch(() => {}); // no profile yet — keep empty form
  }, []);

  // Skill add
  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  // Skill remove
  const removeSkill = (skill) =>
    setForm({ ...form, skills: form.skills.filter(s => s !== skill) });

  // Education helpers
  const addEducation = () =>
    setForm({ ...form, education: [...form.education, { degree: '', institute: '', year: '' }] });

  const updateEducation = (i, field, value) => {
    const updated = [...form.education];
    updated[i][field] = value;
    setForm({ ...form, education: updated });
  };

  const removeEducation = (i) =>
    setForm({ ...form, education: form.education.filter((_, idx) => idx !== i) });

  // Experience helpers
  const addExperience = () =>
    setForm({ ...form, experience: [...form.experience, { title: '', company: '', duration: '', desc: '' }] });

  const updateExperience = (i, field, value) => {
    const updated = [...form.experience];
    updated[i][field] = value;
    setForm({ ...form, experience: updated });
  };

  const removeExperience = (i) =>
    setForm({ ...form, experience: form.experience.filter((_, idx) => idx !== i) });

  // ✅ Profile save — only send allowed fields, never the whole form object
  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        phone:      form.phone,
        city:       form.city,
        bio:        form.bio,
        skills:     form.skills,
        education:  form.education,
        experience: form.experience,
      };
      await axios.put(`${API}/api/profile/${user.id}`, payload, { headers });
      setMessage('✅ Profile save ho gayi!');
    } catch (err) {
      setMessage('❌ Error: ' + err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // CV upload
  const handleCVUpload = async () => {
    if (!cvFile) return;
    const formData = new FormData();
    formData.append('cv', cvFile);
    try {
      await axios.post(`${API}/api/profile/upload-cv`, formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      });
      setMessage('✅ CV upload ho gaya!');
    } catch (err) {
      setMessage('❌ CV Error: ' + err.response?.data?.message);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>My Profile</h2>

        {message && (
          <div style={{
            ...s.alert,
            background:   message.startsWith('✅') ? '#F0FDF4' : '#FEF2F2',
            borderColor:  message.startsWith('✅') ? '#BBF7D0' : '#FECACA',
            color:        message.startsWith('✅') ? '#16A34A' : '#DC2626',
          }}>
            {message}
          </div>
        )}

        {/* Basic Info */}
        <Section title="Basic Info">
          <Row>
            <Field label="Phone">
              <input style={s.input} value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+92 300 1234567" />
            </Field>
            <Field label="City">
              <input style={s.input} value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                placeholder="Lahore" />
            </Field>
          </Row>
          <Field label="Bio">
            <textarea style={{ ...s.input, height: '80px', resize: 'vertical' }}
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              placeholder="Apne baare mein likhein..." />
          </Field>
        </Section>

        {/* Skills */}
        <Section title="Skills">
          <div style={s.skillRow}>
            <input style={{ ...s.input, flex: 1 }} value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="Skill likhein aur Enter dabayein" />
            <button style={s.addBtn} onClick={addSkill}>Add</button>
          </div>
          <div style={s.chips}>
            {form.skills.map(skill => (
              <span key={skill} style={s.chip}>
                {skill}
                <span onClick={() => removeSkill(skill)} style={s.chipX}>×</span>
              </span>
            ))}
          </div>
        </Section>

        {/* Education */}
        <Section title="Education">
          {form.education.map((edu, i) => (
            <div key={i} style={s.entryCard}>
              <Row>
                <Field label="Degree">
                  <input style={s.input} value={edu.degree}
                    onChange={e => updateEducation(i, 'degree', e.target.value)}
                    placeholder="BS Computer Science" />
                </Field>
                <Field label="Institute">
                  <input style={s.input} value={edu.institute}
                    onChange={e => updateEducation(i, 'institute', e.target.value)}
                    placeholder="FAST University" />
                </Field>
                <Field label="Year">
                  <input style={s.input} value={edu.year}
                    onChange={e => updateEducation(i, 'year', e.target.value)}
                    placeholder="2020-2024" />
                </Field>
              </Row>
              <button style={s.removeBtn} onClick={() => removeEducation(i)}>Remove</button>
            </div>
          ))}
          <button style={s.addBtn} onClick={addEducation}>+ Add Education</button>
        </Section>

        {/* Experience */}
        <Section title="Experience">
          {form.experience.map((exp, i) => (
            <div key={i} style={s.entryCard}>
              <Row>
                <Field label="Job Title">
                  <input style={s.input} value={exp.title}
                    onChange={e => updateExperience(i, 'title', e.target.value)}
                    placeholder="Frontend Developer" />
                </Field>
                <Field label="Company">
                  <input style={s.input} value={exp.company}
                    onChange={e => updateExperience(i, 'company', e.target.value)}
                    placeholder="ABC Pvt Ltd" />
                </Field>
              </Row>
              <Field label="Duration">
                <input style={s.input} value={exp.duration}
                  onChange={e => updateExperience(i, 'duration', e.target.value)}
                  placeholder="Jan 2022 - Dec 2023" />
              </Field>
              <Field label="Description">
                <textarea style={{ ...s.input, height: '60px' }} value={exp.desc}
                  onChange={e => updateExperience(i, 'desc', e.target.value)}
                  placeholder="Kaam ka description..." />
              </Field>
              <button style={s.removeBtn} onClick={() => removeExperience(i)}>Remove</button>
            </div>
          ))}
          <button style={s.addBtn} onClick={addExperience}>+ Add Experience</button>
        </Section>

        {/* CV Upload */}
        <Section title="Upload CV">
          <div style={s.cvRow}>
            <input type="file" accept=".pdf,.doc,.docx"
              onChange={e => setCvFile(e.target.files[0])} style={s.fileInput} />
            <button style={s.saveBtn} onClick={handleCVUpload}>Upload CV</button>
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
            PDF ya DOCX — max 5MB
          </p>
        </Section>

        {/* Save Button */}
        <button
          style={{ ...s.saveBtn, width: '100%', marginTop: '8px', opacity: loading ? 0.7 : 1 }}
          onClick={handleSave}
          disabled={loading}>
          {loading ? 'Saving...' : '💾 Save Profile'}
        </button>
      </div>
    </div>
  );
}

// ─── Helper Components ───────────────────────────────────
const Section = ({ title, children }) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <h3 style={{
      fontSize: '15px', fontWeight: '600', color: '#374151',
      borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px',
    }}>{title}</h3>
    {children}
  </div>
);

const Row = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
    <label style={{ fontSize: '12px', fontWeight: '500', color: '#6b7280' }}>{label}</label>
    {children}
  </div>
);

// ─── Styles ──────────────────────────────────────────────
const s = {
  page:      { minHeight: '100vh', background: '#f5f7fa', padding: '2rem 1rem' },
  card:      { background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
               padding: '2rem', maxWidth: '720px', margin: '0 auto',
               boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
  title:     { fontSize: '22px', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' },
  alert:     { border: '1px solid', borderRadius: '8px', padding: '10px 14px',
               fontSize: '14px', marginBottom: '1rem' },
  input:     { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db',
               borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box',
               outline: 'none', color: '#111827' },
  skillRow:  { display: 'flex', gap: '8px', marginBottom: '10px' },
  chips:     { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  chip:      { background: '#EFF6FF', color: '#185FA5', border: '1px solid #BFDBFE',
               borderRadius: '20px', padding: '4px 12px', fontSize: '13px',
               display: 'flex', alignItems: 'center', gap: '6px' },
  chipX:     { cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', lineHeight: 1 },
  entryCard: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px',
               padding: '12px', marginBottom: '10px', display: 'flex',
               flexDirection: 'column', gap: '10px' },
  addBtn:    { background: 'transparent', border: '1px solid #185FA5', color: '#185FA5',
               padding: '7px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  removeBtn: { background: 'transparent', border: '1px solid #DC2626', color: '#DC2626',
               padding: '5px 12px', borderRadius: '6px', cursor: 'pointer',
               fontSize: '13px', alignSelf: 'flex-start' },
  saveBtn:   { background: '#185FA5', color: 'white', border: 'none',
               padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
               fontSize: '15px', fontWeight: '500' },
  cvRow:     { display: 'flex', gap: '12px', alignItems: 'center' },
  fileInput: { flex: 1, padding: '8px', border: '1px solid #d1d5db',
               borderRadius: '8px', fontSize: '14px' },
};
