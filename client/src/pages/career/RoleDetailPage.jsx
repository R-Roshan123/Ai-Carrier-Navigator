import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Building2, Clock, Hourglass, ListChecks, Target, TrendingUp } from 'lucide-react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import CompanyCard from '../../components/career/CompanyCard';
import CertificationCard from '../../components/career/CertificationCard';
import RoadmapTimeline from '../../components/career/RoadmapTimeline';
import { CardSkeleton, EmptyState, ErrorState, InlineAlert, LoadingState } from '../../components/career/PageState';
import { Chip, SelectFilter, Tabs } from '../../components/career/CareerUi';
import useApiData from '../../hooks/useApiData';
import { careerApi, getErrorMessage } from '../../services/careerApi';
import { formatHours, formatWeeks } from '../../utils/careerFormat';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'companies', label: 'Companies' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'certifications', label: 'Certifications' },
];

function OverviewTab({ role }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-5">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Responsibilities</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {role.responsibilities.map((item) => (
              <li key={item} className="flex gap-2"><span className="text-indigo-600">•</span>{item}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Required skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {role.skills.map((skill) => <Chip key={skill} tone="indigo">{skill}</Chip>)}
          </div>
          <h2 className="mt-5 text-lg font-bold text-slate-900">Tools & technologies</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {role.tools.map((tool) => <Chip key={tool}>{tool}</Chip>)}
          </div>
        </section>
      </div>
      <div className="space-y-5">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Salary range</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-slate-500">India</dt><dd className="font-semibold text-slate-900">{role.salaryRange.india || '—'}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Global</dt><dd className="font-semibold text-slate-900">{role.salaryRange.global || '—'}</dd></div>
          </dl>
          <p className="mt-3 text-xs text-slate-500">Approximate market ranges; actual offers vary by company, city, and experience.</p>
        </section>
        {role.growthOutlook && (
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><TrendingUp className="h-5 w-5 text-emerald-600" />Demand & growth</h2>
            <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">{role.demandLevel} demand.</span> {role.growthOutlook}</p>
          </section>
        )}
        {role.relatedRoles.length > 0 && (
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Related roles</h2>
            <ul className="mt-3 space-y-2">
              {role.relatedRoles.map((related) => (
                <li key={related.id}>
                  <Link to={`/career/roles/${related.slug}`} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm hover:bg-indigo-50">
                    <span className="font-medium text-slate-800">{related.title}</span>
                    <span className="text-xs text-slate-500">{related.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

function CompaniesTab({ roleId }) {
  const companies = useApiData(() => careerApi.getRoleCompanies(roleId), [roleId]);
  if (companies.error) return <ErrorState message={companies.error} onRetry={companies.reload} />;
  if (!companies.data) return <CardSkeleton count={3} />;
  if (!companies.data.companies.length) {
    return <EmptyState icon={Building2} title="No companies listed yet" message="An admin hasn't linked any companies to this role yet." />;
  }
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {companies.data.companies.map((company) => <CompanyCard key={company.id} company={company} />)}
    </div>
  );
}

function RoadmapTab({ role, isTarget, onTrack, trackDisabledReason }) {
  const location = useLocation();
  const roadmap = useApiData(() => careerApi.getRoleRoadmap(role.id), [role.id]);
  const progress = useApiData(() => (isTarget ? careerApi.getRoleProgress(role.id) : Promise.resolve(null)), [role.id, isTarget]);
  const [statuses, setStatuses] = useState({});
  const [updatingStepId, setUpdatingStepId] = useState(null);
  const [error, setError] = useState('');
  const openStepId = Number(location.hash.replace('#step-', '')) || null;

  useEffect(() => {
    const steps = progress.data?.progress.stages.flatMap((stage) => stage.steps) || [];
    setStatuses(Object.fromEntries(steps.map((step) => [step.id, step.status])));
  }, [progress.data]);

  useEffect(() => {
    if (!openStepId || !roadmap.data) return;
    document.getElementById(`step-${openStepId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [openStepId, roadmap.data]);

  const totals = useMemo(() => {
    const steps = roadmap.data?.roadmap.stages.flatMap((stage) => stage.steps) || [];
    const done = steps.filter((step) => statuses[step.id] === 'Completed');
    const doneHours = done.reduce((sum, step) => sum + step.estimatedHours, 0);
    const totalHours = roadmap.data?.roadmap.totalHours || 0;
    return { steps: steps.length, done: done.length, totalHours, remainingHours: totalHours - doneHours };
  }, [roadmap.data, statuses]);

  // Optimistic update; rolled back if the API call fails.
  const changeStatus = async (stepId, status) => {
    const previous = statuses[stepId];
    setStatuses((current) => ({ ...current, [stepId]: status }));
    setUpdatingStepId(stepId);
    setError('');
    try {
      await careerApi.updateStepStatus(role.id, stepId, status);
    } catch (requestError) {
      setStatuses((current) => ({ ...current, [stepId]: previous }));
      setError(getErrorMessage(requestError, 'Could not update the step.'));
    } finally {
      setUpdatingStepId(null);
    }
  };

  if (roadmap.error) return <ErrorState message={roadmap.error} onRetry={roadmap.reload} />;
  if (!roadmap.data || (isTarget && progress.loading && !progress.data)) return <LoadingState label="Loading roadmap..." />;
  if (!roadmap.data.roadmap.stages.length) {
    return <EmptyState icon={ListChecks} title="Roadmap coming soon" message="An admin hasn't published a roadmap for this role yet." />;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500"><Clock className="h-4 w-4" />Estimated total time</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{formatHours(totals.totalHours)}</div>
          <div className="text-xs text-slate-500">{formatWeeks(totals.totalHours)}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500"><Hourglass className="h-4 w-4" />Time remaining</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{formatHours(isTarget ? totals.remainingHours : totals.totalHours)}</div>
          <div className="text-xs text-slate-500">{formatWeeks(isTarget ? totals.remainingHours : totals.totalHours)}</div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-500"><ListChecks className="h-4 w-4" />Steps completed</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{isTarget ? `${totals.done}/${totals.steps}` : `0/${totals.steps}`}</div>
          {isTarget && <Link to={`/career/progress?role=${role.id}`} className="text-xs font-medium text-indigo-600">View full progress report</Link>}
        </div>
      </div>

      {!isTarget && (
        <div className="flex flex-col gap-3 rounded-3xl border border-indigo-200 bg-indigo-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-700">Set this as a target role to mark steps as In Progress or Completed and get a readiness score.</p>
          <button onClick={onTrack} disabled={Boolean(trackDisabledReason)} title={trackDisabledReason} className="shrink-0 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50">
            Set as my target role
          </button>
        </div>
      )}
      {error && <InlineAlert>{error}</InlineAlert>}
      {progress.error && <ErrorState message={progress.error} onRetry={progress.reload} />}

      <RoadmapTimeline
        stages={roadmap.data.roadmap.stages}
        statuses={statuses}
        onStatusChange={isTarget ? changeStatus : undefined}
        updatingStepId={updatingStepId}
        openStepId={openStepId}
      />
    </div>
  );
}

function CertificationsTab({ roleId }) {
  const certs = useApiData(() => careerApi.getRoleCertifications(roleId), [roleId]);
  const [filters, setFilters] = useState({ provider: '', level: '', cost: '' });
  if (certs.error) return <ErrorState message={certs.error} onRetry={certs.reload} />;
  if (!certs.data) return <CardSkeleton count={3} />;

  const all = certs.data.certifications;
  const visible = all.filter(
    (cert) =>
      (!filters.provider || cert.provider === filters.provider) &&
      (!filters.level || cert.level === filters.level) &&
      (!filters.cost || (filters.cost === 'free' ? cert.isFree : !cert.isFree)),
  );
  const setFilter = (key) => (value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
        <SelectFilter label="Provider" value={filters.provider} onChange={setFilter('provider')} options={[...new Set(all.map((cert) => cert.provider))].sort()} />
        <SelectFilter label="Level" value={filters.level} onChange={setFilter('level')} options={['Beginner', 'Intermediate', 'Advanced']} />
        <SelectFilter label="Cost" value={filters.cost} onChange={setFilter('cost')} options={[{ value: 'free', label: 'Free' }, { value: 'paid', label: 'Paid' }]} />
      </div>
      {visible.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((cert) => <CertificationCard key={cert.id} certification={cert} />)}
        </div>
      ) : (
        <EmptyState title="No certifications match" message="Try clearing a filter." />
      )}
      <p className="text-xs text-slate-500">Costs are approximate list prices – always confirm on the official page.</p>
    </div>
  );
}

export default function RoleDetailPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = TABS.some((tab) => tab.id === searchParams.get('tab')) ? searchParams.get('tab') : 'overview';
  const role = useApiData(() => careerApi.getRole(slug), [slug]);
  const summary = useApiData(() => careerApi.getProgressSummary(), []);
  const [targetBusy, setTargetBusy] = useState(false);
  const [message, setMessage] = useState({ tone: 'success', text: '' });

  if (role.error) {
    return (
      <div className="space-y-4">
        <Link to="/career/roles" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600"><ArrowLeft className="h-4 w-4" />All roles</Link>
        <ErrorState message={role.error} onRetry={role.reload} />
      </div>
    );
  }
  if (!role.data) return <LoadingState label="Loading role..." />;

  const current = role.data.role;
  const targetRoles = summary.data?.targetRoles || [];
  const maxTargets = summary.data?.maxTargetRoles || 3;
  const isTarget = targetRoles.some((item) => item.role.id === current.id);
  const trackDisabledReason = !isTarget && targetRoles.length >= maxTargets ? `You already track ${maxTargets} roles. Remove one first.` : '';

  const toggleTarget = async () => {
    setTargetBusy(true);
    setMessage({ tone: 'success', text: '' });
    try {
      const result = isTarget ? await careerApi.removeTargetRole(current.id) : await careerApi.addTargetRole(current.id);
      setMessage({ tone: 'success', text: result.message });
      summary.reload();
    } catch (requestError) {
      setMessage({ tone: 'error', text: getErrorMessage(requestError) });
    } finally {
      setTargetBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/career/roles" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600"><ArrowLeft className="h-4 w-4" />All roles</Link>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{current.category}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{current.experienceLevel} level</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">{current.demandLevel} demand</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">{current.title}</h1>
            <p className="mt-2 text-slate-600">{current.description}</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
              <span>{current.stepCount} roadmap steps</span>
              <span>{formatHours(current.totalHours)}</span>
              <span>{current.companyCount} hiring companies</span>
              <span>{current.certificationCount} certifications</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
            <button
              onClick={toggleTarget}
              disabled={targetBusy || summary.loading || Boolean(trackDisabledReason)}
              title={trackDisabledReason}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
                isTarget ? 'border border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700' : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              <Target className="h-4 w-4" />
              {targetBusy ? 'Saving...' : isTarget ? 'Remove from my targets' : 'Set as my target role'}
            </button>
            <span className="text-xs text-slate-500">{trackDisabledReason || `Tracking ${targetRoles.length} of ${maxTargets} roles`}</span>
          </div>
        </div>
        {message.text && <div className="mt-4"><InlineAlert tone={message.tone}>{message.text}</InlineAlert></div>}
      </section>

      <Tabs
        tabs={TABS}
        active={activeTab}
        onChange={(tab) => setSearchParams(tab === 'overview' ? {} : { tab }, { replace: true })}
      />

      {activeTab === 'overview' && <OverviewTab role={current} />}
      {activeTab === 'companies' && <CompaniesTab roleId={current.id} />}
      {activeTab === 'roadmap' && (
        <RoadmapTab role={current} isTarget={isTarget} onTrack={toggleTarget} trackDisabledReason={trackDisabledReason || (targetBusy ? 'Saving' : '')} />
      )}
      {activeTab === 'certifications' && <CertificationsTab roleId={current.id} />}
    </div>
  );
}
