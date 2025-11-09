import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Box, Text, VStack, Icon } from '@chakra-ui/react';
import { FiShield } from 'react-icons/fi';

/**
 * Role type matching backend
 */
export enum Role {
  ADMIN = 'ADMIN',
  EXECUTIVE = 'EXECUTIVE',
  SUPERVISOR = 'SUPERVISOR',
  FIELD_OFFICER = 'FIELD_OFFICER',
}

/**
 * Role hierarchy levels
 */
const ROLE_LEVELS: Record<Role, number> = {
  [Role.ADMIN]: 4,
  [Role.EXECUTIVE]: 3,
  [Role.SUPERVISOR]: 2,
  [Role.FIELD_OFFICER]: 1,
};

/**
 * Check if user role has access to required role (with hierarchy)
 */
export const hasRoleAccess = (userRole: Role, requiredRole: Role): boolean => {
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole];
};

/**
 * Check if user has any of the required roles
 */
export const hasAnyRole = (userRole: Role, requiredRoles: Role[]): boolean => {
  return requiredRoles.some((role) => hasRoleAccess(userRole, role));
};

interface RoleGuardProps {
  /**
   * Required roles to access this component
   */
  requiredRoles: Role[];
  
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
 * RoleGuard Component
 * 
 * Protects components based on user role with hierarchy support
 * 
 * @example
 * // Only ADMIN can see this
 * <RoleGuard requiredRoles={[Role.ADMIN]}>
 *   <AdminPanel />
 * </RoleGuard>
 * 
 * @example
 * // SUPERVISOR and above can see this
 * <RoleGuard requiredRoles={[Role.SUPERVISOR]}>
 *   <TeamDashboard />
 * </RoleGuard>
 * 
 * @example
 * // Show fallback instead of redirect
 * <RoleGuard 
 *   requiredRoles={[Role.EXECUTIVE]} 
 *   showFallback
 *   fallback={<Text>คุณไม่มีสิทธิ์เข้าถึง</Text>}
 * >
 *   <ExecutiveReport />
 * </RoleGuard>
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  requiredRoles,
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

  // Check if user has required role
  const hasAccess = hasAnyRole(user.role as Role, requiredRoles);

  if (!hasAccess) {
    if (showFallback) {
      return (
        <>
          {fallback || (
            <Box
              p={8}
              textAlign="center"
              bg="red.50"
              borderRadius="md"
              border="1px"
              borderColor="red.200"
            >
              <VStack spacing={4}>
                <Icon as={FiShield} boxSize={12} color="red.500" />
                <Text fontSize="xl" fontWeight="bold" color="red.700">
                  ไม่มีสิทธิ์เข้าถึง
                </Text>
                <Text color="gray.600">
                  คุณต้องมีบทบาท: {requiredRoles.join(', ')}
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
 * Default fallback component
 */
export const UnauthorizedFallback: React.FC<{
  requiredRoles: Role[];
  userRole: Role;
}> = ({ requiredRoles, userRole }) => (
  <Box
    p={8}
    textAlign="center"
    bg="red.50"
    borderRadius="md"
    border="1px"
    borderColor="red.200"
  >
    <VStack spacing={4}>
      <Icon as={FiShield} boxSize={12} color="red.500" />
      <Text fontSize="xl" fontWeight="bold" color="red.700">
        ไม่มีสิทธิ์เข้าถึง
      </Text>
      <Text color="gray.600">
        คุณต้องมีบทบาท: {requiredRoles.join(', ')}
      </Text>
      <Text color="gray.500" fontSize="sm">
        บทบาทของคุณ: {userRole}
      </Text>
    </VStack>
  </Box>
);

export default RoleGuard;
