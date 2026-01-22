import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationType, NotificationPriority } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly db: PrismaService) { }

  /**
   * Create notification and send to specific users
   */
  async create(dto: CreateNotificationDto) {
    const { userIds, ...notificationData } = dto;

    // Create notification
    const notification = await this.db.notification.create({
      data: {
        ...notificationData,
        priority: dto.priority || NotificationPriority.NORMAL,
      },
    });

    // Create user notifications
    const userNotifications = await Promise.all(
      userIds.map((userId) =>
        this.db.userNotification.create({
          data: {
            userId,
            notificationId: notification.id,
          },
        }),
      ),
    );

    return {
      notification,
      userNotifications,
    };
  }

  /**
   * Get all notifications for a user
   */
  async findAllForUser(userId: string, includeRead = false) {
    const where: any = { userId };

    if (!includeRead) {
      where.isRead = false;
    }

    return this.db.userNotification.findMany({
      where,
      include: {
        notification: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.db.userNotification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Mark notifications as read
   */
  async markAsRead(userId: string, notificationIds: string[]) {
    return this.db.userNotification.updateMany({
      where: {
        userId,
        notificationId: {
          in: notificationIds,
        },
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    return this.db.userNotification.updateMany({
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
   * Delete notification
   */
  async remove(id: string) {
    const notification = await this.db.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return this.db.notification.delete({
      where: { id },
    });
  }

  /**
   * Helper: Create incident notification
   */
  async notifyIncidentAssigned(
    incidentId: string,
    incidentTitle: string,
    assignedToId: string,
  ) {
    return this.create({
      title: 'งานใหม่ถูกมอบหมาย',
      message: `คุณได้รับมอบหมายให้ดูแลเหตุการณ์: ${incidentTitle}`,
      type: NotificationType.INCIDENT_ASSIGNED,
      priority: NotificationPriority.HIGH,
      relatedEntityType: 'incident',
      relatedEntityId: incidentId,
      userIds: [assignedToId],
    });
  }

  /**
   * Helper: Create task notification
   */
  async notifyTaskAssigned(
    taskId: string,
    taskTitle: string,
    assignedToId: string,
  ) {
    return this.create({
      title: 'งานใหม่ถูกมอบหมาย',
      message: `คุณได้รับมอบหมายงาน: ${taskTitle}`,
      type: NotificationType.TASK_ASSIGNED,
      priority: NotificationPriority.NORMAL,
      relatedEntityType: 'task',
      relatedEntityId: taskId,
      userIds: [assignedToId],
    });
  }

  /**
   * Helper: Notify supervisors about new incident
   */
  async notifyNewIncident(incidentId: string, incidentTitle: string) {
    // Get all supervisors
    const supervisors = await this.db.user.findMany({
      where: {
        role: 'SUPERVISOR',
        isActive: true,
      },
      select: { id: true },
    });

    if (supervisors.length === 0) return null;

    return this.create({
      title: 'เหตุการณ์ใหม่',
      message: `มีเหตุการณ์ใหม่รอการตรวจสอบ: ${incidentTitle}`,
      type: NotificationType.INCIDENT_CREATED,
      priority: NotificationPriority.HIGH,
      relatedEntityType: 'incident',
      relatedEntityId: incidentId,
      userIds: supervisors.map((s) => s.id),
    });
  }

  /**
   * Helper: Notify about report submission
   */
  async notifyReportSubmitted(
    reportId: string,
    reportTitle: string,
    supervisorIds: string[],
  ) {
    return this.create({
      title: 'รายงานใหม่',
      message: `มีรายงานใหม่รอการตรวจสอบ: ${reportTitle}`,
      type: NotificationType.REPORT_SUBMITTED,
      priority: NotificationPriority.NORMAL,
      relatedEntityType: 'report',
      relatedEntityId: reportId,
      userIds: supervisorIds,
    });
  }
}
