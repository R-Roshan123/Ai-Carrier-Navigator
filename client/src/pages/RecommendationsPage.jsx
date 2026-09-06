import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { careerRecommendations } from '../data/seedData';

export default function RecommendationsPage() {
  const [targetCareer, setTargetCareer] = useState('');
  const [compareCareer, setCompareCareer] = useState('');
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Career match</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Top job-fit recommendations</h1>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {careerRecommendations.map((career) => (
          <div key={career.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900">{career.name}</h2>
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">{career.match}%</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{career.reason}</p>
              </div>
              <Sparkles className="h-6 w-6 text-indigo-600" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-3 text-sm"><span className="text-slate-500">Required skills:</span> Python, SQL, Statistics</div>
              <div className="rounded-2xl bg-slate-50 p-3 text-sm"><span className="text-slate-500">Existing skills:</span> Python, SQL, Problem solving</div>
              <div className="rounded-2xl bg-slate-50 p-3 text-sm"><span className="text-slate-500">Missing skills:</span> Power BI, ML tuning</div>
              <div className="rounded-2xl bg-slate-50 p-3 text-sm"><span className="text-slate-500">Salary:</span> {career.salary}</div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => navigate('/explorer?search=' + encodeURIComponent(career.name))} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">View Career</button>
              <button onClick={() => setCompareCareer((current) => current === career.name ? '' : career.name)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">{compareCareer === career.name ? 'Comparing' : 'Compare'}</button>
              <button onClick={() => { setTargetCareer(career.name); localStorage.setItem('targetCareer', career.name); }} className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">{targetCareer === career.name ? 'Target selected' : 'Set as Target Career'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
