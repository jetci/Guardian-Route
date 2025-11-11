export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'notification.broadcast' | 'notification.alert' | 'notification.system';
  createdAt: string;
  isRead: boolean;
  // Add other fields as needed, e.g., link, incidentId
}

export interface ResourceUpdate {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'IN_USE' | 'AVAILABLE' | 'MAINTENANCE';
}

export interface NotificationEvent {
  id: string;
  type: 'notification.broadcast' | 'notification.alert' | 'notification.system' | 'resource.updated';
  data: Notification | ResourceUpdate;
}
