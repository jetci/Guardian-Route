import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

/**
 * Permission types for fine-grained access control
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
 * Role-Permission Mapping
 * Defines which permissions each role has
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    // All permissions
    ...Object.values(Permission),
  ],
  [Role.EXECUTIVE]: [
    // User Management (read only)
    Permission.READ_USER,

    // Incident Management (full)
    Permission.CREATE_INCIDENT,
    Permission.READ_INCIDENT,
    Permission.UPDATE_INCIDENT,
    Permission.DELETE_INCIDENT,
    Permission.ASSIGN_INCIDENT,

    // Task Management (full)
    Permission.CREATE_TASK,
    Permission.READ_TASK,
    Permission.UPDATE_TASK,
    Permission.DELETE_TASK,
    Permission.ASSIGN_TASK,

    // Report Management (full)
    Permission.CREATE_REPORT,
    Permission.READ_REPORT,
    Permission.UPDATE_REPORT,
    Permission.DELETE_REPORT,
    Permission.APPROVE_REPORT,

    // Analytics (all)
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_TEAM_ANALYTICS,
    Permission.VIEW_ALL_ANALYTICS,
  ],
  [Role.SUPERVISOR]: [
    // User Management (read only)
    Permission.READ_USER,

    // Incident Management (read, update)
    Permission.CREATE_INCIDENT,
    Permission.READ_INCIDENT,
    Permission.UPDATE_INCIDENT,

    // Task Management (full)
    Permission.CREATE_TASK,
    Permission.READ_TASK,
    Permission.UPDATE_TASK,
    Permission.ASSIGN_TASK,

    // Report Management (approve)
    Permission.CREATE_REPORT,
    Permission.READ_REPORT,
    Permission.UPDATE_REPORT,
    Permission.APPROVE_REPORT,

    // Analytics (team)
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_TEAM_ANALYTICS,
  ],
  [Role.FIELD_OFFICER]: [
    // Incident Management (create, read, update own)
    Permission.CREATE_INCIDENT,
    Permission.READ_INCIDENT,
    Permission.UPDATE_INCIDENT,

    // Task Management (read, update own)
    Permission.READ_TASK,
    Permission.UPDATE_TASK,

    // Report Management (create, read own)
    Permission.CREATE_REPORT,
    Permission.READ_REPORT,

    // Analytics (own only)
    Permission.VIEW_ANALYTICS,
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}

/**
 * Check if a role has any of the required permissions
 */
export function hasAnyPermission(
  role: Role,
  permissions: Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the required permissions
 */
export function hasAllPermissions(
  role: Role,
  permissions: Permission[],
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Permissions Guard
 * 
 * Usage:
 * @UseGuards(JwtAuthGuard, PermissionsGuard)
 * @RequirePermissions(Permission.CREATE_USER)
 * async createUser() { ... }
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    // If no permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user is authenticated
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user is active
    if (user.isActive === false) {
      throw new ForbiddenException('User account is inactive');
    }

    // Check if user has required permissions
    const hasAccess = hasAllPermissions(user.role, requiredPermissions);

    if (!hasAccess) {
      throw new ForbiddenException(
        `Access denied. Required permissions: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
