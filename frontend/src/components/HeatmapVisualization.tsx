import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// Extend Leaflet types for heatLayer
declare module 'leaflet' {
  function heatLayer(
    latlngs: [number, number, number][],
    options?: any
  ): L.Layer;
}

interface HeatmapVisualizationProps {
  height?: string;
}

export default function HeatmapVisualization({ height = '400px' }: HeatmapVisualizationProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Mock incident data with coordinates and intensity
    const incidentData: [number, number, number][] = [
      // บ้านหนองบัว (high density)
      [16.4419, 102.8360, 0.9],
      [16.4420, 102.8361, 0.8],
      [16.4421, 102.8362, 0.7],
      [16.4418, 102.8359, 0.85],
      [16.4422, 102.8363, 0.75],
      
      // บ้านโนนสวรรค์ (medium density)
      [16.4500, 102.8400, 0.6],
      [16.4501, 102.8401, 0.65],
      [16.4502, 102.8402, 0.55],
      
      // บ้านดอนดู่ (medium density)
      [16.4300, 102.8300, 0.7],
      [16.4301, 102.8301, 0.6],
      [16.4302, 102.8302, 0.65],
      
      // บ้านหนองแวง (low-medium density)
      [16.4600, 102.8500, 0.5],
      [16.4601, 102.8501, 0.45],
      
      // บ้านโคกสูง (low density)
      [16.4200, 102.8200, 0.4],
      [16.4201, 102.8201, 0.35],
      
      // Additional scattered incidents
      [16.4350, 102.8350, 0.5],
      [16.4450, 102.8450, 0.55],
      [16.4550, 102.8550, 0.45],
      [16.4250, 102.8250, 0.4],
      [16.4150, 102.8150, 0.35],
      [16.4380, 102.8380, 0.6],
      [16.4480, 102.8480, 0.5],
      [16.4280, 102.8280, 0.45],
    ];

    // Initialize map centered on the area
    const map = L.map(mapRef.current).setView([16.4419, 102.8360], 12);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Add heatmap layer
    const heat = L.heatLayer(incidentData, {
      radius: 25,
      blur: 35,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.0: '#3b82f6',  // Blue (low)
        0.3: '#10b981',  // Green
        0.5: '#f59e0b',  // Orange
        0.7: '#ef4444',  // Red
        1.0: '#dc2626',  // Dark Red (high)
      }
    }).addTo(map);

    // Add markers for major incident areas
    const majorAreas = [
      { name: 'บ้านหนองบัว', lat: 16.4419, lng: 102.8360, count: 8 },
      { name: 'บ้านโนนสวรรค์', lat: 16.4500, lng: 102.8400, count: 5 },
      { name: 'บ้านดอนดู่', lat: 16.4300, lng: 102.8300, count: 4 },
    ];

    majorAreas.forEach(area => {
      const marker = L.marker([area.lat, area.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background: white;
              border: 2px solid #ef4444;
              border-radius: 20px;
              padding: 4px 12px;
              font-size: 12px;
              font-weight: 600;
              color: #1a202c;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              white-space: nowrap;
            ">
              📍 ${area.name} (${area.count})
            </div>
          `,
          iconSize: [120, 30],
          iconAnchor: [60, 15],
        })
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif;">
          <strong style="font-size: 14px; color: #1a202c;">${area.name}</strong><br/>
          <span style="font-size: 12px; color: #718096;">จำนวนเหตุการณ์: <strong>${area.count}</strong></span>
        </div>
      `);
    });

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px' 
      }}>
        <h3 style={{ margin: 0, fontSize: '20px', color: '#1a202c' }}>
          🗺️ แผนที่ความหนาแน่น
        </h3>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', background: '#3b82f6', borderRadius: '3px' }} />
            <span style={{ color: '#718096' }}>ต่ำ</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', background: '#10b981', borderRadius: '3px' }} />
            <span style={{ color: '#718096' }}>ปานกลาง</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', background: '#f59e0b', borderRadius: '3px' }} />
            <span style={{ color: '#718096' }}>สูง</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '16px', background: '#ef4444', borderRadius: '3px' }} />
            <span style={{ color: '#718096' }}>สูงมาก</span>
          </div>
        </div>
      </div>
      <div 
        ref={mapRef} 
        style={{ 
          height, 
          width: '100%', 
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }} 
      />
    </div>
  );
}
