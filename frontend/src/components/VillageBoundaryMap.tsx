import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import toast from 'react-hot-toast';
import './VillageBoundaryMap.css';
import { tambonWiangBoundary, tambonBoundaryStyle } from '../data/mapData';
import boundariesService from '../services/boundariesService';

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

interface CoordinateMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  timestamp: Date;
}

interface VillageBoundaryMapProps {
  onBoundaryDrawn?: (geojson: any) => void;
  existingBoundaries?: any[];
  center?: [number, number];
  zoom?: number;
  georeferenceOverlay?: GeoreferenceOverlay | null;
  onGeoreferencePositionChange?: (position: [number, number]) => void;
  loadTambonFromAPI?: boolean;
  coordinateMarkers?: CoordinateMarker[];
  flyToMarker?: CoordinateMarker | null;
  onFlyToComplete?: () => void;
  mapLayerType?: 'street' | 'satellite' | 'hybrid';
  showLegendOnMap?: boolean;
  selectedVillageToView?: any | null;
  onViewComplete?: () => void;
  editingBoundaryId?: string | null;
  onDrawingStateChange?: (isDrawing: boolean) => void;
}

export default function VillageBoundaryMap({
  onBoundaryDrawn,
  existingBoundaries = [],
  center = [19.9169, 99.2145], // ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่ (Fang District)
  zoom = 13,
  georeferenceOverlay,
  editingBoundaryId = null,
  onGeoreferencePositionChange,
  loadTambonFromAPI = true,
  coordinateMarkers = [],
  flyToMarker = null,
  onFlyToComplete,
  mapLayerType = 'street',
  showLegendOnMap = true,
  selectedVillageToView = null,
  onViewComplete,
  onDrawingStateChange,
}: VillageBoundaryMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const georeferenceMarkerRef = useRef<L.Marker | null>(null);
  const tambonLayerRef = useRef<L.GeoJSON | null>(null);
  const coordinateMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const existingBoundariesLayerRef = useRef<L.LayerGroup | null>(null); // For non-editable boundaries
  const [isReady, setIsReady] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [tambonBoundaryData, setTambonBoundaryData] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      const map = L.map('village-boundary-map').setView(center, zoom);

      // Base layers
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      });

      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19,
      });

      const hybridLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri',
        maxZoom: 19,
      });

      const labelsLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        attribution: '',
        maxZoom: 19,
      });

      // Store layers for external control
      (map as any)._layers = {
        osmLayer,
        satelliteLayer,
        hybridLayer,
        labelsLayer,
      };

      // Add default layer based on mapLayerType
      if (mapLayerType === 'street') {
        osmLayer.addTo(map);
      } else if (mapLayerType === 'satellite') {
        satelliteLayer.addTo(map);
      } else if (mapLayerType === 'hybrid') {
        hybridLayer.addTo(map);
        labelsLayer.addTo(map);
      }

      // Add fullscreen control
      const fullscreenControl = L.Control.extend({
        options: {
          position: 'topleft',
        },
        onAdd: function () {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-fullscreen');
          const button = L.DomUtil.create('a', 'leaflet-control-fullscreen-button', container);
          button.href = '#';
          button.title = 'ขยายเต็มหน้าจอ (Fullscreen)';
          button.innerHTML = '⛶';
          button.style.fontSize = '20px';
          button.style.lineHeight = '30px';
          button.style.width = '30px';
          button.style.height = '30px';
          button.style.display = 'flex';
          button.style.alignItems = 'center';
          button.style.justifyContent = 'center';

          L.DomEvent.on(button, 'click', function (e) {
            L.DomEvent.preventDefault(e);
            const mapContainer = map.getContainer();
            
            if (!document.fullscreenElement) {
              // Enter fullscreen
              if (mapContainer.requestFullscreen) {
                mapContainer.requestFullscreen();
              } else if ((mapContainer as any).webkitRequestFullscreen) {
                (mapContainer as any).webkitRequestFullscreen();
              } else if ((mapContainer as any).msRequestFullscreen) {
                (mapContainer as any).msRequestFullscreen();
              }
              button.innerHTML = '⛶';
              button.title = 'ออกจากเต็มหน้าจอ (Exit Fullscreen)';
            } else {
              // Exit fullscreen
              if (document.exitFullscreen) {
                document.exitFullscreen();
              } else if ((document as any).webkitExitFullscreen) {
                (document as any).webkitExitFullscreen();
              } else if ((document as any).msExitFullscreen) {
                (document as any).msExitFullscreen();
              }
              button.innerHTML = '⛶';
              button.title = 'ขยายเต็มหน้าจอ (Fullscreen)';
            }
          });

          // Listen for fullscreen change events
          document.addEventListener('fullscreenchange', () => {
            setTimeout(() => {
              map.invalidateSize();
            }, 100);
          });

          return container;
        },
      });

      map.addControl(new fullscreenControl());

      // ✅ Add Cancel Draw Mode Button
      const CancelDrawControl = L.Control.extend({
        onAdd: function() {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control cancel-draw-control');
          
          const button = L.DomUtil.create('button', 'cancel-draw-btn', container);
          button.innerHTML = `
            <span style="font-size: 20px;">❌</span>
            <span style="font-size: 14px; font-weight: 500;">ยกเลิก</span>
          `;
          button.title = 'ยกเลิกการวาด (กด ESC)';
          button.style.cssText = `
            background: #ef4444;
            color: white;
            border: none;
            padding: 10px 16px;
            cursor: pointer;
            border-radius: 4px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            font-family: 'Sarabun', sans-serif;
            display: none;
            align-items: center;
            gap: 6px;
            font-weight: 500;
          `;
          
          L.DomEvent.on(button, 'click', function (e) {
            L.DomEvent.preventDefault(e);
            L.DomEvent.stopPropagation(e);
            
            console.log('🔴 Cancel button clicked');
            map.pm.disableDraw();
            button.style.display = 'none';
            toast('ยกเลิกการวาด', { icon: 'ℹ️' });
          });
          
          // Show/hide button based on draw mode
          map.on('pm:drawstart', () => {
            button.style.display = 'flex';
          });
          
          map.on('pm:drawend', () => {
            button.style.display = 'none';
          });
          
          // Also hide when draw mode is disabled
          map.on('pm:globaldrawmodetoggled', (e: any) => {
            if (!e.enabled) {
              button.style.display = 'none';
            }
          });
          
          return container;
        }
      });
      
      map.addControl(new CancelDrawControl({ position: 'topright' }));

      // Initialize FeatureGroup for drawn items (editable)
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;

      // Initialize LayerGroup for existing boundaries (non-editable)
      const existingBoundariesLayer = new L.LayerGroup();
      map.addLayer(existingBoundariesLayer);
      existingBoundariesLayerRef.current = existingBoundariesLayer;

      // Add Leaflet-Geoman controls (modern drawing tools)
      map.pm.addControls({
        position: 'topleft',
        drawMarker: true,
        drawCircle: false,
        drawCircleMarker: false,
        drawPolyline: false,
        drawRectangle: true,
        drawPolygon: true,
        editMode: true,
        dragMode: true,
        cutPolygon: true,
        removalMode: true,
        rotateMode: true,
      });

      // Set Geoman to work with our feature group
      map.pm.setGlobalOptions({
        layerGroup: drawnItems,
        continueDrawing: false,  // ✅ Critical: Disable continue drawing mode
        snapDistance: 20,
      });

      // Handle drawing start
      map.on('pm:drawstart', ({ shape, workingLayer }: any) => {
        console.log('🎨 Start drawing:', shape);
        setIsDrawing(true);
        if (onDrawingStateChange) {
          onDrawingStateChange(true);
        }
      });

      // Handle drawing end (when user finishes drawing)
      map.on('pm:drawend', ({ shape }: any) => {
        console.log('🏁 Draw end:', shape);
        setIsDrawing(false);
        if (onDrawingStateChange) {
          onDrawingStateChange(false);
        }
        
        // Wait for layer to be added to drawnItems
        setTimeout(() => {
          const layers = drawnItemsRef.current?.getLayers() || [];
          
          if (layers.length === 0) {
            console.warn('⚠️ No layers found');
            return;
          }
          
          // Get last added layer
          const layer = layers[layers.length - 1] as L.Layer;
          
          // Validate based on shape type
          if (shape === 'Polygon' || shape === 'Rectangle') {
            const latlngs = (layer as any).getLatLngs();
            const points = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;
            
            if (!points || points.length < 3) {
              console.warn('⚠️ Invalid polygon:', points?.length, 'points');
              drawnItemsRef.current?.removeLayer(layer);
              toast.error('❌ ต้องวาดอย่างน้อย 3 จุด');
              return;
            }
            
            console.log('✅ Valid polygon:', points.length, 'points');
          } else if (shape === 'Marker') {
            console.log('✅ Valid marker');
          }
          
          // Convert to GeoJSON
          const geojson = (layer as any).toGeoJSON();
          
          // Send to parent (show popup)
          if (onBoundaryDrawn) {
            onBoundaryDrawn(geojson);
          }
          
          toast.success('✅ วาดเสร็จแล้ว');
          console.log('🎨 Shape created:', geojson);
          
          // Disable draw mode
          setTimeout(() => {
            map.pm.disableDraw();
            console.log('✅ Draw mode disabled');
          }, 100);
        }, 200);
      });

      // ✅ pm:create is handled by pm:drawend - no need for fallback

      // Handle shape edited
      map.on('pm:edit', (e: any) => {
        toast.success('✏️ แก้ไขขอบเขตเรียบร้อย');
        
        const layer = e.layer;
        const geojson = layer.toGeoJSON();
        console.log('✏️ Shape edited:', geojson);
        
        if (onBoundaryDrawn) {
          onBoundaryDrawn(geojson);
        }
      });

      // Handle shape removed
      map.on('pm:remove', (e: any) => {
        toast.success('🗑️ ลบขอบเขตเรียบร้อย');
        console.log('🗑️ Shape removed:', e.layer);
      });

      // Handle shape cut
      map.on('pm:cut', (e: any) => {
        toast.success('✂️ ตัดขอบเขตเรียบร้อย');
        console.log('✂️ Shape cut:', e);
      });

      // Handle shape rotated
      map.on('pm:rotate', (e: any) => {
        toast.success('↻ หมุนขอบเขตเรียบร้อย');
        console.log('↻ Shape rotated:', e.layer);
        
        const geojson = e.layer.toGeoJSON();
        if (onBoundaryDrawn) {
          onBoundaryDrawn(geojson);
        }
      });

      // Handle shape dragged
      map.on('pm:dragend', (e: any) => {
        toast.success('⊕ ย้ายขอบเขตเรียบร้อย');
        console.log('⊕ Shape dragged:', e.layer);
        
        const geojson = e.layer.toGeoJSON();
        if (onBoundaryDrawn) {
          onBoundaryDrawn(geojson);
        }
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

  // ✅ ESC Key Handler - Cancel draw mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mapRef.current) {
        const map = mapRef.current;
        if (map.pm.globalDrawModeEnabled()) {
          map.pm.disableDraw();
          toast('ยกเลิกการวาด (กด ESC)', { icon: 'ℹ️' });
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load tambon boundary from API
  useEffect(() => {
    if (!loadTambonFromAPI) {
      setTambonBoundaryData(tambonWiangBoundary);
      return;
    }

    const loadTambonBoundary = async () => {
      try {
        const data = await boundariesService.getTambonBoundary();
        if (data && data.geojson) {
          // Convert GeoBoundary to TambonBoundaryFeature format
          const tambonFeature = {
            type: 'Feature',
            properties: {
              name: data.name || 'ตำบลเวียง',
              type: 'tambon',
              ...data.properties,
            },
            geometry: data.geojson.geometry || data.geojson,
          };
          setTambonBoundaryData(tambonFeature);
        } else {
          // Fallback to hardcoded data
          setTambonBoundaryData(tambonWiangBoundary);
        }
      } catch (error) {
        console.error('Error loading tambon boundary:', error);
        // Fallback to hardcoded data
        setTambonBoundaryData(tambonWiangBoundary);
      }
    };

    loadTambonBoundary();
  }, [loadTambonFromAPI]);

  // Add Tambon Wiang boundary layer
  // ปิดการแสดงชั่วคราว เพื่อให้สามารถวาดและแก้ไขขอบเขตตำบลได้
  // ขอบเขตตำบลจะแสดงหลังจากวาดและบันทึกลงฐานข้อมูลแล้วเท่านั้น
  useEffect(() => {
    // DISABLED: ปิดการแสดงขอบเขตตำบล hardcoded
    // เหตุผล: ทำให้แก้ไขไม่ได้ เพราะเป็น read-only layer
    // วิธีใช้: ให้วาดขอบเขตใหม่ด้วยเครื่องมือ Polygon แล้วบันทึก
    
    /* COMMENTED OUT - ให้วาดใหม่แทน
    if (!isReady || !mapRef.current || !tambonBoundaryData) return;

    const map = mapRef.current;

    // Add tambon boundary layer
    const tambonLayer = L.geoJSON(tambonBoundaryData as any, {
      style: tambonBoundaryStyle,
    }).addTo(map);

    // Add popup with tambon info
    const properties = tambonBoundaryData.properties || {};
    tambonLayer.bindPopup(`
      <div style="font-family: sans-serif;">
        <strong style="font-size: 16px; color: #e53e3e;">
          ${properties.name || 'ตำบลเวียง'}
        </strong><br>
        <span style="font-size: 14px; color: #4a5568;">
          ${properties.district || 'อำเภอฝาง'}<br>
          ${properties.province || 'จังหวัดเชียงใหม่'}
        </span><br>
        <hr style="margin: 8px 0; border: none; border-top: 1px solid #e2e8f0;">
        <span style="font-size: 13px; color: #718096;">
          ${properties.area ? `📍 พื้นที่: ${properties.area} ตร.กม.<br>` : ''}
          ${properties.population ? `👥 ประชากร: ~${properties.population?.toLocaleString()} คน<br>` : ''}
          ${properties.villages ? `🏘️ หมู่บ้าน: ${properties.villages} หมู่` : ''}
        </span>
      </div>
    `);

    tambonLayerRef.current = tambonLayer;

    return () => {
      if (tambonLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(tambonLayerRef.current);
        tambonLayerRef.current = null;
      }
    };
    */
  }, [isReady, tambonBoundaryData]);

  // Function to get distinct color for each village (20 colors)
  const getVillageColor = (villageNo: number): string => {
    const colors = [
      '#e74c3c', // 1 - Red
      '#3498db', // 2 - Blue
      '#2ecc71', // 3 - Green
      '#f39c12', // 4 - Orange
      '#9b59b6', // 5 - Purple
      '#1abc9c', // 6 - Turquoise
      '#e67e22', // 7 - Carrot
      '#34495e', // 8 - Dark Gray
      '#16a085', // 9 - Green Sea
      '#c0392b', // 10 - Dark Red
      '#27ae60', // 11 - Nephritis
      '#2980b9', // 12 - Belize Hole
      '#8e44ad', // 13 - Wisteria
      '#f1c40f', // 14 - Yellow
      '#d35400', // 15 - Pumpkin
      '#7f8c8d', // 16 - Asbestos
      '#e91e63', // 17 - Pink
      '#00bcd4', // 18 - Cyan
      '#4caf50', // 19 - Light Green
      '#ff5722', // 20 - Deep Orange
    ];
    return colors[(villageNo - 1) % colors.length];
  };

  // Load existing boundaries with color-coded villages
  useEffect(() => {
    if (!isReady || !drawnItemsRef.current || !existingBoundariesLayerRef.current) return;

    // Clear all existing layers first
    drawnItemsRef.current.clearLayers();
    existingBoundariesLayerRef.current.clearLayers();

    // If no boundaries, exit early
    if (existingBoundaries.length === 0) return;

    try {
      existingBoundaries.forEach((boundary) => {
        // Validate boundary data
        if (!boundary.boundary && !boundary.geojson) {
          console.warn('Boundary missing geojson data:', boundary);
          return;
        }

        const geojson = boundary.boundary || boundary.geojson;
        const villageColor = boundary.villageNo ? getVillageColor(boundary.villageNo) : '#3388ff';
        
        // Check if this is the boundary being edited
        const isCurrentlyEditing = editingBoundaryId === boundary.id;
        
        // ✅ Improved opacity logic:
        // - Normal state: All boundaries visible (opacity 1.0)
        // - Editing state: Selected boundary highlighted, others visible but dimmed
        const boundaryStyle = {
          color: isCurrentlyEditing ? '#ef4444' : villageColor, // Red for editing, village color for normal
          weight: isCurrentlyEditing ? 3.5 : 2.5,
          opacity: editingBoundaryId 
            ? (isCurrentlyEditing ? 1 : 0.5)  // ✅ Increased from 0.15 to 0.5 for better visibility
            : 1,                               // ✅ Normal state: full opacity
          fillColor: isCurrentlyEditing ? '#ef4444' : villageColor,
          fillOpacity: editingBoundaryId
            ? (isCurrentlyEditing ? 0.4 : 0.15) // ✅ Increased from 0.05 to 0.15 for better visibility
            : 0.2,                               // ✅ Normal state: visible fill
          className: isCurrentlyEditing ? 'village-boundary-editing' : 'village-boundary-layer',
        };
        
        // Create layer with improved styling
        const layer = L.geoJSON(geojson, {
          style: boundaryStyle,
        });

        // Add layer to appropriate group
        if (isCurrentlyEditing && drawnItemsRef.current) {
          // Add to editable group (drawnItems) - will show edit handles
          layer.eachLayer((l) => {
            drawnItemsRef.current!.addLayer(l);
          });
        } else if (existingBoundariesLayerRef.current) {
          // Add to non-editable group - no edit handles
          layer.eachLayer((l) => {
            existingBoundariesLayerRef.current!.addLayer(l);
          });
        }

        // Calculate area if available
        let areaText = '';
        if (boundary.boundary?.coordinates && Array.isArray(boundary.boundary.coordinates) && boundary.boundary.coordinates.length > 0) {
          try {
            const coords = boundary.boundary.coordinates[0];
            if (coords && coords.length > 0) {
              // Simple area calculation (approximate)
              const area = Math.abs(coords.reduce((sum: number, coord: number[], i: number) => {
                const j = (i + 1) % coords.length;
                return sum + (coord[0] * coords[j][1] - coords[j][0] * coord[1]);
              }, 0) / 2);
              // Convert to square kilometers (rough approximation)
              const areaKm2 = (area * 111 * 111 / 1000000).toFixed(2);
              areaText = `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
                <span style="color: #718096; font-size: 13px;">📏 พื้นที่โดยประมาณ: ${areaKm2} ตร.กม.</span>
              </div>`;
            }
          } catch (e) {
            console.warn('Error calculating area:', e);
          }
        }

        // Add enhanced popup with village info
        if (boundary.name) {
          layer.bindPopup(`
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; min-width: 200px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <div style="width: 20px; height: 20px; background: ${villageColor}; border-radius: 4px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); flex-shrink: 0;"></div>
                <div>
                  <strong style="font-size: 16px; color: #2d3748;">${boundary.name}</strong>
                  ${boundary.villageNo ? `<div style="color: #718096; font-size: 13px; margin-top: 2px;">หมู่ ${boundary.villageNo}</div>` : ''}
                </div>
              </div>
              ${boundary.centerPoint?.coordinates && boundary.centerPoint.coordinates.length >= 2 ? `
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
                  <span style="color: #718096; font-size: 12px;">📍 พิกัดกลาง:</span><br>
                  <span style="color: #4a5568; font-size: 12px; font-family: monospace;">
                    ${boundary.centerPoint.coordinates[1].toFixed(6)}, ${boundary.centerPoint.coordinates[0].toFixed(6)}
                  </span>
                </div>
              ` : ''}
              ${areaText}
            </div>
          `, {
            maxWidth: 300,
            className: 'village-boundary-popup'
          });
        }
      });
    } catch (error) {
      console.error('Error loading boundaries:', error);
      toast.error('เกิดข้อผิดพลาดในการแสดงขอบเขต');
    }
  }, [isReady, existingBoundaries, editingBoundaryId]);

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

  // Add coordinate markers to map
  useEffect(() => {
    if (!isReady || !mapRef.current) return;

    const map = mapRef.current;

    // Remove existing markers layer
    if (coordinateMarkersLayerRef.current) {
      map.removeLayer(coordinateMarkersLayerRef.current);
    }

    // Create new markers layer
    const markersLayer = L.layerGroup();

    // Custom red pin icon
    const redPinIcon = L.divIcon({
      className: 'custom-marker-icon',
      html: `<div style="
        background: #ef4444;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 16px;
          font-weight: bold;
        ">📍</div>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Add markers
    coordinateMarkers.forEach((marker) => {
      const leafletMarker = L.marker([marker.lat, marker.lng], {
        icon: redPinIcon,
      });

      leafletMarker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 200px;">
          <strong style="font-size: 14px; color: #ef4444;">
            📍 ${marker.label}
          </strong><br>
          <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
            <strong>Latitude:</strong> ${marker.lat.toFixed(6)}<br>
            <strong>Longitude:</strong> ${marker.lng.toFixed(6)}
          </div>
        </div>
      `);

      markersLayer.addLayer(leafletMarker);
    });

    markersLayer.addTo(map);
    coordinateMarkersLayerRef.current = markersLayer;

    return () => {
      if (coordinateMarkersLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(coordinateMarkersLayerRef.current);
        coordinateMarkersLayerRef.current = null;
      }
    };
  }, [isReady, coordinateMarkers]);

  // Handle fly to marker
  useEffect(() => {
    if (!isReady || !mapRef.current || !flyToMarker) return;

    const map = mapRef.current;
    map.flyTo([flyToMarker.lat, flyToMarker.lng], 17, {
      duration: 1.5,
    });

    // Call completion callback after animation
    const timeout = setTimeout(() => {
      if (onFlyToComplete) {
        onFlyToComplete();
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [flyToMarker, isReady, onFlyToComplete]);

  // Handle selected village to view
  useEffect(() => {
    if (!isReady || !mapRef.current || !selectedVillageToView) return;

    const map = mapRef.current;
    const village = selectedVillageToView;
    
    console.log('🗺️ VillageBoundaryMap: Attempting to zoom to village:', village);

    // Get coordinates from centerPoint or boundary
    let lat, lng, zoomLevel = 15;

    console.log('🔍 Checking village data:', {
      hasCenterPoint: !!village.centerPoint,
      centerPoint: village.centerPoint,
      hasBoundary: !!village.boundary,
      boundary: village.boundary
    });

    if (village.centerPoint?.coordinates && village.centerPoint.coordinates.length >= 2) {
      // GeoJSON format: [lng, lat]
      lng = village.centerPoint.coordinates[0];
      lat = village.centerPoint.coordinates[1];
      console.log('✅ Using centerPoint:', { lat, lng });
    } else if (village.boundary) {
      // Calculate center from boundary (support both GeoJSON and plain object)
      console.log('📍 Processing boundary:', village.boundary);
      
      let coords;
      if (village.boundary.type === 'Polygon' && village.boundary.coordinates) {
        // GeoJSON Polygon format
        coords = village.boundary.coordinates[0];
      } else if (Array.isArray(village.boundary.coordinates) && village.boundary.coordinates.length > 0) {
        // Plain object with coordinates array
        coords = village.boundary.coordinates[0];
      } else if (Array.isArray(village.boundary)) {
        // Direct array of coordinates
        coords = village.boundary;
      }
      
      console.log('📍 Extracted coords:', coords);
      
      if (coords && coords.length > 0) {
        const lats = coords.map((c: number[]) => c[1]).filter((v: number) => v !== undefined && !isNaN(v));
        const lngs = coords.map((c: number[]) => c[0]).filter((v: number) => v !== undefined && !isNaN(v));
        
        console.log('📍 Extracted lats/lngs:', { lats, lngs });
        
        if (lats.length > 0 && lngs.length > 0) {
          lat = (Math.min(...lats) + Math.max(...lats)) / 2;
          lng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
          console.log('✅ Calculated center from boundary:', { lat, lng });
        } else {
          console.warn('❌ Village boundary has invalid coordinates:', village);
          onViewComplete?.();
          return;
        }
      } else {
        console.warn('❌ Village boundary coordinates are empty:', village);
        onViewComplete?.();
        return;
      }
    } else {
      console.warn('Village has no centerPoint or boundary:', village);
      onViewComplete?.();
      return;
    }

    // Fly to village
    console.log('🚀 Flying to:', { lat, lng, zoomLevel });
    map.flyTo([lat, lng], zoomLevel, {
      duration: 1.5,
    });

    // Call onViewComplete after animation
    const timeout = setTimeout(() => {
      onViewComplete?.();
    }, 1500);

    return () => clearTimeout(timeout);
  }, [selectedVillageToView, isReady, onViewComplete]);

  // Handle map layer type changes
  useEffect(() => {
    if (!isReady || !mapRef.current) return;

    const map = mapRef.current;
    const layers = (map as any)._layers;
    
    if (!layers) return;

    // Remove all base layers
    if (map.hasLayer(layers.osmLayer)) map.removeLayer(layers.osmLayer);
    if (map.hasLayer(layers.satelliteLayer)) map.removeLayer(layers.satelliteLayer);
    if (map.hasLayer(layers.hybridLayer)) map.removeLayer(layers.hybridLayer);
    if (map.hasLayer(layers.labelsLayer)) map.removeLayer(layers.labelsLayer);

    // Add selected layer
    if (mapLayerType === 'street') {
      layers.osmLayer.addTo(map);
    } else if (mapLayerType === 'satellite') {
      layers.satelliteLayer.addTo(map);
    } else if (mapLayerType === 'hybrid') {
      layers.hybridLayer.addTo(map);
      layers.labelsLayer.addTo(map);
    }
  }, [mapLayerType, isReady]);

  // Add color legend to map (only if showLegendOnMap is true)
  useEffect(() => {
    if (!showLegendOnMap || !isReady || !mapRef.current || existingBoundaries.length === 0) return;

    const legend = new (L.Control as any)({ position: 'bottomright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'village-legend');
      div.style.cssText = `
        background: white;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        max-height: 400px;
        overflow-y: auto;
        font-family: sans-serif;
      `;

      let html = '<div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">🎨 สีขอบเขตหมู่บ้าน</div>';
      
      // Get unique villages with boundaries
      const villagesWithBoundaries = existingBoundaries
        .filter(b => b.boundary && b.villageNo)
        .sort((a, b) => a.villageNo - b.villageNo);

      villagesWithBoundaries.forEach((boundary) => {
        const color = getVillageColor(boundary.villageNo);
        html += `
          <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0; font-size: 13px;">
            <div style="width: 20px; height: 12px; background: ${color}; border-radius: 2px; border: 1px solid #ccc;"></div>
            <span style="color: #333;">หมู่ ${boundary.villageNo}</span>
          </div>
        `;
      });

      div.innerHTML = html;
      return div;
    };

    legend.addTo(mapRef.current);

    return () => {
      if (mapRef.current && legend) {
        mapRef.current.removeControl(legend);
      }
    };
  }, [isReady, existingBoundaries, showLegendOnMap]);

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
