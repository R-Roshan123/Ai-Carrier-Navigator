import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  LayoutGrid,
  LogOut,
  Menu,
  Sparkles,
  UserCircle2,
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

export default function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(readCurrentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => setCurrentUser(readCurrentUser());
    window.addEventListener('auth-changed', updateUser);
    return () => window.removeEventListener('auth-changed', updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/landing');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 lg:static lg:translate-x-0`}>
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">AI Career</div>
                <div className="text-xs text-slate-500">Navigator</div>
              </div>
            </div>
            <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <LayoutGrid className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
                  <Menu className="h-5 w-5 text-slate-700" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setNotificationsOpen((open) => !open)} className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-600" aria-label="Notifications" aria-expanded={notificationsOpen}>
                  <Bell className="h-4 w-4" />
                </button>
                <button onClick={() => navigate('/profile')} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-left">
                  <UserCircle2 className="h-7 w-7 text-slate-700" />
                  <div className="hidden text-left sm:block">
                    <div className="text-sm font-semibold text-slate-900">{currentUser?.name || 'User'}</div>
                    <div className="text-[11px] text-slate-500">{currentUser?.department || 'Member'}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </button>
                <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700" aria-label="Log out">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
            {notificationsOpen && <div className="absolute right-4 top-16 w-72 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-lg"><div className="font-semibold text-slate-900">Notifications</div><p className="mt-2">Your next roadmap milestone is ready to review.</p><button onClick={() => { setNotificationsOpen(false); navigate('/roadmap'); }} className="mt-3 font-medium text-indigo-600">Open roadmap</button></div>}
          </header>

          <main className="w-full p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
