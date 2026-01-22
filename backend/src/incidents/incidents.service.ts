import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ActivityLogService } from '../common/services/activity-log.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentStatus, Priority, DisasterType, Role } from '@prisma/client';

@Injectable()
export class IncidentsService {
  constructor(
    private prisma: PrismaService,
    private activityLogService: ActivityLogService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
    @Inject(forwardRef(() => NotificationsGateway))
    private notificationsGateway: NotificationsGateway,
  ) { }

  async create(createIncidentDto: CreateIncidentDto, userId: string) {
    const { severity, ...incidentData } = createIncidentDto;

    // Validate villageId if provided
    if (incidentData.villageId) {
      const villageExists = await this.prisma.village.findUnique({
        where: { id: incidentData.villageId },
      });

      if (!villageExists) {
        throw new BadRequestException(
          `Village with ID ${incidentData.villageId} not found. Please select a valid village.`
        );
      }
    }

    // Map severity (1-5) to Priority if priority is not provided
    let priority = incidentData.priority;
    if (!priority && severity) {
      if (severity >= 5) priority = Priority.CRITICAL;
      else if (severity >= 4) priority = Priority.HIGH;
      else if (severity >= 3) priority = Priority.MEDIUM;
      else priority = Priority.LOW;
    }

    try {
      return await this.prisma.incident.create({
        data: {
          ...incidentData,
          priority: priority || Priority.MEDIUM,
          createdById: userId,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          village: true,
        },
      });
    } catch (error) {
      console.error('❌ Error creating incident:', error);

      // Handle Prisma errors
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Foreign key constraint failed. Invalid villageId or userId.'
        );
      }

      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Duplicate entry. This incident may already exist.'
        );
      }

      // Re-throw other errors
      throw error;
    }
  }

  async findAll(filters?: {
    status?: IncidentStatus;
    priority?: Priority;
    disasterType?: DisasterType;
    villageId?: string;
  }) {
    return this.prisma.incident.findMany({
      where: filters,
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        village: true,
        _count: {
          select: {
            tasks: true,
            surveys: true,
            reports: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        village: true,
        tasks: {
          include: {
            assignedTo: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        surveys: {
          orderBy: {
            completedAt: 'desc',
          },
        },
        reports: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }

    return incident;
  }

  async update(id: string, updateIncidentDto: UpdateIncidentDto, userId: string, userRole: Role) {
    // Check if incident exists
    const incident = await this.prisma.incident.findUnique({
      where: { id },
    });

    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }

    // Authorization: Only creator or SUPERVISOR/EXECUTIVE/ADMIN can update
    const allowedRoles = [Role.SUPERVISOR, Role.EXECUTIVE, Role.ADMIN];
    if (
      incident.createdById !== userId &&
      !allowedRoles.includes(userRole as any)
    ) {
      throw new ForbiddenException('You do not have permission to update this incident');
    }

    return this.prisma.incident.update({
      where: { id },
      data: updateIncidentDto,
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        village: true,
      },
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    // Check if incident exists
    const incident = await this.prisma.incident.findUnique({
      where: { id },
    });

    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }

    // Authorization: Only ADMIN can delete
    if (userRole !== Role.ADMIN) {
      throw new ForbiddenException('Only administrators can delete incidents');
    }

    return this.prisma.incident.delete({
      where: { id },
    });
  }

  async getStatistics() {
    const [total, byStatus, byPriority, byDisasterType, responseTimes] = await Promise.all([
      this.prisma.incident.count(),
      this.prisma.incident.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.prisma.incident.groupBy({
        by: ['priority'],
        _count: true,
      }),
      this.prisma.incident.groupBy({
        by: ['disasterType'],
        _count: true,
      }),
      this.prisma.incident.findMany({
        where: {
          assignedAt: { not: null },
        },
        select: {
          createdAt: true,
          assignedAt: true,
        },
      }),
    ]);

    // Calculate average response time in hours
    let avgResponseTime = 0;
    if (responseTimes.length > 0) {
      const totalDiff = responseTimes.reduce((acc, incident) => {
        if (!incident.assignedAt) return acc; // Skip if assignedAt is null
        const diff = incident.assignedAt.getTime() - incident.createdAt.getTime();
        return acc + diff;
      }, 0);
      avgResponseTime = totalDiff / responseTimes.length / (1000 * 60 * 60); // Convert ms to hours
    }

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count;
        return acc;
      }, {} as Record<IncidentStatus, number>),
      byPriority: byPriority.reduce((acc, item) => {
        acc[item.priority] = item._count;
        return acc;
      }, {} as Record<Priority, number>),
      byDisasterType: byDisasterType.reduce((acc, item) => {
        acc[item.disasterType] = item._count;
        return acc;
      }, {} as Record<DisasterType, number>),
      avgResponseTime: parseFloat(avgResponseTime.toFixed(1)), // Round to 1 decimal place
    };
  }

  async findMyIncidents(userId: string) {
    return this.prisma.incident.findMany({
      where: {
        createdById: userId,
      },
      include: {
        village: true,
        _count: {
          select: {
            tasks: true,
            surveys: true,
            reports: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Supervisor Methods
  async findUnassigned() {
    return this.prisma.incident.findMany({
      where: {
        assignedToId: null,
        status: {
          in: ['PENDING'],
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        village: true,
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async assign(id: string, fieldOfficerId: string, supervisorId: string, notes?: string) {
    // Verify field officer exists and has correct role
    const fieldOfficer = await this.prisma.user.findUnique({
      where: { id: fieldOfficerId },
    });

    if (!fieldOfficer) {
      throw new NotFoundException('Field officer not found');
    }

    if (fieldOfficer.role !== 'FIELD_OFFICER') {
      throw new BadRequestException('User is not a field officer');
    }

    // Update incident
    const incident = await this.prisma.incident.update({
      where: { id },
      data: {
        assignedToId: fieldOfficerId,
        assignedAt: new Date(),
        status: 'IN_PROGRESS',
      },
      include: {
        createdBy: true,
        assignedTo: true,
        village: true,
      },
    });

    // Log activity
    await this.activityLogService.log({
      userId: supervisorId,
      action: 'ASSIGN_INCIDENT',
      entity: 'Incident',
      entityId: id,
      details: {
        fieldOfficerId,
        fieldOfficerName: `${fieldOfficer.firstName} ${fieldOfficer.lastName}`,
        notes,
      },
    });

    // Send notification to field officer
    try {
      const notification = await this.notificationsService.notifyIncidentAssigned(
        incident.id,
        incident.title,
        fieldOfficerId,
      );

      // Send real-time notification via WebSocket
      if (notification) {
        this.notificationsGateway.sendToUser(fieldOfficerId, {
          ...notification.notification,
          userNotification: notification.userNotifications[0],
        });
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
      // Don't fail the assignment if notification fails
    }

    return incident;
  }

  async review(id: string, reviewData: any, supervisorId: string) {
    const incident = await this.prisma.incident.update({
      where: { id },
      data: {
        status: reviewData.status,
        reviewNotes: reviewData.reviewNotes,
        reviewedAt: new Date(),
        reviewedById: supervisorId,
      },
      include: {
        createdBy: true,
        assignedTo: true,
        reviewedBy: true,
        village: true,
      },
    });

    // Log activity
    await this.activityLogService.log({
      userId: supervisorId,
      action: 'REVIEW_INCIDENT',
      entity: 'Incident',
      entityId: id,
      details: {
        status: reviewData.status,
        reviewNotes: reviewData.reviewNotes,
        additionalNotes: reviewData.additionalNotes,
      },
    });

    return incident;
  }
}