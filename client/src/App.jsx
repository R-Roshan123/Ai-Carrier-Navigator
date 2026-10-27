import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AssessmentPage from './pages/AssessmentPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ExplorerPage from './pages/ExplorerPage';
import SkillGapPage from './pages/SkillGapPage';
import RoadmapPage from './pages/RoadmapPage';
import JobsPage from './pages/JobsPage';
import ResumePage from './pages/ResumePage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CertificatePage from './pages/CertificatePage';
import ProjectsPage from './pages/ProjectsPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import AdminRoute from './components/AdminRoute';
import ExploreRolesPage from './pages/career/ExploreRolesPage';
import RoleDetailPage from './pages/career/RoleDetailPage';
import CompaniesPage from './pages/career/CompaniesPage';
import CompanyDetailPage from './pages/career/CompanyDetailPage';
import MyCareerProgressPage from './pages/career/MyCareerProgressPage';
import MyCertificatesPage from './pages/career/MyCertificatesPage';
import AdminCareerStatsPage from './pages/admin/AdminCareerStatsPage';
import AdminVerificationPage from './pages/admin/AdminVerificationPage';
import AdminRolesPage from './pages/admin/AdminRolesPage';
import AdminRoadmapEditorPage from './pages/admin/AdminRoadmapEditorPage';
import AdminCompaniesPage from './pages/admin/AdminCompaniesPage';
import AdminCertificationsPage from './pages/admin/AdminCertificationsPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('token')));

  useEffect(() => {
    const updateAuthState = () => setIsAuthenticated(Boolean(localStorage.getItem('token')));
    window.addEventListener('storage', updateAuthState);
    window.addEventListener('auth-changed', updateAuthState);
    return () => {
      window.removeEventListener('storage', updateAuthState);
      window.removeEventListener('auth-changed', updateAuthState);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<LoginPage key="student" portal="student" />} />
        <Route path="/signup" element={<SignUpPage key="student" accountType="student" />} />
        <Route path="/admin/login" element={<LoginPage key="admin" portal="admin" />} />
        <Route path="/admin/signup" element={<SignUpPage key="admin" accountType="admin" />} />
        <Route path="/certificate/:code" element={<CertificatePage />} />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <AppShell>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/assessment" element={<AssessmentPage />} />
                  <Route path="/recommendations" element={<RecommendationsPage />} />
                  <Route path="/explorer" element={<ExplorerPage />} />
                  <Route path="/skill-gap" element={<SkillGapPage />} />
                  <Route path="/roadmap" element={<RoadmapPage />} />
                  <Route path="/jobs" element={<JobsPage />} />
                  <Route path="/resume" element={<ResumePage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/courses/:slug" element={<CourseDetailPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/career/roles" element={<ExploreRolesPage />} />
                  <Route path="/career/roles/:slug" element={<RoleDetailPage />} />
                  <Route path="/career/companies" element={<CompaniesPage />} />
                  <Route path="/career/companies/:id" element={<CompanyDetailPage />} />
                  <Route path="/career/progress" element={<MyCareerProgressPage />} />
                  <Route path="/career/certificates" element={<MyCertificatesPage />} />
                  <Route path="/admin/career" element={<AdminRoute><AdminCareerStatsPage /></AdminRoute>} />
                  <Route path="/admin/career/verification" element={<AdminRoute><AdminVerificationPage /></AdminRoute>} />
                  <Route path="/admin/career/roles" element={<AdminRoute><AdminRolesPage /></AdminRoute>} />
                  <Route path="/admin/career/roadmaps" element={<AdminRoute><AdminRoadmapEditorPage /></AdminRoute>} />
                  <Route path="/admin/career/companies" element={<AdminRoute><AdminCompaniesPage /></AdminRoute>} />
                  <Route path="/admin/career/certifications" element={<AdminRoute><AdminCertificationsPage /></AdminRoute>} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </AppShell>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
