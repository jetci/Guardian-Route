import { ApiProperty } from '@nestjs/swagger';
import { DateGranularity } from './analytics-query.dto';

export class TaskTrendDataPointDto {
  @ApiProperty({ description: 'Date (ISO 8601)' })
  date: string;

  @ApiProperty({ description: 'Number of tasks created' })
  created: number;

  @ApiProperty({ description: 'Number of tasks completed' })
  completed: number;

  @ApiProperty({ description: 'Number of tasks in progress' })
  inProgress: number;

  @ApiProperty({ description: 'Number of pending tasks' })
  pending: number;
}

export class TaskTrendSummaryDto {
  @ApiProperty({ description: 'Total tasks created in period' })
  totalCreated: number;

  @ApiProperty({ description: 'Total tasks completed in period' })
  totalCompleted: number;

  @ApiProperty({ description: 'Completion rate percentage' })
  completionRate: number;

  @ApiProperty({ enum: ['UP', 'DOWN', 'STABLE'], description: 'Trend direction' })
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export class TaskTrendResponseDto {
  @ApiProperty({ type: [TaskTrendDataPointDto] })
  dataPoints: TaskTrendDataPointDto[];

  @ApiProperty({ enum: DateGranularity })
  granularity: DateGranularity;

  @ApiProperty({ type: TaskTrendSummaryDto })
  summary: TaskTrendSummaryDto;

  @ApiProperty({ description: 'Timestamp when data was generated' })
  generatedAt: Date;
}
