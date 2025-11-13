import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

/**
 * RoleBasedRedirect Component
 * Redirects users to appropriate dashboard based on their role
 * 
 * Role Mapping:
 * - FIELD_OFFICER → /tasks/my-tasks
 * - SUPERVISOR → /supervisor
 * - EXECUTIVE → /executive-dashboard
 * - ADMIN → /admin/dashboard
 * 
 * If no user or invalid role → /login
 */
export const RoleBasedRedirect = () => {
  const user = useAuthStore((state) => state.user);

  console.log('[RoleBasedRedirect] User:', user);

  // If no user, redirect to login
  if (!user) {
    console.log('[RoleBasedRedirect] No user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // Role-based redirect mapping
  const redirectMap: Record<string, string> = {
    DEVELOPER: '/dashboard/developer',
    ADMIN: '/dashboard/admin',
    EXECUTIVE: '/dashboard/executive',
    SUPERVISOR: '/dashboard/supervisor',
    FIELD_OFFICER: '/dashboard/officer',
  };

  // Convert role to string for lookup (handles both string and enum)
  const userRoleString = typeof user.role === 'string' ? user.role : String(user.role);
  
  console.log('[RoleBasedRedirect] User Role String:', userRoleString);
  
  // Get redirect path for user's role
  const redirectPath = redirectMap[userRoleString];

  console.log('[RoleBasedRedirect] Redirect Path:', redirectPath);

  // If role not found in map, redirect to login
  if (!redirectPath) {
    console.error(`[RoleBasedRedirect] Unknown role: ${userRoleString}`);
    return <Navigate to="/login" replace />;
  }

  console.log('[RoleBasedRedirect] Redirecting to:', redirectPath);
  return <Navigate to={redirectPath} replace />;
};
