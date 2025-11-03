import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service'; // Corrected import path
import { CreateSurveyTemplateDto } from './dto/create-survey-template.dto';
import { UpdateSurveyTemplateDto } from './dto/update-survey-template.dto';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { CreateSurveyResponseDto } from './dto/create-survey-response.dto';
import { SurveyTemplate, SurveyStatus, Survey, SurveyResponse } from '@prisma/client'; // Added missing imports

@Injectable()
export class SurveyService {
  constructor(private prisma: PrismaService) {}

  // --- Survey Template CRUD ---

  async createTemplate(data: CreateSurveyTemplateDto): Promise<SurveyTemplate> {
    // formSchema is already an object due to class-validator @IsObject()
    const formSchema = data.formSchema;
    return this.prisma.surveyTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        fields: formSchema,
      },
    });
  }

  async findAllTemplates(): Promise<SurveyTemplate[]> {
    return this.prisma.surveyTemplate.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOneTemplate(id: string): Promise<SurveyTemplate> {
    const template = await this.prisma.surveyTemplate.findUnique({
      where: { id },
    });
    if (!template) {
      throw new NotFoundException(`Survey Template with ID "${id}" not found`);
    }
    return template;
  }

  async updateTemplate(id: string, data: UpdateSurveyTemplateDto): Promise<SurveyTemplate> {
    const updateData: any = {
      name: data.name,
      description: data.description,
    };

    if (data.formSchema) {
      updateData.fields = data.formSchema;
    }

    const updatedTemplate = await this.prisma.surveyTemplate.update({
      where: { id },
      data: updateData,
    });

    if (!updatedTemplate) {
      throw new NotFoundException(`Survey Template with ID "${id}" not found`);
    }
    return updatedTemplate;
  }

  async removeTemplate(id: string): Promise<SurveyTemplate> {
    try {
      return await this.prisma.surveyTemplate.delete({
        where: { id },
      });
    } catch (error) {
      // P2025: Record to delete does not exist.
      if (error.code === 'P2025') {
        throw new NotFoundException(`Survey Template with ID "${id}" not found`);
      }
      throw error;
    }
  }

  // --- Survey CRUD ---

  async createSurvey(userId: string, data: CreateSurveyDto): Promise<Survey> {
    // 1. Validate templateId
    await this.findOneTemplate(data.templateId);

    // 2. Validate incidentId (if provided)
    if (data.incidentId) {
      const incident = await this.prisma.incident.findUnique({ where: { id: data.incidentId } });
      if (!incident) {
        throw new NotFoundException(`Incident with ID "${data.incidentId}" not found`);
      }
    }

    // 3. Validate villageId (if provided)
    if (data.villageId) {
      const village = await this.prisma.village.findUnique({ where: { id: data.villageId } });
      if (!village) {
        throw new NotFoundException(`Village with ID "${data.villageId}" not found`);
      }
    }

    let polygon: any = undefined;
    if (data.polygon) {
      try {
        polygon = JSON.parse(data.polygon);
      } catch (error) {
        throw new BadRequestException('Invalid JSON format for polygon.');
      }
    }

    return this.prisma.survey.create({
      data: {
        templateId: data.templateId,
        incidentId: data.incidentId,
        villageId: data.villageId,
        polygon: polygon,
        createdById: userId,
        status: SurveyStatus.PENDING, // Use enum
      },
    });
  }

  async findSurveysByIncident(incidentId: string): Promise<Survey[]> {
    return this.prisma.survey.findMany({
      where: { incidentId },
      include: { template: true },
      orderBy: { createdAt: 'desc' } as any,
    });
  }

  async findOneSurvey(id: string): Promise<Survey> {
    const survey = await this.prisma.survey.findUnique({
      where: { id },
      include: { template: true, responses: true },
    });
    if (!survey) {
      throw new NotFoundException(`Survey with ID "${id}" not found`);
    }
    return survey;
  }

  // --- Survey Response CRUD ---

  async createResponse(surveyId: string, userId: string, data: CreateSurveyResponseDto): Promise<SurveyResponse> {
    // 1. Validate surveyId
    const survey = await this.findOneSurvey(surveyId);

    // 2. Check if survey is already completed
    if (survey.status === SurveyStatus.COMPLETED) {
      throw new BadRequestException('Cannot submit response to a completed survey.');
    }

    let responseData: any;
    try {
      responseData = JSON.parse(data.data);
    } catch (error) {
      throw new BadRequestException('Invalid JSON format for response data.');
    }

    // 3. Create response
    const response = await this.prisma.surveyResponse.create({
      data: {
        surveyId: surveyId,
        data: responseData,
        submittedById: userId,
      },
    });

    // 4. Update survey status to IN_PROGRESS if it was PENDING
    if (survey.status === SurveyStatus.PENDING) {
      await this.prisma.survey.update({
        where: { id: surveyId },
        data: { status: SurveyStatus.IN_PROGRESS },
      });
    }

    return response;
  }

  async findResponsesBySurvey(surveyId: string): Promise<SurveyResponse[]> {
    // 1. Validate surveyId
    await this.findOneSurvey(surveyId);

    return this.prisma.surveyResponse.findMany({
      where: { surveyId },
      orderBy: { submittedAt: 'asc' },
    });
  }

  async completeSurvey(surveyId: string): Promise<Survey> {
    const survey = await this.findOneSurvey(surveyId);

    if (survey.status === SurveyStatus.COMPLETED) {
      throw new BadRequestException('Survey is already completed.');
    }

    return this.prisma.survey.update({
      where: { id: surveyId },
      data: {
        status: SurveyStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
  }
}
