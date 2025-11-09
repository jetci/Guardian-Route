import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class GeoJsonHistoryService {
  constructor(private prisma: PrismaService) {}

  /**
   * บันทึกประวัติการเปลี่ยนแปลง GeoJSON
   */
  async createHistory(
    boundaryId: string,
    changeType: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE',
    data: {
      name: string;
      type: string;
      geojson: any;
      properties?: any;
      changedBy: string;
      changeDetails?: any;
    },
  ) {
    // หา version ล่าสุด
    const latestHistory = await this.prisma.geoBoundaryHistory.findFirst({
      where: { boundaryId },
      orderBy: { version: 'desc' },
    });

    const nextVersion = latestHistory ? latestHistory.version + 1 : 1;

    return this.prisma.geoBoundaryHistory.create({
      data: {
        boundaryId,
        version: nextVersion,
        name: data.name,
        type: data.type,
        geojson: data.geojson,
        properties: data.properties,
        changeType,
        changeDetails: data.changeDetails,
        changedBy: data.changedBy,
      },
    });
  }

  /**
   * ดึงประวัติทั้งหมดของ GeoJSON
   */
  async getHistory(
    boundaryId: string,
    options?: {
      page?: number;
      limit?: number;
    },
  ) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      this.prisma.geoBoundaryHistory.findMany({
        where: { boundaryId },
        orderBy: { version: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.geoBoundaryHistory.count({
        where: { boundaryId },
      }),
    ]);

    return {
      data: history,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * ดึงประวัติตาม version
   */
  async getHistoryByVersion(boundaryId: string, version: number) {
    return this.prisma.geoBoundaryHistory.findFirst({
      where: {
        boundaryId,
        version,
      },
    });
  }

  /**
   * เปรียบเทียบ 2 versions
   */
  async compareVersions(
    boundaryId: string,
    version1: number,
    version2: number,
  ) {
    const [v1, v2] = await Promise.all([
      this.getHistoryByVersion(boundaryId, version1),
      this.getHistoryByVersion(boundaryId, version2),
    ]);

    if (!v1 || !v2) {
      throw new Error('Version not found');
    }

    return {
      version1: v1,
      version2: v2,
      differences: {
        name: v1.name !== v2.name,
        type: v1.type !== v2.type,
        geojson: JSON.stringify(v1.geojson) !== JSON.stringify(v2.geojson),
        properties:
          JSON.stringify(v1.properties) !== JSON.stringify(v2.properties),
      },
    };
  }

  /**
   * Restore GeoJSON เป็น version เก่า
   */
  async restoreVersion(
    boundaryId: string,
    version: number,
    restoredBy: string,
  ) {
    const historyVersion = await this.getHistoryByVersion(boundaryId, version);

    if (!historyVersion) {
      throw new Error('Version not found');
    }

    // อัพเดท GeoBoundary ปัจจุบัน
    const updated = await this.prisma.geoBoundary.update({
      where: { id: boundaryId },
      data: {
        name: historyVersion.name,
        type: historyVersion.type,
        geojson: historyVersion.geojson,
        properties: historyVersion.properties,
      },
    });

    // บันทึกประวัติการ restore
    await this.createHistory(boundaryId, 'RESTORE', {
      name: historyVersion.name,
      type: historyVersion.type,
      geojson: historyVersion.geojson,
      properties: historyVersion.properties,
      changedBy: restoredBy,
      changeDetails: {
        restoredFromVersion: version,
      },
    });

    return updated;
  }

  /**
   * ลบประวัติเก่าที่เกินกำหนด (เก็บไว้แค่ 100 versions)
   */
  async cleanupOldHistory(boundaryId: string, keepVersions = 100) {
    const histories = await this.prisma.geoBoundaryHistory.findMany({
      where: { boundaryId },
      orderBy: { version: 'desc' },
      skip: keepVersions,
    });

    if (histories.length > 0) {
      const idsToDelete = histories.map((h) => h.id);
      await this.prisma.geoBoundaryHistory.deleteMany({
        where: {
          id: { in: idsToDelete },
        },
      });
    }

    return { deleted: histories.length };
  }

  /**
   * ดึงสถิติประวัติ
   */
  async getHistoryStats(boundaryId: string) {
    const [total, byChangeType] = await Promise.all([
      this.prisma.geoBoundaryHistory.count({
        where: { boundaryId },
      }),
      this.prisma.geoBoundaryHistory.groupBy({
        by: ['changeType'],
        where: { boundaryId },
        _count: true,
      }),
    ]);

    const latestHistory = await this.prisma.geoBoundaryHistory.findFirst({
      where: { boundaryId },
      orderBy: { version: 'desc' },
    });

    return {
      total,
      currentVersion: latestHistory?.version || 0,
      byChangeType: byChangeType.map((item) => ({
        changeType: item.changeType,
        count: item._count,
      })),
      lastChanged: latestHistory?.changedAt,
    };
  }
}
