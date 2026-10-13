import { ArrowLeft, ExternalLink, Globe, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { CompanyLogo } from '../../components/career/CareerUi';
import { EmptyState, ErrorState, LoadingState } from '../../components/career/PageState';
import useApiData from '../../hooks/useApiData';
import { careerApi } from '../../services/careerApi';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const company = useApiData(() => careerApi.getCompany(id), [id]);

  const back = (
    <Link to="/career/companies" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
      <ArrowLeft className="h-4 w-4" />All companies
    </Link>
  );

  if (company.error) {
    return (
      <div className="space-y-4">
        {back}
        <ErrorState message={company.error} onRetry={company.reload} />
      </div>
    );
  }
  if (!company.data) return <LoadingState label="Loading company..." />;
  const current = company.data.company;

  return (
    <div className="space-y-6">
      {back}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <CompanyLogo name={current.name} logoUrl={current.logoUrl} size="h-16 w-16" />
          <div className="min-w-0 flex-1">
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{current.companyType}</span>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{current.name}</h1>
            {current.description && <p className="mt-2 text-slate-600">{current.description}</p>}
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              {current.locations.length > 0 && (
                <span className="inline-flex items-start gap-1.5"><MapPin className="mt-0.5 h-4 w-4 text-slate-400" />{current.locations.join(', ')}</span>
              )}
              {current.packageRange && <span className="font-semibold text-slate-900">{current.packageRange}</span>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {current.careersUrl && (
              <a href={current.careersUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                Careers page <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {current.website && (
              <a href={current.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Globe className="h-3.5 w-3.5" /> Website
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Hiring process</h2>
          {current.hiringProcess ? (
            <ol className="mt-3 space-y-2">
              {current.hiringProcess.split('→').map((stage, index) => (
                <li key={stage} className="flex gap-3 text-sm text-slate-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">{index + 1}</span>
                  <span className="pt-0.5">{stage.trim()}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No hiring process details yet.</p>
          )}
          <p className="mt-4 text-xs text-slate-500">Packages and processes change each hiring season – confirm on the careers page.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Roles {current.name} hires for</h2>
          {current.roles.length ? (
            <ul className="grid gap-3 sm:grid-cols-2">
              {current.roles.map((role) => (
                <li key={role.id}>
                  <Link to={`/career/roles/${role.slug}`} className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200">
                    <div className="text-xs text-slate-500">{role.category}</div>
                    <div className="font-semibold text-slate-900">{role.title}</div>
                    <div className="mt-1 text-sm font-medium text-indigo-600">View roadmap →</div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No roles linked yet" />
          )}
        </section>
      </div>
    </div>
  );
}
