import { useState } from 'react';
import Modal from './Modal';
import { InlineAlert } from './PageState';
import { getErrorMessage } from '../../services/careerApi';

// Confirmation dialog. `onConfirm` may be async; errors are shown inline.
export default function ConfirmModal({ open, title = 'Are you sure?', message, confirmLabel = 'Delete', danger = true, onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const close = () => {
    if (busy) return;
    setError('');
    onClose();
  };

  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      await onConfirm();
      setBusy(false);
      onClose();
    } catch (requestError) {
      setBusy(false);
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <Modal
      open={open}
      title={title}
      onClose={close}
      size="sm"
      footer={(
        <>
          <button onClick={close} disabled={busy} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={busy}
            className={`rounded-full px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${danger ? 'bg-red-600 hover:bg-red-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
          >
            {busy ? 'Please wait...' : confirmLabel}
          </button>
        </>
      )}
    >
      <div className="space-y-3 text-sm text-slate-600">
        <p>{message}</p>
        {error && <InlineAlert>{error}</InlineAlert>}
      </div>
    </Modal>
  );
}
