import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { TaskStatus } from './dto/create-task.dto';
import { UpdateSurveyDataDto } from './dto/update-survey-data.dto';

// Create mock implementations
const mockPrisma: any = {
  task: {
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
  incident: {
    findUnique: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

const mockNotificationsService: Partial<NotificationsService> = {
  notifyTaskAssigned: jest.fn(),
};

const mockNotificationsGateway: Partial<NotificationsGateway> = {
  sendToUser: jest.fn(),
};

describe('TasksService - acceptTask & updateSurveyData', () => {
  let service: TasksService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TasksService(
      mockPrisma as unknown as PrismaService,
      mockNotificationsService as NotificationsService,
      mockNotificationsGateway as NotificationsGateway,
    );
  });

  describe('acceptTask', () => {
    it('should accept task when assigned and in PENDING status', async () => {
      const taskId = 'task-1';
      const userId = 'user-1';
      const task = { id: taskId, assignedToId: userId, status: TaskStatus.PENDING };

      mockPrisma.task.findUnique.mockResolvedValue(task);
      mockPrisma.task.update.mockResolvedValue({ ...task, status: TaskStatus.IN_PROGRESS });
      jest.spyOn(service, 'findOne').mockResolvedValue({ id: taskId, status: TaskStatus.IN_PROGRESS } as any);

      const result = await service.acceptTask(taskId, userId);

      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({ where: { id: taskId } });
      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: { status: TaskStatus.IN_PROGRESS },
      });
      expect(result).toEqual({ id: taskId, status: TaskStatus.IN_PROGRESS });
    });

    it('should throw NotFoundException if task not found', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await expect(service.acceptTask('missing', 'user-1')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw ForbiddenException if user not assigned to task', async () => {
      const task = { id: 'task-1', assignedToId: 'other-user', status: TaskStatus.PENDING };
      mockPrisma.task.findUnique.mockResolvedValue(task);

      await expect(service.acceptTask('task-1', 'user-1')).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should throw BadRequestException if task status is not PENDING', async () => {
      const task = { id: 'task-1', assignedToId: 'user-1', status: TaskStatus.IN_PROGRESS };
      mockPrisma.task.findUnique.mockResolvedValue(task);

      await expect(service.acceptTask('task-1', 'user-1'))
        .rejects
        .toThrow(new BadRequestException('Task is not in PENDING status'));
    });
  });

  describe('updateSurveyData', () => {
    it('should update survey data and set status to SURVEYED when IN_PROGRESS', async () => {
      const taskId = 'task-2';
      const userId = 'user-2';
      const task = { id: taskId, assignedToId: userId, status: TaskStatus.IN_PROGRESS };
      const surveyData: UpdateSurveyDataDto = {
        surveyNotes: 'พบสภาพพื้นดินแห้ง',
        surveyPhotos: ['https://example.com/photo1.jpg'],
      };

      mockPrisma.task.findUnique.mockResolvedValue(task);
      mockPrisma.task.update.mockResolvedValue({ ...task, status: TaskStatus.SURVEYED });
      jest.spyOn(service, 'findOne').mockResolvedValue({ id: taskId, status: TaskStatus.SURVEYED } as any);

      const result = await service.updateSurveyData(taskId, userId, surveyData);

      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({ where: { id: taskId } });
      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: expect.objectContaining({
          status: TaskStatus.SURVEYED,
          surveyNotes: surveyData.surveyNotes,
          surveyPhotos: surveyData.surveyPhotos,
        }),
      });
      expect(result).toEqual({ id: taskId, status: TaskStatus.SURVEYED });
    });

    it('should throw NotFoundException if task not found', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);
      await expect(service.updateSurveyData('missing', 'user-2', { surveyNotes: 'x' }))
        .rejects
        .toBeInstanceOf(NotFoundException);
    });

    it('should throw ForbiddenException if user not assigned to task', async () => {
      const task = { id: 'task-2', assignedToId: 'other-user', status: TaskStatus.IN_PROGRESS };
      mockPrisma.task.findUnique.mockResolvedValue(task);

      await expect(service.updateSurveyData('task-2', 'user-2', { surveyNotes: 'x' }))
        .rejects
        .toBeInstanceOf(ForbiddenException);
    });

    it('should throw BadRequestException if task status is not IN_PROGRESS', async () => {
      const task = { id: 'task-2', assignedToId: 'user-2', status: TaskStatus.PENDING };
      mockPrisma.task.findUnique.mockResolvedValue(task);

      await expect(service.updateSurveyData('task-2', 'user-2', { surveyNotes: 'x' }))
        .rejects
        .toThrow(new BadRequestException('Task must be in IN_PROGRESS status to submit survey data'));
    });
  });
});