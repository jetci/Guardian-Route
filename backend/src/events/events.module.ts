import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { NotificationEventsController } from '../notification-events/notification-events.controller';
import { EventsService } from './events.service';

@Module({
  controllers: [EventsController, NotificationEventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
