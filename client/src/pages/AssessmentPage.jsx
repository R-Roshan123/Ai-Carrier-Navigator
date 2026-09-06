import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentQuestions } from '../data/seedData';

export default function AssessmentPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const currentQuestion = assessmentQuestions[step];

  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Career assessment</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Question {step + 1} of {assessmentQuestions.length}</h1>
        </div>
        <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">Progress {Math.round(((step + 1) / assessmentQuestions.length) * 100)}%</div>
      </div>

      <div className="mb-8 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-indigo-600" style={{ width: `${((step + 1) / assessmentQuestions.length) * 100}%` }} />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">{currentQuestion.question}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {currentQuestion.options.map((option) => (
            <button key={option} onClick={() => setAnswers((current) => ({ ...current, [step]: option }))} className={`rounded-2xl border p-4 text-left transition ${answers[step] === option ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700'}`}>
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
          className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white"
          disabled={!answers[step]}
          onClick={() => step < assessmentQuestions.length - 1 ? setStep((current) => current + 1) : navigate('/recommendations')}
        >
          {step === assessmentQuestions.length - 1 ? 'Finish assessment' : 'Next question'}
        </button>
      </div>
    </div>
  );
}
