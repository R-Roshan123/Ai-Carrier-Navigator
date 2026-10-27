import { useRef } from 'react';
import { ArrowDownRight, ArrowUpRight, BrainCircuit, BriefcaseBusiness, GraduationCap, Route, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import ColorModeToggle from '../ColorModeToggle';

export const authInputClass = 'mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500';

export default function AuthLayout({ portal, mode, eyebrow, title, description, wide = false, children, footer }) {
  const sceneRef = useRef(null);
  const tabs = [
    { key: 'student', label: 'Student', icon: GraduationCap, to: mode === 'signup' ? '/signup' : '/login' },
    { key: 'admin', label: 'Admin', icon: ShieldCheck, to: mode === 'signup' ? '/admin/signup' : '/admin/login' },
  ];

  const moveScene = (event) => {
    if (event.pointerType === 'touch' || !sceneRef.current) return;
    const bounds = sceneRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    sceneRef.current.style.setProperty('--scene-rotate-y', `${x * 8}deg`);
    sceneRef.current.style.setProperty('--scene-rotate-x', `${y * -7}deg`);
  };

  const resetScene = () => {
    if (!sceneRef.current) return;
    sceneRef.current.style.setProperty('--scene-rotate-y', '0deg');
    sceneRef.current.style.setProperty('--scene-rotate-x', '0deg');
  };

  return (
    <main className="auth-page auth-experience">
      <div className="auth-toolbar"><ColorModeToggle /></div>
      <div className="auth-experience-grid">
        <aside className="auth-showcase">
          <div className="auth-showcase-copy">
            <Link to="/" className="auth-brand"><span className="auth-brand-mark"><Sparkles size={17} /></span><span>AI Career Navigator</span></Link>
            <div className="auth-showcase-kicker"><span /> YOUR NEXT CHAPTER STARTS HERE</div>
            <h2>Make a move<br /><span>that means something.</span></h2>
            <p>Turn what you know into where you’re going. Find your direction, build the skills, and see your next step take shape.</p>
          </div>

          <div ref={sceneRef} className="auth-scene" onPointerMove={moveScene} onPointerLeave={resetScene} aria-label="Interactive career path illustration">
            <div className="auth-scene-grid" />
            <svg className="auth-scene-route" viewBox="0 0 720 430" fill="none" aria-hidden="true">
              <path className="auth-route-base" d="M70 314C168 314 164 230 269 230C380 230 358 133 465 133C547 133 552 81 652 81" />
              <path className="auth-route-draw" d="M70 314C168 314 164 230 269 230C380 230 358 133 465 133C547 133 552 81 652 81" />
            </svg>
            <div className="auth-scene-orbit auth-scene-orbit-one" />
            <div className="auth-scene-orbit auth-scene-orbit-two" />
            <div className="auth-scene-core-wrap">
              <div className="auth-scene-core"><div className="auth-core-face"><BrainCircuit size={28} /><span>YOUR<br />POTENTIAL</span></div><div className="auth-core-side" /></div>
            </div>
            <div className="auth-scene-node auth-node-discover"><span className="auth-node-icon"><BrainCircuit size={15} /></span><span><small>01 / DISCOVER</small><strong>Find your direction</strong></span></div>
            <div className="auth-scene-node auth-node-build"><span className="auth-node-icon"><Route size={15} /></span><span><small>02 / BUILD</small><strong>Grow your skills</strong></span></div>
            <div className="auth-scene-node auth-node-launch"><span className="auth-node-icon"><BriefcaseBusiness size={15} /></span><span><small>03 / LAUNCH</small><strong>Make your next move</strong></span></div>
            <div className="auth-scene-coordinate">CAREER MAP <span>·</span> 001</div>
            <div className="auth-scene-scroll" aria-hidden="true"><span>MOVE FORWARD</span><ArrowDownRight size={14} /></div>
          </div>

          <div className="auth-showcase-bottom"><span>ONE STEP AT A TIME</span><span className="auth-showcase-line" /><span>01 — 03</span></div>
        </aside>

        <section className={`auth-panel ${wide ? 'auth-panel-wide' : ''}`}>
          <div className="auth-panel-brand"><span className="auth-brand-mark"><Sparkles size={16} /></span><span>AI Career Navigator</span></div>

          <div className="auth-tabs" role="tablist" aria-label="Account type">
            {tabs.map(({ key, label, icon: Icon, to }) => (
              <NavLink key={key} to={to} role="tab" aria-selected={portal === key} className={`auth-tab ${portal === key ? 'is-active' : ''}`}>
                <Icon size={15} />{label}
              </NavLink>
            ))}
          </div>

          <div className="auth-panel-heading">
            <div className="auth-eyebrow">{eyebrow}</div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          {children}
          <div className="auth-panel-footer">{footer}</div>
          <div className="auth-panel-note"><span className="auth-note-rule" />A clearer path forward, built around you.</div>
          <ArrowUpRight className="auth-panel-arrow" size={17} aria-hidden="true" />
        </section>
      </div>
    </main>
  );
}
