import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsService } from './incidents.service';
import { PrismaService } from '../database/prisma.service';
import { ActivityLogService } from '../common/services/activity-log.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { Priority, DisasterType } from '@prisma/client';

describe('IncidentsService Verification', () => {
    let service: IncidentsService;
    let prisma: PrismaService;

    const mockPrisma = {
        incident: {
            create: jest.fn(),
        },
    };

    const mockActivityLogService = { log: jest.fn() };
    const mockNotificationsService = { notifyIncidentAssigned: jest.fn() };
    const mockNotificationsGateway = { sendToUser: jest.fn() };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IncidentsService,
                { provide: PrismaService, useValue: mockPrisma },
                { provide: ActivityLogService, useValue: mockActivityLogService },
                { provide: NotificationsService, useValue: mockNotificationsService },
                { provide: NotificationsGateway, useValue: mockNotificationsGateway },
            ],
        }).compile();

        service = module.get<IncidentsService>(IncidentsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should map severity to priority and exclude severity from prisma call', async () => {
        const createDto: any = {
            title: 'Test Incident',
            disasterType: DisasterType.FLOOD,
            severity: 5, // Critical
            location: { type: 'Point', coordinates: [100, 20] },
        };

        mockPrisma.incident.create.mockResolvedValue({ id: '1', ...createDto });

        await service.create(createDto, 'user-1');

        expect(mockPrisma.incident.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    priority: Priority.CRITICAL, // Should be mapped from severity 5
                    title: 'Test Incident',
                }),
            })
        );

        // Verify severity is NOT in the data passed to Prisma
        const callArgs = mockPrisma.incident.create.mock.calls[0][0];
        expect(callArgs.data).not.toHaveProperty('severity');
    });
});
