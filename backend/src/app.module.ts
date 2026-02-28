import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditLogInterceptor } from './audit-log/audit-log.interceptor';
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
import { AdminModule } from './admin/admin.module';
import { SettingsModule } from './settings/settings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AnalysisModule } from './analysis/analysis.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { HealthModule } from './health/health.module';
import { CustomThrottlerGuard } from './common/guards/throttle.guard';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      ttl: 3600, // 1 hour default TTL
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute (global default)
      },
    ]),
    DatabaseModule,
    CommonModule,
    AuthModule,
    UsersModule,
    VillagesModule,
    IncidentsModule,
    TasksModule,
    UploadModule,
    SurveyModule,
    ReportModule,
    AdminModule,
    SettingsModule,
    NotificationsModule,
    AnalyticsModule,
    AnalysisModule,
    AuditLogModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule { }
