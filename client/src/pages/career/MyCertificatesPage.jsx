import { useEffect, useState } from 'react';
import { AlertTriangle, Award, CheckCircle2, Clock3, Download, Eye, FileText, Pencil, Trash2, Upload, XCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import CertificatePreview from '../../components/career/CertificatePreview';
import CertificateUploadModal from '../../components/career/CertificateUploadModal';
import ConfirmModal from '../../components/career/ConfirmModal';
import StatusBadge from '../../components/career/StatusBadge';
import { PageHeader, Tabs } from '../../components/career/CareerUi';
import { CardSkeleton, EmptyState, ErrorState, InlineAlert } from '../../components/career/PageState';
import useApiData from '../../hooks/useApiData';
import { careerApi, getErrorMessage, saveBlob } from '../../services/careerApi';
import { courseApi } from '../../services/courseApi';
import { formatDate, formatFileSize } from '../../utils/careerFormat';

const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Verified', label: 'Verified' },
  { id: 'Rejected', label: 'Rejected' },
];

function CertificateItem({ certificate, onPreview, onDownload, onEdit, onDelete }) {
  const expiryWarning = certificate.expiryStatus === 'Expired' || certificate.expiryStatus === 'Expiring Soon';
  return (
    <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={certificate.status} />
        {expiryWarning && <StatusBadge status={certificate.expiryStatus} />}
        {certificate.certification?.importance && <StatusBadge status={certificate.certification.importance} />}
      </div>
      <h3 className="mt-3 text-base font-bold text-slate-900">{certificate.name}</h3>
      <p className="text-sm text-indigo-700">{certificate.issuer}</p>

      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-slate-500">Issued</dt>
        <dd className="text-slate-700">{formatDate(certificate.issueDate)}</dd>
        <dt className="text-slate-500">Expires</dt>
        <dd className={certificate.expiryStatus === 'Expired' ? 'font-medium text-orange-700' : certificate.expiryStatus === 'Expiring Soon' ? 'font-medium text-amber-700' : 'text-slate-700'}>
          {certificate.expiryDate ? formatDate(certificate.expiryDate) : 'No expiry'}
          {certificate.expiryStatus === 'Expiring Soon' && ` (in ${certificate.daysToExpiry} day${certificate.daysToExpiry === 1 ? '' : 's'})`}
        </dd>
        {certificate.credentialId && (
          <>
            <dt className="text-slate-500">Credential ID</dt>
            <dd className="break-all text-slate-700">{certificate.credentialId}</dd>
          </>
        )}
        <dt className="text-slate-500">File</dt>
        <dd className="flex items-center gap-1 truncate text-slate-700">
          <FileText className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{certificate.originalName}</span>
          <span className="shrink-0 text-slate-400">{formatFileSize(certificate.fileSize)}</span>
        </dd>
      </dl>

      {certificate.credentialUrl && (
        <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Verify credential online
        </a>
      )}

      {certificate.status === 'Rejected' && certificate.adminRemark && (
        <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          <span className="font-semibold">Admin remark:</span> {certificate.adminRemark}
        </p>
      )}
      {certificate.status === 'Verified' && certificate.adminRemark && (
        <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{certificate.adminRemark}</p>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <button onClick={() => onPreview(certificate)} className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white">
          <Eye className="h-3.5 w-3.5" /> Preview
        </button>
        <button onClick={() => onDownload(certificate)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Download className="h-3.5 w-3.5" /> Download
        </button>
        <button onClick={() => onEdit(certificate)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button onClick={() => onDelete(certificate)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:border-red-200 hover:bg-red-50" aria-label={`Delete ${certificate.name}`}>
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}

// Certificates earned by completing in-app courses (issued automatically, no review needed).
function CourseCertificates() {
  const courseProgress = useApiData(() => courseApi.getProgress(), []);
  const earned = courseProgress.data?.certificates || [];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Course completion certificates</h2>
          <p className="mt-1 text-sm text-slate-600">Earned by finishing every lesson of a course and passing its final exam.</p>
        </div>
        <Link to="/courses" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Browse courses</Link>
      </div>

      {courseProgress.error && <ErrorState message={courseProgress.error} onRetry={courseProgress.reload} />}
      {courseProgress.loading && !courseProgress.data && <CardSkeleton count={3} />}

      {courseProgress.data && (
        earned.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {earned.map((certificate) => (
              <article key={certificate.code} className="flex flex-col rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <StatusBadge status="Verified" />
                  <span className="text-xs font-medium text-slate-500">AI Career Navigator</span>
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900">{certificate.courseTitle}</h3>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                  <dt className="text-slate-500">Issued</dt>
                  <dd className="text-slate-700">{formatDate(certificate.issuedAt)}</dd>
                  <dt className="text-slate-500">Exam score</dt>
                  <dd className="text-slate-700">{certificate.score}%</dd>
                  <dt className="text-slate-500">Certificate ID</dt>
                  <dd className="break-all font-mono text-slate-700">{certificate.code}</dd>
                </dl>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <Link to={`/certificate/${certificate.code}`} target="_blank" className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-sm font-medium text-white">
                    <Eye className="h-3.5 w-3.5" /> View & print
                  </Link>
                  <Link to={`/courses/${certificate.courseSlug}`} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Review course
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Award}
            title="No course certificates yet"
            message="Complete all lessons of a course and pass its final exam to earn a certificate."
            action={<Link to="/courses" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white">Start a course</Link>}
          />
        )
      )}
    </section>
  );
}

export default function MyCertificatesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const certificates = useApiData(() => careerApi.listMyCertificates(), []);
  const masterList = useApiData(() => careerApi.listCertifications(), []);
  const [tab, setTab] = useState('all');
  const [modal, setModal] = useState({ open: false, certificate: null, certificationId: null });
  const [previewing, setPreviewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState({ tone: 'success', text: '' });

  // Deep link from "Upload certificate" buttons: /career/certificates?upload=<certificationId>
  useEffect(() => {
    const certificationId = searchParams.get('upload');
    if (certificationId === null) return;
    setModal({ open: true, certificate: null, certificationId: Number(certificationId) || null });
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const list = certificates.data?.certificates || [];
  const summary = certificates.data?.summary;
  const visible = tab === 'all' ? list : list.filter((cert) => cert.status === tab);
  const expiring = list.filter((cert) => cert.expiryStatus === 'Expired' || cert.expiryStatus === 'Expiring Soon');

  const onSaved = (_certificate, message) => {
    setNotice({ tone: 'success', text: message });
    certificates.reload();
  };

  const download = async (certificate) => {
    setNotice({ tone: 'success', text: '' });
    try {
      const blob = await careerApi.getCertificateFile(certificate.id);
      saveBlob(blob, certificate.originalName || 'certificate');
    } catch (requestError) {
      setNotice({ tone: 'error', text: getErrorMessage(requestError, 'Could not download the file.') });
    }
  };

  const confirmDelete = async () => {
    const result = await careerApi.deleteCertificate(deleting.id);
    setNotice({ tone: 'success', text: result.message });
    certificates.setData((current) => ({
      ...current,
      certificates: current.certificates.filter((cert) => cert.id !== deleting.id),
    }));
    certificates.reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My certificates"
        title="Certificates & credentials"
        description="Certificates you earned by completing our courses, plus certificates you upload for admin verification. Verified uploads count towards your role readiness."
        actions={(
          <button
            onClick={() => setModal({ open: true, certificate: null, certificationId: null })}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <Upload className="h-4 w-4" /> Upload certificate
          </button>
        )}
      />

      {notice.text && <InlineAlert tone={notice.tone}>{notice.text}</InlineAlert>}

      <CourseCertificates />

      <div>
        <h2 className="text-xl font-bold text-slate-900">Uploaded certificates</h2>
        <p className="mt-1 text-sm text-slate-600">External certificates you upload are reviewed by an admin.</p>
      </div>
      {certificates.error && <ErrorState message={certificates.error} onRetry={certificates.reload} />}

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total uploaded" value={summary.total} change={`${summary.pending} pending`} icon={Award} />
          <StatCard label="Verified" value={summary.verified} change="Counts to readiness" icon={CheckCircle2} />
          <StatCard label="Awaiting review" value={summary.pending} change="Admin queue" icon={Clock3} />
          <StatCard label="Rejected" value={summary.rejected} change="Fix & re-upload" icon={XCircle} />
        </div>
      )}

      {expiring.length > 0 && (
        <div role="alert" className="rounded-3xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
          <div className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" />Renewal needed</div>
          <ul className="mt-2 space-y-1">
            {expiring.map((cert) => (
              <li key={cert.id}>
                <span className="font-medium">{cert.name}</span>{' '}
                {cert.expiryStatus === 'Expired'
                  ? `expired on ${formatDate(cert.expiryDate)} and no longer counts towards readiness.`
                  : `expires in ${cert.daysToExpiry} day${cert.daysToExpiry === 1 ? '' : 's'} (${formatDate(cert.expiryDate)}).`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {certificates.loading && !certificates.data && <CardSkeleton count={3} />}

      {certificates.data && (
        list.length ? (
          <>
            <Tabs tabs={STATUS_TABS.map((item) => ({ ...item, label: item.id === 'all' ? `All (${list.length})` : item.label }))} active={tab} onChange={setTab} />
            {visible.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visible.map((certificate) => (
                  <CertificateItem
                    key={certificate.id}
                    certificate={certificate}
                    onPreview={setPreviewing}
                    onDownload={download}
                    onEdit={(cert) => setModal({ open: true, certificate: cert, certificationId: null })}
                    onDelete={setDeleting}
                  />
                ))}
              </div>
            ) : (
              <EmptyState title={`No ${tab.toLowerCase()} certificates`} />
            )}
          </>
        ) : (
          <EmptyState
            icon={Award}
            title="No certificates yet — upload your first one"
            message="Add certificates you have earned. Once an admin verifies them, they boost your readiness score."
            action={(
              <button onClick={() => setModal({ open: true, certificate: null, certificationId: null })} className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">
                Upload certificate
              </button>
            )}
          />
        )
      )}

      <CertificateUploadModal
        open={modal.open}
        certificate={modal.certificate}
        defaultCertificationId={modal.certificationId}
        certifications={masterList.data?.certifications || []}
        onClose={() => setModal({ open: false, certificate: null, certificationId: null })}
        onSaved={onSaved}
      />
      <CertificatePreview certificate={previewing} onClose={() => setPreviewing(null)} />
      <ConfirmModal
        open={Boolean(deleting)}
        title="Delete certificate?"
        message={deleting ? `"${deleting.name}" and its file will be permanently deleted. This cannot be undone.` : ''}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
