/**
 * Generate OpenAPI Specification
 * This script generates openapi.json from NestJS Swagger decorators
 * 
 * Usage: ts-node src/generate-openapi.ts
 */

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function generateOpenApiSpec() {
  console.log('🚀 Starting OpenAPI spec generation...\n');

  // Create NestJS application
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'], // Reduce log noise
  });

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Guardian Route API')
    .setDescription(`
      Guardian Route - ระบบบริหารจัดการภัยพิบัติ
      ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
      
      ## Authentication
      Most endpoints require JWT Bearer token authentication.
      Use the /api/auth/login endpoint to obtain a token.
      
      ## Roles
      - DEVELOPER: Full system access
      - ADMIN: System administration
      - SUPERVISOR: Command and control
      - EXECUTIVE: Strategic oversight
      - FIELD_OFFICER: Field operations
      
      ## Base URL
      - Development: http://localhost:3001/api
      - Production: https://api.guardian-route.example.com/api
    `)
    .setVersion('1.0.0')
    .setContact(
      'Guardian Route Team',
      'https://github.com/jetci/Guardian-Route',
      'support@guardian-route.example.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Users', 'User management')
    .addTag('incidents', 'Incident management')
    .addTag('reports', 'Report management')
    .addTag('tasks', 'Task management')
    .addTag('villages', 'Village and boundary data')
    .addTag('analytics', 'Analytics and statistics')
    .addTag('Notifications', 'Notification system')
    .addTag('settings', 'System settings')
    .addTag('Surveys', 'Survey management')
    .addTag('Survey Templates', 'Survey template management')
    .addTag('upload', 'File upload')
    .addServer('http://localhost:3001', 'Development server')
    .addServer('https://api.guardian-route.example.com', 'Production server')
    .build();

  // Generate OpenAPI document
  const document = SwaggerModule.createDocument(app, config);

  // Output paths
  const backendOutputPath = path.join(process.cwd(), 'openapi.json');
  const frontendOutputPath = path.join(process.cwd(), '..', 'frontend', 'public', 'openapi.json');

  // Write to backend directory
  fs.writeFileSync(
    backendOutputPath,
    JSON.stringify(document, null, 2),
    'utf-8'
  );
  console.log(`✅ Generated: ${backendOutputPath}`);

  // Write to frontend public directory
  try {
    const frontendPublicDir = path.dirname(frontendOutputPath);
    if (!fs.existsSync(frontendPublicDir)) {
      fs.mkdirSync(frontendPublicDir, { recursive: true });
    }
    fs.writeFileSync(
      frontendOutputPath,
      JSON.stringify(document, null, 2),
      'utf-8'
    );
    console.log(`✅ Generated: ${frontendOutputPath}`);
  } catch (error) {
    console.warn(`⚠️  Could not write to frontend directory: ${error.message}`);
  }

  // Print statistics
  const endpoints = Object.keys(document.paths || {}).length;
  const tags = (document.tags || []).length;
  const schemas = Object.keys(document.components?.schemas || {}).length;

  console.log('\n📊 OpenAPI Specification Statistics:');
  console.log(`   • Endpoints: ${endpoints}`);
  console.log(`   • Tags: ${tags}`);
  console.log(`   • Schemas: ${schemas}`);
  console.log(`   • Version: ${document.info.version}`);

  console.log('\n✅ OpenAPI spec generation completed!\n');
  console.log('📚 View API docs at: http://localhost:3001/api/docs');
  console.log('📄 OpenAPI JSON: http://localhost:3001/api/docs-json\n');

  await app.close();
  process.exit(0);
}

// Run the generator
generateOpenApiSpec().catch((error) => {
  console.error('❌ Error generating OpenAPI spec:', error);
  process.exit(1);
});
