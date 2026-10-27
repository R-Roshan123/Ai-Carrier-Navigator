import { useState } from 'react';
import { ArrowLeft, Award, BookOpen, CheckCircle2, Circle, Clock3, Lock, RotateCcw, XCircle } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CardSkeleton, ErrorState, InlineAlert } from '../components/career/PageState';
import { getCourse, PASS_MARK } from '../data/courses';
import useApiData from '../hooks/useApiData';
import { courseApi } from '../services/courseApi';
import { getErrorMessage } from '../services/careerApi';
import { formatDate } from '../utils/careerFormat';
import { shuffleOptions } from '../utils/quiz';

const EXAM = 'exam';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const course = getCourse(slug);
  const progress = useApiData(() => courseApi.getProgress(), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!course) {
    return <ErrorState message="This course does not exist." />;
  }

  const completed = new Set(progress.data?.progress[slug] || []);
  const certificate = progress.data?.certificates.find((item) => item.courseSlug === slug);
  const allDone = course.lessons.every((lesson) => completed.has(lesson.id));
  const percent = Math.round((completed.size / course.lessons.length) * 100);

  const firstOpen = course.lessons.find((lesson) => !completed.has(lesson.id))?.id || EXAM;
  const view = searchParams.get('view') || firstOpen;
  const lessonIndex = course.lessons.findIndex((lesson) => lesson.id === view);
  const lesson = course.lessons[lessonIndex];
  const open = (id) => {
    setError('');
    setSearchParams({ view: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleComplete = async () => {
    setSaving(true);
    setError('');
    const isDone = completed.has(lesson.id);
    try {
      const result = isDone ? await courseApi.uncompleteLesson(slug, lesson.id) : await courseApi.completeLesson(slug, lesson.id);
      progress.setData((current) => ({ ...current, progress: { ...current.progress, [slug]: result.completedLessons } }));
      if (!isDone) open(course.lessons[lessonIndex + 1]?.id || EXAM);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Could not save your progress.'));
    } finally {
      setSaving(false);
    }
  };

  const onCertificate = (issued) =>
    progress.setData((current) => ({
      ...current,
      certificates: [issued, ...current.certificates.filter((item) => item.courseSlug !== slug)],
    }));

  return (
    <div className="space-y-6">
      <Link to="/courses" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-700">
        <ArrowLeft className="h-4 w-4" /> All courses
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">{course.category} course</div>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{course.title}</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">{course.summary}</p>
          </div>
          {certificate && (
            <Link to={`/certificate/${certificate.code}`} target="_blank" className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
              <Award className="h-4 w-4" /> Certificate earned
            </Link>
          )}
        </div>
        <div className="mt-5 flex items-center gap-3 text-sm text-slate-600">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${percent}%` }} />
          </div>
          <span className="shrink-0">{completed.size}/{course.lessons.length} lessons</span>
        </div>
      </div>

      {progress.error && <ErrorState message={progress.error} onRetry={progress.reload} />}
      {progress.loading && !progress.data && <CardSkeleton count={2} />}

      {progress.data && (
        <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
          <nav className="h-fit space-y-1 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-24" aria-label="Course lessons">
            {course.lessons.map((item, index) => (
              <button
                key={item.id}
                onClick={() => open(item.id)}
                className={`flex w-full items-start gap-2 rounded-2xl px-3 py-2.5 text-left text-sm transition ${view === item.id ? 'bg-indigo-50 text-indigo-800' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                {completed.has(item.id) ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}
                <span><span className="text-slate-400">{index + 1}.</span> {item.title}</span>
              </button>
            ))}
            <button
              onClick={() => open(EXAM)}
              className={`flex w-full items-start gap-2 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition ${view === EXAM ? 'bg-indigo-50 text-indigo-800' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              {certificate ? <Award className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : allDone ? <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" /> : <Lock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}
              Final exam & certificate
            </button>
          </nav>

          <div className="min-w-0 space-y-4">
            {error && <InlineAlert>{error}</InlineAlert>}
            {lesson ? (
              <LessonView lesson={lesson} number={lessonIndex + 1} isDone={completed.has(lesson.id)} saving={saving} onToggle={toggleComplete} />
            ) : (
              <ExamView course={course} allDone={allDone} certificate={certificate} onCertificate={onCertificate} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LessonView({ lesson, number, isDone, saving, onToggle }) {
  return (
    <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <header>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Lesson {number}</span>
          <span aria-hidden="true">·</span>
          <Clock3 className="h-3.5 w-3.5" /> {lesson.duration}
        </div>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">{lesson.title}</h2>
        <p className="mt-2 text-slate-700">{lesson.intro}</p>
      </header>

      {lesson.sections.map((section) => (
        <section key={section.heading}>
          <h3 className="text-lg font-semibold text-slate-900">{section.heading}</h3>
          <p className="mt-1 leading-7 text-slate-700">{section.body}</p>
        </section>
      ))}

      {lesson.example && (
        <section>
          <h3 className="text-lg font-semibold text-slate-900">Example: {lesson.example.title}</h3>
          <pre className="mt-2 overflow-x-auto rounded-2xl bg-slate-900 p-4 text-sm leading-6 text-slate-100"><code>{lesson.example.code}</code></pre>
        </section>
      )}

      <section className="rounded-2xl bg-indigo-50 p-4">
        <h3 className="font-semibold text-indigo-900">Key points</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-indigo-900">
          {lesson.keyPoints.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <h3 className="font-semibold text-amber-900">Practice exercise</h3>
        <p className="mt-1 text-sm text-amber-900">{lesson.exercise}</p>
      </section>

      <button
        onClick={onToggle}
        disabled={saving}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60 ${isDone ? 'border border-slate-200 text-slate-700' : 'bg-indigo-600 text-white'}`}
      >
        <CheckCircle2 className="h-4 w-4" />
        {saving ? 'Saving...' : isDone ? 'Completed — mark as not done' : 'Mark complete & continue'}
      </button>
    </article>
  );
}

