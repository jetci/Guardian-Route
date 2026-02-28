import { Module, forwardRef } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { PhotosService } from './photos.service';
import { IncidentsController } from './incidents.controller';
import { DatabaseModule } from '../database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => NotificationsModule)],
  controllers: [IncidentsController],
  providers: [IncidentsService, PhotosService],
  exports: [IncidentsService],
})
export class IncidentsModule {}
