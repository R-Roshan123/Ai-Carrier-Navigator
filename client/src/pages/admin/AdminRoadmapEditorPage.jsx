import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Plus, Save, Trash2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import AdminCareerNav from '../../components/career/admin/AdminCareerNav';
import { MultiSelect } from '../../components/career/admin/EntityManager';
import { inputClass } from '../../components/career/CareerUi';
import { EmptyState, ErrorState, InlineAlert, LoadingState } from '../../components/career/PageState';
import useApiData from '../../hooks/useApiData';
import { careerApi, getErrorMessage } from '../../services/careerApi';
import { formatHours } from '../../utils/careerFormat';

const RESOURCE_TYPES = ['Course', 'Docs', 'Video', 'Article', 'Practice', 'Book'];
const DEFAULT_STAGES = ['Foundation', 'Intermediate', 'Advanced', 'Job-Ready'];

let keySeed = 0;
const nextKey = () => `k${(keySeed += 1)}`;

// Editor state keeps list fields as text (one item per line / comma separated).
const toEditorStep = (step) => ({
  key: nextKey(),
  id: step?.id || null,
  title: step?.title || '',
  description: step?.description || '',
  topics: (step?.topics || []).join('\n'),
  skills: (step?.skills || []).join(', '),
  projects: (step?.projects || []).join('\n'),
  estimatedHours: step?.estimatedHours ?? 10,
  resources: (step?.resources || []).map((resource) => ({ ...resource, key: nextKey() })),
  certificationIds: (step?.certifications || []).map((cert) => cert.id),
  open: !step,
});

const toEditorStage = (stage) => ({
  key: nextKey(),
  id: stage?.id || null,
  title: stage?.title || '',
  description: stage?.description || '',
  steps: (stage?.steps || []).map(toEditorStep),
});

const splitLines = (text) => text.split('\n').map((item) => item.trim()).filter(Boolean);
const splitCsv = (text) => text.split(',').map((item) => item.trim()).filter(Boolean);

const toPayload = (stages) =>
  stages.map((stage) => ({
    id: stage.id,
    title: stage.title,
    description: stage.description,
    steps: stage.steps.map((step) => ({
      id: step.id,
      title: step.title,
      description: step.description,
      topics: splitLines(step.topics),
      skills: splitCsv(step.skills),
      projects: splitLines(step.projects),
      estimatedHours: Number(step.estimatedHours),
      resources: step.resources.map(({ title, url, type, isFree }) => ({ title, url, type, isFree })),
      certificationIds: step.certificationIds,
    })),
  }));

const moveItem = (list, from, to) => {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

function IconButton({ label, onClick, disabled, children, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`rounded-full border border-slate-200 p-1.5 disabled:opacity-30 ${danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-600 hover:bg-slate-50'}`}
    >
      {children}
    </button>
  );
}

