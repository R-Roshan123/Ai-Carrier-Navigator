import { useNavigate } from 'react-router-dom';
import SkillBar from '../components/SkillBar';
import RoleSelect from '../components/RoleSelect';
import { allRoles } from '../data/roleCareerData';
import useSelectedRole from '../hooks/useSelectedRole';
import { readScores } from '../utils/assessmentScores';

const REQUIRED_LEVEL = 80;

const priorityFor = (gap) => (gap >= 50 ? 'HIGH' : gap > 0 ? 'MEDIUM' : 'LOW');

export default function SkillGapPage() {
  const navigate = useNavigate();
  const [role, selectRole] = useSelectedRole();
  const score = role && readScores()[role.slug];
  const topics = [...new Set(role?.questions.map((question) => question.topic) || [])];

  const gaps = (score?.topics || [])
    .map((topic) => {
      const current = Math.round((topic.correct / topic.total) * 100);
      const gap = Math.max(0, REQUIRED_LEVEL - current);
      return { skill: topic.topic, current, required: REQUIRED_LEVEL, gap, priority: priorityFor(gap) };
    })
    .sort((a, b) => b.gap - a.gap);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Skill gap analysis</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{role ? `Your skills vs ${role.title}` : 'Choose a target role'}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Current levels come from your latest assessment score in each topic.</p>
        </div>
        <RoleSelect role={role} onChange={selectRole} allLabel="Choose a role" />
      </div>

      {!role && (
        <div className="grid gap-3 md:grid-cols-3">
          {allRoles.map((item) => (
            <button key={item.slug} onClick={() => selectRole(item.slug)} className="rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm font-semibold text-slate-900 shadow-sm hover:border-indigo-300">
              {item.title}
            </button>
          ))}
        </div>
      )}

      {role && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Required skills for {role.title}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {role.skills.map((skill) => <span key={skill} className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{skill}</span>)}
          </div>
        </div>
      )}

      {role && !gaps.length && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-900">{score ? 'Retake the assessment to see topic-level gaps' : `You haven't taken the ${role.title} assessment yet`}</h2>
          <p className="mt-2 text-sm text-slate-600">It covers {topics.join(', ')}.</p>
          <button onClick={() => navigate(`/assessment?role=${role.slug}`)} className="mt-5 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white">
            {score ? 'Retake assessment' : 'Take assessment'}
          </button>
        </div>
      )}

      {gaps.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2">
          {gaps.map((skill) => (
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
              <div className="mt-4 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Recommended learning:</span> {skill.gap ? role.courses[0].name : 'On track — keep practising'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
