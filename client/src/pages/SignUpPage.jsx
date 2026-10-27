import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AuthLayout, { authInputClass } from '../components/auth/AuthLayout';
import api from '../services/api';

const YEARS_OF_STUDY = ['1st year', '2nd year', '3rd year', '4th year', '5th year', 'Graduated'];

// Detail fields per account type; name, email, phone, and passwords are shared.
const ACCOUNT_TYPES = {
  student: {
    eyebrow: 'Student sign up',
    title: 'Start your career journey',
    description: 'Create your student account to save your assessments, skills, resume, and career plan.',
    login: '/login',
    fields: [
      { name: 'registerNumber', label: 'Register number', placeholder: 'e.g. URK23CS1001', required: true },
      { name: 'college', label: 'College / university', placeholder: 'Your institution', required: true },
      { name: 'education', label: 'Degree / course', placeholder: 'e.g. B.Tech Computer Science', required: true },
      { name: 'department', label: 'Department', placeholder: 'e.g. Computer Science', required: true },
      { name: 'yearOfStudy', label: 'Year of study', options: YEARS_OF_STUDY, required: true },
    ],
  },
  admin: {
    eyebrow: 'Admin sign up',
    title: 'Create an admin account',
    description: 'Admins manage career content and verify student certificates. You need the admin access code from your administrator.',
    login: '/admin/login',
    fields: [
      { name: 'staffId', label: 'Staff ID', placeholder: 'Your employee or staff ID', required: true },
      { name: 'designation', label: 'Designation', placeholder: 'e.g. Placement Officer', required: true },
      { name: 'organization', label: 'Organization / institution', placeholder: 'Your institution', required: true },
      { name: 'department', label: 'Department', placeholder: 'e.g. Training & Placement', required: false },
      { name: 'adminCode', label: 'Admin access code', placeholder: 'Provided by your administrator', required: true, type: 'password' },
    ],
  },
};

const emptyForm = (config) => ({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  ...Object.fromEntries(config.fields.map((field) => [field.name, ''])),
});

function Field({ field, value, onChange }) {
  const label = (
    <>
      {field.label} {!field.required && <span className="font-normal text-slate-400">(optional)</span>}
    </>
  );

  if (field.options) {
    return (
      <label className="block text-sm font-medium text-slate-700">
        {label}
        <select name={field.name} value={value} onChange={onChange} required={field.required} className={`${authInputClass} bg-white`}>
          <option value="">Select...</option>
          {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
    );
  }

  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input name={field.name} type={field.type || 'text'} value={value} onChange={onChange} required={field.required} autoComplete="off" className={authInputClass} placeholder={field.placeholder} />
    </label>
  );
}

export default function SignUpPage({ accountType = 'student' }) {
  const navigate = useNavigate();
  const config = ACCOUNT_TYPES[accountType];
  const [form, setForm] = useState(() => emptyForm(config));
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
      const { confirmPassword: _confirmPassword, ...details } = form;
      const response = await api.post('/auth/register', { ...details, accountType });
      // The account is saved; the user now signs in with it on the matching login page.
      navigate(config.login, { state: { email: response.data.user.email, message: 'Account created. Log in with your new email and password.' } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      portal={accountType}
      mode="signup"
      wide
      eyebrow={config.eyebrow}
      title={config.title}
      description={config.description}
      footer={<>Already have an account? <Link to={config.login} className="font-semibold text-indigo-600">Log in</Link></>}
    >
      <form onSubmit={submitForm} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">Full name<input name="name" value={form.name} onChange={updateField} required autoComplete="name" className={authInputClass} placeholder="Your full name" /></label>
          <label className="block text-sm font-medium text-slate-700">Email<input name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" className={authInputClass} placeholder="you@example.com" /></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {config.fields.map((field) => <Field key={field.name} field={field} value={form[field.name]} onChange={updateField} />)}
          <label className="block text-sm font-medium text-slate-700">Phone <span className="font-normal text-slate-400">(optional)</span><input name="phone" type="tel" value={form.phone} onChange={updateField} autoComplete="tel" className={authInputClass} placeholder="+91 98765 43210" /></label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">Password<input name="password" type="password" value={form.password} onChange={updateField} required minLength={6} autoComplete="new-password" className={authInputClass} placeholder="At least 6 characters" /></label>
          <label className="block text-sm font-medium text-slate-700">Confirm password<input name="confirmPassword" type="password" value={form.confirmPassword} onChange={updateField} required minLength={6} autoComplete="new-password" className={authInputClass} placeholder="Repeat password" /></label>
        </div>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? 'Creating account...' : accountType === 'admin' ? 'Create admin account' : 'Create student account'}
          {!isSubmitting && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
    </AuthLayout>
  );
}
