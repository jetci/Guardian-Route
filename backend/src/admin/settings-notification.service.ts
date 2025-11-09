import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SettingsNotificationService {
  constructor(private prisma: PrismaService) {}

  /**
   * สร้างการแจ้งเตือนเมื่อมีการเปลี่ยน Settings
   */
  async createNotification(data: {
    settingKey: string;
    oldValue: any;
    newValue: any;
    changedBy: string;
  }) {
    // ดึง Admin users ทั้งหมด (ยกเว้นคนที่เปลี่ยน)
    const adminUsers = await this.prisma.user.findMany({
      where: {
        role: 'ADMIN',
        isActive: true,
        id: { not: data.changedBy },
      },
      select: { id: true },
    });

    const notifiedTo = adminUsers.map((user) => user.id);

    return this.prisma.settingsNotification.create({
      data: {
        settingKey: data.settingKey,
        oldValue: data.oldValue,
        newValue: data.newValue,
        changedBy: data.changedBy,
        notifiedTo,
      },
    });
  }

  /**
   * ดึงการแจ้งเตือนของผู้ใช้
   */
  async getNotifications(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      unreadOnly?: boolean;
    },
  ) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      notifiedTo: { has: userId },
    };

    if (options?.unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.settingsNotification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.settingsNotification.count({ where }),
      this.prisma.settingsNotification.count({
        where: {
          notifiedTo: { has: userId },
          isRead: false,
        },
      }),
    ]);

    return {
      data: notifications,
      total,
      unreadCount,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * ทำเครื่องหมายว่าอ่านแล้ว
   */
  async markAsRead(notificationId: string) {
    return this.prisma.settingsNotification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  /**
   * ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว
   */
  async markAllAsRead(userId: string) {
    const notifications = await this.prisma.settingsNotification.findMany({
      where: {
        notifiedTo: { has: userId },
        isRead: false,
      },
    });

    await Promise.all(
      notifications.map((notification) =>
        this.prisma.settingsNotification.update({
          where: { id: notification.id },
          data: { isRead: true },
        }),
      ),
    );

    return { updated: notifications.length };
  }

  /**
   * ลบการแจ้งเตือน
   */
  async deleteNotification(notificationId: string) {
    return this.prisma.settingsNotification.delete({
      where: { id: notificationId },
    });
  }

  /**
   * ลบการแจ้งเตือนเก่า (เก็บไว้แค่ 30 วัน)
   */
  async cleanupOldNotifications(daysToKeep = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const deleted = await this.prisma.settingsNotification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    });

    return { deleted: deleted.count };
  }

  /**
   * ดึงสถิติการแจ้งเตือน
   */
  async getNotificationStats(userId: string) {
    const [total, unread, bySettingKey] = await Promise.all([
      this.prisma.settingsNotification.count({
        where: { notifiedTo: { has: userId } },
      }),
      this.prisma.settingsNotification.count({
        where: {
          notifiedTo: { has: userId },
          isRead: false,
        },
      }),
      this.prisma.settingsNotification.groupBy({
        by: ['settingKey'],
        where: { notifiedTo: { has: userId } },
        _count: true,
      }),
    ]);

    return {
      total,
      unread,
      read: total - unread,
      bySettingKey: bySettingKey.map((item) => ({
        settingKey: item.settingKey,
        count: item._count,
      })),
    };
  }

  /**
   * ส่งอีเมลแจ้งเตือน (placeholder - ต้องเชื่อมต่อกับ email service)
   */
  async sendEmailNotification(
    userId: string,
    notification: {
      settingKey: string;
      oldValue: any;
      newValue: any;
      changedBy: string;
    },
  ) {
    // TODO: Implement email sending
    // ใช้ NodeMailer หรือ SendGrid
    console.log('Sending email notification to user:', userId);
    console.log('Notification:', notification);

    return { sent: true };
  }
}
