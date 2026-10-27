import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

// Small shared building blocks for the career pages, styled like the rest of the app.

export const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500';

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">{eyebrow}</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

// Search box that reports its value after the user stops typing.
export function SearchInput({ value, onChange, placeholder, label }) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (draft === value) return undefined;
    const timer = setTimeout(() => onChange(draft), 300);
    return () => clearTimeout(timer);
  }, [draft, value, onChange]);

  return (
    <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-indigo-500">
      <Search className="h-4 w-4 shrink-0 text-slate-500" />
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="w-full border-0 bg-transparent text-sm outline-none"
        placeholder={placeholder}
        aria-label={label || placeholder}
      />
    </div>
  );
}

export function SelectFilter({ label, value, onChange, options, allLabel = 'All' }) {
  return (
    <label className="block w-full text-xs font-medium uppercase tracking-wide text-slate-500">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className={`${inputClass} mt-1 normal-case tracking-normal text-slate-700`}>
        <option value="">{allLabel}</option>
        {options.map((option) => {
          const optionValue = typeof option === 'object' ? option.value : option;
          const optionLabel = typeof option === 'object' ? option.label : option;
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, total } = pagination;
  return (
    <nav className="flex items-center justify-between gap-3 text-sm text-slate-600" aria-label="Pagination">
      <span>
        Page {page} of {totalPages} · {total} results
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium disabled:opacity-40"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}

export function Chip({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    indigo: 'bg-indigo-50 text-indigo-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs ${tones[tone]}`}>{children}</span>;
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
            active === tab.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function CompanyLogo({ name, logoUrl, size = 'h-11 w-11' }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .filter((word) => /[A-Za-z]/.test(word[0]))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  if (!logoUrl || failed) {
    return (
      <div className={`${size} flex shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700`} aria-hidden="true">
        {initials}
      </div>
    );
  }
  return (
    <img
      src={logoUrl}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${size} shrink-0 rounded-xl border border-slate-100 bg-white object-contain p-1.5`}
    />
  );
}
