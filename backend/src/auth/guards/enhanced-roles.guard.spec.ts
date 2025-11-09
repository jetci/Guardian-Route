import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { EnhancedRolesGuard } from './enhanced-roles.guard';

describe('EnhancedRolesGuard', () => {
  let guard: EnhancedRolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new EnhancedRolesGuard(reflector);
  });

  const createMockExecutionContext = (user: any, roles?: Role[]): ExecutionContext => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as ExecutionContext;

    if (roles) {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(roles);
    }

    return mockContext;
  };

  describe('canActivate', () => {
    it('should allow access when no roles are required', () => {
      const mockUser = { id: '1', role: Role.FIELD_OFFICER, isActive: true };
      const context = createMockExecutionContext(mockUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      const context = createMockExecutionContext(null, [Role.ADMIN]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('User not authenticated');
    });

    it('should throw ForbiddenException when user is inactive', () => {
      const mockUser = { id: '1', role: Role.FIELD_OFFICER, isActive: false };
      const context = createMockExecutionContext(mockUser, [Role.FIELD_OFFICER]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('User account is inactive');
    });

    it('should allow ADMIN to access FIELD_OFFICER endpoint', () => {
      const mockUser = { id: '1', role: Role.ADMIN, isActive: true };
      const context = createMockExecutionContext(mockUser, [Role.FIELD_OFFICER]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow EXECUTIVE to access SUPERVISOR endpoint', () => {
      const mockUser = { id: '1', role: Role.EXECUTIVE, isActive: true };
      const context = createMockExecutionContext(mockUser, [Role.SUPERVISOR]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow SUPERVISOR to access FIELD_OFFICER endpoint', () => {
      const mockUser = { id: '1', role: Role.SUPERVISOR, isActive: true };
      const context = createMockExecutionContext(mockUser, [Role.FIELD_OFFICER]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow FIELD_OFFICER to access FIELD_OFFICER endpoint', () => {
      const mockUser = { id: '1', role: Role.FIELD_OFFICER, isActive: true };
      const context = createMockExecutionContext(mockUser, [Role.FIELD_OFFICER]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should deny FIELD_OFFICER access to SUPERVISOR endpoint', () => {
      const mockUser = { id: '1', role: Role.FIELD_OFFICER, isActive: true };
      const context = createMockExecutionContext(mockUser, [Role.SUPERVISOR]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow(
        'Access denied. Required roles: SUPERVISOR. Your role: FIELD_OFFICER',
      );
    });

    it('should deny FIELD_OFFICER access to ADMIN endpoint', () => {
      const mockUser = { id: '1', role: Role.FIELD_OFFICER, isActive: true };
      const context = createMockExecutionContext(mockUser, [Role.ADMIN]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should deny SUPERVISOR access to EXECUTIVE endpoint', () => {
      const mockUser = { id: '1', role: Role.SUPERVISOR, isActive: true };
      const context = createMockExecutionContext(mockUser, [Role.EXECUTIVE]);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should allow access when user has any of multiple required roles', () => {
      const mockUser = { id: '1', role: Role.SUPERVISOR, isActive: true };
      const context = createMockExecutionContext(mockUser, [
        Role.SUPERVISOR,
        Role.EXECUTIVE,
      ]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow ADMIN access to endpoint requiring multiple roles', () => {
      const mockUser = { id: '1', role: Role.ADMIN, isActive: true };
      const context = createMockExecutionContext(mockUser, [
        Role.FIELD_OFFICER,
        Role.SUPERVISOR,
        Role.EXECUTIVE,
      ]);

      expect(guard.canActivate(context)).toBe(true);
    });
  });
});
