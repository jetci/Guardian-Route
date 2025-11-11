export class OverlayAnalysisDto {
  incidentIds: string[];
}

export class PolygonDto {
  coordinates: number[][][]; // GeoJSON Polygon format
}

export class OverlayResultDto {
  totalIncidents: number;
  overlappingAreas: OverlappingArea[];
  riskScore: number;
  recommendations: string[];
}

export class OverlappingArea {
  coordinates: number[][][];
  incidentCount: number;
  incidentIds: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  area: number; // in square kilometers
}

export class ExportAnalysisDto {
  analysisId: string;
  format: 'PDF' | 'EXCEL';
}
