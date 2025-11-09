import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuditLogService, AuditLogFilterDto } from './audit-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  /**
   * GET /api/admin/audit-logs
   * ดึงรายการ Audit Logs พร้อม Filter
   */
  @Get()
  async findAll(@Query() filter: AuditLogFilterDto) {
    const { userId, action, targetType, startDate, endDate, page, limit } =
      filter;

    return this.auditLogService.findAll({
      userId,
      action,
      targetType,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
  }

  /**
   * GET /api/admin/audit-logs/stats
   * ดึงสถิติ Audit Logs
   */
  @Get('stats')
  async getStats() {
    return this.auditLogService.getStats();
  }

  /**
   * GET /api/admin/audit-logs/export/csv
   * Export Audit Logs เป็น CSV
   */
  @Get('export/csv')
  async exportCsv(@Query() filter: AuditLogFilterDto, @Res() res: Response) {
    const { userId, action, targetType, startDate, endDate } = filter;

    const csvContent = await this.auditLogService.exportToCsv({
      userId,
      action,
      targetType,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=audit-logs-${new Date().toISOString()}.csv`,
    );
    res.status(HttpStatus.OK).send(csvContent);
  }

  /**
   * GET /api/admin/audit-logs/:id
   * ดึง Audit Log ตาม ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.auditLogService.findOne(id);
  }
}
