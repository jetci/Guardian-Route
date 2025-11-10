import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBroadcastDto } from './dto/create-broadcast.dto';
import { Role, NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create and send a broadcast notification to a target group of users.
   */
  async createBroadcast(dto: CreateBroadcastDto, senderId: string) {
    const targetWhereClause = {
      where: {
        isActive: true,
        ...(dto.targetRole !== 'ALL' && { role: dto.targetRole }),
      },
      select: { id: true },
    };

    const targetUsers = await this.prisma.user.findMany(targetWhereClause);

    if (targetUsers.length === 0) {
      throw new NotFoundException('No active target users found for this broadcast.');
    }

    const targetUserIds = targetUsers.map((u) => u.id);

    // Create a single notification record for the broadcast event itself
    const notification = await this.prisma.notification.create({
      data: {
        title: dto.title,
        message: dto.message,
        type: NotificationType.BROADCAST, // Use a specific type for broadcasts
        senderId,
        metadata: {
          priority: dto.priority,
          targetRole: dto.targetRole,
          recipientCount: targetUserIds.length,
        },
      },
    });

    // Create individual linking records for each recipient
    await this.prisma.userNotification.createMany({
      data: targetUserIds.map((userId) => ({
        userId,
        notificationId: notification.id,
        isRead: false,
      })),
    });

    return {
      success: true,
      message: 'Broadcast sent successfully.',
      recipientCount: targetUserIds.length,
      broadcastId: notification.id,
    };
  }

  /**
   * Get a user's notifications, ordered by most recent.
   */
  async getUserNotifications(userId: string, limit = 20) {
    const userNotifications = await this.prisma.userNotification.findMany({
      where: { userId },
      take: limit,
      orderBy: { notification: { createdAt: 'desc' } },
      include: {
        notification: {
          include: {
            sender: {
              select: {
                id: true,
                fullName: true,
                role: true,
              },
            },
          },
        },
      },
    });

    // Transform the data to a more user-friendly format
    return userNotifications.map((un) => ({
      userNotificationId: un.id,
      isRead: un.isRead,
      readAt: un.readAt,
      ...un.notification,
    }));
  }

  /**
   * Mark a specific notification as read for a user.
   */
  async markAsRead(userNotificationId: string, userId: string) {
    const userNotification = await this.prisma.userNotification.findFirst({
      where: {
        id: userNotificationId,
        userId: userId,
      },
    });

    if (!userNotification) {
      throw new NotFoundException(
        `Notification with ID ${userNotificationId} not found for this user.`,
      );
    }

    if (userNotification.isRead) {
      return userNotification; // Already read, no update needed
    }

    return this.prisma.userNotification.update({
      where: { id: userNotificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark all unread notifications as read for a user.
   */
  async markAllAsRead(userId: string) {
    const result = await this.prisma.userNotification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { count: result.count };
  }

  /**
   * Get the count of unread notifications for a user.
   */
  async getUnreadCount(userId: string) {
    const count = await this.prisma.userNotification.count({
      where: {
        userId,
        isRead: false,
      },
    });
    return { count };
  }
}
