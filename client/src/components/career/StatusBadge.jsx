// Colour-coded pill for every status used in the career module.
const STYLES = {
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Verified: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Ready: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'In Progress': 'bg-blue-50 text-blue-700 ring-blue-200',
  'Not Started': 'bg-slate-100 text-slate-600 ring-slate-200',
  Pending: 'bg-yellow-50 text-yellow-800 ring-yellow-200',
  Rejected: 'bg-red-50 text-red-700 ring-red-200',
  Expired: 'bg-orange-50 text-orange-700 ring-orange-200',
  'Expiring Soon': 'bg-amber-50 text-amber-800 ring-amber-200',
  Almost: 'bg-amber-50 text-amber-800 ring-amber-200',
  'Not yet': 'bg-slate-100 text-slate-600 ring-slate-200',
  'Highly Valued': 'bg-violet-50 text-violet-700 ring-violet-200',
  Recommended: 'bg-sky-50 text-sky-700 ring-sky-200',
  Optional: 'bg-slate-100 text-slate-600 ring-slate-200',
};

const LABELS = { Ready: 'Ready to apply', Almost: 'Almost ready', 'Not yet': 'Keep building' };

export default function StatusBadge({ status, label, className = '' }) {
  if (!status) return null;
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STYLES[status] || STYLES['Not Started']} ${className}`}>
      {label || LABELS[status] || status}
    </span>
  );
}
