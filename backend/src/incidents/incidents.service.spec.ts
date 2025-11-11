import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsService } from './incidents.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('IncidentsService', () => {
  let service: IncidentsService;
  let prisma: PrismaService;

  const mockIncident = {
    id: '1',
    type: 'FLOOD',
    location: { type: 'Point', coordinates: [99.2333, 19.9167] },
    status: 'PENDING',
    severity: 'MEDIUM',
    description: 'Test incident',
    createdById: 'user-1',
    assignedToId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    incident: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new incident', async () => {
      const createDto = {
        type: 'FLOOD',
        location: { lat: 19.9167, lng: 99.2333 },
        severity: 'MEDIUM',
        description: 'Test incident',
      };

      mockPrismaService.incident.create.mockResolvedValue(mockIncident);

      const result = await service.create(createDto, 'user-1');

      expect(result).toEqual(mockIncident);
      expect(mockPrismaService.incident.create).toHaveBeenCalled();
    });
  });

  describe('findMyIncidents', () => {
    it('should return incidents created by user', async () => {
      const incidents = [mockIncident];
      mockPrismaService.incident.findMany.mockResolvedValue(incidents);

      const result = await service.findMyIncidents('user-1');

      expect(result).toEqual(incidents);
      expect(mockPrismaService.incident.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { createdById: 'user-1' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return an incident by id', async () => {
      mockPrismaService.incident.findUnique.mockResolvedValue(mockIncident);

      const result = await service.findOne('1');

      expect(result).toEqual(mockIncident);
      expect(mockPrismaService.incident.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1' },
        }),
      );
    });

    it('should throw NotFoundException when incident not found', async () => {
      mockPrismaService.incident.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an incident when user is the creator', async () => {
      const updateDto = {
        status: 'IN_PROGRESS',
        description: 'Updated description',
      };

      const updatedIncident = {
        ...mockIncident,
        ...updateDto,
      };

      mockPrismaService.incident.findUnique.mockResolvedValue(mockIncident);
      mockPrismaService.incident.update.mockResolvedValue(updatedIncident);

      const result = await service.update('1', updateDto, 'user-1', 'FIELD_OFFICER');

      expect(result).toEqual(updatedIncident);
      expect(mockPrismaService.incident.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not the creator', async () => {
      const updateDto = { status: 'IN_PROGRESS' };

      mockPrismaService.incident.findUnique.mockResolvedValue(mockIncident);

      await expect(
        service.update('1', updateDto, 'other-user', 'FIELD_OFFICER'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('assign', () => {
    it('should assign incident to a user (Supervisor only)', async () => {
      const assignedIncident = {
        ...mockIncident,
        assignedToId: 'user-2',
        status: 'IN_PROGRESS',
      };

      mockPrismaService.incident.findUnique.mockResolvedValue(mockIncident);
      mockPrismaService.incident.update.mockResolvedValue(assignedIncident);

      const result = await service.assign('1', 'user-2', 'SUPERVISOR');

      expect(result).toEqual(assignedIncident);
      expect(mockPrismaService.incident.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not Supervisor', async () => {
      await expect(
        service.assign('1', 'user-2', 'FIELD_OFFICER'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
