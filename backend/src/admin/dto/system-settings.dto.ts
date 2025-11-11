import { IsString, IsBoolean, IsNumber, IsOptional, IsObject } from 'class-validator';

export class UpdateSystemSettingsDto {
  @IsOptional()
  @IsObject()
  mapConfig?: {
    centerLat?: number;
    centerLng?: number;
    defaultZoom?: number;
  };

  @IsOptional()
  @IsBoolean()
  geminiAiEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  notificationsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  broadcastEnabled?: boolean;

  @IsOptional()
  @IsString()
  geminiApiKey?: string;

  @IsOptional()
  @IsString()
  systemName?: string;

  @IsOptional()
  @IsString()
  systemLogo?: string;

  @IsOptional()
  @IsNumber()
  sessionTimeout?: number; // minutes

  @IsOptional()
  @IsNumber()
  maxUploadSize?: number; // MB
}
