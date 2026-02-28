import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    const maxAttempts = 6;
    let attempt = 0;
    while (attempt < maxAttempts) {
      try {
        attempt += 1;
        await this.$connect();

        // Set client encoding to UTF-8 for Thai language support
        try {
          await this.$executeRawUnsafe(`SET CLIENT_ENCODING TO 'UTF8';`);
        } catch (encErr) {
          // non-fatal: log but continue
          // eslint-disable-next-line no-console
          console.warn('⚠️ Failed to set client encoding:', encErr?.message || encErr);
        }

        // eslint-disable-next-line no-console
        console.log('✅ Database connected with UTF-8 encoding');
        break;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Database connect attempt ${attempt} failed:`, err?.message || err);
        if (attempt >= maxAttempts) {
          // Bubble up after exhausting attempts so Nest can fail fast or be restarted by orchestrator
          throw err;
        }
        // Exponential backoff with jitter
        const backoff = Math.min(30000, 500 * 2 ** attempt);
        const jitter = Math.floor(Math.random() * 500);
        // eslint-disable-next-line no-console
        console.log(`Retrying DB connection in ${backoff + jitter}ms...`);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((res) => setTimeout(res, backoff + jitter));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Database disconnected');
  }
}
