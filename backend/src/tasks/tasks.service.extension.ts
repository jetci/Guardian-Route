import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TaskStatus } from './dto/create-task.dto';
import { UpdateSurveyDataDto } from './dto/update-survey-data.dto';

/**
 * Extension methods for TasksService
 * Add these methods to the main TasksService class
 */

export class TasksServiceExtension {
  constructor(private prisma: PrismaService) {}

  /**
   * Accept a task (Field Officer accepts assigned task)
   */
  async acceptTask(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if user is assigned to this task
    if (task.assignedToId !== userId) {
      throw new ForbiddenException('You are not assigned to this task');
    }

    // Check if task is in PENDING status
    if (task.status !== TaskStatus.PENDING) {
      throw new BadRequestException(
        `Cannot accept task with status: ${task.status}. Only PENDING tasks can be accepted.`,
      );
    }

    // Update status to IN_PROGRESS
    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.IN_PROGRESS,
      },
    });

    return this.getTaskWithRelations(updatedTask.id);
  }

  /**
   * Update survey data (Field Officer submits field survey data)
   */
  async updateSurveyData(taskId: string, userId: string, surveyData: UpdateSurveyDataDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if user is assigned to this task
    if (task.assignedToId !== userId) {
      throw new ForbiddenException('You are not assigned to this task');
    }

    // Check if task is in IN_PROGRESS status
    if (task.status !== TaskStatus.IN_PROGRESS) {
      throw new BadRequestException(
        `Cannot update survey data for task with status: ${task.status}. Task must be IN_PROGRESS.`,
      );
    }

    // Prepare update data
    const updateData: any = {
      surveyedAt: new Date(),
      status: TaskStatus.SURVEYED,
    };

    if (surveyData.surveyNotes) {
      updateData.surveyNotes = surveyData.surveyNotes;
    }

    if (surveyData.surveyPhotos && surveyData.surveyPhotos.length > 0) {
      updateData.surveyPhotos = surveyData.surveyPhotos;
    }

    // Handle geometry data (Point and Polygon)
    if (surveyData.surveyLocation) {
      // Convert GeoJSON to PostGIS format
      const { coordinates } = surveyData.surveyLocation;
      updateData.surveyLocation = this.prisma.$queryRawUnsafe(
        `ST_SetSRID(ST_MakePoint($1, $2), 4326)`,
        coordinates[0],
        coordinates[1],
      );
    }

    if (surveyData.surveyArea) {
      // Convert GeoJSON Polygon to PostGIS format
      const { coordinates } = surveyData.surveyArea;
      const wkt = this.polygonToWKT(coordinates);
      updateData.surveyArea = this.prisma.$queryRawUnsafe(
        `ST_GeomFromText($1, 4326)`,
        wkt,
      );
    }

    // Update task
    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return this.getTaskWithRelations(updatedTask.id);
  }

  /**
   * Get my tasks (tasks assigned to current user)
   */
  async getMyTasks(userId: string, status?: TaskStatus) {
    const where: any = {
      assignedToId: userId,
    };

    if (status) {
      where.status = status;
    }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: [
        { status: 'asc' }, // PENDING first
        { createdAt: 'desc' },
      ],
    });

    return Promise.all(
      tasks.map((task) => this.getTaskWithRelations(task.id)),
    );
  }

  /**
   * Helper: Get task with all relations
   */
  private async getTaskWithRelations(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const [incident, assignedTo, createdBy, village] = await Promise.all([
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
          images: true,
        },
      }),
      task.assignedToId
        ? this.prisma.user.findUnique({
            where: { id: task.assignedToId },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          })
        : null,
      this.prisma.user.findUnique({
        where: { id: task.createdById },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      }),
      task.villageId
        ? this.prisma.village.findUnique({
            where: { id: task.villageId },
            select: {
              id: true,
              villageNo: true,
              name: true,
              centerPoint: true,
            },
          })
        : null,
    ]);

    return {
      ...task,
      incident,
      assignedTo,
      createdBy,
      village,
    };
  }

  /**
   * Helper: Convert GeoJSON Polygon coordinates to WKT format
   */
  private polygonToWKT(coordinates: number[][][]): string {
    const rings = coordinates.map((ring) => {
      const points = ring.map((point) => `${point[0]} ${point[1]}`).join(', ');
      return `(${points})`;
    });
    return `POLYGON(${rings.join(', ')})`;
  }
}
