import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export interface CreateAuditLogDto {
  userId: string;
  username: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogFilterDto {
  userId?: string;
  action?: string;
  targetType?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  /**
   * สร้าง Audit Log
   */
  async create(data: CreateAuditLogDto) {
    return this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        username: data.username,
        action: data.action,
        targetType: data.targetType,
        targetId: data.targetId,
        details: data.details || null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  /**
   * ดึง Audit Logs พร้อม Filter
   */
  async findAll(filter: AuditLogFilterDto = {}) {
    const {
      userId,
      action,
      targetType,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = filter;

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (action) {
      where.action = action;
    }

    if (targetType) {
      where.targetType = targetType;
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * ดึง Audit Log ตาม ID
   */
  async findOne(id: string) {
    return this.prisma.auditLog.findUnique({
      where: { id },
    });
  }

  /**
   * Export Audit Logs เป็น CSV format
   */
  async exportToCsv(filter: AuditLogFilterDto = {}): Promise<string> {
    const { data } = await this.findAll({ ...filter, limit: 10000 });

    const headers = [
      'ID',
      'User ID',
      'Username',
      'Action',
      'Target Type',
      'Target ID',
      'IP Address',
      'Created At',
    ];

    const rows = data.map((log) => [
      log.id,
      log.userId,
      log.username,
      log.action,
      log.targetType || '',
      log.targetId || '',
      log.ipAddress || '',
      log.createdAt.toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    return csvContent;
  }

  /**
   * ดึงสถิติ Audit Logs
   */
  async getStats() {
    const [total, byAction, last24Hours] = await Promise.all([
      this.prisma.auditLog.count(),
      this.prisma.auditLog.groupBy({
        by: ['action'],
        _count: true,
        orderBy: {
          _count: {
            action: 'desc',
          },
        },
        take: 10,
      }),
      this.prisma.auditLog.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      total,
      last24Hours,
      byAction: byAction.map((item) => ({
        action: item.action,
        count: item._count,
      })),
    };
  }
}
