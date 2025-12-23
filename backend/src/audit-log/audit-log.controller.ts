import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('audit-logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.DEVELOPER)
@Controller('admin/audit-logs')
export class AuditLogController {
    constructor(private readonly auditLogService: AuditLogService) { }

    @Get()
    @ApiOperation({ summary: 'Get all audit logs' })
    @ApiResponse({ status: 200, description: 'Return all audit logs.' })
    async findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('action') action?: string,
        @Query('targetType') targetType?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const skip = page && limit ? (Number(page) - 1) * Number(limit) : 0;
        const take = limit ? Number(limit) : 50;

        const where: any = {};
        if (action) where.action = action;
        if (targetType) where.targetType = targetType;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const [data, total] = await Promise.all([
            this.auditLogService.findAll({
                skip,
                take,
                where,
                orderBy: { createdAt: 'desc' },
            }),
            this.auditLogService.count({ where }),
        ]);

        return {
            data,
            total,
            page: Number(page) || 1,
            totalPages: Math.ceil(total / take),
        };
    }

    @Get('export/csv')
    @ApiOperation({ summary: 'Export audit logs to CSV' })
    async exportCsv(
        @Query('action') action?: string,
        @Query('targetType') targetType?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const where: any = {};
        if (action) where.action = action;
        if (targetType) where.targetType = targetType;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const logs = await this.auditLogService.findAll({
            where,
            orderBy: { createdAt: 'desc' },
        });

        const csvHeader = 'Date,User,Action,Target Type,Target ID,IP Address,Details\n';
        const csvRows = logs.map(log => {
            const date = log.createdAt.toISOString();
            const user = log.username || log.userId;
            const details = log.details ? JSON.stringify(log.details).replace(/"/g, '""') : '';
            return `"${date}","${user}","${log.action}","${log.targetType || ''}","${log.targetId || ''}","${log.ipAddress || ''}","${details}"`;
        }).join('\n');

        return csvHeader + csvRows;
    }
}