function StepEditor({ step, stageIndex, stepIndex, stepCount, stages, certOptions, onChange, onMove, onMoveToStage, onRemove }) {
  const set = (key) => (event) => onChange({ [key]: event.target.value });
  const setResource = (index, patch) => onChange({ resources: step.resources.map((resource, i) => (i === index ? { ...resource, ...patch } : resource)) });

  return (
    <li className="rounded-2xl border border-slate-200 bg-slate-50">
      <div className="flex items-center gap-2 p-3">
        <button type="button" onClick={() => onChange({ open: !step.open })} className="flex min-w-0 flex-1 items-center gap-2 text-left" aria-expanded={step.open}>
          <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${step.open ? 'rotate-180' : ''}`} />
          <span className="truncate text-sm font-semibold text-slate-900">{step.title || 'Untitled step'}</span>
          <span className="shrink-0 text-xs text-slate-500">{formatHours(Number(step.estimatedHours) || 0)}</span>
        </button>
        <IconButton label="Move step up" onClick={() => onMove(-1)} disabled={stepIndex === 0}><ArrowUp className="h-3.5 w-3.5" /></IconButton>
        <IconButton label="Move step down" onClick={() => onMove(1)} disabled={stepIndex === stepCount - 1}><ArrowDown className="h-3.5 w-3.5" /></IconButton>
        <IconButton label="Delete step" onClick={onRemove} danger><Trash2 className="h-3.5 w-3.5" /></IconButton>
      </div>

      {step.open && (
        <div className="grid gap-3 border-t border-slate-200 bg-white p-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700 sm:col-span-2">Title *<input value={step.title} onChange={set('title')} className={`${inputClass} mt-1`} /></label>
          <label className="block text-sm font-medium text-slate-700 sm:col-span-2">Description<textarea value={step.description} onChange={set('description')} rows={2} className={`${inputClass} mt-1`} /></label>
          <label className="block text-sm font-medium text-slate-700">Estimated hours *<input type="number" min={1} max={1000} value={step.estimatedHours} onChange={set('estimatedHours')} className={`${inputClass} mt-1`} /></label>
          <label className="block text-sm font-medium text-slate-700">
            Stage
            <select value={stageIndex} onChange={(event) => onMoveToStage(Number(event.target.value))} className={`${inputClass} mt-1`}>
              {stages.map((stage, index) => <option key={stage.key} value={index}>{stage.title || `Stage ${index + 1}`}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">Topics to learn<textarea value={step.topics} onChange={set('topics')} rows={4} className={`${inputClass} mt-1`} placeholder="One per line" /></label>
          <label className="block text-sm font-medium text-slate-700">Practice projects<textarea value={step.projects} onChange={set('projects')} rows={4} className={`${inputClass} mt-1`} placeholder="One per line" /></label>
          <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
            Skills gained
            <input value={step.skills} onChange={set('skills')} className={`${inputClass} mt-1`} placeholder="Comma separated – use the role's skill names" />
          </label>

          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-medium text-slate-700">Resources</legend>
            <div className="mt-1 space-y-2">
              {step.resources.map((resource, index) => (
                <div key={resource.key} className="grid gap-2 rounded-xl border border-slate-200 p-2 sm:grid-cols-[1fr_1.4fr_auto_auto_auto] sm:items-center">
                  <input value={resource.title} onChange={(event) => setResource(index, { title: event.target.value })} className={inputClass} placeholder="Title" aria-label="Resource title" />
                  <input value={resource.url} onChange={(event) => setResource(index, { url: event.target.value })} className={inputClass} placeholder="https://..." aria-label="Resource URL" />
                  <select value={resource.type} onChange={(event) => setResource(index, { type: event.target.value })} className={inputClass} aria-label="Resource type">
                    {RESOURCE_TYPES.map((type) => <option key={type}>{type}</option>)}
                  </select>
                  <label className="flex items-center gap-1.5 text-sm text-slate-700">
                    <input type="checkbox" checked={resource.isFree} onChange={(event) => setResource(index, { isFree: event.target.checked })} className="h-4 w-4 accent-indigo-600" /> Free
                  </label>
                  <IconButton label="Remove resource" onClick={() => onChange({ resources: step.resources.filter((_, i) => i !== index) })} danger><Trash2 className="h-3.5 w-3.5" /></IconButton>
                </div>
              ))}
              <button type="button" onClick={() => onChange({ resources: [...step.resources, { key: nextKey(), title: '', url: '', type: 'Course', isFree: true }] })} className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
                <Plus className="h-4 w-4" /> Add resource
              </button>
            </div>
          </fieldset>

          <fieldset className="sm:col-span-2">
            <legend className="mb-1 text-sm font-medium text-slate-700">Linked certifications</legend>
            <MultiSelect options={certOptions} value={step.certificationIds} onChange={(certificationIds) => onChange({ certificationIds })} />
          </fieldset>
        </div>
      )}
    </li>
  );
}

export default function AdminRoadmapEditorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roles = useApiData(() => careerApi.admin.listRoles(), []);
  const certs = useApiData(() => careerApi.admin.listCertifications(), []);
  const roleList = roles.data?.roles || [];
  const roleId = Number(searchParams.get('role')) || roleList[0]?.id || null;

  const [stages, setStages] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState({ tone: 'success', text: '', errors: [] });
  const dirtyRef = useRef(false);
  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);

  useEffect(() => {
    if (!roleId) return undefined;
    let active = true;
    setStages(null);
    setLoadError('');
    setResult({ tone: 'success', text: '', errors: [] });
    careerApi
      .getRoleRoadmap(roleId)
      .then((data) => {
        if (!active) return;
        setStages(data.roadmap.stages.map(toEditorStage));
        setDirty(false);
      })
      .catch((error) => active && setLoadError(getErrorMessage(error)));
    return () => {
      active = false;
    };
  }, [roleId]);

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    const onBeforeUnload = (event) => {
      if (dirtyRef.current) event.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  const update = (updater) => {
    setStages(updater);
    setDirty(true);
  };
  const updateStage = (stageIndex, patch) => update((current) => current.map((stage, i) => (i === stageIndex ? { ...stage, ...patch } : stage)));
  const updateStep = (stageIndex, stepIndex, patch) => {
    const apply = (current) =>
      current.map((stage, i) => (i === stageIndex ? { ...stage, steps: stage.steps.map((step, j) => (j === stepIndex ? { ...step, ...patch } : step)) } : stage));
    // Expanding/collapsing a step is not an edit
    if (Object.keys(patch).length === 1 && 'open' in patch) setStages(apply);
    else update(apply);
  };
  const moveStepToStage = (fromStage, stepIndex, toStage) =>
    update((current) => {
      if (fromStage === toStage) return current;
      const step = current[fromStage].steps[stepIndex];
      return current.map((stage, i) => {
        if (i === fromStage) return { ...stage, steps: stage.steps.filter((_, j) => j !== stepIndex) };
        if (i === toStage) return { ...stage, steps: [...stage.steps, step] };
        return stage;
      });
    });

  const changeRole = (value) => {
    if (dirty && !window.confirm('You have unsaved changes. Discard them?')) return;
    setSearchParams({ role: value });
  };

  const save = async () => {
    setSaving(true);
    setResult({ tone: 'success', text: '', errors: [] });
    try {
      const response = await careerApi.admin.saveRoadmap(roleId, toPayload(stages));
      setStages(response.roadmap.stages.map(toEditorStage));
      setDirty(false);
      setResult({ tone: 'success', text: `${response.message} ${response.roadmap.totalSteps} steps · ${formatHours(response.roadmap.totalHours)}.`, errors: [] });
    } catch (error) {
      setResult({ tone: 'error', text: getErrorMessage(error, 'Could not save the roadmap.'), errors: error.response?.data?.errors || [] });
    } finally {
      setSaving(false);
    }
  };

  const certOptions = (certs.data?.certifications || []).map((cert) => ({ value: cert.id, label: `${cert.name} (${cert.provider})` }));
  const totalHours = (stages || []).flatMap((stage) => stage.steps).reduce((sum, step) => sum + (Number(step.estimatedHours) || 0), 0);

  return (
    <div className="space-y-6">
      <AdminCareerNav />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Roadmap editor</h1>
          <p className="mt-1 text-sm text-slate-600">Order is saved exactly as shown. Existing steps keep their ids, so users' progress is preserved when you reorder or edit.</p>
        </div>
        <label className="block w-full text-xs font-medium uppercase tracking-wide text-slate-500 md:w-72">
          Role
          <select value={roleId || ''} onChange={(event) => changeRole(event.target.value)} className={`${inputClass} mt-1 normal-case tracking-normal text-slate-700`}>
            {roleList.map((role) => <option key={role.id} value={role.id}>{role.title}</option>)}
          </select>
        </label>
      </div>

      {(roles.error || certs.error || loadError) && <ErrorState message={roles.error || certs.error || loadError} onRetry={() => window.location.reload()} />}
      {roles.data && !roleList.length && <EmptyState title="No roles yet" message="Create a job role first, then build its roadmap here." />}
      {roleId && !stages && !loadError && <LoadingState label="Loading roadmap..." />}

      {stages && (
        <>
          <div className="sticky top-16 z-20 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-600">
              {stages.length} stages · {stages.reduce((sum, stage) => sum + stage.steps.length, 0)} steps · {formatHours(totalHours)}
              {dirty && <span className="ml-2 font-medium text-amber-700">· Unsaved changes</span>}
            </span>
            <button onClick={save} disabled={saving || !dirty} className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
              <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save roadmap'}
            </button>
          </div>

          {result.text && (
            <div className="space-y-2">
              <InlineAlert tone={result.tone}>{result.text}</InlineAlert>
              {result.errors.length > 1 && (
                <ul className="list-disc space-y-0.5 pl-5 text-sm text-red-700">
                  {result.errors.map((error) => <li key={error}>{error}</li>)}
                </ul>
              )}
            </div>
          )}

          {!stages.length && (
            <EmptyState
              title="This role has no roadmap yet"
              message="Start with the standard four stages or add your own."
              action={(
                <button onClick={() => update(DEFAULT_STAGES.map((title) => toEditorStage({ title, steps: [] })))} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                  Add Foundation → Job-Ready stages
                </button>
              )}
            />
          )}

          <ol className="space-y-5">
            {stages.map((stage, stageIndex) => (
              <li key={stage.key} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700">{stageIndex + 1}</div>
                  <div className="grid flex-1 gap-2">
                    <input value={stage.title} onChange={(event) => updateStage(stageIndex, { title: event.target.value })} className={`${inputClass} font-semibold`} placeholder="Stage title" aria-label="Stage title" />
                    <input value={stage.description} onChange={(event) => updateStage(stageIndex, { description: event.target.value })} className={inputClass} placeholder="Stage description (optional)" aria-label="Stage description" />
                  </div>
                  <div className="flex gap-1.5">
                    <IconButton label="Move stage up" onClick={() => update((current) => moveItem(current, stageIndex, stageIndex - 1))} disabled={stageIndex === 0}><ArrowUp className="h-3.5 w-3.5" /></IconButton>
                    <IconButton label="Move stage down" onClick={() => update((current) => moveItem(current, stageIndex, stageIndex + 1))} disabled={stageIndex === stages.length - 1}><ArrowDown className="h-3.5 w-3.5" /></IconButton>
                    <IconButton
                      label="Delete stage"
                      danger
                      onClick={() => {
                        if (stage.steps.length && !window.confirm(`Delete "${stage.title || 'this stage'}" and its ${stage.steps.length} steps? Users' progress on those steps will be lost when you save.`)) return;
                        update((current) => current.filter((_, i) => i !== stageIndex));
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconButton>
                  </div>
                </div>

                <ol className="mt-4 space-y-2">
                  {stage.steps.map((step, stepIndex) => (
                    <StepEditor
                      key={step.key}
                      step={step}
                      stageIndex={stageIndex}
                      stepIndex={stepIndex}
                      stepCount={stage.steps.length}
                      stages={stages}
                      certOptions={certOptions}
                      onChange={(patch) => updateStep(stageIndex, stepIndex, patch)}
                      onMove={(direction) => updateStage(stageIndex, { steps: moveItem(stage.steps, stepIndex, stepIndex + direction) })}
                      onMoveToStage={(target) => moveStepToStage(stageIndex, stepIndex, target)}
                      onRemove={() => {
                        if (step.id && !window.confirm(`Delete "${step.title}"? Users' progress on this step will be lost when you save.`)) return;
                        updateStage(stageIndex, { steps: stage.steps.filter((_, j) => j !== stepIndex) });
                      }}
                    />
                  ))}
                </ol>
                <button onClick={() => updateStage(stageIndex, { steps: [...stage.steps, toEditorStep(null)] })} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
                  <Plus className="h-4 w-4" /> Add step
                </button>
              </li>
            ))}
          </ol>

          <button onClick={() => update((current) => [...current, toEditorStage(null)])} className="inline-flex items-center gap-2 rounded-full border border-dashed border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-indigo-300">
            <Plus className="h-4 w-4" /> Add stage
          </button>
        </>
      )}
    </div>
  );
}
