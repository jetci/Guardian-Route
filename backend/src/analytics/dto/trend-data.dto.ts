import { ApiProperty } from '@nestjs/swagger';

export class TrendDataDto {
  @ApiProperty()
  month: string; // e.g., "2025-01", "2025-02"

  @ApiProperty()
  count: number;

  @ApiProperty()
  avgResponseTime: number; // in hours
}

export class IncidentsByTypeDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  percentage: number;
}

export class CriticalIncidentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  priority: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  createdAt: Date;
}

export class RiskAreaDto {
  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  severity: number; // 1-5
}
