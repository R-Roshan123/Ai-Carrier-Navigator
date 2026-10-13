import { useState } from 'react';
import { Award, BookOpen, ChevronDown, Clock, ExternalLink, Hammer, Loader2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Chip } from './CareerUi';
import { formatHours } from '../../utils/careerFormat';

const STATUSES = ['Not Started', 'In Progress', 'Completed'];
const STATUS_BUTTON = {
  'Not Started': 'bg-slate-600 text-white',
  'In Progress': 'bg-blue-600 text-white',
  Completed: 'bg-emerald-600 text-white',
};
const STATUS_DOT = {
  'Not Started': 'border-slate-300 bg-white',
  'In Progress': 'border-blue-500 bg-blue-500',
  Completed: 'border-emerald-500 bg-emerald-500',
};

// One roadmap step. `status` and `onStatusChange` are only passed when the user tracks the role.
export default function RoadmapStep({ step, index, status, onStatusChange, updating, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const tracking = Boolean(onStatusChange);

  return (
    <li id={`step-${step.id}`} className="relative scroll-mt-24 pl-8">
      <span className={`absolute left-[3px] top-5 h-3.5 w-3.5 rounded-full border-2 ${STATUS_DOT[status || 'Not Started']}`} aria-hidden="true" />
      <div className={`rounded-2xl border bg-white shadow-sm ${status === 'Completed' ? 'border-emerald-200' : status === 'In Progress' ? 'border-blue-200' : 'border-slate-200'}`}>
        <button
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-start justify-between gap-3 p-4 text-left"
          aria-expanded={open}
        >
          <div className="min-w-0">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Step {index + 1}</div>
            <h4 className="font-semibold text-slate-900">{step.title}</h4>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatHours(step.estimatedHours)}</span>
              {step.certifications.length > 0 && (
                <span className="inline-flex items-center gap-1"><Award className="h-3.5 w-3.5" />{step.certifications.length} certification{step.certifications.length > 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {tracking && <StatusBadge status={status} />}
            <ChevronDown className={`h-5 w-5 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {open && (
          <div className="space-y-4 border-t border-slate-100 p-4 text-sm">
            {step.description && <p className="text-slate-600">{step.description}</p>}

            {step.topics.length > 0 && (
              <div>
                <h5 className="mb-2 font-semibold text-slate-900">Topics to learn</h5>
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {step.topics.map((topic) => (
                    <li key={topic} className="rounded-xl bg-slate-50 px-3 py-2 text-slate-700">{topic}</li>
                  ))}
                </ul>
              </div>
            )}

            {step.skills.length > 0 && (
              <div>
                <h5 className="mb-2 font-semibold text-slate-900">Skills gained</h5>
                <div className="flex flex-wrap gap-1.5">
                  {step.skills.map((skill) => <Chip key={skill} tone="indigo">{skill}</Chip>)}
                </div>
              </div>
            )}

            {step.resources.length > 0 && (
              <div>
                <h5 className="mb-2 flex items-center gap-1.5 font-semibold text-slate-900"><BookOpen className="h-4 w-4" />Resources</h5>
                <ul className="space-y-1.5">
                  {step.resources.map((resource) => (
                    <li key={resource.url} className="flex flex-wrap items-center gap-2">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-500">
                        {resource.title} <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{resource.type}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${resource.isFree ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
                        {resource.isFree ? 'Free' : 'Paid'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step.projects.length > 0 && (
              <div>
                <h5 className="mb-2 flex items-center gap-1.5 font-semibold text-slate-900"><Hammer className="h-4 w-4" />Practice projects</h5>
                <ul className="list-disc space-y-1 pl-5 text-slate-700">
                  {step.projects.map((project) => <li key={project}>{project}</li>)}
                </ul>
              </div>
            )}

            {step.certifications.length > 0 && (
              <div>
                <h5 className="mb-2 flex items-center gap-1.5 font-semibold text-slate-900"><Award className="h-4 w-4" />Linked certifications</h5>
                <ul className="space-y-1.5">
                  {step.certifications.map((cert) => (
                    <li key={cert.id} className="flex flex-wrap items-center gap-2">
                      <a href={cert.officialUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-slate-800 hover:text-indigo-600">
                        {cert.name}
                      </a>
                      <span className="text-xs text-slate-500">{cert.provider}</span>
                      <StatusBadge status={cert.importance} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tracking && (
              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                <span className="text-sm font-medium text-slate-700">Mark as:</span>
                {STATUSES.map((option) => (
                  <button
                    key={option}
                    onClick={() => onStatusChange(step.id, option)}
                    disabled={updating || option === status}
                    aria-pressed={option === status}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition disabled:cursor-default ${
                      option === status ? STATUS_BUTTON[option] : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
                {updating && <Loader2 className="h-4 w-4 animate-spin text-slate-400" aria-label="Saving" />}
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
