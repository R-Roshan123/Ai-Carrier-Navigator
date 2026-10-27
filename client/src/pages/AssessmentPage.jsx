import { useState } from 'react';
import { ArrowLeft, BrainCircuit, CheckCircle2, ChevronRight, RotateCcw, XCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getRoleAssessment, roleAssessments } from '../data/roleAssessments';
import { readScores, saveScore, scoreLevel, summarizeTopics } from '../utils/assessmentScores';
import { saveTargetCareer } from '../utils/targetCareer';

const categories = [...new Set(roleAssessments.map((role) => role.category))];

// Shuffle options per attempt so the correct answer's position can't be memorised.
const shuffleOptions = (questions) =>
  questions.map((question) => {
    const order = question.options.map((_, index) => index);
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return { ...question, options: order.map((index) => question.options[index]), answer: order.indexOf(question.answer) };
  });

export default function AssessmentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const role = getRoleAssessment(searchParams.get('role'));

  const selectRole = (slug) => setSearchParams(slug ? { role: slug } : {});

  // Keying by slug resets the quiz whenever a different role is picked.
  return role ? <RoleQuiz key={role.slug} role={role} onExit={() => selectRole('')} /> : <RoleSelection onSelect={selectRole} />;
}

function RoleSelection({ onSelect }) {
  const [category, setCategory] = useState('');
  const scores = readScores();
  const visibleRoles = category ? roleAssessments.filter((role) => role.category === category) : roleAssessments;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Career assessment</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Choose a role to assess</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Each role has its own set of questions on the skills that job needs. Pick a role and the assessment starts right away.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['', ...categories].map((item) => (
          <button
            key={item || 'all'}
            onClick={() => setCategory(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${category === item ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:text-indigo-700'}`}
          >
            {item || 'All roles'}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleRoles.map((role) => {
          const score = scores[role.slug];
          return (
            <button
              key={role.slug}
              onClick={() => onSelect(role.slug)}
              className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{role.category}</span>
                {score && <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${scoreLevel(score.best).className}`}>Best {score.best}%</span>}
              </div>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{role.title}</h2>
              <p className="mt-1 flex-1 text-sm text-slate-600">{role.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-500">{role.questions.length} questions</span>
                <span className="inline-flex items-center gap-1 font-medium text-indigo-600">
                  {score ? 'Retake' : 'Start'} <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RoleQuiz({ role, onExit }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [questions, setQuestions] = useState(() => shuffleOptions(role.questions));

  const currentQuestion = questions[step];
  const isLast = step === questions.length - 1;

  const finish = () => {
    const correct = questions.filter((question, index) => answers[index] === question.answer).length;
    const { topics, strongTopics, weakTopics } = summarizeTopics(questions, answers);
    saveScore(role.slug, { percent: Math.round((correct / questions.length) * 100), topics, strongTopics, weakTopics });
    setFinished(true);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setFinished(false);
    setQuestions(shuffleOptions(role.questions));
  };

  if (finished) return <QuizResult role={role} questions={questions} answers={answers} onRetake={restart} onExit={onExit} />;

  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <button onClick={onExit} className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-700">
        <ArrowLeft className="h-4 w-4" /> Choose a different role
      </button>

      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">{role.title} assessment</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Question {step + 1} of {questions.length}</h1>
        </div>
        <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">Progress {Math.round(((step + 1) / questions.length) * 100)}%</div>
      </div>

      <div className="mb-8 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-indigo-600" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="space-y-4">
        <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{currentQuestion.topic}</span>
        <h2 className="text-2xl font-semibold text-slate-900">{currentQuestion.question}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {currentQuestion.options.map((option, index) => (
            <button key={option} onClick={() => setAnswers((current) => ({ ...current, [step]: index }))} className={`rounded-2xl border p-4 text-left transition ${answers[step] === index ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700'}`}>
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={step === 0}
          onClick={() => setStep((current) => Math.max(0, current - 1))}
        >
          Previous
        </button>
        <button
          className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={answers[step] === undefined}
          onClick={() => (isLast ? finish() : setStep((current) => current + 1))}
        >
          {isLast ? 'Finish assessment' : 'Next question'}
        </button>
      </div>
    </div>
  );
}

function QuizResult({ role, questions, answers, onRetake, onExit }) {
  const navigate = useNavigate();
  const correct = questions.filter((question, index) => answers[index] === question.answer).length;
  const percent = Math.round((correct / questions.length) * 100);
  const level = scoreLevel(percent);

  const { topics, weakTopics } = summarizeTopics(questions, answers);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">{role.title} assessment</div>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">You scored {percent}%</h1>
            <p className="mt-1 text-sm text-slate-600">{correct} of {questions.length} correct</p>
          </div>
          <span className={`self-start rounded-full px-3 py-1 text-sm font-medium md:self-center ${level.className}`}>{level.label}</span>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {topics.map((topic) => (
            <div key={topic.topic} className="rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{topic.topic}</span>
                <span className="text-slate-500">{topic.correct}/{topic.total}</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-indigo-600" style={{ width: `${(topic.correct / topic.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        {weakTopics.length > 0 && (
          <p className="mt-4 text-sm text-slate-600">
            <span className="font-medium text-slate-800">Focus next on:</span> {weakTopics.join(', ')}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={onRetake} className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
            <RotateCcw className="h-4 w-4" /> Retake
          </button>
          <button onClick={onExit} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
            Assess another role
          </button>
          <button
            onClick={() => {
              saveTargetCareer(role.title);
              navigate(`/roadmap?role=${role.slug}`);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700"
          >
            <BrainCircuit className="h-4 w-4" /> View {role.title} roadmap
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Review your answers</h2>
        <ol className="mt-4 space-y-4">
          {questions.map((question, index) => {
            const isCorrect = answers[index] === question.answer;
            return (
              <li key={question.question} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                  {isCorrect ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />}
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-slate-900">{index + 1}. {question.question}</p>
                    {!isCorrect && <p className="text-rose-700">Your answer: {question.options[answers[index]]}</p>}
                    <p className="text-emerald-700">Correct answer: {question.options[question.answer]}</p>
                    <p className="text-slate-600">{question.explanation}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
