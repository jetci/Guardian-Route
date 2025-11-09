import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Role, hasRoleAccess, hasAnyRole } from './guards/RoleGuard';

interface RoleProtectedRouteProps {
  /**
   * Children to render if user has access
   */
  children: React.ReactNode;
  
  /**
   * Required roles to access this route
   * If not specified, only authentication is required
   */
  requiredRoles?: Role[];
  
  /**
   * Redirect path if user doesn't have access
   * @default '/unauthorized'
   */
  redirectTo?: string;
}

/**
 * RoleProtectedRoute Component
 * 
 * Protects routes based on authentication and role requirements
 * 
 * @example
 * // Only authenticated users
 * <RoleProtectedRoute>
 *   <DashboardPage />
 * </RoleProtectedRoute>
 * 
 * @example
 * // Only ADMIN
 * <RoleProtectedRoute requiredRoles={[Role.ADMIN]}>
 *   <AdminDashboardPage />
 * </RoleProtectedRoute>
 * 
 * @example
 * // SUPERVISOR and above
 * <RoleProtectedRoute requiredRoles={[Role.SUPERVISOR]}>
 *   <SupervisorDashboard />
 * </RoleProtectedRoute>
 */
export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  requiredRoles,
  redirectTo = '/unauthorized',
}) => {
  const { user, isAuthenticated } = useAuthStore();

  // Check authentication
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If no role requirements, just check authentication
  if (!requiredRoles || requiredRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has required role
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = hasAnyRole(user.role as Role, requiredRoles);

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
