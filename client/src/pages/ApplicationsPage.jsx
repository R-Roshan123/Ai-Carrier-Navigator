import { applicationsSeed } from '../data/seedData';

const columns = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'];

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Application tracker</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Your application pipeline</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="text-sm text-slate-500">Applications</div><div className="mt-2 text-3xl font-bold text-slate-900">24</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="text-sm text-slate-500">Interviews</div><div className="mt-2 text-3xl font-bold text-slate-900">6</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="text-sm text-slate-500">Offers</div><div className="mt-2 text-3xl font-bold text-slate-900">2</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="text-sm text-slate-500">Success rate</div><div className="mt-2 text-3xl font-bold text-slate-900">8.3%</div></div>
      </div>

      <div className="grid gap-5 xl:grid-cols-6">
        {columns.map((column) => (
          <div key={column} className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">{column}</h2>
              <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-500">{applicationsSeed.filter((app) => app.status === column).length || 1}</span>
            </div>
            <div className="space-y-3">
              {applicationsSeed.filter((app) => app.status === column || (column === 'Saved' && app.status === 'Saved')).map((app) => (
                <div key={`${column}-${app.company}`} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="font-semibold text-slate-900">{app.position}</div>
                  <div className="mt-1 text-sm text-slate-500">{app.company}</div>
                  <div className="mt-3 text-xs text-slate-500">{app.date} • {app.salary}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
