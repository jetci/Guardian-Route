import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { point, buffer, intersect, area, polygon } from '@turf/turf';
import { OverlayAnalysisRequestDto } from './dto/overlay-analysis.dto';

export interface OverlappingAreaDto {
  coordinates: number[][][];
  incidentCount: number;
  incidentIds: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  area: number;
}

export interface OverlayAnalysisResultDto {
  totalIncidents: number;
  overlappingAreas: OverlappingAreaDto[];
  riskScore: number;
  recommendations: string[];
}

@Injectable()
export class AnalysisService {
  constructor(private prisma: PrismaService) {}

  async analyzeOverlay({ incidentIds }: OverlayAnalysisRequestDto): Promise<OverlayAnalysisResultDto> {
    if (!incidentIds || incidentIds.length === 0) {
      throw new BadRequestException('incidentIds is required');
    }

    const incidents = await this.prisma.incident.findMany({
      where: { id: { in: incidentIds } },
      select: { id: true, location: true, affectedArea: true, priority: true },
    });

    if (incidents.length === 0) {
      throw new BadRequestException('No incidents found for the given IDs');
    }

    const polygons: Array<{ id: string; poly: any }> = [];

    for (const inc of incidents) {
      const affected: any = inc.affectedArea as any;
      if (affected?.type === 'Polygon') {
        try {
          const polyFeat = polygon(affected.coordinates as any);
          polygons.push({ id: inc.id, poly: polyFeat });
        } catch (e) {
          continue;
        }
      } else {
        const loc: any = inc.location as any;
        if (loc?.type === 'Point') {
          const [lng, lat] = loc.coordinates as [number, number];
          const pt = point([lng, lat]);
          const buffered: any = buffer(pt as any, 0.2, 'kilometres' as any);
          let geom: any = null;
          if (buffered?.geometry?.type === 'Polygon') {
            geom = polygon(buffered.geometry.coordinates as any);
          } else if (buffered?.geometry?.type === 'MultiPolygon') {
            const firstPolyCoords = (buffered.geometry.coordinates as any[])[0];
            geom = polygon(firstPolyCoords);
          }
          if (geom) {
            polygons.push({ id: inc.id, poly: geom });
          }
        }
      }
    }

    if (polygons.length === 0) {
      return {
        totalIncidents: incidents.length,
        overlappingAreas: [],
        riskScore: 0,
        recommendations: ['ไม่พบพื้นที่ซ้อนทับ กรุณาเพิ่มขอบเขตพื้นที่ได้รับผลกระทบของเหตุการณ์ หรือระบุจุดพิกัดให้ครบถ้วน'],
      };
    }

    const overlaps: OverlappingAreaDto[] = [];
    for (let i = 0; i < polygons.length; i++) {
      for (let j = i + 1; j < polygons.length; j++) {
        const a = polygons[i];
        const b = polygons[j];
        const inter: any = intersect(a.poly, b.poly);
        if (inter && inter.geometry) {
          let coords: number[][][] | null = null;
          if (inter.geometry.type === 'Polygon') {
            coords = inter.geometry.coordinates as any;
          } else if (inter.geometry.type === 'MultiPolygon') {
            coords = (inter.geometry.coordinates as any[])[0];
          }
          if (coords) {
            const areaSqKm = area(inter) / 1_000_000;
            const incidentIds = [a.id, b.id];
            const incidentCount = 2;
            const riskLevel = areaSqKm >= 1 ? 'CRITICAL' : areaSqKm >= 0.5 ? 'HIGH' : areaSqKm >= 0.1 ? 'MEDIUM' : 'LOW';
            overlaps.push({
              coordinates: coords,
              incidentCount,
              incidentIds,
              riskLevel,
              area: Number(areaSqKm.toFixed(4)),
            });
          }
        }
      }
    }

    const riskScore = overlaps.reduce((sum, o) => {
      const levelWeight = o.riskLevel === 'CRITICAL' ? 4 : o.riskLevel === 'HIGH' ? 3 : o.riskLevel === 'MEDIUM' ? 2 : 1;
      return sum + levelWeight * o.area;
    }, 0);

    const recommendations: string[] = [];
    if (overlaps.length === 0) {
      recommendations.push('ไม่พบพื้นที่ซ้อนทับระหว่างเหตุการณ์');
    } else {
      recommendations.push('มีพื้นที่ซ้อนทับระหว่างเหตุการณ์บางส่วน ควรจัดสรรทรัพยากรให้เหมาะสม');
      recommendations.push('ตรวจสอบหมู่บ้านที่อยู่ในพื้นที่ซ้อนทับเพื่อประเมินความเสี่ยงเพิ่มเติม');
    }

    return {
      totalIncidents: incidents.length,
      overlappingAreas: overlaps,
      riskScore: Number(riskScore.toFixed(2)),
      recommendations,
    };
  }
}