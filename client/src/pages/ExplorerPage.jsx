import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { careerExplorer } from '../data/seedData';

export default function ExplorerPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const filteredCareers = useMemo(() => careerExplorer.filter((career) => `${career.name} ${career.category} ${career.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Career explorer</div>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Search careers</h1>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-500" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-56 border-0 bg-transparent text-sm outline-none" placeholder="Search careers" aria-label="Search careers" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredCareers.map((career) => (
          <div key={career.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{career.category}</span>
              <span className="text-sm font-medium text-slate-500">{career.salary}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{career.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{career.overview}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {career.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{skill}</span>
              ))}
            </div>
            <button onClick={() => setSelectedCareer(career)} className="mt-5 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">View Details</button>
          </div>
        ))}
      </div>
      {!filteredCareers.length && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">No careers match “{query}”.</div>}
      {selectedCareer && <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-900">{selectedCareer.name}</h2><p className="mt-2 text-sm text-slate-700">{selectedCareer.overview}</p><p className="mt-2 text-sm text-slate-600">Education: {selectedCareer.education}</p><p className="mt-2 text-sm text-slate-600">Tools: {selectedCareer.tools.join(', ')}</p></div><button onClick={() => setSelectedCareer(null)} className="text-sm font-medium text-indigo-700">Close</button></div></div>}
    </div>
  );
}
