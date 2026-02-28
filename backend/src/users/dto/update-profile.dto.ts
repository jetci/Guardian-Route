import { IsString, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'สมชาย', description: 'First name' })
  @IsString()
  @IsOptional()
  @MinLength(1)
  firstName?: string;

  @ApiProperty({ example: 'ใจดี', description: 'Last name' })
  @IsString()
  @IsOptional()
  @MinLength(1)
  lastName?: string;

  @ApiProperty({ example: '0812345678', description: 'Phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'สำนักปลัด', description: 'Department', required: false })
  @IsString()
  @IsOptional()
  department?: string;
}
