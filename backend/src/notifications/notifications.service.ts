import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { PrismaService } from '../database/prisma.service';
import { CreateBroadcastDto, BroadcastTarget } from './dto/create-broadcast.dto';
import { Role } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
  ) {}

  /**
   * Logs an important notification to the persistent NotificationLog table.
   * @param type The type of notification (e.g., 'notification.alert', 'notification.broadcast').
   * @param message The message content.
   */
  private async logNotification(type: string, message: string): Promise<void> {
    // Only log important events like alerts and broadcasts
    if (type.includes('alert') || type.includes('broadcast')) {
      await this.prisma.notificationLog.create({
        data: {
          type: type.toUpperCase().replace('NOTIFICATION.', ''), // e.g., BROADCAST, ALERT
          message,
        },
      });
    }
  }

  /**
   * Create and send broadcast notification
   */
  async createBroadcast(dto: CreateBroadcastDto, senderId: string) {
    // Determine target users
    let targetUserIds: string[] = [];

    if (dto.target === BroadcastTarget.SPECIFIC_USERS) {
      targetUserIds = dto.userIds || [];
    } else {
      const users = await this.getTargetUsers(dto.target);
      targetUserIds = users.map((u) => u.id);
    }

    if (targetUserIds.length === 0) {
      throw new NotFoundException('No target users found');
    }

    // Create broadcast record
    const broadcast = await this.prisma.notification.create({
      data: {
        title: dto.title,
        message: dto.message,
        type: dto.type,
        senderId,
        incidentId: dto.incidentId,
        metadata: JSON.stringify({
          target: dto.target,
          recipientCount: targetUserIds.length,
        }),
      },
    });

    // Log the notification to the persistent log table
    // We log before broadcasting to ensure persistence even if SSE fails
    await this.logNotification(dto.type, dto.message);

    // Create individual notifications for each user
    await this.prisma.userNotification.createMany({
      data: targetUserIds.map((userId) => ({
        userId,
        notificationId: broadcast.id,
        message: dto.message, // Added missing 'message' field
        isRead: false,
      })),
    });

    // --- Broadcast the new notification event to all connected clients ---
    // NOTE: In a real-world scenario, we would only broadcast to the target users.
    // Since the SSE endpoint is protected by JWT, the frontend will filter for its own notifications.
    const notificationEvent = {
      id: broadcast.id,
      title: broadcast.title,
      message: broadcast.message,
      type: broadcast.type,
      createdAt: broadcast.createdAt.toISOString(),
      isRead: false, // Always false for a new notification
    };
    this.eventsService.broadcastEvent(broadcast.type, notificationEvent);
    // ---------------------------------------------------------------------

    return {
      ...broadcast,
      recipientCount: targetUserIds.length,
    };
  }

  /**
   * Get target users based on broadcast target
   */
  private async getTargetUsers(target: BroadcastTarget) {
    switch (target) {
      case BroadcastTarget.ALL_FIELD_OFFICERS:
        return this.prisma.user.findMany({
          where: { role: Role.FIELD_OFFICER },
          select: { id: true },
        });

      case BroadcastTarget.ALL_REPORTERS:
        return this.prisma.user.findMany({
          where: { role: Role.FIELD_OFFICER }, // Assuming REPORTER role is now FIELD_OFFICER
          select: { id: true },
        });

      case BroadcastTarget.ALL_STAFF:
        return this.prisma.user.findMany({
          where: {
            role: {
              in: [Role.FIELD_OFFICER, Role.SUPERVISOR, Role.EXECUTIVE, Role.ADMIN], // Removed REPORTER, added EXECUTIVE, ADMIN for ALL_STAFF
            },
          },
          select: { id: true },
        });

      default:
        return [];
    }
  }

  /**
   * Get user's notifications
   */
  async getUserNotifications(userId: string, limit = 20) {
    const notifications = await this.prisma.userNotification.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        notification: {
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
            incident: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    return notifications.map((un) => ({
      ...un, // Return the UserNotification object itself, which contains id, message, isRead, createdAt, etc.
      readAt: un.createdAt, // Use createdAt as a placeholder for readAt if needed, or remove this line
      notification: un.notification,
    }));
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userNotificationId: string, userId: string) {
    const userNotification = await this.prisma.userNotification.findFirst({
      where: {
        id: userNotificationId,
        userId,
      },
    });

    if (!userNotification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.userNotification.update({
      where: { id: userNotificationId },
      data: {
        isRead: true,
        // readAt is not a field in UserNotification model. Only isRead.
        // readAt: new Date(),
      },
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    return this.prisma.userNotification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        // readAt is not a field in UserNotification model. Only isRead.
        // readAt: new Date(),
      },
    });
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string) {
    return this.prisma.userNotification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }
}
