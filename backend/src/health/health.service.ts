import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as os from 'os';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async getHealthStatus() {
    const startTime = Date.now();
    
    // Check database
    const dbHealthy = await this.checkDatabase();
    
    const responseTime = Date.now() - startTime;

    return {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbHealthy ? 'up' : 'down',
        api: 'up',
      },
    };
  }

  async getSystemStats() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    // Get active users count
    const activeUsers = await this.prisma.user.count({
      where: {
        // Add your active user criteria here
        // For example: lastLoginAt > 24 hours ago
      },
    });

    // Get total incidents
    const totalIncidents = await this.prisma.incident.count();

    // Get total tasks
    const totalTasks = await this.prisma.task.count();

    // Get total villages
    const totalVillages = await this.prisma.village.count();

    return {
      system: {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        loadAverage: os.loadavg(),
        uptime: os.uptime(),
      },
      memory: {
        total: this.formatBytes(totalMem),
        used: this.formatBytes(usedMem),
        free: this.formatBytes(freeMem),
        usagePercent: Math.round((usedMem / totalMem) * 100),
      },
      process: {
        uptime: process.uptime(),
        memory: {
          heapUsed: this.formatBytes(process.memoryUsage().heapUsed),
          heapTotal: this.formatBytes(process.memoryUsage().heapTotal),
          external: this.formatBytes(process.memoryUsage().external),
          rss: this.formatBytes(process.memoryUsage().rss),
        },
        pid: process.pid,
      },
      database: {
        status: await this.checkDatabase() ? 'connected' : 'disconnected',
        activeConnections: await this.getActiveConnections(),
      },
      statistics: {
        activeUsers,
        totalIncidents,
        totalTasks,
        totalVillages,
      },
    };
  }

  async getDatabaseHealth() {
    const isHealthy = await this.checkDatabase();
    const activeConnections = await this.getActiveConnections();

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      connected: isHealthy,
      activeConnections,
      timestamp: new Date().toISOString(),
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  private async getActiveConnections(): Promise<number> {
    try {
      // This is a simple count, adjust based on your needs
      const result = await this.prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count FROM pg_stat_activity
      `;
      return Number(result[0]?.count || 0);
    } catch (error) {
      return 0;
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
