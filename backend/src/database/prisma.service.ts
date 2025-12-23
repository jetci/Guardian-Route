import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    
    // Set client encoding to UTF-8 for Thai language support
    await this.$executeRawUnsafe(`SET CLIENT_ENCODING TO 'UTF8';`);
    
    console.log('✅ Database connected with UTF-8 encoding');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Database disconnected');
  }
}
