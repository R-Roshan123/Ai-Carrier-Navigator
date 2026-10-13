import { CheckCircle2, Circle } from 'lucide-react';

export default function SkillsChecklist({ skills }) {
  const acquired = skills.filter((item) => item.acquired).length;
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">Skills checklist</h2>
        <span className="text-sm text-slate-500">
          {acquired}/{skills.length} acquired
        </span>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((item) => (
          <li
            key={item.skill}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
              item.acquired ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            {item.acquired ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <Circle className="h-4 w-4 shrink-0 text-slate-400" />}
            {item.skill}
            <span className="sr-only">{item.acquired ? '(acquired)' : '(missing)'}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
