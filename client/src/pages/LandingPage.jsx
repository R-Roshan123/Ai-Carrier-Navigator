import { ArrowDownRight, ArrowRight, BookOpen, BrainCircuit, Briefcase, Check, Compass, Map, Sparkles, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { readCurrentUser } from '../utils/careerFormat';

const features = [
  { number: '01', title: 'Know your direction', description: 'A thoughtful assessment turns your strengths and interests into a clear starting point.', icon: BrainCircuit, color: 'bg-violet-100 text-violet-700' },
  { number: '02', title: 'Build the right skills', description: 'Follow a learning path shaped around the role you want and the skills you already have.', icon: Map, color: 'bg-lime-100 text-lime-800' },
  { number: '03', title: 'Move with confidence', description: 'Find relevant roles, sharpen your resume, and keep your progress in one place.', icon: Briefcase, color: 'bg-sky-100 text-sky-800' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const currentUser = readCurrentUser();
  const isLoggedIn = Boolean(currentUser && localStorage.getItem('token'));

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f4f0] text-[#171717]">
      <header className="relative z-20 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-9 lg:px-14">
        <a href="#top" className="flex items-center gap-3" aria-label="CareerPilot home">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171717] text-lime-300"><Sparkles className="h-5 w-5" /></span>
          <span className="text-lg font-bold tracking-tight">CareerPilot</span>
        </a>
        <nav className="hidden items-center gap-9 text-sm font-medium text-[#5d5d59] md:flex">
          <a className="transition hover:text-black" href="#approach">Our approach</a>
          <a className="transition hover:text-black" href="#tools">What you get</a>
          <a className="transition hover:text-black" href="#journey">Your journey</a>
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
        <button onClick={() => navigate('/login')} className="group inline-flex items-center gap-3 rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-black hover:bg-black hover:text-white">
          Log in <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>
      </header>

      <main id="top">
        <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 sm:px-9 sm:pb-24 lg:px-14 lg:pt-12">
          <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-8">
            <div className="relative z-10">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#585854]"><span className="h-2 w-2 rounded-full bg-violet-500" />A clearer way forward</div>
              <h1 className="max-w-3xl text-[clamp(3.6rem,8vw,7.8rem)] font-semibold leading-[0.88] tracking-[-0.075em]">Make your next move <span className="font-serif font-normal italic text-violet-700">count.</span></h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-[#62625e] sm:text-xl">A career plan built around you. Find your direction, grow the skills that matter, and take the next step with confidence.</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button onClick={() => navigate('/signup')} className="group inline-flex items-center gap-5 rounded-full bg-[#171717] px-6 py-4 text-sm font-semibold text-white transition hover:bg-violet-700">Build my career plan <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></button>
                <button onClick={() => navigate('/explorer')} className="inline-flex items-center gap-2 rounded-full px-5 py-4 text-sm font-semibold text-[#4c4c48] transition hover:bg-white">Explore careers <ArrowDownRight className="h-4 w-4" /></button>
              </div>
              <div className="mt-12 flex items-center gap-4 border-t border-black/10 pt-5 text-sm text-[#696964]">
                <div className="flex -space-x-2"><span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f5f4f0] bg-violet-200 text-[10px] font-bold text-violet-900">A</span><span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f5f4f0] bg-lime-200 text-[10px] font-bold text-lime-900">J</span><span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f5f4f0] bg-sky-200 text-[10px] font-bold text-sky-900">M</span></div>
                <span><strong className="text-[#171717]">One path at a time.</strong> Built for your goals.</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[610px] lg:ml-auto">
              <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-lime-300/70 blur-3xl" />
              <div className="absolute -bottom-10 -left-8 h-52 w-52 rounded-full bg-violet-300/60 blur-3xl" />
              <div className="relative rounded-[2rem] bg-[#171717] p-3 shadow-2xl shadow-black/15 sm:rotate-[2deg]">
                <div className="rounded-[1.45rem] bg-[#f9f9f6] p-5 sm:p-7">
                  <div className="flex items-center justify-between border-b border-black/10 pb-5">
                    <div><div className="text-xs font-medium text-[#85857f]">YOUR CAREER SNAPSHOT</div><div className="mt-1 text-lg font-semibold tracking-tight">A path taking shape</div></div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717] text-lime-300"><Sparkles className="h-4 w-4" /></span>
                  </div>
                  <div className="mt-6 rounded-2xl bg-[#ece9ff] p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3"><div><div className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">A strong match</div><div className="mt-2 text-2xl font-semibold tracking-tight">Product Designer</div><div className="mt-1 text-sm text-[#666174]">Creative thinking · User empathy · Research</div></div><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[5px] border-violet-600/20 border-t-violet-600 text-xs font-bold text-violet-800">86%</div></div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-black/10 bg-white p-4"><div className="text-xs text-[#85857f]">SKILLS MATCHED</div><div className="mt-2 text-2xl font-semibold">8 <span className="text-sm font-normal text-[#85857f]">of 12</span></div><div className="mt-3 h-1.5 rounded-full bg-[#ecebe6]"><div className="h-full w-2/3 rounded-full bg-violet-600" /></div></div>
                    <div className="rounded-2xl border border-black/10 bg-white p-4"><div className="text-xs text-[#85857f]">NEXT MILESTONE</div><div className="mt-2 text-base font-semibold">Build a portfolio</div><div className="mt-2 text-xs text-[#85857f]">A 3-week guided project</div></div>
                  </div>
                  <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#eaf2dc] p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-300"><Check className="h-4 w-4" /></span><div><div className="text-sm font-semibold">Your next step is ready</div><div className="mt-0.5 text-xs text-[#696e60]">A practical roadmap, made for you.</div></div><ArrowRight className="ml-auto h-4 w-4" /></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-3 hidden rounded-full border border-black/10 bg-white px-5 py-3 text-xs font-semibold shadow-lg sm:block">Progress that feels like yours <span className="ml-2 text-violet-700">↗</span></div>
            </div>
          </div>
        </section>

        <section id="approach" className="bg-[#171717] px-5 py-20 text-white sm:px-9 sm:py-28 lg:px-14">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
              <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">The approach</p><p className="mt-4 text-sm text-white/50">A little clarity goes a long way.</p></div>
              <h2 className="max-w-4xl text-4xl font-medium leading-[1.05] tracking-[-0.05em] sm:text-6xl lg:text-7xl">Less guessing. More <span className="font-serif italic text-lime-300">forward.</span></h2>
            </div>
            <div className="mt-14 grid border-t border-white/15 md:grid-cols-3">
              {features.map(({ number, title, description, icon: Icon, color }) => (
                <article key={number} className="group border-b border-white/15 py-7 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                  <div className="flex items-center justify-between"><span className="text-xs text-white/40">{number}</span><span className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}><Icon className="h-5 w-5" /></span></div>
                  <h3 className="mt-8 text-2xl font-medium tracking-tight">{title}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-white/55">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="tools" className="mx-auto max-w-[1440px] px-5 py-20 sm:px-9 sm:py-28 lg:px-14">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">Your toolkit</p><h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Everything you need to make progress.</h2></div><p className="max-w-sm text-base leading-7 text-[#696964]">One connected workspace for every step between “what if?” and “I’m ready.”</p></div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Target, title: 'Career assessment', note: 'Get to know what fits you.' },
              { icon: Compass, title: 'Career explorer', note: 'See where your strengths lead.' },
              { icon: BookOpen, title: 'Learning roadmap', note: 'Know what to learn next.' },
              { icon: Briefcase, title: 'Job matching', note: 'Find roles that match your path.' },
            ].map(({ icon: Icon, title, note }, i) => (
              <article key={title} className={`min-h-56 rounded-[1.5rem] p-6 transition hover:-translate-y-1 ${['bg-[#e9e5ff]', 'bg-[#e6efda]', 'bg-[#e1edf2]', 'bg-[#f0e5dc]'][i]}`}>
                <div className="flex items-center justify-between"><Icon className="h-6 w-6" /><span className="text-xs opacity-50">0{i + 1}</span></div><h3 className="mt-12 text-xl font-semibold tracking-tight">{title}</h3><p className="mt-2 text-sm opacity-65">{note}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="journey" className="px-5 pb-20 sm:px-9 sm:pb-28 lg:px-14">
          <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 rounded-[2rem] bg-violet-700 p-8 text-white sm:p-12 lg:flex-row lg:items-end lg:p-16">
            <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">Your next chapter</p><h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl">You don’t need the whole map. Just the next step.</h2><p className="mt-5 max-w-xl text-base leading-7 text-white/70">Start with where you are. We’ll help you figure out where to go.</p></div>
            <button onClick={() => navigate('/signup')} className="group inline-flex shrink-0 items-center gap-5 rounded-full bg-lime-300 px-6 py-4 text-sm font-semibold text-[#171717] transition hover:bg-white">Start your journey <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></button>
          </div>
        </section>
      </main>
      <footer className="border-t border-black/10 px-5 py-6 sm:px-9 lg:px-14"><div className="mx-auto flex max-w-[1440px] items-center justify-between text-xs text-[#777771]"><span>© CareerPilot</span><span>Find your direction. Move forward.</span></div></footer>
    </div>
  );
}
