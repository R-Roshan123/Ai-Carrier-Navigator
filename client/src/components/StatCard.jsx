export default function StatCard({ label, value, change, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        {Icon ? <Icon className="h-4 w-4 text-indigo-600" /> : null}
      </div>
      <div className="flex items-end justify-between gap-3">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">{change}</span>
      </div>
    </div>
  );
}
