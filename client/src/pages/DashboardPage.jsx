import { ArrowRight, ArrowUpRight, BookOpen, Briefcase, Sparkles, Star, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import ProgressRing from '../components/ProgressRing';
import { dashboardInsight } from '../data/seedData';
import { allRoles } from '../data/roleCareerData';
import { readScores } from '../utils/assessmentScores';
import { useNavigate } from 'react-router-dom';

const chartData = [
  { name: 'Jan', score: 45 },
  { name: 'Feb', score: 50 },
  { name: 'Mar', score: 56 },
  { name: 'Apr', score: 60 },
  { name: 'May', score: 68 },
  { name: 'Jun', score: 73 },
  { name: 'Jul', score: 78 },
];

const getCurrentUserName = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null')?.name || 'there';
  } catch {
    return 'there';
  }
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const userName = getCurrentUserName();
  const scores = readScores();
  // Top roles by assessment score; unassessed roles fill the list in catalogue order.
  const topRoles = allRoles
    .map((role, index) => ({ ...role, score: scores[role.slug], index }))
    .sort((a, b) => (b.score?.best ?? -1) - (a.score?.best ?? -1) || a.index - b.index)
    .slice(0, 3);
  const bestMatch = topRoles[0].score?.best;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-950/10 sm:px-8 sm:py-8">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-violet-400/10 blur-2xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100"><Sparkles className="h-3.5 w-3.5" /> YOUR CAREER WORKSPACE</div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Good evening, {userName}.</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">You are making great progress. One focused session today will keep your career plan on track.</p>
          </div>
          <button onClick={() => navigate('/assessment')} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-indigo-50">
            Continue assessment <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Career match" value={bestMatch === undefined ? '—' : `${bestMatch}%`} change={bestMatch === undefined ? 'Take an assessment' : topRoles[0].title} icon={Sparkles} />
        <StatCard label="Career readiness" value="78/100" change="+4%" icon={Star} />
        <StatCard label="Skill progress" value="73%" change="+9%" icon={BookOpen} />
        <StatCard label="Applications" value="12" change="+3" icon={Briefcase} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Skill progress chart</div>
              <h2 className="text-xl font-bold text-slate-900">Career momentum</h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><TrendingUp className="h-3 w-3" /> +12% this month</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#64748B" />
                <YAxis tickLine={false} axisLine={false} stroke="#64748B" />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#4F46E5" fill="url(#colorScore)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
          <div className="mb-5 flex items-center justify-between"><div className="text-sm font-medium text-slate-500">Career readiness</div><span className="text-xs font-semibold text-indigo-600">On track</span></div>
          <div className="flex justify-center">
            <ProgressRing value={78} label="Career readiness" />
          </div>
          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm leading-6 text-slate-600">
            <span className="font-semibold text-slate-800">Biggest improvement opportunity:</span> Interview preparation.
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div><div className="text-sm text-slate-500">Based on your profile</div><h2 className="text-xl font-bold text-slate-900">Recommended careers</h2></div>
            <button onClick={() => navigate('/recommendations')} className="text-sm font-semibold text-indigo-600">View all →</button>
          </div>
          <div className="space-y-4">
            {topRoles.map((career) => (
              <div key={career.slug} className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">{career.title}</h3>
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">{career.score ? `${career.score.best}% match` : 'Not assessed'}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{career.overview}</p>
                </div>
                <button onClick={() => navigate(career.score ? '/recommendations' : `/assessment?role=${career.slug}`)} className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600">{career.score ? 'View career' : 'Take assessment'} <ArrowRight className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white"><Sparkles className="h-4 w-4" /></span> AI insight</div>
            <p className="text-sm leading-6 text-slate-600">{dashboardInsight}</p>
            <button onClick={() => navigate('/roadmap')} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">Review roadmap <ArrowRight className="h-4 w-4" /></button>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
            <div className="mb-4 flex items-center justify-between"><div className="text-lg font-bold text-slate-900">Recommended jobs</div><button onClick={() => navigate('/jobs')} className="text-xs font-semibold text-indigo-600">See jobs</button></div>
            <div className="space-y-4">
              {topRoles.slice(0, 2).map(({ job, score }) => (
                <div key={job.title} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{job.title}</div>
                      <div className="text-sm text-slate-500">{job.company}</div>
                    </div>
                    {score && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">{score.best}%</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
