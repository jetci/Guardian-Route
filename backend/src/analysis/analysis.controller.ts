import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { OverlayAnalysisResultDto } from './analysis.service';
import { OverlayAnalysisRequestDto } from './dto/overlay-analysis.dto';

@ApiTags('analysis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERVISOR, Role.EXECUTIVE, Role.FIELD_OFFICER)
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('overlay')
  @ApiOperation({ summary: 'Analyze overlay areas of selected incidents' })
  async analyzeOverlay(@Body() body: OverlayAnalysisRequestDto): Promise<OverlayAnalysisResultDto> {
    return this.analysisService.analyzeOverlay(body);
  }
}