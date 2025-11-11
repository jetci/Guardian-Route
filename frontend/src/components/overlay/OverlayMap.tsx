import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import axios from 'axios';

interface IncidentFeature extends GeoJSON.Feature<GeoJSON.Polygon> {
  properties: {
    id: string;
    title: string;
    type: string;
  };
}

interface IntersectionResult {
  geometry: GeoJSON.Polygon;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  incidentCount: number;
  area: number;
}

interface OverlayMapProps {
  selectedIncidents: IncidentFeature[];
  onAnalysisComplete?: (results: IntersectionResult[]) => void;
}

const OverlayMap: React.FC<OverlayMapProps> = ({ selectedIncidents, onAnalysisComplete }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const incidentLayersRef = useRef<L.LayerGroup | null>(null);
  const intersectionLayersRef = useRef<L.LayerGroup | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<IntersectionResult[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([13.75, 100.52], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Create layer groups
    incidentLayersRef.current = L.layerGroup().addTo(map);
    intersectionLayersRef.current = L.layerGroup().addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !incidentLayersRef.current) return;

    // Clear previous incident layers
    incidentLayersRef.current.clearLayers();

    // Add incident polygons
    const bounds = L.latLngBounds([]);
    let hasBounds = false;

    selectedIncidents.forEach((incident) => {
      const polygon = L.geoJSON(incident, {
        style: {
          color: getIncidentColor(incident.properties.type),
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.2,
        },
      });

      polygon.bindPopup(`
        <div class="p-2">
          <div class="font-semibold">${incident.properties.title}</div>
          <div class="text-sm text-gray-600">${incident.properties.type}</div>
        </div>
      `);

      polygon.addTo(incidentLayersRef.current!);

      // Extend bounds
      polygon.eachLayer((layer: any) => {
        if (layer.getBounds) {
          bounds.extend(layer.getBounds());
          hasBounds = true;
        }
      });
    });

    // Auto zoom to bounds
    if (hasBounds && mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    // Analyze if there are selected incidents
    if (selectedIncidents.length > 0) {
      analyzeOverlay();
    } else {
      // Clear intersection layers if no incidents selected
      if (intersectionLayersRef.current) {
        intersectionLayersRef.current.clearLayers();
      }
      setResults([]);
      if (onAnalysisComplete) {
        onAnalysisComplete([]);
      }
    }
  }, [selectedIncidents, onAnalysisComplete]);

  const getIncidentColor = (type: string): string => {
    const colors: Record<string, string> = {
      FIRE: '#ff4d4d',
      FLOOD: '#4d79ff',
      ACCIDENT: '#ffd633',
      OTHER: '#999999',
    };
    return colors[type] || '#6b7280';
  };

  const getRiskColor = (riskLevel: string): string => {
    const colors: Record<string, string> = {
      LOW: '#22c55e',
      MEDIUM: '#eab308',
      HIGH: '#f97316',
      CRITICAL: '#ef4444',
    };
    return colors[riskLevel] || '#6b7280';
  };

  const getRiskLabel = (riskLevel: string): string => {
    const labels: Record<string, string> = {
      LOW: 'ความเสี่ยงต่ำ',
      MEDIUM: 'ความเสี่ยงปานกลาง',
      HIGH: 'ความเสี่ยงสูง',
      CRITICAL: 'ความเสี่ยงวิกฤต',
    };
    return labels[riskLevel] || riskLevel;
  };

  const analyzeOverlay = async () => {
    if (selectedIncidents.length === 0) return;

    try {
      setAnalyzing(true);
      const token = localStorage.getItem('token');
      const response = await axios.post<IntersectionResult[]>(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/overlay/analyze`,
        { polygons: selectedIncidents },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResults(response.data);
      displayIntersections(response.data);
      
      // Pass results to parent component
      if (onAnalysisComplete) {
        onAnalysisComplete(response.data);
      }
    } catch (err: any) {
      console.error('Error analyzing overlay:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const displayIntersections = (intersections: IntersectionResult[]) => {
    if (!intersectionLayersRef.current || !mapRef.current) return;

    // Clear previous intersection layers
    intersectionLayersRef.current.clearLayers();

    const bounds = L.latLngBounds([]);
    let hasBounds = false;

    // Add intersection polygons
    intersections.forEach((result) => {
      const feature: GeoJSON.Feature<GeoJSON.Polygon> = {
        type: 'Feature',
        properties: {},
        geometry: result.geometry,
      };

      const polygon = L.geoJSON(feature, {
        style: {
          color: getRiskColor(result.riskLevel),
          weight: 3,
          opacity: 1,
          fillOpacity: 0.4,
        },
      });

      // Tooltip on hover
      polygon.bindTooltip(
        `
        <div class="text-sm">
          <div class="font-semibold">${getRiskLabel(result.riskLevel)}</div>
          <div>จำนวนเหตุการณ์: ${result.incidentCount} ครั้ง</div>
          <div>พื้นที่: ${(result.area / 1000000).toFixed(2)} ตร.กม.</div>
        </div>
      `,
        { sticky: true }
      );

      // Popup on click
      polygon.bindPopup(`
        <div class="p-2">
          <div class="font-semibold" style="color: ${getRiskColor(result.riskLevel)}">
            ${getRiskLabel(result.riskLevel)}
          </div>
          <div class="text-sm mt-1">
            <div>จำนวนเหตุการณ์: ${result.incidentCount} ครั้ง</div>
            <div>พื้นที่: ${(result.area / 1000000).toFixed(2)} ตร.กม.</div>
          </div>
        </div>
      `);

      polygon.addTo(intersectionLayersRef.current!);

      // Extend bounds
      polygon.eachLayer((layer: any) => {
        if (layer.getBounds) {
          bounds.extend(layer.getBounds());
          hasBounds = true;
        }
      });
    });

    // Auto zoom to intersection results
    if (hasBounds && mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="w-full h-[600px] rounded-lg shadow-lg"
      />

      {/* Loading Overlay */}
      {analyzing && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg z-[1000] pointer-events-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-3"></div>
            <span className="text-lg font-medium text-gray-700">กำลังวิเคราะห์...</span>
            <span className="text-sm text-gray-500 mt-1">โปรดรอสักครู่</span>
          </div>
        </div>
      )}

      {/* Guideline Panel (Top Right) */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-[500]">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          คำแนะนำการใช้งาน
        </h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-start">
            <span className="font-semibold mr-2">1.</span>
            <span>เลือกเหตุการณ์จากรายการด้านซ้าย</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold mr-2">2.</span>
            <span>ระบบจะวิเคราะห์พื้นที่ทับซ้อนอัตโนมัติ</span>
          </div>
          <div className="flex items-start">
            <span className="font-semibold mr-2">3.</span>
            <span>ดูผลการวิเคราะห์และบันทึกผล</span>
          </div>
        </div>
      </div>

      {/* Legend (Bottom Right) */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[500]">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">ระดับความเสี่ยง</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span className="text-gray-700">🔴 ความเสี่ยงวิกฤต</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
            <span className="text-gray-700">🟠 ความเสี่ยงสูง</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-4 rounded" style={{ backgroundColor: '#eab308' }}></div>
            <span className="text-gray-700">🟡 ความเสี่ยงปานกลาง</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
            <span className="text-gray-700">🟢 ความเสี่ยงต่ำ</span>
          </div>
        </div>
      </div>

      {/* Results Summary (moved to bottom left to avoid overlap) */}
      {results.length > 0 && !analyzing && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-[500]">
          <h4 className="font-semibold text-gray-800 mb-2">ผลการวิเคราะห์</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm p-2 rounded"
                style={{
                  backgroundColor: `${getRiskColor(result.riskLevel)}20`,
                }}
              >
                <div>
                  <div className="font-medium">{getRiskLabel(result.riskLevel)}</div>
                  <div className="text-xs text-gray-600">
                    {result.incidentCount} เหตุการณ์
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  {(result.area / 1000000).toFixed(2)} km²
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverlayMap;
