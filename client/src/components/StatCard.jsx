export default function StatCard({ label, value, change, icon: Icon }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition duration-200 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-950/5">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-50/70 transition group-hover:scale-125" />
      <div className="mb-4 flex items-center justify-between">
        <span className="relative text-sm font-medium text-slate-500">{label}</span>
        {Icon ? <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Icon className="h-4 w-4" /></span> : null}
      </div>
      <div className="flex items-end justify-between gap-3">
        <h3 className="text-2xl font-bold tracking-tight text-slate-950">{value}</h3>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{change}</span>
      </div>
    </div>
  );
}
