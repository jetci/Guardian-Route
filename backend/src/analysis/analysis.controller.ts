import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AnalysisService } from './analysis.service';
import { OverlayAnalysisDto } from './dto/overlay-analysis.dto';

@Controller('analysis')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('overlay')
  @Roles('ADMIN', 'SUPERVISOR', 'EXECUTIVE')
  async analyzeOverlay(@Body() dto: OverlayAnalysisDto) {
    return this.analysisService.analyzeOverlay(dto);
  }

  @Get('history')
  @Roles('ADMIN', 'SUPERVISOR', 'EXECUTIVE')
  async getHistory(@Req() req: any) {
    return this.analysisService.getAnalysisHistory(req.user.userId);
  }
}
