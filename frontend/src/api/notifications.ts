import { api } from './client';

export enum BroadcastType {
  EMERGENCY = 'EMERGENCY',
  ALERT = 'ALERT',
  INFO = 'INFO',
  UPDATE = 'UPDATE',
}

export enum BroadcastTarget {
  ALL_FIELD_OFFICERS = 'ALL_FIELD_OFFICERS',
  ALL_REPORTERS = 'ALL_REPORTERS',
  ALL_STAFF = 'ALL_STAFF',
  SPECIFIC_USERS = 'SPECIFIC_USERS',
}

export interface CreateBroadcastDto {
  title: string;
  message: string;
  type: BroadcastType;
  target: BroadcastTarget;
  userIds?: string[];
  incidentId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: BroadcastType;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  incident?: {
    id: string;
    title: string;
  };
}

export const notificationsApi = {
  /**
   * Send broadcast notification (Supervisor/Admin only)
   */
  async sendBroadcast(data: CreateBroadcastDto) {
    const response = await api.post('/notifications/broadcast', data);
    return response.data;
  },

  /**
   * Get my notifications
   */
  async getMyNotifications(includeRead = false): Promise<Notification[]> {
    const response = await api.get<Notification[]>('/notifications/my', {
      params: { includeRead },
    });
    return response.data;
  },

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get<{ count: number }>('/notifications/my/unread-count');
    return response.data.count;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    const response = await api.patch('/notifications/mark-read', {
      notificationIds: [notificationId],
    });
    return response.data;
  },

  /**
   * Mark all as read
   */
  async markAllAsRead() {
    const response = await api.patch('/notifications/mark-all-read');
    return response.data;
  },

  /**
   * Delete notification (Admin only)
   */
  async deleteNotification(notificationId: string) {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};
