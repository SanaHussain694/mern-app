// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute    from './components/ProtectedRoute';

import Login              from './pages/Login';
import Register           from './pages/Register';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import ProfilePage        from './pages/ProfilePage';
import PostJob            from './pages/PostJob';
import JobListings        from './pages/JobListings';
import AssessmentStart    from './pages/AssessmentStart';
import AssessmentTest     from './pages/AssessmentTest';
import AssessmentResult   from './pages/AssessmentResult';
import InterviewStart     from './pages/InterviewStart';
import InterviewSession   from './pages/InterviewSession';
import InterviewResult    from './pages/InterviewResult';
import AdminDashboard     from './pages/AdminDashboard';
import CandidateReview    from './pages/CandidateReview';
import JobProviderDashboard from './pages/JobProviderDashboard';

// Role-based dashboard router
function DashboardRouter() {
  const { user } = useAuth();
  if (user?.role === 'jobProvider') return <JobProviderDashboard />;
  if (user?.role === 'admin')       return <AdminDashboard />;
  return <JobSeekerDashboard />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ── Public Routes ──────────────────────── */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs"     element={<JobListings />} />

          {/* ── Dashboard (role-aware) ─────────────── */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } />

          {/* ── Profile ────────────────────────────── */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          {/* ── Job Provider ───────────────────────── */}
          <Route path="/post-job" element={
            <ProtectedRoute allowedRoles={['jobProvider', 'admin']}>
              <PostJob />
            </ProtectedRoute>
          } />

          {/* ── Assessment ─────────────────────────── */}
          <Route path="/assessment" element={
            <ProtectedRoute>
              <AssessmentStart />
            </ProtectedRoute>
          } />
          <Route path="/assessment/result" element={
            <ProtectedRoute>
              <AssessmentResult />
            </ProtectedRoute>
          } />
          <Route path="/assessment/:id" element={
            <ProtectedRoute>
              <AssessmentTest />
            </ProtectedRoute>
          } />

          {/* ── Interview ──────────────────────────── */}
          <Route path="/interview" element={
            <ProtectedRoute>
              <InterviewStart />
            </ProtectedRoute>
          } />
          <Route path="/interview/result" element={
            <ProtectedRoute>
              <InterviewResult />
            </ProtectedRoute>
          } />
          <Route path="/interview/:id" element={
            <ProtectedRoute>
              <InterviewSession />
            </ProtectedRoute>
          } />

          {/* ── Admin ──────────────────────────────── */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/candidates" element={
            <ProtectedRoute allowedRoles={['admin', 'jobProvider']}>
              <CandidateReview />
            </ProtectedRoute>
          } />

          {/* ── Fallback ───────────────────────────── */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
