import { ArrowRight, ArrowUpRight, Award, BookOpen, Sparkles, Star, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import ProgressRing from '../components/ProgressRing';
import { dashboardInsight } from '../data/seedData';
import { allRoles } from '../data/roleCareerData';
import { readScores } from '../utils/assessmentScores';
import useApiData from '../hooks/useApiData';
import { courseApi } from '../services/courseApi';
import { summarizeLearning } from '../utils/learningProgress';
import { matchJobs } from '../utils/jobMatch';
import { readTargetCareer } from '../utils/targetCareer';
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

  // Roadmap progress for the target career, or the most advanced roadmap if none is set.
  const learning = useApiData(() => courseApi.getProgress(), []);
  const learningByRole = allRoles.map((role) => ({ role, summary: summarizeLearning(learning.data, role) }));
  const focus =
    learningByRole.find((item) => item.role.title === readTargetCareer()) ||
    [...learningByRole].sort((a, b) => b.summary.roadmapPercent - a.summary.roadmapPercent)[0];
  const focusStarted = learning.data && (focus.summary.started || focus.role.title === readTargetCareer());
  const learningBySlug = Object.fromEntries(learningByRole.map((item) => [item.role.slug, item.summary]));
  const jobMatches = matchJobs(scores, learning.data).slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="dashboard-hero">
        <div className="dashboard-hero-grid" aria-hidden="true" />
        <div className="dashboard-hero-copy">
          <div className="dashboard-kicker"><span className="dashboard-live-dot" /> CAREER JOURNEY / OVERVIEW</div>
          <h1>Make your next move <em>count.</em></h1>
          <p>Welcome back, {userName}. Your next step is waiting. Keep your momentum and turn today’s effort into tomorrow’s opportunity.</p>
          <button onClick={() => navigate('/assessment')} className="dashboard-hero-cta">
            Continue your journey <ArrowUpRight className="h-4 w-4" />
          </button>
          <div className="dashboard-hero-footnote"><span>01</span><span className="dashboard-footnote-rule" /> YOUR PERSONAL CAREER SYSTEM</div>
        </div>
        <div className="career-orbit" aria-label="Your career path from insight to opportunity">
          <svg className="career-orbit-path" viewBox="0 0 420 320" fill="none" aria-hidden="true">
            <path d="M54 252C92 239 93 178 157 178C222 178 201 93 273 93C323 93 314 53 367 47" stroke="url(#careerPathGradient)" strokeWidth="2" strokeDasharray="5 8" />
            <defs><linearGradient id="careerPathGradient" x1="54" y1="252" x2="367" y2="47" gradientUnits="userSpaceOnUse"><stop stopColor="#FFFFFF" /><stop offset="1" stopColor="#888888" /></linearGradient></defs>
          </svg>
          <div className="orbit-node orbit-node-one"><span className="orbit-node-icon">01</span><span><small>DISCOVER</small><strong>Your strengths</strong></span></div>
          <div className="orbit-node orbit-node-two"><span className="orbit-node-icon">02</span><span><small>BUILD</small><strong>New skills</strong></span></div>
          <div className="orbit-node orbit-node-three"><span className="orbit-node-icon">03</span><span><small>MOVE</small><strong>With confidence</strong></span></div>
          <div className="orbit-center"><Sparkles className="h-5 w-5" /><span>YOUR<br />NEXT CHAPTER</span></div>
          <div className="orbit-caption"><span className="orbit-caption-pulse" /> PLAN ACTIVE <b>↗</b></div>
        </div>
      </div>

      <div className="dashboard-stats grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Career match" value={bestMatch === undefined ? '—' : `${bestMatch}%`} change={bestMatch === undefined ? 'Take an assessment' : topRoles[0].title} icon={Sparkles} />
        <StatCard label="Career readiness" value="78/100" change="+4%" icon={Star} />
        <StatCard label="Roadmap progress" value={focusStarted ? `${focus.summary.roadmapPercent}%` : '—'} change={focusStarted ? focus.role.title : 'Start a roadmap'} icon={BookOpen} />
        <StatCard label="Certificates earned" value={learning.data ? learning.data.certificates.length : '—'} change="From courses" icon={Award} />
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
                    <stop offset="5%" stopColor="#171717" stopOpacity={0.14} />
                    <stop offset="95%" stopColor="#171717" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#dedede" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#888888" />
                <YAxis tickLine={false} axisLine={false} stroke="#888888" />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#171717" fill="url(#colorScore)" strokeWidth={3} />
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
                  {learningBySlug[career.slug].started && (
                    <p className="mt-1 text-xs font-medium text-indigo-700">
                      Roadmap {learningBySlug[career.slug].roadmapPercent}% · Course {learningBySlug[career.slug].lessonsDone}/{learningBySlug[career.slug].lessonsTotal} lessons{learningBySlug[career.slug].certificate ? ' · Certified' : ''}
                    </p>
                  )}
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
              {!jobMatches.length && <p className="text-sm text-slate-600">Take an assessment or start a course to see jobs matched to you.</p>}
              {jobMatches.map(({ job, match }) => (
                <div key={job.title} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{job.title}</div>
                      <div className="text-sm text-slate-500">{job.company}</div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">{match}% match</span>
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
