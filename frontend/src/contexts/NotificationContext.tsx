import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@chakra-ui/react';
import type { UserNotification } from '../types/notification';
import { notificationService } from '../services/notificationService';

interface NotificationContextType {
  notifications: UserNotification[];
  unreadCount: number;
  isConnected: boolean;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationIds: string[]) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationService.getMyNotifications(false);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh unread count
  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, []);

  // Mark notifications as read
  const markAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      await notificationService.markAsRead(notificationIds);

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notificationIds.includes(notif.notificationId)
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        )
      );

      // Refresh unread count
      await refreshUnreadCount();
    } catch (error) {
      console.error('Failed to mark as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notifications as read',
        status: 'error',
        duration: 3000,
      });
    }
  }, [refreshUnreadCount, toast]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({
          ...notif,
          isRead: true,
          readAt: new Date().toISOString(),
        }))
      );

      setUnreadCount(0);

      toast({
        title: 'Success',
        description: 'All notifications marked as read',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        status: 'error',
        duration: 3000,
      });
    }
  }, [toast]);

  // Initialize WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // console.log('No token found, skipping WebSocket connection');
      return;
    }

    // Determine socket base URL (strip trailing '/api' if present)
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const socketBase = apiBase.replace(/\/api\/?$/, '');

    // Create socket connection
    const newSocket = io(`${socketBase}/notifications`, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Connection events
    newSocket.on('connect', () => {
      // console.log('✅ WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('connected', (data) => {
      // console.log('✅ WebSocket authenticated:', data);
    });

    newSocket.on('disconnect', () => {
      // console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Listen for new notifications
    newSocket.on('notification', (data: any) => {
      // console.log('🔔 New notification received:', data);

      // Add to notifications list
      setNotifications((prev) => [data, ...prev]);

      // Increment unread count
      setUnreadCount((prev) => prev + 1);

      // Show toast notification
      toast({
        title: data.notification?.title || 'New Notification',
        description: data.notification?.message || 'You have a new notification',
        status: data.notification?.priority === 'URGENT' ? 'error' :
          data.notification?.priority === 'HIGH' ? 'warning' : 'info',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });

      // Play notification sound (optional)
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Ignore if sound fails to play
        });
      } catch (error) {
        // Ignore sound errors
      }
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [toast]);

  // Fetch initial data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Call directly to avoid dependency issues
      notificationService.getMyNotifications(false)
        .then(setNotifications)
        .catch((error) => console.error('Failed to fetch initial notifications:', error));

      notificationService.getUnreadCount()
        .then(setUnreadCount)
        .catch((error) => console.error('Failed to fetch initial unread count:', error));
    }
  }, []); // Empty array - run only once on mount

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isConnected,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    refreshUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
