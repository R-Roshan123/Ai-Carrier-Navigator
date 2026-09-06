import { useState } from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import { careerRecommendations, careerExplorer, profileData, projects, skillGapData } from '../data/seedData';

const learnedSkillLevels = {
  ...Object.fromEntries(skillGapData.map((skill) => [skill.skill, skill.current])),
  'Data Visualization': 72,
  'PyTorch': 38,
  'Model Evaluation': 42,
  Communication: 78,
  'Problem Solving': 82,
};

const roleDetails = {
  'Data Scientist': {
    summary: 'Analytical computer science graduate who builds data-driven solutions with Python, SQL, statistics, and machine learning.',
    skills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Data Visualization'],
    experience: ['Analyzed datasets and built research workflows as a Data Science Intern at BrightLabs.', 'Applied structured problem solving and technical research as a Research Assistant.'],
    projectKeywords: ['Python', 'Scikit-learn', 'SQL', 'PyTorch'],
    requirements: { Python: 90, SQL: 80, Statistics: 80, 'Machine Learning': 75, 'Data Visualization': 70 },
  },
  'Machine Learning Engineer': {
    summary: 'Computer science graduate focused on building, evaluating, and improving machine learning systems with Python and modern ML tools.',
    skills: ['Python', 'Machine Learning', 'SQL', 'PyTorch', 'Model Evaluation'],
    experience: ['Supported data preparation and model experimentation as a Data Science Intern at BrightLabs.', 'Conducted technical research and translated findings into clear recommendations as a Research Assistant.'],
    projectKeywords: ['Python', 'Scikit-learn', 'PyTorch', 'SQL'],
    requirements: { Python: 90, 'Machine Learning': 80, SQL: 70, PyTorch: 65, 'Model Evaluation': 70 },
  },
  'Data Analyst': {
    summary: 'Data-focused computer science graduate who turns business questions into clear analysis using SQL, Python, statistics, and visualization.',
    skills: ['SQL', 'Python', 'Statistics', 'Data Visualization', 'Problem Solving'],
    experience: ['Analyzed data and communicated findings as a Data Science Intern at BrightLabs.', 'Used research and problem-solving methods to support evidence-based decisions as a Research Assistant.'],
    projectKeywords: ['SQL', 'Power BI', 'Python'],
    requirements: { SQL: 80, Python: 70, Statistics: 70, 'Data Visualization': 75, Communication: 70 },
  },
};

const calculateRoleScore = (roleName) => {
  const role = roleDetails[roleName] || roleDetails['Data Scientist'];
  const skillEntries = Object.entries(role.requirements);
  const skillScore = Math.round(skillEntries.reduce((total, [skill, required]) => total + Math.min(100, ((learnedSkillLevels[skill] || 0) / required) * 100), 0) / skillEntries.length);
  const projectScore = Math.min(100, 70 + projects.filter((project) => project.technologies.some((technology) => role.projectKeywords.includes(technology))).length * 5);
  const experienceScore = roleName === 'Data Analyst' ? 84 : roleName === 'Data Scientist' ? 78 : 72;
  const breakdown = { skills: skillScore, experience: experienceScore, projects: projectScore, keywords: Math.max(50, skillScore - 4), formatting: 90 };
  const total = Math.round(Object.values(breakdown).reduce((sum, value) => sum + value, 0) / Object.keys(breakdown).length);
  return { breakdown, total };
};

export default function ResumePage() {
  const [selectedRole, setSelectedRole] = useState(localStorage.getItem('targetCareer') || careerRecommendations[0].name);
  const [generatedResume, setGeneratedResume] = useState(null);
  const selectedScore = calculateRoleScore(selectedRole);
  const roleScores = careerRecommendations.map((career) => ({ ...career, score: calculateRoleScore(career.name).total }));
  const missingSkills = Object.entries((roleDetails[selectedRole] || roleDetails['Data Scientist']).requirements)
    .filter(([skill, required]) => (learnedSkillLevels[skill] || 0) < required)
    .sort(([, requiredA], [, requiredB]) => requiredB - requiredA)
    .slice(0, 3)
    .map(([skill]) => `${skill} (${learnedSkillLevels[skill] || 0}%)`);

  const selectRole = (roleName) => {
    setSelectedRole(roleName);
    localStorage.setItem('targetCareer', roleName);
  };

  const generateResume = () => {
    const role = roleDetails[selectedRole] || roleDetails['Data Scientist'];
    const roleMatch = careerExplorer.find((career) => career.name === selectedRole);
    const matchingProjects = projects.filter((project) => project.technologies.some((technology) => role.projectKeywords.includes(technology))).slice(0, 2);
    setGeneratedResume({
      role,
      roleName: selectedRole,
      requiredEducation: roleMatch?.education || profileData.education.degree,
      projects: matchingProjects,
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
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Resume score for {selectedRole}: {selectedScore.total}/100</h1>
        <p className="mt-2 text-sm text-slate-600">Scores use the current skill levels from your Skill Gap progress and the requirements of each role.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3 print:hidden">
        {roleScores.map((career) => (
          <button key={career.name} onClick={() => selectRole(career.name)} className={`rounded-2xl border p-4 text-left transition ${selectedRole === career.name ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-200'}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-slate-900">{career.name}</span>
              <span className="text-lg font-bold text-indigo-700">{career.score}</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">Role resume score</div>
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="text-lg font-bold text-slate-900">{selectedRole} score breakdown</div>
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
                  <li>• {profileData.skills.technical.filter((skill) => (roleDetails[selectedRole] || roleDetails['Data Scientist']).requirements[skill]).join(', ') || 'Technical foundation aligned to the selected role'}</li>
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
                  {missingSkills.map((skill) => <li key={skill}>• {skill}</li>)}
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
            <select value={selectedRole} onChange={(event) => selectRole(event.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700" aria-label="Target role">
              {careerRecommendations.map((career) => <option key={career.name} value={career.name}>{career.name}</option>)}
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
