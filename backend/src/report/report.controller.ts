import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { CreateFullReportWizardDto } from './dto/create-full-report-wizard.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { FilterReportDto } from './dto/filter-report.dto';
import { SubmitReportDto } from './dto/submit-report.dto';
import { ReviewReportDto } from './dto/review-report.dto';
import { GeneratePdfDto } from './dto/generate-pdf.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, ReportType } from '@prisma/client';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({
    status: 201,
    description: 'Report created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  create(@Body() createReportDto: CreateReportDto, @Request() req) {
    return this.reportService.create(createReportDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Reports retrieved successfully',
  })
  findAll(@Query() filterDto: FilterReportDto) {
    return this.reportService.findAll(filterDto);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get report statistics' })
  @ApiQuery({
    name: 'periodStart',
    required: false,
    description: 'Start date for statistics',
  })
  @ApiQuery({
    name: 'periodEnd',
    required: false,
    description: 'End date for statistics',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ReportType,
    description: 'Filter by report type',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  getStatistics(
    @Query('periodStart') periodStart?: string,
    @Query('periodEnd') periodEnd?: string,
    @Query('type') type?: ReportType,
  ) {
    return this.reportService.getStatistics({
      periodStart,
      periodEnd,
      type,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a report by ID' })
  @ApiParam({
    name: 'id',
    description: 'Report ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Report retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a report' })
  @ApiParam({
    name: 'id',
    description: 'Report ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Report updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only update own reports',
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
    @Request() req,
  ) {
    return this.reportService.update(
      id,
      updateReportDto,
      req.user.id,
      req.user.role,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a report' })
  @ApiParam({
    name: 'id',
    description: 'Report ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Report deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only delete own reports',
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  remove(@Param('id') id: string, @Request() req) {
    return this.reportService.remove(id, req.user.id, req.user.role);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit a report for review' })
  @ApiParam({
    name: 'id',
    description: 'Report ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Report submitted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - report cannot be submitted',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only submit own reports',
  })
  submit(
    @Param('id') id: string,
    @Body() submitDto: SubmitReportDto,
    @Request() req,
  ) {
    return this.reportService.submit(id, req.user.id);
  }

  @Post(':id/review')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.SUPERVISOR, Role.EXECUTIVE, Role.ADMIN)
  @ApiOperation({ summary: 'Review a report (SUPERVISOR, EXECUTIVE, ADMIN only)' })
  @ApiParam({
    name: 'id',
    description: 'Report ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Report reviewed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - report cannot be reviewed',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  review(
    @Param('id') id: string,
    @Body() reviewDto: ReviewReportDto,
    @Request() req,
  ) {
    return this.reportService.review(
      id,
      reviewDto,
      req.user.id,
      req.user.role,
    );
  }

  @Post(':id/generate-pdf')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate PDF for a report' })
  @ApiParam({
    name: 'id',
    description: 'Report ID',
  })
  @ApiResponse({
    status: 200,
    description: 'PDF generated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  generatePdf(
    @Param('id') id: string,
    @Body() generatePdfDto: GeneratePdfDto,
  ) {
    return this.reportService.generatePdf(id, generatePdfDto);
  }
}

  @Get('drafts/my-drafts')
  @ApiOperation({ summary: 'Get current user\'s report drafts' })
  @ApiResponse({
    status: 200,
    description: 'Drafts retrieved successfully',
  })
  getMyDrafts(@Request() req) {
    return this.reportService.getMyDrafts(req.user.id);
  }

  @Post('drafts')
  @ApiOperation({ summary: 'Save a report draft' })
  @ApiResponse({
    status: 201,
    description: 'Draft saved successfully',
  })
  saveDraft(@Body() saveDraftDto: any, @Request() req) {
    return this.reportService.saveDraft(saveDraftDto, req.user.id);
  }

  @Get('preliminary-data/:taskId')
  @ApiOperation({ summary: 'Get preliminary survey data for a task' })
  @ApiParam({
    name: 'taskId',
    description: 'Task ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Preliminary data retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Task or preliminary data not found',
  })
  getPreliminaryData(@Param('taskId') taskId: string) {
    return this.reportService.getPreliminaryData(taskId);
  }

  @Post('analyze-images')
  @ApiOperation({ summary: 'Analyze images using Gemini AI' })
  @ApiResponse({
    status: 200,
    description: 'Images analyzed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - no images provided',
  })
  analyzeImages(@Body() body: { imageUrls: string[] }) {
    return this.reportService.analyzeImages(body.imageUrls);
  }

  @Post('full-wizard')
  @ApiOperation({ summary: 'Create full report from wizard' })
  @ApiResponse({
    status: 201,
    description: 'Full report created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not authorized for this task',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  createFullReportFromWizard(
    @Body() createFullReportDto: CreateFullReportWizardDto,
    @Request() req,
  ) {
    return this.reportService.createFullReportFromWizard(
      createFullReportDto,
      req.user.id,
    );
  }
