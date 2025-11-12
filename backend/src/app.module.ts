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
