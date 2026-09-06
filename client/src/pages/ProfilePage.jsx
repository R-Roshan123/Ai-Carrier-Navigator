import { profileData } from '../data/seedData';

export default function ProfilePage() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null') || {};

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-slate-500">User profile</div>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Profile and career details</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Personal</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <div><span className="font-semibold text-slate-900">Name:</span> {currentUser.name || profileData.personal.name}</div>
            <div><span className="font-semibold text-slate-900">Email:</span> {currentUser.email || profileData.personal.email}</div>
            <div><span className="font-semibold text-slate-900">Phone:</span> {profileData.personal.phone}</div>
            <div><span className="font-semibold text-slate-900">Location:</span> {profileData.personal.location}</div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Education</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <div><span className="font-semibold text-slate-900">Degree:</span> {currentUser.education || profileData.education.degree}</div>
            <div><span className="font-semibold text-slate-900">Department:</span> {currentUser.department || profileData.education.department}</div>
            <div><span className="font-semibold text-slate-900">College:</span> {profileData.education.college}</div>
            <div><span className="font-semibold text-slate-900">Graduation year:</span> {profileData.education.graduationYear}</div>
            <div><span className="font-semibold text-slate-900">CGPA:</span> {profileData.education.cgpa}</div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Skills</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <div><span className="font-semibold text-slate-900">Technical:</span> {profileData.skills.technical.join(', ')}</div>
            <div><span className="font-semibold text-slate-900">Soft skills:</span> {profileData.skills.soft.join(', ')}</div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Experience</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <div><span className="font-semibold text-slate-900">Internships:</span> {profileData.experience.internships.join(', ')}</div>
            <div><span className="font-semibold text-slate-900">Work experience:</span> {profileData.experience.workExperience.join(', ')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
