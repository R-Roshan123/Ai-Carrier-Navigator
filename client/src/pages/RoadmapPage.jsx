import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoleSelect from '../components/RoleSelect';
import { allRoles } from '../data/roleCareerData';
import useSelectedRole from '../hooks/useSelectedRole';

const PROGRESS_KEY = 'roadmapProgress';

const readProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
};

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [role, selectRole] = useSelectedRole();
  const [progress, setProgress] = useState(readProgress);
  const done = new Set(role ? progress[role.slug] || [] : []);

  const toggleTopic = (key) => {
    const next = new Set(done);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    const updated = { ...progress, [role.slug]: [...next] };
    setProgress(updated);
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
    } catch {
      // Progress still works for this visit without storage.
    }
  };

  const totalTopics = role ? role.roadmap.reduce((sum, item) => sum + item.topics.length, 0) : 0;
  const overall = totalTopics ? Math.round((done.size / totalTopics) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Personalized roadmap</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{role ? `Target: ${role.title}` : 'Choose a target role'}</h1>
          {role && <p className="mt-2 text-sm text-slate-600">{overall}% complete · tick topics off as you learn them.</p>}
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
        <div className="space-y-5">
          {role.roadmap.map((item, index) => {
            const phaseDone = item.topics.filter((topic) => done.has(`${index}:${topic}`)).length;
            const phaseProgress = Math.round((phaseDone / item.topics.length) * 100);
            return (
              <div key={item.name} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700">{index + 1}</div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{item.name}</h2>
                      <div className="text-sm text-slate-500">{item.duration}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-600">{phaseProgress}% complete</div>
                </div>

                <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-indigo-600" style={{ width: `${phaseProgress}%` }} />
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {item.topics.map((topic) => {
                    const key = `${index}:${topic}`;
                    const isDone = done.has(key);
                    return (
                      <button key={topic} onClick={() => toggleTopic(key)} className={`flex items-start gap-2 rounded-2xl border p-3 text-left text-sm transition ${isDone ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-200'}`}>
                        {isDone ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="flex flex-wrap gap-2">
            <button onClick={() => navigate(`/courses?role=${role.slug}`)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">Courses for {role.title}</button>
            <button onClick={() => navigate(`/projects?role=${role.slug}`)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Projects to build</button>
          </div>
        </div>
      )}
    </div>
  );
}
