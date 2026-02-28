import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class OverlayAnalysisRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  incidentIds!: string[];
}