import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateResourceTypeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
