import AssistantChat from '../components/assistant/AssistantChat';

export default function ChatPage() {
  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] min-h-[520px] max-w-4xl flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">AI career mentor</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Career mentor</h1>
        <p className="mt-1 text-sm text-slate-600">Personal advice based on your assessments, learning roadmap, and courses.</p>
      </div>
      <div className="min-h-0 flex-1">
        <AssistantChat />
      </div>
    </div>
  );
}
