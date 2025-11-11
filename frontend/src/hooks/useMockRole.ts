import { useCallback } from 'react';
import { useRole } from '../context/RoleContext';
import type { UserRole } from '../context/RoleContext';

/**
 * Mock role hook return type
 */
interface UseMockRoleReturn {
  currentRole: UserRole | null;
  actualRole: UserRole | null;
  isMockMode: boolean;
  isDeveloper: boolean;
  setMockRole: (role: UserRole) => void;
  clearMockRole: () => void;
  availableRoles: UserRole[];
  canUseMockMode: boolean;
}

/**
 * Available roles for mocking
 */
const AVAILABLE_ROLES: UserRole[] = [
  'ADMIN',
  'SUPERVISOR',
  'FIELD_OFFICER',
  'EXECUTIVE',
  'DEVELOPER',
  'GUEST',
];

/**
 * Hook for managing mock roles in development mode
 * 
 * This hook provides functionality to switch between different user roles
 * for testing and development purposes. Only available for DEVELOPER role.
 * 
 * @example
 * ```tsx
 * const { setMockRole, clearMockRole, isMockMode } = useMockRole();
 * 
 * // Switch to ADMIN role
 * setMockRole('ADMIN');
 * 
 * // Clear mock and return to actual role
 * clearMockRole();
 * ```
 */
export const useMockRole = (): UseMockRoleReturn => {
  const {
    user,
    currentRole,
    isMockMode,
    isDeveloper,
    setMockRole: setMockRoleContext,
    clearMockRole: clearMockRoleContext,
  } = useRole();

  /**
   * Set mock role with validation
   */
  const setMockRole = useCallback(
    (role: UserRole) => {
      if (!isDeveloper) {
        console.warn('Mock role can only be set by DEVELOPER role');
        return;
      }

      if (!AVAILABLE_ROLES.includes(role)) {
        console.error(`Invalid role: ${role}`);
        return;
      }

      setMockRoleContext(role);
      console.log(`[DEV] Mock role set to: ${role}`);
    },
    [isDeveloper, setMockRoleContext]
  );

  /**
   * Clear mock role
   */
  const clearMockRole = useCallback(() => {
    clearMockRoleContext();
    console.log('[DEV] Mock role cleared');
  }, [clearMockRoleContext]);

  return {
    currentRole,
    actualRole: user?.role || null,
    isMockMode,
    isDeveloper,
    setMockRole,
    clearMockRole,
    availableRoles: AVAILABLE_ROLES,
    canUseMockMode: isDeveloper,
  };
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    ADMIN: 'ผู้ดูแลระบบ',
    SUPERVISOR: 'หัวหน้างาน',
    FIELD_OFFICER: 'เจ้าหน้าที่ภาคสนาม',
    EXECUTIVE: 'ผู้บริหาร',
    DEVELOPER: 'นักพัฒนา',
    GUEST: 'ผู้เยี่ยมชม',
  };

  return roleNames[role] || role;
};

/**
 * Get role color for UI display
 */
export const getRoleColor = (role: UserRole): string => {
  const roleColors: Record<UserRole, string> = {
    ADMIN: 'bg-red-500',
    SUPERVISOR: 'bg-blue-500',
    FIELD_OFFICER: 'bg-green-500',
    EXECUTIVE: 'bg-purple-500',
    DEVELOPER: 'bg-yellow-500',
    GUEST: 'bg-gray-500',
  };

  return roleColors[role] || 'bg-gray-500';
};

/**
 * Get role icon
 */
export const getRoleIcon = (role: UserRole): string => {
  const roleIcons: Record<UserRole, string> = {
    ADMIN: '👑',
    SUPERVISOR: '👨‍💼',
    FIELD_OFFICER: '👮',
    EXECUTIVE: '💼',
    DEVELOPER: '👨‍💻',
    GUEST: '👤',
  };

  return roleIcons[role] || '👤';
};
