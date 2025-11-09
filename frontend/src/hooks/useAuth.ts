import { useAuthStore } from '../stores/authStore';
import { Role, hasRoleAccess, hasAnyRole } from '../components/guards/RoleGuard';

/**
 * Permission types matching backend
 */
export enum Permission {
  // User Management
  CREATE_USER = 'CREATE_USER',
  READ_USER = 'READ_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
  MANAGE_ROLES = 'MANAGE_ROLES',

  // Incident Management
  CREATE_INCIDENT = 'CREATE_INCIDENT',
  READ_INCIDENT = 'READ_INCIDENT',
  UPDATE_INCIDENT = 'UPDATE_INCIDENT',
  DELETE_INCIDENT = 'DELETE_INCIDENT',
  ASSIGN_INCIDENT = 'ASSIGN_INCIDENT',

  // Task Management
  CREATE_TASK = 'CREATE_TASK',
  READ_TASK = 'READ_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  ASSIGN_TASK = 'ASSIGN_TASK',

  // Report Management
  CREATE_REPORT = 'CREATE_REPORT',
  READ_REPORT = 'READ_REPORT',
  UPDATE_REPORT = 'UPDATE_REPORT',
  DELETE_REPORT = 'DELETE_REPORT',
  APPROVE_REPORT = 'APPROVE_REPORT',

  // Analytics
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  VIEW_TEAM_ANALYTICS = 'VIEW_TEAM_ANALYTICS',
  VIEW_ALL_ANALYTICS = 'VIEW_ALL_ANALYTICS',

  // Admin Functions
  MANAGE_SYSTEM_SETTINGS = 'MANAGE_SYSTEM_SETTINGS',
  VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',
  MANAGE_GEOJSON = 'MANAGE_GEOJSON',
  MANAGE_CUSTOM_LAYERS = 'MANAGE_CUSTOM_LAYERS',
}

/**
 * Role-Permission Mapping (matching backend)
 */
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),
  [Role.EXECUTIVE]: [
    Permission.READ_USER,
    Permission.CREATE_INCIDENT,
    Permission.READ_INCIDENT,
    Permission.UPDATE_INCIDENT,
    Permission.DELETE_INCIDENT,
    Permission.ASSIGN_INCIDENT,
    Permission.CREATE_TASK,
    Permission.READ_TASK,
    Permission.UPDATE_TASK,
    Permission.DELETE_TASK,
    Permission.ASSIGN_TASK,
    Permission.CREATE_REPORT,
    Permission.READ_REPORT,
    Permission.UPDATE_REPORT,
    Permission.DELETE_REPORT,
    Permission.APPROVE_REPORT,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_TEAM_ANALYTICS,
    Permission.VIEW_ALL_ANALYTICS,
  ],
  [Role.SUPERVISOR]: [
    Permission.READ_USER,
    Permission.CREATE_INCIDENT,
    Permission.READ_INCIDENT,
    Permission.UPDATE_INCIDENT,
    Permission.CREATE_TASK,
    Permission.READ_TASK,
    Permission.UPDATE_TASK,
    Permission.ASSIGN_TASK,
    Permission.CREATE_REPORT,
    Permission.READ_REPORT,
    Permission.UPDATE_REPORT,
    Permission.APPROVE_REPORT,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_TEAM_ANALYTICS,
  ],
  [Role.FIELD_OFFICER]: [
    Permission.CREATE_INCIDENT,
    Permission.READ_INCIDENT,
    Permission.UPDATE_INCIDENT,
    Permission.READ_TASK,
    Permission.UPDATE_TASK,
    Permission.CREATE_REPORT,
    Permission.READ_REPORT,
    Permission.VIEW_ANALYTICS,
  ],
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role: Role, permission: Permission): boolean => {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
};

/**
 * Check if a role has any of the required permissions
 */
export const hasAnyPermission = (
  role: Role,
  permissions: Permission[],
): boolean => {
  return permissions.some((permission) => hasPermission(role, permission));
};

/**
 * Check if a role has all of the required permissions
 */
export const hasAllPermissions = (
  role: Role,
  permissions: Permission[],
): boolean => {
  return permissions.every((permission) => hasPermission(role, permission));
};

