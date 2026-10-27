import { Award, Printer, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ErrorState, LoadingState } from '../components/career/PageState';
import useApiData from '../hooks/useApiData';
import { courseApi } from '../services/courseApi';
import { formatDate } from '../utils/careerFormat';

// Public page: anyone with the link can view, print, and verify a course certificate.
export default function CertificatePage() {
  const { code } = useParams();
  const result = useApiData(() => courseApi.verifyCertificate(code), [code]);
  const certificate = result.data?.certificate;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      {/* Certificates print on one landscape page. */}
      <style>{'@media print { @page { size: A4 landscape; margin: 0; } }'}</style>

      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white"><Sparkles className="h-4 w-4" /></span>
            AI Career Navigator
          </Link>
          {certificate && (
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
              <Printer className="h-4 w-4" /> Print / Save as PDF
            </button>
          )}
        </div>

        {result.loading && <LoadingState label="Checking certificate..." />}
        {result.error && <ErrorState message={result.error} />}

        {certificate && (
          <>
            <p className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 print:hidden">
              <ShieldCheck className="h-4 w-4 shrink-0" /> Verified: this certificate was issued by AI Career Navigator.
            </p>

            <section className="certificate-document flex aspect-[1.414] w-full flex-col items-center justify-center rounded-2xl bg-white p-3 shadow-sm print:rounded-none print:shadow-none">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-4 border-double border-indigo-300 px-6 py-8 text-center sm:px-12">
                <Award className="h-12 w-12 text-indigo-600" />
                <div className="mt-3 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600 sm:text-sm">AI Career Navigator</div>
                <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-5xl">Certificate of Completion</h1>
                <p className="mt-6 text-sm text-slate-600 sm:text-base">This certifies that</p>
                <p className="mt-2 border-b border-slate-300 px-6 pb-2 font-serif text-2xl font-semibold text-slate-900 sm:text-4xl">{certificate.studentName}</p>
                <p className="mt-5 max-w-xl text-sm text-slate-600 sm:text-base">
                  has successfully completed all lessons of the <span className="font-semibold text-slate-900">{certificate.courseTitle}</span> course and passed the final exam with a score of <span className="font-semibold text-slate-900">{certificate.score}%</span>.
                </p>
                <div className="mt-8 grid w-full max-w-xl grid-cols-2 gap-6 text-xs text-slate-500 sm:text-sm">
                  <div>
                    <div className="font-semibold text-slate-800">{formatDate(certificate.issuedAt)}</div>
                    <div className="mt-1 border-t border-slate-300 pt-1">Date issued</div>
                  </div>
                  <div>
                    <div className="font-mono font-semibold text-slate-800">{certificate.code}</div>
                    <div className="mt-1 border-t border-slate-300 pt-1">Certificate ID</div>
                  </div>
                </div>
                <p className="mt-6 break-all text-[11px] text-slate-400">Verify at {window.location.origin}/certificate/{certificate.code}</p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
