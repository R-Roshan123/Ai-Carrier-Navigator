import { Link } from 'react-router-dom';

// Renders the small subset of Markdown the assistant uses (paragraphs, bullet and numbered
// lists, headings, **bold**, `code`) as React elements, never as raw HTML. App paths such as
// "(/roadmap)" become links so the user can jump straight to the page.
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\(\/[a-z0-9\-/?=&]*\))/gi;

function Inline({ text, onNavigate }) {
  return text.split(INLINE).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index} className="rounded bg-slate-200 px-1 py-0.5 text-[0.85em]">{part.slice(1, -1)}</code>;
    if (/^\(\/[a-z0-9\-/?=&]*\)$/i.test(part)) {
      const path = part.slice(1, -1);
      return <span key={index}>(<Link to={path} onClick={onNavigate} className="font-medium text-indigo-600 underline">{path}</Link>)</span>;
    }
    return part;
  });
}

export default function MessageText({ text, onNavigate }) {
  const blocks = [];
  let list = null;

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trimEnd();
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const type = bullet ? 'ul' : 'ol';
      if (!list || list.type !== type) blocks.push((list = { type, items: [] }));
      list.items.push((bullet || numbered)[1]);
      continue;
    }
    list = null;
    if (!line.trim()) continue;
    const heading = line.match(/^#{1,6}\s+(.*)$/);
    blocks.push({ type: heading ? 'h' : 'p', text: heading ? heading[1] : line });
  }

  return (
    <div className="space-y-2 leading-6">
      {blocks.map((block, index) => {
        if (block.type === 'ul' || block.type === 'ol') {
          const ListTag = block.type;
          return (
            <ListTag key={index} className={`space-y-1 pl-5 ${block.type === 'ul' ? 'list-disc' : 'list-decimal'}`}>
              {block.items.map((item, itemIndex) => <li key={itemIndex}><Inline text={item} onNavigate={onNavigate} /></li>)}
            </ListTag>
          );
        }
        if (block.type === 'h') return <p key={index} className="font-semibold text-slate-900"><Inline text={block.text} onNavigate={onNavigate} /></p>;
        return <p key={index}><Inline text={block.text} onNavigate={onNavigate} /></p>;
      })}
    </div>
  );
}
