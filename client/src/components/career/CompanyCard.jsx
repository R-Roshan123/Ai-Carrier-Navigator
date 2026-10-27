import { ExternalLink, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CompanyLogo } from './CareerUi';

export default function CompanyCard({ company, showRoles = false }) {
  return (
    <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <CompanyLogo name={company.name} logoUrl={company.logoUrl} />
        <div className="min-w-0">
          <Link to={`/career/companies/${company.id}`} className="text-lg font-bold text-slate-900 hover:text-indigo-700">
            {company.name}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">{company.companyType}</span>
            {company.packageRange && <span className="text-slate-600">{company.packageRange}</span>}
          </div>
        </div>
      </div>

      {company.locations?.length > 0 && (
        <p className="mt-3 flex items-start gap-1.5 text-sm text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <span>{company.locations.join(', ')}</span>
        </p>
      )}

      {company.hiringProcess && <p className="mt-3 line-clamp-3 text-sm text-slate-600">{company.hiringProcess}</p>}

      {showRoles && company.roles?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {company.roles.map((role) => (
            <Link key={role.id} to={`/career/roles/${role.slug}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-700">
              {role.title}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Link to={`/career/companies/${company.id}`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          Details
        </Link>
        {company.careersUrl && (
          <a href={company.careersUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Careers page <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