function ExamView({ course, allDone, certificate, onCertificate }) {
  const [attempt, setAttempt] = useState(0);
  const [questions, setQuestions] = useState(() => shuffleOptions(course.exam));
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!allDone) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <Lock className="mx-auto h-8 w-8 text-slate-400" />
        <h2 className="mt-3 text-lg font-semibold text-slate-900">Finish every lesson to unlock the final exam</h2>
        <p className="mt-1 text-sm text-slate-600">Score {PASS_MARK}% or more on the {course.exam.length}-question exam to earn your certificate.</p>
      </div>
    );
  }

  const retry = () => {
    setQuestions(shuffleOptions(course.exam));
    setAnswers({});
    setResult(null);
    setAttempt((current) => current + 1);
  };

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const graded = await courseApi.submitExam(course.slug, questions.map((_, index) => answers[index]));
      setResult(graded);
      if (graded.certificate) onCertificate(graded.certificate);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Could not submit your exam.'));
    } finally {
      setSubmitting(false);
    }
  };

  const answeredAll = questions.every((_, index) => answers[index] !== undefined);

  return (
    <div className="space-y-4">
      {certificate && !result && (
        <InlineAlert tone="success">
          You have already earned this certificate on {formatDate(certificate.issuedAt)} with a score of {certificate.score}%.{' '}
          <Link to={`/certificate/${certificate.code}`} target="_blank" className="font-semibold underline">View certificate</Link>. You can retake the exam to improve your score.
        </InlineAlert>
      )}

      {result && (
        <div className={`rounded-3xl border p-6 ${result.passed ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
          <h2 className="text-2xl font-bold text-slate-900">{result.passed ? 'You passed!' : 'Not quite there yet'}</h2>
          <p className="mt-1 text-slate-700">You scored {result.score}% ({result.correctCount} of {result.total} correct). The pass mark is {PASS_MARK}%.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.certificate && (
              <Link to={`/certificate/${result.certificate.code}`} target="_blank" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
                <Award className="h-4 w-4" /> View your certificate
              </Link>
            )}
            <button onClick={retry} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">
              <RotateCcw className="h-4 w-4" /> {result.passed ? 'Retake exam' : 'Try again'}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Final exam</h2>
        <p className="mt-1 text-sm text-slate-600">{course.exam.length} questions · pass mark {PASS_MARK}%</p>
        <ol className="mt-6 space-y-6">
          {questions.map((question, index) => {
            const graded = result?.results[index];
            return (
              <li key={`${attempt}-${question.question}`}>
                <div className="flex items-start gap-2">
                  {graded && (graded.correct ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />)}
                  <p className="font-medium text-slate-900">{index + 1}. {question.question}</p>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      disabled={Boolean(result)}
                      onClick={() => setAnswers((current) => ({ ...current, [index]: option }))}
                      className={`rounded-2xl border p-3 text-left text-sm transition disabled:cursor-default ${answers[index] === option ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-200'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {graded && !graded.correct && <p className="mt-2 text-sm text-emerald-700">Correct answer: {graded.correctAnswer}</p>}
              </li>
            );
          })}
        </ol>
        {error && <div className="mt-4"><InlineAlert>{error}</InlineAlert></div>}
        {!result && (
          <button onClick={submit} disabled={!answeredAll || submitting} className="mt-6 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? 'Grading...' : answeredAll ? 'Submit exam' : 'Answer every question to submit'}
          </button>
        )}
      </div>
    </div>
  );
}
