import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, IsNotEmpty } from 'class-validator';

export class CreateVillageDto {
  @ApiProperty({ example: 'บ้านสันทราย', description: 'ชื่อหมู่บ้าน' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: 'หมู่ที่' })
  @IsNumber()
  @Min(1)
  villageNo: number;

  @ApiProperty({ example: 19.9167, description: 'Latitude (will be converted to centerPoint)', required: false })
  @IsNumber()
  @IsOptional()
  lat?: number;

  @ApiProperty({ example: 99.2333, description: 'Longitude (will be converted to centerPoint)', required: false })
  @IsNumber()
  @IsOptional()
  lng?: number;

  @ApiProperty({ example: 1500, description: 'จำนวนประชากรรวม', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  population?: number;

  @ApiProperty({ example: 750, description: 'จำนวนประชากรชาย (will be saved as populationMale)', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  malePopulation?: number;

  @ApiProperty({ example: 750, description: 'จำนวนประชากรหญิง (will be saved as populationFemale)', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  femalePopulation?: number;

  @ApiProperty({ example: 350, description: 'จำนวนครัวเรือน', required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  households?: number;

  @ApiProperty({ example: 'เชียงใหม่', description: 'จังหวัด (stored in alternateNames)', required: false })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty({ example: 'ฝาง', description: 'อำเภอ (stored in alternateNames)', required: false })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiProperty({ example: 'เวียง', description: 'ตำบล (stored in alternateNames)', required: false })
  @IsString()
  @IsOptional()
  subdistrict?: string;
}
