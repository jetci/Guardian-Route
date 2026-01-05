import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { PrismaService } from '../database/prisma.service';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ReportStatus, ReportType, Role } from '@prisma/client';

describe('ReportService', () => {
  let service: ReportService;
  let prisma: PrismaService;

  const mockPrisma = {
    report: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
      aggregate: jest.fn(),
    },
    incident: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an INCIDENT report successfully', async () => {
      const dto = {
        type: ReportType.INCIDENT,
        incidentId: 'incident-1',
        title: 'Flood Report',
        summary: 'Severe flooding in area',
      };

      const mockIncident = { id: 'incident-1', title: 'Flood Emergency' };
      const mockReport = {
        id: 'report-1',
        ...dto,
        authorId: 'user-1',
        author: { id: 'user-1', email: 'user@test.com' },
        incident: mockIncident,
      };

      mockPrisma.incident.findUnique.mockResolvedValue(mockIncident);
      mockPrisma.report.create.mockResolvedValue(mockReport);

      const result = await service.create(dto, 'user-1');

      expect(result).toEqual(mockReport);
      expect(mockPrisma.incident.findUnique).toHaveBeenCalledWith({
        where: { id: 'incident-1' },
      });
    });

    it('should throw NotFoundException if incident not found', async () => {
      const dto = {
        type: ReportType.INCIDENT,
        incidentId: 'invalid-id',
        title: 'Test',
      };

      mockPrisma.incident.findUnique.mockResolvedValue(null);

      await expect(service.create(dto, 'user-1')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException if INCIDENT report missing incidentId', async () => {
      const dto = {
        type: ReportType.INCIDENT,
        title: 'Test',
      };

      await expect(service.create(dto, 'user-1')).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException if MONTHLY report missing period dates', async () => {
      const dto = {
        type: ReportType.MONTHLY,
        title: 'Monthly Report',
      };

      await expect(service.create(dto, 'user-1')).rejects.toThrow(
        BadRequestException
      );
    });

    it('should create MONTHLY report with period dates', async () => {
      const dto = {
        type: ReportType.MONTHLY,
        title: 'Monthly Report',
        periodStart: '2025-12-01',
        periodEnd: '2025-12-31',
      };

      mockPrisma.report.create.mockResolvedValue({
        id: 'report-1',
        ...dto,
        authorId: 'user-1',
      });

      const result = await service.create(dto, 'user-1');

      expect(result).toHaveProperty('id');
      expect(mockPrisma.report.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated reports', async () => {
      const mockReports = [
        { id: 'report-1', title: 'Report 1' },
        { id: 'report-2', title: 'Report 2' },
      ];

      mockPrisma.report.findMany.mockResolvedValue(mockReports);
      mockPrisma.report.count.mockResolvedValue(2);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual(mockReports);
      expect(result.meta.total).toBe(2);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should filter by type', async () => {
      mockPrisma.report.findMany.mockResolvedValue([]);
      mockPrisma.report.count.mockResolvedValue(0);

      await service.findAll({ type: ReportType.INCIDENT });

      expect(mockPrisma.report.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { type: ReportType.INCIDENT },
        })
      );
    });

    it('should filter by status', async () => {
      mockPrisma.report.findMany.mockResolvedValue([]);
      mockPrisma.report.count.mockResolvedValue(0);

      await service.findAll({ status: ReportStatus.APPROVED });

      expect(mockPrisma.report.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: ReportStatus.APPROVED },
        })
      );
    });

    it('should filter by date range', async () => {
      mockPrisma.report.findMany.mockResolvedValue([]);
      mockPrisma.report.count.mockResolvedValue(0);

      await service.findAll({
        createdFrom: '2025-01-01',
        createdTo: '2025-12-31',
      });

      expect(mockPrisma.report.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: expect.any(Object),
          }),
        })
      );
    });
  });

  describe('findOne', () => {
    it('should return report with full details', async () => {
      const mockReport = {
        id: 'report-1',
        title: 'Test Report',
        author: {},
        incident: {},
        reviewedBy: null,
      };

      mockPrisma.report.findUnique.mockResolvedValue(mockReport);

      const result = await service.findOne('report-1');

      expect(result).toEqual(mockReport);
      expect(mockPrisma.report.findUnique).toHaveBeenCalledWith({
        where: { id: 'report-1' },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if report not found', async () => {
      mockPrisma.report.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    it('should update report if user is author', async () => {
      const mockReport = {
        id: 'report-1',
        authorId: 'user-1',
        status: ReportStatus.DRAFT,
        author: {},
        incident: null,
        reviewedBy: null,
      };

      const updateDto = { title: 'Updated Title' };

      mockPrisma.report.findUnique.mockResolvedValue(mockReport);
      mockPrisma.report.update.mockResolvedValue({
        ...mockReport,
        ...updateDto,
      });

      const result = await service.update(
        'report-1',
        updateDto,
        'user-1',
        Role.FIELD_OFFICER
      );

      expect(result.title).toBe('Updated Title');
    });

    it('should allow ADMIN to update any report', async () => {
      const mockReport = {
        id: 'report-1',
        authorId: 'other-user',
        status: ReportStatus.SUBMITTED,
        author: {},
        incident: null,
        reviewedBy: null,
      };

      mockPrisma.report.findUnique.mockResolvedValue(mockReport);
      mockPrisma.report.update.mockResolvedValue(mockReport);

      await service.update('report-1', {}, 'admin-1', Role.ADMIN);

      expect(mockPrisma.report.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not author or admin', async () => {
      const mockReport = {
        id: 'report-1',
        authorId: 'other-user',
        status: ReportStatus.DRAFT,
        author: {},
        incident: null,
        reviewedBy: null,
      };

      mockPrisma.report.findUnique.mockResolvedValue(mockReport);

      await expect(
        service.update('report-1', {}, 'user-1', Role.FIELD_OFFICER)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if report already submitted', async () => {
      const mockReport = {
        id: 'report-1',
        authorId: 'user-1',
        status: ReportStatus.SUBMITTED,
        author: {},
        incident: null,
        reviewedBy: null,
      };

      mockPrisma.report.findUnique.mockResolvedValue(mockReport);

      await expect(
        service.update('report-1', {}, 'user-1', Role.FIELD_OFFICER)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete report if user is author', async () => {
      const mockReport = {
        id: 'report-1',
        authorId: 'user-1',
        status: ReportStatus.DRAFT,
        author: {},
        incident: null,
        reviewedBy: null,
      };

      mockPrisma.report.findUnique.mockResolvedValue(mockReport);
      mockPrisma.report.delete.mockResolvedValue(mockReport);

      const result = await service.remove('report-1', 'user-1', Role.FIELD_OFFICER);

      expect(result.message).toBe('Report deleted successfully');
      expect(mockPrisma.report.delete).toHaveBeenCalledWith({
        where: { id: 'report-1' },
      });
    });

    it('should throw ForbiddenException if user is not author', async () => {
      const mockReport = {
        id: 'report-1',
        authorId: 'other-user',
        status: ReportStatus.DRAFT,
        author: {},
        incident: null,
        reviewedBy: null,
      };

      mockPrisma.report.findUnique.mockResolvedValue(mockReport);

      await expect(
        service.remove('report-1', 'user-1', Role.FIELD_OFFICER)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if report is approved', async () => {
      const mockReport = {
        id: 'report-1',
        authorId: 'user-1',
        status: ReportStatus.APPROVED,
        author: {},
        incident: null,
        reviewedBy: null,
      };

      mockPrisma.report.findUnique.mockResolvedValue(mockReport);

      await expect(
        service.remove('report-1', 'user-1', Role.FIELD_OFFICER)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('submit', () => {
    it('should submit DRAFT report for review', async () => {
      const mockReport = {
        id: 'report-1',
        authorId: 'user-1',
        status: ReportStatus.DRAFT,
        author: {},
        incident: null,
        reviewedBy: null,
      };

      mockPrisma.report.findUnique.mockResolvedValue(mockReport);
      mockPrisma.report.update.mockResolvedValue({
        ...mockReport,
        status: ReportStatus.SUBMITTED,
        submittedAt: new Date(),
      });

      const result = await service.submit('report-1', 'user-1');

      expect(result.status).toBe(ReportStatus.SUBMITTED);
      expect(result.submittedAt).toBeDefined();
    });

    it('should throw ForbiddenException if user is not author', async () => {
      const mockReport = {
        id: 'report-1',
        authorId: 'other-user',
        status: ReportStatus.DRAFT,
        author: {},
        incident: null,
        reviewedBy: null,
      };

      mockPrisma.report.findUnique.mockResolvedValue(mockReport);

      await expect(service.submit('report-1', 'user-1')).rejects.toThrow(
        ForbiddenException
      );
    });

    it('should throw BadRequestException if report already submitted', async () => {
      const mockReport = {
        id: 'report-1',
        authorId: 'user-1',
        status: ReportStatus.APPROVED,
        author: {},
        incident: null,
        reviewedBy: null,
      };

      mockPrisma.report.findUnique.mockResolvedValue(mockReport);

      await expect(service.submit('report-1', 'user-1')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('review', () => {
    it('should allow SUPERVISOR to review report', async () => {
      const mockReport = {
        id: 'report-1',
        status: ReportStatus.SUBMITTED,
        author: {},
        incident: null,
        reviewedBy: null,
      };

      const reviewDto = {
        status: ReportStatus.APPROVED,
        reviewNotes: 'Looks good',
      };

      mockPrisma.report.findUnique.mockResolvedValue(mockReport);
      mockPrisma.report.update.mockResolvedValue({
        ...mockReport,
        ...reviewDto,
        reviewedById: 'supervisor-1',
        reviewedAt: new Date(),
        approvedAt: new Date(),
      });

      const result = await service.review(
        'report-1',
        reviewDto,
        'supervisor-1',
        Role.SUPERVISOR
      );

      expect(result.status).toBe(ReportStatus.APPROVED);
      expect(result.approvedAt).toBeDefined();
    });

    it('should throw ForbiddenException if user is not authorized to review', async () => {
      const reviewDto = {
        status: ReportStatus.APPROVED,
        reviewNotes: 'Test',
      };

      await expect(
        service.review('report-1', reviewDto, 'user-1', Role.FIELD_OFFICER)
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if report status is invalid', async () => {
      const mockReport = {
        id: 'report-1',
        status: ReportStatus.DRAFT,
        author: {},
        incident: null,
        reviewedBy: null,
      };

      mockPrisma.report.findUnique.mockResolvedValue(mockReport);

      await expect(
        service.review(
          'report-1',
          { status: ReportStatus.APPROVED, reviewNotes: 'Test' },
          'supervisor-1',
          Role.SUPERVISOR
        )
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle REVISION_REQUIRED status', async () => {
      const mockReport = {
        id: 'report-1',
        status: ReportStatus.SUBMITTED,
        author: {},
        incident: null,
        reviewedBy: null,
      };

      const reviewDto = {
        status: ReportStatus.REVISION_REQUIRED,
        reviewNotes: 'Please add more details',
      };

      mockPrisma.report.findUnique.mockResolvedValue(mockReport);
      mockPrisma.report.update.mockResolvedValue({
        ...mockReport,
        ...reviewDto,
      });

      const result = await service.review(
        'report-1',
        reviewDto,
        'supervisor-1',
        Role.SUPERVISOR
      );

      expect(result.status).toBe(ReportStatus.REVISION_REQUIRED);
    });
  });

  describe('getStatistics', () => {
    it('should return comprehensive statistics', async () => {
      mockPrisma.report.count.mockResolvedValue(10);
      mockPrisma.report.groupBy
        .mockResolvedValueOnce([
          { status: ReportStatus.DRAFT, _count: 3 },
          { status: ReportStatus.SUBMITTED, _count: 2 },
          { status: ReportStatus.APPROVED, _count: 5 },
        ])
        .mockResolvedValueOnce([
          { type: ReportType.INCIDENT, _count: 6 },
          { type: ReportType.MONTHLY, _count: 4 },
        ]);
      mockPrisma.report.aggregate
        .mockResolvedValueOnce({ _avg: { totalDamageEstimate: 50000 } })
        .mockResolvedValueOnce({ _sum: { affectedHouseholds: 100 } })
        .mockResolvedValueOnce({ _sum: { affectedPersons: 500 } });

      const result = await service.getStatistics();

      expect(result.total).toBe(10);
      expect(result.byStatus).toHaveProperty(ReportStatus.DRAFT);
      expect(result.byType).toHaveProperty(ReportType.INCIDENT);
      expect(result.avgDamageEstimate).toBe(50000);
      expect(result.totalAffectedHouseholds).toBe(100);
      expect(result.totalAffectedPersons).toBe(500);
    });

    it('should filter statistics by type', async () => {
      mockPrisma.report.count.mockResolvedValue(5);
      mockPrisma.report.groupBy.mockResolvedValue([]);
      mockPrisma.report.aggregate.mockResolvedValue({
        _avg: { totalDamageEstimate: null },
        _sum: { affectedHouseholds: null, affectedPersons: null },
      });

      await service.getStatistics({ type: ReportType.INCIDENT });

      expect(mockPrisma.report.count).toHaveBeenCalledWith({
        where: { type: ReportType.INCIDENT },
      });
    });

    it('should filter statistics by date range', async () => {
      mockPrisma.report.count.mockResolvedValue(3);
      mockPrisma.report.groupBy.mockResolvedValue([]);
      mockPrisma.report.aggregate.mockResolvedValue({
        _avg: { totalDamageEstimate: null },
        _sum: { affectedHouseholds: null, affectedPersons: null },
      });

      await service.getStatistics({
        periodStart: '2025-01-01',
        periodEnd: '2025-12-31',
      });

      expect(mockPrisma.report.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          createdAt: expect.any(Object),
        }),
      });
    });
  });
});
