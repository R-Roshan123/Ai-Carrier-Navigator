import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AuthLayout, { authInputClass } from '../components/auth/AuthLayout';
import api from '../services/api';

const PORTALS = {
  student: {
    eyebrow: 'Student login',
    title: 'Log in to your account',
    description: 'Access your assessments, roadmap, courses, and career plan.',
    home: '/dashboard',
    signup: '/signup',
  },
  admin: {
    eyebrow: 'Admin login',
    title: 'Sign in to the admin panel',
    description: 'Manage career roles, roadmaps, companies, and certificate verification.',
    home: '/admin/career',
    signup: '/admin/signup',
  },
};

export default function LoginPage({ portal = 'student' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const config = PORTALS[portal];
  const signupMessage = location.state?.message;
  const [form, setForm] = useState({ username: location.state?.email || '', password: '' });
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
      const response = await api.post('/auth/login', { ...form, portal });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      window.dispatchEvent(new Event('auth-changed'));
      navigate(config.home);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to log in. Check your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      portal={portal}
      mode="login"
      eyebrow={config.eyebrow}
      title={config.title}
      description={config.description}
      footer={<>New here? <Link to={config.signup} className="font-semibold text-indigo-600">Create {portal === 'admin' ? 'an admin' : 'a student'} account</Link></>}
    >
      <form onSubmit={submitForm} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-700">Username or email<input name="username" value={form.username} onChange={updateField} required autoComplete="username" className={authInputClass} placeholder="Your name or email" /></label>
        <label className="block text-sm font-medium text-slate-700">Password<input name="password" type="password" value={form.password} onChange={updateField} required autoComplete="current-password" className={authInputClass} placeholder="Your password" /></label>
        {signupMessage && !error && <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">{signupMessage}</p>}
        {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Logging in...' : portal === 'admin' ? 'Log in as admin' : 'Log in'}
          {!isSubmitting && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
    </AuthLayout>
  );
}
