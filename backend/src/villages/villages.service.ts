import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UploadGeoJsonDto, GeoJsonValidationResult, GeoJsonUploadResponse } from './dto/upload-geojson.dto';
import { CreateVillageDto } from './dto/create-village.dto';
import { UpdateVillageDto } from './dto/update-village.dto';
import * as turf from '@turf/turf';

@Injectable()
export class VillagesService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.village.findMany({
      orderBy: { villageNo: 'asc' },
      include: {
        _count: {
          select: {
            incidents: true,
            tasks: true,
            surveys: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.village.findUnique({
      where: { id },
      include: {
        incidents: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        tasks: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            incidents: true,
            tasks: true,
            surveys: true,
          },
        },
      },
    });
  }

  async findByVillageNo(villageNo: number) {
    return this.prisma.village.findUnique({
      where: { villageNo },
      include: {
        _count: {
          select: {
            incidents: true,
            tasks: true,
            surveys: true,
          },
        },
      },
    });
  }

  async getStatistics() {
    const villages = await this.prisma.village.findMany({
      select: {
        households: true,
        population: true,
        area: true,
      },
    });

    const totalHouseholds = villages.reduce(
      (sum, v) => sum + (v.households || 0),
      0,
    );
    const totalPopulation = villages.reduce(
      (sum, v) => sum + (v.population || 0),
      0,
    );
    const totalArea = villages.reduce(
      (sum, v) => sum + Number(v.area || 0),
      0,
    );

    return {
      totalVillages: villages.length,
      totalHouseholds,
      totalPopulation,
      totalArea: Number(totalArea.toFixed(2)),
      averageHouseholdsPerVillage: Math.round(totalHouseholds / villages.length),
      averagePopulationPerVillage: Math.round(totalPopulation / villages.length),
    };
  }

  async create(createVillageDto: CreateVillageDto) {
    // Check if villageNo already exists
    const existing = await this.prisma.village.findUnique({
      where: { villageNo: createVillageDto.villageNo },
    });

    if (existing) {
      throw new ConflictException(`Village with number ${createVillageDto.villageNo} already exists`);
    }

    // Transform DTO to match Prisma schema
    const villageData: any = {
      villageNo: createVillageDto.villageNo,
      name: createVillageDto.name,
      alternateNames: [],
    };

    // Build alternateNames array from province, district, subdistrict
    if (createVillageDto.province) {
      villageData.alternateNames.push(createVillageDto.province);
    }
    if (createVillageDto.district) {
      villageData.alternateNames.push(createVillageDto.district);
    }
    if (createVillageDto.subdistrict) {
      villageData.alternateNames.push(createVillageDto.subdistrict);
    }

    // Transform lat/lng to GeoJSON Point format for centerPoint
    if (createVillageDto.lat !== undefined && createVillageDto.lng !== undefined) {
      villageData.centerPoint = {
        type: 'Point',
        coordinates: [createVillageDto.lng, createVillageDto.lat], // GeoJSON format: [longitude, latitude]
      };
    }

    // Map population fields (frontend uses malePopulation/femalePopulation, schema uses populationMale/populationFemale)
    if (createVillageDto.malePopulation !== undefined) {
      villageData.populationMale = createVillageDto.malePopulation;
    }
    if (createVillageDto.femalePopulation !== undefined) {
      villageData.populationFemale = createVillageDto.femalePopulation;
    }

    // Add other optional fields
    if (createVillageDto.population !== undefined) {
      villageData.population = createVillageDto.population;
    }
    if (createVillageDto.households !== undefined) {
      villageData.households = createVillageDto.households;
    }

    return this.prisma.village.create({
      data: villageData,
    });
  }

  async update(id: string, updateVillageDto: UpdateVillageDto) {
    // Check if village exists
    const village = await this.prisma.village.findUnique({
      where: { id },
    });

    if (!village) {
      throw new NotFoundException(`Village with ID ${id} not found`);
    }

    // If updating villageNo, check for conflicts
    if (updateVillageDto.villageNo && updateVillageDto.villageNo !== village.villageNo) {
      const existing = await this.prisma.village.findUnique({
        where: { villageNo: updateVillageDto.villageNo },
      });

      if (existing) {
        throw new ConflictException(`Village with number ${updateVillageDto.villageNo} already exists`);
      }
    }

    // Transform DTO to match Prisma schema (similar to create)
    const villageData: any = {};

    // Update basic fields
    if (updateVillageDto.name !== undefined) {
      villageData.name = updateVillageDto.name;
    }
    if (updateVillageDto.villageNo !== undefined) {
      villageData.villageNo = updateVillageDto.villageNo;
    }

    // Build alternateNames array if any location field is provided
    if (updateVillageDto.province || updateVillageDto.district || updateVillageDto.subdistrict) {
      const alternateNames: string[] = [];
      if (updateVillageDto.province) alternateNames.push(updateVillageDto.province);
      if (updateVillageDto.district) alternateNames.push(updateVillageDto.district);
      if (updateVillageDto.subdistrict) alternateNames.push(updateVillageDto.subdistrict);
      villageData.alternateNames = alternateNames;
    }

    // Transform lat/lng to GeoJSON Point format for centerPoint
    if (updateVillageDto.lat !== undefined && updateVillageDto.lng !== undefined) {
      villageData.centerPoint = {
        type: 'Point',
        coordinates: [updateVillageDto.lng, updateVillageDto.lat],
      };
    }

    // Map population fields
    if (updateVillageDto.malePopulation !== undefined) {
      villageData.populationMale = updateVillageDto.malePopulation;
    }
    if (updateVillageDto.femalePopulation !== undefined) {
      villageData.populationFemale = updateVillageDto.femalePopulation;
    }
    if (updateVillageDto.population !== undefined) {
      villageData.population = updateVillageDto.population;
    }
    if (updateVillageDto.households !== undefined) {
      villageData.households = updateVillageDto.households;
    }

    return this.prisma.village.update({
      where: { id },
      data: villageData,
    });
  }

  async remove(id: string) {
    // Check if village exists
    const village = await this.prisma.village.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            incidents: true,
            tasks: true,
            surveys: true,
          },
        },
      },
    });

    if (!village) {
      throw new NotFoundException(`Village with ID ${id} not found`);
    }

    // Check if village has related data
    const totalRelated = village._count.incidents + village._count.tasks + village._count.surveys;
    if (totalRelated > 0) {
      throw new BadRequestException(
        `Cannot delete village. It has ${totalRelated} related records (incidents, tasks, or surveys)`
      );
    }

    return this.prisma.village.delete({
      where: { id },
    });
  }

  async validateGeoJson(
    file: Express.Multer.File,
    dto: UploadGeoJsonDto,
  ): Promise<GeoJsonUploadResponse> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.mimetype !== 'application/json' && file.mimetype !== 'application/geo+json') {
      throw new BadRequestException('File must be a valid GeoJSON file');
    }

    try {
      const geojson = JSON.parse(file.buffer.toString('utf-8'));
      const validation = this.performGeoJsonValidation(geojson);

      return {
        success: validation.valid,
        message: validation.valid
          ? 'GeoJSON validation passed'
          : 'GeoJSON validation failed',
        validation,
        preview: validation.valid ? geojson : null,
      };
    } catch (error) {
      throw new BadRequestException('Invalid JSON format: ' + error.message);
    }
  }

  async uploadGeoJson(
    file: Express.Multer.File,
    dto: UploadGeoJsonDto,
  ): Promise<GeoJsonUploadResponse> {
    // First validate
    const validationResult = await this.validateGeoJson(file, dto);

    if (!validationResult.validation.valid) {
      throw new BadRequestException(
        'GeoJSON validation failed: ' + validationResult.validation.errors.join(', '),
      );
    }

    const geojson = JSON.parse(file.buffer.toString('utf-8'));
    let savedCount = 0;

    // Process based on type
    if (dto.type === 'village_boundary') {
      savedCount = await this.saveVillageBoundaries(geojson);
    }

    return {
      success: true,
      message: `Successfully uploaded ${savedCount} features`,
      validation: validationResult.validation,
      savedCount,
    };
  }

  private performGeoJsonValidation(geojson: any): GeoJsonValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const geometryTypes = new Set<string>();
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;

    // Check if it's a valid GeoJSON structure
    if (!geojson.type) {
      errors.push('Missing "type" property');
    }

    if (geojson.type !== 'FeatureCollection' && geojson.type !== 'Feature') {
      errors.push('GeoJSON must be a FeatureCollection or Feature');
    }

    const features = geojson.type === 'FeatureCollection' ? geojson.features : [geojson];

    if (!features || features.length === 0) {
      errors.push('No features found in GeoJSON');
    }

    // Validate each feature
    features.forEach((feature: any, index: number) => {
      if (!feature.type || feature.type !== 'Feature') {
        errors.push(`Feature ${index}: Invalid feature type`);
      }

      if (!feature.geometry) {
        errors.push(`Feature ${index}: Missing geometry`);
        return;
      }

      geometryTypes.add(feature.geometry.type);

      // Validate geometry using Turf.js
      try {
        const turfFeature = turf.feature(feature.geometry, feature.properties);

        // Check for self-intersections in polygons
        if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
          const kinks = turf.kinks(turfFeature);
          if (kinks.features.length > 0) {
            warnings.push(`Feature ${index}: Polygon has ${kinks.features.length} self-intersections`);
          }
        }

        // Calculate bounds
        const bbox = turf.bbox(turfFeature);
        minLng = Math.min(minLng, bbox[0]);
        minLat = Math.min(minLat, bbox[1]);
        maxLng = Math.max(maxLng, bbox[2]);
        maxLat = Math.max(maxLat, bbox[3]);
      } catch (error) {
        errors.push(`Feature ${index}: Invalid geometry - ${error.message}`);
      }

      // Check for required properties
      if (!feature.properties) {
        warnings.push(`Feature ${index}: Missing properties`);
      }
    });

    // Extract property names
    const properties = features.length > 0 && features[0].properties
      ? Object.keys(features[0].properties)
      : [];

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      features: features.length,
      geometryTypes: Array.from(geometryTypes),
      bounds: errors.length === 0 ? { minLat, maxLat, minLng, maxLng } : undefined,
      properties,
    };
  }

  private async saveVillageBoundaries(geojson: any): Promise<number> {
    const features = geojson.type === 'FeatureCollection' ? geojson.features : [geojson];
    let savedCount = 0;

    for (const feature of features) {
      const props = feature.properties;

      // Try to find existing village by villageNo or name
      const villageNo = props.villageNo || props.village_no || props.moo;
      const name = props.name || props.villageName || props.village_name;

      if (!villageNo && !name) {
        continue; // Skip if no identifier
      }

      // Update or create village with boundary
      try {
        const villageData: any = {
          boundary: feature.geometry,
        };

        if (name) villageData.name = name;
        if (props.households) villageData.households = parseInt(props.households);
        if (props.population) villageData.population = parseInt(props.population);
        if (props.area) villageData.area = parseFloat(props.area);

        if (villageNo) {
          await this.prisma.village.upsert({
            where: { villageNo: parseInt(villageNo) },
            update: villageData,
            create: {
              villageNo: parseInt(villageNo),
              name: name || `หมู่ ${villageNo}`,
              ...villageData,
            },
          });
          savedCount++;
        }
      } catch (error) {
        console.error('Error saving village boundary:', error);
      }
    }

    return savedCount;
  }
}
