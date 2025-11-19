import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Get all GeoJSON boundaries
  async getAllBoundaries() {
    return this.prisma.geoBoundary.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get specific boundary
  async getBoundary(id: string) {
    const boundary = await this.prisma.geoBoundary.findUnique({
      where: { id },
    });

    if (!boundary) {
      throw new NotFoundException(`Boundary with ID ${id} not found`);
    }

    return boundary;
  }

  // Create new boundary
  async createBoundary(data: any, userId: string) {
    return this.prisma.geoBoundary.create({
      data: {
        name: data.name || 'Unnamed Boundary',
        type: data.type || 'custom',
        geojson: data.geojson,
        properties: data.properties || {},
        villageId: data.villageId || null,
        uploadedBy: userId,
      },
    });
  }

  // Update boundary
  async updateBoundary(id: string, data: any, userId: string) {
    const existing = await this.getBoundary(id);

    return this.prisma.geoBoundary.update({
      where: { id },
      data: {
        name: data.name || existing.name,
        type: data.type || existing.type,
        geojson: data.geojson || existing.geojson,
        properties: data.properties || existing.properties,
        villageId: data.villageId !== undefined ? data.villageId : existing.villageId,
      },
    });
  }

  // Delete boundary
  async deleteBoundary(id: string) {
    await this.getBoundary(id); // Check if exists

    await this.prisma.geoBoundary.delete({
      where: { id },
    });

    return { message: 'Boundary deleted successfully' };
  }

  // Get village boundaries
  async getVillageBoundaries() {
    const villages = await this.prisma.village.findMany({
      select: {
        id: true,
        villageNo: true,
        name: true,
        boundary: true,
        centerPoint: true,
      },
      orderBy: { villageNo: 'asc' },
    });

    // ส่งหมู่บ้านทั้งหมดกลับไป (ทั้งที่มีและไม่มีขอบเขต)
    // Frontend จะแสดงสถานะที่ถูกต้องตาม boundary field
    return villages;
  }

  // Get tambon boundary
  async getTambonBoundary() {
    const tambonBoundary = await this.prisma.geoBoundary.findFirst({
      where: { type: 'tambon' },
      orderBy: { updatedAt: 'desc' },
    });

    return tambonBoundary;
  }

  // Save or update tambon boundary
  async saveTambonBoundary(data: any, userId: string) {
    const existing = await this.prisma.geoBoundary.findFirst({
      where: { type: 'tambon' },
    });

    if (existing) {
      // Update existing tambon boundary
      return this.prisma.geoBoundary.update({
        where: { id: existing.id },
        data: {
          name: data.name || existing.name,
          geojson: data.geojson || existing.geojson,
          properties: data.properties || existing.properties,
        },
      });
    } else {
      // Create new tambon boundary
      return this.prisma.geoBoundary.create({
        data: {
          name: data.name || 'ตำบลเวียง',
          type: 'tambon',
          geojson: data.geojson,
          properties: data.properties || {},
          villageId: null,
          uploadedBy: userId,
        },
      });
    }
  }

  // Update village boundary
  async updateVillageBoundary(villageId: string, boundary: any, centerPoint: any) {
    const village = await this.prisma.village.findUnique({
      where: { id: villageId },
    });

    if (!village) {
      throw new NotFoundException(`Village with ID ${villageId} not found`);
    }

    return this.prisma.village.update({
      where: { id: villageId },
      data: {
        boundary,
        centerPoint,
      },
    });
  }

  // Delete village boundary
  async deleteVillageBoundary(villageId: string) {
    const village = await this.prisma.village.findUnique({
      where: { id: villageId },
    });

    if (!village) {
      throw new NotFoundException(`Village with ID ${villageId} not found`);
    }

    return this.prisma.village.update({
      where: { id: villageId },
      data: {
        boundary: Prisma.JsonNull,
        centerPoint: Prisma.JsonNull,
      },
    });
  }
}
