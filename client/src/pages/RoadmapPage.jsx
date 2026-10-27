import { useEffect, useState } from 'react';
import { Award, BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import RoleSelect from '../components/RoleSelect';
import { CardSkeleton, ErrorState, InlineAlert } from '../components/career/PageState';
import { getCourse } from '../data/courses';
import { allRoles } from '../data/roleCareerData';
import useApiData from '../hooks/useApiData';
import useSelectedRole from '../hooks/useSelectedRole';
import { getErrorMessage } from '../services/careerApi';
import { courseApi } from '../services/courseApi';
import { summarizeLearning } from '../utils/learningProgress';

// Before progress was saved to the account it lived in localStorage as "<phaseIndex>:<topic title>".
const LEGACY_KEY = 'roadmapProgress';

const takeLegacyTopicIds = (role) => {
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY)) || {};
    const ids = (legacy[role.slug] || [])
      .map((key) => {
        const [index, ...rest] = key.split(':');
        return role.roadmap[Number(index)]?.topics.find((topic) => topic.title === rest.join(':'))?.id;
      })
      .filter(Boolean);
    delete legacy[role.slug];
    localStorage.setItem(LEGACY_KEY, JSON.stringify(legacy));
    return ids;
  } catch {
    return [];
  }
};

export default function RoadmapPage() {
  const [role, selectRole] = useSelectedRole();
  const progress = useApiData(() => courseApi.getProgress(), []);
  const [savingTopic, setSavingTopic] = useState('');
  const [error, setError] = useState('');
  const { data: progressData, setData: setProgressData } = progress;

  const setRoleTopics = (ids) =>
    progress.setData((current) => ({ ...current, roadmap: { ...current.roadmap, [role.slug]: ids } }));

  // One-time move of progress saved in this browser into the user's account.
  useEffect(() => {
    if (!role || !progressData) return;
    const saved = new Set(progressData.roadmap[role.slug] || []);
    const pending = takeLegacyTopicIds(role).filter((id) => !saved.has(id));
    if (!pending.length) return;
    Promise.all(pending.map((id) => courseApi.completeTopic(role.slug, id)))
      .then((results) => setProgressData((current) => ({ ...current, roadmap: { ...current.roadmap, [role.slug]: results.at(-1).completedTopics } })))
      .catch(() => {});
  }, [role, progressData, setProgressData]);

  const toggleTopic = async (topicId, isDone) => {
    setSavingTopic(topicId);
    setError('');
    try {
      const result = isDone ? await courseApi.uncompleteTopic(role.slug, topicId) : await courseApi.completeTopic(role.slug, topicId);
      setRoleTopics(result.completedTopics);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Could not save your progress.'));
    } finally {
      setSavingTopic('');
    }
  };

  const course = role && getCourse(role.slug);
  const summary = role && summarizeLearning(progress.data, role);
  const done = new Set(role ? progress.data?.roadmap[role.slug] || [] : []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Learning roadmap</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{role ? `Target: ${role.title}` : 'Choose a target role'}</h1>
          {role && <p className="mt-2 max-w-2xl text-sm text-slate-600">{course.summary}</p>}
        </div>
        <RoleSelect role={role} onChange={selectRole} allLabel="Choose a role" />
      </div>

      {!role && (
        <div className="grid gap-3 md:grid-cols-3">
          {allRoles.map((item) => {
            const itemSummary = summarizeLearning(progress.data, item);
            return (
              <button key={item.slug} onClick={() => selectRole(item.slug)} className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-indigo-300">
                <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                {progress.data && <div className="mt-1 text-xs text-slate-500">{itemSummary.roadmapPercent}% of roadmap complete</div>}
              </button>
            );
          })}
        </div>
      )}

      {role && progress.error && <ErrorState message={progress.error} onRetry={progress.reload} />}
      {role && progress.loading && !progress.data && <CardSkeleton count={2} />}

      {role && progress.data && (
        <>
          <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
            <div>
              <div className="text-sm text-slate-500">Roadmap progress</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{summary.roadmapPercent}%</div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${summary.roadmapPercent}%` }} />
              </div>
              <div className="mt-1 text-xs text-slate-500">{summary.topicsDone} of {summary.topicsTotal} topics complete</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">{role.title} course</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{summary.lessonsDone}/{summary.lessonsTotal} lessons</div>
              <Link to={`/courses/${role.slug}`} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-600"><BookOpen className="h-4 w-4" /> Open course</Link>
            </div>
            <div>
              <div className="text-sm text-slate-500">Certificate</div>
              {summary.certificate ? (
                <Link to={`/certificate/${summary.certificate.code}`} target="_blank" className="mt-1 inline-flex items-center gap-1 text-lg font-bold text-emerald-700"><Award className="h-5 w-5" /> Earned ({summary.certificate.score}%)</Link>
              ) : (
                <div className="mt-1 text-sm text-slate-600">Finish the course and pass its final exam to earn it.</div>
              )}
            </div>
          </div>

          {error && <InlineAlert>{error}</InlineAlert>}

          <div className="space-y-5">
            {role.roadmap.map((item, index) => {
              const lesson = course.lessons[index];
              const phaseDone = item.topics.filter((topic) => done.has(topic.id)).length;
              const phaseProgress = Math.round((phaseDone / item.topics.length) * 100);
              return (
                <section key={item.name} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${phaseProgress === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-700'}`}>
                        {phaseProgress === 100 ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{item.name}</h2>
                        <div className="text-sm text-slate-500">{item.duration} · {phaseDone}/{item.topics.length} topics</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-slate-600">{phaseProgress}% complete</div>
                  </div>

                  <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${phaseProgress}%` }} />
                  </div>

                  {lesson && (
                    <p className="mb-4 text-sm text-slate-600">
                      {lesson.intro}{' '}
                      <Link to={`/courses/${role.slug}?view=${lesson.id}`} className="font-medium text-indigo-600 hover:text-indigo-500">Study this in lesson {index + 1} →</Link>
                    </p>
                  )}

                  <ul className="grid gap-3 md:grid-cols-2">
                    {item.topics.map((topic) => {
                      const isDone = done.has(topic.id);
                      const isSaving = savingTopic === topic.id;
                      return (
                        <li key={topic.id} className={`flex items-center justify-between gap-3 rounded-2xl border p-3 text-sm ${isDone ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                          <span className={`flex items-start gap-2 ${isDone ? 'text-emerald-800' : 'text-slate-700'}`}>
                            {isDone ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}
                            {topic.title}
                          </span>
                          <button
                            onClick={() => toggleTopic(topic.id, isDone)}
                            disabled={Boolean(savingTopic)}
                            aria-label={`${isDone ? 'Mark not complete' : 'Mark complete'}: ${topic.title}`}
                            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${isDone ? 'border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-100' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                          >
                            {isSaving ? 'Saving...' : isDone ? 'Completed ✓' : 'Mark complete'}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to={`/courses/${role.slug}`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">Open the {role.title} course</Link>
            <Link to={`/projects?role=${role.slug}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Projects to build</Link>
            <Link to="/career/progress" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">My career progress</Link>
          </div>
        </>
      )}
    </div>
  );
}
