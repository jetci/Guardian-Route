import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CustomLayerService {
  constructor(private prisma: PrismaService) {}

  /**
   * สร้าง Custom Layer ใหม่
   */
  async create(data: {
    name: string;
    description?: string;
    type: string;
    geojson: any;
    style?: any;
    zIndex?: number;
    metadata?: any;
    createdBy: string;
  }) {
    // หา zIndex สูงสุด
    const maxZIndex = await this.prisma.customLayer.aggregate({
      _max: { zIndex: true },
    });

    const nextZIndex = data.zIndex ?? (maxZIndex._max.zIndex || 0) + 1;

    return this.prisma.customLayer.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        geojson: data.geojson,
        style: data.style || this.getDefaultStyle(data.type),
        zIndex: nextZIndex,
        metadata: data.metadata,
        createdBy: data.createdBy,
      },
    });
  }

  /**
   * ดึงรายการ Custom Layers
   */
  async findAll(options?: {
    page?: number;
    limit?: number;
    type?: string;
    createdBy?: string;
    visibleOnly?: boolean;
  }) {
    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (options?.type) {
      where.type = options.type;
    }

    if (options?.createdBy) {
      where.createdBy = options.createdBy;
    }

    if (options?.visibleOnly) {
      where.isVisible = true;
    }

    const [layers, total] = await Promise.all([
      this.prisma.customLayer.findMany({
        where,
        orderBy: { zIndex: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.customLayer.count({ where }),
    ]);

    return {
      data: layers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * ดึง Custom Layer ตาม ID
   */
  async findOne(id: string) {
    const layer = await this.prisma.customLayer.findUnique({
      where: { id },
    });

    if (!layer) {
      throw new NotFoundException('Custom Layer not found');
    }

    return layer;
  }

  /**
   * อัพเดท Custom Layer
   */
  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      type?: string;
      geojson?: any;
      style?: any;
      zIndex?: number;
      isVisible?: boolean;
      metadata?: any;
    },
  ) {
    await this.findOne(id); // Check if exists

    return this.prisma.customLayer.update({
      where: { id },
      data,
    });
  }

  /**
   * เปลี่ยน Layer order (zIndex)
   */
  async reorderLayers(layerOrders: Array<{ id: string; zIndex: number }>) {
    const updates = layerOrders.map((order) =>
      this.prisma.customLayer.update({
        where: { id: order.id },
        data: { zIndex: order.zIndex },
      }),
    );

    await Promise.all(updates);

    return { updated: updates.length };
  }

  /**
   * เปิด/ปิด Layer visibility
   */
  async toggleVisibility(id: string) {
    const layer = await this.findOne(id);

    return this.prisma.customLayer.update({
      where: { id },
      data: { isVisible: !layer.isVisible },
    });
  }

  /**
   * ลบ Custom Layer
   */
  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.customLayer.delete({
      where: { id },
    });
  }

  /**
   * ลบ Custom Layers หลายตัว
   */
  async removeMany(ids: string[]) {
    const deleted = await this.prisma.customLayer.deleteMany({
      where: { id: { in: ids } },
    });

    return { deleted: deleted.count };
  }

  /**
   * ดึงสถิติ Custom Layers
   */
  async getStats(createdBy?: string) {
    const where: any = {};
    if (createdBy) {
      where.createdBy = createdBy;
    }

    const [total, visible, byType] = await Promise.all([
      this.prisma.customLayer.count({ where }),
      this.prisma.customLayer.count({
        where: { ...where, isVisible: true },
      }),
      this.prisma.customLayer.groupBy({
        by: ['type'],
        where,
        _count: true,
      }),
    ]);

    return {
      total,
      visible,
      hidden: total - visible,
      byType: byType.map((item) => ({
        type: item.type,
        count: item._count,
      })),
    };
  }

  /**
   * ดึง Default Style ตามประเภท Layer
   */
  private getDefaultStyle(type: string) {
    const defaultStyles: Record<string, any> = {
      marker: {
        color: '#3B82F6',
        icon: 'marker',
        size: 'medium',
      },
      polygon: {
        fillColor: '#3B82F6',
        fillOpacity: 0.3,
        strokeColor: '#1E40AF',
        strokeWidth: 2,
        strokeOpacity: 1,
      },
      polyline: {
        color: '#3B82F6',
        weight: 3,
        opacity: 1,
        dashArray: null,
      },
      circle: {
        fillColor: '#3B82F6',
        fillOpacity: 0.3,
        strokeColor: '#1E40AF',
        strokeWidth: 2,
        radius: 100,
      },
    };

    return defaultStyles[type] || {};
  }

  /**
   * Clone Custom Layer
   */
  async clone(id: string, createdBy: string) {
    const original = await this.findOne(id);

    return this.create({
      name: `${original.name} (Copy)`,
      description: original.description,
      type: original.type,
      geojson: original.geojson,
      style: original.style,
      metadata: original.metadata,
      createdBy,
    });
  }

  /**
   * Export Custom Layers เป็น GeoJSON FeatureCollection
   */
  async exportAsGeoJSON(layerIds?: string[]) {
    const where: any = {};
    if (layerIds && layerIds.length > 0) {
      where.id = { in: layerIds };
    }

    const layers = await this.prisma.customLayer.findMany({
      where,
      orderBy: { zIndex: 'asc' },
    });

    const features = layers.map((layer) => ({
      type: 'Feature',
      id: layer.id,
      properties: {
        name: layer.name,
        description: layer.description,
        layerType: layer.type,
        style: layer.style,
        zIndex: layer.zIndex,
        isVisible: layer.isVisible,
        metadata: layer.metadata,
      },
      geometry: layer.geojson,
    }));

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}
