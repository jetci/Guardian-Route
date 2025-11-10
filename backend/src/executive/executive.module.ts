import { Module } from '@nestjs/common';
import { ExecutiveController } from './executive.controller';
import { ExecutiveService } from './executive.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [ExecutiveController],
  providers: [ExecutiveService, PrismaService],
  exports: [ExecutiveService],
})
export class ExecutiveModule {}
