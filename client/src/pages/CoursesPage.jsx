import { useState } from 'react';
import { courses } from '../data/seedData';

export default function CoursesPage() {
  const [started, setStarted] = useState([]);

  const toggleCourse = (name) => {
    setStarted((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Learning library</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Recommended courses</h1>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        {courses.map((course) => {
          const isStarted = started.includes(course.name);
          return (
            <article key={course.name} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{course.level}</span>
                <span className="text-sm text-slate-500">{course.rating}/5</span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">{course.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{course.reason}</p>
              <div className="mt-4 text-sm text-slate-500">{course.platform} · {course.duration} · {course.cost}</div>
              <button onClick={() => toggleCourse(course.name)} className={`mt-5 rounded-full px-4 py-2 text-sm font-medium ${isStarted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-900 text-white'}`}>
                {isStarted ? 'In progress' : 'Start course'}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
