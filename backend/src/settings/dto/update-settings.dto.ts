import { IsString, IsBoolean, IsInt, IsOptional, Min, Max, IsIn } from 'class-validator';

export class UpdateSettingsDto {
  // General Settings
  @IsOptional()
  @IsString()
  systemName?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Asia/Bangkok', 'Asia/Singapore', 'UTC'])
  timezone?: string;

  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @IsOptional()
  @IsString()
  maintenanceMessage?: string;

  // Security Settings
  @IsOptional()
  @IsBoolean()
  enforce2FA?: boolean;

  @IsOptional()
  @IsInt()
  @Min(8)
  @Max(32)
  minPasswordLength?: number;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(120)
  sessionTimeout?: number;

  @IsOptional()
  @IsString()
  ipAllowlist?: string;

  // Map & GIS Settings
  @IsOptional()
  defaultLat?: number;

  @IsOptional()
  defaultLng?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18)
  defaultZoom?: number;

  @IsOptional()
  @IsString()
  @IsIn(['satellite', 'street'])
  defaultBaseLayer?: string;

  @IsOptional()
  @IsString()
  customTileServer?: string;

  @IsOptional()
  @IsBoolean()
  enableWeatherRadar?: boolean;

  // Notification Settings
  @IsOptional()
  @IsBoolean()
  emailOnNewIncident?: boolean;

  @IsOptional()
  @IsBoolean()
  smsOnHighSeverity?: boolean;

  @IsOptional()
  @IsBoolean()
  dailyEmailSummary?: boolean;

  @IsOptional()
  @IsBoolean()
  enableLineNotify?: boolean;

  @IsOptional()
  @IsString()
  lineNotifyToken?: string;

  // API Settings
  @IsOptional()
  @IsString()
  weatherApiKey?: string;

  @IsOptional()
  @IsString()
  smsGatewayApiKey?: string;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(1000)
  maxRequestsPerMinute?: number;

  @IsOptional()
  @IsInt()
  @Min(60)
  @Max(3600)
  blockDuration?: number;

  // Data Settings
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(3650)
  dataRetentionDays?: number;

  @IsOptional()
  @IsString()
  @IsIn(['daily', 'weekly', 'monthly', 'disabled'])
  backupFrequency?: string;
}
