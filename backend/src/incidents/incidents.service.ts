import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentStatus, Priority, DisasterType, Role } from '@prisma/client';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  async create(createIncidentDto: CreateIncidentDto, userId: string) {
    return this.prisma.incident.create({
      data: {
        ...createIncidentDto,
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
            surveyedAt: 'desc',
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
    const [total, byStatus, byPriority, byDisasterType] = await Promise.all([
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
    ]);

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
    };
  }
}
