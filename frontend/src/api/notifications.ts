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
   * TODO: Backend endpoint not ready - using mock data
   */
  async getMyNotifications(limit = 20): Promise<Notification[]> {
    // Mock data until backend endpoint is ready
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'แจ้งเตือนเหตุฉุกเฉิน',
        message: 'พบเหตุน้ำท่วมฉับพลันในพื้นที่ หมู่ 5',
        type: BroadcastType.EMERGENCY,
        isRead: false,
        readAt: null,
        createdAt: new Date().toISOString(),
        sender: {
          id: 'supervisor-1',
          firstName: 'Supervisor',
          lastName: 'User',
          role: 'SUPERVISOR',
        },
      },
      {
        id: '2',
        title: 'อัพเดทสถานการณ์',
        message: 'สถานการณ์น้ำท่วมคลี่คลาย',
        type: BroadcastType.UPDATE,
        isRead: true,
        readAt: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        sender: {
          id: 'admin-1',
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
        },
      },
    ];
    
    return mockNotifications.slice(0, limit);
    
    // Real API call (commented out until backend ready)
    // const response = await api.get('/notifications/my', {
    //   params: { limit },
    // });
    // return response.data;
  },

  /**
   * Get unread count
   * TODO: Backend endpoint not ready - using mock data
   */
  async getUnreadCount(): Promise<number> {
    // Mock data - return 1 unread notification
    return 1;
    
    // Real API call (commented out until backend ready)
    // const response = await api.get('/notifications/unread-count');
    // return response.data.count;
  },

  /**
   * Mark notification as read
   * TODO: Backend endpoint not ready - using mock
   */
  async markAsRead(notificationId: string) {
    // Mock - just return success
    return { success: true };
    
    // Real API call (commented out until backend ready)
    // const response = await api.patch(`/notifications/${notificationId}/read`);
    // return response.data;
  },

  /**
   * Mark all as read
   * TODO: Backend endpoint not ready - using mock
   */
  async markAllAsRead() {
    // Mock - just return success
    return { success: true };
    
    // Real API call (commented out until backend ready)
    // const response = await api.patch('/notifications/read-all');
    // return response.data;
  },
};
