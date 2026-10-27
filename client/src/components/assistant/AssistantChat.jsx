import { useEffect, useRef, useState } from 'react';
import { RotateCcw, SendHorizonal, Trash2 } from 'lucide-react';
import MessageText from './MessageText';
import NinjaMark from './NinjaMark';
import { chatSuggestions } from '../../data/seedData';
import useAssistantChat from '../../hooks/useAssistantChat';

// The chat itself: used full-size on the AI Career Mentor page and compact in the floating assistant.
export default function AssistantChat({ compact = false, onNavigate }) {
  const { messages, sending, error, send, retry, reset } = useAssistantChat();
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending, error]);

  const submit = (text = input) => {
    if (!text.trim() || sending) return;
    send(text);
    setInput('');
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
        {!messages.length && (
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="career-chat-avatar flex h-8 w-8 shrink-0 items-center justify-center rounded-full"><NinjaMark size={16} /></span>
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                Hi! I'm your AI career mentor. I can see your assessments, roadmap, and course progress, so ask me what to learn next, how to close a skill gap, or how to prepare for a role.
              </div>
            </div>
            <div className={`grid gap-2 ${compact ? '' : 'sm:grid-cols-2'}`}>
              {chatSuggestions.map((suggestion) => (
                <button key={suggestion} onClick={() => submit(suggestion)} className="career-chat-suggestion rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition">
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'items-start gap-2'}`}>
            {message.role === 'assistant' && <span className="career-chat-avatar flex h-8 w-8 shrink-0 items-center justify-center rounded-full"><NinjaMark size={16} /></span>}
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.role === 'user' ? 'career-chat-user-message whitespace-pre-wrap' : 'bg-slate-100 text-slate-700'}`}>
              {message.role === 'user' ? message.content : <MessageText text={message.content} onNavigate={onNavigate} />}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex items-start gap-2">
            <span className="career-chat-avatar flex h-8 w-8 shrink-0 items-center justify-center rounded-full"><NinjaMark size={16} /></span>
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-500">Thinking…</div>
          </div>
        )}

        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
            <button onClick={retry} className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-medium"><RotateCcw className="h-3.5 w-3.5" /> Retry</button>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="border-t border-slate-200 p-3">
        <div className="career-chat-input flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            rows={1}
            maxLength={2000}
            placeholder="Ask your mentor..."
            aria-label="Message the AI career mentor"
            className="max-h-32 flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-slate-400"
          />
          <button type="submit" disabled={!input.trim() || sending} className="career-chat-send flex h-9 w-9 shrink-0 items-center justify-center rounded-full disabled:opacity-50" aria-label="Send message">
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
        {messages.length > 0 && (
          <button type="button" onClick={reset} className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700">
            <Trash2 className="h-3.5 w-3.5" /> New conversation
          </button>
        )}
      </form>
    </div>
  );
}
