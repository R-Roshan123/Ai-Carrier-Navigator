import { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AssistantChat from './AssistantChat';
import NinjaMark from './NinjaMark';

// A chat button available on every page; hidden on the full AI Career Mentor page.
export default function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  if (pathname === '/chat') return null;

  return (
    <div className="career-chat-theme fixed bottom-4 right-4 z-50 print:hidden">
      {open && (
        <div className="mb-3 flex h-[min(34rem,calc(100vh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden career-chat-panel rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="career-chat-header flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 font-semibold text-slate-900"><NinjaMark size={20} /> AI career mentor</div>
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
        className="career-chat-launcher ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition"
        aria-label={open ? 'Close AI career mentor' : 'Open AI career mentor'}
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" /> : <NinjaMark size={27} />}
      </button>
    </div>
  );
}
