import { useState } from 'react';
import { ExternalLink, Upload } from 'lucide-react';
import StatusBadge from './StatusBadge';

// `userStatus` (optional): Verified | Pending | Rejected | Expired – the user's own certificate for it.
export default function CertificationCard({ certification, userStatus, onUpload }) {
  const [showExam, setShowExam] = useState(false);

  return (
    <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={certification.importance} />
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{certification.level}</span>
        {certification.isFree && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Free</span>}
        {userStatus && <StatusBadge status={userStatus} label={userStatus === 'Verified' ? 'Earned' : `Yours: ${userStatus}`} />}
      </div>

      <h3 className="mt-3 text-base font-bold text-slate-900">{certification.name}</h3>
      <p className="text-sm font-medium text-indigo-700">{certification.provider}</p>

      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-slate-500">Cost</dt>
        <dd className="text-slate-700">{certification.cost || '—'}</dd>
        <dt className="text-slate-500">Validity</dt>
        <dd className="text-slate-700">{certification.validity || '—'}</dd>
      </dl>

      {certification.examDetails && (
        <div className="mt-2 text-sm">
          <button onClick={() => setShowExam((open) => !open)} className="font-medium text-indigo-600" aria-expanded={showExam}>
            {showExam ? 'Hide exam details' : 'Exam details'}
          </button>
          {showExam && <p className="mt-1 text-slate-600">{certification.examDetails}</p>}
        </div>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <a
          href={certification.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Official page <ExternalLink className="h-3.5 w-3.5" />
        </a>
        {onUpload && userStatus !== 'Verified' && userStatus !== 'Pending' && (
          <button onClick={() => onUpload(certification)} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100">
            <Upload className="h-3.5 w-3.5" /> I have this
          </button>
        )}
      </div>
    </article>
  );
}
