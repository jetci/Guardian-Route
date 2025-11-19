import { Module } from '@nestjs/common';
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
import { AdminModule } from './admin/admin.module';
import { SettingsModule } from './settings/settings.module';
// import { AnalyticsModule } from './analytics/analytics.module'; // Disabled - causing errors
// import { NotificationsModule } from './notifications/notifications.module'; // TODO: Add Notification models to Prisma schema
// import { AnalysisModule } from './analysis/analysis.module'; // Disabled - causing errors
// import { AuditLogModule } from './audit-log/audit-log.module'; // Disabled - causing errors

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    // AnalyticsModule, // Disabled - causing errors
    // NotificationsModule, // TODO: Uncomment when Notification models are added
    // AnalysisModule, // Disabled - causing errors
    // AuditLogModule, // Disabled - causing errors
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
