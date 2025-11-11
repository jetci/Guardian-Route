import { Injectable } from '@nestjs/common';
import { Subject, Observable, merge } from 'rxjs';
import { map, filter, auditTime } from 'rxjs/operators';

// Define the structure for the SSE event data
interface SseEvent {
  data: any;
  type: string; // Corresponds to the event name in the client (e.g., 'notification.broadcast')
}

@Injectable()
export class EventsService {
  // Subject to broadcast all events to all connected clients
  private readonly eventsSubject = new Subject<SseEvent>();

  /**
   * Returns an Observable that the NestJS @Sse() controller method will subscribe to.
   * This is the standard way to implement SSE in NestJS.
   * @returns {Observable<MessageEvent>}
   */
  subscribeToEvents(): Observable<MessageEvent> {
    // 1. Stream for resource.updated events (needs debouncing)
    const resourceUpdateStream = this.eventsSubject.asObservable().pipe(
      filter((event) => event.type === 'resource.updated'),
      auditTime(500), // Debounce resource updates to max 2 per second
      map((event) => ({
        data: JSON.stringify(event.data),
        type: event.type,
      })),
    );

    // 2. Stream for all other events (no debouncing)
    const otherEventsStream = this.eventsSubject.asObservable().pipe(
      filter((event) => event.type !== 'resource.updated'),
      map((event) => ({
        data: JSON.stringify(event.data),
        type: event.type,
      })),
    );

    // Merge both streams
    return merge(resourceUpdateStream, otherEventsStream) as Observable<MessageEvent>;
  }

  /**
   * Broadcasts an event to all connected SSE clients.
   * @param type The event type (e.g., 'notification.broadcast', 'resource.updated').
   * @param data The payload to send.
   */
  broadcastEvent(type: string, data: any): void {
    this.eventsSubject.next({ type, data });
    console.log(`[SSE] Broadcasted event: ${type}`);
  }

  /**
   * Subscribe a user to notifications via SSE.
   * This method is used by the notification-events controller.
   * @param userId The user ID to subscribe
   * @param res The Express Response object for SSE
   */
  subscribeToNotifications(userId: string, res: any): void {
    // Subscribe to the events stream
    const subscription = this.subscribeToEvents().subscribe({
      next: (event) => {
        // Send SSE event to client
        res.write(`event: ${event.type}\n`);
        res.write(`data: ${event.data}\n\n`);
      },
      error: (err) => {
        console.error(`[SSE] Error for user ${userId}:`, err);
        res.end();
      },
    });

    // Clean up subscription when connection closes
    res.on('close', () => {
      console.log(`[SSE] Client disconnected: ${userId}`);
      subscription.unsubscribe();
    });

    console.log(`[SSE] Client connected: ${userId}`);
  }

  // NOTE: For user-specific notifications, a more complex Subject-per-user
  // or filtering logic would be required, but for now, we'll use a simple broadcast.
  // The frontend handles filtering based on the JWT token.
}
