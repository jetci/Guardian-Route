import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) { }

  /**
   * Get current settings (singleton pattern)
   * If no settings exist, create default settings
   */
  async getSettings() {
    let settings = await this.prisma.settings.findFirst();

    if (!settings) {
      // Create default settings if none exist
      settings = await this.prisma.settings.create({
        data: {},
      });
    }

    return settings;
  }

  /**
   * Update settings
   * Only one settings record should exist (singleton)
   */
  async updateSettings(updateSettingsDto: UpdateSettingsDto) {
    const settings = await this.getSettings();

    const updated = await this.prisma.settings.update({
      where: { id: settings.id },
      data: updateSettingsDto,
    });

    return updated;
  }

  /**
   * Trigger manual backup
   */
  async triggerBackup() {
    try {
      // 1. Fetch all villages with boundaries
      const villages = await this.prisma.village.findMany({
        include: {
          incidents: true,
          surveys: true,
        },
      });

      // 2. Create backup object
      const backupData = {
        timestamp: new Date().toISOString(),
        type: 'FULL_BACKUP',
        data: {
          villages,
          settings: await this.getSettings(),
        },
      };

      // 3. Generate filename
      const date = new Date();
      const filename = `village-backup-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}.json`;
      const backupPath = path.join(process.cwd(), 'storage', 'backups', filename);

      // 4. Ensure directory exists
      const backupDir = path.dirname(backupPath);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // 5. Write file
      fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

      return {
        message: 'Backup triggered successfully',
        filename,
        path: backupPath,
        size: fs.statSync(backupPath).size
      };
    } catch (error) {
      console.error('Backup failed:', error);
      throw new Error('Failed to create backup: ' + error.message);
    }
  }

  /**
   * Purge old data based on retention policy
   */
  async purgeOldData() {
    const settings = await this.getSettings();
    const retentionDays = settings.dataRetentionDays || 365;
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - retentionDays);

    let deletedFiles = 0;
    let deletedSpace = 0;

    try {
      // 1. Purge old backup files
      const backupDir = path.join(process.cwd(), 'storage', 'backups');
      if (fs.existsSync(backupDir)) {
        const files = fs.readdirSync(backupDir);

        for (const file of files) {
          const filePath = path.join(backupDir, file);
          const stats = fs.statSync(filePath);

          if (stats.ctime < retentionDate) {
            deletedSpace += stats.size;
            fs.unlinkSync(filePath);
            deletedFiles++;
          }
        }
      }

      // 2. Purge old database records (Optional - based on requirements)
      // For now, we only focus on file backups as requested

      return {
        message: 'Old data purged successfully',
        retentionDate: retentionDate.toISOString(),
        deletedFiles,
        freedSpaceBytes: deletedSpace
      };
    } catch (error) {
      console.error('Purge failed:', error);
      throw new Error('Failed to purge old data: ' + error.message);
    }
  }

  /**
   * Get list of available backups
   */
  async getBackups() {
    const backupDir = path.join(process.cwd(), 'storage', 'backups');
    if (!fs.existsSync(backupDir)) {
      return [];
    }

    const files = fs.readdirSync(backupDir);
    return files.map(file => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      return {
        filename: file,
        size: stats.size,
        createdAt: stats.birthtime,
      };
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get backup file path
   */
  getBackupPath(filename: string) {
    const backupPath = path.join(process.cwd(), 'storage', 'backups', filename);
    if (!fs.existsSync(backupPath)) {
      throw new NotFoundException('Backup file not found');
    }
    return backupPath;
  }

  /**
   * Factory reset - restore all settings to default
   * WARNING: This is a destructive operation!
   */
  async factoryReset() {
    const settings = await this.getSettings();

    // TODO: Create backup before reset

    // Reset to default values
    const reset = await this.prisma.settings.update({
      where: { id: settings.id },
      data: {
        // General
        systemName: 'Guardian Route',
        timezone: 'Asia/Bangkok',
        maintenanceMode: false,
        maintenanceMessage: null,

        // Security
        enforce2FA: false,
        minPasswordLength: 8,
        sessionTimeout: 30,
        ipAllowlist: null,

        // Map & GIS
        defaultLat: 19.9167,
        defaultLng: 99.2333,
        defaultZoom: 13,
        defaultBaseLayer: 'street',
        customTileServer: null,
        enableWeatherRadar: false,

        // Notifications
        emailOnNewIncident: true,
        smsOnHighSeverity: false,
        dailyEmailSummary: true,
        enableLineNotify: false,
        lineNotifyToken: null,

        // API
        weatherApiKey: null,
        smsGatewayApiKey: null,
        maxRequestsPerMinute: 60,
        blockDuration: 300,

        // Data
        dataRetentionDays: 365,
        backupFrequency: 'daily',
      },
    });

    return {
      message: 'Factory reset completed successfully',
      settings: reset,
    };
  }
}
