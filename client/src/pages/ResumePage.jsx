import { useRef, useState } from 'react';
import { CheckCircle2, Download, FileText, Printer, RotateCcw, Sparkles, Trash2, Upload, XCircle } from 'lucide-react';
import { InlineAlert, LoadingState } from '../components/career/PageState';
import { profileData } from '../data/seedData';
import { allRoles, findRoleByTitle, getRole } from '../data/roleCareerData';
import { getErrorMessage } from '../services/careerApi';
import { resumeApi } from '../services/resumeApi';
import { readCurrentUser } from '../utils/careerFormat';
import { matchResumeToRoles } from '../utils/resumeMatch';
import { readTargetCareer, saveTargetCareer } from '../utils/targetCareer';

const ACCEPTED = '.pdf,.docx,.txt';
const SECTION_LABELS = { skills: 'Skills', experience: 'Experience', projects: 'Projects', education: 'Education', presentation: 'Presentation' };

// The extracted text is kept for this browser tab so a refresh does not lose the upload.
const storageKey = () => `resumeUpload:${readCurrentUser()?.id || 'guest'}`;
const loadUpload = () => {
  try {
    return JSON.parse(sessionStorage.getItem(storageKey()));
  } catch {
    return null;
  }
};
const saveUpload = (upload) => {
  try {
    if (upload) sessionStorage.setItem(storageKey(), JSON.stringify(upload));
    else sessionStorage.removeItem(storageKey());
  } catch {
    // Works for this page without storage.
  }
};

const scoreTone = (value) => (value >= 75 ? 'text-emerald-700' : value >= 50 ? 'text-indigo-700' : 'text-amber-700');
const barTone = (value) => (value >= 75 ? 'bg-emerald-500' : value >= 50 ? 'bg-indigo-600' : 'bg-amber-500');

const buildExperience = (role) => [
  `Applied ${role.skills[0]} and ${role.skills[1]} to real-world problems as ${profileData.experience.internships[0]}.`,
  `Researched and documented ${role.skills[2]} approaches as a ${profileData.experience.workExperience[0]}.`,
];

