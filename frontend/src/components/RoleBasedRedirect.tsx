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
  const { user } = useAuthStore();

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based redirect mapping
  const redirectMap: Record<string, string> = {
    FIELD_OFFICER: '/tasks/my-tasks',
    SUPERVISOR: '/supervisor',
    EXECUTIVE: '/executive-dashboard',
    ADMIN: '/admin/dashboard',
  };

  // Get redirect path for user's role
  const redirectPath = redirectMap[user.role];

  // If role not found in map, redirect to login
  if (!redirectPath) {
    console.error(`Unknown role: ${user.role}`);
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={redirectPath} replace />;
};
