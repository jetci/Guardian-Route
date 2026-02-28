import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FieldOfficerSurveyDto, FieldOfficerSurveyResponseDto } from './dto/field-officer-survey.dto';
import { FieldOfficerSurveyService } from './field-officer-survey.service';

/**
 * Field Officer Survey Controller
 * Handles survey submissions from field officers in the mobile/field interface
 */
@ApiTags('Field Officer - Surveys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('field-officer/surveys')
export class FieldOfficerSurveyController {
  constructor(private readonly surveyService: FieldOfficerSurveyService) {}

  @Post()
  @Roles(Role.FIELD_OFFICER)
  @ApiOperation({ 
    summary: 'Submit initial survey from field',
    description: 'Field officers use this endpoint to submit survey data collected in the field, including GPS coordinates and photos'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Survey submitted successfully', 
    type: FieldOfficerSurveyResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Field Officer role required' })
  async submitSurvey(
    @Req() req: any,
    @Body() surveyDto: FieldOfficerSurveyDto
  ): Promise<FieldOfficerSurveyResponseDto> {
    const userId = req.user.id;
    return this.surveyService.submitFieldSurvey(userId, surveyDto);
  }

  @Get('my-surveys')
  @Roles(Role.FIELD_OFFICER)
  @ApiOperation({ 
    summary: 'Get my submitted surveys',
    description: 'Retrieve all surveys submitted by the current field officer'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of submitted surveys', 
    type: [FieldOfficerSurveyResponseDto] 
  })
  async getMySurveys(@Req() req: any): Promise<FieldOfficerSurveyResponseDto[]> {
    const userId = req.user.id;
    return this.surveyService.getFieldOfficerSurveys(userId);
  }

  @Get(':id')
  @Roles(Role.FIELD_OFFICER, Role.SUPERVISOR, Role.ADMIN)
  @ApiOperation({ 
    summary: 'Get survey by ID',
    description: 'Retrieve a specific survey by its ID'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Survey details', 
    type: FieldOfficerSurveyResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Survey not found' })
  async getSurvey(@Param('id') id: string): Promise<FieldOfficerSurveyResponseDto> {
    return this.surveyService.getSurveyById(id);
  }
}
