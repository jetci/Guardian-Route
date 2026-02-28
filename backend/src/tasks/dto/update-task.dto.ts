import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto, TaskStatus } from './create-task.dto';
import { IsEnum, IsOptional, IsString, IsArray, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ enum: TaskStatus, description: 'Task status' })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ description: 'Survey location (GeoJSON Point)' })
  @IsObject()
  @IsOptional()
  surveyLocation?: any;

  @ApiPropertyOptional({ description: 'Survey area (GeoJSON Polygon)' })
  @IsObject()
  @IsOptional()
  surveyArea?: any;

  @ApiPropertyOptional({ description: 'Survey notes' })
  @IsString()
  @IsOptional()
  surveyNotes?: string;

  @ApiPropertyOptional({ description: 'Survey photos URLs', type: [String] })
  @IsArray()
  @IsOptional()
  surveyPhotos?: string[];
}
