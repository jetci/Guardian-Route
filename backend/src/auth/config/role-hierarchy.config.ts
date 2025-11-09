import { Role } from '@prisma/client';

/**
 * Role Hierarchy Configuration
 * Higher roles inherit permissions from lower roles
 */

export interface RoleHierarchy {
  level: number;
  inherits: Role[];
}

export const ROLE_HIERARCHY: Record<Role, RoleHierarchy> = {
  [Role.ADMIN]: {
    level: 4,
    inherits: [Role.EXECUTIVE, Role.SUPERVISOR, Role.FIELD_OFFICER],
  },
  [Role.EXECUTIVE]: {
    level: 3,
    inherits: [Role.SUPERVISOR, Role.FIELD_OFFICER],
  },
  [Role.SUPERVISOR]: {
    level: 2,
    inherits: [Role.FIELD_OFFICER],
  },
  [Role.FIELD_OFFICER]: {
    level: 1,
    inherits: [],
  },
};

/**
 * Check if a role has access based on hierarchy
 * @param userRole - User's role
 * @param requiredRole - Required role for access
 * @returns true if user has access
 */
export function hasRoleAccess(userRole: Role, requiredRole: Role): boolean {
  const userHierarchy = ROLE_HIERARCHY[userRole];
  const requiredHierarchy = ROLE_HIERARCHY[requiredRole];

  // User's role level must be >= required role level
  if (userHierarchy.level >= requiredHierarchy.level) {
    return true;
  }

  return false;
}

/**
 * Check if a role has any of the required roles
 * @param userRole - User's role
 * @param requiredRoles - Array of required roles
 * @returns true if user has any of the required roles
 */
export function hasAnyRole(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.some((role) => hasRoleAccess(userRole, role));
}

/**
 * Get all roles that a user has access to (including inherited)
 * @param userRole - User's role
 * @returns Array of accessible roles
 */
export function getAccessibleRoles(userRole: Role): Role[] {
  const hierarchy = ROLE_HIERARCHY[userRole];
  return [userRole, ...hierarchy.inherits];
}

/**
 * Check if a role is higher than another role
 * @param role1 - First role
 * @param role2 - Second role
 * @returns true if role1 is higher than role2
 */
export function isHigherRole(role1: Role, role2: Role): boolean {
  return ROLE_HIERARCHY[role1].level > ROLE_HIERARCHY[role2].level;
}
