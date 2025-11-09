import { ApiProperty } from '@nestjs/swagger';
import { IncidentStatus } from '@prisma/client';

export class IncidentsByStatusDto {
  @ApiProperty({ enum: IncidentStatus, example: 'PENDING' })
  status: IncidentStatus;

  @ApiProperty({ example: 25 })
  count: number;
}
