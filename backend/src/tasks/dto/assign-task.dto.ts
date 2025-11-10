import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTaskDto {
  @ApiProperty({
    description: 'ID of the officer to assign the task to',
    example: 'clx1234567890abcdefgh',
  })
  @IsString()
  @IsNotEmpty()
  officerId: string;
}
