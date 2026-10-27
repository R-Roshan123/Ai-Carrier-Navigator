import { ArrowRight, BookOpen, BrainCircuit, Briefcase, Map, Rocket, Sparkles, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { readCurrentUser } from '../utils/careerFormat';

const steps = [
  'Create your profile',
  'Take AI assessment',
  'Discover suitable careers',
  'Identify skill gaps',
  'Follow your learning roadmap',
  'Build projects',
  'Find matching jobs',
  'Prepare for interviews',
];

const features = [
  { title: 'AI Career Assessment', description: 'Understand your strengths, interests, and work style with adaptive guidance.', icon: BrainCircuit },
  { title: 'Personalized Roadmaps', description: 'Get step-by-step learning plans based on your target career path.', icon: Map },
  { title: 'Job Matching', description: 'Discover the roles where your profile and skills have the strongest fit.', icon: Briefcase },
  { title: 'Resume Intelligence', description: 'Turn your experience into a polished, high-performing resume story.', icon: BookOpen },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const currentUser = readCurrentUser();
  const isLoggedIn = Boolean(currentUser && localStorage.getItem('token'));

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f7f8fc] text-slate-900">
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between px-4 py-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
              <div className="text-xl font-bold tracking-tight">AI Career</div>
              <div className="text-sm text-slate-500">Navigator</div>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-base font-medium text-slate-600 md:flex">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <a href="#journey">Career journey</a>
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button onClick={() => navigate(currentUser.role === 'admin' ? '/admin/career' : '/dashboard')} className="rounded-full bg-indigo-600 px-5 py-2.5 text-base font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              {currentUser.role === 'admin' ? 'Admin panel' : 'Go to dashboard'}
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/admin/login')} className="hidden rounded-full px-4 py-2.5 text-base font-semibold text-slate-600 transition hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:inline-flex">Admin login</button>
              <button onClick={() => navigate('/login')} className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-base font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Student login</button>
              <button onClick={() => navigate('/signup')} className="hidden rounded-full bg-indigo-600 px-5 py-2.5 text-base font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 md:inline-flex">Sign up</button>
            </>
          )}
        </div>
        </div>
      </header>

      <main>
        <section className="flex min-h-[calc(100vh-80px)] w-full items-center bg-[radial-gradient(circle_at_top_right,#dbeafe,transparent_42%),linear-gradient(135deg,#f8fafc,#eef2ff)] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-base font-semibold text-indigo-700 shadow-sm">
              <Target className="h-4 w-4" />
              Personal AI career guidance
            </div>
            <h1 className="max-w-4xl text-5xl font-bold leading-[0.98] tracking-tight text-slate-950 sm:text-6xl lg:text-8xl">
              Navigate Your Career With AI
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-8 text-slate-600 lg:text-2xl lg:leading-9">
              Discover the right career, identify your skill gaps, build the skills you need, and become job-ready with your personal AI career navigator.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => navigate('/assessment')} className="inline-flex items-center gap-3 rounded-full bg-indigo-600 px-7 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-1 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Start Career Assessment
                <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => navigate('/explorer')} className="rounded-full border border-slate-300 bg-white/80 px-7 py-4 text-base font-bold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Explore Careers</button>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 text-base text-slate-600 lg:gap-12 lg:text-lg">
              <div><span className="font-bold text-slate-900">24k+</span> learners guided</div>
              <div><span className="font-bold text-slate-900">92%</span> pathway fit rate</div>
              <div><span className="font-bold text-slate-900">1.4k+</span> opportunities</div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/60 p-4 shadow-2xl shadow-indigo-900/10 backdrop-blur-sm transition hover:-translate-y-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-base text-slate-500">Target Career</div>
                  <div className="text-2xl font-bold text-slate-900">AI Engineer</div>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">92%</div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-indigo-50 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Career readiness</span>
                    <span className="font-semibold text-slate-900">78/100</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-white">
                    <div className="h-full w-[78%] rounded-full bg-indigo-600" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Skill progress</div>
                    <div className="mt-3 text-2xl font-bold text-slate-900">73%</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Learning progress</div>
                    <div className="mt-3 text-2xl font-bold text-slate-900">64%</div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 text-sm font-semibold text-slate-900">Recommended actions</div>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Complete SQL module</li>
                    <li>• Build your ML project</li>
                    <li>• Improve your resume</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-slate-50 py-20">
          <div className="w-full px-5 sm:px-8 lg:px-12">
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">How it works</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">Take the next step with clarity</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {steps.map((step, index) => (
                <div key={step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-base font-bold text-indigo-700">
                    {index + 1}
                  </div>
                  <p className="text-lg font-semibold text-slate-800">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="w-full px-5 py-20 sm:px-8 lg:px-12">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Features</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">Everything you need to build a clear career path</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">{title}</h3>
                <p className="text-base leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="journey" className="bg-slate-50 py-20">
          <div className="w-full px-5 sm:px-8 lg:px-12">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Career journey</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">From exploration to opportunity</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-sm font-medium text-slate-700">
              {['Profile', 'Assessment', 'Career', 'Skills', 'Learning', 'Projects', 'Resume', 'Jobs', 'Application'].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">{item}</div>
                  {index < 8 ? <ArrowRight className="h-4 w-4 text-slate-400" /> : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full px-5 py-24 text-center sm:px-8 lg:px-12">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">Build the career you want.</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600 lg:text-xl">Create your personalized strategy, unlock job-ready skills, and move with confidence toward the career you truly want.</p>
          <button onClick={() => navigate('/assessment')} className="mt-9 inline-flex items-center gap-3 rounded-full bg-indigo-600 px-7 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-1 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Start your journey
            <Rocket className="h-4 w-4" />
          </button>
        </section>
      </main>
    </div>
  );
}
