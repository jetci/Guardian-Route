import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ResourceOwnerGuard } from './resource-owner.guard';

describe('ResourceOwnerGuard', () => {
  let guard: ResourceOwnerGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new ResourceOwnerGuard(reflector);
  });

  const createMockExecutionContext = (
    user: any,
    params: any = {},
    query: any = {},
    body: any = {},
    ownershipParam?: string,
  ): ExecutionContext => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user, params, query, body }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as ExecutionContext;

    if (ownershipParam) {
      jest.spyOn(reflector, 'get').mockReturnValue(ownershipParam);
    }

    return mockContext;
  };

  describe('canActivate', () => {
    it('should allow access when no ownership check is required', () => {
      const mockUser = { id: 'user1', role: Role.FIELD_OFFICER, isActive: true };
      const context = createMockExecutionContext(mockUser);
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      const context = createMockExecutionContext(null, {}, {}, {}, 'userId');

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('User not authenticated');
    });

    it('should throw ForbiddenException when user is inactive', () => {
      const mockUser = { id: 'user1', role: Role.FIELD_OFFICER, isActive: false };
      const context = createMockExecutionContext(
        mockUser,
        { userId: 'user1' },
        {},
        {},
        'userId',
      );

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('User account is inactive');
    });

    it('should allow ADMIN to access any resource', () => {
      const mockUser = { id: 'admin1', role: Role.ADMIN, isActive: true };
      const context = createMockExecutionContext(
        mockUser,
        { userId: 'user2' },
        {},
        {},
        'userId',
      );

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow EXECUTIVE to access any resource', () => {
      const mockUser = { id: 'exec1', role: Role.EXECUTIVE, isActive: true };
      const context = createMockExecutionContext(
        mockUser,
        { userId: 'user2' },
        {},
        {},
        'userId',
      );

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow user to access their own resource (from params)', () => {
      const mockUser = { id: 'user1', role: Role.FIELD_OFFICER, isActive: true };
      const context = createMockExecutionContext(
        mockUser,
        { userId: 'user1' },
        {},
        {},
        'userId',
      );

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow user to access their own resource (from query)', () => {
      const mockUser = { id: 'user1', role: Role.SUPERVISOR, isActive: true };
      const context = createMockExecutionContext(
        mockUser,
        {},
        { userId: 'user1' },
        {},
        'userId',
      );

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow user to access their own resource (from body)', () => {
      const mockUser = { id: 'user1', role: Role.FIELD_OFFICER, isActive: true };
      const context = createMockExecutionContext(
        mockUser,
        {},
        {},
        { userId: 'user1' },
        'userId',
      );

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny FIELD_OFFICER from accessing another user resource', () => {
      const mockUser = { id: 'user1', role: Role.FIELD_OFFICER, isActive: true };
      const context = createMockExecutionContext(
        mockUser,
        { userId: 'user2' },
        {},
        {},
        'userId',
      );

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'Access denied. You can only access your own resources.',
      );
    });

    it('should deny SUPERVISOR from accessing another user resource', () => {
      const mockUser = { id: 'super1', role: Role.SUPERVISOR, isActive: true };
      const context = createMockExecutionContext(
        mockUser,
        { userId: 'user2' },
        {},
        {},
        'userId',
      );

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should check params first, then query, then body', () => {
      const mockUser = { id: 'user1', role: Role.FIELD_OFFICER, isActive: true };
      const context = createMockExecutionContext(
        mockUser,
        { userId: 'user1' }, // This should be checked first
        { userId: 'user2' },
        { userId: 'user3' },
        'userId',
      );

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should work with different parameter names', () => {
      const mockUser = { id: 'user1', role: Role.FIELD_OFFICER, isActive: true };
      const context = createMockExecutionContext(
        mockUser,
        { ownerId: 'user1' },
        {},
        {},
        'ownerId',
      );

      expect(guard.canActivate(context)).toBe(true);
    });
  });
});
