import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

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

    // Filter out villages without boundaries
    return villages.filter(v => v.boundary !== null);
  }
}
