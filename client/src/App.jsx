import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

function CyberTextEntrance({ children }) {
  const location = useLocation();

  useEffect(() => {
    const page = document.querySelector('.app-theme-root');
    if (!page || typeof document.createTreeWalker !== 'function') return undefined;

    const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        if (parent.closest('svg, script, style, textarea, input, select, .cyber-word-pop')) return NodeFilter.FILTER_REJECT;
        const block = parent.closest('h1, h2, h3, p');
        if (!block) return NodeFilter.FILTER_REJECT;
        if (block.matches('p') && block.textContent.trim().length > 140) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    const wordCounts = new Map();
    textNodes.forEach((node) => {
      const block = node.parentElement.closest('h1, h2, h3, p');
      const count = node.textContent.trim().split(/\s+/).length;
      wordCounts.set(block, (wordCounts.get(block) || 0) + count);
    });

    const wordIndexes = new Map();
    textNodes.forEach((node) => {
      const block = node.parentElement.closest('h1, h2, h3, p');
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part));
          return;
        }

        const word = document.createElement('span');
        const index = wordIndexes.get(block) || 0;
        word.className = 'cyber-word-pop';
        word.style.setProperty('--word-index', index);
        if (index === wordCounts.get(block) - 1) word.dataset.finalWord = 'true';
        word.textContent = part;
        wordIndexes.set(block, index + 1);
        fragment.append(word);
      });
      node.replaceWith(fragment);
    });

    return () => {
      page.querySelectorAll('.cyber-word-pop').forEach((word) => word.replaceWith(document.createTextNode(word.textContent)));
      page.normalize();
    };
  }, [location.pathname]);

  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('token')));

  useEffect(() => {
    document.documentElement.dataset.colorMode = localStorage.getItem('app-color-mode') === 'dark' ? 'dark' : 'light';
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
      <div className="cyber-theme app-theme-root">
      <CyberTextEntrance>
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
      </CyberTextEntrance>
      </div>
    </BrowserRouter>
  );
}

export default App;
