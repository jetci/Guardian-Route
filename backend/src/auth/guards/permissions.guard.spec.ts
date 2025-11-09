import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PermissionsGuard, Permission } from './permissions.guard';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new PermissionsGuard(reflector);
  });

  const createMockExecutionContext = (
    user: any,
    permissions?: Permission[],
  ): ExecutionContext => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as ExecutionContext;

    if (permissions) {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(permissions);
    }

    return mockContext;
  };

  describe('canActivate', () => {
    it('should allow access when no permissions are required', () => {
      const mockUser = { id: '1', role: Role.FIELD_OFFICER, isActive: true };
      const context = createMockExecutionContext(mockUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      const context = createMockExecutionContext(null, [Permission.CREATE_USER]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('User not authenticated');
    });

    it('should throw ForbiddenException when user is inactive', () => {
      const mockUser = { id: '1', role: Role.ADMIN, isActive: false };
      const context = createMockExecutionContext(mockUser, [Permission.CREATE_USER]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('User account is inactive');
    });

    it('should allow ADMIN to create users', () => {
      const mockUser = { id: '1', role: Role.ADMIN, isActive: true };
      const context = createMockExecutionContext(mockUser, [Permission.CREATE_USER]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny FIELD_OFFICER from creating users', () => {
      const mockUser = { id: '1', role: Role.FIELD_OFFICER, isActive: true };
      const context = createMockExecutionContext(mockUser, [Permission.CREATE_USER]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'Access denied. Required permissions: CREATE_USER',
      );
    });

    it('should allow FIELD_OFFICER to create incidents', () => {
      const mockUser = { id: '1', role: Role.FIELD_OFFICER, isActive: true };
      const context = createMockExecutionContext(mockUser, [
        Permission.CREATE_INCIDENT,
      ]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow SUPERVISOR to approve reports', () => {
      const mockUser = { id: '1', role: Role.SUPERVISOR, isActive: true };
      const context = createMockExecutionContext(mockUser, [
        Permission.APPROVE_REPORT,
      ]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny FIELD_OFFICER from approving reports', () => {
      const mockUser = { id: '1', role: Role.FIELD_OFFICER, isActive: true };
      const context = createMockExecutionContext(mockUser, [
        Permission.APPROVE_REPORT,
      ]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should allow EXECUTIVE to view all analytics', () => {
      const mockUser = { id: '1', role: Role.EXECUTIVE, isActive: true };
      const context = createMockExecutionContext(mockUser, [
        Permission.VIEW_ALL_ANALYTICS,
      ]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny SUPERVISOR from viewing all analytics', () => {
      const mockUser = { id: '1', role: Role.SUPERVISOR, isActive: true };
      const context = createMockExecutionContext(mockUser, [
        Permission.VIEW_ALL_ANALYTICS,
      ]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should allow SUPERVISOR to view team analytics', () => {
      const mockUser = { id: '1', role: Role.SUPERVISOR, isActive: true };
      const context = createMockExecutionContext(mockUser, [
        Permission.VIEW_TEAM_ANALYTICS,
      ]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow ADMIN to manage system settings', () => {
      const mockUser = { id: '1', role: Role.ADMIN, isActive: true };
      const context = createMockExecutionContext(mockUser, [
        Permission.MANAGE_SYSTEM_SETTINGS,
      ]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny EXECUTIVE from managing system settings', () => {
      const mockUser = { id: '1', role: Role.EXECUTIVE, isActive: true };
      const context = createMockExecutionContext(mockUser, [
        Permission.MANAGE_SYSTEM_SETTINGS,
      ]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should allow when user has all required permissions', () => {
      const mockUser = { id: '1', role: Role.ADMIN, isActive: true };
      const context = createMockExecutionContext(mockUser, [
        Permission.CREATE_USER,
        Permission.UPDATE_USER,
        Permission.DELETE_USER,
      ]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny when user lacks one of multiple required permissions', () => {
      const mockUser = { id: '1', role: Role.FIELD_OFFICER, isActive: true };
      const context = createMockExecutionContext(mockUser, [
        Permission.CREATE_INCIDENT,
        Permission.DELETE_INCIDENT, // FIELD_OFFICER doesn't have this
      ]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });
});
