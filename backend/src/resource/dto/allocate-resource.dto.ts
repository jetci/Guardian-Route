import { IsUUID, IsNotEmpty } from 'class-validator';

export class AllocateResourceDto {
  @IsUUID()
  @IsNotEmpty()
  taskId: string;
}
