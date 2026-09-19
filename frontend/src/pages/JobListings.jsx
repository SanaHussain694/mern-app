// src/pages/JobListings.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function JobListings() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filters, setFilters] = useState({ experience: '', jobType: '' });
  const [selected, setSelected] = useState(null); // job detail modal

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search)           params.append('search', search);
      if (filters.experience) params.append('experience', filters.experience);
      if (filters.jobType)    params.append('jobType', filters.jobType);

      const res = await axios.get(
        `http://localhost:5000/api/jobs?${params.toString()}`
      );
      setJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const jobTypeColors = {
    'full-time': { bg: '#EFF6FF', color: '#185FA5' },
    'part-time': { bg: '#F0FDF4', color: '#16A34A' },
    'remote':    { bg: '#FEF3C7', color: '#D97706' },
    'contract':  { bg: '#FDF4FF', color: '#9333EA' },
  };

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <h2 style={s.title}>🔍 Find Jobs</h2>
        <p style={s.subtitle}>{jobs.length} jobs available</p>
      </div>

      {/* Search + Filters */}
      <div style={s.searchBar}>
        <input
          style={{ ...s.input, flex: 1 }}
          placeholder="🔍  Job title, skill ya keyword likhein..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchJobs()}
        />
        <select style={s.select} value={filters.experience}
          onChange={e => setFilters({ ...filters, experience: e.target.value })}>
          <option value="">All Experience</option>
          <option value="fresher">Fresher</option>
          <option value="1-2 years">1-2 Years</option>
          <option value="2-5 years">2-5 Years</option>
          <option value="5+ years">5+ Years</option>
        </select>
        <select style={s.select} value={filters.jobType}
          onChange={e => setFilters({ ...filters, jobType: e.target.value })}>
          <option value="">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="remote">Remote</option>
          <option value="contract">Contract</option>
        </select>
        <button style={s.searchBtn} onClick={fetchJobs}>Search</button>
      </div>

      {/* Job Cards */}
      {loading ? (
        <div style={s.loading}>Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div style={s.empty}>😕 Koi job nahi mili — filters change karo</div>
      ) : (
        <div style={s.grid}>
          {jobs.map(job => {
            const badge = jobTypeColors[job.jobType] || jobTypeColors['full-time'];
            return (
              <div key={job._id} style={s.card} onClick={() => setSelected(job)}>

                {/* Top row */}
                <div style={s.cardTop}>
                  <div style={s.companyIcon}>
                    {job.postedBy?.name?.charAt(0) || '🏢'}
                  </div>
                  <span style={{ ...s.typeBadge, background: badge.bg, color: badge.color }}>
                    {job.jobType}
                  </span>
                </div>

                {/* Title */}
                <h3 style={s.jobTitle}>{job.title}</h3>
                <p style={s.company}>{job.postedBy?.name}</p>

                {/* Info row */}
                <div style={s.infoRow}>
                  <span>📍 {job.location}</span>
                  <span>⏱ {job.experience}</span>
                </div>

                {/* Salary */}
                {(job.salary?.min || job.salary?.max) && (
                  <p style={s.salary}>
                    💰 PKR {job.salary.min?.toLocaleString()} – {job.salary.max?.toLocaleString()}
                  </p>
                )}

                {/* Skills chips */}
                <div style={s.chips}>
                  {job.requiredSkills?.slice(0, 3).map(skill => (
                    <span key={skill} style={s.chip}>{skill}</span>
                  ))}
                  {job.requiredSkills?.length > 3 && (
                    <span style={s.chip}>+{job.requiredSkills.length - 3}</span>
                  )}
                </div>

                <button style={s.applyBtn}>Apply Now →</button>
              </div>
            );
          })}
        </div>
      )}

      {/* Job Detail Modal */}
      {selected && (
        <div style={s.overlay} onClick={() => setSelected(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <button style={s.closeBtn} onClick={() => setSelected(null)}>✕</button>
            <h2 style={{ margin: '0 0 6px', fontSize: '22px' }}>{selected.title}</h2>
            <p style={{ color: '#6b7280', margin: '0 0 16px' }}>{selected.postedBy?.name}</p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <span style={s.chip}>📍 {selected.location}</span>
              <span style={s.chip}>⏱ {selected.experience}</span>
              <span style={s.chip}>💼 {selected.jobType}</span>
              {selected.salary?.min > 0 && (
                <span style={s.chip}>
                  💰 {selected.salary.min?.toLocaleString()} – {selected.salary.max?.toLocaleString()}
                </span>
              )}
            </div>

            <h4 style={{ marginBottom: '8px' }}>Description</h4>
            <p style={{ color: '#374151', lineHeight: 1.6, marginBottom: '16px' }}>
              {selected.description}
            </p>

            <h4 style={{ marginBottom: '8px' }}>Required Skills</h4>
            <div style={s.chips}>
              {selected.requiredSkills?.map(skill => (
                <span key={skill} style={s.chip}>{skill}</span>
              ))}
            </div>

            <button style={{ ...s.applyBtn, width: '100%', marginTop: '20px', padding: '12px' }}>
              🚀 Apply for this Job
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page:      { minHeight: '100vh', background: '#f5f7fa', padding: '2rem' },
  header:    { marginBottom: '1.5rem' },
  title:     { fontSize: '24px', fontWeight: '600', color: '#111827', margin: '0 0 4px' },
  subtitle:  { fontSize: '14px', color: '#6b7280', margin: 0 },
  searchBar: { display: 'flex', gap: '10px', flexWrap: 'wrap',
               background: '#fff', padding: '1rem', borderRadius: '12px',
               border: '1px solid #e5e7eb', marginBottom: '1.5rem',
               boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  input:     { padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px',
               fontSize: '14px', outline: 'none', minWidth: '200px' },
  select:    { padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px',
               fontSize: '14px', outline: 'none', background: '#fff', cursor: 'pointer' },
  searchBtn: { background: '#185FA5', color: '#fff', border: 'none', padding: '9px 20px',
               borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '500' },
  grid:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
               gap: '16px' },
  card:      { background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
               padding: '1.25rem', cursor: 'pointer', transition: 'box-shadow 0.2s',
               boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  cardTop:   { display: 'flex', justifyContent: 'space-between',
               alignItems: 'center', marginBottom: '12px' },
  companyIcon: { width: '40px', height: '40px', borderRadius: '8px',
                 background: '#185FA5', color: '#fff', display: 'flex',
                 alignItems: 'center', justifyContent: 'center', fontWeight: '600' },
  typeBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  jobTitle:  { margin: '0 0 4px', fontSize: '16px', fontWeight: '600', color: '#111827' },
  company:   { margin: '0 0 10px', fontSize: '13px', color: '#6b7280' },
  infoRow:   { display: 'flex', gap: '12px', fontSize: '13px',
               color: '#6b7280', marginBottom: '8px' },
  salary:    { fontSize: '14px', fontWeight: '500', color: '#16A34A', margin: '0 0 10px' },
  chips:     { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' },
  chip:      { background: '#F3F4F6', color: '#374151', borderRadius: '20px',
               padding: '3px 10px', fontSize: '12px' },
  applyBtn:  { background: '#185FA5', color: '#fff', border: 'none', padding: '8px 16px',
               borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  loading:   { textAlign: 'center', padding: '3rem', color: '#6b7280', fontSize: '16px' },
  empty:     { textAlign: 'center', padding: '3rem', color: '#6b7280', fontSize: '16px' },
  overlay:   { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               zIndex: 1000, padding: '1rem' },
  modal:     { background: '#fff', borderRadius: '16px', padding: '2rem',
               width: '100%', maxWidth: '560px', maxHeight: '80vh',
               overflowY: 'auto', position: 'relative' },
  closeBtn:  { position: 'absolute', top: '16px', right: '16px', background: 'none',
               border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6b7280' },
};