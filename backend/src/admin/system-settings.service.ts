import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateSystemSettingsDto } from './dto/system-settings.dto';


@Injectable()
export class SystemSettingsService {
  constructor(
    private prisma: PrismaService,
    
  ) {}

  /**
   * Get system settings
   */
  async getSettings() {
    const settings = await this.prisma.systemConfig.findMany();

    // Convert to object
    const settingsObj: any = {};
    settings.forEach((setting) => {
      settingsObj[setting.key] = setting.value;
    });

    return settingsObj;
  }

  /**
   * Get setting by key
   */
  async getSetting(key: string) {
    const setting = await this.prisma.systemConfig.findUnique({
      where: { key },
    });

    return setting?.value || null;
  }

  /**
   * Update system settings
   */
  async updateSettings(dto: UpdateSystemSettingsDto, adminUser: any) {
    const updates: any[] = [];

    // Map Config
    if (dto.mapConfig) {
      updates.push({
        key: 'mapConfig',
        value: dto.mapConfig,
      });
    }

    // Feature Toggles
    if (dto.geminiAiEnabled !== undefined) {
      updates.push({
        key: 'geminiAiEnabled',
        value: dto.geminiAiEnabled,
      });
    }

    if (dto.notificationsEnabled !== undefined) {
      updates.push({
        key: 'notificationsEnabled',
        value: dto.notificationsEnabled,
      });
    }

    if (dto.broadcastEnabled !== undefined) {
      updates.push({
        key: 'broadcastEnabled',
        value: dto.broadcastEnabled,
      });
    }

    // API Keys
    if (dto.geminiApiKey) {
      updates.push({
        key: 'geminiApiKey',
        value: dto.geminiApiKey,
      });
    }

    // System Info
    if (dto.systemName) {
      updates.push({
        key: 'systemName',
        value: dto.systemName,
      });
    }

    if (dto.systemLogo) {
      updates.push({
        key: 'systemLogo',
        value: dto.systemLogo,
      });
    }

    // Other Settings
    if (dto.sessionTimeout) {
      updates.push({
        key: 'sessionTimeout',
        value: dto.sessionTimeout,
      });
    }

    if (dto.maxUploadSize) {
      updates.push({
        key: 'maxUploadSize',
        value: dto.maxUploadSize,
      });
    }

    // Upsert all settings
    for (const update of updates) {
      await this.prisma.systemConfig.upsert({
        where: { key: update.key },
        update: { value: update.value },
        create: { key: update.key, value: update.value },
      });
    }

    // Audit log removed

    return this.getSettings();
  }

  /**
   * Reset settings to default
   */
  async resetToDefault(adminUser: any) {
    const defaultSettings = [
      {
        key: 'mapConfig',
        value: {
          centerLat: 18.7883,
          centerLng: 98.9853,
          defaultZoom: 13,
        },
      },
      {
        key: 'geminiAiEnabled',
        value: true,
      },
      {
        key: 'notificationsEnabled',
        value: true,
      },
      {
        key: 'broadcastEnabled',
        value: true,
      },
      {
        key: 'systemName',
        value: 'Guardian Route',
      },
      {
        key: 'sessionTimeout',
        value: 60,
      },
      {
        key: 'maxUploadSize',
        value: 10,
      },
    ];

    // Delete all existing settings
    await this.prisma.systemConfig.deleteMany();

    // Create default settings
    for (const setting of defaultSettings) {
      await this.prisma.systemConfig.create({
        data: setting,
      });
    }

    return this.getSettings();
  }

  /**
   * Delete setting by key
   */
  async deleteSetting(key: string, adminUser: any) {
    await this.prisma.systemConfig.delete({
      where: { key },
    });

    return { message: 'ลบการตั้งค่าสำเร็จ' };
  }
}
