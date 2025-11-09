import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Text, VStack, Icon } from '@chakra-ui/react';
import { FiLock } from 'react-icons/fi';
import { useAuthStore } from '../../stores/authStore';
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from '../../hooks/useAuth';
import { Role } from './RoleGuard';

interface PermissionGuardProps {
  /**
   * Required permissions to access this component
   */
  requiredPermissions: Permission[];
  
  /**
   * Require all permissions or any permission
   * @default 'all'
   */
  requireAll?: boolean;
  
  /**
   * Children to render if user has access
   */
  children: React.ReactNode;
  
  /**
   * Redirect path if user doesn't have access
   * @default '/unauthorized'
   */
  redirectTo?: string;
  
  /**
   * Show fallback UI instead of redirecting
   * @default false
   */
  showFallback?: boolean;
  
  /**
   * Custom fallback component
   */
  fallback?: React.ReactNode;
}

/**
 * PermissionGuard Component
 * 
 * Protects components based on user permissions
 * 
 * @example
 * // Require CREATE_USER permission
 * <PermissionGuard requiredPermissions={[Permission.CREATE_USER]}>
 *   <CreateUserButton />
 * </PermissionGuard>
 * 
 * @example
 * // Require any of the permissions
 * <PermissionGuard 
 *   requiredPermissions={[Permission.UPDATE_INCIDENT, Permission.DELETE_INCIDENT]}
 *   requireAll={false}
 * >
 *   <IncidentActions />
 * </PermissionGuard>
 * 
 * @example
 * // Show fallback instead of redirect
 * <PermissionGuard 
 *   requiredPermissions={[Permission.VIEW_AUDIT_LOGS]}
 *   showFallback
 * >
 *   <AuditLogViewer />
 * </PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredPermissions,
  requireAll = true,
  children,
  redirectTo = '/unauthorized',
  showFallback = false,
  fallback,
}) => {
  const { user } = useAuthStore();

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required permissions
  const userRole = user.role as Role;
  const hasAccess = requireAll
    ? hasAllPermissions(userRole, requiredPermissions)
    : hasAnyPermission(userRole, requiredPermissions);

  if (!hasAccess) {
    if (showFallback) {
      return (
        <>
          {fallback || (
            <Box
              p={8}
              textAlign="center"
              bg="orange.50"
              borderRadius="md"
              border="1px"
              borderColor="orange.200"
            >
              <VStack spacing={4}>
                <Icon as={FiLock} boxSize={12} color="orange.500" />
                <Text fontSize="xl" fontWeight="bold" color="orange.700">
                  ไม่มีสิทธิ์เข้าถึง
                </Text>
                <Text color="gray.600">
                  คุณต้องมีสิทธิ์: {requiredPermissions.join(', ')}
                </Text>
                <Text color="gray.500" fontSize="sm">
                  บทบาทของคุณ: {user.role}
                </Text>
              </VStack>
            </Box>
          )}
        </>
      );
    }

    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

/**
 * ConditionalRender Component
 * 
 * Conditionally render children based on permission without redirect
 * 
 * @example
 * <ConditionalRender permission={Permission.DELETE_USER}>
 *   <DeleteButton />
 * </ConditionalRender>
 */
export const ConditionalRender: React.FC<{
  permission: Permission;
  children: React.ReactNode;
}> = ({ permission, children }) => {
  const { user } = useAuthStore();

  if (!user) return null;

  const hasAccess = hasPermission(user.role as Role, permission);

  return hasAccess ? <>{children}</> : null;
};

/**
 * ConditionalRenderMultiple Component
 * 
 * Conditionally render children based on multiple permissions
 * 
 * @example
 * <ConditionalRenderMultiple 
 *   permissions={[Permission.UPDATE_USER, Permission.DELETE_USER]}
 *   requireAll={false}
 * >
 *   <UserActions />
 * </ConditionalRenderMultiple>
 */
export const ConditionalRenderMultiple: React.FC<{
  permissions: Permission[];
  requireAll?: boolean;
  children: React.ReactNode;
}> = ({ permissions, requireAll = true, children }) => {
  const { user } = useAuthStore();

  if (!user) return null;

  const userRole = user.role as Role;
  const hasAccess = requireAll
    ? hasAllPermissions(userRole, permissions)
    : hasAnyPermission(userRole, permissions);

  return hasAccess ? <>{children}</> : null;
};

export default PermissionGuard;
