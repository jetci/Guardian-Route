import { IsOptional, IsEnum, IsString, IsISO8601 } from 'class-validator';

export enum TaskStatus {
  PENDING_ASSIGNMENT = 'PENDING_ASSIGNMENT',
  IN_PROGRESS = 'IN_PROGRESS',
  SURVEYED = 'SURVEYED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum DisasterType {
  FLOOD = 'FLOOD',
  LANDSLIDE = 'LANDSLIDE',
  FIRE = 'FIRE',
  STORM = 'STORM',
  EARTHQUAKE = 'EARTHQUAKE',
  OTHER = 'OTHER',
}

export class SupervisorTaskQueryDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(DisasterType)
  incidentType?: DisasterType;

  @IsOptional()
  @IsISO8601()
  dateFrom?: string;

  @IsOptional()
  @IsISO8601()
  dateTo?: string;
}
