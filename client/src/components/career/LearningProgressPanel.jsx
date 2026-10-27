import { Award, BookOpen, Route } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState } from './PageState';
import { allRoles } from '../../data/roleCareerData';
import useApiData from '../../hooks/useApiData';
import { courseApi } from '../../services/courseApi';
import { summarizeLearning } from '../../utils/learningProgress';

// Roadmap topics, course lessons, and certificates for every role the user has started.
export default function LearningProgressPanel() {
  const progress = useApiData(() => courseApi.getProgress(), []);

  const roles = allRoles
    .map((role) => ({ role, summary: summarizeLearning(progress.data, role) }))
    .filter((item) => item.summary.started)
    .sort((a, b) => b.summary.roadmapPercent - a.summary.roadmapPercent || b.summary.lessonsDone - a.summary.lessonsDone);

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Learning progress</h2>
          <p className="text-sm text-slate-500">Topics you have completed on each learning roadmap, course lessons, and certificates earned.</p>
        </div>
        <Link to="/roadmap" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Open learning roadmap</Link>
      </div>

      {progress.error && <ErrorState message={progress.error} onRetry={progress.reload} />}
      {progress.loading && !progress.data && <LoadingState label="Loading your learning progress..." />}

      {progress.data && !roles.length && (
        <EmptyState
          icon={Route}
          title="No learning progress yet"
          message="Open a learning roadmap and mark topics complete as you learn them. Your progress will appear here."
          action={<Link to="/roadmap" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Start a roadmap</Link>}
        />
      )}

      {roles.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roles.map(({ role, summary }) => (
            <li key={role.slug} className="flex flex-col rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{role.title}</h3>
                {summary.certificate && (
                  <Link to={`/certificate/${summary.certificate.code}`} target="_blank" className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                    <Award className="h-3.5 w-3.5" /> Certified
                  </Link>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Roadmap · {summary.topicsDone}/{summary.topicsTotal} topics</span>
                <span className="font-semibold text-slate-700">{summary.roadmapPercent}%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-indigo-600" style={{ width: `${summary.roadmapPercent}%` }} />
              </div>
              <div className="mt-2 text-xs text-slate-500">Course · {summary.lessonsDone}/{summary.lessonsTotal} lessons</div>
              <div className="mt-auto flex flex-wrap gap-2 pt-3">
                <Link to={`/roadmap?role=${role.slug}`} className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">
                  <Route className="h-3.5 w-3.5" /> Roadmap
                </Link>
                <Link to={`/courses/${role.slug}`} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700">
                  <BookOpen className="h-3.5 w-3.5" /> Course
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
