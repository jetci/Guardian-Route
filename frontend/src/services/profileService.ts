/**
 * Profile Service
 * API calls for user profile management
 */

import { apiClient } from './client';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  lastName: string;
  phone?: string;
  department?: string;
  role: string;
  isActive: boolean;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

const profileService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileDto): Promise<UserProfile> {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  },

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordDto): Promise<{ message: string }> {
    const response = await apiClient.post('/users/change-password', data);
    return response.data;
  },

  /**
   * Upload profile image
   */
  async uploadProfileImage(file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/users/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete profile image
   */
  async deleteProfileImage(): Promise<{ message: string }> {
    const response = await apiClient.delete('/users/profile/image');
    return response.data;
  },

  /**
   * Get user activity logs
   */
  async getActivityLogs(limit: number = 10): Promise<ActivityLog[]> {
    const response = await apiClient.get(`/users/activity-logs?limit=${limit}`);
    return response.data;
  },
};

export default profileService;
