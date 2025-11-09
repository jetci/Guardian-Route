import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { hasAnyRole } from '../config/role-hierarchy.config';

/**
 * Enhanced Roles Guard with Role Hierarchy Support
 * 
 * Features:
 * - Role hierarchy (ADMIN > EXECUTIVE > SUPERVISOR > FIELD_OFFICER)
 * - Multiple roles support
 * - Inherits permissions from lower roles
 * 
 * Usage:
 * @UseGuards(JwtAuthGuard, EnhancedRolesGuard)
 * @Roles(Role.SUPERVISOR)
 * async someMethod() { ... }
 */
@Injectable()
export class EnhancedRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
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

    // Check if user has required role (with hierarchy)
    const hasAccess = hasAnyRole(user.role, requiredRoles);

    if (!hasAccess) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}. Your role: ${user.role}`,
      );
    }

    return true;
  }
}
