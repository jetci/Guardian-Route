import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

/**
 * ProtectedRoute Component with RBAC Support
 * 
 * @param children - Component to render if authorized
 * @param allowedRoles - Array of roles allowed to access this route (optional)
 * @param redirectTo - Custom redirect path for unauthorized access (default: /unauthorized)
 * 
 * Security Flow:
 * 1. Check if user is authenticated → if not, redirect to /login
 * 2. Check if allowedRoles is specified → if not, allow all authenticated users
 * 3. Check if user's role is in allowedRoles → if not, redirect to redirectTo
 */
export function ProtectedRoute({ 
  children, 
  allowedRoles,
  redirectTo = '/unauthorized' 
}: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const user = useAuthStore((state) => state.user);

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      console.warn(`Access denied: User role "${user?.role}" not in allowed roles [${allowedRoles.join(', ')}]`);
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
}
