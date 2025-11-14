
import { NestFactory } from '@nestjs/core';
import { Response } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174', 
      'http://localhost:5175',
      'http://127.0.0.1:5173',
      /^http:\/\/127\.0\.0\.1:\d+$/,  // Allow any port on 127.0.0.1 for browser preview
      /^http:\/\/localhost:\d+$/,      // Allow any port on localhost
    ],
    credentials: true,
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
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
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
  app.getHttpAdapter().get('/api/health', (req, res: Response) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      port: process.env.PORT || 3001,
    });
  });

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

bootstrap();
