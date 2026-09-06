import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', education: '', department: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        education: form.education,
        department: form.department,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      window.dispatchEvent(new Event('auth-changed'));
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <Link to="/landing" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white"><Sparkles className="h-4 w-4" /></span>
          AI Career Navigator
        </Link>
        <div className="mt-8">
          <div className="text-sm uppercase tracking-[0.2em] text-indigo-600">Create account</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Start your career journey</h1>
          <p className="mt-2 text-sm text-slate-600">Create your account to save your assessment, skills, resume, and career plan.</p>
        </div>

        <form onSubmit={submitForm} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">Full name<input name="name" value={form.name} onChange={updateField} required autoComplete="name" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500" placeholder="Your full name" /></label>
          <label className="block text-sm font-medium text-slate-700">Email<input name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500" placeholder="you@example.com" /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">Password<input name="password" type="password" value={form.password} onChange={updateField} required minLength={6} autoComplete="new-password" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500" placeholder="At least 6 characters" /></label>
            <label className="block text-sm font-medium text-slate-700">Confirm password<input name="confirmPassword" type="password" value={form.confirmPassword} onChange={updateField} required minLength={6} autoComplete="new-password" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500" placeholder="Repeat password" /></label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">Education <span className="font-normal text-slate-400">(optional)</span><input name="education" value={form.education} onChange={updateField} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500" placeholder="Degree or course" /></label>
            <label className="block text-sm font-medium text-slate-700">Department <span className="font-normal text-slate-400">(optional)</span><input name="department" value={form.department} onChange={updateField} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500" placeholder="Major or department" /></label>
          </div>
          {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Creating account...' : 'Create account'}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="font-semibold text-indigo-600">Log in</Link></p>
      </section>
    </main>
  );
}
