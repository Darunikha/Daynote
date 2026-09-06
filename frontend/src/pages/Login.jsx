import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import { Spinner } from '../components/Loading';
import { SprigLeft } from '../components/Botanical';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const change = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'That email does not look right';
    if (!form.password) next.password = 'Please enter your password';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const result = await login(form);
    setSubmitting(false);

    if (result.success) {
      toast.success('Welcome back');
      navigate(location.state?.from || '/dashboard', { replace: true });
    } else {
      toast.error(result.message);
      setErrors({ password: result.message });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <SprigLeft className="pointer-events-none absolute -left-4 bottom-0 hidden h-72 w-44 text-[rgb(var(--olive))] opacity-30 lg:block" />

      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-8 text-center">
          <Logo to="/" size="lg" />
          <p className="muted mt-3 font-hand text-lg">Welcome back, take a breath.</p>
        </div>

        <div className="card p-7 sm:p-8">
          <h1 className="mb-1 font-serif text-2xl">Sign in</h1>
          <p className="muted mb-6 text-sm">Your notebook is right where you left it.</p>

          <form onSubmit={submit} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgb(var(--text-muted))' }}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={change}
                  placeholder="you@example.com"
                  className="input pl-10"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" role="alert" className="mt-1.5 text-xs" style={{ color: 'rgb(var(--brandy))' }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgb(var(--text-muted))' }}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={change}
                  placeholder="Your password"
                  className="input pl-10 pr-11"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="muted absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 transition-colors hover:text-[rgb(var(--heading))]"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="mt-1.5 text-xs"
                  style={{ color: 'rgb(var(--brandy))' }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full py-3" disabled={submitting}>
              {submitting && <Spinner size={16} />}
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="muted mt-6 text-center text-sm">
            New here?{' '}
            <Link to="/register" className="font-medium underline-offset-4 hover:underline" style={{ color: 'rgb(var(--brandy))' }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
