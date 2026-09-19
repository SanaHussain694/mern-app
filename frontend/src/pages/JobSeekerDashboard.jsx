// src/pages/JobSeekerDashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';

export default function JobSeekerDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [jobs,        setJobs]        = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [interviews,  setInterviews]  = useState([]);
  const [profile,     setProfile]     = useState(null);
  const [search,      setSearch]      = useState('');
  const [stats,       setStats]       = useState({
    availableJobs: 0, assessmentsDone: 0,
    interviewsDone: 0, avgScore: 0,
  });

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [jobsRes, assessRes, interviewRes, profileRes] = await Promise.all([
        axios.get('http://localhost:5000/api/jobs', { headers }),
        axios.get('http://localhost:5000/api/assessments/my', { headers }),
        axios.get('http://localhost:5000/api/interviews/my', { headers }),
        axios.get(`http://localhost:5000/api/profile/${user.id}`, { headers }),
      ]);

      const jobsList        = jobsRes.data.jobs           || [];
      const assessmentsList = assessRes.data.assessments  || [];
      const interviewsList  = interviewRes.data.interviews || [];

      setJobs(jobsList);
      setAssessments(assessmentsList);
      setInterviews(interviewsList);
      setProfile(profileRes.data.profile);

      const avgScore = assessmentsList.length
        ? Math.round(
            assessmentsList.reduce((s, a) => s + (a.score || 0), 0)
            / assessmentsList.length / 15 * 100
          )
        : 0;

      setStats({
        availableJobs:   jobsList.length,
        assessmentsDone: assessmentsList.length,
        interviewsDone:  interviewsList.length,
        avgScore,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.requiredSkills?.some(s =>
      s.toLowerCase().includes(search.toLowerCase())
    )
  );

  const isProfileComplete =
    profile?.phone && profile?.skills?.length > 0;

  return (
    <div style={s.page}>

      {/* ── NAVBAR ─────────────────────────────── */}
      <nav style={s.navbar}>
        <div style={s.navBrand}>
          <div style={s.navLogo}>A</div>
          <span style={s.navTitle}>AI Recruitment</span>
        </div>

        <div style={s.navLinks}>
          {[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Profile',   link: '/profile'   },
            { label: 'Assessment',link: '/assessment' },
            { label: 'Interview', link: '/interview'  },
          ].map(item => (
            <Link key={item.label} to={item.link} style={s.navLink}>
              {item.label}
            </Link>
          ))}
        </div>

        <div style={s.navRight}>
          <NotificationBell />
          <div style={s.navUser}>
            <div style={s.userAvatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span style={s.userName}>{user?.name}</span>
          </div>
          <button style={s.logoutBtn}
            onClick={() => { logout(); navigate('/login'); }}>
            Logout
          </button>
        </div>
      </nav>

      {/* ── CONTENT ────────────────────────────── */}
      <div style={s.container}>

        {/* Hero Card */}
        <div style={s.heroCard}>
          <div style={s.heroLeft}>
            <h2 style={s.heroTitle}>Hello, {user?.name}! 👋</h2>
            <p style={s.heroSub}>Find your dream job today</p>
            {!isProfileComplete && (
              <div style={s.warningBox}>
                ⚠️ Your profile is incomplete!{' '}
                <Link to="/profile" style={s.warningLink}>
                  Complete it now.
                </Link>
              </div>
            )}
          </div>
          <div style={s.heroAvatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Stats Row */}
        <div style={s.statsRow}>
          {[
            { value: stats.availableJobs,   label: 'Available Jobs',   color: '#3B82F6' },
            { value: stats.assessmentsDone, label: 'Assessments Done', color: '#3B82F6' },
            { value: stats.interviewsDone,  label: 'Interviews Done',  color: '#3B82F6' },
            { value: `${stats.avgScore}%`,  label: 'Avg Score',        color: '#F59E0B' },
          ].map((stat, i) => (
            <div key={i} style={s.statCard}>
              <span style={{ ...s.statVal, color: stat.color }}>{stat.value}</span>
              <span style={s.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={s.actionsRow}>
          {[
            { icon: '👤', label: 'Profile Update', link: '/profile'    },
            { icon: '🧠', label: 'Skill Test',     link: '/assessment' },
            { icon: '🎤', label: 'Interview',      link: '/interview'  },
            { icon: '📄', label: 'CV Upload',      link: '/profile'    },
          ].map(action => (
            <Link key={action.label} to={action.link} style={s.actionCard}>
              <span style={s.actionIcon}>{action.icon}</span>
              <span style={s.actionLabel}>{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Bottom Grid */}
        <div style={s.bottomGrid}>

          {/* Available Jobs */}
          <div style={s.jobsCard}>
            <h3 style={s.sectionTitle}>Available Jobs</h3>
            <div style={s.searchBox}>
              <span>🔍</span>
              <input style={s.searchInput}
                placeholder="Search for a job or a skill..."
                value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>

            {filteredJobs.length === 0 ? (
              <div style={s.emptyState}>
                <span style={{ fontSize: '36px' }}>🔍</span>
                <p style={{ color: '#9ca3af', margin: '8px 0 0' }}>
                  No jobs found.
                </p>
              </div>
            ) : (
              <div style={s.jobsList}>
                {filteredJobs.slice(0, 5).map(job => (
                  <div key={job._id} style={s.jobItem}>
                    <div style={s.jobIcon}>
                      {job.postedBy?.name?.charAt(0) || '🏢'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={s.jobTitle}>{job.title}</p>
                      <p style={s.jobMeta}>
                        📍 {job.location} · {job.jobType}
                      </p>
                    </div>
                    <Link to="/jobs" style={s.applyBtn}>Apply</Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={s.rightCol}>

            {/* Recent Tests */}
            <div style={s.miniCard}>
              <div style={s.miniHeader}>
                <h3 style={s.sectionTitle}>Recent Tests</h3>
                <Link to="/assessment" style={s.miniLink}>
                  Take a new test
                </Link>
              </div>
              {assessments.length === 0 ? (
                <div style={s.emptyState}>
                  <span style={{ fontSize: '28px' }}>📋</span>
                  <p style={s.emptyText}>No tests taken yet.</p>
                  <Link to="/assessment" style={s.emptyLink}>
                    Take your first test.
                  </Link>
                </div>
              ) : (
                assessments.slice(0, 3).map((a, i) => (
                  <div key={i} style={s.testItem}>
                    <span style={s.testDomain}>{a.domain}</span>
                    <span style={{
                      ...s.testScore,
                      color: a.score >= 10 ? '#16A34A' :
                             a.score >= 6  ? '#D97706' : '#DC2626',
                    }}>
                      {a.score}/15
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Interviews */}
            <div style={s.miniCard}>
              <div style={s.miniHeader}>
                <h3 style={s.sectionTitle}>Interviews</h3>
                <Link to="/interview" style={s.miniLink}>
                  Give a new interview
                </Link>
              </div>
              {interviews.length === 0 ? (
                <div style={s.emptyState}>
                  <span style={{ fontSize: '28px' }}>🎤</span>
                  <p style={s.emptyText}>
                    You haven't taken any interviews yet.
                  </p>
                  <Link to="/interview" style={s.emptyLink}>
                    Give your first interview.
                  </Link>
                </div>
              ) : (
                interviews.slice(0, 3).map((iv, i) => (
                  <div key={i} style={s.testItem}>
                    <span style={s.testDomain}>{iv.domain}</span>
                    <span style={{ fontSize: '12px', color: '#16A34A' }}>
                      ✅ {iv.status}
                    </span>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────
const s = {
  page:       { minHeight: '100vh', background: '#f1f5f9',
                fontFamily: 'Segoe UI, sans-serif' },

  // Navbar
  navbar:     { display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', background: '#2563EB',
                padding: '0 2rem', height: '56px',
                position: 'sticky', top: 0, zIndex: 100 },
  navBrand:   { display: 'flex', alignItems: 'center', gap: '10px' },
  navLogo:    { width: '32px', height: '32px', borderRadius: '8px',
                background: '#fff', color: '#2563EB', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontWeight: '700', fontSize: '16px' },
  navTitle:   { color: '#fff', fontWeight: '700', fontSize: '16px' },
  navLinks:   { display: 'flex', gap: '4px' },
  navLink:    { color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
                padding: '6px 14px', borderRadius: '6px', fontSize: '14px' },
  navRight:   { display: 'flex', alignItems: 'center', gap: '12px' },
  navUser:    { display: 'flex', alignItems: 'center', gap: '8px' },
  userAvatar: { width: '30px', height: '30px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)', color: '#fff',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '13px', fontWeight: '600' },
  userName:   { color: '#fff', fontSize: '14px' },
  logoutBtn:  { background: 'rgba(255,255,255,0.15)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '6px 14px', borderRadius: '8px',
                cursor: 'pointer', fontSize: '13px' },

  // Layout
  container:  { padding: '1.5rem 2rem', maxWidth: '1200px', margin: '0 auto' },

  // Hero
  heroCard:   { background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                borderRadius: '16px', padding: '1.5rem 2rem',
                marginBottom: '1.25rem', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center',
                color: '#fff' },
  heroLeft:   { flex: 1 },
  heroTitle:  { margin: '0 0 4px', fontSize: '22px', fontWeight: '700' },
  heroSub:    { margin: '0 0 14px', fontSize: '14px', opacity: 0.85 },
  heroAvatar: { width: '52px', height: '52px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)', color: '#fff',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '22px',
                fontWeight: '700', flexShrink: 0 },
  warningBox: { background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px', padding: '8px 14px',
                fontSize: '13px', display: 'inline-block' },
  warningLink:{ color: '#FDE68A', fontWeight: '600', textDecoration: 'underline' },

  // Stats
  statsRow:   { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
                gap: '12px', marginBottom: '1.25rem' },
  statCard:   { background: '#fff', borderRadius: '12px',
                padding: '16px 20px', display: 'flex',
                flexDirection: 'column', gap: '4px',
                border: '1px solid #e5e7eb' },
  statVal:    { fontSize: '28px', fontWeight: '700' },
  statLabel:  { fontSize: '12px', color: '#6b7280' },

  // Actions
  actionsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
                gap: '12px', marginBottom: '1.25rem' },
  actionCard: { background: '#fff', borderRadius: '12px', padding: '20px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '10px',
                textDecoration: 'none', border: '1px solid #e5e7eb' },
  actionIcon: { fontSize: '28px' },
  actionLabel:{ fontSize: '13px', fontWeight: '500', color: '#374151' },

  // Bottom
  bottomGrid: { display: 'grid',
                gridTemplateColumns: '1fr 360px', gap: '16px' },
  jobsCard:   { background: '#fff', borderRadius: '12px',
                padding: '1.25rem', border: '1px solid #e5e7eb' },
  sectionTitle:{ fontSize: '15px', fontWeight: '600',
                 color: '#111827', margin: '0 0 12px' },
  searchBox:  { display: 'flex', alignItems: 'center', gap: '8px',
                background: '#f9fafb', border: '1px solid #e5e7eb',
                borderRadius: '8px', padding: '8px 12px', marginBottom: '14px' },
  searchInput:{ border: 'none', outline: 'none', background: 'transparent',
                fontSize: '14px', flex: 1 },
  emptyState: { display: 'flex', flexDirection: 'column',
                alignItems: 'center', padding: '2rem', gap: '6px' },
  emptyText:  { color: '#9ca3af', fontSize: '13px', margin: 0 },
  emptyLink:  { color: '#3B82F6', fontSize: '13px', textDecoration: 'none' },
  jobsList:   { display: 'flex', flexDirection: 'column', gap: '8px' },
  jobItem:    { display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', background: '#f9fafb',
                borderRadius: '10px', border: '1px solid #f3f4f6' },
  jobIcon:    { width: '36px', height: '36px', borderRadius: '8px',
                background: '#3B82F6', color: '#fff', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontWeight: '700', flexShrink: 0 },
  jobTitle:   { margin: '0 0 2px', fontSize: '14px',
                fontWeight: '500', color: '#111827' },
  jobMeta:    { margin: 0, fontSize: '12px', color: '#6b7280' },
  applyBtn:   { background: '#3B82F6', color: '#fff', borderRadius: '6px',
                padding: '5px 14px', fontSize: '12px',
                textDecoration: 'none', fontWeight: '500' },
  rightCol:   { display: 'flex', flexDirection: 'column', gap: '14px' },
  miniCard:   { background: '#fff', borderRadius: '12px',
                padding: '1.25rem', border: '1px solid #e5e7eb' },
  miniHeader: { display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '12px' },
  miniLink:   { fontSize: '12px', color: '#3B82F6', textDecoration: 'none' },
  testItem:   { display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '8px 0',
                borderBottom: '1px solid #f3f4f6' },
  testDomain: { fontSize: '13px', color: '#374151', textTransform: 'capitalize' },
  testScore:  { fontSize: '14px', fontWeight: '600' },
};