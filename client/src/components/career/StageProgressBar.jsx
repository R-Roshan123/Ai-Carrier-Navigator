export default function StageProgressBar({ title, completed, total, percent }) {
  const color = percent === 100 ? 'bg-emerald-500' : percent > 0 ? 'bg-blue-500' : 'bg-slate-300';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-slate-700">{title}</span>
        <span className="text-slate-500">
          {completed}/{total} steps · {percent}%
        </span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${title} progress`}
      >
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
