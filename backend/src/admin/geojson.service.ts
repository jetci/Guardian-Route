import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UploadGeoJsonDto, UploadMode } from './dto/upload-geojson.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { GeoJsonHistoryService } from './geojson-history.service';

@Injectable()
export class GeoJsonService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
    private geoJsonHistoryService: GeoJsonHistoryService,
  ) {}

  /**
   * Validate GeoJSON format
   */
  private validateGeoJson(geojson: any): boolean {
    if (!geojson || typeof geojson !== 'object') {
      return false;
    }

    // Check for required GeoJSON properties
    if (!geojson.type) {
      return false;
    }

    // Validate based on type
    const validTypes = [
      'Point',
      'LineString',
      'Polygon',
      'MultiPoint',
      'MultiLineString',
      'MultiPolygon',
      'GeometryCollection',
      'Feature',
      'FeatureCollection',
    ];

    if (!validTypes.includes(geojson.type)) {
      return false;
    }

    // For Feature and FeatureCollection, check geometry
    if (geojson.type === 'Feature') {
      return geojson.geometry && this.validateGeoJson(geojson.geometry);
    }

    if (geojson.type === 'FeatureCollection') {
      return (
        Array.isArray(geojson.features) &&
        geojson.features.every((f: any) => this.validateGeoJson(f))
      );
    }

    // For geometry types, check coordinates
    if (geojson.type !== 'GeometryCollection') {
      return Array.isArray(geojson.coordinates);
    }

    return true;
  }

  /**
   * Upload GeoJSON
   */
  async uploadGeoJson(dto: UploadGeoJsonDto, adminUser: any) {
    // Validate GeoJSON
    if (!this.validateGeoJson(dto.geojson)) {
      throw new BadRequestException('GeoJSON format ไม่ถูกต้อง');
    }

    // Check mode
    if (dto.mode === UploadMode.OVERWRITE && dto.villageId) {
      // Delete existing boundaries for this village
      await this.prisma.geoBoundary.deleteMany({
        where: {
          villageId: dto.villageId,
          type: dto.type,
        },
      });
    }

    // Create new boundary
    const boundary = await this.prisma.geoBoundary.create({
      data: {
        name: dto.name,
        type: dto.type,
        geojson: dto.geojson,
        properties: dto.properties || {},
        villageId: dto.villageId,
        uploadedBy: adminUser.id,
      },
    });

    // บันทึกประวัติ
    await this.geoJsonHistoryService.createHistory(boundary.id, 'CREATE', {
      name: dto.name,
      type: dto.type,
      geojson: dto.geojson,
      properties: dto.properties,
      changedBy: adminUser.id,
      changeDetails: {
        mode: dto.mode || 'merge',
        villageId: dto.villageId,
      },
    });

    // Audit log
    await this.auditLogService.create({
      userId: adminUser.id,
      username: adminUser.username,
      action: 'UPLOAD_GEOJSON',
      targetType: 'GEOJSON',
      targetId: boundary.id,
      details: {
        name: dto.name,
        type: dto.type,
        mode: dto.mode || 'merge',
        villageId: dto.villageId,
      },
    });

    return boundary;
  }

  /**
   * Get all GeoJSON boundaries
   */
  async findAll(filters?: {
    type?: string;
    villageId?: string;
    page?: number;
    limit?: number;
  }) {
    const { type, villageId, page = 1, limit = 20 } = filters || {};

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (villageId) {
      where.villageId = villageId;
    }

    const [data, total] = await Promise.all([
      this.prisma.geoBoundary.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.geoBoundary.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get GeoJSON by ID
   */
  async findOne(id: string) {
    const boundary = await this.prisma.geoBoundary.findUnique({
      where: { id },
    });

    if (!boundary) {
      throw new NotFoundException('ไม่พบข้อมูล GeoJSON');
    }

    return boundary;
  }

  /**
   * Update GeoJSON
   */
  async update(id: string, geojson: any, adminUser: any) {
    // Validate GeoJSON
    if (!this.validateGeoJson(geojson)) {
      throw new BadRequestException('GeoJSON format ไม่ถูกต้อง');
    }

    const boundary = await this.prisma.geoBoundary.findUnique({
      where: { id },
    });

    if (!boundary) {
      throw new NotFoundException('ไม่พบข้อมูล GeoJSON');
    }

    const updated = await this.prisma.geoBoundary.update({
      where: { id },
      data: { geojson },
    });

    // บันทึกประวัติ
    await this.geoJsonHistoryService.createHistory(id, 'UPDATE', {
      name: updated.name,
      type: updated.type,
      geojson: updated.geojson,
      properties: updated.properties,
      changedBy: adminUser.id,
      changeDetails: {
        previousGeojson: boundary.geojson,
      },
    });

    // Audit log
    await this.auditLogService.create({
      userId: adminUser.id,
      username: adminUser.username,
      action: 'EDIT_POLYGON',
      targetType: 'GEOJSON',
      targetId: id,
      details: {
        name: boundary.name,
        type: boundary.type,
      },
    });

    return updated;
  }

  /**
   * Delete GeoJSON
   */
  async delete(id: string, adminUser: any) {
    const boundary = await this.prisma.geoBoundary.findUnique({
      where: { id },
    });

    if (!boundary) {
      throw new NotFoundException('ไม่พบข้อมูล GeoJSON');
    }

    // บันทึกประวัติก่อนลบ (เพื่อ Restore ได้)
    await this.geoJsonHistoryService.createHistory(id, 'DELETE', {
      name: boundary.name,
      type: boundary.type,
      geojson: boundary.geojson,
      properties: boundary.properties,
      changedBy: adminUser.id,
    });

    await this.prisma.geoBoundary.delete({ where: { id } });

    // Audit log
    await this.auditLogService.create({
      userId: adminUser.id,
      username: adminUser.username,
      action: 'DELETE_GEOJSON',
      targetType: 'GEOJSON',
      targetId: id,
      details: {
        name: boundary.name,
        type: boundary.type,
      },
    });

    return { message: 'ลบข้อมูล GeoJSON สำเร็จ' };
  }

  /**
   * Get GeoJSON statistics
   */
  async getStats() {
    const [total, byType] = await Promise.all([
      this.prisma.geoBoundary.count(),
      this.prisma.geoBoundary.groupBy({
        by: ['type'],
        _count: true,
      }),
    ]);

    return {
      total,
      byType: byType.map((item) => ({
        type: item.type,
        count: item._count,
      })),
    };
  }
}
