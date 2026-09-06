import { Link } from 'react-router-dom';
import { Sprout } from '../components/Botanical';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Sprout className="mb-6 h-14 w-14 text-[rgb(var(--olive))] opacity-70" />
      <h1 className="mb-3 font-serif text-3xl">This page slipped out of the notebook.</h1>
      <p className="muted mb-8 max-w-sm text-sm leading-relaxed">
        We could not find what you were looking for. It may have been moved, or the link was
        mistyped.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        Back to your journal
      </Link>
    </div>
  );
}
