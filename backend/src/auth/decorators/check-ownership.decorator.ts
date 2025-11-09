import { SetMetadata } from '@nestjs/common';

/**
 * CheckOwnership Decorator
 * 
 * Use with ResourceOwnerGuard to check resource ownership
 * 
 * @param paramName - Name of the parameter containing the owner ID
 * 
 * @example
 * @UseGuards(JwtAuthGuard, ResourceOwnerGuard)
 * @CheckOwnership('userId')
 * async updateProfile(@Param('userId') userId: string) { ... }
 */
export const CheckOwnership = (paramName: string) =>
  SetMetadata('ownershipParam', paramName);
