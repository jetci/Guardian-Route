/*
import { renderHook, act } from '@testing-library/react-hooks';
import { useNotificationEvents } from './useNotificationEvents';
import type { Notification } from '../types/notification';
import type { ResourceUpdateEvent } from '../types/resource';
import toast from 'react-hot-toast';

// --- Mocking Dependencies ---

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  default: jest.fn(),
}));

// Mock EventSource
class MockEventSource {
  url: string;
  onopen: () => void = () => {};
  onerror: (event: Event) => void = () => {};
  onmessage: (event: MessageEvent) => void = () => {};
  listeners: Map<string, (event: MessageEvent) => void> = new Map();

  constructor(url: string) {
    this.url = url;
    // Simulate immediate connection on instantiation
    setTimeout(() => this.onopen(), 0);
  }

  addEventListener(event: string, callback: (event: MessageEvent) => void) {
    this.listeners.set(event, callback);
  }

  removeEventListener(event: string) {
    this.listeners.delete(event);
  }

  close() {
    // Simulate connection close
  }

  // Helper to simulate receiving an event
  simulateEvent(type: string, data: any) {
    const listener = this.listeners.get(type);
    if (listener) {
      listener({ data: JSON.stringify(data) } as MessageEvent);
    }
  }

  // Helper to simulate an error
  simulateError() {
    this.onerror(new Event('error'));
  }
}

// Global mock for EventSource
global.EventSource = MockEventSource as any;

// --- Test Data ---

const MOCK_TOKEN = 'test-jwt-token';
const MOCK_NOTIFICATION: Notification = {
  id: 'n1',
  title: 'Test Broadcast',
  message: 'This is a test broadcast message.',
  type: 'notification.broadcast',
  createdAt: new Date().toISOString(),
  isRead: false,
};

const MOCK_RESOURCE_UPDATE: ResourceUpdateEvent = {
  resource: {
    id: 'r1',
    name: 'Field Officer 1',
    status: 'IN_USE',
    location: { type: 'Point', coordinates: [100.0, 13.0] },
    lastUpdated: new Date().toISOString(),
  },
};

// --- Tests ---

describe('useNotificationEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct state and connect to SSE', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useNotificationEvents(MOCK_TOKEN));

    expect(result.current.isConnected).toBe(false);
    expect(result.current.notifications).toEqual([]);

    // Wait for the simulated onopen event
    await waitForNextUpdate();

    expect(result.current.isConnected).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle new notification events and trigger toast', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useNotificationEvents(MOCK_TOKEN));
    await waitForNextUpdate(); // Wait for connection

    const mockEs = (global.EventSource as any).mock.instances[0];

    act(() => {
      mockEs.simulateEvent('notification.broadcast', MOCK_NOTIFICATION);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].title).toBe('Test Broadcast');
    expect(toast.success).toHaveBeenCalledTimes(1);
  });

  it('should handle resource.updated events', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useNotificationEvents(MOCK_TOKEN));
    await waitForNextUpdate(); // Wait for connection

    const mockEs = (global.EventSource as any).mock.instances[0];

    act(() => {
      mockEs.simulateEvent('resource.updated', MOCK_RESOURCE_UPDATE);
    });

    expect(result.current.latestResourceUpdate).toEqual(MOCK_RESOURCE_UPDATE);
  });

  it('should handle markAsRead correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useNotificationEvents(MOCK_TOKEN));
    await waitForNextUpdate(); // Wait for connection

    const mockEs = (global.EventSource as any).mock.instances[0];

    act(() => {
      mockEs.simulateEvent('notification.broadcast', MOCK_NOTIFICATION);
    });

    expect(result.current.notifications[0].isRead).toBe(false);

    act(() => {
      result.current.markAsRead('n1');
    });

    expect(result.current.notifications[0].isRead).toBe(true);
  });

  it('should attempt to reconnect on error', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useNotificationEvents(MOCK_TOKEN));
    await waitForNextUpdate(); // Wait for connection

    const mockEs = (global.EventSource as any).mock.instances[0];
    const closeSpy = jest.spyOn(mockEs, 'close');

    // Mock setTimeout to be synchronous for testing reconnection logic
    jest.useFakeTimers();

    act(() => {
      mockEs.simulateError();
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.error).toContain('SSE connection failed');
    expect(closeSpy).toHaveBeenCalled();

    // Fast-forward time to trigger reconnection attempt
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // A new EventSource instance should be created
    expect((global.EventSource as any).mock.instances).toHaveLength(2);

    jest.useRealTimers();
  });
});
*/
