import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export enum BroadcastType {
  EMERGENCY = 'EMERGENCY',
  ALERT = 'ALERT',
  INFO = 'INFO',
  UPDATE = 'UPDATE',
}

export enum BroadcastTarget {
  ALL_FIELD_OFFICERS = 'ALL_FIELD_OFFICERS',
  ALL_REPORTERS = 'ALL_REPORTERS',
  ALL_STAFF = 'ALL_STAFF',
  SPECIFIC_USERS = 'SPECIFIC_USERS',
}

export class CreateBroadcastDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty({ enum: BroadcastType })
  @IsEnum(BroadcastType)
  type: BroadcastType;

  @ApiProperty({ enum: BroadcastTarget })
  @IsEnum(BroadcastTarget)
  target: BroadcastTarget;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  userIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  incidentId?: string;
}
