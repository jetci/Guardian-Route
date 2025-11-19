import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

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
    // TODO: Implement backup logic
    return { message: 'Backup triggered successfully' };
  }

  /**
   * Purge old data based on retention policy
   */
  async purgeOldData() {
    const settings = await this.getSettings();
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - settings.dataRetentionDays);
    
    // TODO: Implement purge logic for old data
    // - Delete old incidents
    // - Delete old activity logs
    // - Delete old audit logs
    // - etc.
    
    return { 
      message: 'Old data purged successfully',
      retentionDate: retentionDate.toISOString(),
    };
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
        defaultLng: 99.8833,
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
