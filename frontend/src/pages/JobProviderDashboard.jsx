// src/pages/JobProviderDashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';

export default function JobProviderDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [jobs,    setJobs]    = useState([]);
  const [tab,     setTab]     = useState('myJobs');
  const [loading, setLoading] = useState(true);
  const [stats,   setStats]   = useState({
    totalJobs: 0, activeJobs: 0, closedJobs: 0, totalCandidates: 0,
  });

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/jobs/provider/my-jobs',
        { headers }
      );
      const jobsList = res.data.jobs || [];
      setJobs(jobsList);

      setStats({
        totalJobs:      jobsList.length,
        activeJobs:     jobsList.filter(j => j.isActive).length,
        closedJobs:     jobsList.filter(j => !j.isActive).length,
        totalCandidates: 0, // future feature
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleJobStatus = async (jobId, current) => {
    try {
      await axios.put(
        `http://localhost:5000/api/jobs/${jobId}`,
        { isActive: !current },
        { headers }
      );
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Job delete karna chahte hain?')) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/jobs/${jobId}`,
        { headers }
      );
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const jobTypeColor = {
    'full-time': { bg: '#EFF6FF', color: '#2563EB' },
    'part-time': { bg: '#F0FDF4', color: '#16A34A' },
    'remote':    { bg: '#FEF3C7', color: '#D97706' },
    'contract':  { bg: '#F5F3FF', color: '#7C3AED' },
  };

  return (
    <div style={s.page}>

      {/* ── NAVBAR ─────────────────────────────── */}
      <nav style={s.navbar}>
        <div style={s.navBrand}>
          <div style={s.navLogo}>A</div>
          <span style={s.navTitle}>AI Recruitment</span>
        </div>

        <div style={s.navLinks}>
          <Link to="/dashboard" style={s.navLink}>Dashboard</Link>
          <Link to="/post-job"  style={s.navLink}>Post Job</Link>
        </div>

        <div style={s.navRight}>
          <NotificationBell />
          <div style={s.navUser}>
            <div style={s.userAvatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span style={s.userName}>{user?.name}</span>
          </div>
        </div>
      </nav>

      {/* ── CONTENT ────────────────────────────── */}
      <div style={s.container}>

        {/* ── HERO CARD ──────────────────────────── */}
        <div style={s.heroCard}>
          <div style={s.heroLeft}>
            <div style={s.companyIcon}>🏢</div>
            <div>
              <h2 style={s.heroTitle}>My Company</h2>
              <p style={s.heroSub}>Add industry.</p>
              <p style={s.heroEmail}>{user?.name}</p>
            </div>
          </div>
          <Link to="/post-job" style={s.postBtn}>
            + Post a Job
          </Link>
        </div>

        {/* ── STATS ROW ──────────────────────────── */}
        <div style={s.statsRow}>
          {[
            { value: stats.totalJobs,      label: 'Total Jobs',       color: '#2563EB' },
            { value: stats.activeJobs,     label: 'Active Jobs',      color: '#16A34A' },
            { value: stats.closedJobs,     label: 'Closed Jobs',      color: '#DC2626' },
            { value: stats.totalCandidates,label: 'Total Candidates', color: '#7C3AED' },
          ].map((stat, i) => (
            <div key={i} style={s.statCard}>
              <span style={{ ...s.statVal, color: stat.color }}>
                {stat.value}
              </span>
              <span style={s.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* ── TABS ───────────────────────────────── */}
        <div style={s.tabs}>
          <button
            onClick={() => setTab('myJobs')}
            style={{ ...s.tab, ...(tab === 'myJobs' ? s.tabActive : {}) }}>
            💼 My Jobs
          </button>
          <button
            onClick={() => setTab('companyProfile')}
            style={{ ...s.tab, ...(tab === 'companyProfile' ? s.tabActive : {}) }}>
            🏢 Company Profile
          </button>
        </div>

        {/* ── MY JOBS TAB ────────────────────────── */}
        {tab === 'myJobs' && (
          <div style={s.card}>
            <div style={s.cardHeader}>
              <h3 style={s.cardTitle}>Posted Jobs</h3>
              <Link to="/post-job" style={s.newJobBtn}>+ New Job</Link>
            </div>

            {loading ? (
              <div style={s.emptyState}>
                <p style={{ color: '#9ca3af' }}>Loading...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div style={s.emptyState}>
                <span style={{ fontSize: '48px' }}>💼</span>
                <p style={s.emptyText}>No job has been posted yet.</p>
                <Link to="/post-job" style={s.emptyBtn}>
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <div style={s.jobsList}>
                {/* Table Header */}
                <div style={s.tableHeader}>
                  <span style={{ flex: 2 }}>Job Title</span>
                  <span style={{ flex: 1 }}>Location</span>
                  <span style={{ flex: 1 }}>Type</span>
                  <span style={{ flex: 1 }}>Status</span>
                  <span style={{ flex: 1 }}>Posted</span>
                  <span style={{ flex: 1 }}>Actions</span>
                </div>

                {jobs.map(job => {
                  const tc = jobTypeColor[job.jobType] || jobTypeColor['full-time'];
                  return (
                    <div key={job._id} style={s.jobRow}>
                      <div style={{ flex: 2 }}>
                        <p style={s.jobTitle}>{job.title}</p>
                        <p style={s.jobSkills}>
                          {job.requiredSkills?.slice(0, 3).join(', ')}
                        </p>
                      </div>
                      <span style={{ flex: 1, fontSize: '13px', color: '#6b7280' }}>
                        📍 {job.location}
                      </span>
                      <span style={{ flex: 1 }}>
                        <span style={{
                          ...s.typeBadge,
                          background: tc.bg,
                          color: tc.color,
                        }}>
                          {job.jobType}
                        </span>
                      </span>
                      <span style={{ flex: 1 }}>
                        <span style={{
                          ...s.statusBadge,
                          background: job.isActive ? '#F0FDF4' : '#FEF2F2',
                          color: job.isActive ? '#16A34A' : '#DC2626',
                        }}>
                          {job.isActive ? '✅ Active' : '🔴 Closed'}
                        </span>
                      </span>
                      <span style={{ flex: 1, fontSize: '12px', color: '#9ca3af' }}>
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <div style={{ flex: 1, display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => toggleJobStatus(job._id, job.isActive)}
                          style={s.actionBtn}>
                          {job.isActive ? 'Close' : 'Open'}
                        </button>
                        <button
                          onClick={() => deleteJob(job._id)}
                          style={s.deleteBtn}>
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── COMPANY PROFILE TAB ────────────────── */}
        {tab === 'companyProfile' && (
          <div style={s.card}>
            <h3 style={s.cardTitle}>Company Profile</h3>
            <div style={s.profileForm}>
              {[
                { label: 'Company Name', placeholder: user?.name },
                { label: 'Industry',     placeholder: 'e.g. Technology' },
                { label: 'Location',     placeholder: 'e.g. Lahore, Pakistan' },
                { label: 'Website',      placeholder: 'https://company.com' },
              ].map(field => (
                <div key={field.label} style={s.formField}>
                  <label style={s.fieldLabel}>{field.label}</label>
                  <input style={s.fieldInput}
                    placeholder={field.placeholder} />
                </div>
              ))}
              <div style={s.formField}>
                <label style={s.fieldLabel}>About Company</label>
                <textarea style={{ ...s.fieldInput, height: '80px', resize: 'vertical' }}
                  placeholder="Company ke baare mein likhein..." />
              </div>
              <button style={s.saveBtn}>💾 Save Profile</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────
const s = {
  page:        { minHeight: '100vh', background: '#f1f5f9',
                 fontFamily: 'Segoe UI, sans-serif' },

  // Navbar
  navbar:      { display: 'flex', alignItems: 'center',
                 justifyContent: 'space-between', background: '#2563EB',
                 padding: '0 2rem', height: '56px',
                 position: 'sticky', top: 0, zIndex: 100 },
  navBrand:    { display: 'flex', alignItems: 'center', gap: '10px' },
  navLogo:     { width: '32px', height: '32px', borderRadius: '8px',
                 background: '#fff', color: '#2563EB', display: 'flex',
                 alignItems: 'center', justifyContent: 'center',
                 fontWeight: '700', fontSize: '16px' },
  navTitle:    { color: '#fff', fontWeight: '700', fontSize: '16px' },
  navLinks:    { display: 'flex', gap: '4px' },
  navLink:     { color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
                 padding: '6px 14px', borderRadius: '6px', fontSize: '14px' },
  navRight:    { display: 'flex', alignItems: 'center', gap: '12px' },
  navUser:     { display: 'flex', alignItems: 'center', gap: '8px' },
  userAvatar:  { width: '30px', height: '30px', borderRadius: '50%',
                 background: 'rgba(255,255,255,0.25)', color: '#fff',
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                 fontSize: '13px', fontWeight: '600' },
  userName:    { color: '#fff', fontSize: '14px' },

  // Layout
  container:   { padding: '1.5rem 2rem',
                 maxWidth: '900px', margin: '0 auto' },

  // Hero
  heroCard:    { background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                 borderRadius: '16px', padding: '1.5rem 2rem',
                 marginBottom: '1.25rem', display: 'flex',
                 justifyContent: 'space-between', alignItems: 'center' },
  heroLeft:    { display: 'flex', alignItems: 'center', gap: '16px' },
  companyIcon: { fontSize: '40px', background: 'rgba(255,255,255,0.2)',
                 borderRadius: '12px', padding: '8px', lineHeight: 1 },
  heroTitle:   { margin: '0 0 4px', fontSize: '20px',
                 fontWeight: '700', color: '#fff' },
  heroSub:     { margin: '0 0 2px', fontSize: '13px',
                 color: 'rgba(255,255,255,0.7)' },
  heroEmail:   { margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)' },
  postBtn:     { background: '#fff', color: '#4F46E5', borderRadius: '8px',
                 padding: '10px 18px', textDecoration: 'none',
                 fontSize: '14px', fontWeight: '600',
                 whiteSpace: 'nowrap' },

  // Stats
  statsRow:    { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
                 gap: '12px', marginBottom: '1.25rem' },
  statCard:    { background: '#fff', borderRadius: '12px',
                 padding: '16px 20px', display: 'flex',
                 flexDirection: 'column', gap: '4px',
                 border: '1px solid #e5e7eb' },
  statVal:     { fontSize: '28px', fontWeight: '700' },
  statLabel:   { fontSize: '12px', color: '#6b7280' },

  // Tabs
  tabs:        { display: 'flex', gap: '4px', marginBottom: '16px',
                 background: '#fff', borderRadius: '10px', padding: '4px',
                 border: '1px solid #e5e7eb', width: 'fit-content' },
  tab:         { padding: '8px 18px', border: 'none', borderRadius: '8px',
                 cursor: 'pointer', fontSize: '14px',
                 background: 'transparent', color: '#6b7280' },
  tabActive:   { background: '#2563EB', color: '#fff', fontWeight: '500' },

  // Card
  card:        { background: '#fff', borderRadius: '12px',
                 border: '1px solid #e5e7eb', padding: '1.5rem' },
  cardHeader:  { display: 'flex', justifyContent: 'space-between',
                 alignItems: 'center', marginBottom: '16px' },
  cardTitle:   { fontSize: '16px', fontWeight: '600',
                 color: '#111827', margin: 0 },
  newJobBtn:   { background: '#2563EB', color: '#fff', borderRadius: '8px',
                 padding: '8px 16px', textDecoration: 'none',
                 fontSize: '13px', fontWeight: '500' },

  // Empty State
  emptyState:  { display: 'flex', flexDirection: 'column',
                 alignItems: 'center', padding: '3rem', gap: '10px' },
  emptyText:   { color: '#9ca3af', fontSize: '14px', margin: 0 },
  emptyBtn:    { background: '#2563EB', color: '#fff', borderRadius: '8px',
                 padding: '10px 20px', textDecoration: 'none',
                 fontSize: '14px', fontWeight: '500' },

  // Jobs Table
  jobsList:    { display: 'flex', flexDirection: 'column', gap: '0' },
  tableHeader: { display: 'flex', padding: '10px 12px',
                 background: '#f9fafb', borderRadius: '8px',
                 fontSize: '12px', fontWeight: '600',
                 color: '#6b7280', marginBottom: '4px' },
  jobRow:      { display: 'flex', alignItems: 'center',
                 padding: '12px', borderBottom: '1px solid #f3f4f6',
                 gap: '8px' },
  jobTitle:    { margin: '0 0 2px', fontSize: '14px',
                 fontWeight: '500', color: '#111827' },
  jobSkills:   { margin: 0, fontSize: '11px', color: '#9ca3af' },
  typeBadge:   { padding: '2px 8px', borderRadius: '20px',
                 fontSize: '11px', fontWeight: '500' },
  statusBadge: { padding: '2px 8px', borderRadius: '20px',
                 fontSize: '11px', fontWeight: '500' },
  actionBtn:   { background: '#EFF6FF', color: '#2563EB',
                 border: '1px solid #BFDBFE', borderRadius: '6px',
                 padding: '4px 10px', cursor: 'pointer', fontSize: '12px' },
  deleteBtn:   { background: '#FEF2F2', color: '#DC2626',
                 border: '1px solid #FECACA', borderRadius: '6px',
                 padding: '4px 8px', cursor: 'pointer', fontSize: '12px' },

  // Company Profile Form
  profileForm: { display: 'flex', flexDirection: 'column', gap: '14px',
                 maxWidth: '500px' },
  formField:   { display: 'flex', flexDirection: 'column', gap: '6px' },
  fieldLabel:  { fontSize: '13px', fontWeight: '500', color: '#374151' },
  fieldInput:  { padding: '9px 12px', border: '1px solid #d1d5db',
                 borderRadius: '8px', fontSize: '14px',
                 outline: 'none', color: '#111827' },
  saveBtn:     { background: '#2563EB', color: '#fff', border: 'none',
                 padding: '10px 20px', borderRadius: '8px',
                 cursor: 'pointer', fontSize: '14px',
                 fontWeight: '500', alignSelf: 'flex-start' },
};