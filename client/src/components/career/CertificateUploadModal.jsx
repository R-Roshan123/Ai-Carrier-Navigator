import { useEffect, useMemo, useState } from 'react';
import { FileText, UploadCloud } from 'lucide-react';
import Modal from './Modal';
import { InlineAlert } from './PageState';
import { inputClass } from './CareerUi';
import { careerApi, getErrorMessage } from '../../services/careerApi';
import {
  CERTIFICATE_FILE_TYPES,
  MAX_CERTIFICATE_SIZE,
  formatFileSize,
  isValidHttpUrl,
  todayISO,
} from '../../utils/careerFormat';

const OTHER = 'other';

const emptyForm = (certificationId) => ({
  certificationId: certificationId ? String(certificationId) : '',
  customName: '',
  issuer: '',
  issueDate: '',
  expiryDate: '',
  credentialId: '',
  credentialUrl: '',
});

const formFromCertificate = (certificate) => ({
  certificationId: certificate.certificationId ? String(certificate.certificationId) : OTHER,
  customName: certificate.customName || '',
  issuer: certificate.issuer || '',
  issueDate: certificate.issueDate || '',
  expiryDate: certificate.expiryDate || '',
  credentialId: certificate.credentialId || '',
  credentialUrl: certificate.credentialUrl || '',
});

// Mirrors the server-side rules so users get instant feedback.
const validate = (form, file, isEdit) => {
  const errors = {};
  if (!form.certificationId) errors.certificationId = 'Choose a certification, or "Other".';
  if (form.certificationId === OTHER && !form.customName.trim()) errors.customName = 'Enter the certificate name.';
  if (form.certificationId === OTHER && !form.issuer.trim()) errors.issuer = 'Enter the issuing organization.';
  if (!form.issueDate) errors.issueDate = 'Issue date is required.';
  else if (form.issueDate > todayISO()) errors.issueDate = 'Issue date cannot be in the future.';
  if (form.expiryDate && form.issueDate && form.expiryDate < form.issueDate) errors.expiryDate = 'Expiry must be on or after the issue date.';
  if (form.credentialUrl && !isValidHttpUrl(form.credentialUrl)) errors.credentialUrl = 'Enter a full URL starting with https://';
  if (!isEdit && !file) errors.file = 'Attach your certificate file.';
  if (file && !CERTIFICATE_FILE_TYPES.includes(file.type)) errors.file = 'Only PDF, JPG, PNG, or WEBP files are allowed.';
  if (file && file.size > MAX_CERTIFICATE_SIZE) errors.file = 'File is too large. The maximum size is 5 MB.';
  return errors;
};

function Field({ label, error, children, hint }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <div className="mt-1.5">{children}</div>
      {hint && !error && <span className="mt-1 block text-xs font-normal text-slate-500">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-normal text-red-600">{error}</span>}
    </label>
  );
}

