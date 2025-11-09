import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GeoJsonService } from './geojson.service';
import { SystemSettingsService } from './system-settings.service';
import { GeoJsonHistoryService } from './geojson-history.service';
import { SettingsNotificationService } from './settings-notification.service';
import { CustomLayerService } from './custom-layer.service';
import { AdminController } from './admin.controller';
import { PrismaService } from '../database/prisma.service';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [AuditLogModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    GeoJsonService,
    SystemSettingsService,
    GeoJsonHistoryService,
    SettingsNotificationService,
    CustomLayerService,
    PrismaService,
  ],
  exports: [
    AdminService,
    GeoJsonService,
    SystemSettingsService,
    GeoJsonHistoryService,
    SettingsNotificationService,
    CustomLayerService,
  ],
})
export class AdminModule {}
