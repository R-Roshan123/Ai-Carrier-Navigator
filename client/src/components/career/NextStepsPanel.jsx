import { Award, ExternalLink, ListChecks, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatHours } from '../../utils/careerFormat';

export default function NextStepsPanel({ actions, roleSlug, onUploadCertification }) {
  return (
    <section className="rounded-3xl border border-indigo-200 bg-indigo-50/60 p-5">
      <h2 className="text-lg font-bold text-slate-900">👉 What to do next</h2>
      {!actions.length ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-slate-700">
          <PartyPopper className="h-4 w-4 text-indigo-600" /> You have completed everything on this roadmap. Time to apply!
        </p>
      ) : (
        <ol className="mt-4 space-y-3">
          {actions.map((action, index) => (
            <li key={`${action.type}-${action.id}`} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{index + 1}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                  {action.type === 'step' ? <ListChecks className="h-3.5 w-3.5" /> : <Award className="h-3.5 w-3.5" />}
                  {action.type === 'step' ? `Roadmap step · ${action.stageTitle}` : `Certification · ${action.provider}`}
                </div>
                <h3 className="mt-0.5 font-semibold text-slate-900">{action.title}</h3>
                <p className="text-sm text-slate-600">{action.reason}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  {action.type === 'step' ? (
                    <>
                      <span className="text-slate-500">{formatHours(action.estimatedHours)}</span>
                      <Link to={`/career/roles/${roleSlug}?tab=roadmap#step-${action.id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Open step
                      </Link>
                    </>
                  ) : (
                    <>
                      {action.officialUrl && (
                        <a href={action.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-500">
                          Official page <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {onUploadCertification && (
                        <button onClick={() => onUploadCertification(action.id)} className="font-medium text-indigo-600 hover:text-indigo-500">
                          Upload certificate
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
