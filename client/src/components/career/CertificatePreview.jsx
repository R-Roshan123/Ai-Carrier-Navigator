import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import Modal from './Modal';
import { ErrorState, LoadingState } from './PageState';
import { careerApi, getErrorMessage, saveBlob } from '../../services/careerApi';

// Files are behind auth, so they are fetched as a Blob and shown via an object URL.
export default function CertificatePreview({ certificate, onClose }) {
  const [state, setState] = useState({ url: '', blob: null, loading: true, error: '' });

  useEffect(() => {
    if (!certificate) return undefined;
    let objectUrl = '';
    let active = true;
    setState({ url: '', blob: null, loading: true, error: '' });
    careerApi
      .getCertificateFile(certificate.id)
      .then((blob) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setState({ url: objectUrl, blob, loading: false, error: '' });
      })
      .catch((error) => active && setState({ url: '', blob: null, loading: false, error: getErrorMessage(error, 'Could not load the file.') }));
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [certificate]);

  if (!certificate) return null;
  const isPdf = certificate.fileType === 'application/pdf';

  return (
    <Modal
      open
      onClose={onClose}
      title={certificate.name}
      size="xl"
      footer={(
        <button
          onClick={() => saveBlob(state.blob, certificate.originalName || 'certificate')}
          disabled={!state.blob}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Download
        </button>
      )}
    >
      {state.loading && <LoadingState label="Loading certificate..." />}
      {state.error && <ErrorState message={state.error} />}
      {state.url &&
        (isPdf ? (
          <iframe src={state.url} title={`${certificate.name} PDF`} className="h-[70vh] w-full rounded-xl border border-slate-200" />
        ) : (
          <img src={state.url} alt={`${certificate.name} certificate`} className="mx-auto max-h-[70vh] rounded-xl object-contain" />
        ))}
    </Modal>
  );
}
