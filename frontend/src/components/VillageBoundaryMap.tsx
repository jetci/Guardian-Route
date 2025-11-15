import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import toast from 'react-hot-toast';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface VillageBoundaryMapProps {
  onBoundaryDrawn?: (geojson: any) => void;
  existingBoundaries?: any[];
  center?: [number, number];
  zoom?: number;
}

export default function VillageBoundaryMap({
  onBoundaryDrawn,
  existingBoundaries = [],
  center = [19.9167, 99.9333], // ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
  zoom = 13,
}: VillageBoundaryMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      const map = L.map('village-boundary-map').setView(center, zoom);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Initialize FeatureGroup for drawn items
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;

      // Add drawing controls
      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems,
        },
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            metric: true,
          },
          polyline: false,
          circle: false,
          circlemarker: false,
          marker: {},
          rectangle: {},
        },
      });
      map.addControl(drawControl);

      // Handle draw created
      map.on(L.Draw.Event.CREATED, (e: any) => {
        const layer = e.layer;
        drawnItems.addLayer(layer);

        // Convert to GeoJSON
        const geojson = layer.toGeoJSON();
        
        toast.success('ขอบเขตถูกวาดเรียบร้อย');
        
        if (onBoundaryDrawn) {
          onBoundaryDrawn(geojson);
        }
      });

      // Handle draw edited
      map.on(L.Draw.Event.EDITED, (e: any) => {
        toast.success('แก้ไขขอบเขตเรียบร้อย');
        
        const layers = e.layers;
        layers.eachLayer((layer: any) => {
          const geojson = layer.toGeoJSON();
          if (onBoundaryDrawn) {
            onBoundaryDrawn(geojson);
          }
        });
      });

      // Handle draw deleted
      map.on(L.Draw.Event.DELETED, () => {
        toast.success('ลบขอบเขตเรียบร้อย');
      });

      mapRef.current = map;
      setIsReady(true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Load existing boundaries
  useEffect(() => {
    if (isReady && drawnItemsRef.current && existingBoundaries.length > 0) {
      drawnItemsRef.current.clearLayers();

      existingBoundaries.forEach((boundary) => {
        if (boundary.boundary || boundary.geojson) {
          const geojson = boundary.boundary || boundary.geojson;
          const layer = L.geoJSON(geojson, {
            style: {
              color: '#3388ff',
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.3,
            },
          });

          if (drawnItemsRef.current) {
            layer.eachLayer((l) => {
              drawnItemsRef.current!.addLayer(l);
            });
          }

          // Add popup with village info
          if (boundary.name) {
            layer.bindPopup(`
              <strong>${boundary.name}</strong><br>
              ${boundary.villageNo ? `หมู่ ${boundary.villageNo}` : ''}
            `);
          }
        }
      });
    }
  }, [isReady, existingBoundaries]);

  return (
    <div
      id="village-boundary-map"
      style={{
        height: '600px',
        width: '100%',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
      }}
    />
  );
}
