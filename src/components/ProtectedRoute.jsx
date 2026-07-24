import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wrap any route that requires login (e.g. /dashboard).
 * Signed-out visitors are sent to /auth, remembering where they
 * came from so we can send them back after they log in.
 */
export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  // Firebase resolves the signed-in session asynchronously; wait for it
  // before deciding to redirect, or a hard refresh on a protected route
  // would bounce a signed-in user to /auth for a split second.
  if (!ready) return null;
  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  return children;
}
