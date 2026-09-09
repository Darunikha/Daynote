import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { Spinner } from './Loading';

/**
 * Reusable modal for locking, unlocking, or removing password protection from journal entries.
 */
export default function PasswordModal({
  open,
  mode = 'unlock', // 'unlock' | 'lock' | 'remove'
  title,
  message,
  onSubmit,
  onCancel,
  loading = false,
  error = '',
}) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setValidationError('');
      return undefined;
    }

    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onCancel?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    setTimeout(() => inputRef.current?.focus(), 50);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onCancel, loading]);

  if (!open) return null;

  const modalTitle =
    title ||
    (mode === 'lock'
      ? 'Set Password Lock'
      : mode === 'remove'
      ? 'Remove Password Lock'
      : 'Unlock Journal Entry');

  const modalMessage =
    message ||
    (mode === 'lock'
      ? 'Enter a password to protect this entry. You will need this password to read or edit it.'
      : mode === 'remove'
      ? 'Enter the password to remove lock protection from this entry.'
      : 'This entry is password protected. Enter password to unlock.');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!password.trim()) {
      setValidationError('Please enter a password');
      return;
    }

    if (mode === 'lock') {
      if (password.length < 3) {
        setValidationError('Password must be at least 3 characters');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match');
        return;
      }
    }

    onSubmit?.(password.trim());
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-modal-title"
    >
      <div
        className="absolute inset-0 animate-fade-in bg-[rgb(31,29,29)]/40 backdrop-blur-[2px]"
        onClick={() => !loading && onCancel?.()}
        aria-hidden="true"
      />

      <div className="card relative w-full max-w-md animate-fade-up p-6 shadow-paper-lg">
        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[rgb(var(--accent-soft))] text-[rgb(var(--heading))]">
          {mode === 'lock' ? (
            <KeyRound size={20} aria-hidden="true" />
          ) : (
            <Lock size={20} aria-hidden="true" />
          )}
        </span>

        <h2 id="password-modal-title" className="mb-2 font-serif text-lg">
          {modalTitle}
        </h2>
        <p className="muted mb-5 text-sm leading-relaxed">{modalMessage}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="entry-password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="entry-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter entry password"
                className="input w-full pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="muted absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:text-[rgb(var(--heading))]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'lock' && (
            <div>
              <label htmlFor="confirm-entry-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-entry-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm entry password"
                className="input w-full"
                disabled={loading}
              />
            </div>
          )}

          {(validationError || error) && (
            <p className="text-xs font-medium text-[rgb(var(--brandy))]">
              {validationError || error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading && <Spinner size={15} />}
              {mode === 'lock' ? 'Lock Entry' : mode === 'remove' ? 'Remove Lock' : 'Unlock'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
