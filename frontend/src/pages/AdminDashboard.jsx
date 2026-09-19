// frontend/src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [users, setUsers]   = useState([]);
  const [jobs,  setJobs]    = useState([]);
  const [tab,   setTab]     = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const cfg   = { headers: { Authorization: `Bearer ${token}` } };

    Promise.all([
      axios.get(`${API}/api/admin/stats`,        cfg),
      axios.get(`${API}/api/admin/recent-users`, cfg),
      axios.get(`${API}/api/admin/recent-jobs`,  cfg),
    ])
      .then(([s, u, j]) => {
        setStats(s.data);
        setUsers(u.data);
        setJobs(j.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ── helpers ── */
  const roleColor = (role) => {
    if (role === 'admin')       return { bg: '#fce4ec', text: '#880e4f', label: 'admin' };
    if (role === 'jobProvider') return { bg: '#e8f5e9', text: '#1b5e20', label: 'job provider' };
    return                             { bg: '#e3f2fd', text: '#0d47a1', label: 'job seeker' };
  };

  const initials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const avatarBg = (role) => {
    if (role === 'admin')       return { bg: '#fce4ec', color: '#880e4f' };
    if (role === 'jobProvider') return { bg: '#e8f5e9', color: '#1b5e20' };
    return                             { bg: '#e3f2fd', color: '#0d47a1' };
  };

  /* ── stat cards config ── */
  const statCards = stats ? [
    { label: 'Total Users',  value: stats.totalUsers,    orange: false },
    { label: 'Job Seekers',  value: stats.jobSeekers,    orange: false },
    { label: 'Providers',    value: stats.jobProviders,  orange: false },
    { label: 'Total Jobs',   value: stats.totalJobs,     orange: false },
    { label: 'Assessments',  value: stats.assessments,   orange: true  },
    { label: 'Interviews',   value: stats.interviews,    orange: true  },
  ] : [];

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <p style={{ color: '#555', fontSize: 14 }}>Loading dashboard…</p>
    </div>
  );

  /* ── distribution bar widths ── */
  const total    = (stats?.jobSeekers || 0) + (stats?.jobProviders || 0) || 1;
  const seekPct  = Math.round(((stats?.jobSeekers  || 0) / total) * 100);
  const provPct  = Math.round(((stats?.jobProviders || 0) / total) * 100);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f0f2f5' }}>

      {/* ── Navbar ── */}
      <nav style={{
        background: '#1a237e', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 24px', height: 52,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, background: '#3f51b5', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 16 }}>💼</span>
          </div>
          <span style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>AI Recruitment</span>
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          {['Dashboard', 'Users', 'Jobs'].map((item) => (
            <span key={item} style={{
              color: item === 'Dashboard' ? '#fff' : 'rgba(255,255,255,0.65)',
              fontSize: 13, cursor: 'pointer',
              borderBottom: item === 'Dashboard' ? '2px solid #fff' : '2px solid transparent',
              paddingBottom: 2,
            }}>{item}</span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, cursor: 'pointer' }}>🔔</span>
          <div style={{
            width: 30, height: 30, background: '#3f51b5', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 12, fontWeight: 500,
          }}>U</div>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>Admin</span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        padding: '28px 28px 40px', color: '#fff',
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>
          🗂 Admin Dashboard ⚙️
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
          Manage all aspects of the platform
        </p>
      </div>

      <div style={{ padding: '0 28px 32px', marginTop: -16 }}>

        {/* ── Stat Cards ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 12, marginBottom: 20,
        }}>
          {statCards.map(({ label, value, orange }) => (
            <div key={label} style={{
              background: '#fff', borderRadius: 8,
              border: '0.5px solid rgba(0,0,0,0.1)',
              padding: '14px 16px',
            }}>
              <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                {label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 500, color: orange ? '#e65100' : '#111', lineHeight: 1 }}>
                {value ?? 0}
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{
          display: 'flex', gap: 2, background: '#e8eaf6',
          borderRadius: 8, padding: 4, width: 'fit-content', marginBottom: 20,
        }}>
          {[
            { key: 'overview', icon: '▦', label: 'Overview' },
            { key: 'users',    icon: '👥', label: 'Users'    },
            { key: 'jobs',     icon: '💼', label: 'Jobs'     },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: '7px 16px', borderRadius: 6, fontSize: 13, border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                background: tab === key ? '#fff' : 'transparent',
                color:      tab === key ? '#1a237e' : '#666',
                fontWeight: tab === key ? 500 : 400,
                boxShadow:  tab === key ? '0 0 0 0.5px rgba(0,0,0,0.12)' : 'none',
              }}
            >{icon} {label}</button>
          ))}
        </div>

        {/* ── Overview tab ── */}
        {tab === 'overview' && (
          <>
            {/* Recent Users + Recent Jobs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

              <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Recent Users</p>
                {users.length === 0 && (
                  <p style={{ fontSize: 13, color: '#999', textAlign: 'center', padding: '24px 0' }}>No users yet</p>
                )}
                {users.map((u) => {
                  const av  = avatarBg(u.role);
                  const bdg = roleColor(u.role);
                  return (
                    <div key={u._id || u.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 0', borderBottom: '0.5px solid rgba(0,0,0,0.07)',
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        background: av.bg, color: av.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 500,
                      }}>{initials(u.name)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{u.email}</div>
                      </div>
                      <span style={{
                        fontSize: 10, padding: '3px 8px', borderRadius: 99,
                        background: bdg.bg, color: bdg.text, fontWeight: 500,
                      }}>{bdg.label}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Recent Jobs</p>
                {jobs.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', color: '#bbb', gap: 8 }}>
                    <span style={{ fontSize: 32 }}>📭</span>
                    <p style={{ fontSize: 13 }}>No jobs posted yet</p>
                  </div>
                ) : jobs.map((j) => (
                  <div key={j._id || j.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 0', borderBottom: '0.5px solid rgba(0,0,0,0.07)',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{j.title}</div>
                      <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{j.company}</div>
                    </div>
                    <span style={{
                      fontSize: 10, padding: '3px 8px', borderRadius: 99,
                      background: '#e8f5e9', color: '#1b5e20', fontWeight: 500,
                    }}>{j.status || 'active'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribution + System Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

              <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>User Distribution</p>
                {[
                  { label: 'Job Seekers',   value: stats?.jobSeekers  || 0, pct: seekPct, color: '#1a237e' },
                  { label: 'Job Providers', value: stats?.jobProviders || 0, pct: provPct, color: '#7b1fa2' },
                ].map(({ label, value, pct, color }) => (
                  <div key={label} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginBottom: 6 }}>
                      <span>{label}</span><span>{value}</span>
                    </div>
                    <div style={{ height: 6, background: '#eee', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>System Info</p>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {[
                      ['Platform',   'AI Recruitment v1.0'],
                      ['Backend',    'Node.js + Express'],
                      ['Database',   'MySQL'],
                      ['Frontend',   'React + Tailwind'],
                      ['University', 'NUML Faisalabad'],
                    ].map(([key, val]) => (
                      <tr key={key}>
                        <td style={{ fontSize: 12, color: '#888', padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.07)' }}>{key}</td>
                        <td style={{ fontSize: 12, fontWeight: 500, textAlign: 'right', padding: '8px 0', borderBottom: '0.5px solid rgba(0,0,0,0.07)', color: '#111' }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Users tab ── */}
        {tab === 'users' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 500 }}>All Users</p>
              <Link to="/admin/candidates" style={{
                fontSize: 12, color: '#1a237e', textDecoration: 'none',
                border: '0.5px solid #1a237e', padding: '5px 12px', borderRadius: 6,
              }}>Review Candidates →</Link>
            </div>
            {users.map((u) => {
              const av  = avatarBg(u.role);
              const bdg = roleColor(u.role);
              return (
                <div key={u._id || u.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0', borderBottom: '0.5px solid rgba(0,0,0,0.07)',
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: av.bg, color: av.color, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 500,
                  }}>{initials(u.name)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{u.email}</div>
                  </div>
                  <span style={{
                    fontSize: 10, padding: '3px 8px', borderRadius: 99,
                    background: bdg.bg, color: bdg.text, fontWeight: 500,
                  }}>{bdg.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Jobs tab ── */}
        {tab === 'jobs' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.1)', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 500 }}>All Jobs</p>
              <Link to="/post-job" style={{
                fontSize: 12, color: '#fff', textDecoration: 'none',
                background: '#1a237e', padding: '5px 12px', borderRadius: 6,
              }}>+ Post Job</Link>
            </div>
            {jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#bbb' }}>
                <div style={{ fontSize: 40 }}>📭</div>
                <p style={{ fontSize: 13, marginTop: 8 }}>No jobs posted yet</p>
              </div>
            ) : jobs.map((j) => (
              <div key={j._id || j.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 0', borderBottom: '0.5px solid rgba(0,0,0,0.07)',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{j.title}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{j.company} • {j.location}</div>
                </div>
                <span style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 99,
                  background: '#e8f5e9', color: '#1b5e20', fontWeight: 500,
                }}>{j.status || 'active'}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
