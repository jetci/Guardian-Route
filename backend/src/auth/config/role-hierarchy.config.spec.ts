import { Role } from '@prisma/client';
import {
  hasRoleAccess,
  hasAnyRole,
  getAccessibleRoles,
  isHigherRole,
  ROLE_HIERARCHY,
} from './role-hierarchy.config';

describe('Role Hierarchy Config', () => {
  describe('ROLE_HIERARCHY', () => {
    it('should have correct hierarchy levels', () => {
      expect(ROLE_HIERARCHY[Role.ADMIN].level).toBe(4);
      expect(ROLE_HIERARCHY[Role.EXECUTIVE].level).toBe(3);
      expect(ROLE_HIERARCHY[Role.SUPERVISOR].level).toBe(2);
      expect(ROLE_HIERARCHY[Role.FIELD_OFFICER].level).toBe(1);
    });

    it('should have correct inheritance', () => {
      expect(ROLE_HIERARCHY[Role.ADMIN].inherits).toEqual([
        Role.EXECUTIVE,
        Role.SUPERVISOR,
        Role.FIELD_OFFICER,
      ]);
      expect(ROLE_HIERARCHY[Role.EXECUTIVE].inherits).toEqual([
        Role.SUPERVISOR,
        Role.FIELD_OFFICER,
      ]);
      expect(ROLE_HIERARCHY[Role.SUPERVISOR].inherits).toEqual([
        Role.FIELD_OFFICER,
      ]);
      expect(ROLE_HIERARCHY[Role.FIELD_OFFICER].inherits).toEqual([]);
    });
  });

  describe('hasRoleAccess', () => {
    it('should allow ADMIN to access all roles', () => {
      expect(hasRoleAccess(Role.ADMIN, Role.ADMIN)).toBe(true);
      expect(hasRoleAccess(Role.ADMIN, Role.EXECUTIVE)).toBe(true);
      expect(hasRoleAccess(Role.ADMIN, Role.SUPERVISOR)).toBe(true);
      expect(hasRoleAccess(Role.ADMIN, Role.FIELD_OFFICER)).toBe(true);
    });

    it('should allow EXECUTIVE to access EXECUTIVE and below', () => {
      expect(hasRoleAccess(Role.EXECUTIVE, Role.ADMIN)).toBe(false);
      expect(hasRoleAccess(Role.EXECUTIVE, Role.EXECUTIVE)).toBe(true);
      expect(hasRoleAccess(Role.EXECUTIVE, Role.SUPERVISOR)).toBe(true);
      expect(hasRoleAccess(Role.EXECUTIVE, Role.FIELD_OFFICER)).toBe(true);
    });

    it('should allow SUPERVISOR to access SUPERVISOR and below', () => {
      expect(hasRoleAccess(Role.SUPERVISOR, Role.ADMIN)).toBe(false);
      expect(hasRoleAccess(Role.SUPERVISOR, Role.EXECUTIVE)).toBe(false);
      expect(hasRoleAccess(Role.SUPERVISOR, Role.SUPERVISOR)).toBe(true);
      expect(hasRoleAccess(Role.SUPERVISOR, Role.FIELD_OFFICER)).toBe(true);
    });

    it('should allow FIELD_OFFICER to access only FIELD_OFFICER', () => {
      expect(hasRoleAccess(Role.FIELD_OFFICER, Role.ADMIN)).toBe(false);
      expect(hasRoleAccess(Role.FIELD_OFFICER, Role.EXECUTIVE)).toBe(false);
      expect(hasRoleAccess(Role.FIELD_OFFICER, Role.SUPERVISOR)).toBe(false);
      expect(hasRoleAccess(Role.FIELD_OFFICER, Role.FIELD_OFFICER)).toBe(true);
    });
  });

  describe('hasAnyRole', () => {
    it('should return true if user has any of the required roles', () => {
      expect(
        hasAnyRole(Role.ADMIN, [Role.ADMIN, Role.EXECUTIVE]),
      ).toBe(true);
      expect(
        hasAnyRole(Role.EXECUTIVE, [Role.SUPERVISOR, Role.EXECUTIVE]),
      ).toBe(true);
      expect(
        hasAnyRole(Role.SUPERVISOR, [Role.FIELD_OFFICER, Role.SUPERVISOR]),
      ).toBe(true);
    });

    it('should return true if user has higher role than required', () => {
      expect(
        hasAnyRole(Role.ADMIN, [Role.FIELD_OFFICER, Role.SUPERVISOR]),
      ).toBe(true);
      expect(
        hasAnyRole(Role.EXECUTIVE, [Role.FIELD_OFFICER]),
      ).toBe(true);
      expect(
        hasAnyRole(Role.SUPERVISOR, [Role.FIELD_OFFICER]),
      ).toBe(true);
    });

    it('should return false if user does not have any required role', () => {
      expect(
        hasAnyRole(Role.FIELD_OFFICER, [Role.ADMIN, Role.EXECUTIVE]),
      ).toBe(false);
      expect(
        hasAnyRole(Role.SUPERVISOR, [Role.ADMIN, Role.EXECUTIVE]),
      ).toBe(false);
      expect(
        hasAnyRole(Role.FIELD_OFFICER, [Role.SUPERVISOR]),
      ).toBe(false);
    });

    it('should handle empty required roles array', () => {
      expect(hasAnyRole(Role.ADMIN, [])).toBe(false);
      expect(hasAnyRole(Role.FIELD_OFFICER, [])).toBe(false);
    });
  });

  describe('getAccessibleRoles', () => {
    it('should return all roles for ADMIN', () => {
      const roles = getAccessibleRoles(Role.ADMIN);
      expect(roles).toContain(Role.ADMIN);
      expect(roles).toContain(Role.EXECUTIVE);
      expect(roles).toContain(Role.SUPERVISOR);
      expect(roles).toContain(Role.FIELD_OFFICER);
      expect(roles.length).toBe(4);
    });

    it('should return correct roles for EXECUTIVE', () => {
      const roles = getAccessibleRoles(Role.EXECUTIVE);
      expect(roles).toContain(Role.EXECUTIVE);
      expect(roles).toContain(Role.SUPERVISOR);
      expect(roles).toContain(Role.FIELD_OFFICER);
      expect(roles).not.toContain(Role.ADMIN);
      expect(roles.length).toBe(3);
    });

    it('should return correct roles for SUPERVISOR', () => {
      const roles = getAccessibleRoles(Role.SUPERVISOR);
      expect(roles).toContain(Role.SUPERVISOR);
      expect(roles).toContain(Role.FIELD_OFFICER);
      expect(roles).not.toContain(Role.ADMIN);
      expect(roles).not.toContain(Role.EXECUTIVE);
      expect(roles.length).toBe(2);
    });

    it('should return only FIELD_OFFICER for FIELD_OFFICER', () => {
      const roles = getAccessibleRoles(Role.FIELD_OFFICER);
      expect(roles).toContain(Role.FIELD_OFFICER);
      expect(roles).not.toContain(Role.ADMIN);
      expect(roles).not.toContain(Role.EXECUTIVE);
      expect(roles).not.toContain(Role.SUPERVISOR);
      expect(roles.length).toBe(1);
    });
  });

  describe('isHigherRole', () => {
    it('should return true when first role is higher', () => {
      expect(isHigherRole(Role.ADMIN, Role.EXECUTIVE)).toBe(true);
      expect(isHigherRole(Role.ADMIN, Role.SUPERVISOR)).toBe(true);
      expect(isHigherRole(Role.ADMIN, Role.FIELD_OFFICER)).toBe(true);
      expect(isHigherRole(Role.EXECUTIVE, Role.SUPERVISOR)).toBe(true);
      expect(isHigherRole(Role.EXECUTIVE, Role.FIELD_OFFICER)).toBe(true);
      expect(isHigherRole(Role.SUPERVISOR, Role.FIELD_OFFICER)).toBe(true);
    });

    it('should return false when first role is lower or equal', () => {
      expect(isHigherRole(Role.FIELD_OFFICER, Role.SUPERVISOR)).toBe(false);
      expect(isHigherRole(Role.FIELD_OFFICER, Role.EXECUTIVE)).toBe(false);
      expect(isHigherRole(Role.FIELD_OFFICER, Role.ADMIN)).toBe(false);
      expect(isHigherRole(Role.SUPERVISOR, Role.EXECUTIVE)).toBe(false);
      expect(isHigherRole(Role.SUPERVISOR, Role.ADMIN)).toBe(false);
      expect(isHigherRole(Role.EXECUTIVE, Role.ADMIN)).toBe(false);
    });

    it('should return false when roles are equal', () => {
      expect(isHigherRole(Role.ADMIN, Role.ADMIN)).toBe(false);
      expect(isHigherRole(Role.EXECUTIVE, Role.EXECUTIVE)).toBe(false);
      expect(isHigherRole(Role.SUPERVISOR, Role.SUPERVISOR)).toBe(false);
      expect(isHigherRole(Role.FIELD_OFFICER, Role.FIELD_OFFICER)).toBe(false);
    });
  });
});
