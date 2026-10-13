import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/admin/career', label: 'Overview', end: true },
  { to: '/admin/career/verification', label: 'Verification queue' },
  { to: '/admin/career/roles', label: 'Job roles' },
  { to: '/admin/career/roadmaps', label: 'Roadmaps' },
  { to: '/admin/career/companies', label: 'Companies' },
  { to: '/admin/career/certifications', label: 'Certifications' },
];

export default function AdminCareerNav() {
  return (
    <div className="space-y-3">
      <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Career admin</div>
      <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1" aria-label="Career admin sections">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
