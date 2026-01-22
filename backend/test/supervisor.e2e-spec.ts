import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import helmet from 'helmet';
import { AppModule } from './../src/app.module';
import { JwtAuthGuard } from './../src/auth/guards/jwt-auth.guard';
import { IncidentsService } from './../src/incidents/incidents.service';
import { AuthService } from './../src/auth/auth.service';
import { IncidentStatus, DisasterType, Priority, Role } from '@prisma/client';

// Helper to build mock login response
function buildLoginResponse(role: Role) {
  return {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    user: {
      id: 'user-1',
      email: role === 'SUPERVISOR' ? 'supervisor@obtwiang.go.th' : 'field@obtwiang.go.th',
      firstName: 'Test',
      lastName: 'User',
      role,
    },
  };
}

describe('Supervisor Flows (e2e)', () => {
  let app: INestApplication;

  const incidentsServiceMock: Partial<IncidentsService> = {
    create: jest.fn(),
    assign: jest.fn(),
    review: jest.fn(),
  };

  const authServiceMock: Partial<AuthService> = {
    validateUser: jest.fn(async (email: string, password: string) => {
      if (
        (email === 'supervisor@obtwiang.go.th' || email === 'field@obtwiang.go.th') &&
        password === 'password123'
      ) {
        const role = email.startsWith('supervisor') ? Role.SUPERVISOR : Role.FIELD_OFFICER;
        return {
          id: 'user-1',
          email,
          firstName: 'Test',
          lastName: 'User',
          role,
          isActive: true,
        } as any;
      }
      throw new Error('Invalid credentials');
    }),
    login: jest.fn(async (user: any) => buildLoginResponse(user.role)),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          const roleHeader = req.headers['x-test-role'] as string | undefined;
          const role = (roleHeader as Role) || Role.SUPERVISOR;
          req.user = { id: 'user-1', role };
          return true;
        },
      })
      .overrideProvider(IncidentsService)
      .useValue(incidentsServiceMock)
      .overrideProvider(AuthService)
      .useValue(authServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        hidePoweredBy: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  it('POST /auth/login - supervisor credentials should login successfully', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'supervisor@obtwiang.go.th', password: 'password123' })
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user).toHaveProperty('role', 'SUPERVISOR');
    expect(authServiceMock.validateUser).toHaveBeenCalledWith(
      'supervisor@obtwiang.go.th',
      'password123',
    );
    expect(authServiceMock.login).toHaveBeenCalled();
  });

  it('SUPERVISOR can create incident', async () => {
    (incidentsServiceMock.create as jest.Mock).mockResolvedValue({
      id: 'incident-1',
      title: 'Test Flood Incident',
      status: IncidentStatus.PENDING,
      disasterType: DisasterType.FLOOD,
      priority: Priority.MEDIUM,
      location: { type: 'Point', coordinates: [100, 20] },
      createdById: 'user-1',
    });

    const payload = {
      title: 'Test Flood Incident',
      disasterType: 'FLOOD',
      location: { type: 'Point', coordinates: [100, 20] },
      description: 'น้ำท่วมขังบริเวณถนนสายหลัก ระดับน้ำสูงประมาณ 50 ซม.',
      priority: 'MEDIUM',
    };

    const res = await request(app.getHttpServer())
      .post('/incidents')
      .set('x-test-role', 'SUPERVISOR')
      .send(payload)
      .expect(201);

    expect(res.body).toHaveProperty('id', 'incident-1');
    expect(res.body).toHaveProperty('status', 'PENDING');
    expect(res.body).toHaveProperty('createdById', 'user-1');
    expect(incidentsServiceMock.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: payload.title }),
      'user-1',
    );
  });

  it('SUPERVISOR can assign incident to FIELD_OFFICER', async () => {
    (incidentsServiceMock.assign as jest.Mock).mockResolvedValue({
      id: 'incident-1',
      assignedToId: 'field-1',
      status: IncidentStatus.IN_PROGRESS,
    });

    const res = await request(app.getHttpServer())
      .patch('/incidents/incident-1/assign')
      .set('x-test-role', 'SUPERVISOR')
      .send({ fieldOfficerId: 'field-1', notes: 'Please investigate' })
      .expect(200);

    expect(res.body).toHaveProperty('assignedToId', 'field-1');
    expect(incidentsServiceMock.assign).toHaveBeenCalledWith(
      'incident-1',
      'field-1',
      'user-1',
      'Please investigate',
    );
  });

  it('FIELD_OFFICER cannot assign incident (403)', async () => {
    await request(app.getHttpServer())
      .patch('/incidents/incident-1/assign')
      .set('x-test-role', 'FIELD_OFFICER')
      .send({ fieldOfficerId: 'field-1', notes: 'Attempting assign' })
      .expect(403);
    expect(incidentsServiceMock.assign).not.toHaveBeenCalled();
  });

  it('SUPERVISOR can review incident - approve (IN_PROGRESS)', async () => {
    (incidentsServiceMock.review as jest.Mock).mockResolvedValue({
      id: 'incident-1',
      status: IncidentStatus.IN_PROGRESS,
      reviewNotes: 'เหตุการณ์มีความสำคัญ ควรดำเนินการโดยเร็ว',
    });

    const res = await request(app.getHttpServer())
      .patch('/incidents/incident-1/review')
      .set('x-test-role', 'SUPERVISOR')
      .send({
        status: 'IN_PROGRESS',
        reviewNotes: 'เหตุการณ์มีความสำคัญ ควรดำเนินการโดยเร็ว',
        additionalNotes: 'ติดต่อผู้ใหญ่บ้านเพื่อประสานงาน',
      })
      .expect(200);

    expect(res.body).toHaveProperty('status', 'IN_PROGRESS');
    expect(incidentsServiceMock.review).toHaveBeenCalledWith(
      'incident-1',
      expect.objectContaining({ status: 'IN_PROGRESS' }),
      'user-1',
    );
  });

  it('FIELD_OFFICER cannot review incident (403)', async () => {
    await request(app.getHttpServer())
      .patch('/incidents/incident-1/review')
      .set('x-test-role', 'FIELD_OFFICER')
      .send({ status: 'IN_PROGRESS', reviewNotes: 'Attempting review' })
      .expect(403);
    expect(incidentsServiceMock.review).not.toHaveBeenCalled();
  });
});