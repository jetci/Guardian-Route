import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { FilterReportDto } from './dto/filter-report.dto';
import { ReviewReportDto } from './dto/review-report.dto';
import { GeneratePdfDto } from './dto/generate-pdf.dto';
import { ReportStatus, ReportType, Role } from '@prisma/client';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new report
   */
  async create(createReportDto: CreateReportDto, authorId: string) {
    // Validate incident exists if incidentId is provided
    if (createReportDto.incidentId) {
      const incident = await this.prisma.incident.findUnique({
        where: { id: createReportDto.incidentId },
      });
      if (!incident) {
        throw new NotFoundException(
          `Incident with ID ${createReportDto.incidentId} not found`,
        );
      }
    }

    // Validate required fields based on report type
    if (
      createReportDto.type === ReportType.INCIDENT &&
      !createReportDto.incidentId
    ) {
      throw new BadRequestException(
        'incidentId is required for INCIDENT reports',
      );
    }

    if (
      (createReportDto.type === ReportType.MONTHLY ||
        createReportDto.type === ReportType.CUSTOM) &&
      (!createReportDto.periodStart || !createReportDto.periodEnd)
    ) {
      throw new BadRequestException(
        'periodStart and periodEnd are required for MONTHLY and CUSTOM reports',
      );
    }

    return this.prisma.report.create({
      data: {
        ...createReportDto,
        authorId,
        photoUrls: createReportDto.photoUrls || [],
      },
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
        incident: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
      },
    });
  }

  /**
   * Find all reports with filtering and pagination
   */
  async findAll(filterDto: FilterReportDto) {
    const {
      type,
      status,
      incidentId,
      authorId,
      periodStartFrom,
      periodStartTo,
      createdFrom,
      createdTo,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filterDto;

    const where: any = {};

    if (type) where.type = type;
    if (status) where.status = status;
    if (incidentId) where.incidentId = incidentId;
    if (authorId) where.authorId = authorId;

    if (periodStartFrom || periodStartTo) {
      where.periodStart = {};
      if (periodStartFrom) where.periodStart.gte = new Date(periodStartFrom);
      if (periodStartTo) where.periodStart.lte = new Date(periodStartTo);
    }

    if (createdFrom || createdTo) {
      where.createdAt = {};
      if (createdFrom) where.createdAt.gte = new Date(createdFrom);
      if (createdTo) where.createdAt.lte = new Date(createdTo);
    }

    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
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
          incident: {
            select: {
              id: true,
              title: true,
              status: true,
              priority: true,
            },
          },
          reviewedBy: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      data: reports,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find one report by ID
   */
  async findOne(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
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
        incident: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            location: true,
            address: true,
            images: true,
            disasterType: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  /**
   * Update a report
   */
  async update(
    id: string,
    updateReportDto: UpdateReportDto,
    userId: string,
    userRole: Role,
  ) {
    const report = await this.findOne(id);

    // Only author or ADMIN can update
    if (report.authorId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only update your own reports');
    }

    // Cannot update if already submitted (unless ADMIN)
    if (
      report.status !== ReportStatus.DRAFT &&
      report.status !== ReportStatus.REVISION_REQUIRED &&
      userRole !== Role.ADMIN
    ) {
      throw new BadRequestException(
        'Cannot update report that has been submitted',
      );
    }

    return this.prisma.report.update({
      where: { id },
      data: updateReportDto,
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
        incident: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
      },
    });
  }

  /**
   * Delete a report
   */
  async remove(id: string, userId: string, userRole: Role) {
    const report = await this.findOne(id);

    // Only author or ADMIN can delete
    if (report.authorId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('You can only delete your own reports');
    }

    // Cannot delete if already approved
    if (report.status === ReportStatus.APPROVED && userRole !== Role.ADMIN) {
      throw new BadRequestException('Cannot delete approved reports');
    }

    await this.prisma.report.delete({ where: { id } });

    return { message: 'Report deleted successfully' };
  }

  /**
   * Submit a report for review
   */
  async submit(id: string, userId: string) {
    const report = await this.findOne(id);

    // Only author can submit
    if (report.authorId !== userId) {
      throw new ForbiddenException('You can only submit your own reports');
    }

    // Can only submit DRAFT or REVISION_REQUIRED reports
    if (
      report.status !== ReportStatus.DRAFT &&
      report.status !== ReportStatus.REVISION_REQUIRED
    ) {
      throw new BadRequestException(
        `Cannot submit report with status ${report.status}`,
      );
    }

    return this.prisma.report.update({
      where: { id },
      data: {
        status: ReportStatus.SUBMITTED,
        submittedAt: new Date(),
      },
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
    });
  }

  /**
   * Review a report (SUPERVISOR, EXECUTIVE, ADMIN only)
   */
  async review(
    id: string,
    reviewDto: ReviewReportDto,
    reviewerId: string,
    reviewerRole: Role,
  ) {
    // Only SUPERVISOR, EXECUTIVE, or ADMIN can review
    if (
      reviewerRole !== Role.SUPERVISOR &&
      reviewerRole !== Role.EXECUTIVE &&
      reviewerRole !== Role.ADMIN
    ) {
      throw new ForbiddenException('You do not have permission to review reports');
    }

    const report = await this.findOne(id);

    // Can only review SUBMITTED or UNDER_REVIEW reports
    if (
      report.status !== ReportStatus.SUBMITTED &&
      report.status !== ReportStatus.UNDER_REVIEW
    ) {
      throw new BadRequestException(
        `Cannot review report with status ${report.status}`,
      );
    }

    const updateData: any = {
      status: reviewDto.status,
      reviewNotes: reviewDto.reviewNotes,
      reviewedById: reviewerId,
      reviewedAt: new Date(),
    };

    if (reviewDto.status === ReportStatus.APPROVED) {
      updateData.approvedAt = new Date();
    }

    return this.prisma.report.update({
      where: { id },
      data: updateData,
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
        reviewedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  /**
   * Generate PDF for a report
   */
  async generatePdf(id: string, generatePdfDto: GeneratePdfDto) {
    const report = await this.findOne(id);

    // Check if PDF already exists and forceRegenerate is false
    if (
      report.pdfUrl &&
      !generatePdfDto.forceRegenerate
    ) {
      return {
        message: 'PDF already exists',
        pdfUrl: report.pdfUrl,
        generatedAt: report.pdfGeneratedAt,
      };
    }

    // TODO: Implement actual PDF generation logic
    // For now, return a placeholder
    const pdfUrl = `https://example.com/reports/${id}.pdf`;

    await this.prisma.report.update({
      where: { id },
      data: {
        pdfUrl,
        pdfGeneratedAt: new Date(),
      },
    });

    return {
      message: 'PDF generated successfully',
      pdfUrl,
      generatedAt: new Date(),
    };
  }

  /**
   * Get report statistics
   */
  async getStatistics(filters?: {
    periodStart?: string;
    periodEnd?: string;
    type?: ReportType;
  }) {
    const where: any = {};

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.periodStart || filters?.periodEnd) {
      where.createdAt = {};
      if (filters.periodStart) {
        where.createdAt.gte = new Date(filters.periodStart);
      }
      if (filters.periodEnd) {
        where.createdAt.lte = new Date(filters.periodEnd);
      }
    }

    const [
      total,
      byStatus,
      byType,
      avgDamageEstimate,
      totalAffectedHouseholds,
      totalAffectedPersons,
    ] = await Promise.all([
      this.prisma.report.count({ where }),
      this.prisma.report.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      this.prisma.report.groupBy({
        by: ['type'],
        where,
        _count: true,
      }),
      this.prisma.report.aggregate({
        where,
        _avg: {
          totalDamageEstimate: true,
        },
      }),
      this.prisma.report.aggregate({
        where,
        _sum: {
          affectedHouseholds: true,
        },
      }),
      this.prisma.report.aggregate({
        where,
        _sum: {
          affectedPersons: true,
        },
      }),
    ]);

    return {
      total,
      byStatus: byStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
      byType: byType.reduce(
        (acc, item) => {
          acc[item.type] = item._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
      avgDamageEstimate: avgDamageEstimate._avg.totalDamageEstimate || 0,
      totalAffectedHouseholds:
        totalAffectedHouseholds._sum.affectedHouseholds || 0,
      totalAffectedPersons: totalAffectedPersons._sum.affectedPersons || 0,
    };
  }
}
