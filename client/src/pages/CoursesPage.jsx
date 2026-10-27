import { Award, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import RoleSelect from '../components/RoleSelect';
import { InlineAlert } from '../components/career/PageState';
import { courses as inAppCourses } from '../data/courses';
import useApiData from '../hooks/useApiData';
import useSelectedRole from '../hooks/useSelectedRole';
import { courseApi } from '../services/courseApi';

export default function CoursesPage() {
  const [role, selectRole] = useSelectedRole();
  const progress = useApiData(() => courseApi.getProgress(), []);
  const studyCourses = role ? inAppCourses.filter((course) => course.slug === role.slug) : inAppCourses;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Learning library</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{role ? `Courses for ${role.title}` : 'Courses'}</h1>
          <p className="mt-2 text-sm text-slate-600">Study our free courses, pass the final exam, and earn a certificate.</p>
        </div>
        <RoleSelect role={role} onChange={selectRole} />
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Study on AI Career Navigator</h2>
        {progress.error && <InlineAlert tone="warning">Your progress could not be loaded: {progress.error}</InlineAlert>}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {studyCourses.map((course) => {
            const done = progress.data?.progress[course.slug]?.length || 0;
            const percent = Math.round((done / course.lessons.length) * 100);
            const certificate = progress.data?.certificates.find((item) => item.courseSlug === course.slug);
            return (
              <article key={course.slug} className="flex flex-col rounded-3xl border border-indigo-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{course.category}</span>
                  {certificate && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"><Award className="h-3.5 w-3.5" /> Certified</span>}
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900">{course.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-600">{course.summary}</p>
                <div className="mt-4 text-sm text-slate-500">{course.lessons.length} lessons · final exam · certificate · Free</div>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-indigo-600" style={{ width: `${percent}%` }} />
                  </div>
                  {percent}%
                </div>
                <Link to={`/courses/${course.slug}`} className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
                  <BookOpen className="h-4 w-4" /> {certificate ? 'Review course' : done ? 'Continue' : 'Start course'}
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
