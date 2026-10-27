import { useEffect, useState } from 'react';

const themes = [
  { id: 'light', label: 'Light', detail: 'Clean white workspace', swatch: 'from-white to-slate-100' },
  { id: 'dark', label: 'Dark', detail: 'Soft black workspace', swatch: 'from-slate-800 to-slate-950' },
  { id: 'midnight', label: 'Midnight', detail: 'Deep blue workspace', swatch: 'from-blue-900 to-slate-950' },
  { id: 'forest', label: 'Forest', detail: 'Calm green workspace', swatch: 'from-emerald-800 to-slate-950' },
];

export default function SettingsPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Settings</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Account preferences</h1>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Appearance</h2>
        <p className="mt-1 text-sm text-slate-500">Choose a workspace theme. Your choice is saved on this device.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {themes.map((option) => (
            <button key={option.id} type="button" onClick={() => setTheme(option.id)} aria-pressed={theme === option.id}
              className={`rounded-2xl border p-3 text-left transition ${theme === option.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-indigo-300'}`}>
              <span className={`block h-20 rounded-xl bg-gradient-to-br ${option.swatch}`} />
              <span className="mt-3 block text-sm font-semibold text-slate-900">{option.label}</span>
              <span className="mt-0.5 block text-xs text-slate-500">{option.detail}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Profile settings</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <div>Notifications: Enabled</div>
            <div>Privacy: Standard</div>
            <div>Password: Last changed 2 weeks ago</div>
          </div>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Preferences</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <div>Career alerts: On</div>
            <div>Course reminders: Weekly</div>
            <div>Job alerts: Matching roles only</div>
            <div>Resume review: Enabled</div>
          </div>
        </section>
      </div>
    </div>
  );
}
