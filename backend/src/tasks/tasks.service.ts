import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { CreateTaskDto, TaskStatus } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateSurveyDataDto } from './dto/update-survey-data.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
    @Inject(forwardRef(() => NotificationsGateway))
    private notificationsGateway: NotificationsGateway,
  ) {}

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

    // Send notification if task is assigned
    if (createTaskDto.assignedToId) {
      try {
        const notification = await this.notificationsService.notifyTaskAssigned(
          task.id,
          task.title,
          createTaskDto.assignedToId,
        );
        
        // Send real-time notification via WebSocket
        if (notification) {
          this.notificationsGateway.sendToUser(createTaskDto.assignedToId, {
            ...notification.notification,
            userNotification: notification.userNotifications[0],
          });
        }
      } catch (error) {
        console.error('Failed to send notification:', error);
        // Don't fail the task creation if notification fails
      }
    }

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

  async getMyTasks(userId: string, status?: TaskStatus) {
    const where: any = {
      assignedToId: userId,
    };

    if (status) {
      where.status = status;
    }

    return this.findAll(where);
  }

  async acceptTask(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.assignedToId !== userId) {
      throw new ForbiddenException('You are not assigned to this task');
    }

    if (task.status !== TaskStatus.PENDING) {
      throw new BadRequestException('Task is not in PENDING status');
    }

    await this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.IN_PROGRESS,
      },
    });

    return this.findOne(taskId);
  }

  async updateSurveyData(taskId: string, userId: string, surveyData: UpdateSurveyDataDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.assignedToId !== userId) {
      throw new ForbiddenException('You are not assigned to this task');
    }

    if (task.status !== TaskStatus.IN_PROGRESS) {
      throw new BadRequestException('Task must be in IN_PROGRESS status to submit survey data');
    }

    await this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.SURVEYED,
        surveyedAt: new Date(),
        surveyNotes: surveyData.surveyNotes,
        surveyPhotos: surveyData.surveyPhotos || [],
      },
    });

    return this.findOne(taskId);
  }
}
