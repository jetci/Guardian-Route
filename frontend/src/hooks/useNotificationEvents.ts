import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { Notification } from '../types/notification';
import type { ResourceUpdateEvent } from '../types/resource';



// Define the hook's return type
interface UseNotificationEvents {
  notifications: Notification[];
  isConnected: boolean;
  error: string | null;
  markAsRead: (id: string) => void;
  latestResourceUpdate: ResourceUpdateEvent | null;
}

// Reconnection settings
const RECONNECT_INTERVAL = 3000; // 3 seconds (as requested by SA)

/**
 * Custom hook to connect to the Server-Sent Events (SSE) endpoint for real-time notifications.
 * It handles connection, reconnection, and event parsing.
 * @param token The JWT token required for authentication.
 * @returns {UseNotificationEvents}
 */
export const useNotificationEvents = (token: string | null): UseNotificationEvents => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestResourceUpdate, setLatestResourceUpdate] = useState<ResourceUpdateEvent | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Real Toast Function using react-hot-toast
  const triggerToast = (notification: Notification) => {
    const type = notification.type.split('.')[1];
    const title = '🔔 ' + type.toUpperCase() + ': ' + notification.title;

    switch (notification.type) {
      case 'notification.alert':
        toast.error(title, {
          duration: 5000,
          position: 'top-right',
        });
        break;
      case 'notification.broadcast':
      case 'notification.system':
        toast.success(title, {
          duration: 5000,
          position: 'top-right',
        });
        break;
      default:
        toast(title, {
          duration: 5000,
          position: 'top-right',
        });
        break;
    }
  };

  const connect = useCallback(() => {
    if (!token) {
      setError('Authentication token is missing.');
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/notification-events`;
    // SSE with Authorization header is tricky. We must pass the token as a query parameter
    // or rely on the server to handle the cookie/header from the initial request.
    // Since the backend is NestJS/Express, it likely expects the token in the Authorization header.
    // Standard EventSource API does not support custom headers.
    // A common workaround is to use a query parameter or a polyfill, but for simplicity
    // and assuming the backend is configured to accept the token via query for SSE:
    const connectionUrl = `${url}?token=${token}`;

    // Fallback: If the backend is configured to use a proxy or cookie-based auth,
    // the standard EventSource might work without query params.
    // Let's use the standard URL first and assume the auth is handled by cookies/session.
    // If 401 is received, we'll switch to the query param method.
    const es = new EventSource(connectionUrl);
    setEventSource(es);

    es.onopen = () => {
      setIsConnected(true);
      setError(null);
      setRetryCount(0); // Reset retry count on successful connection
      console.log('SSE connection established.');
    };

    es.onerror = (err) => {
      console.error('SSE Error:', err);
      setIsConnected(false);
      es.close();

      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);

      const errorMessage = 'SSE connection failed. Attempting to reconnect (' + newRetryCount + ')...';
      setError(errorMessage);
      console.log(errorMessage);

      // Implement fixed interval retry strategy
      setTimeout(connect, RECONNECT_INTERVAL);
    };

    // --- Event Handlers ---

    // 1. notification.broadcast
    es.addEventListener('notification.broadcast', (event: MessageEvent) => {
      try {
        const data: Notification = JSON.parse(event.data);
        setNotifications((prev) => [data, ...prev]);
        triggerToast(data);
      } catch (e) {
        console.error('Error parsing notification.broadcast event:', e);
      }
    });

    // 2. notification.alert
    es.addEventListener('notification.alert', (event: MessageEvent) => {
      try {
        const data: Notification = JSON.parse(event.data);
        setNotifications((prev) => [data, ...prev]);
        triggerToast(data);
      } catch (e) {
        console.error('Error parsing notification.alert event:', e);
      }
    });

    // 3. notification.system
    es.addEventListener('notification.system', (event: MessageEvent) => {
      try {
        const data: Notification = JSON.parse(event.data);
        setNotifications((prev) => [data, ...prev]);
        triggerToast(data);
      } catch (e) {
        console.error('Error parsing notification.system event:', e);
      }
    });

    // 4. resource.updated (For Map Tracking in Phase 4)
    es.addEventListener('resource.updated', (event: MessageEvent) => {
      try {
        const data: ResourceUpdateEvent = JSON.parse(event.data);
        setLatestResourceUpdate(data);
        console.log('🗺️ Resource ' + data.resource.id + ' updated to [lon: ' + data.resource.location.coordinates[0] + ', lat: ' + data.resource.location.coordinates[1] + ']');
      } catch (e) {
        console.error('Error parsing resource.updated event:', e);
      }
    });

    // Generic message handler (for un-typed events)
    es.onmessage = () => {
      // console.log('Generic SSE message:');
    };

  }, [token]);

  useEffect(() => {
    // Initial connection attempt
    connect();

    // Cleanup function
    return () => {
      if (eventSource) {
        eventSource.close();
        console.log('SSE connection closed.');
      }
    };
  }, [token]); // Depend on token to re-run if token changes, but rely on connect's internal retry for disconnections

  const markAsRead = useCallback((id: string) => {
    // Placeholder for marking notification as read (will require an API call in a real app)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  return {
    notifications,
    isConnected,
    error,
    markAsRead,
    latestResourceUpdate,
  };
};