export default function CertificateUploadModal({ open, onClose, onSaved, certifications, certificate, defaultCertificationId }) {
  const isEdit = Boolean(certificate);
  const [form, setForm] = useState(emptyForm());
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(certificate ? formFromCertificate(certificate) : emptyForm(defaultCertificationId));
    setFile(null);
    setErrors({});
    setServerError('');
  }, [open, certificate, defaultCertificationId]);

  const filePreview = useMemo(() => (file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => filePreview && URL.revokeObjectURL(filePreview), [filePreview]);

  const selected = certifications.find((cert) => String(cert.id) === form.certificationId);
  const providers = useMemo(() => [...new Set(certifications.map((cert) => cert.provider))].sort(), [certifications]);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form, file, isEdit);
    setErrors(nextErrors);
    setServerError('');
    if (Object.keys(nextErrors).length) return;

    const formData = new FormData();
    const isOther = form.certificationId === OTHER;
    formData.append('certificationId', isOther ? '' : form.certificationId);
    formData.append('customName', isOther ? form.customName.trim() : '');
    formData.append('issuer', form.issuer.trim());
    formData.append('issueDate', form.issueDate);
    formData.append('expiryDate', form.expiryDate);
    formData.append('credentialId', form.credentialId.trim());
    formData.append('credentialUrl', form.credentialUrl.trim());
    if (file) formData.append('file', file);

    setSaving(true);
    try {
      const result = isEdit
        ? await careerApi.updateCertificate(certificate.id, formData)
        : await careerApi.uploadCertificate(formData);
      onSaved(result.certificate, result.message);
      onClose();
    } catch (requestError) {
      setServerError(getErrorMessage(requestError, 'Could not save the certificate.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => !saving && onClose()}
      title={isEdit ? 'Edit certificate' : 'Upload certificate'}
      size="lg"
      footer={(
        <>
          <button type="button" onClick={onClose} disabled={saving} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" form="certificate-form" disabled={saving} className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60">
            {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Upload'}
          </button>
        </>
      )}
    >
      <form id="certificate-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        {isEdit && (
          <div className="sm:col-span-2">
            <InlineAlert tone="info">Saving changes sends this certificate back for admin verification.</InlineAlert>
          </div>
        )}

        <div className="sm:col-span-2">
          <Field label="Certification" error={errors.certificationId}>
            <select value={form.certificationId} onChange={update('certificationId')} className={inputClass}>
              <option value="">Select a certification…</option>
              {providers.map((provider) => (
                <optgroup key={provider} label={provider}>
                  {certifications
                    .filter((cert) => cert.provider === provider)
                    .map((cert) => (
                      <option key={cert.id} value={cert.id}>
                        {cert.name}
                      </option>
                    ))}
                </optgroup>
              ))}
              <option value={OTHER}>Other (not in the list)</option>
            </select>
          </Field>
        </div>

        {form.certificationId === OTHER && (
          <div className="sm:col-span-2">
            <Field label="Certificate name" error={errors.customName}>
              <input value={form.customName} onChange={update('customName')} maxLength={200} className={inputClass} placeholder="e.g. Udemy – The Complete React Course" />
            </Field>
          </div>
        )}

        <Field
          label="Issuing organization"
          error={errors.issuer}
          hint={selected ? `Leave blank to use ${selected.provider}` : undefined}
        >
          <input value={form.issuer} onChange={update('issuer')} maxLength={200} className={inputClass} placeholder={selected?.provider || 'e.g. Coursera'} />
        </Field>
        <Field label="Credential ID (optional)">
          <input value={form.credentialId} onChange={update('credentialId')} maxLength={200} className={inputClass} />
        </Field>
        <Field label="Issue date" error={errors.issueDate}>
          <input type="date" value={form.issueDate} max={todayISO()} onChange={update('issueDate')} className={inputClass} />
        </Field>
        <Field label="Expiry date (optional)" error={errors.expiryDate}>
          <input type="date" value={form.expiryDate} min={form.issueDate || undefined} onChange={update('expiryDate')} className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Credential verification URL (optional)" error={errors.credentialUrl}>
            <input type="url" value={form.credentialUrl} onChange={update('credentialUrl')} maxLength={1000} className={inputClass} placeholder="https://www.credly.com/badges/..." />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label={isEdit ? 'Replace file (optional)' : 'Certificate file'} error={errors.file} hint="PDF, JPG, PNG or WEBP · max 5 MB">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center hover:border-indigo-300">
              {filePreview ? (
                <img src={filePreview} alt="Selected certificate preview" className="max-h-40 rounded-lg object-contain" />
              ) : file ? (
                <FileText className="h-8 w-8 text-indigo-600" />
              ) : (
                <UploadCloud className="h-8 w-8 text-slate-400" />
              )}
              <span className="text-sm text-slate-700">
                {file ? `${file.name} · ${formatFileSize(file.size)}` : isEdit ? `Current file: ${certificate.originalName || 'certificate'}` : 'Click to choose a file'}
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
              />
            </label>
          </Field>
        </div>

        {serverError && (
          <div className="sm:col-span-2">
            <InlineAlert>{serverError}</InlineAlert>
          </div>
        )}
      </form>
    </Modal>
  );
}
