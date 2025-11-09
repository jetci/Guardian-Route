import React from 'react';
import { Box, Text, Alert, AlertIcon } from '@chakra-ui/react';
import { useHasRole, useHasPermission, useHasAnyRole, useHasAnyPermission } from '../hooks/useAuth';
import { Role } from './guards/RoleGuard';
import { Permission } from '../hooks/useAuth';

interface ConditionalContentProps {
  /**
   * Required role(s) to show the content
   */
  requiredRole?: Role | Role[];
  
  /**
   * Required permission(s) to show the content
   */
  requiredPermission?: Permission | Permission[];
  
  /**
   * Fallback content to show when access is denied
   */
  fallback?: React.ReactNode;
  
  /**
   * Show access denied message
   * @default false
   */
  showAccessDenied?: boolean;
  
  /**
   * Custom access denied message
   */
  accessDeniedMessage?: string;
  
  /**
   * Children/content to show when access is granted
   */
  children: React.ReactNode;
}

/**
 * ConditionalContent Component
 * 
 * Conditionally render content based on user role and permissions
 * 
 * @example
 * // Only ADMIN can see this content
 * <ConditionalContent requiredRole={Role.ADMIN}>
 *   <AdminPanel />
 * </ConditionalContent>
 * 
 * @example
 * // Show fallback if no permission
 * <ConditionalContent 
 *   requiredPermission={Permission.VIEW_ANALYTICS}
 *   fallback={<Text>คุณไม่มีสิทธิ์ดูสถิติ</Text>}
 * >
 *   <AnalyticsDashboard />
 * </ConditionalContent>
 */
export const ConditionalContent: React.FC<ConditionalContentProps> = ({
  requiredRole,
  requiredPermission,
  fallback,
  showAccessDenied = false,
  accessDeniedMessage = 'คุณไม่มีสิทธิ์เข้าถึงเนื้อหานี้',
  children,
}) => {
  // Check role access
  let hasRoleAccess = true;
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    hasRoleAccess = useHasAnyRole(roles);
  }

  // Check permission access
  let hasPermissionAccess = true;
  if (requiredPermission) {
    const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    hasPermissionAccess = useHasAnyPermission(permissions);
  }

  const hasAccess = hasRoleAccess && hasPermissionAccess;

  // Show content if has access
  if (hasAccess) {
    return <>{children}</>;
  }

  // Show fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show access denied message if enabled
  if (showAccessDenied) {
    return (
      <Alert status="warning">
        <AlertIcon />
        {accessDeniedMessage}
      </Alert>
    );
  }

  // Hide content by default
  return null;
};

/**
 * ConditionalSection Component
 * 
 * Wrapper for conditional sections with consistent styling
 */
export const ConditionalSection: React.FC<ConditionalContentProps> = (props) => {
  return (
    <ConditionalContent {...props}>
      <Box>{props.children}</Box>
    </ConditionalContent>
  );
};

export default ConditionalContent;
