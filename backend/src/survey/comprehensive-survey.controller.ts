import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ComprehensiveSurveyDto, ComprehensiveSurveyResponseDto } from './dto/comprehensive-survey.dto';
import { ComprehensiveSurveyService } from './comprehensive-survey.service';

/**
 * Comprehensive Survey Controller
 * Handles 8-step detailed survey submissions from field officers
 */
@ApiTags('Field Officer - Comprehensive Surveys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('field-officer/comprehensive-surveys')
export class ComprehensiveSurveyController {
    constructor(private readonly surveyService: ComprehensiveSurveyService) { }

    @Post()
    @Roles(Role.FIELD_OFFICER)
    @ApiOperation({
        summary: 'Submit comprehensive survey (8 steps)',
        description: 'Field officers use this endpoint to submit detailed survey data collected through the 8-step survey wizard'
    })
    @ApiResponse({
        status: 201,
        description: 'Comprehensive survey submitted successfully',
        type: ComprehensiveSurveyResponseDto
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Field Officer role required' })
    async submitSurvey(
        @Req() req: any,
        @Body() surveyDto: ComprehensiveSurveyDto
    ): Promise<ComprehensiveSurveyResponseDto> {
        const userId = req.user.id;
        return this.surveyService.submitComprehensiveSurvey(userId, surveyDto);
    }

    @Get('my-surveys')
    @Roles(Role.FIELD_OFFICER)
    @ApiOperation({
        summary: 'Get my comprehensive surveys',
        description: 'Retrieve all comprehensive surveys submitted by the current field officer'
    })
    @ApiResponse({
        status: 200,
        description: 'List of comprehensive surveys',
        type: [ComprehensiveSurveyResponseDto]
    })
    async getMySurveys(@Req() req: any): Promise<ComprehensiveSurveyResponseDto[]> {
        const userId = req.user.id;
        return this.surveyService.getFieldOfficerSurveys(userId);
    }

    @Get(':id')
    @Roles(Role.FIELD_OFFICER, Role.SUPERVISOR, Role.ADMIN)
    @ApiOperation({
        summary: 'Get comprehensive survey by ID',
        description: 'Retrieve a specific comprehensive survey by its ID'
    })
    @ApiResponse({
        status: 200,
        description: 'Comprehensive survey details',
        type: ComprehensiveSurveyResponseDto
    })
    @ApiResponse({ status: 404, description: 'Survey not found' })
    async getSurvey(@Param('id') id: string): Promise<ComprehensiveSurveyResponseDto> {
        return this.surveyService.getSurveyById(id);
    }
}
