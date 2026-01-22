import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ComprehensiveSurveyDto, ComprehensiveSurveyResponseDto } from './dto/comprehensive-survey.dto';

/**
 * Comprehensive Survey Service
 * Handles 8-step detailed survey submissions from field officers
 */
@Injectable()
export class ComprehensiveSurveyService {
    constructor(private prisma: PrismaService) { }

    /**
     * Submit a comprehensive survey (8 steps)
     */
    async submitComprehensiveSurvey(
        fieldOfficerId: string,
        surveyDto: ComprehensiveSurveyDto
    ): Promise<ComprehensiveSurveyResponseDto> {
        try {
            // Validate village exists
            if (surveyDto.villageId) {
                const village = await this.prisma.village.findUnique({
                    where: { id: surveyDto.villageId }
                });
                if (!village) {
                    throw new BadRequestException('Village not found');
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

            // Prepare relief data
            const reliefData = surveyDto.reliefOperations ? {
                operations: surveyDto.reliefOperations
            } : null;

            // Create comprehensive survey record
            const survey = await this.prisma.comprehensiveSurvey.create({
                data: {
                    fieldOfficerId,
                    taskId: surveyDto.taskId || null,
                    villageId: surveyDto.villageId,
                    villageName: surveyDto.villageName,
                    disasterType: surveyDto.disasterType,
                    surveyDate: new Date(surveyDto.surveyDate),
                    gpsLocation: surveyDto.gpsLocation as any,

                    // Step 2: Affected People
                    affectedHouseholds: surveyDto.affectedHouseholds,
                    affectedPeople: surveyDto.affectedPeople,
                    deadCount: surveyDto.deadCount,
                    missingCount: surveyDto.missingCount,
                    injuredCount: surveyDto.injuredCount,
                    evacuatedPeople: surveyDto.evacuatedPeople || 0,
                    evacuatedHouseholds: surveyDto.evacuatedHouseholds || 0,

                    // Step 3: Damage Assessment
                    damageAssessment: surveyDto.damageAssessment as any,

                    // Step 4-6: Operations
                    reliefData: reliefData as any,
                    resourcesData: surveyDto.resourcesData as any,
                    operationsData: surveyDto.operationsData as any,

                    // Step 7: Certification
                    reportType: surveyDto.reportType,

                    // Metadata
                    photoUrls: surveyDto.photoUrls || [],
                    polygon: surveyDto.polygon,
                    notes: surveyDto.notes,
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
                    task: true
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

            return new ComprehensiveSurveyResponseDto({
                id: survey.id,
                fieldOfficerId: survey.fieldOfficerId,
                taskId: survey.taskId || undefined,
                villageId: survey.villageId || '',
                villageName: survey.villageName,
                disasterType: survey.disasterType,
                surveyDate: survey.surveyDate,
                gpsLocation: survey.gpsLocation as any,
                affectedHouseholds: survey.affectedHouseholds,
                affectedPeople: survey.affectedPeople,
                deadCount: survey.deadCount,
                missingCount: survey.missingCount,
                injuredCount: survey.injuredCount,
                evacuatedPeople: survey.evacuatedPeople,
                evacuatedHouseholds: survey.evacuatedHouseholds,
                damageAssessment: survey.damageAssessment,
                reliefData: survey.reliefData,
                resourcesData: survey.resourcesData,
                operationsData: survey.operationsData,
                reportType: survey.reportType,
                photoUrls: survey.photoUrls,
                polygon: survey.polygon,
                notes: survey.notes || undefined,
                status: survey.status,
                submittedAt: survey.submittedAt,
                updatedAt: survey.updatedAt
            });
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            console.error('Error submitting comprehensive survey:', error);
            throw new BadRequestException('Failed to submit comprehensive survey: ' + error.message);
        }
    }

    /**
     * Get all comprehensive surveys submitted by a field officer
     */
    async getFieldOfficerSurveys(fieldOfficerId: string): Promise<ComprehensiveSurveyResponseDto[]> {
        const surveys = await this.prisma.comprehensiveSurvey.findMany({
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
                task: true
            }
        });

        return surveys.map(survey => new ComprehensiveSurveyResponseDto({
            id: survey.id,
            fieldOfficerId: survey.fieldOfficerId,
            taskId: survey.taskId || undefined,
            villageId: survey.villageId || '',
            villageName: survey.villageName,
            disasterType: survey.disasterType,
            surveyDate: survey.surveyDate,
            gpsLocation: survey.gpsLocation as any,
            affectedHouseholds: survey.affectedHouseholds,
            affectedPeople: survey.affectedPeople,
            deadCount: survey.deadCount,
            missingCount: survey.missingCount,
            injuredCount: survey.injuredCount,
            evacuatedPeople: survey.evacuatedPeople,
            evacuatedHouseholds: survey.evacuatedHouseholds,
            damageAssessment: survey.damageAssessment,
            reliefData: survey.reliefData,
            resourcesData: survey.resourcesData,
            operationsData: survey.operationsData,
            reportType: survey.reportType,
            photoUrls: survey.photoUrls,
            polygon: survey.polygon,
            notes: survey.notes || undefined,
            status: survey.status,
            submittedAt: survey.submittedAt,
            updatedAt: survey.updatedAt
        }));
    }

    /**
     * Get a specific comprehensive survey by ID
     */
    async getSurveyById(surveyId: string): Promise<ComprehensiveSurveyResponseDto> {
        const survey = await this.prisma.comprehensiveSurvey.findUnique({
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
                task: true
            }
        });

        if (!survey) {
            throw new NotFoundException('Comprehensive survey not found');
        }

        return new ComprehensiveSurveyResponseDto({
            id: survey.id,
            fieldOfficerId: survey.fieldOfficerId,
            taskId: survey.taskId || undefined,
            villageId: survey.villageId || '',
            villageName: survey.villageName,
            disasterType: survey.disasterType,
            surveyDate: survey.surveyDate,
            gpsLocation: survey.gpsLocation as any,
            affectedHouseholds: survey.affectedHouseholds,
            affectedPeople: survey.affectedPeople,
            deadCount: survey.deadCount,
            missingCount: survey.missingCount,
            injuredCount: survey.injuredCount,
            evacuatedPeople: survey.evacuatedPeople,
            evacuatedHouseholds: survey.evacuatedHouseholds,
            damageAssessment: survey.damageAssessment,
            reliefData: survey.reliefData,
            resourcesData: survey.resourcesData,
            operationsData: survey.operationsData,
            reportType: survey.reportType,
            photoUrls: survey.photoUrls,
            polygon: survey.polygon,
            notes: survey.notes || undefined,
            status: survey.status,
            submittedAt: survey.submittedAt,
            updatedAt: survey.updatedAt
        });
    }
}
