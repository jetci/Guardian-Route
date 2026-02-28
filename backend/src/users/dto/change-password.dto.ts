import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldpassword123', description: 'Current password' })
  @IsString()
  @MinLength(1)
  currentPassword: string;

  @ApiProperty({ example: 'newpassword123', description: 'New password (min 6 characters)' })
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;

  @ApiProperty({ example: 'newpassword123', description: 'Confirm new password' })
  @IsString()
  @MinLength(6)
  confirmPassword: string;
}
