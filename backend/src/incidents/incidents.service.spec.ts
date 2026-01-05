import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsService } from './incidents.service';
import { PrismaService } from '../database/prisma.service';
import { ActivityLogService } from '../common/services/activity-log.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Role, IncidentStatus, Priority, DisasterType } from '@prisma/client';

describe('IncidentsService', () => {
  let service: IncidentsService;
  let prisma: PrismaService;

  const mockPrisma = {
    incident: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockActivityLogService = {
    log: jest.fn(),
  };

  const mockNotificationsService = {
    notifyIncidentAssigned: jest.fn(),
  };

  const mockNotificationsGateway = {
    sendToUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ActivityLogService, useValue: mockActivityLogService },
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: NotificationsGateway, useValue: mockNotificationsGateway },
      ],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create incident with location and photos', async () => {
      const createDto = {
        title: 'Flood Emergency',
        disasterType: DisasterType.FLOOD,
        priority: Priority.HIGH,
        description: 'Severe flooding',
        location: { type: 'Point' as const, coordinates: [99.0, 19.0] as [number, number] },
        images: ['/uploads/photo1.jpg', '/uploads/photo2.jpg'],
        villageId: 'village-1',
      };

      mockPrisma.incident.create.mockResolvedValue({
        id: 'incident-1',
        ...createDto,
        createdById: 'user-1',
      });

      const result = await service.create(createDto, 'user-1');

      expect(result).toHaveProperty('id');
      expect(mockPrisma.incident.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...createDto,
          createdById: 'user-1',
        }),
        include: expect.any(Object),
      });
    });
  });

  describe('findAll', () => {
    it('should return all incidents with filters', async () => {
      const mockIncidents = [
        { id: 'incident-1', title: 'Flood' },
        { id: 'incident-2', title: 'Fire' },
      ];

      mockPrisma.incident.findMany.mockResolvedValue(mockIncidents);

      const result = await service.findAll({
        status: IncidentStatus.PENDING,
        priority: Priority.HIGH,
      });

      expect(result).toEqual(mockIncidents);
      expect(mockPrisma.incident.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            status: IncidentStatus.PENDING,
            priority: Priority.HIGH,
          },
        })
      );
    });
  });

  describe('findOne', () => {
    it('should return incident with full details', async () => {
      const mockIncident = {
        id: 'incident-1',
        title: 'Test',
        createdBy: {},
        village: {},
        tasks: [],
        surveys: [],
        reports: [],
      };

      mockPrisma.incident.findUnique.mockResolvedValue(mockIncident);

      const result = await service.findOne('incident-1');

      expect(result).toEqual(mockIncident);
    });

    it('should throw NotFoundException if incident not found', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should update incident if user is creator', async () => {
      const mockIncident = {
        id: 'incident-1',
        createdById: 'user-1',
        status: IncidentStatus.PENDING,
      };

      const updateDto = {
        status: IncidentStatus.IN_PROGRESS,
        description: 'Updated',
      };

      mockPrisma.incident.findUnique.mockResolvedValue(mockIncident);
      mockPrisma.incident.update.mockResolvedValue({
        ...mockIncident,
        ...updateDto,
      });

      const result = await service.update(
        'incident-1',
        updateDto,
        'user-1',
        Role.FIELD_OFFICER
      );

      expect(result.status).toBe(IncidentStatus.IN_PROGRESS);
    });

    it('should allow SUPERVISOR to update any incident', async () => {
      const mockIncident = {
        id: 'incident-1',
        createdById: 'other-user',
      };

      mockPrisma.incident.findUnique.mockResolvedValue(mockIncident);
      mockPrisma.incident.update.mockResolvedValue(mockIncident);

      await service.update('incident-1', {}, 'supervisor-1', Role.SUPERVISOR);

      expect(mockPrisma.incident.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const mockIncident = {
        id: 'incident-1',
        createdById: 'other-user',
      };

      mockPrisma.incident.findUnique.mockResolvedValue(mockIncident);

      await expect(
        service.update('incident-1', {}, 'user-1', Role.FIELD_OFFICER)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete incident if user is ADMIN', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue({ id: 'incident-1' });
      mockPrisma.incident.delete.mockResolvedValue({ id: 'incident-1' });

      const result = await service.remove('incident-1', 'admin-1', Role.ADMIN);

      expect(result).toHaveProperty('id');
      expect(mockPrisma.incident.delete).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not ADMIN', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue({ id: 'incident-1' });

      await expect(
        service.remove('incident-1', 'user-1', Role.FIELD_OFFICER)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getStatistics', () => {
    it('should return incident statistics', async () => {
      mockPrisma.incident.count.mockResolvedValue(10);
      mockPrisma.incident.groupBy
        .mockResolvedValueOnce([
          { status: IncidentStatus.PENDING, _count: 3 },
          { status: IncidentStatus.IN_PROGRESS, _count: 5 },
        ])
        .mockResolvedValueOnce([
          { priority: Priority.HIGH, _count: 4 },
          { priority: Priority.MEDIUM, _count: 6 },
        ])
        .mockResolvedValueOnce([
          { disasterType: DisasterType.FLOOD, _count: 7 },
          { disasterType: DisasterType.FIRE, _count: 3 },
        ]);

      const result = await service.getStatistics();

      expect(result.total).toBe(10);
      expect(result.byStatus).toHaveProperty(IncidentStatus.PENDING);
      expect(result.byPriority).toHaveProperty(Priority.HIGH);
      expect(result.byDisasterType).toHaveProperty(DisasterType.FLOOD);
    });
  });

  describe('findMyIncidents', () => {
    it('should return incidents created by user', async () => {
      const mockIncidents = [
        { id: 'incident-1', createdById: 'user-1' },
        { id: 'incident-2', createdById: 'user-1' },
      ];

      mockPrisma.incident.findMany.mockResolvedValue(mockIncidents);

      const result = await service.findMyIncidents('user-1');

      expect(result).toEqual(mockIncidents);
      expect(mockPrisma.incident.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { createdById: 'user-1' },
        })
      );
    });
  });

  describe('findUnassigned', () => {
    it('should return unassigned pending incidents', async () => {
      const mockIncidents = [
        { id: 'incident-1', assignedToId: null, status: IncidentStatus.PENDING },
      ];

      mockPrisma.incident.findMany.mockResolvedValue(mockIncidents);

      const result = await service.findUnassigned();

      expect(result).toEqual(mockIncidents);
      expect(mockPrisma.incident.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            assignedToId: null,
            status: { in: ['PENDING'] },
          },
        })
      );
    });
  });

  describe('assign', () => {
    it('should assign incident to field officer', async () => {
      const mockFieldOfficer = {
        id: 'officer-1',
        role: Role.FIELD_OFFICER,
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockIncident = {
        id: 'incident-1',
        assignedToId: 'officer-1',
        status: IncidentStatus.IN_PROGRESS,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockFieldOfficer);
      mockPrisma.incident.update.mockResolvedValue(mockIncident);
      mockNotificationsService.notifyIncidentAssigned.mockResolvedValue({
        notification: {},
        userNotifications: [{}],
      });

      const result = await service.assign(
        'incident-1',
        'officer-1',
        'supervisor-1',
        'Please handle this'
      );

      expect(result.assignedToId).toBe('officer-1');
      expect(result.status).toBe(IncidentStatus.IN_PROGRESS);
      expect(mockActivityLogService.log).toHaveBeenCalled();
      expect(mockNotificationsService.notifyIncidentAssigned).toHaveBeenCalled();
    });

    it('should throw NotFoundException if field officer not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.assign('incident-1', 'invalid-id', 'supervisor-1')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user is not field officer', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        role: Role.SUPERVISOR,
      });

      await expect(
        service.assign('incident-1', 'user-1', 'supervisor-1')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('review', () => {
    it('should review incident and update status', async () => {
      const reviewData = {
        status: IncidentStatus.RESOLVED,
        reviewNotes: 'Handled well',
      };

      mockPrisma.incident.update.mockResolvedValue({
        id: 'incident-1',
        ...reviewData,
        reviewedById: 'supervisor-1',
      });

      const result = await service.review('incident-1', reviewData, 'supervisor-1');

      expect(result.status).toBe(IncidentStatus.RESOLVED);
      expect(result.reviewNotes).toBe('Handled well');
      expect(mockActivityLogService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'REVIEW_INCIDENT',
        })
      );
    });
  });
});
