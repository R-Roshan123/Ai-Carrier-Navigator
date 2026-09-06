import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobs } from '../data/seedData';

export default function JobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">AI job matching</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Matching opportunities</h1>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {jobs.map((job) => (
          <div key={job.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
                <div className="mt-1 text-sm text-slate-500">{job.company} • {job.location}</div>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">{job.match}% match</span>
            </div>

            <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
              <div>Experience: {job.experience}</div>
              <div>Work type: {job.workType}</div>
              <div>Salary: {job.salary}</div>
              <div>Location: {job.location}</div>
            </div>

            <div className="mt-4 text-sm text-slate-700">
              <div className="mb-2 font-semibold text-slate-900">Why this fits:</div>
              <ul className="space-y-1">
                {job.reasons.map((reason) => (
                  <li key={reason}>✓ {reason}</li>
                ))}
                {job.missingSkills.map((skill) => (
                  <li key={skill} className="text-slate-500">✗ {skill}</li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => alert(`${job.title} at ${job.company}\n${job.experience} · ${job.workType}\n${job.salary}`)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">View job</button>
              <button onClick={() => setSavedJobs((current) => current.includes(job.title) ? current.filter((title) => title !== job.title) : [...current, job.title])} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">{savedJobs.includes(job.title) ? 'Saved' : 'Save job'}</button>
              <button onClick={() => { setAppliedJobs((current) => current.includes(job.title) ? current : [...current, job.title]); navigate('/applications'); }} className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">{appliedJobs.includes(job.title) ? 'Applied' : 'Apply'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
