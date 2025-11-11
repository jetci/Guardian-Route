import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBroadcastDto, BroadcastTarget } from './dto/create-broadcast.dto';
import { Role } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

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

    // Create individual notifications for each user
    await this.prisma.userNotification.createMany({
      data: targetUserIds.map((userId) => ({
        userId,
        notificationId: broadcast.id,
        isRead: false,
      })),
    });

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
        // REPORTER role doesn't exist, use FIELD_OFFICER instead
        return this.prisma.user.findMany({
          where: { role: Role.FIELD_OFFICER },
          select: { id: true },
        });

      case BroadcastTarget.ALL_STAFF:
        return this.prisma.user.findMany({
          where: {
            role: {
              in: [Role.FIELD_OFFICER, Role.SUPERVISOR],
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
      orderBy: { notification: { createdAt: 'desc' } },
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
      id: un.id,
      isRead: un.isRead,
      readAt: un.readAt,
      ...un.notification,
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
        readAt: new Date(),
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
        readAt: new Date(),
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
