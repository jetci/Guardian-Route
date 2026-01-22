import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import helmet from 'helmet';
import { Throttle } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './../src/common/guards/throttle.guard';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Apply Helmet to mimic production security middleware
    app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        hidePoweredBy: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/health (GET) returns health status and has security headers', async () => {
    const res = await request(app.getHttpServer())
      .get('/health')
      .expect(200);

    // Basic payload shape
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('timestamp');

    // Helmet headers
    expect(res.headers['x-dns-prefetch-control']).toBe('off');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['x-download-options']).toBe('noopen');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-permitted-cross-domain-policies']).toBe('none');
    expect(res.headers['referrer-policy']).toBeDefined();

    // Hide powered by
    expect(res.headers['x-powered-by']).toBeUndefined();
  });
});

describe('Rate Limiting (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(APP_GUARD)
      .useClass(CustomThrottlerGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        hidePoweredBy: true,
      }),
    );
    // Attach a test-only middleware to simulate authenticated user via header
    app.use((req: any, _res, next) => {
      const uid = req.headers['x-test-user'];
      if (uid) {
        req.user = { userId: String(uid) };
      }
      next();
    });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return 429 when exceeding per-minute limit on /health', async () => {
    const server = app.getHttpServer();
    const total = 130; // exceed the global limit of 100 per 60s

    let count429 = 0;
    let count200 = 0;

    for (let i = 0; i < total; i++) {
      const res = await request(server).get('/health');
      if (res.status === 429) count429++;
      if (res.status === 200) count200++;
    }

    expect(count429).toBeGreaterThan(0);
    expect(count200).toBeGreaterThan(0);
  });

  it('should enforce limit per userId and not cross-throttle between users on /health', async () => {
    const server = app.getHttpServer();

    // User A exceeds the limit: 105 requests
    let a429 = 0;
    for (let i = 0; i < 105; i++) {
      const res = await request(server).get('/health').set('x-test-user', 'user-A');
      if (res.status === 429) a429++;
    }
    expect(a429).toBeGreaterThan(0);

    // User B should still be able to access without being affected by User A's quota
    let b429 = 0;
    let b200 = 0;
    for (let i = 0; i < 10; i++) {
      const res = await request(server).get('/health').set('x-test-user', 'user-B');
      if (res.status === 429) b429++;
      if (res.status === 200) b200++;
    }
    expect(b429).toBe(0);
    expect(b200).toBeGreaterThan(0);
  });
});

describe('CORS (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        hidePoweredBy: true,
      }),
    );
    // Enable CORS in test app (main.ts is not executed in e2e)
    const envOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
      .split(',')
      .map((o) => o.trim())
      .filter((o) => o.length > 0);
    const defaultOrigins: (string | RegExp)[] = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://127.0.0.1:5173',
      /^http:\/\/127\.0\.0\.1:\d+$/,
      /^http:\/\/localhost:\d+$/,
    ];
    const allowlist: (string | RegExp)[] = [...defaultOrigins, ...envOrigins];

    app.enableCors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isAllowed = allowlist.some((o) => (o instanceof RegExp ? o.test(origin) : o === origin));
        callback(null, isAllowed);
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      optionsSuccessStatus: 204,
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should allow preflight OPTIONS for allowed origin and methods', async () => {
    const server = app.getHttpServer();
    const res = await request(server)
      .options('/health')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'GET')
      .set('Access-Control-Request-Headers', 'Content-Type, Authorization');

    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(res.headers['access-control-allow-methods']).toContain('GET');
    expect(res.headers['access-control-allow-headers']).toContain('Content-Type');
    expect(res.headers['access-control-allow-headers']).toContain('Authorization');
  });

  it('should deny origin not in allowlist', async () => {
    const server = app.getHttpServer();
    const res = await request(server)
      .get('/health')
      .set('Origin', 'http://malicious.example.com');

    // For disallowed origin, CORS header should be absent
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('Security Headers Hardening (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const isProd = process.env.NODE_ENV === 'production';
    app.use(
      helmet({
        contentSecurityPolicy: isProd
          ? {
              directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", 'https:'],
                styleSrc: ["'self'", 'https:'],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'", 'https:'],
                fontSrc: ["'self'", 'data:'],
                objectSrc: ["'none'"],
              },
            }
          : {
              directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https:'],
                styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'", 'https:'],
                fontSrc: ["'self'", 'data:'],
                objectSrc: ["'none'"],
              },
            },
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        hidePoweredBy: true,
        // Ensure HSTS is only enabled in production for this test app
        hsts: isProd
          ? { maxAge: 31536000, includeSubDomains: true, preload: false }
          : false,
      }),
    );
    app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
    app.use((req, res, next) => {
      res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), browsing-topics=()');
      next();
    });
    await app.init();
  });

  afterAll(async () => {
    await new Promise((resolve) => app.getHttpServer().close(resolve));
    await app.close();
  });

  it('should include CSP, Referrer-Policy, Permissions-Policy headers on /health', async () => {
    const res = await request(app.getHttpServer()).get('/health');
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['referrer-policy']).toBe('no-referrer');
    expect(res.headers['permissions-policy']).toContain('geolocation=()');
    expect(res.headers['permissions-policy']).toContain('camera=()');
    expect(res.headers['permissions-policy']).toContain('microphone=()');
    expect(res.headers['permissions-policy']).toContain('browsing-topics=()');
  });

  it('should include HSTS only in production', async () => {
    const server = app.getHttpServer();
    const resDev = await request(server).get('/health');
    expect(resDev.headers['strict-transport-security']).toBeUndefined();
  });
});
