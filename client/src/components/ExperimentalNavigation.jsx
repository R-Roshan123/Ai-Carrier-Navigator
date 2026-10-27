import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight, Award, BrainCircuit, BriefcaseBusiness, Building2, BookOpen,
  Compass, FileText, FolderKanban, Goal, LayoutGrid, Map, MessageSquareText,
  Route, Settings, ShieldCheck, Sparkles, TrendingUp, UserRound, X,
} from 'lucide-react';
import { navItems } from '../data/seedData';

const icons = {
  LayoutDashboard: LayoutGrid, BrainCircuit, Sparkles, Compass, Goal, Route,
  Map, Building2, TrendingUp, Award, BookOpen, FolderKanban,
  BriefcaseBusiness, FileText, MessageSquareText, UserRound, Settings, ShieldCheck,
};

const sections = [
  { id: 'discover', number: '01', title: 'Discover', note: 'Find a direction', paths: ['/assessment', '/recommendations', '/explorer', '/skill-gap'] },
  { id: 'build', number: '02', title: 'Build', note: 'Grow your capabilities', paths: ['/roadmap', '/career/roles', '/career/progress', '/career/certificates', '/courses', '/projects'] },
  { id: 'launch', number: '03', title: 'Launch', note: 'Move into your next role', paths: ['/career/companies', '/jobs', '/resume', '/applications'] },
  { id: 'workspace', number: '04', title: 'Workspace', note: 'Your ongoing work', paths: ['/chat', '/profile', '/settings', '/admin/career'] },
];

export default function ExperimentalNavigation({ onClose, currentUser }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const handleKeys = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll('a[href], button:not([disabled])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => {
      window.removeEventListener('keydown', handleKeys);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [onClose]);

  const visibleItems = navItems.filter((item) => !item.adminOnly || currentUser?.role === 'admin');

  return (
    <div className="nav-map-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} className="nav-map-dialog" role="dialog" aria-modal="true" aria-labelledby="nav-map-title">
        <header className="nav-map-header">
          <div>
            <div className="nav-map-eyebrow">CAREERPILOT · NAVIGATION MAP</div>
            <h2 id="nav-map-title">Choose a direction.</h2>
            <p>Move between ideas, skills, and opportunities in the order that works for you.</p>
          </div>
          <button ref={closeRef} type="button" className="nav-map-close" onClick={onClose} aria-label="Close navigation map"><X size={20} /></button>
        </header>

        <div className="nav-map-canvas">
          <svg className="nav-map-lines" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
            <path d="M500 310 C400 260 360 180 280 150" />
            <path d="M500 310 C600 260 640 180 720 150" />
            <path d="M500 310 C400 360 360 440 280 470" />
            <path d="M500 310 C600 360 640 440 720 470" />
          </svg>
          <Link to="/dashboard" onClick={onClose} className="nav-map-home">
            <span className="nav-map-home-icon"><Compass size={21} /></span>
            <span><small>YOUR HUB</small><strong>Dashboard</strong></span>
            <ArrowUpRight className="nav-map-home-arrow" size={15} />
          </Link>

          {sections.map((section) => {
            const items = visibleItems.filter((item) => section.paths.includes(item.path));
            if (!items.length) return null;
            return (
              <section className={`nav-map-zone nav-map-zone-${section.id}`} key={section.id} aria-labelledby={`nav-map-${section.id}`}>
                <div className="nav-map-zone-heading"><span>{section.number}</span><div><h3 id={`nav-map-${section.id}`}>{section.title}</h3><p>{section.note}</p></div></div>
                <div className="nav-map-links">
                  {items.map((item) => {
                    const Icon = icons[item.icon] || Compass;
                    return <Link key={item.path} to={item.path} onClick={onClose} className="nav-map-link"><Icon size={16} /><span>{item.label}</span><ArrowUpRight size={13} className="nav-map-link-arrow" /></Link>;
                  })}
                </div>
              </section>
            );
          })}
        </div>
        <footer className="nav-map-footer"><span>EXPLORE AT YOUR OWN PACE</span><span>Press <kbd>ESC</kbd> to close</span></footer>
      </section>
    </div>
  );
}
