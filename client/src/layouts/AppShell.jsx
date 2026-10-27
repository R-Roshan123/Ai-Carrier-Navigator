import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  BrainCircuit,
  Award,
  Building2,
  BriefcaseBusiness,
  ChevronDown,
  ClipboardList,
  Compass,
  FileText,
  FolderKanban,
  Goal,
  LayoutGrid,
  LogOut,
  Menu,
  Map,
  MessageSquareText,
  Route,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  X,
} from 'lucide-react';
import { navItems } from '../data/seedData';
import FloatingAssistant from '../components/assistant/FloatingAssistant';
import ColorModeToggle from '../components/ColorModeToggle';
import ExperimentalNavigation from '../components/ExperimentalNavigation';

const readCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  } catch {
    return null;
  }
};

const navigationIcons = {
  LayoutDashboard: LayoutGrid,
  BrainCircuit,
  Sparkles,
  Compass,
  Goal,
  Route,
  BookOpen,
  FolderKanban,
  BriefcaseBusiness,
  FileText,
  ClipboardList,
  MessageSquareText,
  UserRound,
  Settings,
  Map,
  Building2,
  TrendingUp,
  Award,
  ShieldCheck,
};

export default function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const touchStart = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navMapOpen, setNavMapOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(readCurrentUser);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = navItems.find((item) => item.path === location.pathname)?.label ||
    location.pathname.split('/').filter(Boolean).pop()?.replaceAll('-', ' ') || 'Workspace';

  useEffect(() => {
    const updateUser = () => setCurrentUser(readCurrentUser());
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('app-theme');
    window.addEventListener('auth-changed', updateUser);
    return () => window.removeEventListener('auth-changed', updateUser);
  }, []);

  useEffect(() => {
    const onTouchStart = (event) => {
      if (window.innerWidth > 1024 || event.changedTouches.length !== 1) return;
      const touch = event.changedTouches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY, wasOpen: mobileOpen };
    };
    const onTouchEnd = (event) => {
      const start = touchStart.current;
      touchStart.current = null;
      if (!start || event.changedTouches.length !== 1) return;
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - start.x;
      const deltaY = Math.abs(touch.clientY - start.y);
      if (deltaY > 70 || Math.abs(deltaX) < 64) return;
      if (!start.wasOpen && start.x <= 28 && deltaX > 0) setMobileOpen(true);
      if (start.wasOpen && deltaX < 0) setMobileOpen(false);
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const main = document.querySelector('.workspace-main');
    if (!main || !('IntersectionObserver' in window)) return undefined;

    const targets = main.querySelectorAll('.route-transition > * > *, .route-transition .grid > *');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    targets.forEach((target, index) => {
      target.classList.add('scroll-reveal');
      target.style.setProperty('--reveal-delay', `${(index % 5) * 75}ms`);
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  const userInitial = (currentUser?.name || 'U').slice(0, 1).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/');
  };

  return (
    <div className="cyber-theme app-shell-root min-h-screen w-full bg-[#f2f5f9] text-slate-900">
      <div className="flex min-h-screen">
        {mobileOpen && <button className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />}
        <aside className={`workspace-sidebar ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-[17.5rem] flex-col border-r border-slate-800 bg-slate-950 p-4 shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none`}>
          <div className="mb-10 flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-400 text-slate-950 shadow-lg shadow-orange-300/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-bold tracking-tight text-white">CareerPilot</div>
                <div className="text-[11px] font-medium tracking-wide text-slate-400">AI CAREER NAVIGATOR</div>
              </div>
            </div>
            <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>

          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Workspace</div>
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {navItems.filter((item) => !['Profile', 'Settings'].includes(item.label) && (!item.adminOnly || currentUser?.role === 'admin')).map((item, index) => {
              const Icon = navigationIcons[item.icon] || LayoutGrid;
              return (
              <div key={item.label}>
                {index === 8 && <div className="my-4 border-t border-slate-800" />}
              <NavLink
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `workspace-nav-link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white/10 text-cyan-200 ring-1 ring-inset ring-white/10'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
              </div>
            )})}
          </nav>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-xs font-semibold text-slate-200">Your next step</div>
            <p className="mt-1 text-xs leading-5 text-slate-400">Complete your career assessment to personalise your plan.</p>
            <button onClick={() => navigate('/assessment')} className="mt-3 text-xs font-semibold text-orange-300 hover:text-orange-200">Continue assessment →</button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="workspace-topbar sticky top-0 z-30 border-b border-black/[0.06] bg-[#f2f5f9]/90 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
                  <Menu className="h-5 w-5 text-slate-700" />
                </button>
                <button type="button" className="nav-map-trigger" onClick={() => setNavMapOpen(true)} aria-label="Open navigation map" title="Explore navigation">
                  <Compass size={18} /><span>Explore</span>
                </button>
                <div className="topbar-breadcrumb">
                  <span>CAREERPILOT <b>/</b> WORKSPACE</span>
                  <strong>{currentPage}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
<ColorModeToggle />
                <button onClick={() => setProfileOpen((open) => !open)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-left shadow-sm transition hover:border-indigo-200" aria-label="Open account menu" aria-expanded={profileOpen}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">{userInitial}</span>
                  <div className="hidden text-left sm:block">
                    <div className="text-sm font-semibold text-slate-900">{currentUser?.name || 'User'}</div>
                    <div className="text-[11px] text-slate-500">{currentUser?.role === 'admin' ? currentUser.designation || 'Admin' : currentUser?.department || 'Student'}</div>
                  </div>
                  <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
                </button>
              </div>
            </div>
            {profileOpen && (
              <div className="account-dropdown absolute right-4 top-[4.5rem] z-[80] w-72 rounded-xl border p-2" role="group" aria-label="Account menu">
                <div className="account-dropdown-header flex items-center gap-3 px-3 py-3">
                  <span className="account-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold">{userInitial}</span>
                  <div className="min-w-0">
                    <div className="account-dropdown-name truncate text-sm font-semibold">{currentUser?.name || 'User'}</div>
                    <div className="account-dropdown-detail mt-0.5 max-w-44 truncate text-xs">{currentUser?.email || currentUser?.department || 'Career workspace'}</div>
                  </div>
                </div>
                <button onClick={() => { setProfileOpen(false); navigate('/profile'); }} className="account-dropdown-action mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition"><UserRound className="h-4 w-4" />View profile</button>
                <button onClick={() => { setProfileOpen(false); navigate('/settings'); }} className="account-dropdown-action flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition"><Settings className="h-4 w-4" />Account settings</button>
                <div className="account-dropdown-divider my-1 border-t" />
                <button onClick={handleLogout} className="account-dropdown-logout flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition"><LogOut className="h-4 w-4" />Log out</button>
              </div>
            )}
          </header>

          <main className="workspace-main mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
            <div key={location.pathname} className="route-transition">{children}</div>
          </main>
        </div>
      </div>
      <FloatingAssistant />
      {navMapOpen && <ExperimentalNavigation onClose={() => setNavMapOpen(false)} currentUser={currentUser} />}
    </div>
  );
}
