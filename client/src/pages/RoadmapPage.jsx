import { roadmapPhases } from '../data/seedData';

export default function RoadmapPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Personalized roadmap</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Target: Machine Learning Engineer</h1>
      </div>

      <div className="space-y-5">
        {roadmapPhases.map((phase, index) => (
          <div key={phase.name} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700">{index + 1}</div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{phase.name}</h2>
                  <div className="text-sm text-slate-500">{phase.duration}</div>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-600">{phase.progress}% complete</div>
            </div>

            <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-indigo-600" style={{ width: `${phase.progress}%` }} />
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {phase.topics.map((topic) => (
                <div key={topic} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{topic}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
