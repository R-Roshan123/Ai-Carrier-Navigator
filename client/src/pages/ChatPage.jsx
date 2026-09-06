import { useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { chatSuggestions } from '../data/seedData';

const initialMessages = [
  { sender: 'assistant', text: 'Based on your current profile, SQL and Power BI are your biggest near-term wins. Want me to suggest a tailored plan?' },
  { sender: 'user', text: 'What should I learn next?' },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((current) => [...current, { sender: 'user', text: input }, { sender: 'assistant', text: 'Your best next move is to sharpen SQL, complete one portfolio project, and review your resume for measurable impact.' }]);
    setInput('');
  };

  return (
    <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">AI career mentor</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Career mentor</h1>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r">
          <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Suggested prompts</div>
          <div className="space-y-2">
            {chatSuggestions.map((suggestion) => (
              <button key={suggestion} onClick={() => setInput(suggestion)} className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-[520px] flex-col p-5">
          <div className="flex-1 space-y-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={`${message.sender}-${index}`} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${message.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your mentor..."
              className="flex-1 border-0 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400"
            />
            <button onClick={sendMessage} className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">
              <SendHorizonal className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
