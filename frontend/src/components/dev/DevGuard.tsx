import type { ReactNode } from 'react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';

interface DevGuardProps {
  children: ReactNode;
  redirectTo?: string;
  feature?: string; // Optional feature name for more granular checks
}

/**
 * DevGuard component to restrict access to developer-only features.
 * Access is granted if:
 * 1. The user has the mock 'DEVELOPER' role.
 * 2. (In a real environment) The application is running in a development environment.
 * 
 * Since we cannot check process.env.NODE_ENV in this environment, we rely on the mock role.
 * In a real application, the logic would be:
 * const isDevEnv = process.env.NODE_ENV === 'development';
 * const hasDevRole = userRole === 'DEVELOPER';
 * const isAllowed = isDevEnv || hasDevRole;
 */
const DevGuard: React.FC<DevGuardProps> = ({ children, redirectTo = '/dashboard' }) => {
  const { currentRole: userRole } = useRole();

  // The primary check is the mock role.
  // We assume that in a real environment, this check would be augmented by
  // process.env.NODE_ENV === 'development' to allow access in dev environment
  // even without the specific role.
  const isAllowed = userRole === 'DEVELOPER';

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default DevGuard;
