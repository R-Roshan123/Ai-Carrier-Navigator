import { useState } from 'react';
import { Award, BriefcaseBusiness } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmptyState, InlineAlert, LoadingState } from '../components/career/PageState';
import useApiData from '../hooks/useApiData';
import { courseApi } from '../services/courseApi';
import { readScores } from '../utils/assessmentScores';
import { MATCH_WEIGHTS, matchJobs } from '../utils/jobMatch';

const PART_LABELS = { assessment: 'Assessment', course: 'Course', roadmap: 'Learning roadmap' };

const matchTone = (match) => (match >= 75 ? 'bg-emerald-50 text-emerald-700' : match >= 50 ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700');

export default function JobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const navigate = useNavigate();
  const learning = useApiData(() => courseApi.getProgress(), []);
  const matches = matchJobs(readScores(), learning.data);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">AI job matching</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Jobs matched to you</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Jobs are matched from the assessments and courses you have completed: assessment score ({MATCH_WEIGHTS.assessment}%), course progress or certificate ({MATCH_WEIGHTS.course}%), and learning roadmap progress ({MATCH_WEIGHTS.roadmap}%). Openings are samples.
        </p>
      </div>

      {learning.error && <InlineAlert tone="warning">Course progress could not be loaded, so matches use assessment scores only: {learning.error}</InlineAlert>}
      {learning.loading && !learning.data && !learning.error && <LoadingState label="Matching jobs to your progress..." />}

      {(learning.data || learning.error) && !matches.length && (
        <EmptyState
          icon={BriefcaseBusiness}
          title="No job matches yet"
          message="Take a role assessment or start a course, and jobs for that role will appear here with your match score."
          action={(
            <div className="flex flex-wrap justify-center gap-2">
              <button onClick={() => navigate('/assessment')} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Take an assessment</button>
              <button onClick={() => navigate('/courses')} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Browse courses</button>
            </div>
          )}
        />
      )}

      {(learning.data || learning.error) && matches.length > 0 && (
        <div className="grid gap-5 xl:grid-cols-2">
          {matches.map(({ role, job, score, learning: progress, parts, match }) => (
            <div key={job.title} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
                  <div className="mt-1 text-sm text-slate-500">{job.company} • {job.location}</div>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-sm font-semibold ${matchTone(match)}`}>{match}% match</span>
              </div>

              <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                <div>Role: {role.title}</div>
                <div>Experience: {job.experience}</div>
                <div>Work type: {job.workType}</div>
                <div>Salary: {job.salary}</div>
              </div>

              <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-3">
                <div className="text-sm font-semibold text-slate-900">How your match is calculated</div>
                {Object.keys(MATCH_WEIGHTS).map((key) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>
                        {PART_LABELS[key]} <span className="text-slate-400">({MATCH_WEIGHTS[key]}% weight)</span>
                      </span>
                      <span className="font-medium text-slate-800">
                        {key === 'assessment' && (score ? `${score.best}%` : 'Not taken')}
                        {key === 'course' && (progress.certificate ? 'Certified' : `${progress.lessonsDone}/${progress.lessonsTotal} lessons`)}
                        {key === 'roadmap' && `${progress.topicsDone}/${progress.topicsTotal} topics`}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-indigo-600" style={{ width: `${parts[key]}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {score?.strongTopics && (
                <div className="mt-4 text-sm text-slate-700">
                  <div className="mb-1 font-semibold text-slate-900">From your assessment:</div>
                  <ul className="space-y-0.5">
                    {score.strongTopics.map((topic) => <li key={topic}>✓ {topic}</li>)}
                    {score.weakTopics.map((topic) => <li key={topic} className="text-slate-500">✗ {topic}</li>)}
                  </ul>
                </div>
              )}

              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <button onClick={() => alert(`${job.title} at ${job.company}\n${job.experience} · ${job.workType}\n${job.salary}\nSkills: ${job.skills.join(', ')}`)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">View job</button>
                <button onClick={() => setSavedJobs((current) => current.includes(job.title) ? current.filter((title) => title !== job.title) : [...current, job.title])} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">{savedJobs.includes(job.title) ? 'Saved' : 'Save job'}</button>
                <button onClick={() => { setAppliedJobs((current) => current.includes(job.title) ? current : [...current, job.title]); navigate('/applications'); }} className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">{appliedJobs.includes(job.title) ? 'Applied' : 'Apply'}</button>
                {!score && <button onClick={() => navigate(`/assessment?role=${role.slug}`)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Take assessment to improve match</button>}
                {!progress.certificate && <button onClick={() => navigate(`/courses/${role.slug}`)} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"><Award className="h-4 w-4" /> {progress.lessonsDone ? 'Finish course' : 'Start course'}</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
