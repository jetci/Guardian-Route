import { Controller, Get, Res, UseGuards, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('resources')
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.EXECUTIVE)
  streamResourceEvents(@Req() req: Request, @Res() res: Response): void {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for nginx

    // Generate unique client ID
    const clientId = `${req.user['id']}-${Date.now()}`;

    // Subscribe client
    this.eventsService.subscribe(clientId, res);
  }
}
