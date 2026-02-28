
import { NestFactory } from '@nestjs/core';
import { Response } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma.service';
import type { Request, Response as ExResponse } from 'express';

export function createHealthHandler(prisma: PrismaService) {
  return async (req: Request, res: ExResponse) => {
    const result: any = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      port: process.env.PORT || 3001,
      db: { ok: false },
    };
    try {
      // simple lightweight check
      // @ts-ignore - use raw query for a fast DB ping
      await prisma.$queryRawUnsafe('SELECT 1');
      result.db.ok = true;
    } catch (err) {
      result.status = 'degraded';
      result.db.ok = false;
      result.db.error = err?.message || String(err);
    }
    res.json(result);
  };
}
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // UTF-8 encoding middleware - removed to avoid overriding Content-Type for HTML/JS/CSS assets (Swagger UI)
  // If needed, set charset per-response or rely on framework defaults.
  // app.use((req, res, next) => {
  //   res.setHeader('Content-Type', 'application/json; charset=utf-8');
  //   next();
  // });

  const isProd = process.env.NODE_ENV === 'production';
  // Enable security headers via Helmet
  app.use(
    helmet({
      // Enable CSP with directives compatible with environment
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
    }),
  );
  // Additional security headers
  app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
  // Only enable HSTS in production (should be served over HTTPS)
  if (process.env.NODE_ENV === 'production') {
    app.use(
      helmet.hsts({
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: false,
      }),
    );
  }
  // Permissions-Policy is not provided by helmet; set manually
  app.use((req, res, next) => {
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(), camera=(), microphone=(), browsing-topics=()'
    );
    next();
  });

  // CORS
  const envOriginsRaw = process.env.CORS_ALLOWED_ORIGINS || process.env.CORS_ORIGIN || '';
  const envOrigins = envOriginsRaw
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
      if (!origin) return callback(null, true); // allow same-origin and server-to-server
      const isAllowed = allowlist.some((o) => {
        if (o instanceof RegExp) return o.test(origin);
        return o === origin;
      });
      callback(null, isAllowed);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Static files (uploads)
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Guardian Route API')
    .setDescription('API for Guardian Route Dashboard')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Health check endpoint - ADD THIS!
  const prisma = app.get(PrismaService);
  app.getHttpAdapter().get('/api/health', createHealthHandler(prisma));

  // Start server
  const port = process.env.PORT || 3001; // Default to 3001
  await app.listen(port);

  console.log('');
  console.log('='.repeat(60));
  console.log(`🚀 Guardian Route API is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  console.log(`💚 Health check: http://localhost:${port}/api/health`);
  console.log('='.repeat(60));
  console.log('');
}

// Only auto-start when executed directly (prevents side effects during tests)
declare const require: any;
if (typeof require !== 'undefined' && require.main === module) {
  bootstrap();
}