/**
 * Hook to check if current user has a specific role
 * 
 * @example
 * const isAdmin = useHasRole(Role.ADMIN);
 * const canManageTeam = useHasRole(Role.SUPERVISOR);
 */
export const useHasRole = (requiredRole: Role): boolean => {
  const { user } = useAuthStore();
  
  if (!user) return false;
  
  return hasRoleAccess(user.role as Role, requiredRole);
};

/**
 * Hook to check if current user has any of the required roles
 * 
 * @example
 * const canAccessAdmin = useHasAnyRole([Role.ADMIN, Role.EXECUTIVE]);
 */
export const useHasAnyRole = (requiredRoles: Role[]): boolean => {
  const { user } = useAuthStore();
  
  if (!user) return false;
  
  return hasAnyRole(user.role as Role, requiredRoles);
};

/**
 * Hook to check if current user has a specific permission
 * 
 * @example
 * const canCreateUser = useHasPermission(Permission.CREATE_USER);
 * const canDeleteIncident = useHasPermission(Permission.DELETE_INCIDENT);
 */
export const useHasPermission = (permission: Permission): boolean => {
  const { user } = useAuthStore();
  
  if (!user) return false;
  
  return hasPermission(user.role as Role, permission);
};

/**
 * Hook to check if current user has any of the required permissions
 * 
 * @example
 * const canManageIncidents = useHasAnyPermission([
 *   Permission.CREATE_INCIDENT,
 *   Permission.UPDATE_INCIDENT,
 *   Permission.DELETE_INCIDENT,
 * ]);
 */
export const useHasAnyPermission = (permissions: Permission[]): boolean => {
  const { user } = useAuthStore();
  
  if (!user) return false;
  
  return hasAnyPermission(user.role as Role, permissions);
};

/**
 * Hook to check if current user has all of the required permissions
 * 
 * @example
 * const canFullyManageUsers = useHasAllPermissions([
 *   Permission.CREATE_USER,
 *   Permission.UPDATE_USER,
 *   Permission.DELETE_USER,
 * ]);
 */
export const useHasAllPermissions = (permissions: Permission[]): boolean => {
  const { user } = useAuthStore();
  
  if (!user) return false;
  
  return hasAllPermissions(user.role as Role, permissions);
};

/**
 * Hook to check if current user is the owner of a resource
 * 
 * @example
 * const isOwner = useIsResourceOwner(incident.reportedById);
 */
export const useIsResourceOwner = (resourceOwnerId: string): boolean => {
  const { user } = useAuthStore();
  
  if (!user) return false;
  
  return user.id === resourceOwnerId;
};

/**
 * Hook to check if current user can access a resource
 * (owner or higher role)
 * 
 * @example
 * const canAccessProfile = useCanAccessResource(profileUserId);
 */
export const useCanAccessResource = (resourceOwnerId: string): boolean => {
  const { user } = useAuthStore();
  
  if (!user) return false;
  
  // ADMIN and EXECUTIVE can access all resources
  if (
    user.role === Role.ADMIN ||
    user.role === Role.EXECUTIVE
  ) {
    return true;
  }
  
  // Owner can access their own resource
  return user.id === resourceOwnerId;
};

/**
 * Hook to get all permissions for current user
 * 
 * @example
 * const permissions = useUserPermissions();
 * console.log('User has', permissions.length, 'permissions');
 */
export const useUserPermissions = (): Permission[] => {
  const { user } = useAuthStore();
  
  if (!user) return [];
  
  return ROLE_PERMISSIONS[user.role as Role] || [];
};

/**
 * Hook to check if current user is authenticated
 * 
 * @example
 * const isAuthenticated = useIsAuthenticated();
 */
export const useIsAuthenticated = (): boolean => {
  const { user, accessToken } = useAuthStore();
  return !!(user && accessToken);
};

/**
 * Hook to get current user role
 * 
 * @example
 * const role = useCurrentRole();
 * console.log('Current role:', role);
 */
export const useCurrentRole = (): Role | null => {
  const { user } = useAuthStore();
  return user ? (user.role as Role) : null;
};
