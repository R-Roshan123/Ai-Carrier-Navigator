import { useEffect, useState } from 'react';
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(readCurrentUser);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateUser = () => setCurrentUser(readCurrentUser());
    document.documentElement.dataset.theme = localStorage.getItem('app-theme') || 'light';
    window.addEventListener('auth-changed', updateUser);
    return () => window.removeEventListener('auth-changed', updateUser);
  }, []);

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

  useEffect(() => {
    const page = document.querySelector('.route-transition');
    if (!page || typeof document.createTreeWalker !== 'function') return undefined;

    const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        if (parent.closest('svg, script, style, textarea, input, select, .word-pop')) return NodeFilter.FILTER_REJECT;
        if (!parent.closest('h1, h2')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    const headingWordIndexes = new WeakMap();
    textNodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      const heading = node.parentElement.closest('h1, h2');
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part));
          return;
        }
        const word = document.createElement('span');
        word.className = 'word-pop';
        const wordIndex = headingWordIndexes.get(heading) || 0;
        word.style.setProperty('--word-index', wordIndex);
        word.textContent = part;
        headingWordIndexes.set(heading, wordIndex + 1);
        fragment.append(word);
      });
      node.replaceWith(fragment);
    });

    return () => {
      page.querySelectorAll('.word-pop').forEach((word) => word.replaceWith(document.createTextNode(word.textContent)));
      page.normalize();
    };
  }, [location.pathname]);

  const userInitial = (currentUser?.name || 'U').slice(0, 1).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/landing');
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f4f0] text-slate-900">
      <div className="flex min-h-screen">
        {mobileOpen && <button className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />}
        <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-[17.5rem] flex-col border-r border-slate-800 bg-slate-950 p-4 shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none`}>
          <div className="mb-10 flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300 text-slate-950 shadow-lg shadow-lime-300/10">
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
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white/10 text-lime-200 ring-1 ring-inset ring-white/10'
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
            <button onClick={() => navigate('/assessment')} className="mt-3 text-xs font-semibold text-lime-300 hover:text-lime-200">Continue assessment →</button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#f5f4f0]/90 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
                  <Menu className="h-5 w-5 text-slate-700" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setProfileOpen((open) => !open)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-left shadow-sm transition hover:border-indigo-200" aria-label="Open account menu" aria-expanded={profileOpen}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">{userInitial}</span>
                  <div className="hidden text-left sm:block">
                    <div className="text-sm font-semibold text-slate-900">{currentUser?.name || 'User'}</div>
                  </div>
                  <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
                </button>
              </div>
            </div>
            {profileOpen && <div className="absolute right-4 top-[4.5rem] w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-950/10"><div className="border-b border-slate-100 px-3 py-3"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">{userInitial}</span><div><div className="text-sm font-semibold text-slate-900">{currentUser?.name || 'User'}</div><div className="mt-0.5 max-w-44 truncate text-xs text-slate-500">{currentUser?.email || currentUser?.department || 'Career workspace'}</div></div></div></div><button onClick={() => { setProfileOpen(false); navigate('/profile'); }} className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"><UserRound className="h-4 w-4 text-slate-500" />View profile</button><button onClick={() => { setProfileOpen(false); navigate('/settings'); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"><Settings className="h-4 w-4 text-slate-500" />Account settings</button><div className="my-1 border-t border-slate-100" /><button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"><LogOut className="h-4 w-4" />Log out</button></div>}
          </header>

          <main className="workspace-main mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
            <div key={location.pathname} className="route-transition">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
