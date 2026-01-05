import { Test, TestingModule } from '@nestjs/testing';
import { VillagesService } from './villages.service';
import { PrismaService } from '../database/prisma.service';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

describe('VillagesService', () => {
  let service: VillagesService;
  let prisma: PrismaService;

  const mockPrisma = {
    village: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VillagesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<VillagesService>(VillagesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all villages with counts', async () => {
      const mockVillages = [
        {
          id: 'village-1',
          name: 'หมู่ 1',
          villageNo: 1,
          _count: { incidents: 5, tasks: 3, surveys: 2 },
        },
        {
          id: 'village-2',
          name: 'หมู่ 2',
          villageNo: 2,
          _count: { incidents: 2, tasks: 1, surveys: 0 },
        },
      ];

      mockPrisma.village.findMany.mockResolvedValue(mockVillages);

      const result = await service.findAll();

      expect(result).toEqual(mockVillages);
      expect(mockPrisma.village.findMany).toHaveBeenCalledWith({
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
    });
  });

  describe('findOne', () => {
    it('should return village with related data', async () => {
      const mockVillage = {
        id: 'village-1',
        name: 'หมู่ 1',
        incidents: [],
        tasks: [],
        _count: { incidents: 0, tasks: 0, surveys: 0 },
      };

      mockPrisma.village.findUnique.mockResolvedValue(mockVillage);

      const result = await service.findOne('village-1');

      expect(result).toEqual(mockVillage);
      expect(mockPrisma.village.findUnique).toHaveBeenCalledWith({
        where: { id: 'village-1' },
        include: expect.objectContaining({
          incidents: expect.any(Object),
          tasks: expect.any(Object),
          _count: expect.any(Object),
        }),
      });
    });
  });

  describe('findByVillageNo', () => {
    it('should return village by village number', async () => {
      const mockVillage = {
        id: 'village-1',
        villageNo: 1,
        name: 'หมู่ 1',
        _count: { incidents: 0, tasks: 0, surveys: 0 },
      };

      mockPrisma.village.findUnique.mockResolvedValue(mockVillage);

      const result = await service.findByVillageNo(1);

      expect(result).toEqual(mockVillage);
      expect(mockPrisma.village.findUnique).toHaveBeenCalledWith({
        where: { villageNo: 1 },
        include: expect.any(Object),
      });
    });
  });

  describe('getStatistics', () => {
    it('should return village statistics', async () => {
      const mockVillages = [
        { households: 100, population: 400, area: 5.5 },
        { households: 150, population: 600, area: 7.2 },
        { households: 80, population: 320, area: 4.3 },
      ];

      mockPrisma.village.findMany.mockResolvedValue(mockVillages);

      const result = await service.getStatistics();

      expect(result).toEqual({
        totalVillages: 3,
        totalHouseholds: 330,
        totalPopulation: 1320,
        totalArea: 17,
        averageHouseholdsPerVillage: 110,
        averagePopulationPerVillage: 440,
      });
    });

    it('should handle null values in statistics', async () => {
      const mockVillages = [
        { households: null, population: null, area: null },
        { households: 100, population: 400, area: 5 },
      ];

      mockPrisma.village.findMany.mockResolvedValue(mockVillages);

      const result = await service.getStatistics();

      expect(result.totalHouseholds).toBe(100);
      expect(result.totalPopulation).toBe(400);
      expect(result.totalArea).toBe(5);
    });
  });

  describe('create', () => {
    it('should create village with GeoJSON center point', async () => {
      const dto = {
        villageNo: 1,
        name: 'หมู่ 1',
        province: 'เชียงใหม่',
        district: 'เมือง',
        subdistrict: 'ช้างเผือก',
        lat: 18.7883,
        lng: 98.9853,
        population: 500,
        households: 120,
        malePopulation: 250,
        femalePopulation: 250,
      };

      mockPrisma.village.findUnique.mockResolvedValue(null);
      mockPrisma.village.create.mockResolvedValue({
        id: 'village-1',
        ...dto,
        centerPoint: {
          type: 'Point',
          coordinates: [98.9853, 18.7883],
        },
      });

      const result = await service.create(dto);

      expect(result).toHaveProperty('id');
      expect(mockPrisma.village.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          villageNo: 1,
          name: 'หมู่ 1',
          alternateNames: ['เชียงใหม่', 'เมือง', 'ช้างเผือก'],
          centerPoint: {
            type: 'Point',
            coordinates: [98.9853, 18.7883],
          },
          populationMale: 250,
          populationFemale: 250,
        }),
      });
    });

    it('should throw ConflictException if villageNo exists', async () => {
      const dto = {
        villageNo: 1,
        name: 'หมู่ 1',
      };

      mockPrisma.village.findUnique.mockResolvedValue({
        id: 'existing',
        villageNo: 1,
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update village successfully', async () => {
      const mockVillage = {
        id: 'village-1',
        villageNo: 1,
        name: 'หมู่ 1',
      };

      const updateDto = {
        name: 'หมู่ 1 (Updated)',
        population: 600,
      };

      mockPrisma.village.findUnique.mockResolvedValue(mockVillage);
      mockPrisma.village.update.mockResolvedValue({
        ...mockVillage,
        ...updateDto,
      });

      const result = await service.update('village-1', updateDto);

      expect(result.name).toBe('หมู่ 1 (Updated)');
      expect(result.population).toBe(600);
    });

    it('should throw NotFoundException if village not found', async () => {
      mockPrisma.village.findUnique.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', { name: 'Test' })
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if updating to existing villageNo', async () => {
      mockPrisma.village.findUnique
        .mockResolvedValueOnce({ id: 'village-1', villageNo: 1 })
        .mockResolvedValueOnce({ id: 'village-2', villageNo: 2 });

      await expect(
        service.update('village-1', { villageNo: 2 })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete village if no related data', async () => {
      const mockVillage = {
        id: 'village-1',
        _count: { incidents: 0, tasks: 0, surveys: 0 },
      };

      mockPrisma.village.findUnique.mockResolvedValue(mockVillage);
      mockPrisma.village.delete.mockResolvedValue(mockVillage);

      const result = await service.remove('village-1');

      expect(result).toEqual(mockVillage);
      expect(mockPrisma.village.delete).toHaveBeenCalledWith({
        where: { id: 'village-1' },
      });
    });

    it('should throw NotFoundException if village not found', async () => {
      mockPrisma.village.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException if village has related data', async () => {
      const mockVillage = {
        id: 'village-1',
        _count: { incidents: 5, tasks: 3, surveys: 2 },
      };

      mockPrisma.village.findUnique.mockResolvedValue(mockVillage);

      await expect(service.remove('village-1')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('validateGeoJson', () => {
    it('should validate valid GeoJSON FeatureCollection', async () => {
      const validGeoJson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [100.0, 0.0],
                  [101.0, 0.0],
                  [101.0, 1.0],
                  [100.0, 1.0],
                  [100.0, 0.0],
                ],
              ],
            },
            properties: { name: 'Test Village' },
          },
        ],
      };

      const mockFile = {
        buffer: Buffer.from(JSON.stringify(validGeoJson)),
        mimetype: 'application/json',
      } as Express.Multer.File;

      const result = await service.validateGeoJson(mockFile, {
        type: 'village_boundary',
      });

      expect(result.success).toBe(true);
      expect(result.validation.valid).toBe(true);
      expect(result.validation.features).toBe(1);
      expect(result.validation.geometryTypes).toContain('Polygon');
    });

    it('should reject invalid GeoJSON format', async () => {
      const invalidGeoJson = {
        type: 'InvalidType',
        features: [],
      };

      const mockFile = {
        buffer: Buffer.from(JSON.stringify(invalidGeoJson)),
        mimetype: 'application/json',
      } as Express.Multer.File;

      const result = await service.validateGeoJson(mockFile, {
        type: 'village_boundary',
      });

      expect(result.success).toBe(false);
      expect(result.validation.valid).toBe(false);
      expect(result.validation.errors.length).toBeGreaterThan(0);
    });

    it('should throw BadRequestException if no file provided', async () => {
      await expect(
        service.validateGeoJson(null, { type: 'village_boundary' })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid file type', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        mimetype: 'text/plain',
      } as Express.Multer.File;

      await expect(
        service.validateGeoJson(mockFile, { type: 'village_boundary' })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid JSON', async () => {
      const mockFile = {
        buffer: Buffer.from('invalid json'),
        mimetype: 'application/json',
      } as Express.Multer.File;

      await expect(
        service.validateGeoJson(mockFile, { type: 'village_boundary' })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('uploadGeoJson', () => {
    it('should upload valid GeoJSON and save boundaries', async () => {
      const validGeoJson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [100.0, 0.0],
                  [101.0, 0.0],
                  [101.0, 1.0],
                  [100.0, 1.0],
                  [100.0, 0.0],
                ],
              ],
            },
            properties: {
              villageNo: 1,
              name: 'Test Village',
              households: 100,
              population: 400,
            },
          },
        ],
      };

      const mockFile = {
        buffer: Buffer.from(JSON.stringify(validGeoJson)),
        mimetype: 'application/json',
      } as Express.Multer.File;

      mockPrisma.village.upsert.mockResolvedValue({
        id: 'village-1',
        villageNo: 1,
      });

      const result = await service.uploadGeoJson(mockFile, {
        type: 'village_boundary',
      });

      expect(result.success).toBe(true);
      expect(result.savedCount).toBe(1);
      expect(mockPrisma.village.upsert).toHaveBeenCalled();
    });

    it('should throw BadRequestException if validation fails', async () => {
      const invalidGeoJson = {
        type: 'InvalidType',
        features: [],
      };

      const mockFile = {
        buffer: Buffer.from(JSON.stringify(invalidGeoJson)),
        mimetype: 'application/json',
      } as Express.Multer.File;

      await expect(
        service.uploadGeoJson(mockFile, { type: 'village_boundary' })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('GeoJSON validation edge cases', () => {
    it('should detect missing features', async () => {
      const geoJson = {
        type: 'FeatureCollection',
        features: [],
      };

      const mockFile = {
        buffer: Buffer.from(JSON.stringify(geoJson)),
        mimetype: 'application/json',
      } as Express.Multer.File;

      const result = await service.validateGeoJson(mockFile, {
        type: 'village_boundary',
      });

      expect(result.validation.valid).toBe(false);
      expect(result.validation.errors).toContain('No features found in GeoJSON');
    });

    it('should handle Feature type (not FeatureCollection)', async () => {
      const geoJson = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [100.0, 0.0],
        },
        properties: { name: 'Test' },
      };

      const mockFile = {
        buffer: Buffer.from(JSON.stringify(geoJson)),
        mimetype: 'application/json',
      } as Express.Multer.File;

      const result = await service.validateGeoJson(mockFile, {
        type: 'village_boundary',
      });

      expect(result.validation.features).toBe(1);
    });
  });
});
