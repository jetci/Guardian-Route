import { ApiProperty } from '@nestjs/swagger';

export class UploadPhotoDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class PhotoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  uploadedAt: Date;
}
