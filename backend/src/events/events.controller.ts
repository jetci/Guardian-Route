import { Controller, Get, UseGuards, Req, Sse, MessageEvent } from '@nestjs/common';
import type { Request } from 'express';
import { EventsService } from './events.service';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('notification-events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.EXECUTIVE)
  @Sse()
  streamEvents(): Observable<MessageEvent> {
    // The client will automatically close the connection if the token is invalid (handled by guards)
    // The EventsService now uses RxJS Subject to handle broadcasting to all connected clients.
    return this.eventsService.subscribeToEvents();
  }
}
