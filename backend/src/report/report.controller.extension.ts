import {
  Controller,
  Post,
  Body,
  Param,
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
} from '@nestjs/swagger';
import { ReportServiceExtension } from './report.service.extension';
import { CreateFullReportDto } from './dto/create-full-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportControllerExtension {
  constructor(private readonly reportServiceExt: ReportServiceExtension) {}

  @Post('full')
  @Roles(Role.FIELD_OFFICER, Role.SUPERVISOR, Role.ADMIN)
  @ApiOperation({ summary: 'Create full report with AI analysis' })
  @ApiResponse({
    status: 201,
    description: 'Full report created successfully',
  })
  createFullReport(
    @Body() createFullReportDto: CreateFullReportDto,
    @Request() req,
  ) {
    return this.reportServiceExt.createFullReport(
      createFullReportDto,
      req.user.id,
    );
  }

  @Post(':id/submit')
  @Roles(Role.FIELD_OFFICER, Role.SUPERVISOR, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit full report for review' })
  @ApiResponse({
    status: 200,
    description: 'Report submitted successfully',
  })
  submitFullReport(@Param('id') id: string, @Request() req) {
    return this.reportServiceExt.submitFullReport(id, req.user.id);
  }

  @Post('ai-analysis')
  @Roles(Role.FIELD_OFFICER, Role.SUPERVISOR, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request AI analysis for report data' })
  @ApiResponse({
    status: 200,
    description: 'AI analysis generated',
  })
  requestAIAnalysis(
    @Body()
    data: {
      title: string;
      description: string;
      severity: string;
      affectedHouseholds: number;
      affectedPopulation: number;
      infrastructureDamage?: string;
      casualties?: number;
      injuries?: number;
    },
  ) {
    return this.reportServiceExt.requestAIAnalysis(data);
  }
}
