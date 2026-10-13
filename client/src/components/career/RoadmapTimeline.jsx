import RoadmapStep from './RoadmapStep';
import StageProgressBar from './StageProgressBar';
import { formatHours } from '../../utils/careerFormat';

// Vertical timeline of stages → steps. Pass `statuses` ({ [stepId]: status })
// and `onStatusChange` to let the user track progress.
export default function RoadmapTimeline({ stages, statuses, onStatusChange, updatingStepId, openStepId }) {
  const tracking = Boolean(onStatusChange);

  return (
    <ol className="space-y-6">
      {stages.map((stage, stageIndex) => {
        const stageHours = stage.steps.reduce((sum, step) => sum + step.estimatedHours, 0);
        const completed = tracking ? stage.steps.filter((step) => statuses[step.id] === 'Completed') : [];
        const completedHours = completed.reduce((sum, step) => sum + step.estimatedHours, 0);
        return (
          <li key={stage.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700">{stageIndex + 1}</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl font-bold text-slate-900">{stage.title}</h3>
                  <span className="text-sm text-slate-500">
                    {stage.steps.length} steps · {formatHours(stageHours)}
                  </span>
                </div>
                {stage.description && <p className="mt-1 text-sm text-slate-600">{stage.description}</p>}
              </div>
            </div>

            {tracking && stage.steps.length > 0 && (
              <div className="mt-4">
                <StageProgressBar
                  title="Stage progress"
                  completed={completed.length}
                  total={stage.steps.length}
                  percent={stageHours ? Math.round((completedHours / stageHours) * 100) : 0}
                />
              </div>
            )}

            {stage.steps.length ? (
              <ol className="relative mt-5 space-y-3 before:absolute before:bottom-2 before:left-[9px] before:top-2 before:w-0.5 before:bg-slate-200">
                {stage.steps.map((step, stepIndex) => (
                  <RoadmapStep
                    key={step.id}
                    step={step}
                    index={stepIndex}
                    status={tracking ? statuses[step.id] || 'Not Started' : undefined}
                    onStatusChange={onStatusChange}
                    updating={updatingStepId === step.id}
                    defaultOpen={openStepId === step.id}
                  />
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm text-slate-500">No steps in this stage yet.</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
