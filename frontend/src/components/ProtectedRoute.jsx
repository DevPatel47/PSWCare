import { Navigate, useLocation } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

function ProtectedRoute({ allowedRoles, children }) {
  const { auth, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(auth.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
