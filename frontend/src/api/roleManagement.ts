import { apiClient } from './client';

// Types
export enum Role {
  FIELD_OFFICER = 'FIELD_OFFICER',
  SUPERVISOR = 'SUPERVISOR',
  EXECUTIVE = 'EXECUTIVE',
  ADMIN = 'ADMIN',
}

export interface RoleMetadata {
  role: Role;
  displayName: string;
  description: string;
  permissionCount: number;
  permissions?: PermissionSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  roleCount: number;
  roles?: RoleSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface PermissionSummary {
  id: string;
  name: string;
  displayName: string;
  category: string;
}

export interface RoleSummary {
  role: Role;
  displayName: string;
  assignedAt: string;
}

export interface CreateRoleMetadataDto {
  role: Role;
  displayName: string;
  description: string;
  permissionIds?: string[];
}

export interface UpdateRoleMetadataDto {
  displayName?: string;
  description?: string;
}

export interface CreatePermissionDto {
  name: string;
  displayName: string;
  description: string;
  category: string;
}

export interface UpdatePermissionDto {
  name?: string;
  displayName?: string;
  description?: string;
  category?: string;
}

export interface AssignPermissionsDto {
  permissionIds: string[];
}

export interface PermissionQueryDto {
  category?: string;
  search?: string;
}

// ========================================
// ROLE MANAGEMENT API
// ========================================

/**
 * Create role metadata
 */
export const createRoleMetadata = async (data: CreateRoleMetadataDto): Promise<RoleMetadata> => {
  const response = await apiClient.post('/api/role-management/roles', data);
  return response.data;
};

/**
 * Get all role metadata
 */
export const getAllRoleMetadata = async (): Promise<RoleMetadata[]> => {
  const response = await apiClient.get('/api/role-management/roles');
  return response.data;
};

/**
 * Get role statistics
 */
export const getRoleStatistics = async () => {
  const response = await apiClient.get('/api/role-management/roles/stats');
  return response.data;
};

/**
 * Get role metadata by role
 */
export const getRoleMetadata = async (role: Role): Promise<RoleMetadata> => {
  const response = await apiClient.get(`/api/role-management/roles/${role}`);
  return response.data;
};

/**
 * Update role metadata
 */
export const updateRoleMetadata = async (
  role: Role,
  data: UpdateRoleMetadataDto,
): Promise<RoleMetadata> => {
  const response = await apiClient.patch(`/api/role-management/roles/${role}`, data);
  return response.data;
};

/**
 * Delete role metadata
 */
export const deleteRoleMetadata = async (role: Role): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/api/role-management/roles/${role}`);
  return response.data;
};

/**
 * Assign permissions to role
 */
export const assignPermissions = async (
  role: Role,
  data: AssignPermissionsDto,
): Promise<RoleMetadata> => {
  const response = await apiClient.post(`/api/role-management/roles/${role}/permissions`, data);
  return response.data;
};

/**
 * Remove permissions from role
 */
export const removePermissions = async (
  role: Role,
  data: AssignPermissionsDto,
): Promise<RoleMetadata> => {
  const response = await apiClient.delete(`/api/role-management/roles/${role}/permissions`, {
    data,
  });
  return response.data;
};

/**
 * Get role permissions
 */
export const getRolePermissions = async (role: Role): Promise<Permission[]> => {
  const response = await apiClient.get(`/api/role-management/roles/${role}/permissions`);
  return response.data;
};

// ========================================
// PERMISSION MANAGEMENT API
// ========================================

/**
 * Create permission
 */
export const createPermission = async (data: CreatePermissionDto): Promise<Permission> => {
  const response = await apiClient.post('/api/role-management/permissions', data);
  return response.data;
};

/**
 * Bulk create permissions
 */
export const bulkCreatePermissions = async (permissions: CreatePermissionDto[]) => {
  const response = await apiClient.post('/api/role-management/permissions/bulk', {
    permissions,
  });
  return response.data;
};

/**
 * Get all permissions
 */
export const getAllPermissions = async (query?: PermissionQueryDto): Promise<Permission[]> => {
  const response = await apiClient.get('/api/role-management/permissions', { params: query });
  return response.data;
};

/**
 * Get permission statistics
 */
export const getPermissionStatistics = async () => {
  const response = await apiClient.get('/api/role-management/permissions/stats');
  return response.data;
};

/**
 * Get permission categories
 */
export const getPermissionCategories = async (): Promise<string[]> => {
  const response = await apiClient.get('/api/role-management/permissions/categories');
  return response.data;
};

/**
 * Get permissions grouped by category
 */
export const getPermissionsByCategory = async (): Promise<Record<string, Permission[]>> => {
  const response = await apiClient.get('/api/role-management/permissions/by-category');
  return response.data;
};

/**
 * Get permission by ID
 */
export const getPermission = async (id: string): Promise<Permission> => {
  const response = await apiClient.get(`/api/role-management/permissions/${id}`);
  return response.data;
};

/**
 * Update permission
 */
export const updatePermission = async (
  id: string,
  data: UpdatePermissionDto,
): Promise<Permission> => {
  const response = await apiClient.patch(`/api/role-management/permissions/${id}`, data);
  return response.data;
};

/**
 * Delete permission
 */
export const deletePermission = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/api/role-management/permissions/${id}`);
  return response.data;
};

/**
 * Get roles that have a specific permission
 */
export const getPermissionRoles = async (permissionId: string): Promise<RoleSummary[]> => {
  const response = await apiClient.get(`/api/role-management/permissions/${permissionId}/roles`);
  return response.data;
};
