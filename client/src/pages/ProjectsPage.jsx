import { useState } from 'react';
import RoleSelect from '../components/RoleSelect';
import { allRoles } from '../data/roleCareerData';
import useSelectedRole from '../hooks/useSelectedRole';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [role, selectRole] = useSelectedRole();
  const projects = (role ? [role] : allRoles).flatMap((item) => item.projects.map((project) => ({ ...project, role: item.title })));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Portfolio builder</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{role ? `Projects for ${role.title}` : 'Projects to build'}</h1>
        </div>
        <RoleSelect role={role} onChange={(slug) => { setSelectedProject(null); selectRole(slug); }} />
      </div>
      {selectedProject && <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-900">{selectedProject.name}</h2><p className="mt-2 text-sm text-slate-700">{selectedProject.description}</p><p className="mt-2 text-sm text-slate-700">Outcome: {selectedProject.outcome}</p><p className="mt-2 text-sm text-slate-600">Stack: {selectedProject.technologies.join(', ')} · {selectedProject.duration}</p></div><button onClick={() => setSelectedProject(null)} className="text-sm font-medium text-indigo-700">Close</button></div></div>}
      <div className="grid gap-5 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project.name} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{project.difficulty}</span>
              <span className="text-sm text-slate-500">{project.duration}</span>
            </div>
            <div className="mt-3 text-xs font-medium text-slate-500">{project.role}</div>
            <h2 className="mt-1 text-xl font-bold text-slate-900">{project.name}</h2>
            <p className="mt-2 flex-1 text-sm text-slate-600">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">{project.technologies.map((technology) => <span key={technology} className="rounded-full bg-indigo-50 px-2 py-1 text-xs text-indigo-700">{technology}</span>)}</div>
            <button onClick={() => { setSelectedProject(project); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="mt-5 self-start rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">View project plan</button>
          </article>
        ))}
      </div>
    </div>
  );
}
