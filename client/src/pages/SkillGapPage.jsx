import SkillBar from '../components/SkillBar';
import { skillGapData } from '../data/seedData';

export default function SkillGapPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Skill gap analysis</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Current skill levels vs target role</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {skillGapData.map((skill) => (
          <div key={skill.skill} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">{skill.skill}</h2>
              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                skill.priority === 'HIGH' ? 'bg-red-50 text-red-700' : skill.priority === 'MEDIUM' ? 'bg-yellow-50 text-yellow-700' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {skill.priority}
              </span>
            </div>
            <SkillBar label={skill.skill} value={skill.current} target={skill.required} />
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3"><span className="block text-xs text-slate-500">Current</span> {skill.current}%</div>
              <div className="rounded-xl bg-slate-50 p-3"><span className="block text-xs text-slate-500">Required</span> {skill.required}%</div>
              <div className="rounded-xl bg-slate-50 p-3"><span className="block text-xs text-slate-500">Gap</span> {skill.gap}%</div>
            </div>
            <div className="mt-4 text-sm text-slate-600"><span className="font-semibold text-slate-800">Recommended learning:</span> {skill.resource}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
