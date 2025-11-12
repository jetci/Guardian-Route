import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GeoJsonService } from './geojson.service';
import { SystemSettingsService } from './system-settings.service';
import { AdminController } from './admin.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    GeoJsonService,
    SystemSettingsService,
    PrismaService,
  ],
  exports: [AdminService, GeoJsonService, SystemSettingsService],
})
export class AdminModule {}
