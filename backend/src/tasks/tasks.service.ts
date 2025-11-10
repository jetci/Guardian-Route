import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTaskDto, TaskStatus } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, createdById: string) {
    // Verify incident exists
    const incident = await this.prisma.incident.findUnique({
      where: { id: createTaskDto.incidentId },
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    // Verify assigned user exists if provided
    if (createTaskDto.assignedToId) {
      const user = await this.prisma.user.findUnique({
        where: { id: createTaskDto.assignedToId },
      });

      if (!user) {
        throw new NotFoundException('Assigned user not found');
      }
    }

    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        status: TaskStatus.PENDING,
        createdById,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
      },
    });

    return this.findOne(task.id);
  }

  async findAll(filters: {
    status?: TaskStatus;
    priority?: string;
    incidentId?: string;
    assignedToId?: string;
  }) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    if (filters.incidentId) {
      where.incidentId = filters.incidentId;
    }

    if (filters.assignedToId) {
      where.assignedToId = filters.assignedToId;
    }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Fetch related data separately
    const tasksWithRelations = await Promise.all(
      tasks.map(async (task) => {
        const [incident, assignedTo, createdBy] = await Promise.all([
          this.prisma.incident.findUnique({
            where: { id: task.incidentId },
            select: { id: true, title: true, status: true, disasterType: true },
          }),
          task.assignedToId
            ? this.prisma.user.findUnique({
                where: { id: task.assignedToId },
                select: { id: true, email: true, firstName: true, lastName: true, role: true },
              })
            : null,
          this.prisma.user.findUnique({
            where: { id: task.createdById },
            select: { id: true, email: true, firstName: true, lastName: true, role: true },
          }),
        ]);

        return { ...task, incident, assignedTo, createdBy };
      })
    );

    return tasksWithRelations;
  }

  async assignTask(taskId: string, officerId: string, supervisorId: string) {
    // Verify task exists and is in PENDING_ASSIGNMENT status
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.status !== 'PENDING_ASSIGNMENT') {
      throw new BadRequestException('Task is not in PENDING_ASSIGNMENT status');
    }

    // Verify officer exists and is a field officer
    const officer = await this.prisma.user.findUnique({
      where: { id: officerId },
    });

    if (!officer) {
      throw new NotFoundException('Officer not found');
    }

    if (officer.role !== 'FIELD_OFFICER') {
      throw new BadRequestException('User is not a field officer');
    }

    if (!officer.isActive) {
      throw new BadRequestException('Officer is not active');
    }

    // Check officer's current task count
    const currentTaskCount = await this.prisma.task.count({
      where: {
        assignedToId: officerId,
        status: {
          in: ['IN_PROGRESS', 'SURVEYED'],
        },
      },
    });

    if (currentTaskCount >= 5) {
      throw new BadRequestException('Officer has reached maximum task limit');
    }

    // Update task
    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        assignedToId: officerId,
        status: 'IN_PROGRESS',
        updatedAt: new Date(),
      },
    });

    // TODO: Create audit log entry
    // await this.createAuditLog({
    //   action: 'TASK_ASSIGNED',
    //   taskId,
    //   userId: supervisorId,
    //   metadata: { officerId, previousStatus: task.status },
    // });

    return this.findOne(updatedTask.id);
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const [incident, assignedTo, createdBy] = await Promise.all([
      this.prisma.incident.findUnique({
        where: { id: task.incidentId },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          disasterType: true,
          priority: true,
          location: true,
          address: true,
        },
      }),
      task.assignedToId
        ? this.prisma.user.findUnique({
            where: { id: task.assignedToId },
            select: { id: true, email: true, firstName: true, lastName: true, role: true },
          })
        : null,
      this.prisma.user.findUnique({
        where: { id: task.createdById },
        select: { id: true, email: true, firstName: true, lastName: true, role: true },
      }),
    ]);

    return { ...task, incident, assignedTo, createdBy };
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string, userRole: string) {
    const taskData = await this.prisma.task.findUnique({ where: { id } });
    
    if (!taskData) {
      throw new NotFoundException('Task not found');
    }

    // Authorization: creator, assigned user, or SUPERVISOR/EXECUTIVE/ADMIN can update
    const canUpdate =
      taskData.createdById === userId ||
      taskData.assignedToId === userId ||
      ['SUPERVISOR', 'EXECUTIVE', 'ADMIN'].includes(userRole);

    if (!canUpdate) {
      throw new ForbiddenException('You do not have permission to update this task');
    }

    await this.prisma.task.update({
      where: { id },
      data: {
        ...updateTaskDto,
        dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : undefined,
      },
    });

    return this.findOne(id);
  }

  async remove(id: string, userRole: string) {
    await this.findOne(id);

    // Only ADMIN can delete tasks
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can delete tasks');
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async getSupervisorView(filters: {
    status?: string;
    priority?: string;
    incidentType?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        where.createdAt.lte = new Date(filters.dateTo);
      }
    }

    // Fetch tasks with incident filter
    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Fetch related data and filter by incident type if needed
    const tasksWithRelations = await Promise.all(
      tasks.map(async (task) => {
        const [incident, assignedTo, reports] = await Promise.all([
          this.prisma.incident.findUnique({
            where: { id: task.incidentId },
            select: {
              id: true,
              title: true,
              disasterType: true,
              location: true,
              address: true,
            },
          }),
          task.assignedToId
            ? this.prisma.user.findUnique({
                where: { id: task.assignedToId },
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  phone: true,
                },
              })
            : null,
          this.prisma.report.findMany({
            where: { taskId: task.id },
            select: { id: true, status: true },
          }),
        ]);

        // Skip if incident type filter doesn't match
        if (filters.incidentType && incident?.disasterType !== filters.incidentType) {
          return null;
        }

        const hasReport = reports.length > 0;
        const reportStatus = reports[0]?.status;

        return {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          incident: incident
            ? {
                id: incident.id,
                type: incident.disasterType,
                location: {
                  lat: incident.location ? (incident.location as any).lat : 0,
                  lng: incident.location ? (incident.location as any).lng : 0,
                  address: incident.address || '',
                  village: incident.address?.split(',')[0] || '',
                },
              }
            : null,
          assignedTo: assignedTo
            ? {
                id: assignedTo.id,
                name: `${assignedTo.firstName} ${assignedTo.lastName}`,
                phone: assignedTo.phone || '',
              }
            : null,
          hasReport,
          reportStatus,
        };
      })
    );

    // Filter out null values (tasks that didn't match incident type)
    const filteredTasks = tasksWithRelations.filter(task => task !== null);

    // Calculate summary
    const summary = {
      total: filteredTasks.length,
      byStatus: {
        PENDING_ASSIGNMENT: filteredTasks.filter(t => t.status === 'PENDING_ASSIGNMENT').length,
        IN_PROGRESS: filteredTasks.filter(t => t.status === 'IN_PROGRESS').length,
        SURVEYED: filteredTasks.filter(t => t.status === 'SURVEYED').length,
        COMPLETED: filteredTasks.filter(t => t.status === 'COMPLETED').length,
      },
      byPriority: {
        HIGH: filteredTasks.filter(t => t.priority === 'HIGH').length,
        MEDIUM: filteredTasks.filter(t => t.priority === 'MEDIUM').length,
        LOW: filteredTasks.filter(t => t.priority === 'LOW').length,
      },
    };

    return {
      tasks: filteredTasks,
      summary,
    };
  }

  async getStatistics() {
    const total = await this.prisma.task.count();

    const pending = await this.prisma.task.count({ where: { status: TaskStatus.PENDING } });
    const inProgress = await this.prisma.task.count({ where: { status: TaskStatus.IN_PROGRESS } });
    const completed = await this.prisma.task.count({ where: { status: TaskStatus.COMPLETED } });
    const cancelled = await this.prisma.task.count({ where: { status: TaskStatus.CANCELLED } });

    return {
      total,
      byStatus: {
        PENDING: pending,
        IN_PROGRESS: inProgress,
        COMPLETED: completed,
        CANCELLED: cancelled,
      },
    };
  }
}
