import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './Loading';

/** Guards every authenticated route; remembers where the user was headed. */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader label="Just a moment…" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

/** Keeps signed-in users away from the login/register pages. */
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader label="Just a moment…" />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}
