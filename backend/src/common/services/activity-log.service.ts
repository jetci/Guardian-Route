import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface LogActivityParams {
  userId: string;
  action: string;
  entity?: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  async log(params: LogActivityParams) {
    try {
      await this.prisma.activityLog.create({
        data: {
          userId: params.userId,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId,
          details: params.details,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    } catch (error) {
      // Log error but don't throw to avoid breaking main flow
      console.error('Failed to log activity:', error);
    }
  }

  async getActivityLogs(filters?: {
    userId?: string;
    action?: string;
    entity?: string;
    entityId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    const where: any = {};

    if (filters?.userId) where.userId = filters.userId;
    if (filters?.action) where.action = filters.action;
    if (filters?.entity) where.entity = filters.entity;
    if (filters?.entityId) where.entityId = filters.entityId;

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    return this.prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 100,
    });
  }
}
