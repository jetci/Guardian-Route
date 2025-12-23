import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { FieldOfficerSurveyDto, FieldOfficerSurveyResponseDto } from './dto/field-officer-survey.dto';

/**
 * Field Officer Survey Service
 * Business logic for field officer survey submissions
 */
@Injectable()
export class FieldOfficerSurveyService {
  constructor(private prisma: PrismaService) { }

  /**
   * Submit a field survey
   */
  async submitFieldSurvey(
    fieldOfficerId: string,
    surveyDto: FieldOfficerSurveyDto
  ): Promise<FieldOfficerSurveyResponseDto> {
    try {
      // Validate village exists (if villageId provided)
      if (surveyDto.villageId) {
        const village = await this.prisma.village.findUnique({
          where: { id: surveyDto.villageId }
        });
        if (!village) {
          throw new BadRequestException('Village not found');
        }
      } else if (surveyDto.villageName) {
        // Try to auto-match village by name if villageId not provided
        const village = await this.prisma.village.findFirst({
          where: {
            OR: [
              { name: surveyDto.villageName },
              { alternateNames: { has: surveyDto.villageName } }
            ]
          }
        });
        
        // If found, use its ID
        if (village) {
          surveyDto.villageId = village.id;
        }
      }

      // Validate task if provided
      if (surveyDto.taskId) {
        const task = await this.prisma.task.findUnique({
          where: { id: surveyDto.taskId }
        });
        if (!task) {
          throw new BadRequestException('Task not found');
        }
      }

      // Create field survey record in dedicated table
      const fieldSurvey = await this.prisma.fieldSurvey.create({
        data: {
          fieldOfficerId,
          taskId: surveyDto.taskId,
          incidentId: surveyDto.incidentId,
          villageId: surveyDto.villageId,
          villageName: surveyDto.villageName,
          disasterType: surveyDto.disasterType,
          severity: surveyDto.severity,
          estimatedHouseholds: surveyDto.estimatedHouseholds,
          notes: surveyDto.notes,
          gpsLocation: surveyDto.gpsLocation as any,
          polygon: surveyDto.polygon,
          areaSize: surveyDto.areaSize,
          photoUrls: surveyDto.photoUrls || [],
          additionalData: surveyDto.additionalData || {},
          status: 'SUBMITTED'
        },
        include: {
          fieldOfficer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true
            }
          },
          village: true,
          task: true,
          incident: true
        }
      });

      // Update task status if task is provided
      if (surveyDto.taskId) {
        await this.prisma.task.update({
          where: { id: surveyDto.taskId },
          data: {
            status: 'IN_PROGRESS',
            updatedAt: new Date()
          }
        });
      }

      return new FieldOfficerSurveyResponseDto({
        id: fieldSurvey.id,
        fieldOfficerId: fieldSurvey.fieldOfficerId,
        taskId: fieldSurvey.taskId || undefined,
        incidentId: fieldSurvey.incidentId || undefined,
        villageId: fieldSurvey.villageId || undefined,
        villageName: fieldSurvey.villageName,
        disasterType: fieldSurvey.disasterType,
        severity: fieldSurvey.severity,
        estimatedHouseholds: fieldSurvey.estimatedHouseholds,
        notes: fieldSurvey.notes,
        gpsLocation: fieldSurvey.gpsLocation as any,
        photoUrls: fieldSurvey.photoUrls,
        polygon: fieldSurvey.polygon,
        areaSize: fieldSurvey.areaSize ? parseFloat(fieldSurvey.areaSize.toString()) : undefined,
        additionalData: fieldSurvey.additionalData as any,
        submittedAt: fieldSurvey.submittedAt,
        status: fieldSurvey.status
      });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to submit survey: ' + error.message);
    }
  }

  /**
   * Get all surveys submitted by a field officer
   */
  async getFieldOfficerSurveys(fieldOfficerId: string): Promise<FieldOfficerSurveyResponseDto[]> {
    const surveys = await this.prisma.fieldSurvey.findMany({
      where: {
        fieldOfficerId
      },
      orderBy: {
        submittedAt: 'desc'
      },
      include: {
        fieldOfficer: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        village: true,
        task: true,
        incident: true
      }
    });

    return surveys.map(survey => new FieldOfficerSurveyResponseDto({
      id: survey.id,
      fieldOfficerId: survey.fieldOfficerId,
      taskId: survey.taskId || undefined,
      incidentId: survey.incidentId || undefined,
      villageId: survey.villageId || undefined,
      villageName: survey.villageName,
      disasterType: survey.disasterType,
      severity: survey.severity,
      estimatedHouseholds: survey.estimatedHouseholds,
      notes: survey.notes,
      gpsLocation: survey.gpsLocation as any,
      photoUrls: survey.photoUrls,
      additionalData: survey.additionalData as any,
      submittedAt: survey.submittedAt,
      status: survey.status
    }));
  }

  /**
   * Get a specific survey by ID
   */
  async getSurveyById(surveyId: string): Promise<FieldOfficerSurveyResponseDto> {
    const survey = await this.prisma.fieldSurvey.findUnique({
      where: { id: surveyId },
      include: {
        fieldOfficer: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        village: true,
        task: true,
        incident: true
      }
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    return new FieldOfficerSurveyResponseDto({
      id: survey.id,
      fieldOfficerId: survey.fieldOfficerId,
      taskId: survey.taskId || undefined,
      incidentId: survey.incidentId || undefined,
      villageId: survey.villageId || undefined,
      villageName: survey.villageName,
      disasterType: survey.disasterType,
      severity: survey.severity,
      estimatedHouseholds: survey.estimatedHouseholds,
      notes: survey.notes,
      gpsLocation: survey.gpsLocation as any,
      photoUrls: survey.photoUrls,
      additionalData: survey.additionalData as any,
      submittedAt: survey.submittedAt,
      status: survey.status
    });
  }
}
