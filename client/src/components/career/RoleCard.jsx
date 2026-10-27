import { Building2, Clock, ListChecks, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Chip } from './CareerUi';
import { formatHours } from '../../utils/careerFormat';

const DEMAND_STYLES = {
  'Very High': 'bg-emerald-50 text-emerald-700',
  High: 'bg-sky-50 text-sky-700',
  Medium: 'bg-amber-50 text-amber-800',
  Low: 'bg-slate-100 text-slate-600',
};

export default function RoleCard({ role, isTarget = false }) {
  return (
    <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{role.category}</span>
        <div className="flex items-center gap-2">
          {isTarget && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium text-white">
              <Target className="h-3 w-3" /> Target
            </span>
          )}
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${DEMAND_STYLES[role.demandLevel] || DEMAND_STYLES.Low}`}>
            {role.demandLevel} demand
          </span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900">{role.title}</h2>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{role.experienceLevel} level</p>
      <p className="mt-2 line-clamp-3 text-sm text-slate-600">{role.description}</p>

      {role.salaryRange?.india && (
        <p className="mt-3 text-sm text-slate-700">
          <span className="font-semibold">{role.salaryRange.india}</span>
          {role.salaryRange.global && <span className="text-slate-500"> · {role.salaryRange.global}</span>}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {role.skills.slice(0, 4).map((skill) => (
          <Chip key={skill}>{skill}</Chip>
        ))}
        {role.skills.length > 4 && <Chip>+{role.skills.length - 4} more</Chip>}
      </div>

      {role.stepCount !== undefined && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1"><ListChecks className="h-3.5 w-3.5" />{role.stepCount} steps</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatHours(role.totalHours)}</span>
          <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{role.companyCount} companies</span>
        </div>
      )}

      <div className="mt-auto pt-5">
        <Link to={`/career/roles/${role.slug}`} className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          View roadmap
        </Link>
      </div>
    </article>
  );
}
