import { useState } from 'react';
import RoleSelect from '../components/RoleSelect';
import { allRoles } from '../data/roleCareerData';
import useSelectedRole from '../hooks/useSelectedRole';

export default function CoursesPage() {
  const [started, setStarted] = useState([]);
  const [role, selectRole] = useSelectedRole();
  const courses = (role ? [role] : allRoles).flatMap((item) => item.courses.map((course) => ({ ...course, role: item.title })));

  const toggleCourse = (name) => {
    setStarted((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Learning library</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{role ? `Courses for ${role.title}` : 'Recommended courses'}</h1>
          <p className="mt-2 text-sm text-slate-600">Durations and pricing are approximate — check the provider for current details.</p>
        </div>
        <RoleSelect role={role} onChange={selectRole} />
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        {courses.map((course) => {
          const isStarted = started.includes(course.name);
          return (
            <article key={course.name} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{course.level}</span>
                <span className="text-xs font-medium text-slate-500">{course.role}</span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">{course.name}</h2>
              <p className="mt-2 flex-1 text-sm text-slate-600">{course.reason}</p>
              <div className="mt-4 text-sm text-slate-500">{course.platform} · {course.duration} · {course.cost}{course.certificate ? ' · Certificate' : ''}</div>
              <button onClick={() => toggleCourse(course.name)} className={`mt-5 self-start rounded-full px-4 py-2 text-sm font-medium ${isStarted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-900 text-white'}`}>
                {isStarted ? 'In progress' : 'Start course'}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
