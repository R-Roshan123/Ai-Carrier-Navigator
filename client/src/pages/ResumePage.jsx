import { useState } from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import { profileData } from '../data/seedData';
import { allRoles, findRoleByTitle } from '../data/roleCareerData';
import { readScores } from '../utils/assessmentScores';
import { readTargetCareer, saveTargetCareer } from '../utils/targetCareer';

// Loose match so profile skills like "Python" count for role skills like "Python & pandas".
const hasProfileSkill = (skill) =>
  profileData.skills.technical.some((owned) => skill.toLowerCase().includes(owned.toLowerCase()) || owned.toLowerCase().includes(skill.toLowerCase()));

const calculateRoleScore = (role, score) => {
  // Assessment results are the best evidence of skill; fall back to the skills listed on the profile.
  const skillScore = score ? score.last : Math.round((role.skills.filter(hasProfileSkill).length / role.skills.length) * 100);
  const experienceScore = role.title === 'Data Analyst' ? 84 : role.title === 'Data Scientist' ? 78 : 72;
  const projectScore = Math.min(100, 70 + role.projects.length * 5);
  const breakdown = { skills: skillScore, experience: experienceScore, projects: projectScore, keywords: Math.max(50, skillScore - 4), formatting: 90 };
  const total = Math.round(Object.values(breakdown).reduce((sum, value) => sum + value, 0) / Object.keys(breakdown).length);
  return { breakdown, total };
};

const buildExperience = (role) => [
  `Applied ${role.skills[0]} and ${role.skills[1]} to real-world problems as ${profileData.experience.internships[0]}.`,
  `Researched and documented ${role.skills[2]} approaches as a ${profileData.experience.workExperience[0]}.`,
];

export default function ResumePage() {
  const [selectedRole, setSelectedRole] = useState(() => (findRoleByTitle(readTargetCareer()) || allRoles[0]).title);
  const [generatedResume, setGeneratedResume] = useState(null);
  const scores = readScores();
  const role = findRoleByTitle(selectedRole) || allRoles[0];
  const roleScore = scores[role.slug];
  const selectedScore = calculateRoleScore(role, roleScore);
  const roleScores = allRoles.map((item) => ({ ...item, score: calculateRoleScore(item, scores[item.slug]).total }));
  const missingSkills = roleScore?.weakTopics
    ? roleScore.weakTopics.slice(0, 3)
    : role.skills.filter((skill) => !hasProfileSkill(skill)).slice(0, 3);
  const matchedSkills = role.skills.filter(hasProfileSkill);

  const selectRole = (roleName) => {
    setSelectedRole(roleName);
    saveTargetCareer(roleName);
  };

  const generateResume = () => {
    setGeneratedResume({
      role: { summary: role.resumeSummary, skills: role.skills, experience: buildExperience(role) },
      roleName: role.title,
      projects: role.projects,
    });
  };

  const printResume = () => {
    if (!generatedResume) generateResume();
    window.setTimeout(() => window.print(), 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Resume analyzer</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Resume score for {role.title}: {selectedScore.total}/100</h1>
        <p className="mt-2 text-sm text-slate-600">Skill scores use your latest role assessment, or the skills on your profile if you haven't taken it yet.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5 print:hidden">
        {roleScores.map((career) => (
          <button key={career.slug} onClick={() => selectRole(career.title)} className={`rounded-2xl border p-4 text-left transition ${role.title === career.title ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-200'}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-slate-900">{career.title}</span>
              <span className="text-lg font-bold text-indigo-700">{career.score}</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">Role resume score</div>
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="text-lg font-bold text-slate-900">{role.title} score breakdown</div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">{selectedScore.total}/100</span>
          </div>
          <div className="mt-5 space-y-4">
            {Object.entries(selectedScore.breakdown).map(([key, value]) => (
              <div key={key}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span className="capitalize">{key}</span>
                  <span>{value}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-indigo-600" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
          <div className="space-y-5">
              <div>
                <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Strengths</div>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• {(roleScore?.strongTopics?.length ? roleScore.strongTopics : matchedSkills).join(', ') || 'Technical foundation aligned to the selected role'}</li>
                  <li>• {profileData.education.degree} with {profileData.education.department} focus</li>
                </ul>
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Improvements</div>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• Add measurable impact to internship descriptions</li>
                  <li>• Build evidence for the highest-priority missing skills</li>
                </ul>
              </div>
              <div>
                <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Missing skills</div>
                <ul className="space-y-2 text-sm text-slate-700">
                  {missingSkills.length ? missingSkills.map((skill) => <li key={skill}>• {skill}</li>) : <li>• None — you cover the core skills for this role</li>}
                </ul>
              </div>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-indigo-600">Resume generator</div>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Create a focused resume for one role</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Choose a target role to keep the resume precise and limited to the experience, skills, education, and projects that support that job.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={role.title} onChange={(event) => selectRole(event.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700" aria-label="Target role">
              {allRoles.map((career) => <option key={career.slug} value={career.title}>{career.title}</option>)}
            </select>
            <button onClick={generateResume} className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white"><FileText className="h-4 w-4" />Generate resume</button>
          </div>
        </div>
      </section>

      {generatedResume && (
        <section className="resume-document rounded-2xl border border-slate-200 bg-white p-8 shadow-sm print:border-0 print:p-0 print:shadow-none">
          <div className="flex flex-col gap-2 border-b border-slate-300 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">{profileData.personal.name}</h2>
              <div className="mt-1 text-lg font-medium text-indigo-700">{generatedResume.roleName}</div>
            </div>
            <div className="text-sm text-slate-600 sm:text-right">
              <div>{profileData.personal.email}</div>
              <div>{profileData.personal.phone}</div>
              <div>{profileData.personal.location}</div>
            </div>
          </div>

          <div className="mt-6 space-y-6 text-sm text-slate-700">
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Professional summary</h3>
              <p className="leading-6">{generatedResume.role.summary}</p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Core skills</h3>
              <p className="leading-6">{generatedResume.role.skills.join(' · ')}</p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Relevant experience</h3>
              <ul className="list-disc space-y-2 pl-5">
                {generatedResume.role.experience.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Education</h3>
              <p>{profileData.education.degree}, {profileData.education.department} · {profileData.education.college} · {profileData.education.graduationYear}</p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Selected projects</h3>
              <div className="space-y-3">
                {generatedResume.projects.map((project) => <div key={project.name}><div className="font-semibold text-slate-900">{project.name}</div><p className="mt-1">{project.description} Technologies: {project.technologies.join(', ')}.</p></div>)}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-2 border-t border-slate-200 pt-5 print:hidden">
            <button onClick={printResume} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"><Printer className="h-4 w-4" />Print / Save PDF</button>
            <button onClick={generateResume} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"><Download className="h-4 w-4" />Regenerate</button>
          </div>
        </section>
      )}
    </div>
  );
}
