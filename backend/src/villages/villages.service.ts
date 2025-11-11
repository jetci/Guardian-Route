import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class VillagesService {
  constructor(private prisma: PrismaService) {}

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
}
