import { Award, CheckCircle2, Clock, Compass, Hourglass, ListChecks } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ProgressRing from '../../components/ProgressRing';
import LearningProgressPanel from '../../components/career/LearningProgressPanel';
import NextStepsPanel from '../../components/career/NextStepsPanel';
import SkillsChecklist from '../../components/career/SkillsChecklist';
import StageProgressBar from '../../components/career/StageProgressBar';
import StatusBadge from '../../components/career/StatusBadge';
import { CompanyLogo, PageHeader } from '../../components/career/CareerUi';
import { EmptyState, ErrorState, LoadingState } from '../../components/career/PageState';
import useApiData from '../../hooks/useApiData';
import { careerApi } from '../../services/careerApi';
import { formatDate, formatHours, formatWeeks } from '../../utils/careerFormat';

const readinessColor = (value) => (value >= 75 ? '#059669' : value >= 40 ? '#2563EB' : '#64748B');

function ListSection({ title, emptyText, children, count }) {
  return (
    <div>
      <h3 className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-900">
        {title}
        <span className="text-xs font-normal text-slate-500">{count}</span>
      </h3>
      {count ? <ul className="space-y-1.5">{children}</ul> : <p className="text-sm text-slate-500">{emptyText}</p>}
    </div>
  );
}

function RoleProgressDetail({ roleId }) {
  const navigate = useNavigate();
  const report = useApiData(() => careerApi.getRoleProgress(roleId), [roleId]);

  if (report.error) return <ErrorState message={report.error} onRetry={report.reload} />;
  if (!report.data) return <LoadingState label="Building your progress report..." />;
  const progress = report.data.progress;
  const { totals, breakdown } = progress;
  const goToUpload = (certificationId) => navigate(`/career/certificates?upload=${certificationId}`);

  return (
    <div className={`space-y-6 ${report.loading ? 'opacity-70' : ''}`}>
      {/* Readiness overview */}
      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[auto_1fr] md:items-center">
        <ProgressRing value={progress.readiness} label="Readiness" color={readinessColor(progress.readiness)} size={144} />
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{progress.role.title}</h2>
            <p className="text-sm text-slate-500">
              Tracking since {formatDate(progress.startedAt)} ·{' '}
              <Link to={`/career/roles/${progress.role.slug}?tab=roadmap`} className="font-medium text-indigo-600">Open roadmap</Link>
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500"><ListChecks className="h-3.5 w-3.5" />Steps done</div>
              <div className="text-lg font-bold text-slate-900">{totals.completedSteps}/{totals.totalSteps}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500"><Award className="h-3.5 w-3.5" />Core certifications</div>
              <div className="text-lg font-bold text-slate-900">{totals.earnedCoreCertifications}/{totals.coreCertifications}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500"><Clock className="h-3.5 w-3.5" />Total time</div>
              <div className="text-lg font-bold text-slate-900">{formatHours(totals.totalHours)}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500"><Hourglass className="h-3.5 w-3.5" />Time remaining</div>
              <div className="text-lg font-bold text-slate-900">{formatHours(totals.remainingHours)}</div>
              <div className="text-[11px] text-slate-500">{formatWeeks(totals.remainingHours)}</div>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Readiness = {breakdown.stepWeight}% roadmap progress ({breakdown.stepScore}% of hours completed) + {breakdown.certWeight}% core certifications ({breakdown.certScore}% verified).
            Only admin-verified, unexpired certificates count.
          </p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <NextStepsPanel actions={progress.nextActions} roleSlug={progress.role.slug} onUploadCertification={goToUpload} />
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Stage-wise progress</h2>
          <div className="space-y-4">
            {progress.stages.map((stage) => (
              <StageProgressBar key={stage.id} title={stage.title} completed={stage.completedSteps} total={stage.totalSteps} percent={stage.percent} />
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">✅ Completed</h2>
          <ListSection title="Finished steps" count={progress.completed.steps.length} emptyText="No steps completed yet – start with the first step in your roadmap.">
            {progress.completed.steps.map((step) => (
              <li key={step.id} className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-emerald-900"><CheckCircle2 className="h-4 w-4 shrink-0" />{step.title}</span>
                <span className="shrink-0 text-xs text-emerald-700">{formatDate(step.completedAt)}</span>
              </li>
            ))}
          </ListSection>
          <ListSection title="Earned certifications" count={progress.completed.certifications.length} emptyText="No verified certifications yet.">
            {progress.completed.certifications.map((cert) => (
              <li key={cert.id} className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm">
                <span className="text-emerald-900">{cert.name}</span>
                <StatusBadge status={cert.importance} />
              </li>
            ))}
          </ListSection>
          <ListSection title="Acquired skills" count={progress.completed.skills.length} emptyText="Skills appear here as you complete steps.">
            <li className="flex flex-wrap gap-1.5">
              {progress.completed.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800">{skill}</span>
              ))}
            </li>
          </ListSection>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">⏳ Remaining</h2>
          <ListSection title="Pending steps" count={progress.remaining.steps.length} emptyText="Every roadmap step is complete!">
            {progress.remaining.steps.map((step) => (
              <li key={step.id} className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                <Link to={`/career/roles/${progress.role.slug}?tab=roadmap#step-${step.id}`} className="text-slate-800 hover:text-indigo-600">
                  {step.title} <span className="text-xs text-slate-500">· {step.stageTitle}</span>
                </Link>
                <StatusBadge status={step.status} />
              </li>
            ))}
          </ListSection>
          <ListSection title="Missing certifications" count={progress.remaining.certifications.length} emptyText="You have earned every certification for this role.">
            {progress.remaining.certifications.map((cert) => (
              <li key={cert.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                <a href={cert.officialUrl} target="_blank" rel="noopener noreferrer" className="text-slate-800 hover:text-indigo-600">{cert.name}</a>
                <span className="flex flex-wrap gap-1.5">
                  {cert.userStatus && <StatusBadge status={cert.userStatus} label={`Yours: ${cert.userStatus}`} />}
                  <StatusBadge status={cert.importance} />
                </span>
              </li>
            ))}
          </ListSection>
          <ListSection title="Missing skills" count={progress.remaining.skills.length} emptyText="You have every skill on the checklist.">
            <li className="flex flex-wrap gap-1.5">
              {progress.remaining.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{skill}</span>
              ))}
            </li>
          </ListSection>
        </section>
      </div>

      <SkillsChecklist skills={progress.skillsChecklist} />

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Matching companies</h2>
        <p className="mt-1 text-sm text-slate-500">
          How close you are to each company's typical hiring bar (an estimate: product companies expect ~80, startups ~70, MNCs ~65, service companies ~50).
        </p>
        {progress.matchingCompanies.length ? (
          <ul className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {progress.matchingCompanies.map((company) => (
              <li key={company.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                <CompanyLogo name={company.name} logoUrl={company.logoUrl} size="h-10 w-10" />
                <div className="min-w-0 flex-1">
                  <Link to={`/career/companies/${company.id}`} className="block truncate font-semibold text-slate-900 hover:text-indigo-600">{company.name}</Link>
                  <div className="text-xs text-slate-500">{company.companyType} · bar {company.requiredReadiness}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={company.status} />
                  {company.gap > 0 && <span className="text-[11px] text-slate-500">+{company.gap} needed</span>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No companies are linked to this role yet.</p>
        )}
      </section>
    </div>
  );
}

export default function MyCareerProgressPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const summary = useApiData(() => careerApi.getProgressSummary(), []);
  const targets = summary.data?.targetRoles || [];
  const requestedRoleId = Number(searchParams.get('role'));
  const selected = targets.find((item) => item.role.id === requestedRoleId) || targets[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My career progress"
        title="Am I job-ready?"
        description="See what you have completed, what is remaining, and exactly what to do next for each target role."
        actions={(
          <Link to="/career/roles" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Explore roles
          </Link>
        )}
      />

      <LearningProgressPanel />

      <h2 className="text-lg font-bold text-slate-900">Target role readiness</h2>
      {summary.error && <ErrorState message={summary.error} onRetry={summary.reload} />}
      {summary.loading && !summary.data && <LoadingState label="Loading your target roles..." />}

      {summary.data && !targets.length && (
        <EmptyState
          icon={Compass}
          title="You are not tracking any roles yet"
          message="Pick up to 3 target roles to get a personalised roadmap, readiness score, and next steps."
          action={<Link to="/career/roles" className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">Explore roles</Link>}
        />
      )}

      {targets.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-3" role="tablist" aria-label="Target roles">
            {targets.map((item) => {
              const active = item.role.id === selected.role.id;
              return (
                <button
                  key={item.role.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSearchParams({ role: String(item.role.id) }, { replace: true })}
                  className={`flex items-center gap-4 rounded-3xl border bg-white p-4 text-left shadow-sm transition ${active ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-indigo-200'}`}
                >
                  <ProgressRing value={item.readiness} label="" size={72} color={readinessColor(item.readiness)} />
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-900">{item.role.title}</div>
                    <div className="text-xs text-slate-500">{item.totals.completedSteps}/{item.totals.totalSteps} steps · {formatHours(item.totals.remainingHours)} left</div>
                    {item.nextAction && <div className="mt-1 line-clamp-1 text-xs text-indigo-700">Next: {item.nextAction.title}</div>}
                  </div>
                </button>
              );
            })}
          </div>
          <RoleProgressDetail key={selected.role.id} roleId={selected.role.id} />
        </>
      )}
    </div>
  );
}
