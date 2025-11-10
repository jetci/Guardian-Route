import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsEnum } from 'class-validator';

// Define enums based on user requirements for clarity and validation
enum BroadcastPriority {
  URGENT = 'URGENT',
  NORMAL = 'NORMAL',
}

enum BroadcastTargetRole {
  FIELD_OFFICER = 'FIELD_OFFICER',
  ALL = 'ALL',
}

export class CreateBroadcastDto {
  @ApiProperty({
    description: 'The title of the broadcast message.',
    example: 'System Maintenance Alert',
    minLength: 5,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required.' })
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'The main content of the broadcast message.',
    example: 'The system will be down for maintenance tonight from 11 PM to 1 AM.',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty({ message: 'Message is required.' })
  @MinLength(10)
  @MaxLength(500)
  message: string;

  @ApiProperty({
    description: 'The priority of the broadcast.',
    enum: BroadcastPriority,
    example: BroadcastPriority.URGENT,
  })
  @IsEnum(BroadcastPriority)
  priority: BroadcastPriority;

  @ApiProperty({
    description: 'The target role for the broadcast. Can be a specific role or ALL.',
    enum: BroadcastTargetRole,
    example: BroadcastTargetRole.FIELD_OFFICER,
  })
  @IsEnum(BroadcastTargetRole)
  targetRole: BroadcastTargetRole;
}
