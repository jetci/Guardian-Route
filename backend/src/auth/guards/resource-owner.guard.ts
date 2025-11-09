import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { hasRoleAccess } from '../config/role-hierarchy.config';

/**
 * Resource Owner Guard
 * 
 * Allows access if:
 * 1. User is the owner of the resource (userId matches)
 * 2. User has a higher role (ADMIN, EXECUTIVE, SUPERVISOR)
 * 
 * Usage:
 * @UseGuards(JwtAuthGuard, ResourceOwnerGuard)
 * @CheckOwnership('userId') // Parameter name in route
 * async updateProfile(@Param('userId') userId: string) { ... }
 */
@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ownershipParam = this.reflector.get<string>(
      'ownershipParam',
      context.getHandler(),
    );

    // If no ownership check required, allow access
    if (!ownershipParam) {
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

    // ADMIN and EXECUTIVE can access all resources
    if (
      hasRoleAccess(user.role, Role.EXECUTIVE) ||
      user.role === Role.ADMIN
    ) {
      return true;
    }

    // Get resource owner ID from params, query, or body
    const resourceOwnerId =
      request.params[ownershipParam] ||
      request.query[ownershipParam] ||
      request.body[ownershipParam];

    // Check if user is the owner
    if (user.id === resourceOwnerId) {
      return true;
    }

    throw new ForbiddenException(
      'Access denied. You can only access your own resources.',
    );
  }
}
