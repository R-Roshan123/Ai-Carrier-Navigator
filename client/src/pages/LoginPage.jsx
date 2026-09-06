import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/login', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      window.dispatchEvent(new Event('auth-changed'));
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to log in. Check your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <Link to="/landing" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white"><Sparkles className="h-4 w-4" /></span>
          AI Career Navigator
        </Link>
        <div className="mt-8">
          <div className="text-sm uppercase tracking-[0.2em] text-indigo-600">Welcome back</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Log in to your account</h1>
          <p className="mt-2 text-sm text-slate-600">Only registered users can access the career workspace.</p>
        </div>

        <form onSubmit={submitForm} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">Username or email<input name="username" value={form.username} onChange={updateField} required autoComplete="username" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500" placeholder="Your name or email" /></label>
          <label className="block text-sm font-medium text-slate-700">Password<input name="password" type="password" value={form.password} onChange={updateField} required autoComplete="current-password" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500" placeholder="Your password" /></label>
          {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Logging in...' : 'Log in'}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">New here? <Link to="/signup" className="font-semibold text-indigo-600">Create an account</Link></p>
      </section>
    </main>
  );
}
