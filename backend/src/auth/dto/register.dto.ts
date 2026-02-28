import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@obtwiang.go.th' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '081-234-5678', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    enum: Role,
    example: Role.FIELD_OFFICER,
    description: 'User role (only ADMIN can set this)',
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
