import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Copy, Check } from 'lucide-react';
import Logo from '../components/Logo';
import { Spinner } from '../components/Loading';
import { SprigLeft } from '../components/Botanical';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const { forgotPassword } = useAuth();
  const toast = useToast();

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) return setError('Please enter your email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('That email does not look right');

    setSubmitting(true);
    const result = await forgotPassword({ email });
    setSubmitting(false);

    if (result.success) {
      setSent(true);
      // Only present when the server has no mail provider configured - lets
      // the flow be tested end to end without sending a real email.
      setDevResetUrl(result.data?.resetUrl || '');
      toast.success(result.message);
    } else {
      toast.error(result.message);
      setError(result.message);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(devResetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be unavailable; the link is still visible and selectable */
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <SprigLeft className="pointer-events-none absolute -left-4 bottom-0 hidden h-72 w-44 text-[rgb(var(--olive))] opacity-30 lg:block" />

      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-8 text-center">
          <Logo to="/" size="lg" />
          <p className="muted mt-3 font-hand text-lg">We'll help you find your way back in.</p>
        </div>

        <div className="card p-7 sm:p-8">
          {!sent ? (
            <>
              <h1 className="mb-1 font-serif text-2xl">Forgot your password?</h1>
              <p className="muted mb-6 text-sm">
                Enter your email and we'll send you a link to reset it.
              </p>

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
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      placeholder="you@example.com"
                      className="input pl-10"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? 'email-error' : undefined}
                    />
                  </div>
                  {error && (
                    <p id="email-error" role="alert" className="mt-1.5 text-xs" style={{ color: 'rgb(var(--brandy))' }}>
                      {error}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-full py-3" disabled={submitting}>
                  {submitting && <Spinner size={16} />}
                  {submitting ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="mb-1 font-serif text-2xl">Check your email</h1>
              <p className="muted mb-6 text-sm leading-relaxed">
                If an account exists for <span style={{ color: 'rgb(var(--text))' }}>{email}</span>,
                we've sent a link to reset your password. It expires in an hour.
              </p>

              {devResetUrl && (
                <div
                  className="mb-6 rounded-xl border p-4 text-sm"
                  style={{ borderColor: 'rgb(var(--border))', backgroundColor: 'rgb(var(--surface-alt))' }}
                >
                  <p className="muted mb-2 text-xs leading-relaxed">
                    Email isn't configured on this server, so here's your reset link for testing:
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      to={devResetUrl.replace(window.location.origin, '')}
                      className="min-w-0 flex-1 truncate text-xs underline-offset-2 hover:underline"
                      style={{ color: 'rgb(var(--brandy))' }}
                    >
                      {devResetUrl}
                    </Link>
                    <button
                      type="button"
                      onClick={copyLink}
                      aria-label="Copy reset link"
                      className="muted shrink-0 rounded-md p-1.5 transition-colors hover:text-[rgb(var(--heading))]"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <p className="muted mt-6 text-center text-sm">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline"
              style={{ color: 'rgb(var(--brandy))' }}
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
