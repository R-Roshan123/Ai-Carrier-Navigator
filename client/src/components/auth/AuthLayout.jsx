import { GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export const authInputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500';

// Student and admin auth pages share this frame; the tabs switch between the two portals.
export default function AuthLayout({ portal, mode, eyebrow, title, description, wide = false, children, footer }) {
  const tabs = [
    { key: 'student', label: 'Student', icon: GraduationCap, to: mode === 'signup' ? '/signup' : '/login' },
    { key: 'admin', label: 'Admin', icon: ShieldCheck, to: mode === 'signup' ? '/admin/signup' : '/admin/login' },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8`}>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white"><Sparkles className="h-4 w-4" /></span>
          AI Career Navigator
        </Link>

        <div className="mt-6 grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1" role="tablist" aria-label="Account type">
          {tabs.map(({ key, label, icon: Icon, to }) => (
            <NavLink
              key={key}
              to={to}
              role="tab"
              aria-selected={portal === key}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${portal === key ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="mt-6">
          <div className="text-sm uppercase tracking-[0.2em] text-indigo-600">{eyebrow}</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>

        {children}

        <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>
      </section>
    </main>
  );
}
