import { Award, Briefcase, Building2, ClipboardCheck, Upload, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import AdminCareerNav from '../../components/career/admin/AdminCareerNav';
import StatusBadge from '../../components/career/StatusBadge';
import { ErrorState, LoadingState } from '../../components/career/PageState';
import useApiData from '../../hooks/useApiData';
import { careerApi } from '../../services/careerApi';

export default function AdminCareerStatsPage() {
  const stats = useApiData(() => careerApi.admin.getStats(), []);
  const data = stats.data?.stats;
  const maxTargets = Math.max(1, ...(data?.mostTargetedRoles || []).map((role) => role.count));

  return (
    <div className="space-y-6">
      <AdminCareerNav />
      <h1 className="text-3xl font-bold text-slate-900">Career module overview</h1>

      {stats.error && <ErrorState message={stats.error} onRetry={stats.reload} />}
      {!data && !stats.error && <LoadingState label="Loading stats..." />}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Pending verifications" value={data.pendingVerifications} change="Needs review" icon={ClipboardCheck} />
            <StatCard label="Certificate uploads" value={data.totalUploads} change={`+${data.uploadsLast7Days} this week`} icon={Upload} />
            <StatCard label="Users tracking roles" value={data.usersTracking} change={`${data.stepsCompleted} steps done`} icon={Users} />
            <StatCard label="Job roles" value={data.totalRoles} change={`${data.totalRoadmapSteps} roadmap steps`} icon={Briefcase} />
            <StatCard label="Companies" value={data.totalCompanies} change="Hiring partners" icon={Building2} />
            <StatCard label="Certifications" value={data.totalCertifications} change="Master list" icon={Award} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Most-targeted roles</h2>
              <ul className="mt-4 space-y-3">
                {data.mostTargetedRoles.map((role) => (
                  <li key={role.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <Link to={`/career/roles/${role.slug}`} className="font-medium text-slate-700 hover:text-indigo-600">{role.title}</Link>
                      <span className="text-slate-500">{role.count} user{role.count === 1 ? '' : 's'}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(role.count / maxTargets) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Uploads by status</h2>
              <ul className="mt-4 space-y-3">
                {Object.entries(data.uploadsByStatus).map(([status, count]) => (
                  <li key={status} className="flex items-center justify-between">
                    <StatusBadge status={status} />
                    <span className="text-lg font-bold text-slate-900">{count}</span>
                  </li>
                ))}
              </ul>
              <Link to="/admin/career/verification" className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                Open verification queue
              </Link>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
