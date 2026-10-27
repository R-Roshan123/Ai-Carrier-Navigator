import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';

export function LoadingState({ label = 'Loading...' }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white p-10 text-sm text-slate-500 shadow-sm">
      <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
      {label}
    </div>
  );
}

export function CardSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="h-5 w-24 rounded-full bg-slate-100" />
          <div className="mt-4 h-6 w-2/3 rounded bg-slate-100" />
          <div className="mt-3 h-4 w-full rounded bg-slate-100" />
          <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
          <div className="mt-5 h-9 w-28 rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, message, action }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">{title}</h2>
      {message && <p className="mt-1 max-w-md text-sm text-slate-600">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="rounded-full border border-red-200 bg-white px-4 py-1.5 font-medium text-red-700 hover:bg-red-100">
          Try again
        </button>
      )}
    </div>
  );
}

export function InlineAlert({ tone = 'error', children }) {
  const styles = {
    error: 'bg-red-50 text-red-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-800',
    info: 'bg-indigo-50 text-indigo-700',
  };
  return (
    <p role={tone === 'error' ? 'alert' : 'status'} className={`rounded-xl px-3 py-2.5 text-sm ${styles[tone]}`}>
      {children}
    </p>
  );
}
