import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../../tasks/dto/create-task.dto';

export class TaskStatusMetricDto {
  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty({ description: 'Number of tasks with this status' })
  count: number;

  @ApiProperty({ description: 'Percentage of total tasks' })
  percentage: number;
}

export class TaskStatusResponseDto {
  @ApiProperty({ type: [TaskStatusMetricDto] })
  metrics: TaskStatusMetricDto[];

  @ApiProperty({ description: 'Total number of tasks' })
  total: number;

  @ApiProperty({ description: 'Timestamp when data was generated' })
  generatedAt: Date;
}