export default function ResumePage() {
  const fileInput = useRef(null);
  const [upload, setUpload] = useState(loadUpload);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [roleSlug, setRoleSlug] = useState(() => (findRoleByTitle(readTargetCareer()) || allRoles[0]).slug);
  const [reviews, setReviews] = useState({});
  const [generatedResume, setGeneratedResume] = useState(null);

  const role = getRole(roleSlug) || allRoles[0];
  const matches = upload ? matchResumeToRoles(upload.text) : [];
  const selectedMatch = matches.find((item) => item.role.slug === role.slug);
  const review = reviews[role.slug];
  // Skills and tools overlap for some roles (e.g. SQL), so list each keyword once.
  const foundKeywords = selectedMatch ? [...new Set([...selectedMatch.skills.found, ...selectedMatch.tools.found])] : [];
  const missingKeywords = selectedMatch ? [...new Set([...selectedMatch.skills.missing, ...selectedMatch.tools.missing])].filter((item) => !foundKeywords.includes(item)) : [];

  const requestReview = async (slug, text = upload?.text) => {
    if (!text) return;
    setReviews((current) => ({ ...current, [slug]: { loading: true } }));
    try {
      const data = await resumeApi.review(text, slug);
      setReviews((current) => ({ ...current, [slug]: { data } }));
    } catch (error) {
      setReviews((current) => ({ ...current, [slug]: { error: getErrorMessage(error, 'The AI review failed. Please try again.') } }));
    }
  };

  const selectRole = (slug) => {
    setRoleSlug(slug);
    saveTargetCareer(getRole(slug).title);
    if (upload && !reviews[slug]) requestReview(slug);
  };

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const result = await resumeApi.extract(file);
      setUpload(result);
      saveUpload(result);
      setReviews({});
      // Review the target career if one is set, otherwise the closest keyword match.
      const slug = findRoleByTitle(readTargetCareer())?.slug || matchResumeToRoles(result.text)[0].role.slug;
      setRoleSlug(slug);
      requestReview(slug, result.text);
    } catch (error) {
      setUploadError(getErrorMessage(error, 'The resume could not be uploaded.'));
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const removeUpload = () => {
    setUpload(null);
    saveUpload(null);
    setReviews({});
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
      <div className="print:hidden">
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Resume analyzer</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Score your resume for any job role</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Upload your resume to see how well it matches each role's skills and tools, then get an AI review with a score, strengths, and what to improve for the role you choose.
        </p>
      </div>

      <section
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); handleFile(event.dataTransfer.files[0]); }}
        className={`rounded-3xl border-2 border-dashed p-6 transition print:hidden ${dragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 bg-white'}`}
      >
        <input ref={fileInput} type="file" accept={ACCEPTED} className="hidden" onChange={(event) => handleFile(event.target.files[0])} />
        {upload ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><FileText className="h-5 w-5" /></span>
              <div>
                <div className="font-semibold text-slate-900">{upload.fileName}</div>
                <div className="text-sm text-slate-500">{upload.wordCount} words read from your resume</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => fileInput.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60">
                <Upload className="h-4 w-4" /> {uploading ? 'Reading...' : 'Upload a new version'}
              </button>
              <button onClick={removeUpload} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><Upload className="h-6 w-6" /></span>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">Upload your resume</h2>
            <p className="mt-1 text-sm text-slate-600">PDF, DOCX, or TXT, up to 5 MB. Drag it here or choose a file.</p>
            <button onClick={() => fileInput.current?.click()} disabled={uploading} className="mt-4 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
              {uploading ? 'Reading your resume...' : 'Choose file'}
            </button>
            <p className="mt-3 text-xs text-slate-500">Your file is only read to score it; it is not stored.</p>
          </div>
        )}
        {uploadError && <div className="mt-4"><InlineAlert>{uploadError}</InlineAlert></div>}
      </section>

      {upload && (
        <>
          <section className="space-y-3 print:hidden">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Keyword match by role</h2>
              <p className="text-sm text-slate-600">How many of each role's skills (70%) and tools (30%) your resume mentions. Choose a role for its AI review.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
              {matches.map(({ role: item, match }) => (
                <button
                  key={item.slug}
                  onClick={() => selectRole(item.slug)}
                  className={`rounded-2xl border p-4 text-left transition ${item.slug === role.slug ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100' : 'border-slate-200 bg-white hover:border-indigo-200'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-900">{item.title}</span>
                    <span className={`text-lg font-bold ${scoreTone(match)}`}>{match}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${barTone(match)}`} style={{ width: `${match}%` }} />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">{reviews[item.slug]?.data ? `AI score ${reviews[item.slug].data.score}/100` : 'Keyword match'}</div>
                </button>
              ))}
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr] print:hidden">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><Sparkles className="h-5 w-5 text-indigo-600" /> AI review for {role.title}</h2>
                {review?.data && <span className={`rounded-full bg-slate-50 px-3 py-1 text-sm font-bold ${scoreTone(review.data.score)}`}>{review.data.score}/100</span>}
              </div>

              {!review && (
                <button onClick={() => requestReview(role.slug)} className="mt-4 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Review my resume for {role.title}</button>
              )}
              {review?.loading && <LoadingState label={`Reviewing your resume for ${role.title}...`} />}
              {review?.error && (
                <div className="mt-4 space-y-3">
                  <InlineAlert>{review.error}</InlineAlert>
                  <button onClick={() => requestReview(role.slug)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"><RotateCcw className="h-4 w-4" /> Try again</button>
                </div>
              )}
              {review?.data && (
                <div className="mt-4 space-y-4">
                  <p className="text-sm text-slate-700">{review.data.summary}</p>
                  <div className="space-y-3">
                    {Object.entries(SECTION_LABELS).map(([key, label]) => (
                      <div key={key}>
                        <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                          <span>{label}</span>
                          <span className="font-medium text-slate-800">{review.data.sections[key]}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${barTone(review.data.sections[key])}`} style={{ width: `${review.data.sections[key]}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => requestReview(role.slug)} className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"><RotateCcw className="h-3.5 w-3.5" /> Review again</button>
                </div>
              )}
            </section>

            <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              {review?.data && (
                <>
                  <div>
                    <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Strengths</div>
                    <ul className="space-y-1.5 text-sm text-slate-700">
                      {review.data.strengths.length ? review.data.strengths.map((item) => <li key={item}>• {item}</li>) : <li>• No clear strengths for this role yet.</li>}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Improvements</div>
                    <ul className="space-y-1.5 text-sm text-slate-700">
                      {review.data.improvements.map((item) => <li key={item}>• {item}</li>)}
                    </ul>
                  </div>
                  {review.data.missingKeywords.length > 0 && (
                    <div>
                      <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Missing keywords</div>
                      <div className="flex flex-wrap gap-2">
                        {review.data.missingKeywords.map((item) => <span key={item} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">{item}</span>)}
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedMatch && (
                <div>
                  <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Skills & tools found ({selectedMatch.match}% keyword match)</div>
                  <div className="flex flex-wrap gap-2">
                    {foundKeywords.map((item) => (
                      <span key={item} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800"><CheckCircle2 className="h-3.5 w-3.5" /> {item}</span>
                    ))}
                    {missingKeywords.map((item) => (
                      <span key={item} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"><XCircle className="h-3.5 w-3.5" /> {item}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-indigo-600">Resume generator</div>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Create a focused resume for one role</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Choose a target role to keep the resume precise and limited to the experience, skills, education, and projects that support that job.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={role.slug} onChange={(event) => selectRole(event.target.value)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700" aria-label="Target role">
              {allRoles.map((career) => <option key={career.slug} value={career.slug}>{career.title}</option>)}
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
