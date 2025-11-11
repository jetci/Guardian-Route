import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VillagesModule } from './villages/villages.module';
import { IncidentsModule } from './incidents/incidents.module';
import { TasksModule } from './tasks/tasks.module';
import { SurveyModule } from './survey/survey.module';
import { UploadModule } from './upload/upload.module';
import { ReportModule } from './report/report.module';
import { CommonModule } from './common/common.module';
import { LoggerModule } from './common/logger/logger.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalysisModule } from './analysis/analysis.module';
import { AdminModule } from './admin/admin.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { EventsModule } from './events/events.module';
import { ResourceModule } from './resource/resource.module';
import { ResourcesModule } from './resources/resources.module';
import { KpiModule } from './kpi/kpi.module';
import { ExportModule } from './export/export.module';
import { OverlayModule } from './overlay/overlay.module';
import { ExportHistoryModule } from './export-history/export-history.module';
import { ExportStatsModule } from './export-stats/export-stats.module';
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      ttl: 60 * 1000, // 60 seconds
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute (global default)
    }]),
    DatabaseModule,
    CommonModule,
    LoggerModule,
    AuthModule,
    UsersModule,
    VillagesModule,
    IncidentsModule,
    TasksModule,
    UploadModule,
    SurveyModule,
    ReportModule,
    AnalyticsModule,
    NotificationsModule,
    AnalysisModule,
    AdminModule,
    AuditLogModule,
    EventsModule,
    ResourceModule,
    ResourcesModule,
    KpiModule,
    ExportModule,
    OverlayModule,
    MonitoringModule,
    ExportHistoryModule,
    ExportStatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
