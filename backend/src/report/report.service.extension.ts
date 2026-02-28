import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { GeminiService } from './gemini.service';
import { CreateFullReportDto } from './dto/create-full-report.dto';
import { ReportStatus, ReportType } from '@prisma/client';

@Injectable()
export class ReportServiceExtension {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
  ) {}

  /**
   * Create full report with AI analysis
   */
  async createFullReport(dto: CreateFullReportDto, authorId: string) {
    // Validate task exists
    const task = await this.prisma.task.findUnique({
      where: { id: dto.taskId },
      include: {
        incident: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${dto.taskId} not found`);
    }

    // Generate AI analysis if not provided
    let aiAnalysis = dto.aiAnalysis;
    if (!aiAnalysis) {
      aiAnalysis = await this.geminiService.analyzeIncidentReport({
        title: dto.title,
        description: dto.incidentDescription,
        severity: dto.severity,
        affectedHouseholds: dto.affectedHouseholds,
        affectedPopulation: dto.affectedPopulation,
        infrastructureDamage: dto.infrastructureDamage,
        casualties: dto.casualties,
        injuries: dto.injuries,
      });
    }

    // Create report
    const report = await this.prisma.report.create({
      data: {
        type: ReportType.INCIDENT,
        status: ReportStatus.DRAFT,
        title: dto.title,
        summary: dto.summary,
        details: {
          incidentDescription: dto.incidentDescription,
          severity: dto.severity,
          affectedAreaDescription: dto.affectedAreaDescription,
          infrastructureDamage: dto.infrastructureDamage,
          casualties: dto.casualties,
          injuries: dto.injuries,
          resourcesNeeded: dto.resourcesNeeded,
          currentResponse: dto.currentResponse,
          recommendations: dto.recommendations,
        },
        aiAnalysis: {
          original: aiAnalysis,
          edited: dto.aiAnalysisEdited || aiAnalysis,
        },
        photoUrls: dto.photoUrls || [],
        authorId,
        incidentId: task.incidentId,
        affectedHouseholds: dto.affectedHouseholds,
        affectedPersons: dto.affectedPopulation,
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

    return report;
  }

  /**
   * Submit full report for review
   */
  async submitFullReport(reportId: string, userId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${reportId} not found`);
    }

    if (report.authorId !== userId) {
      throw new BadRequestException('You can only submit your own reports');
    }

    if (report.status !== ReportStatus.DRAFT) {
      throw new BadRequestException('Only draft reports can be submitted');
    }

    return this.prisma.report.update({
      where: { id: reportId },
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
        incident: true,
      },
    });
  }

  /**
   * Request AI analysis for existing report data
   */
  async requestAIAnalysis(data: {
    title: string;
    description: string;
    severity: string;
    affectedHouseholds: number;
    affectedPopulation: number;
    infrastructureDamage?: string;
    casualties?: number;
    injuries?: number;
  }) {
    return this.geminiService.analyzeIncidentReport(data);
  }
}
