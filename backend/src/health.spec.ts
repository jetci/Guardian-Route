const express = require('express');
const request = require('supertest');
import { createHealthHandler } from './main';
import { PrismaService } from './database/prisma.service';

describe('Health handler (unit, mocked Prisma)', () => {
  it('returns ok when Prisma ping succeeds', async () => {
    const mockPrisma = { $queryRawUnsafe: jest.fn().mockResolvedValue(1) } as unknown as PrismaService;
    const app = express();
    app.get('/api/health', createHealthHandler(mockPrisma));

    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.db).toBeDefined();
    expect(res.body.db.ok).toBe(true);
    expect(res.body.status).toBe('ok');
  });

  it('returns degraded when Prisma ping fails', async () => {
    const mockPrisma = { $queryRawUnsafe: jest.fn().mockRejectedValue(new Error('db down')) } as unknown as PrismaService;
    const app = express();
    app.get('/api/health', createHealthHandler(mockPrisma));

    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.db).toBeDefined();
    expect(res.body.db.ok).toBe(false);
    expect(res.body.status).toBe('degraded');
    expect(res.body.db.error).toMatch(/db down/);
  });
});
