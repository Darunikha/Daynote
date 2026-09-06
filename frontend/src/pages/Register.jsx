import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import { Spinner } from '../components/Loading';
import { Branch } from '../components/Botanical';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const change = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email address';
    if (form.password.length < 6) next.password = 'Use at least 6 characters';
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const result = await register(form);
    setSubmitting(false);

    if (result.success) {
      toast.success('Welcome to Daynote');
      navigate('/dashboard', { replace: true });
    } else {
      toast.error(result.message);
      if (/email/i.test(result.message)) setErrors({ email: result.message });
    }
  };

  const field = (id, label, type, placeholder, Icon, autoComplete) => (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: 'rgb(var(--text-muted))' }}
        />
        <input
          id={id}
          name={id}
          type={type === 'password' && showPassword ? 'text' : type}
          autoComplete={autoComplete}
          value={form[id]}
          onChange={change}
          placeholder={placeholder}
          className={`input pl-10 ${type === 'password' ? 'pr-11' : ''}`}
          aria-invalid={Boolean(errors[id])}
          aria-describedby={errors[id] ? `${id}-error` : undefined}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="muted absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 transition-colors hover:text-[rgb(var(--heading))]"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {errors[id] && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs" style={{ color: 'rgb(var(--brandy))' }}>
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <Branch className="pointer-events-none absolute right-0 top-10 hidden h-32 w-56 text-[rgb(var(--accent))] opacity-40 lg:block" />

      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-8 text-center">
          <Logo to="/" size="lg" />
          <p className="muted mt-3 font-hand text-lg">Same girl, new chapter.</p>
        </div>

        <div className="card p-7 sm:p-8">
          <h1 className="mb-1 font-serif text-2xl">Create your account</h1>
          <p className="muted mb-6 text-sm">It takes a minute, and then the page is yours.</p>

          <form onSubmit={submit} noValidate className="space-y-4">
            {field('name', 'Name', 'text', 'What should we call you?', User, 'name')}
            {field('email', 'Email', 'email', 'you@example.com', Mail, 'email')}
            {field('password', 'Password', 'password', 'At least 6 characters', Lock, 'new-password')}
            {field('confirmPassword', 'Confirm Password', 'password', 'Type it once more', Lock, 'new-password')}

            <button type="submit" className="btn btn-primary w-full py-3" disabled={submitting}>
              {submitting && <Spinner size={16} />}
              {submitting ? 'Creating your space…' : 'Start Journaling'}
            </button>
          </form>

          <p className="muted mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-medium underline-offset-4 hover:underline" style={{ color: 'rgb(var(--brandy))' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
