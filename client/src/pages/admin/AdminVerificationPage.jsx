import { useState } from 'react';
import { CheckCircle2, Eye, RotateCcw, ShieldCheck, XCircle } from 'lucide-react';
import AdminCareerNav from '../../components/career/admin/AdminCareerNav';
import CertificatePreview from '../../components/career/CertificatePreview';
import Modal from '../../components/career/Modal';
import StatusBadge from '../../components/career/StatusBadge';
import { Pagination, Tabs, inputClass } from '../../components/career/CareerUi';
import { EmptyState, ErrorState, InlineAlert, LoadingState } from '../../components/career/PageState';
import useApiData from '../../hooks/useApiData';
import { careerApi, getErrorMessage } from '../../services/careerApi';
import { formatDate } from '../../utils/careerFormat';

const STATUS_TABS = [
  { id: 'Pending', label: 'Pending' },
  { id: 'Verified', label: 'Verified' },
  { id: 'Rejected', label: 'Rejected' },
  { id: '', label: 'All' },
];

export default function AdminVerificationPage() {
  const [status, setStatus] = useState('Pending');
  const [page, setPage] = useState(1);
  const queue = useApiData(() => careerApi.admin.listCertificates({ status: status || undefined, page }), [status, page]);
  const [previewing, setPreviewing] = useState(null);
  const [decision, setDecision] = useState(null); // { certificate, status }
  const [remark, setRemark] = useState('');
  const [remarkError, setRemarkError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState({ tone: 'success', text: '' });

  const changeTab = (tab) => {
    setStatus(tab);
    setPage(1);
  };

  const submitDecision = async (certificate, nextStatus, nextRemark = '') => {
    setBusyId(certificate.id);
    setNotice({ tone: 'success', text: '' });
    try {
      const result = await careerApi.admin.verifyCertificate(certificate.id, nextStatus, nextRemark);
      setNotice({ tone: 'success', text: `${result.message} (${certificate.name} – ${certificate.user.name})` });
      setDecision(null);
      queue.reload();
    } catch (requestError) {
      const message = getErrorMessage(requestError, 'Could not update the certificate.');
      if (decision) setRemarkError(message);
      else setNotice({ tone: 'error', text: message });
    } finally {
      setBusyId(null);
    }
  };

  const openDecision = (certificate, nextStatus) => {
    setDecision({ certificate, status: nextStatus });
    setRemark(certificate.adminRemark || '');
    setRemarkError('');
  };

  const confirmDecision = () => {
    if (decision.status === 'Rejected' && !remark.trim()) {
      setRemarkError('Please explain why the certificate was rejected so the user can fix it.');
      return;
    }
    submitDecision(decision.certificate, decision.status, remark.trim());
  };

  const certificates = queue.data?.certificates || [];

  return (
    <div className="space-y-6">
      <AdminCareerNav />
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Certificate verification</h1>
        <p className="mt-1 text-sm text-slate-600">Check each file against its credential link before approving. Verified certificates count towards users' readiness.</p>
      </div>

      <Tabs tabs={STATUS_TABS} active={status} onChange={changeTab} />
      {notice.text && <InlineAlert tone={notice.tone}>{notice.text}</InlineAlert>}
      {queue.error && <ErrorState message={queue.error} onRetry={queue.reload} />}
      {queue.loading && !queue.data && <LoadingState label="Loading queue..." />}

      {queue.data && (certificates.length ? (
        <ul className={`space-y-3 ${queue.loading ? 'opacity-60' : ''}`}>
          {certificates.map((certificate) => (
            <li key={certificate.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{certificate.name}</span>
                    <StatusBadge status={certificate.status} />
                    {(certificate.expiryStatus === 'Expired' || certificate.expiryStatus === 'Expiring Soon') && <StatusBadge status={certificate.expiryStatus} />}
                    {!certificate.certificationId && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">Custom</span>}
                  </div>
                  <div className="text-sm text-slate-600">
                    <span className="font-medium text-slate-800">{certificate.user.name}</span> · {certificate.user.email}
                  </div>
                  <div className="text-xs text-slate-500">
                    Issuer: {certificate.issuer} · Issued {formatDate(certificate.issueDate)} · Expires {certificate.expiryDate ? formatDate(certificate.expiryDate) : 'never'} · Uploaded {formatDate(certificate.createdAt)}
                  </div>
                  <div className="text-xs text-slate-500">
                    Credential ID: {certificate.credentialId || '—'}
                    {certificate.credentialUrl && (
                      <>
                        {' · '}
                        <a href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600">Open verification link</a>
                      </>
                    )}
                  </div>
                  {certificate.adminRemark && <p className="text-xs text-slate-600">Remark: {certificate.adminRemark}{certificate.verifiedBy && ` – ${certificate.verifiedBy}`}</p>}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button onClick={() => setPreviewing(certificate)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    <Eye className="h-3.5 w-3.5" /> View file
                  </button>
                  {certificate.status !== 'Verified' && (
                    <button onClick={() => submitDecision(certificate, 'Verified')} disabled={busyId === certificate.id} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  {certificate.status !== 'Rejected' && (
                    <button onClick={() => openDecision(certificate, 'Rejected')} disabled={busyId === certificate.id} className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60">
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </button>
                  )}
                  {certificate.status !== 'Pending' && (
                    <button onClick={() => submitDecision(certificate, 'Pending')} disabled={busyId === certificate.id} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                      <RotateCcw className="h-3.5 w-3.5" /> Back to pending
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={ShieldCheck} title={status === 'Pending' ? 'All caught up!' : 'Nothing here'} message={status === 'Pending' ? 'There are no certificates waiting for verification.' : undefined} />
      ))}
      <Pagination pagination={queue.data?.pagination} onPageChange={setPage} />

      <CertificatePreview certificate={previewing} onClose={() => setPreviewing(null)} />
      <Modal
        open={Boolean(decision)}
        onClose={() => busyId === null && setDecision(null)}
        title="Reject certificate"
        size="sm"
        footer={(
          <>
            <button onClick={() => setDecision(null)} disabled={busyId !== null} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            <button onClick={confirmDecision} disabled={busyId !== null} className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60">
              {busyId !== null ? 'Saving...' : 'Reject'}
            </button>
          </>
        )}
      >
        {decision && (
          <div className="space-y-3 text-sm">
            <p className="text-slate-600">
              Rejecting <span className="font-semibold text-slate-900">{decision.certificate.name}</span> from {decision.certificate.user.name}. The user will see this remark.
            </p>
            <label className="block font-medium text-slate-700">
              Remark *
              <textarea value={remark} onChange={(event) => setRemark(event.target.value)} maxLength={1000} rows={4} className={`${inputClass} mt-1`} placeholder="e.g. The name on the certificate does not match your profile." />
            </label>
            {remarkError && <InlineAlert>{remarkError}</InlineAlert>}
          </div>
        )}
      </Modal>
    </div>
  );
}
