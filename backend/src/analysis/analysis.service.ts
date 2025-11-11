import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OverlayAnalysisDto, OverlayResultDto, OverlappingArea } from './dto/overlay-analysis.dto';

@Injectable()
export class AnalysisService {
  constructor(private prisma: PrismaService) {}

  async analyzeOverlay(dto: OverlayAnalysisDto): Promise<OverlayResultDto> {
    // Fetch incidents
    const incidents = await this.prisma.incident.findMany({
      where: {
        id: {
          in: dto.incidentIds,
        },
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        priority: true,
        type: true,
      },
    });

    if (incidents.length === 0) {
      throw new Error('No incidents found');
    }

    // Group incidents by proximity (simple clustering)
    const overlappingAreas = this.findOverlappingAreas(incidents);

    // Calculate risk score
    const riskScore = this.calculateRiskScore(overlappingAreas);

    // Generate recommendations
    const recommendations = this.generateRecommendations(overlappingAreas, riskScore);

    return {
      totalIncidents: incidents.length,
      overlappingAreas,
      riskScore,
      recommendations,
    };
  }

  private findOverlappingAreas(incidents: any[]): OverlappingArea[] {
    const areas: OverlappingArea[] = [];
    const processed = new Set<string>();
    const PROXIMITY_THRESHOLD = 0.05; // ~5km in degrees

    for (let i = 0; i < incidents.length; i++) {
      if (processed.has(incidents[i].id)) continue;

      const cluster: any[] = [incidents[i]];
      processed.add(incidents[i].id);

      for (let j = i + 1; j < incidents.length; j++) {
        if (processed.has(incidents[j].id)) continue;

        const distance = this.calculateDistance(
          incidents[i].latitude,
          incidents[i].longitude,
          incidents[j].latitude,
          incidents[j].longitude,
        );

        if (distance < PROXIMITY_THRESHOLD) {
          cluster.push(incidents[j]);
          processed.add(incidents[j].id);
        }
      }

      if (cluster.length > 1) {
        // Create polygon around cluster
        const polygon = this.createPolygonFromCluster(cluster);
        const area = this.calculatePolygonArea(polygon);
        const riskLevel = this.determineRiskLevel(cluster.length, area);

        areas.push({
          coordinates: polygon,
          incidentCount: cluster.length,
          incidentIds: cluster.map((inc) => inc.id),
          riskLevel,
          area,
        });
      }
    }

    return areas;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    return Math.sqrt(dLat * dLat + dLon * dLon);
  }

  private createPolygonFromCluster(cluster: any[]): number[][][] {
    // Find bounding box
    const lats = cluster.map((inc) => inc.latitude);
    const lons = cluster.map((inc) => inc.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    // Add padding
    const padding = 0.01;

    // Create rectangle polygon
    return [
      [
        [minLon - padding, minLat - padding],
        [maxLon + padding, minLat - padding],
        [maxLon + padding, maxLat + padding],
        [minLon - padding, maxLat + padding],
        [minLon - padding, minLat - padding], // Close polygon
      ],
    ];
  }

  private calculatePolygonArea(polygon: number[][][]): number {
    // Simplified area calculation (approximate)
    const coords = polygon[0];
    let area = 0;

    for (let i = 0; i < coords.length - 1; i++) {
      area += coords[i][0] * coords[i + 1][1];
      area -= coords[i + 1][0] * coords[i][1];
    }

    area = Math.abs(area) / 2;

    // Convert to square kilometers (very rough approximation)
    const kmPerDegree = 111; // approximate
    return area * kmPerDegree * kmPerDegree;
  }

  private determineRiskLevel(incidentCount: number, area: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const density = incidentCount / area;

    if (density > 10) return 'CRITICAL';
    if (density > 5) return 'HIGH';
    if (density > 2) return 'MEDIUM';
    return 'LOW';
  }

  private calculateRiskScore(areas: OverlappingArea[]): number {
    if (areas.length === 0) return 0;

    const totalIncidents = areas.reduce((sum, area) => sum + area.incidentCount, 0);
    const avgDensity = areas.reduce((sum, area) => sum + area.incidentCount / area.area, 0) / areas.length;

    // Score from 0-100
    const score = Math.min(100, (totalIncidents * 5 + avgDensity * 10));
    return Math.round(score);
  }

  private generateRecommendations(areas: OverlappingArea[], riskScore: number): string[] {
    const recommendations: string[] = [];

    if (riskScore > 70) {
      recommendations.push('พื้นที่มีความเสี่ยงสูงมาก ควรจัดทีมเฝ้าระวังประจำการ');
      recommendations.push('พิจารณาติดตั้งระบบเตือนภัยล่วงหน้า');
    } else if (riskScore > 50) {
      recommendations.push('พื้นที่มีความเสี่ยงปานกลาง ควรเพิ่มการตรวจสอบเป็นระยะ');
    } else {
      recommendations.push('พื้นที่มีความเสี่ยงต่ำ รักษาระดับการเฝ้าระวังปกติ');
    }

    const criticalAreas = areas.filter((a) => a.riskLevel === 'CRITICAL');
    if (criticalAreas.length > 0) {
      recommendations.push(`พบพื้นที่วิกฤต ${criticalAreas.length} แห่ง ต้องดำเนินการเร่งด่วน`);
    }

    const highDensityAreas = areas.filter((a) => a.incidentCount / a.area > 5);
    if (highDensityAreas.length > 0) {
      recommendations.push('พบพื้นที่ที่มีเหตุการณ์หนาแน่น ควรวิเคราะห์สาเหตุเชิงลึก');
    }

    if (areas.length > 3) {
      recommendations.push('มีหลายพื้นที่ที่มีเหตุการณ์ซ้ำซาก ควรจัดทำแผนป้องกันระยะยาว');
    }

    return recommendations;
  }

  async getAnalysisHistory(userId: string) {
    // Placeholder for future implementation
    return [];
  }
}
