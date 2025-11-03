import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto, TaskStatus } from './create-task.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ enum: TaskStatus, description: 'Task status' })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
