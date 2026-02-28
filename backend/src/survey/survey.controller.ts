import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SurveyService } from './survey.service';
import { CreateSurveyTemplateDto } from './dto/create-survey-template.dto';
import { UpdateSurveyTemplateDto } from './dto/update-survey-template.dto';
import { SurveyTemplateDto } from './dto/survey-template.dto';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { SurveyDto } from './dto/survey.dto';
import { CreateSurveyResponseDto } from './dto/create-survey-response.dto';
import { SurveyResponseDto } from './dto/survey-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Survey Templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('survey-templates')
export class SurveyTemplateController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  @Roles(Role.SUPERVISOR, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new survey template' })
  @ApiResponse({ status: 201, description: 'The template has been successfully created.', type: SurveyTemplateDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createSurveyTemplateDto: CreateSurveyTemplateDto): Promise<SurveyTemplateDto> {
    const template = await this.surveyService.createTemplate(createSurveyTemplateDto);
    return new SurveyTemplateDto(template as any);
  }

  @Get()
  @Roles(Role.SUPERVISOR, Role.ADMIN, Role.FIELD_OFFICER)
  @ApiOperation({ summary: 'Get all survey templates' })
  @ApiResponse({ status: 200, description: 'List of all survey templates', type: [SurveyTemplateDto] })
  async findAll(): Promise<SurveyTemplateDto[]> {
    const templates = await this.surveyService.findAllTemplates();
    return templates.map(template => new SurveyTemplateDto(template as any));
  }

  @Get(':id')
  @Roles(Role.SUPERVISOR, Role.ADMIN, Role.FIELD_OFFICER)
  @ApiOperation({ summary: 'Get a survey template by ID' })
  @ApiResponse({ status: 200, description: 'The found template', type: SurveyTemplateDto })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async findOne(@Param('id') id: string): Promise<SurveyTemplateDto> {
    const template = await this.surveyService.findOneTemplate(id);
    return new SurveyTemplateDto(template as any);
  }

  @Patch(':id')
  @Roles(Role.SUPERVISOR, Role.ADMIN)
  @ApiOperation({ summary: 'Update an existing survey template' })
  @ApiResponse({ status: 200, description: 'The template has been successfully updated.', type: SurveyTemplateDto })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async update(@Param('id') id: string, @Body() updateSurveyTemplateDto: UpdateSurveyTemplateDto): Promise<SurveyTemplateDto> {
    const template = await this.surveyService.updateTemplate(id, updateSurveyTemplateDto);
    return new SurveyTemplateDto(template as any);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a survey template' })
  @ApiResponse({ status: 204, description: 'The template has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.surveyService.removeTemplate(id);
  }
}

@ApiTags('Surveys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  @Roles(Role.SUPERVISOR, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new survey instance for an incident or village' })
  @ApiResponse({ status: 201, description: 'The survey has been successfully created.', type: SurveyDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Req() req: any, @Body() createSurveyDto: CreateSurveyDto): Promise<SurveyDto> {
    const survey = await this.surveyService.createSurvey(req.user.id, createSurveyDto);
    return new SurveyDto(survey);
  }

  @Get('incident/:incidentId')
  @Roles(Role.SUPERVISOR, Role.ADMIN, Role.FIELD_OFFICER)
  @ApiOperation({ summary: 'Get all surveys for a specific incident' })
  @ApiResponse({ status: 200, description: 'List of surveys for the incident', type: [SurveyDto] })
  async findByIncident(@Param('incidentId') incidentId: string): Promise<SurveyDto[]> {
    const surveys = await this.surveyService.findSurveysByIncident(incidentId);
    return surveys.map(survey => new SurveyDto(survey));
  }

  @Get(':id')
  @Roles(Role.SUPERVISOR, Role.ADMIN, Role.FIELD_OFFICER)
  @ApiOperation({ summary: 'Get a survey by ID' })
  @ApiResponse({ status: 200, description: 'The found survey', type: SurveyDto })
  @ApiResponse({ status: 404, description: 'Survey not found' })
  async findOne(@Param('id') id: string): Promise<SurveyDto> {
    const survey = await this.surveyService.findOneSurvey(id);
    return new SurveyDto(survey);
  }

  @Post(':surveyId/response')
  @Roles(Role.FIELD_OFFICER, Role.SUPERVISOR, Role.ADMIN)
  @ApiOperation({ summary: 'Submit a response to a survey' })
  @ApiResponse({ status: 201, description: 'The response has been successfully submitted.', type: SurveyResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input or survey already completed' })
  @ApiResponse({ status: 404, description: 'Survey not found' })
  async submitResponse(@Req() req: any, @Param('surveyId') surveyId: string, @Body() createResponseDto: CreateSurveyResponseDto): Promise<SurveyResponseDto> {
    const response = await this.surveyService.createResponse(surveyId, req.user.id, createResponseDto);
    return new SurveyResponseDto(response);
  }

  @Get(':surveyId/responses')
  @Roles(Role.SUPERVISOR, Role.ADMIN)
  @ApiOperation({ summary: 'Get all responses for a specific survey' })
  @ApiResponse({ status: 200, description: 'List of survey responses', type: [SurveyResponseDto] })
  @ApiResponse({ status: 404, description: 'Survey not found' })
  async findResponses(@Param('surveyId') surveyId: string): Promise<SurveyResponseDto[]> {
    const responses = await this.surveyService.findResponsesBySurvey(surveyId);
    return responses.map(response => new SurveyResponseDto(response));
  }

  @Patch(':surveyId/complete')
  @Roles(Role.SUPERVISOR, Role.ADMIN)
  @ApiOperation({ summary: 'Mark a survey as completed' })
  @ApiResponse({ status: 200, description: 'The survey has been successfully completed.', type: SurveyDto })
  @ApiResponse({ status: 400, description: 'Survey already completed' })
  @ApiResponse({ status: 404, description: 'Survey not found' })
  async completeSurvey(@Param('surveyId') surveyId: string): Promise<SurveyDto> {
    const survey = await this.surveyService.completeSurvey(surveyId);
    return new SurveyDto(survey);
  }
}
