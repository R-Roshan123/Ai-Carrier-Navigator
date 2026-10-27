import { BrainCircuit, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roleAssessments } from '../data/roleAssessments';
import { getRole } from '../data/roleCareerData';
import useApiData from '../hooks/useApiData';
import { courseApi } from '../services/courseApi';
import { summarizeLearning } from '../utils/learningProgress';
import { readScores, scoreLevel } from '../utils/assessmentScores';
import { readTargetCareer, saveTargetCareer } from '../utils/targetCareer';

const categories = [...new Set(roleAssessments.map((role) => role.category))];

export default function RecommendationsPage() {
  const [targetCareer, setTargetCareer] = useState(readTargetCareer);
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const scores = readScores();
  const learning = useApiData(() => courseApi.getProgress(), []);

  // Assessed roles first, best match on top; unassessed roles keep their catalogue order.
  const roles = roleAssessments
    .filter((role) => !category || role.category === category)
    .map((role, index) => ({ ...role, score: scores[role.slug], index }))
    .sort((a, b) => (b.score?.best ?? -1) - (a.score?.best ?? -1) || a.index - b.index);
  const assessedCount = roleAssessments.filter((role) => scores[role.slug]).length;

  const selectTarget = (title) => {
    setTargetCareer(title);
    saveTargetCareer(title);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Career match</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Career recommendations</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            {assessedCount
              ? `Ranked by your assessment scores. You have assessed ${assessedCount} of ${roleAssessments.length} roles.`
              : 'Take a role assessment to see how well you match each career.'}
          </p>
        </div>
        <button onClick={() => navigate('/assessment')} className="inline-flex items-center gap-2 self-start rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white md:self-auto">
          <BrainCircuit className="h-4 w-4" /> Go to assessments
        </button>
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

      <div className="grid gap-5 xl:grid-cols-2">
        {roles.map((role) => {
          const { score } = role;
          const level = score && scoreLevel(score.best);
          const learned = summarizeLearning(learning.data, getRole(role.slug));
          return (
            <div key={role.slug} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-900">{role.title}</h2>
                    {score ? (
                      <>
                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">{score.best}% match</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${level.className}`}>{level.label}</span>
                      </>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">Not assessed</span>
                    )}
                  </div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{role.category}</div>
                  <p className="mt-2 text-sm text-slate-600">{role.overview}</p>
                </div>
                <Sparkles className="h-6 w-6 shrink-0 text-indigo-600" />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-3 text-sm"><span className="text-slate-500">Salary:</span> {role.salary}</div>
                <div className="rounded-2xl bg-slate-50 p-3 text-sm"><span className="text-slate-500">Growth:</span> {role.growth}</div>
                <div className="rounded-2xl bg-slate-50 p-3 text-sm"><span className="text-slate-500">Difficulty:</span> {role.difficulty}</div>
                <div className="rounded-2xl bg-slate-50 p-3 text-sm"><span className="text-slate-500">Education:</span> {role.education}</div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-slate-500">Required skills</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {role.skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700">{skill}</span>
                  ))}
                </div>
              </div>

              {learning.data && (
                <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Learning roadmap · {learned.topicsDone}/{learned.topicsTotal} topics · course {learned.lessonsDone}/{learned.lessonsTotal} lessons{learned.certificate ? ' · Certified' : ''}</span>
                    <span className="font-semibold text-slate-800">{learned.roadmapPercent}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-indigo-600" style={{ width: `${learned.roadmapPercent}%` }} />
                  </div>
                </div>
              )}

              {score ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-sm">
                    <span className="text-emerald-700">Strong areas:</span> {score.strongTopics?.join(', ') || 'None yet'}
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-3 text-sm">
                    <span className="text-amber-700">Focus areas:</span> {score.weakTopics?.join(', ') || 'None — great work!'}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-indigo-50 p-3 text-sm">
                  <span className="text-indigo-700">Assessment covers:</span> {[...new Set(role.questions.map((question) => question.topic))].join(', ')}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2 pt-1 md:mt-auto md:pt-5">
                <button onClick={() => navigate(`/assessment?role=${role.slug}`)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                  {score ? `Retake assessment (last ${score.last}%)` : 'Take assessment'}
                </button>
                <button onClick={() => navigate(`/roadmap?role=${role.slug}`)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                  View roadmap
                </button>
                <button onClick={() => navigate(`/skill-gap?role=${role.slug}`)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                  Skill gap
                </button>
                <button onClick={() => navigate(`/courses?role=${role.slug}`)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                  Courses
                </button>
                <button onClick={() => selectTarget(role.title)} className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
                  {targetCareer === role.title ? 'Target selected' : 'Set as Target Career'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
