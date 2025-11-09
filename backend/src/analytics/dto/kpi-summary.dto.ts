import { ApiProperty } from '@nestjs/swagger';

export class KpiSummaryDto {
  @ApiProperty({ example: 150 })
  total: number;

  @ApiProperty({ example: 25 })
  pending: number;

  @ApiProperty({ example: 40 })
  investigating: number;

  @ApiProperty({ example: 85 })
  resolved: number;

  @ApiProperty({ example: '3.5h', description: 'Average resolution time in hours' })
  avgResolutionTime: string;
}
