import { Module } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { PhotosService } from './photos.service';
import { IncidentsController } from './incidents.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [IncidentsController],
  providers: [IncidentsService, PhotosService],
  exports: [IncidentsService],
})
export class IncidentsModule {}
