export enum NotificationType {
  INCIDENT_CREATED = 'INCIDENT_CREATED',
  INCIDENT_ASSIGNED = 'INCIDENT_ASSIGNED',
  INCIDENT_UPDATED = 'INCIDENT_UPDATED',
  INCIDENT_RESOLVED = 'INCIDENT_RESOLVED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  REPORT_SUBMITTED = 'REPORT_SUBMITTED',
  REPORT_APPROVED = 'REPORT_APPROVED',
  REPORT_REJECTED = 'REPORT_REJECTED',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  SYSTEM_MAINTENANCE = 'SYSTEM_MAINTENANCE',
}

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  data?: Record<string, any>;
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdAt: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  notificationId: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  notification: Notification;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  data?: Record<string, any>;
  relatedEntityType?: string;
  relatedEntityId?: string;
  userIds: string[];
}

export interface MarkReadDto {
  notificationIds: string[];
}
