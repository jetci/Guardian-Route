import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Role } from '../../types';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated() && user) {
    // Already logged in, redirect to appropriate dashboard
    switch (user.role) {
      case Role.ADMIN:
        return <Navigate to="/admin" replace />;
      case Role.EXECUTIVE:
        return <Navigate to="/executive" replace />;
      case Role.SUPERVISOR:
        return <Navigate to="/supervisor" replace />;
      case Role.FIELD_OFFICER:
        return <Navigate to="/field-officer" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
