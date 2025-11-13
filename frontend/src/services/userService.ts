/**
 * User Service - API calls for user management
 * Guardian Route Project
 * Phase A - Admin Dashboard Integration
 */

import api from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  role: 'ADMIN' | 'EXECUTIVE' | 'SUPERVISOR' | 'FIELD_OFFICER';
  status?: 'ACTIVE' | 'INACTIVE';
  phone?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  phone?: string;
  password?: string;
}

export interface UserStatistics {
  total: number;
  byRole: {
    ADMIN: number;
    EXECUTIVE: number;
    SUPERVISOR: number;
    FIELD_OFFICER: number;
  };
  byStatus: {
    ACTIVE: number;
    INACTIVE: number;
  };
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

// Get all users with pagination and filters
export const getUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}): Promise<UsersResponse> => {
  const response = await api.get('/api/users', { params });
  return response.data;
};

// Get user statistics
export const getUserStatistics = async (): Promise<UserStatistics> => {
  const response = await api.get('/api/users/statistics');
  return response.data;
};

// Get single user by ID
export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/api/users/${id}`);
  return response.data;
};

// Create new user
export const createUser = async (userData: CreateUserDto): Promise<User> => {
  const response = await api.post('/api/users', userData);
  return response.data;
};

// Update user
export const updateUser = async (id: string, userData: UpdateUserDto): Promise<User> => {
  const response = await api.patch(`/api/users/${id}`, userData);
  return response.data;
};

// Delete user
export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/api/users/${id}`);
};

// Toggle user status
export const toggleUserStatus = async (id: string): Promise<User> => {
  const response = await api.patch(`/api/users/${id}/toggle-status`);
  return response.data;
};

export default {
  getUsers,
  getUserStatistics,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
};
