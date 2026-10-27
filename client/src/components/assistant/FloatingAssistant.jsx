import { useState } from 'react';
import { Bot, Maximize2, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AssistantChat from './AssistantChat';

// A chat button available on every page; hidden on the full AI Career Mentor page.
export default function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  if (pathname === '/chat') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      {open && (
        <div className="mb-3 flex h-[min(34rem,calc(100vh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 font-semibold text-slate-900"><Bot className="h-5 w-5 text-indigo-600" /> AI career mentor</div>
            <div className="flex items-center gap-1">
              <Link to="/chat" onClick={() => setOpen(false)} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Open full chat"><Maximize2 className="h-4 w-4" /></Link>
              <button onClick={() => setOpen(false)} className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Close assistant"><X className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="min-h-0 flex-1">
            <AssistantChat compact onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((current) => !current)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
        aria-label={open ? 'Close AI career mentor' : 'Open AI career mentor'}
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>
    </div>
  );
}
