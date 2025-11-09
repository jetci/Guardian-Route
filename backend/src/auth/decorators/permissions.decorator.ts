import { SetMetadata } from '@nestjs/common';
import { Permission } from '../guards/permissions.guard';

/**
 * Permissions Decorator
 * 
 * Use with PermissionsGuard to require specific permissions
 * 
 * @example
 * @UseGuards(JwtAuthGuard, PermissionsGuard)
 * @RequirePermissions(Permission.CREATE_USER, Permission.UPDATE_USER)
 * async manageUser() { ... }
 */
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata('permissions', permissions);
