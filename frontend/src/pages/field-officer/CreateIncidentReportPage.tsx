import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { incidentService } from '../../services/incidentService';
import ThaiDatePicker from '../../components/ThaiDatePicker';
import { validateIncidentForm, hasValidationErrors, getFirstError, type IncidentValidationErrors } from '../../validation/incident-validation';
import { villagesApi, type LeafletVillage } from '../../api/villages';
import { fieldSurveyApi } from '../../api/fieldSurvey';

import './InitialSurveyPage.css';
import './CreateIncidentReportPage.css';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PhotoPreview {
  file: File;
  preview: string;
  name: string;
}

export function CreateIncidentReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const currentMarkerRef = useRef<L.Marker | null>(null);
  const villageRef = useRef<string>('');

  // Map Layers Refs
  const osmLayerRef = useRef<L.TileLayer | null>(null);
  const googleHybridLayerRef = useRef<L.TileLayer | null>(null);
  const villageBoundaryLayerRef = useRef<L.Polygon | null>(null);

  // Form state
  const [incidentDate, setIncidentDate] = useState<Date | null>(new Date());
  const [disasterType, setDisasterType] = useState('');
  const [disasterTypeOther, setDisasterTypeOther] = useState('');
  const [village, setVillage] = useState('');
  const [estimatedHouseholds, setEstimatedHouseholds] = useState('');
  const [severity, setSeverity] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);

  // Data state
  const [villages, setVillages] = useState<LeafletVillage[]>([]);
  const [isLoadingVillages, setIsLoadingVillages] = useState(true);

  // GPS state
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // Polygon state
  const [polygonData, setPolygonData] = useState<any>(null);

  // Marker Modal state
  const [showMarkerModal, setShowMarkerModal] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<L.Layer | null>(null);
  const [markerLabel, setMarkerLabel] = useState('');

  // Validation errors state
  const [errors, setErrors] = useState<IncidentValidationErrors>({});
  const [showGpsInfo, setShowGpsInfo] = useState(false); // New state for GPS toggle

  // Fetch villages from API
  useEffect(() => {
    const fetchVillages = async () => {
      try {
        setIsLoadingVillages(true);
        const data = await villagesApi.getAllForMap();
        setVillages(data);
      } catch (error) {
        console.error('Failed to fetch villages:', error);
        toast.error('ไม่สามารถโหลดข้อมูลหมู่บ้านได้');
        setVillages([]);
      } finally {
        setIsLoadingVillages(false);
      }
    };
    fetchVillages();
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const saveDraft = () => {
      const draft = {
        incidentDate: incidentDate?.toISOString(),
        disasterType,
        disasterTypeOther,
        village,
        severity,
        estimatedHouseholds,
        notes,
        latitude,
        longitude,
        polygonData,
        timestamp: Date.now()
      };

      localStorage.setItem('incident-draft', JSON.stringify(draft));
      // Silent save or minimal notification
    };

    // Save every 60 seconds (reduced frequency)
    const interval = setInterval(saveDraft, 60000);

    return () => clearInterval(interval);
  }, [incidentDate, disasterType, disasterTypeOther, village, severity, estimatedHouseholds, notes, latitude, longitude, polygonData]);

  // Sync village state to ref for event listeners
  useEffect(() => {
    villageRef.current = village;
  }, [village]);

  // Manage Geoman controls and Map Layers based on village selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (village) {
      // Enable Drawing Tools
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

      // ✅ Switch to Google Hybrid (Satellite + Labels)
      if (osmLayerRef.current) map.removeLayer(osmLayerRef.current);

      if (!googleHybridLayerRef.current) {
        googleHybridLayerRef.current = L.tileLayer('http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          attribution: '© Google Maps'
        });
      }
      googleHybridLayerRef.current.addTo(map);

      // Find selected village and draw boundary
      const selectedVillage = villages.find(v => `หมู่ ${v.moo} ${v.name}` === village);
      if (selectedVillage && selectedVillage.boundary && selectedVillage.boundary.length > 0) {
        // Remove existing boundary if any
        if (villageBoundaryLayerRef.current) {
          map.removeLayer(villageBoundaryLayerRef.current);
        }

        // Draw new boundary
        const polygon = L.polygon(selectedVillage.boundary, {
          color: '#F59E0B', // Amber color
          weight: 3,
          fillColor: '#F59E0B',
          fillOpacity: 0.1,
          dashArray: '10, 10',
          pmIgnore: true // ✅ Prevent Geoman from editing this layer
        } as any).addTo(map);

        villageBoundaryLayerRef.current = polygon;

        // Automatically set latitude and longitude if not already set
        if (!latitude || !longitude) {
          setLatitude(selectedVillage.lat);
          setLongitude(selectedVillage.lng);
          setAccuracy(5); // Default accuracy for village center
        }

        // Zoom to village
        map.fitBounds(polygon.getBounds(), {
          padding: [50, 50],
          maxZoom: 16,
          animate: true,
          duration: 1.5
        });

        toast.success(`📍 ไปที่ ${selectedVillage.name}`, {
          icon: '🗺️',
          position: 'bottom-center'
        });
      }

    } else {
      // Disable Drawing Tools
      map.pm.removeControls();

      // ✅ Switch back to OSM (Street)
      if (googleHybridLayerRef.current) map.removeLayer(googleHybridLayerRef.current);
      if (osmLayerRef.current) osmLayerRef.current.addTo(map);

      // Remove village boundary
      if (villageBoundaryLayerRef.current) {
        map.removeLayer(villageBoundaryLayerRef.current);
        villageBoundaryLayerRef.current = null;
      }

      // Reset view to default
      map.setView([19.9422, 99.2195], 13);
    }
  }, [village, villages]);

  // Restore from Edit Data or Draft
  useEffect(() => {
    const editData = location.state?.editData;

    if (editData && villages.length > 0) {
      setIncidentDate(editData.additionalData?.incidentDate ? new Date(editData.additionalData.incidentDate) : new Date());
      setDisasterType(editData.disasterType || '');
      setDisasterTypeOther(editData.additionalData?.disasterTypeOther || '');
      setEstimatedHouseholds(editData.estimatedHouseholds?.toString() || '');
      setSeverity(editData.severity?.toString() || '');
      setNotes(editData.notes || '');
      setLatitude(editData.gpsLocation?.lat);
      setLongitude(editData.gpsLocation?.lng);
      setPolygonData(editData.polygon);

      if (editData.villageName) {
        const matchingVillage = villages.find(v =>
          v.name === editData.villageName ||
          `หมู่ ${v.moo} ${v.name}` === editData.villageName
        );
        if (matchingVillage) {
          setVillage(`หมู่ ${matchingVillage.moo} ${matchingVillage.name}`);
        } else {
          setVillage(editData.villageName);
        }
      }

      // Restore photos
      if (editData.photoUrls && Array.isArray(editData.photoUrls)) {
        const restoredPhotos: PhotoPreview[] = editData.photoUrls.map((url: string, i: number) => ({
          preview: url,
          name: `Existing Photo ${i + 1}`,
          file: null as any // Mark as existing
        }));
        setPhotos(restoredPhotos);
      }

      toast.success('✅ กู้คืนข้อมูลเดิมสำเร็จ');
      return;
    }

    const savedDraft = localStorage.getItem('incident-draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        const now = Date.now();
        const draftAge = now - (draft.timestamp || 0);

        if (draftAge < 24 * 60 * 60 * 1000) {
          // Ask user if they want to restore draft
          const shouldRestore = window.confirm(
            'พบแบบร่างที่บันทึกไว้\n\nต้องการกู้คืนข้อมูลหรือไม่?\n\n' +
            '- กด "ตกลง" เพื่อกู้คืนข้อมูล\n' +
            '- กด "ยกเลิก" เพื่อเริ่มต้นใหม่'
          );

          if (shouldRestore) {
            setIncidentDate(draft.incidentDate ? new Date(draft.incidentDate) : new Date());
            // DON'T restore disasterType, severity, and village - force user to select
            // setDisasterType(draft.disasterType || '');
            setDisasterTypeOther(draft.disasterTypeOther || '');
            // setVillage(draft.village || ''); // Don't restore - force user to select
            // setSeverity(draft.severity || ''); // Don't restore - force user to select
            setEstimatedHouseholds(draft.estimatedHouseholds || '');
            setNotes(draft.notes || '');
            setLatitude(draft.latitude);
            setLongitude(draft.longitude);
            setPolygonData(draft.polygonData);

            toast.success('✅ กู้คืนแบบร่างสำเร็จ (กรุณาเลือกหมู่บ้าน, ประเภทภัย และความรุนแรง)', {
              duration: 3000
            });
          } else {
            // User chose to start fresh - clear draft
            localStorage.removeItem('incident-draft');
            toast.success('🆕 เริ่มต้นใหม่');
          }
        } else {
          localStorage.removeItem('incident-draft');
        }
      } catch (e) {
        console.error('Failed to load draft:', e);
        localStorage.removeItem('incident-draft');
      }
    }
  }, [villages]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('survey-map').setView([19.9422, 99.2195], 13);

      // Initialize Layers
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map); // Default

      // Store refs
      osmLayerRef.current = osmLayer;

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;

      // ✅ Add Fullscreen control
      const fullscreenControl = new L.Control({ position: 'topleft' });
      (fullscreenControl as any).onAdd = function () {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = `
            <a href="#" class="leaflet-control-fullscreen" title="Toggle Fullscreen" role="button" aria-label="Toggle Fullscreen" style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; background: white; cursor: pointer;">
              <span style="font-size: 18px; line-height: 1;">⛶</span>
            </a>
          `;

        div.onclick = function (e: any) {
          e.preventDefault();
          e.stopPropagation(); // Prevent map click
          const mapContainer = document.getElementById('map-section-container');
          if (mapContainer) {
            if (!document.fullscreenElement) {
              mapContainer.requestFullscreen().then(() => {
                setTimeout(() => map.invalidateSize(), 100);
              }).catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
              });
            } else {
              document.exitFullscreen().then(() => {
                setTimeout(() => map.invalidateSize(), 100);
              });
            }
          }
        };

        return div;
      };
      fullscreenControl.addTo(map);

      // ✅ Add Cancel Draw Mode Button
      const CancelDrawControl = L.Control.extend({
        onAdd: function () {
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

      // Note: Geoman controls are managed by the village useEffect now

      // Set Geoman to work with our feature group
      map.pm.setGlobalOptions({
        layerGroup: drawnItems,
      });

      // ✅ Event: pm:drawstart - Check if village is selected
      map.on('pm:drawstart', (e: any) => {
        if (!villageRef.current) {
          toast.error('กรุณาเลือกหมู่บ้านก่อนวาดพื้นที่', {
            duration: 3000,
            icon: '⚠️'
          });

          // Disable draw mode immediately
          setTimeout(() => {
            map.pm.disableDraw();
          }, 10);
        }
      });

      // ✅ Event: pm:create - FOR POLYGON/RECTANGLE/MARKER
      map.on('pm:create', (e: any) => {
        const layer = e.layer;
        const shape = e.shape;

        // ✅ Handle Marker Creation
        if (shape === 'Marker') {
          setCurrentLayer(layer);
          setMarkerLabel(''); // Reset label

          // Add click listener for editing
          layer.on('click', (e: any) => {
            L.DomEvent.stopPropagation(e);
            setCurrentLayer(layer);
            const props = (layer as any).feature?.properties;
            setMarkerLabel(props?.label || '');
            setShowMarkerModal(true);
          });

          setShowMarkerModal(true); // Open modal

          // ✅ Disable draw mode to prevent continuous pinning
          setTimeout(() => {
            map.pm.disableDraw();
          }, 10);

          return;
        }

        // ✅ Process Polygon/Rectangle here
        if (shape === 'Polygon' || shape === 'Rectangle') {

          // Validate polygon points
          const latlngs = (layer as any).getLatLngs();
          const points = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;

          // ✅ ตรวจสอบว่ามีอย่างน้อย 4 จุด
          if (!points || points.length < 4) {
            console.warn('⚠️ Not enough points:', points?.length);
            drawnItemsRef.current?.removeLayer(layer);
            toast.error('❌ ต้องวาดอย่างน้อย 4 จุด\nปัจจุบันมี ' + (points?.length || 0) + ' จุด', {
              duration: 3000,
              icon: '⚠️'
            });

            // Disable draw mode
            setTimeout(() => {
              if (map.pm.globalDrawModeEnabled()) {
                map.pm.disableDraw();
              }
            }, 100);
            return;
          }

          // Update polygonData with ALL items (Filter to only include Polygons)
          if (drawnItemsRef.current) {
            const geoJson = (drawnItemsRef.current.toGeoJSON() as any);
            if (geoJson.features) {
              geoJson.features = geoJson.features.filter((f: any) =>
                f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
              );
            }
            setPolygonData(geoJson.features && geoJson.features.length > 0 ? geoJson : null);

            // Count polygons for toast
            const layers = drawnItemsRef.current.getLayers();
            const polygons = layers.filter(l => l instanceof L.Polygon || l instanceof L.Rectangle);
            const polygonCount = polygons.length; // This includes the one just added

            toast.success(`✅ วาดพื้นที่ที่ ${polygonCount} สำเร็จ (${points.length} จุด)`, {
              icon: '🎉'
            });
          } else {
            toast.success(`✅ วาด${shape === 'Polygon' ? 'รูปหลายเหลี่ยม' : 'สี่เหลี่ยม'}สำเร็จ (${points.length} จุด)`, {
              icon: '🎉'
            });
          }
        }
      });

      // ✅ Handle shape edited (Geoman)
      map.on('pm:edit', (e: any) => {
        if (drawnItemsRef.current) {
          const geoJson = (drawnItemsRef.current.toGeoJSON() as any);
          if (geoJson.features) {
            geoJson.features = geoJson.features.filter((f: any) =>
              f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
            );
          }
          setPolygonData(geoJson.features && geoJson.features.length > 0 ? geoJson : null);
        }
        toast.success('✏️ แก้ไขพื้นที่สำเร็จ');
      });

      // ✅ Handle shape deleted (Geoman)
      map.on('pm:remove', () => {
        if (drawnItemsRef.current) {
          const layers = drawnItemsRef.current.getLayers();
          if (layers.length === 0) {
            setPolygonData(null);
          } else {
            const geoJson = (drawnItemsRef.current.toGeoJSON() as any);
            if (geoJson.features) {
              geoJson.features = geoJson.features.filter((f: any) =>
                f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
              );
            }
            setPolygonData(geoJson.features && geoJson.features.length > 0 ? geoJson : null);
          }
        }
        toast('🗑️ ลบพื้นที่แล้ว', { icon: 'ℹ️' });
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // ✅ Manage Map Info Control (The "✅ วาดพื้นที่เรียบร้อย" box)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Define the custom control class
    const InfoControl = L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create('div', 'map-info-control');
        div.innerHTML = `
          <div style="
            background: rgba(255, 255, 255, 0.95);
            padding: 8px 16px;
            border-radius: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            font-weight: 600;
            color: #059669;
            display: flex;
            align-items: center;
            gap: 6px;
            backdrop-filter: blur(4px);
            white-space: nowrap;
            font-family: 'Sarabun', sans-serif;
          ">
            ✅ วาดพื้นที่เรียบร้อย
          </div>
        `;
        return div;
      }
    });

    // Check if control already exists (we can store it in a ref or look it up)
    // For simplicity, we'll remove any existing ones with this class first
    const existing = document.querySelectorAll('.map-info-control');
    existing.forEach(el => el.remove());

    if (polygonData) {
      new InfoControl({ position: 'topright' }).addTo(map);

      // Manually adjust position to be centered (Leaflet doesn't have 'topcenter' by default)
      // We use a timeout to ensure DOM is ready
      setTimeout(() => {
        const controlContainer = document.querySelector('.map-info-control');
        if (controlContainer) {
          // Move it to a custom container or adjust styles
          // Actually, standard Leaflet controls are in corners.
          // To center it, we can use 'topleft' and CSS absolute positioning on the control itself.
          // But 'topleft' stacks.

          // Better approach: Use 'topright' or 'topleft' and absolute position the inner div?
          // No, let's use the standard 'topright' for now to ensure visibility, 
          // OR stick to the previous design but inject it into the map container directly.

          // Let's try to simulate 'topcenter' by manipulating the DOM element
          const controlDiv = controlContainer as HTMLElement;
          controlDiv.style.position = 'absolute';
          controlDiv.style.left = '50%';
          controlDiv.style.transform = 'translateX(-50%)';
          controlDiv.style.top = '10px';
          controlDiv.style.margin = '0';
          controlDiv.style.zIndex = '1000';
          controlDiv.style.clear = 'none';
        }
      }, 0);
    }

  }, [polygonData]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng, accuracy: acc } = position.coords;

          setLatitude(lat);
          setLongitude(lng);
          setAccuracy(acc);

          // GPS Accuracy Warning
          if (acc > 100) {
            toast.error(
              `⚠️ ความแม่นยำ GPS ต่ำมาก (±${Math.round(acc)}m)\n` +
              'แนะนำให้ย้ายไปที่โล่งกว่าหรือรอสัญญาณดีขึ้น',
              { duration: 6000, icon: '📡' }
            );
          } else if (acc > 50) {
            toast(
              `⚠️ ความแม่นยำ GPS ปานกลาง (±${Math.round(acc)}m)\n` +
              'แนะนำให้ลองใหม่ที่โล่งกว่า หรือใช้ตำแหน่งนี้ได้',
              {
                duration: 5000,
                icon: '⚠️',
                style: { background: '#fef3c7', color: '#92400e' }
              }
            );
          } else {
            toast.success(
              `📍 ได้รับตำแหน่ง GPS แล้ว (ความแม่นยำ: ±${Math.round(acc)}m)`,
              { icon: '✅' }
            );
          }

          if (mapRef.current) {
            // Allow multiple markers - do not remove previous one
            // if (currentMarkerRef.current) {
            //   mapRef.current.removeLayer(currentMarkerRef.current);
            // }

            // Add marker with accuracy circle
            const marker = L.marker([lat, lng], { draggable: true })
              .addTo(mapRef.current)
              .bindPopup(`📍 ตำแหน่งปัจจุบัน<br><small>ความแม่นยำ: ±${Math.round(acc)}m</small>`)
              .openPopup();

            // Add to drawn items so it can be collected later
            if (drawnItemsRef.current) {
              drawnItemsRef.current.addLayer(marker);
            }
            // Add accuracy circle
            const accuracyCircle = L.circle([lat, lng], {
              radius: acc,
              color: acc > 100 ? '#ef4444' : acc > 50 ? '#f59e0b' : '#10b981',
              fillColor: acc > 100 ? '#fee2e2' : acc > 50 ? '#fef3c7' : '#d1fae5',
              fillOpacity: 0.2,
              weight: 2
            }).addTo(mapRef.current);

            // Update position when marker is dragged
            marker.on('dragend', function () {
              const position = marker.getLatLng();
              setLatitude(position.lat);
              setLongitude(position.lng);
            });

            currentMarkerRef.current = marker;
            mapRef.current.setView([lat, lng], 15);
          }
        },
        (error) => {
          toast.error('ไม่สามารถระบุตำแหน่งได้: ' + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast.error('เบราว์เซอร์ไม่รองรับ GPS');
    }
  };

  const clearPolygon = () => {
    if (drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers();
      setPolygonData(null);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

      // Check file sizes
      const oversizedFiles = files.filter(f => f.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        toast.error(`ไฟล์ "${oversizedFiles[0].name}" มีขนาดใหญ่เกิน 5MB`);
        e.target.value = ''; // Reset input
        return;
      }

      const newPhotos: PhotoPreview[] = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name
      }));

      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const updated = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].preview);
      return updated;
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map Thai disaster types to English enum values
  const mapDisasterTypeToEnum = (thaiType: string): string => {
    const mapping: Record<string, string> = {
      'น้ำท่วม': 'FLOOD',
      'ไฟป่า': 'FIRE',
      'ดินถลม': 'LANDSLIDE',
      'วาตภัย': 'STORM',
      'อัคคีภัย': 'FIRE',
      'แผ่นดินไหว': 'EARTHQUAKE',
      'ภัยแล้ง': 'DROUGHT',
      'อื่นๆ': 'OTHER'
    };
    const result = mapping[thaiType] || 'OTHER';
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Comprehensive validation
    const markersCount = drawnItemsRef.current
      ? drawnItemsRef.current.getLayers().filter(l => l instanceof L.Marker).length
      : 0;

    const validationErrors = validateIncidentForm({
      village,
      disasterType,
      severity,
      estimatedHouseholds,
      notes,
      latitude,
      longitude,
      polygonData,
      markersCount,
      incidentDate
    });

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      const firstError = getFirstError(validationErrors);
      toast.error(`⚠️ ${firstError}`, { duration: 4000 });
      return;
    }

    // Generate marker list HTML
    let markerListHtml = '';
    let polygonListHtml = '';

    if (drawnItemsRef.current) {
      const layers = drawnItemsRef.current.getLayers();
      const markers = layers.filter(l => l instanceof L.Marker);
      const polygons = layers.filter(l => !(l instanceof L.Marker));

      // Markers List
      if (markers.length > 0) {
        markerListHtml = '<div style="margin-top: 10px; background: #f9fafb; padding: 10px; border-radius: 8px;"><strong>📍 รายละเอียดจุด:</strong><ul style="margin: 5px 0 0 0; padding-left: 20px; font-size: 0.85rem; color: #4b5563;">';
        markers.forEach((layer: any) => {
          const props = layer.feature?.properties;
          if (props) {
            markerListHtml += `<li style="margin-bottom: 4px;"><strong>จุดที่ ${props.number}:</strong> ${props.label || '-'} <span style="color: #9ca3af;">(${props.latitude.toFixed(6)}, ${props.longitude.toFixed(6)})</span></li>`;
          }
        });
        markerListHtml += '</ul></div>';
      }

      // Polygons List
      if (polygons.length > 0) {
        polygonListHtml = '<div style="margin-top: 10px; background: #f0fdf4; padding: 10px; border-radius: 8px; border: 1px solid #bbf7d0;"><strong>📐 พื้นที่ที่วาด:</strong><ul style="margin: 5px 0 0 0; padding-left: 20px; font-size: 0.85rem; color: #166534;">';
        polygons.forEach((layer: any, index) => {
          const latlngs = layer.getLatLngs();
          // Leaflet polygons can be nested arrays (multipolygons or holes), usually latlngs[0] is the outer ring
          const points = Array.isArray(latlngs[0]) ? latlngs[0].length : latlngs.length;
          polygonListHtml += `<li style="margin-bottom: 4px;"><strong>พื้นที่ ${index + 1}:</strong> รูปทรง ${points} จุด</li>`;
        });
        polygonListHtml += '</ul></div>';
      }
    }

    // Confirm before submitting
    const result = await Swal.fire({
      title: 'ยืนยันการส่งรายงาน',
      html: `
        <div style="text-align: left; font-size: 0.95rem; line-height: 1.6;">
          <p><strong>วันที่เกิดเหตุ:</strong> ${incidentDate ? incidentDate.toLocaleDateString('th-TH') : '-'}</p>
          <p><strong>หมู่บ้าน:</strong> ${village}</p>
          <p><strong>ประเภทภัย:</strong> ${disasterType}</p>
          <p><strong>ความรุนแรง:</strong> ${severity === '5' ? 'วิกฤต' : severity === '4' ? 'รุนแรงมาก' : severity === '3' ? 'รุนแรง' : severity === '2' ? 'ปานกลาง' : 'เล็กน้อย'}</p>
          <p><strong>ครัวเรือนที่ได้รับผลกระทบ:</strong> ${estimatedHouseholds} ครัวเรือน</p>
          <p><strong>รายละเอียด:</strong> ${notes}</p>
          
          ${markerListHtml}
          ${polygonListHtml}
          
          <hr style="margin: 10px 0; border-color: #eee;">
          <p style="color: #666; font-size: 0.85rem;">กรุณาตรวจสอบความถูกต้องก่อนยืนยัน</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ยืนยันและส่งข้อมูล',
      cancelButtonText: 'แก้ไข',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload photos first (if any)
      let photoUrls: string[] = [];
      if (photos.length > 0) {
        try {
          const newFiles = photos.map(p => p.file);
          photoUrls = await fieldSurveyApi.uploadImages(newFiles);
        } catch (photoError) {
          console.error('❌ Photo upload failed:', photoError);
          toast.error('ไม่สามารถอัปโหลดรูปภาพได้ แต่จะดำเนินการต่อด้วยข้อมูลที่มี');
        }
      }

      // 2. Prepare data for Review Page
      const markers = drawnItemsRef.current ? drawnItemsRef.current.getLayers()
        .filter((layer: any) => layer instanceof L.Marker)
        .map((layer: any, index: number) => {
          const props = layer.feature?.properties;
          return {
            lat: layer.getLatLng().lat,
            lng: layer.getLatLng().lng,
            label: props?.label || ''
          };
        }) : [];

      const selectedVillage = villages.find(v => `หมู่ ${v.moo} ${v.name}` === village);

      const surveyData = {
        villageId: selectedVillage ? selectedVillage.id.toString() : '',
        villageName: selectedVillage ? selectedVillage.name : village,
        disasterType: mapDisasterTypeToEnum(disasterType), // Convert to English enum
        severity: Number(severity),
        estimatedHouseholds: Number(estimatedHouseholds),
        notes: disasterType === 'อื่นๆ' && disasterTypeOther
          ? `[ประเภทภัยอื่นๆ: ${disasterTypeOther}]\n\n${notes}`
          : notes,
        gpsLocation: {
          lat: latitude || 19.9422,
          lng: longitude || 99.2195,
        },
        polygon: polygonData,
        photoUrls,
        additionalData: {
          incidentDate: incidentDate?.toISOString(),
          markers,
          disasterTypeOther: disasterType === 'อื่นๆ' ? disasterTypeOther : undefined,
          disasterTypeThai: disasterType // Keep Thai version for reference
        }
      };

      // 3. Clear draft before navigating (prevent old data from persisting)
      localStorage.removeItem('incident-draft');
      console.log('🗑️ Draft cleared after successful submission');

      // 4. Navigate to Review Page
      navigate('/survey-review', {
        state: {
          surveyData,
          isNewIncident: true // Flag to tell Review Page to call incidentService.create
        }
      });

    } catch (error) {
      console.error('Error preparing incident report:', error);
      toast.error('เกิดข้อผิดพลาดในการเตรียมข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to create numbered icon
  const createNumberedIcon = (number: number) => {
    return L.divIcon({
      className: 'custom-numbered-icon',
      html: `
        <div style="
          background-color: #ef4444;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          ${number}
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };

  const handleSaveMarker = () => {
    if (currentLayer && markerLabel.trim()) {
      // Check if this is an existing marker being edited
      let markerNumber = (currentLayer as any).options?.markerNumber || (currentLayer as any).feature?.properties?.number;

      if (!markerNumber) {
        // Calculate next marker number for new markers (Max + 1)
        let maxNumber = 0;
        if (drawnItemsRef.current) {
          const layers = drawnItemsRef.current.getLayers();
          layers.forEach(l => {
            if (l instanceof L.Marker && l !== currentLayer) {
              const num = (l as any).options?.markerNumber || (l as any).feature?.properties?.number;
              if (num && num > maxNumber) maxNumber = num;
            }
          });
        }
        markerNumber = maxNumber + 1;
      }

      // Set numbered icon
      if (currentLayer instanceof L.Marker) {
        currentLayer.setIcon(createNumberedIcon(markerNumber));

        const latlng = currentLayer.getLatLng();
        const lat = latlng.lat.toFixed(6);
        const lng = latlng.lng.toFixed(6);

        // Bind popup with number, label, and GPS
        const popupContent = `
          <div style="text-align: center;">
            <strong>จุดที่ ${markerNumber}</strong><br>
            ${markerLabel}<br>
            <small style="color: #666;">${lat}, ${lng}</small>
          </div>
        `;
        currentLayer.bindPopup(popupContent).openPopup();

        // Save properties for GeoJSON and internal tracking
        (currentLayer as any).options.markerNumber = markerNumber;
        (currentLayer as any).feature = (currentLayer as any).feature || {};
        (currentLayer as any).feature.type = 'Feature';
        (currentLayer as any).feature.properties = {
          number: markerNumber,
          label: markerLabel,
          latitude: latlng.lat,
          longitude: latlng.lng
        };
      } else {
        // For non-marker shapes
        const popupContent = `<strong>จุดที่ ${markerNumber}</strong>: ${markerLabel}`;
        currentLayer.bindPopup(popupContent).openPopup();
      }

      // Add to drawn items if not already added
      if (drawnItemsRef.current) {
        if (!drawnItemsRef.current.hasLayer(currentLayer)) {
          drawnItemsRef.current.addLayer(currentLayer);
        }
        // Update polygonData state (Filter to only include Polygons)
        const geoJson = (drawnItemsRef.current.toGeoJSON() as any);
        if (geoJson.features) {
          geoJson.features = geoJson.features.filter((f: any) =>
            f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
          );
        }
        setPolygonData(geoJson.features && geoJson.features.length > 0 ? geoJson : null);
      }

      // ✅ Update GPS coordinates from marker
      if (currentLayer instanceof L.Marker) {
        const latlng = currentLayer.getLatLng();
        setLatitude(latlng.lat);
        setLongitude(latlng.lng);
        // Set accuracy to 0 or a small number to indicate manual placement
        setAccuracy(5);

        toast.success(`📍 อัปเดตพิกัดจากหมุดเรียบร้อย\nLat: ${latlng.lat.toFixed(6)}, Lng: ${latlng.lng.toFixed(6)}`, {
          icon: '📡',
          duration: 4000
        });
      }

      toast.success(`📍 เพิ่มจุดที่ ${markerNumber} เรียบร้อย`);
    } else if (currentLayer) {
      // Fallback for empty label
      let markerNumber = (currentLayer as any).options?.markerNumber || (currentLayer as any).feature?.properties?.number;

      if (!markerNumber) {
        // Calculate next marker number for new markers (Max + 1)
        let maxNumber = 0;
        if (drawnItemsRef.current) {
          const layers = drawnItemsRef.current.getLayers();
          layers.forEach(l => {
            if (l instanceof L.Marker && l !== currentLayer) {
              const num = (l as any).options?.markerNumber || (l as any).feature?.properties?.number;
              if (num && num > maxNumber) maxNumber = num;
            }
          });
        }
        markerNumber = maxNumber + 1;
      }

      if (currentLayer instanceof L.Marker) {
        currentLayer.setIcon(createNumberedIcon(markerNumber));

        const latlng = currentLayer.getLatLng();
        const lat = latlng.lat.toFixed(6);
        const lng = latlng.lng.toFixed(6);

        const popupContent = `
          <div style="text-align: center;">
            <strong>จุดที่ ${markerNumber}</strong><br>
            <small style="color: #666;">${lat}, ${lng}</small>
          </div>
        `;
        currentLayer.bindPopup(popupContent).openPopup();

        // Save properties for GeoJSON and internal tracking
        (currentLayer as any).options.markerNumber = markerNumber;
        (currentLayer as any).feature = (currentLayer as any).feature || {};
        (currentLayer as any).feature.type = 'Feature';
        (currentLayer as any).feature.properties = {
          number: markerNumber,
          label: '',
          latitude: latlng.lat,
          longitude: latlng.lng
        };
      } else {
        currentLayer.bindPopup(`จุดที่ ${markerNumber}`).openPopup();
      }

      if (drawnItemsRef.current) {
        if (!drawnItemsRef.current.hasLayer(currentLayer)) {
          drawnItemsRef.current.addLayer(currentLayer);
        }
        // Update polygonData state (Filter to only include Polygons)
        const geoJson = (drawnItemsRef.current.toGeoJSON() as any);
        if (geoJson.features) {
          geoJson.features = geoJson.features.filter((f: any) =>
            f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
          );
        }
        setPolygonData(geoJson.features && geoJson.features.length > 0 ? geoJson : null);
      }

      // ✅ Update GPS coordinates from marker (fallback case)
      if (currentLayer instanceof L.Marker) {
        const latlng = currentLayer.getLatLng();
        setLatitude(latlng.lat);
        setLongitude(latlng.lng);
        setAccuracy(5);

        toast.success(`📍 อัปเดตพิกัดจากหมุดเรียบร้อย`, { icon: '📡' });
      }
    }

    setShowMarkerModal(false);
    setCurrentLayer(null);
    setMarkerLabel('');
  };

  const handleCancelMarker = () => {
    if (currentLayer && mapRef.current) {
      mapRef.current.removeLayer(currentLayer);
      if (drawnItemsRef.current) {
        drawnItemsRef.current.removeLayer(currentLayer);
      }
    }
    setShowMarkerModal(false);
    setCurrentLayer(null);
    setMarkerLabel('');
    toast('ยกเลิกการเพิ่มจุด', { icon: '❌' });
  };

  return (
    <DashboardLayout>


      <div className="initial-survey-page">
        <div className="survey-header">
          <div>
            <h2>➕ รายงานเหตุการณ์ใหม่</h2>
            <p className="task-title">สำหรับเหตุการณ์ที่พบในพื้นที่ (ไม่ผ่านการมอบหมาย)</p>
          </div>
          <button
            className="cancel-btn"
            onClick={() => {
              localStorage.removeItem('incident-draft');
              console.log('🗑️ Draft cleared on cancel');
              navigate('/dashboard/officer');
            }}
          >
            ✕ ยกเลิก
          </button>
        </div>

        <div className="survey-content">

          <div className="map-section" id="map-section-container">
            <div id="survey-map"></div>

            {/* Marker Details Modal - Moved inside map section for fullscreen support */}
            {showMarkerModal && (
              <div className="modal-overlay" style={{ zIndex: 2000, position: 'absolute' }}>
                <div className="modal-content" style={{ maxWidth: '400px', padding: '20px' }}>
                  <h3 style={{ marginTop: 0, color: '#2d3748' }}>📍 รายละเอียดจุด</h3>

                  {/* Show GPS Coordinates */}
                  {currentLayer && currentLayer instanceof L.Marker && (
                    <div style={{
                      background: '#f3f4f6',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      fontSize: '14px',
                      color: '#4b5563',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>
                        <strong>Lat:</strong> {currentLayer.getLatLng().lat.toFixed(6)}
                      </span>
                      <span>
                        <strong>Lng:</strong> {currentLayer.getLatLng().lng.toFixed(6)}
                      </span>
                    </div>
                  )}

                  <div className="form-group">
                    <label>ชื่อ/รายละเอียดจุด *</label>
                    <input
                      type="text"
                      value={markerLabel}
                      onChange={(e) => setMarkerLabel(e.target.value)}
                      placeholder="เช่น บ้านผู้ใหญ่บ้าน, จุดน้ำท่วมสูง"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveMarker();
                        if (e.key === 'Escape') handleCancelMarker();
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleCancelMarker}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        background: 'white',
                        color: '#4a5568',
                        cursor: 'pointer'
                      }}
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleSaveMarker}
                      disabled={!markerLabel.trim()}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        background: markerLabel.trim() ? '#667eea' : '#cbd5e0',
                        color: 'white',
                        cursor: markerLabel.trim() ? 'pointer' : 'not-allowed'
                      }}
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="map-controls">
              <button className="map-btn" onClick={getCurrentLocation} title="ระบุตำแหน่งปัจจุบัน">
                <span>📍</span> Get Location
              </button>
              <button
                type="button"
                className="map-btn"
                onClick={() => {
                  if (drawnItemsRef.current && drawnItemsRef.current.getLayers().length > 0) {
                    Swal.fire({
                      title: 'ยืนยันการลบพื้นที่',
                      text: "คุณต้องการลบพื้นที่ที่วาดทั้งหมดใช่หรือไม่?",
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#ef4444',
                      cancelButtonColor: '#6b7280',
                      confirmButtonText: 'ใช่, ลบทั้งหมด',
                      cancelButtonText: 'ยกเลิก'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        drawnItemsRef.current?.clearLayers();
                        setPolygonData(null);
                        toast.success('ลบพื้นที่เรียบร้อย');
                      }
                    });
                  } else {
                    toast('ไม่มีพื้นที่ให้ลบ', { icon: 'ℹ️' });
                  }
                }}
                title="ลบพื้นที่ที่วาด"
                style={{ color: '#ef4444', borderColor: '#ef4444' }}
              >
                <span>🗑️</span> Clear Area
              </button>

            </div>


          </div>

          <div className="form-section">

            {latitude && longitude && (
              <div className="incident-form-card" style={{ marginBottom: '1rem', padding: '1rem' }}>
                <div
                  className="gps-toggle-btn"
                  onClick={() => setShowGpsInfo(!showGpsInfo)}
                  style={{ justifyContent: 'space-between', width: '100%' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📍 พิกัด: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </span>
                  <span style={{ fontSize: '0.8em', color: '#6b7280' }}>
                    {showGpsInfo ? '▲ ซ่อน' : '▼ รายละเอียด'}
                  </span>
                </div>

                {showGpsInfo && (
                  <div className="gps-info-panel" style={{ marginTop: '1rem', marginBottom: 0 }}>
                    <div className="gps-data" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div><strong>Lat:</strong> {latitude.toFixed(6)}</div>
                      <div><strong>Lng:</strong> {longitude.toFixed(6)}</div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <strong>Accuracy:</strong> ±{accuracy?.toFixed(0)}m
                        {accuracy && accuracy > 50 && <span style={{ color: '#f59e0b', marginLeft: '8px' }}>(ความแม่นยำต่ำ)</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="survey-form incident-form-card">
              {isSubmitting && (
                <div className="loading-overlay">
                  <div className="spinner"></div>
                  <p>กำลังบันทึกข้อมูล...</p>
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label>วันที่เกิดเหตุ *</label>
                  <ThaiDatePicker
                    id="incident-date"
                    value={incidentDate}
                    onChange={setIncidentDate}
                    placeholder="เลือกวันที่เกิดเหตุ"
                    maxDate={new Date()}
                  />
                </div>

                <div className="form-group">
                  <label>หมู่บ้านที่ได้รับผลกระทบ *</label>
                  <select
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    required
                    disabled={isLoadingVillages}
                    onInvalid={(e) => e.currentTarget.setCustomValidity('กรุณาเลือกหมู่บ้าน')}
                    onInput={(e) => e.currentTarget.setCustomValidity('')}
                  >
                    <option value="">
                      {isLoadingVillages ? '⏳ กำลังโหลดข้อมูล...' : '-- เลือกหมู่บ้าน --'}
                    </option>
                    {villages.map((v) => (
                      <option key={v.id} value={`หมู่ ${v.moo} ${v.name}`}>
                        หมู่ {v.moo} - {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>ประเภทภัย *</label>
                  <select
                    value={disasterType}
                    onChange={(e) => setDisasterType(e.target.value)}
                    required
                    onInvalid={(e) => e.currentTarget.setCustomValidity('กรุณาเลือกประเภทภัย')}
                    onInput={(e) => e.currentTarget.setCustomValidity('')}
                  >
                    <option value="">-- เลือกประเภทภัย --</option>
                    <option value="น้ำท่วม">น้ำท่วม</option>
                    <option value="ไฟป่า">ไฟป่า</option>
                    <option value="ดินถลม">ดินถล่ม</option>
                    <option value="วาตภัย">วาตภัย</option>
                    <option value="อัคคีภัย">อัคคีภัย</option>
                    <option value="แผ่นดินไหว">แผ่นดินไหว</option>
                    <option value="ภัยแล้ง">ภัยแล้ง</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                  {disasterType === 'อื่นๆ' && (
                    <input
                      type="text"
                      value={disasterTypeOther}
                      onChange={(e) => setDisasterTypeOther(e.target.value)}
                      placeholder="ระบุประเภทภัยอื่นๆ..."
                      style={{ marginTop: '8px' }}
                      required
                    />
                  )}
                </div>

                <div className="form-group">
                  <label>ความรุนแรง *</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    required
                    onInvalid={(e) => e.currentTarget.setCustomValidity('กรุณาเลือกความรุนแรง')}
                    onInput={(e) => e.currentTarget.setCustomValidity('')}
                  >
                    <option value="">-- เลือกความรุนแรง --</option>
                    <option value="1">1 - เล็กน้อย</option>
                    <option value="2">2 - ปานกลาง</option>
                    <option value="3">3 - รุนแรง</option>
                    <option value="4">4 - รุนแรงมาก</option>
                    <option value="5">5 - วิกฤต</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>จำนวนครัวเรือน (ประมาณ) *</label>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    placeholder="0"
                    value={estimatedHouseholds}
                    onChange={(e) => setEstimatedHouseholds(e.target.value)}
                    required
                    onInvalid={(e) => e.currentTarget.setCustomValidity('กรุณากรอกจำนวนครัวเรือน')}
                    onInput={(e) => e.currentTarget.setCustomValidity('')}
                  />
                </div>

                <div className="form-group full-width">
                  <label>หมายเหตุ</label>
                  <textarea
                    rows={3}
                    placeholder="รายละเอียดเพิ่มเติม..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-group full-width photo-upload-container">
                  <label>รูปถ่าย</label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />

                  <div
                    className="upload-drop-zone"
                    onClick={() => {
                      const input = document.getElementById('file-input') as HTMLInputElement;
                      if (input) input.click();
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files) {
                        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                        const newPhotos: PhotoPreview[] = files.map(file => ({
                          file,
                          preview: URL.createObjectURL(file),
                          name: file.name
                        }));
                        setPhotos(prev => [...prev, ...newPhotos]);
                      }
                    }}
                  >
                    <span className="upload-icon">📷</span>
                    <div className="upload-text">คลิกเพื่อเลือกรูป หรือลากไฟล์มาวางที่นี่</div>
                    <div className="upload-subtext">รองรับไฟล์ JPG, PNG (สูงสุด 10 รูป)</div>
                  </div>

                  {photos.length > 0 && (
                    <div className="photo-preview-grid">
                      {photos.map((photo, i) => (
                        <div key={i} className="photo-preview-item">
                          <img src={photo.preview} alt={`Photo ${i + 1}`} />
                          <button
                            type="button"
                            className="photo-remove"
                            onClick={() => removePhoto(i)}
                            title="ลบรูป"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" className="submit-btn" style={{ flex: 2 }} disabled={isSubmitting}>
                  {isSubmitting ? '⏳ กำลังส่ง...' : '✅ ส่งรายงานเหตุการณ์'}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  style={{ flex: 1, marginLeft: 0 }}
                  onClick={() => navigate('/dashboard/officer')}
                  disabled={isSubmitting}
                >
                  ยกเลิก
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </DashboardLayout >
  );
}
