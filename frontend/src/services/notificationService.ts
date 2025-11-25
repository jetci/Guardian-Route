import api from './api';
import type { UserNotification, CreateNotificationDto, MarkReadDto } from '../types/notification';

export const notificationService = {
  /**
   * Get my notifications
   */
  async getMyNotifications(includeRead = false): Promise<UserNotification[]> {
    const response = await api.get('/notifications/my', {
      params: { includeRead },
    });
    return response.data;
  },

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/my/unread-count');
    return response.data;
  },

  /**
   * Mark notifications as read
   */
  async markAsRead(notificationIds: string[]): Promise<void> {
    await api.patch('/notifications/mark-read', {
      notificationIds,
    } as MarkReadDto);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/mark-all-read');
  },

  /**
   * Create notification (Admin/Supervisor only)
   */
  async create(dto: CreateNotificationDto): Promise<any> {
    const response = await api.post('/notifications', dto);
    return response.data;
  },

  /**
   * Delete notification (Admin only)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },
};
