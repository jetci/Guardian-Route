import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

export enum GeoBoundaryType {
  VILLAGE = 'village',
  DISTRICT = 'district',
  PROVINCE = 'province',
  CUSTOM = 'custom',
}

export enum UploadMode {
  OVERWRITE = 'overwrite',
  MERGE = 'merge',
}

export class UploadGeoJsonDto {
  @IsString()
  name: string;

  @IsEnum(GeoBoundaryType)
  type: GeoBoundaryType;

  @IsObject()
  geojson: any; // GeoJSON object

  @IsOptional()
  @IsObject()
  properties?: any;

  @IsOptional()
  @IsString()
  villageId?: string;

  @IsEnum(UploadMode)
  @IsOptional()
  mode?: UploadMode;
}
