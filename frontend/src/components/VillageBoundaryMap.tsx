import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import toast from 'react-hot-toast';
import './VillageBoundaryMap.css';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface GeoreferenceOverlay {
  url: string;
  opacity: number;
  scale: number;
  rotation: number;
  position: [number, number];
  naturalWidth: number;
  naturalHeight: number;
}

interface VillageBoundaryMapProps {
  onBoundaryDrawn?: (geojson: any) => void;
  existingBoundaries?: any[];
  center?: [number, number];
  zoom?: number;
  georeferenceOverlay?: GeoreferenceOverlay | null;
  onGeoreferencePositionChange?: (position: [number, number]) => void;
}

export default function VillageBoundaryMap({
  onBoundaryDrawn,
  existingBoundaries = [],
  center = [19.9169, 99.2145], // ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่ (Fang District)
  zoom = 13,
  georeferenceOverlay,
  onGeoreferencePositionChange,
}: VillageBoundaryMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const georeferenceMarkerRef = useRef<L.Marker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);

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
            showArea: false, // Disable to avoid 'type is not defined' error
            metric: false,
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

  // Georeference overlay effect
  useEffect(() => {
    if (!mapRef.current || !georeferenceOverlay) {
      // Remove marker if overlay is removed
      if (georeferenceMarkerRef.current && mapRef.current) {
        mapRef.current.removeLayer(georeferenceMarkerRef.current);
        georeferenceMarkerRef.current = null;
      }
      return;
    }

    const map = mapRef.current;

    // Calculate pixel size based on zoom and scale
    const calculatePixelSize = (zoom: number) => {
      const baseSize = 200; // Base size at zoom 13
      const zoomDiff = zoom - 13;
      return baseSize * Math.pow(2, zoomDiff) * georeferenceOverlay.scale;
    };

    const pixelSize = calculatePixelSize(currentZoom);
    const aspectRatio = georeferenceOverlay.naturalHeight / georeferenceOverlay.naturalWidth;
    const pixelHeight = pixelSize * aspectRatio;

    // Create custom icon with image
    const customIcon = L.divIcon({
      className: 'georeference-marker',
      html: `
        <img 
          src="${georeferenceOverlay.url}" 
          style="
            width: ${pixelSize}px;
            height: ${pixelHeight}px;
            opacity: ${georeferenceOverlay.opacity};
            transform: rotate(${georeferenceOverlay.rotation}deg);
            pointer-events: none;
            display: block;
          "
          alt="Georeference overlay"
        />
      `,
      iconSize: [pixelSize, pixelHeight],
      iconAnchor: [pixelSize / 2, pixelHeight / 2],
    });

    // Remove existing marker
    if (georeferenceMarkerRef.current) {
      map.removeLayer(georeferenceMarkerRef.current);
    }

    // Create draggable marker
    const marker = L.marker(georeferenceOverlay.position, {
      icon: customIcon,
      draggable: true,
    }).addTo(map);

    // Handle drag end
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      if (onGeoreferencePositionChange) {
        onGeoreferencePositionChange([pos.lat, pos.lng]);
      }
    });

    georeferenceMarkerRef.current = marker;

    // Update on zoom
    const handleZoom = () => {
      const newZoom = map.getZoom();
      setCurrentZoom(newZoom);
    };

    map.on('zoom', handleZoom);

    return () => {
      map.off('zoom', handleZoom);
      if (georeferenceMarkerRef.current) {
        map.removeLayer(georeferenceMarkerRef.current);
        georeferenceMarkerRef.current = null;
      }
    };
  }, [georeferenceOverlay, currentZoom, onGeoreferencePositionChange]);

  return (
    <div
      id="village-boundary-map"
      style={{
        width: '100%',
        height: '600px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
}
