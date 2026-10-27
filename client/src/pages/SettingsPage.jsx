export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Settings</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Account preferences</h1>
      </div>

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
