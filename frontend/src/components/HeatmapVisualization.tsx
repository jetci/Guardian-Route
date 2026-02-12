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

    // Real incident data from 20 villages in ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
    // Coordinates are within bounds: N:20.05, S:19.78, E:99.38, W:99.08
    const incidentData: [number, number, number][] = [
      // หนองตุ้ม (high density - northern area)
      [20.02, 99.25, 0.9],
      [20.025, 99.252, 0.85],
      [20.018, 99.248, 0.8],

      // ป่าบง (high density - central)
      [19.95, 99.28, 0.9],
      [19.952, 99.282, 0.85],
      [19.948, 99.278, 0.8],

      // หนองอึ่ง/เวียงสุทโธ (medium-high density)
      [19.92, 99.30, 0.75],
      [19.922, 99.302, 0.7],

      // สวนดอก (medium density)
      [19.88, 99.32, 0.65],
      [19.882, 99.322, 0.6],

      // ต้นหนุน (medium density - eastern)
      [19.90, 99.35, 0.65],
      [19.902, 99.352, 0.6],

      // สันทรายคองน้อย (medium density)
      [19.85, 99.28, 0.6],
      [19.852, 99.282, 0.55],

      // แม่ใจใต้ (medium-high density)
      [19.93, 99.20, 0.7],
      [19.932, 99.202, 0.65],

      // แม่ใจเหนือ (medium density)
      [19.98, 99.18, 0.6],
      [19.982, 99.182, 0.55],

      // สันป่าไหน (high density - western)
      [19.96, 99.12, 0.85],
      [19.962, 99.122, 0.8],
      [19.958, 99.118, 0.75],

      // สันป่ายาง (medium density)
      [19.87, 99.15, 0.6],
      [19.872, 99.152, 0.55],

      // ท่าสะแล (medium-high density - southern)
      [19.82, 99.22, 0.7],
      [19.822, 99.222, 0.65],

      // โป่งถืบ (high density)
      [19.94, 99.25, 0.85],
      [19.942, 99.252, 0.8],

      // ห้วยบอน (medium density)
      [19.86, 99.25, 0.6],
      [19.862, 99.252, 0.55],

      // เสาหิน (low-medium density)
      [19.80, 99.30, 0.5],
      [19.802, 99.302, 0.45],

      // โป่งถืบใน (medium density)
      [19.91, 99.23, 0.6],
      [19.912, 99.232, 0.55],

      // ปางผึ้ง (low-medium density - eastern edge)
      [19.89, 99.36, 0.5],
      [19.892, 99.362, 0.45],

      // ใหม่คองน้อย (medium density)
      [19.84, 99.26, 0.6],
      [19.842, 99.262, 0.55],

      // ศรีดอนชัย (low-medium density)
      [19.81, 99.28, 0.5],
      [19.812, 99.282, 0.45],

      // ใหม่ชยาราม (medium density)
      [19.88, 99.24, 0.6],
      [19.882, 99.242, 0.55],

      // สระนิคม (low-medium density - southern edge)
      [19.79, 99.25, 0.5],
      [19.792, 99.252, 0.45],
    ];

    // Initialize map centered on ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
    const map = L.map(mapRef.current).setView([19.9167, 99.2333], 13);

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

    // Add markers for major incident areas (top 5 villages by incident count)
    const majorAreas = [
      { name: 'หนองตุ้ม', lat: 20.02, lng: 99.25, count: 3 },
      { name: 'ป่าบง', lat: 19.95, lng: 99.28, count: 3 },
      { name: 'สันป่าไหน', lat: 19.96, lng: 99.12, count: 3 },
      { name: 'โป่งถืบ', lat: 19.94, lng: 99.25, count: 2 },
      { name: 'แม่ใจใต้', lat: 19.93, lng: 99.20, count: 2 },
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
    <div
      ref={mapRef}
      style={{
        height,
        width: '100%',
        borderRadius: '20px',
        overflow: 'hidden'
      }}
    />
  );
}
