export default function SkillBar({ label, value, target }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" style={{ width: `${value}%` }} />
      </div>
      <div className="text-[11px] text-slate-500">Target {target}%</div>
    </div>
  );
}
