import { useEffect, useRef, useState } from 'react';
import { Resource, AllocationRecord } from '../../types/resource';

export type ResourceEventType =
  | 'resource.created'
  | 'resource.updated'
  | 'resource.deleted'
  | 'resource.allocated'
  | 'resource.reclaimed';

export interface ResourceEvent {
  type: ResourceEventType;
  data: Resource | AllocationRecord | { id: string };
}

interface UseResourceEventsOptions {
  onEvent?: (event: ResourceEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export const useResourceEvents = (options: UseResourceEventsOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  const connect = () => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Create new EventSource connection
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const url = `${apiUrl}/events/resources`;

    // Note: EventSource doesn't support custom headers directly
    // We'll need to pass the token as a query parameter
    const urlWithToken = `${url}?token=${token}`;

    const eventSource = new EventSource(urlWithToken);
    eventSourceRef.current = eventSource;

    // Connection opened
    eventSource.addEventListener('connected', () => {
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
      options.onConnect?.();
    });

    // Listen for resource events
    const eventTypes: ResourceEventType[] = [
      'resource.created',
      'resource.updated',
      'resource.deleted',
      'resource.allocated',
      'resource.reclaimed',
    ];

    eventTypes.forEach((eventType) => {
      eventSource.addEventListener(eventType, (event) => {
        try {
          const data = JSON.parse(event.data);
          const resourceEvent: ResourceEvent = {
            type: eventType,
            data,
          };
          options.onEvent?.(resourceEvent);
        } catch (error) {
          console.error(`Error parsing ${eventType} event:`, error);
        }
      });
    });

    // Error handling
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      setIsConnected(false);
      options.onError?.(error);

      // Attempt to reconnect
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectAttemptsRef.current++;
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log(`Reconnecting... (attempt ${reconnectAttemptsRef.current})`);
          connect();
        }, reconnectDelay);
      } else {
        console.error('Max reconnection attempts reached');
        options.onDisconnect?.();
      }
    };
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    reconnect: connect,
    disconnect,
  };
};
