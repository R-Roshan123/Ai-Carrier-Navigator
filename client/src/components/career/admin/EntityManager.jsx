import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Modal from '../Modal';
import ConfirmModal from '../ConfirmModal';
import { EmptyState, ErrorState, InlineAlert, LoadingState } from '../PageState';
import { SearchInput, inputClass } from '../CareerUi';
import { getErrorMessage } from '../../../services/careerApi';
import { isValidHttpUrl } from '../../../utils/careerFormat';

// Generic admin list + create/edit form + delete confirmation.
//
// Field types:
//   text | url | textarea | select (options) | checkbox
//   lines       – textarea, one item per line  -> string[]
//   csv         – input, comma separated       -> string[]
//   multiselect – checkbox list (options)      -> number[]

const toFormValue = (field, value) => {
  if (field.type === 'lines') return (value || []).join('\n');
  if (field.type === 'csv') return (value || []).join(', ');
  if (field.type === 'multiselect') return (value || []).map(Number);
  if (field.type === 'checkbox') return Boolean(value);
  return value ?? '';
};

const toPayloadValue = (field, value) => {
  if (field.type === 'lines') return value.split('\n').map((item) => item.trim()).filter(Boolean);
  if (field.type === 'csv') return value.split(',').map((item) => item.trim()).filter(Boolean);
  if (typeof value === 'string') return value.trim();
  return value;
};

const validate = (fields, form) => {
  const errors = {};
  fields.forEach((field) => {
    const value = form[field.key];
    const empty = Array.isArray(value) ? !value.length : !String(value ?? '').trim();
    if (field.required && empty) errors[field.key] = `${field.label} is required.`;
    else if (field.type === 'url' && !empty && !isValidHttpUrl(String(value).trim())) errors[field.key] = 'Enter a full URL starting with https://';
  });
  return errors;
};

export function MultiSelect({ options, value, onChange }) {
  const [filter, setFilter] = useState('');
  const shown = options.filter((option) => option.label.toLowerCase().includes(filter.toLowerCase()));
  const toggle = (id) => onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id]);
  return (
    <div className="rounded-xl border border-slate-200">
      {options.length > 8 && (
        <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Filter..." className="w-full rounded-t-xl border-b border-slate-200 px-3 py-2 text-sm outline-none" />
      )}
      <div className="grid max-h-48 gap-1 overflow-y-auto p-2 sm:grid-cols-2">
        {shown.map((option) => (
          <label key={option.value} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
            <input type="checkbox" checked={value.includes(option.value)} onChange={() => toggle(option.value)} className="h-4 w-4 accent-indigo-600" />
            {option.label}
          </label>
        ))}
        {!shown.length && <span className="px-2 py-1.5 text-sm text-slate-500">No matches</span>}
      </div>
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  switch (field.type) {
    case 'textarea':
    case 'lines':
      return <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={field.rows || 4} className={inputClass} placeholder={field.placeholder} />;
    case 'select':
      return (
        <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
          <option value="">Select…</option>
          {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      );
    case 'checkbox':
      return (
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-indigo-600" />
          {field.checkboxLabel || field.label}
        </label>
      );
    case 'multiselect':
      return <MultiSelect options={field.options} value={value} onChange={onChange} />;
    default:
      return <input type={field.type === 'url' ? 'url' : 'text'} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} placeholder={field.placeholder} />;
  }
}

export default function EntityManager({
  entityLabel,
  items,
  loading,
  error,
  onRetry,
  fields,
  initialValues,
  onSave,
  onDelete,
  renderItem,
  searchText,
  deleteWarning,
}) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null); // null = closed, {} = new, item = edit
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState('');

  const visible = useMemo(
    () => (items || []).filter((item) => searchText(item).toLowerCase().includes(query.toLowerCase())),
    [items, query, searchText],
  );

  const openForm = (item) => {
    const values = initialValues(item);
    setForm(Object.fromEntries(fields.map((field) => [field.key, toFormValue(field, values[field.key])])));
    setErrors({});
    setServerError('');
    setEditing(item || {});
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(fields, form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const payload = Object.fromEntries(fields.map((field) => [field.key, toPayloadValue(field, form[field.key])]));
    setSaving(true);
    setServerError('');
    try {
      const result = await onSave(editing.id || null, payload);
      setNotice(result.message);
      setEditing(null);
    } catch (requestError) {
      setServerError(getErrorMessage(requestError, `Could not save the ${entityLabel}.`));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1"><SearchInput value={query} onChange={setQuery} placeholder={`Search ${entityLabel}s`} /></div>
        <button onClick={() => openForm(null)} className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">
          <Plus className="h-4 w-4" /> Add {entityLabel}
        </button>
      </div>

      {notice && <InlineAlert tone="success">{notice}</InlineAlert>}
      {error && <ErrorState message={error} onRetry={onRetry} />}
      {loading && !items && <LoadingState />}

      {items && (visible.length ? (
        <ul className="space-y-3">
          {visible.map((item) => (
            <li key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">{renderItem(item)}</div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => openForm(item)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={() => setDeleting(item)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:border-red-200 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title={query ? `No ${entityLabel}s match "${query}"` : `No ${entityLabel}s yet`} message={query ? undefined : `Add your first ${entityLabel}.`} />
      ))}

      <Modal
        open={Boolean(editing)}
        onClose={() => !saving && setEditing(null)}
        title={editing?.id ? `Edit ${entityLabel}` : `Add ${entityLabel}`}
        size="lg"
        footer={(
          <>
            <button type="button" onClick={() => setEditing(null)} disabled={saving} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" form="entity-form" disabled={saving} className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </>
        )}
      >
        <form id="entity-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => {
            const onChange = (value) => setForm((current) => ({ ...current, [field.key]: value }));
            if (field.type === 'checkbox') {
              return (
                <div key={field.key} className={field.full ? 'sm:col-span-2' : ''}>
                  <FieldInput field={field} value={form[field.key]} onChange={onChange} />
                </div>
              );
            }
            // A <label> around several checkboxes would toggle the first one on click
            const Wrapper = field.type === 'multiselect' ? 'fieldset' : 'label';
            return (
              <Wrapper key={field.key} className={`block text-sm font-medium text-slate-700 ${field.full ? 'sm:col-span-2' : ''}`}>
                {field.type === 'multiselect' ? <legend>{field.label}</legend> : field.label}
                {field.required && <span className="text-red-500"> *</span>}
                <div className="mt-1.5">
                  <FieldInput field={field} value={form[field.key]} onChange={onChange} />
                </div>
                {field.help && !errors[field.key] && <span className="mt-1 block text-xs font-normal text-slate-500">{field.help}</span>}
                {errors[field.key] && <span className="mt-1 block text-xs font-normal text-red-600">{errors[field.key]}</span>}
              </Wrapper>
            );
          })}
          {serverError && <div className="sm:col-span-2"><InlineAlert>{serverError}</InlineAlert></div>}
        </form>
      </Modal>

      <ConfirmModal
        open={Boolean(deleting)}
        title={`Delete ${entityLabel}?`}
        message={deleting ? deleteWarning(deleting) : ''}
        onConfirm={async () => {
          const result = await onDelete(deleting.id);
          setNotice(result.message);
        }}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
