import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { villagesApi, type LeafletVillage } from '../../api/villages';
import { fieldSurveyApi } from '../../api/fieldSurvey';
import { tasksApi } from '../../api/tasks';
import type { Task } from '../../types';
import ThaiDatePicker from '../../components/ThaiDatePicker';
import { validateIncidentForm, hasValidationErrors, getFirstError, type IncidentValidationErrors } from '../../validation/incident-validation';
import './InitialSurveyPage.css';
import './InitialSurveyPage-fullscreen.css';
import './CreateIncidentReportPage.css';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PhotoPreview {
  file?: File;
  preview: string;
  name: string;
}

export function InitialSurveyPage() {
  const { taskId } = useParams<{ taskId: string }>();
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

  // Task state
  const [task, setTask] = useState<Task | null>(null);
  const [taskLoading, setTaskLoading] = useState(false);

  // Form state
  const [incidentDate, setIncidentDate] = useState<Date | null>(new Date());
  const [disasterType, setDisasterType] = useState('');
  const [disasterTypeOther, setDisasterTypeOther] = useState('');
  const [village, setVillage] = useState('');
  const [estimatedHouseholds, setEstimatedHouseholds] = useState('');
  const [severity, setSeverity] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);

  // Additional fields for survey
  const [injured, setInjured] = useState('');
  const [deaths, setDeaths] = useState('');
  const [estimatedDamage, setEstimatedDamage] = useState('');

  // Data state
  const [villages, setVillages] = useState<LeafletVillage[]>([]);
  const [isLoadingVillages, setIsLoadingVillages] = useState(true);

  // GPS state
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [locationName, setLocationName] = useState<string>('');

  // Auto-generate location name based on disaster type and village
  useEffect(() => {
    // Only auto-fill if the current locationName is empty or the default placeholder
    if (!locationName || locationName === 'ตำแหน่งปัจจุบัน') {
      if (disasterType && village) {
        const type = disasterType === 'อื่นๆ' ? (disasterTypeOther || 'ภัยอื่นๆ') : disasterType;
        // Format: "พื้นที่เกิด[ประเภทภัย] [หมู่บ้าน]"
        setLocationName(`พื้นที่เกิด${type} ${village}`);
      }
    }
  }, [disasterType, village, disasterTypeOther]);

  // Polygon state
  const [polygonData, setPolygonData] = useState<any>(null);

  // Marker Modal state
  const [showMarkerModal, setShowMarkerModal] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<L.Layer | null>(null);
  const [markerLabel, setMarkerLabel] = useState('');

  // Validation errors state
  const [errors, setErrors] = useState<IncidentValidationErrors>({});
  const [showGpsInfo, setShowGpsInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const restoredRef = useRef<boolean>(false);

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

  // Fetch task from API if taskId is provided
  useEffect(() => {
    if (taskId) {
      setTaskLoading(true);
      tasksApi.getById(taskId)
        .then(taskData => {
          setTask(taskData);
          setTaskLoading(false);
        })
        .catch(error => {
          console.error('Failed to load task:', error);
          setTaskLoading(false);
          toast.error('ไม่สามารถโหลดข้อมูลงานได้');
        });
    }
  }, [taskId]);

  // Restore from Edit Data (High Priority)
  useEffect(() => {
    const editData = location.state?.editData;
    if (editData && villages.length > 0 && !restoredRef.current) {
      console.log('✏️ Restoring from edit data:', editData);
      restoredRef.current = true; // Mark as restored

      // Restore basic fields
      setDisasterType(editData.disasterType || '');
      setSeverity(editData.severity?.toString() || '');
      setEstimatedHouseholds(editData.estimatedHouseholds?.toString() || '');

      // Restore Village (Match with formatted string to trigger boundary logic)
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

      // Restore notes and "Other" specification
      if (editData.notes) {
        const otherMatch = editData.notes.match(/^\[ประเภทภัยอื่นๆ: (.*?)\]\n\n(.*)/s);
        if (otherMatch) {
          setDisasterTypeOther(otherMatch[1]);
          setNotes(otherMatch[2]);
        } else {
          setNotes(editData.notes);
        }
      }

      // Restore GPS
      if (editData.gpsLocation) {
        setLatitude(editData.gpsLocation.lat);
        setLongitude(editData.gpsLocation.lng);
      }

      // Restore Photos
      if (editData.photoUrls && Array.isArray(editData.photoUrls)) {
        const restoredPhotos: PhotoPreview[] = editData.photoUrls.map((url: string, i: number) => ({
          preview: url,
          name: `Existing Photo ${i + 1}`
        }));
        setPhotos(restoredPhotos);
      }

      // Restore Markers (Multi-point with Icons and Properties)
      if (editData.additionalData?.markers && Array.isArray(editData.additionalData.markers)) {
        setTimeout(() => {
          if (mapRef.current && drawnItemsRef.current) {
            // Clear existing if any (prevent duplicates)
            drawnItemsRef.current.getLayers().forEach(layer => {
              if (layer instanceof L.Marker) drawnItemsRef.current?.removeLayer(layer);
            });

            editData.additionalData.markers.forEach((m: any, index: number) => {
              const markerNumber = index + 1;
              const icon = L.divIcon({
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
                    ${markerNumber}
                  </div>
                `,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -12]
              });

              const marker = L.marker([m.lat, m.lng], { draggable: true, icon })
                .bindPopup(`
                  <div style="text-align: center;">
                    <strong>จุดที่ ${markerNumber}</strong><br>
                    ${m.label || '📍 ตำแหน่ง'}<br>
                    <small style="color: #666;">${m.lat.toFixed(6)}, ${m.lng.toFixed(6)}</small>
                  </div>
                `)
                .addTo(drawnItemsRef.current!);

              // Add click listener to edit existing marker
              marker.on('click', (e: any) => {
                L.DomEvent.stopPropagation(e);
                setCurrentLayer(marker);
                const props = (marker as any).feature?.properties;
                setMarkerLabel(props?.label || '');
                setShowMarkerModal(true);
              });

              // Restore properties so they can be re-collected
              (marker as any).options.markerNumber = markerNumber;
              (marker as any).feature = {
                type: 'Feature',
                properties: {
                  number: markerNumber,
                  label: m.label,
                  latitude: m.lat,
                  longitude: m.lng
                }
              };
            });
          }
        }, 800);
      }

      // Restore Polygon
      if (editData.polygon) {
        setPolygonData(editData.polygon);
        setTimeout(() => {
          if (mapRef.current && drawnItemsRef.current && editData.polygon) {
            // Clear existing polygons to avoid overlap
            drawnItemsRef.current.getLayers().forEach(layer => {
              if (layer instanceof L.Polygon) drawnItemsRef.current?.removeLayer(layer);
            });

            L.geoJSON(editData.polygon, {
              filter: (feature) => feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon',
              style: {
                color: '#3b82f6',
                weight: 3,
                fillOpacity: 0.2
              }
            }).eachLayer((layer: any) => {
              drawnItemsRef.current?.addLayer(layer);
            });
          }
        }, 800);
      }

      // Restore Additional Data
      if (editData.additionalData) {
        setInjured(editData.additionalData.injured?.toString() || '');
        setDeaths(editData.additionalData.deaths?.toString() || '');
        setEstimatedDamage(editData.additionalData.estimatedDamage?.toString() || '');
        if (editData.additionalData.incidentDate) {
          setIncidentDate(new Date(editData.additionalData.incidentDate));
        }
        if (editData.additionalData.locationName) {
          setLocationName(editData.additionalData.locationName);
        }
      }
    }
  }, [location.state, villages]);

  // Populate form data from task when task and villages are loaded
  useEffect(() => {
    // If we are restoring from editData, don't populate from task
    if (location.state?.editData) return;

    if (task && villages.length > 0) {
      console.log('📋 Populating form from task:', task);

      // Set disaster type
      if (task.incident?.disasterType) {
        const disasterMap: Record<string, string> = {
          'FLOOD': 'น้ำท่วม',
          'LANDSLIDE': 'ดินถลม',
          'STORM': 'วาตภัย',
          'FIRE': 'อัคคีภัย',
          'WILDFIRE': 'ไฟป่า',
          'EARTHQUAKE': 'แผ่นดินไหว',
          'DROUGHT': 'ภัยแล้ง',
          'OTHER': 'อื่นๆ'
        };
        setDisasterType(disasterMap[task.incident.disasterType] || task.incident.disasterType);
      }

      // Set notes
      if (task.description) {
        setNotes(task.description);
      } else if (task.incident?.description) {
        setNotes(task.incident.description);
      }

      // Set location name
      if (task.incident?.address) {
        setLocationName(task.incident.address);
      }

      // Set severity
      if (task.incident?.priority) {
        const severityMap: Record<string, string> = {
          'LOW': '1',
          'MEDIUM': '3',
          'HIGH': '4',
          'URGENT': '5',
          'CRITICAL': '5'
        };
        setSeverity(severityMap[task.incident.priority] || '');
      }

      // Set incident date
      if ((task.incident as any)?.reportedAt) {
        setIncidentDate(new Date((task.incident as any).reportedAt));
      } else if (task.createdAt) {
        setIncidentDate(new Date(task.createdAt));
      }

      // Set village
      if (task.village) {
        // Try to find matching village in our list
        let matchingVillage = villages.find(v => v.id.toString() === task.village?.id?.toString());

        if (!matchingVillage && task.village?.name) {
          matchingVillage = villages.find(v => v.name === task.village?.name);
        }

        if (!matchingVillage && task.village?.name) {
          const taskVillageName = task.village.name.trim();
          matchingVillage = villages.find(v => v.name.includes(taskVillageName) || taskVillageName.includes(v.name));
        }

        if (matchingVillage) {
          // Format as "หมู่ X Name" to match the select options if possible, or just use name
          // The select expects the value to match one of the options
          // In CreateIncidentReportPage, options are `หมู่ ${v.moo} ${v.name}`
          const villageValue = `หมู่ ${matchingVillage.moo} ${matchingVillage.name}`;
          setVillage(villageValue);

          // Also set estimated households if available
          if (matchingVillage.households) {
            setEstimatedHouseholds(matchingVillage.households.toString());
          }
        }
      }
    }
  }, [task, villages]);

  // Auto-Save & Restore Draft Logic
  useEffect(() => {
    // If we are restoring from editData, don't check for drafts
    if (!taskId || location.state?.editData) return;

    const draftKey = `survey-draft-${taskId}`;
    const draftStr = localStorage.getItem(draftKey);

    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        // Check if draft is not too old (24 hours)
        const age = Date.now() - draft.timestamp;
        if (age > 24 * 60 * 60 * 1000) {
          localStorage.removeItem(draftKey);
          return;
        }

        // Delay slightly to ensure task data doesn't overwrite immediately, or use a flag
        // For simplicity, we'll ask the user. If they say yes, we set the state.
        // We use a small timeout to let the initial task population finish if it's racing.
        setTimeout(() => {
          Swal.fire({
            title: 'พบข้อมูลที่บันทึกไว้',
            text: `คุณต้องการกู้คืนข้อมูลที่ทำค้างไว้เมื่อ ${new Date(draft.timestamp).toLocaleString('th-TH')} หรือไม่?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'กู้คืน',
            cancelButtonText: 'ไม่, เริ่มใหม่',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
          }).then((result) => {
            if (result.isConfirmed) {
              if (draft.village) setVillage(draft.village);
              if (draft.disasterType) setDisasterType(draft.disasterType);
              if (draft.severity) setSeverity(draft.severity);
              if (draft.estimatedHouseholds) setEstimatedHouseholds(draft.estimatedHouseholds);
              if (draft.notes) setNotes(draft.notes);
              if (draft.latitude) setLatitude(draft.latitude);
              if (draft.longitude) setLongitude(draft.longitude);
              if (draft.polygonData) setPolygonData(draft.polygonData);
              if (draft.incidentDate) setIncidentDate(new Date(draft.incidentDate));
              if (draft.injured) setInjured(draft.injured);
              if (draft.deaths) setDeaths(draft.deaths);
              if (draft.estimatedDamage) setEstimatedDamage(draft.estimatedDamage);
              if (draft.locationName) setLocationName(draft.locationName);

              toast.success('กู้คืนข้อมูลเรียบร้อยแล้ว');
            } else {
              localStorage.removeItem(draftKey);
            }
          });
        }, 500);

      } catch (e) {
        console.error('Failed to parse draft', e);
        localStorage.removeItem(draftKey);
      }
    }
  }, [taskId]); // Run once when taskId is available

  // Save Draft on Change
  useEffect(() => {
    if (!taskId || !village) return; // Don't save if no task or basic info

    const draftKey = `survey-draft-${taskId}`;
    const draftData = {
      timestamp: Date.now(),
      village,
      disasterType,
      severity,
      estimatedHouseholds,
      notes,
      latitude,
      longitude,
      polygonData,
      incidentDate,
      injured,
      deaths,
      estimatedDamage,
      locationName
    };

    const handler = setTimeout(() => {
      localStorage.setItem(draftKey, JSON.stringify(draftData));
    }, 1000); // Debounce 1s

    return () => clearTimeout(handler);
  }, [taskId, village, disasterType, severity, estimatedHouseholds, notes, latitude, longitude, polygonData, incidentDate, injured, deaths, estimatedDamage, locationName]);

  // Sync village state to ref for event listeners
  useEffect(() => {
    villageRef.current = village;
  }, [village]);

  // Manage Geoman controls and Map Layers based on village selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Update ref for map event listeners
    villageRef.current = village;

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

      // Switch to Google Hybrid
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
        if (villageBoundaryLayerRef.current) {
          map.removeLayer(villageBoundaryLayerRef.current);
        }

        const polygon = L.polygon(selectedVillage.boundary, {
          color: '#F59E0B',
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
        }

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
      map.pm.removeControls();
      if (googleHybridLayerRef.current) map.removeLayer(googleHybridLayerRef.current);
      if (osmLayerRef.current) osmLayerRef.current.addTo(map);

      if (villageBoundaryLayerRef.current) {
        map.removeLayer(villageBoundaryLayerRef.current);
        villageBoundaryLayerRef.current = null;
      }

      map.setView([19.9422, 99.2195], 13);
    }
  }, [village, villages]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('survey-map').setView([19.9422, 99.2195], 13);

      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      osmLayerRef.current = osmLayer;

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;

      // Fullscreen control
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
          e.stopPropagation();
          const mapContainer = document.getElementById('map-section-container');
          if (mapContainer) {
            if (!document.fullscreenElement) {
              mapContainer.requestFullscreen().then(() => {
                setTimeout(() => map.invalidateSize(), 100);
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

      // Cancel Draw Button
      const CancelDrawControl = L.Control.extend({
        onAdd: function () {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control cancel-draw-control');
          const button = L.DomUtil.create('button', 'cancel-draw-btn', container);
          button.innerHTML = `<span style="font-size: 20px;">❌</span><span style="font-size: 14px; font-weight: 500;">ยกเลิก</span>`;
          button.style.cssText = `background: #ef4444; color: white; border: none; padding: 10px 16px; cursor: pointer; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); font-family: 'Sarabun', sans-serif; display: none; align-items: center; gap: 6px; font-weight: 500;`;

          L.DomEvent.on(button, 'click', function (e) {
            L.DomEvent.preventDefault(e);
            L.DomEvent.stopPropagation(e);
            map.pm.disableDraw();
            button.style.display = 'none';
            toast('ยกเลิกการวาด', { icon: 'ℹ️' });
          });

          map.on('pm:drawstart', () => { button.style.display = 'flex'; });
          map.on('pm:drawend', () => { button.style.display = 'none'; });
          map.on('pm:globaldrawmodetoggled', (e: any) => { if (!e.enabled) button.style.display = 'none'; });
          return container;
        }
      });
      map.addControl(new CancelDrawControl({ position: 'topright' }));

      map.pm.setGlobalOptions({ layerGroup: drawnItems });

      map.on('pm:drawstart', (e: any) => {
        if (!villageRef.current) {
          toast.error('กรุณาเลือกหมู่บ้านก่อนวาดพื้นที่', { duration: 3000, icon: '⚠️' });
          setTimeout(() => map.pm.disableDraw(), 10);
        }
      });

      map.on('pm:create', (e: any) => {
        const layer = e.layer;
        const shape = e.shape;

        if (shape === 'Marker') {
          setCurrentLayer(layer);
          setMarkerLabel('');
          setShowMarkerModal(true);
          setTimeout(() => map.pm.disableDraw(), 10);
          return;
        }

        if (shape === 'Polygon' || shape === 'Rectangle') {
          const latlngs = (layer as any).getLatLngs();
          const points = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;

          if (!points || points.length < 4) {
            drawnItemsRef.current?.removeLayer(layer);
            toast.error('❌ ต้องวาดอย่างน้อย 4 จุด');
            setTimeout(() => { if (map.pm.globalDrawModeEnabled()) map.pm.disableDraw(); }, 100);
            return;
          }

          if (drawnItemsRef.current) {
            // Filter GeoJSON to only include Polygons
            const geoJson = (drawnItemsRef.current.toGeoJSON() as any);
            if (geoJson.features) {
              geoJson.features = geoJson.features.filter((f: any) =>
                f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
              );
            }
            setPolygonData(geoJson);
            toast.success(`✅ วาดพื้นที่สำเร็จ (${points.length} จุด)`, { icon: '🎉' });
          }
        }
      });

      map.on('pm:edit', () => {
        if (drawnItemsRef.current) {
          const geoJson = (drawnItemsRef.current.toGeoJSON() as any);
          if (geoJson.features) {
            geoJson.features = geoJson.features.filter((f: any) =>
              f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
            );
          }
          setPolygonData(geoJson);
        }
      });

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng, accuracy: acc } = position.coords;
          setLatitude(lat);
          setLongitude(lng);
          setAccuracy(acc);

          if (acc > 100) toast.error(`⚠️ ความแม่นยำ GPS ต่ำมาก (±${Math.round(acc)}m)`, { icon: '📡' });
          else toast.success(`📍 ได้รับตำแหน่ง GPS แล้ว (ความแม่นยำ: ±${Math.round(acc)}m)`, { icon: '✅' });

          if (mapRef.current) {
            // Allow multiple markers - do not remove previous one
            // if (currentMarkerRef.current) mapRef.current.removeLayer(currentMarkerRef.current);

            const marker = L.marker([lat, lng], { draggable: true })
              .addTo(mapRef.current)
              .bindPopup(`📍 ตำแหน่งปัจจุบัน<br><small>ความแม่นยำ: ±${Math.round(acc)}m</small>`)
              .openPopup();

            // Add to drawn items so it can be collected later
            if (drawnItemsRef.current) {
              drawnItemsRef.current.addLayer(marker);
            }

            L.circle([lat, lng], {
              radius: acc,
              color: acc > 100 ? '#ef4444' : acc > 50 ? '#f59e0b' : '#10b981',
              fillColor: acc > 100 ? '#fee2e2' : acc > 50 ? '#fef3c7' : '#d1fae5',
              fillOpacity: 0.2,
              weight: 2
            }).addTo(mapRef.current);

            marker.on('dragend', function () {
              const position = marker.getLatLng();
              setLatitude(position.lat);
              setLongitude(position.lng);
            });

            currentMarkerRef.current = marker;
            mapRef.current.setView([lat, lng], 15);
          }
        },
        (error) => toast.error('ไม่สามารถระบุตำแหน่งได้: ' + error.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast.error('เบราว์เซอร์ไม่รองรับ GPS');
    }
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
        // Create numbered icon (using inline style for simplicity as helper function might be missing)
        const icon = L.divIcon({
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
              ${markerNumber}
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -12]
        });
        currentLayer.setIcon(icon);

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

        // Add click listener if not already present
        if (!currentLayer.hasEventListeners('click')) {
          currentLayer.on('click', (e: any) => {
            L.DomEvent.stopPropagation(e);
            setCurrentLayer(currentLayer);
            const props = (currentLayer as any).feature?.properties;
            setMarkerLabel(props?.label || '');
            setShowMarkerModal(true);
          });
        }

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

      // Update GPS coordinates from marker
      if (currentLayer instanceof L.Marker) {
        const latlng = currentLayer.getLatLng();
        setLatitude(latlng.lat);
        setLongitude(latlng.lng);
        setAccuracy(5);

        toast.success(`📍 อัปเดตพิกัดจากหมุดเรียบร้อย`, { icon: '📡' });
      }

      toast.success(`📍 บันทึกจุดที่ ${markerNumber} เรียบร้อย`);
    }

    setShowMarkerModal(false);
    setCurrentLayer(null);
    setMarkerLabel('');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
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
      toast.error(`⚠️ ${firstError}`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload photos first
      let photoUrls: string[] = [];
      if (photos.length > 0) {
        try {
          // Separate existing photos from new ones
          const existingUrls = photos.filter(p => !p.file).map(p => p.preview);
          const newFiles = photos.filter(p => p.file).map(p => p.file as File);

          let newUrls: string[] = [];
          if (newFiles.length > 0) {
            newUrls = await fieldSurveyApi.uploadImages(newFiles);
          }

          photoUrls = [...existingUrls, ...newUrls];
        } catch (photoError) {
          console.error('❌ Photo upload failed:', photoError);
          toast.error('ไม่สามารถอัปโหลดรูปภาพได้ แต่จะบันทึกข้อมูลอื่นๆ');
          // Fallback to existing photos at least
          photoUrls = photos.filter(p => !p.file).map(p => p.preview);
        }
      }

      // Find village ID
      const selectedVillage = villages.find(v => `หมู่ ${v.moo} ${v.name}` === village);

      const surveyData = {
        taskId: taskId || undefined,
        villageId: selectedVillage ? selectedVillage.id.toString() : '',
        villageName: selectedVillage ? selectedVillage.name : village,
        disasterType,
        severity: Number(severity),
        estimatedHouseholds: Number(estimatedHouseholds),
        notes: disasterType === 'อื่นๆ' && disasterTypeOther
          ? `[ประเภทภัยอื่นๆ: ${disasterTypeOther}]\n\n${notes}`
          : notes,
        // Use Village Center as primary GPS if available, otherwise fallback to current/map center
        gpsLocation: {
          lat: selectedVillage?.lat || latitude || 19.9422,
          lng: selectedVillage?.lng || longitude || 99.2195,
        },
        polygon: polygonData,
        photoUrls,
        additionalData: {
          injured: injured ? Number(injured) : 0,
          deaths: deaths ? Number(deaths) : 0,
          estimatedDamage: estimatedDamage ? Number(estimatedDamage) : 0,
          incidentDate: incidentDate?.toISOString(),
          accuracy,
          locationName,
          // Current GPS (Device/Map center) for reference
          deviceGps: {
            lat: latitude || 19.9422,
            lng: longitude || 99.2195
          },
          // Collect all markers with full details (Use stored label to avoid HTML)
          markers: drawnItemsRef.current ? drawnItemsRef.current.getLayers()
            .filter((layer: any) => layer instanceof L.Marker)
            .map((layer: any) => {
              // Try to get label from properties first (cleanest)
              let label = (layer as any).feature?.properties?.label;

              // Fallback to popup content if properties missing
              if (!label) {
                const content = layer.getPopup()?.getContent();
                if (typeof content === 'string') {
                  label = content.replace(/<[^>]*>?/gm, '').trim();
                } else {
                  label = '📍 ตำแหน่ง';
                }
              }

              return {
                lat: layer.getLatLng().lat,
                lng: layer.getLatLng().lng,
                label: label || '📍 ตำแหน่ง'
              };
            }) : []
        }
      };

      // Clear draft
      if (taskId) {
        localStorage.removeItem(`survey-draft-${taskId}`);
      }

      // Navigate to review page
      navigate('/survey-review', {
        state: { surveyData }
      });

    } catch (error: any) {
      console.error('❌ Error submitting survey:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout noPadding>
      <div className="initial-survey-page">
        {/* Header */}
        {/* Header - Distinct Design for Survey Task */}
        <div className="survey-header" style={{
          background: taskId ? 'linear-gradient(to right, #fff, #fff7ed)' : 'linear-gradient(to right, #fff, #f0f9ff)',
          borderLeft: taskId ? '4px solid #f97316' : '4px solid #3b82f6'
        }}>
          <div className="header-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>{taskId ? '📋' : '🗺️'}</span>
              <div>
                <h2 style={{ color: taskId ? '#c2410c' : '#1e40af', margin: 0 }}>
                  {taskId ? 'ปฏิบัติงานสำรวจ' : 'สำรวจพื้นที่ใหม่'}
                </h2>
                <div className="task-info" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  {taskId && (
                    <span className="task-id-badge" style={{
                      background: '#f97316',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      TASK-{taskId}
                    </span>
                  )}
                  <p className="task-title" style={{ margin: 0, fontWeight: 500, color: '#4b5563' }}>
                    {taskId ? (task ? task.title : 'กำลังโหลดข้อมูลงาน...') : 'สำรวจพื้นที่และบันทึกข้อมูลภัยพิบัติ'}
                  </p>
                  {task && taskId && (
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: '📋 รายละเอียดคำสั่ง',
                          html: `
                            <div style="text-align: left; font-size: 14px;">
                              <p><strong>หัวข้อ:</strong> ${task.title}</p>
                              <p><strong>ความสำคัญ:</strong> ${task.priority}</p>
                              <p><strong>รายละเอียด:</strong> ${task.description || '-'}</p>
                              <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
                              <p><strong>ผู้มอบหมาย:</strong> ${task.assigner ? `${task.assigner.firstName} ${task.assigner.lastName}` : 'ศูนย์บัญชาการ'}</p>
                              <p><strong>หมายเหตุจากผู้บังคับบัญชา:</strong> ${task.supervisorComment || '-'}</p>
                            </div>
                          `,
                          confirmButtonText: 'ปิด',
                          confirmButtonColor: '#6b7280'
                        });
                      }}
                      style={{
                        background: 'none',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '12px',
                        color: '#4b5563',
                        cursor: 'pointer',
                        marginLeft: '8px'
                      }}
                    >
                      ℹ️ รายละเอียด
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Step Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f97316', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>1</div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#c2410c' }}>สำรวจ</span>
              </div>
              <div style={{ width: '20px', height: '2px', background: '#e5e7eb' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.5 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e5e7eb', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>2</div>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>ตรวจสอบ</span>
              </div>
            </div>

            {task?.assigner && (
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#6b7280' }}>
                <div>มอบหมายโดย:</div>
                <div style={{ fontWeight: 600 }}>{task.assigner.firstName} {task.assigner.lastName}</div>
              </div>
            )}
            <button
              className="close-btn"
              onClick={() => navigate('/dashboard/officer')}
              style={{
                background: '#f3f4f6',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4b5563'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="survey-content">
          {/* Map Section */}
          <div id="map-section-container" className="map-section">
            <div id="survey-map"></div>

            {/* Map Controls */}
            <div className="map-controls">
              <button type="button" className="map-btn" onClick={getCurrentLocation} title="ระบุตำแหน่งปัจจุบัน">
                <span>📍</span> ระบุตำแหน่ง
              </button>
              <button
                type="button"
                className="map-btn"
                onClick={() => {
                  if (drawnItemsRef.current && drawnItemsRef.current.getLayers().length > 0) {
                    Swal.fire({
                      title: 'ยืนยันการรีเซ็ต',
                      text: "คุณต้องการลบสิ่งที่วาดทั้งหมดใช่หรือไม่?",
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
                        toast.success('รีเซ็ตแผนที่เรียบร้อย');
                      }
                    });
                  } else {
                    toast('ไม่มีสิ่งที่วาดให้ลบ', { icon: 'ℹ️' });
                  }
                }}
                title="ลบสิ่งที่วาดทั้งหมด"
                style={{ color: '#ef4444', borderColor: '#ef4444' }}
              >
                <span>🗑️</span> รีเซ็ต
              </button>
            </div>

            {/* Marker Modal - Moved inside map section for fullscreen support */}
            {showMarkerModal && (
              <div className="modal-overlay marker-modal-overlay">
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
                        background: !markerLabel.trim() ? '#cbd5e0' : '#10b981',
                        color: 'white',
                        cursor: !markerLabel.trim() ? 'not-allowed' : 'pointer'
                      }}
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="form-section">
            <form onSubmit={handleSubmit} className="survey-form">

              {/* GPS Info Card */}
              {latitude && longitude && (
                <div className="incident-form-card">
                  <div className="gps-toggle-btn" onClick={() => setShowGpsInfo(!showGpsInfo)}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      📍 พิกัด: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    </span>
                    <span style={{ fontSize: '0.8em', color: '#6b7280' }}>
                      {showGpsInfo ? '▲ ซ่อน' : '▼ รายละเอียด'}
                    </span>
                  </div>

                  {showGpsInfo && (
                    <div className="gps-info-panel">
                      <div className="gps-data" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div><strong>Lat:</strong> {latitude.toFixed(6)}</div>
                        <div><strong>Lng:</strong> {longitude.toFixed(6)}</div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <strong>Accuracy:</strong> ±{accuracy?.toFixed(0)}m
                        </div>
                      </div>
                      <div className="form-group" style={{ marginTop: '12px' }}>
                        <label>ชื่อตำแหน่ง</label>
                        <input
                          type="text"
                          value={locationName}
                          onChange={(e) => setLocationName(e.target.value)}
                          placeholder="เช่น บ้านเลขที่ 15"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label>วันที่เกิดเหตุ *</label>
                  <ThaiDatePicker
                    id="incident-date"
                    value={incidentDate}
                    onChange={setIncidentDate}
                    placeholder="เลือกวันที่"
                    maxDate={new Date()}
                  />
                  {errors.incidentDate && <span className="error-text">{errors.incidentDate}</span>}
                </div>

                <div className="form-group">
                  <label>ประเภทภัย *</label>
                  <select value={disasterType} onChange={(e) => setDisasterType(e.target.value)}>
                    <option value="">-- เลือกประเภทภัย --</option>
                    <option value="น้ำท่วม">น้ำท่วม</option>
                    <option value="ไฟป่า">ไฟป่า</option>
                    <option value="ดินถลม">ดินถล่ม</option>
                    <option value="วาตภัย">วาตภัย</option>
                    <option value="อัคคีภัย">อัคคีภัย</option>
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

                <div className="form-group full-width">
                  <label>หมู่บ้านที่ได้รับผลกระทบ *</label>
                  <select value={village} onChange={(e) => setVillage(e.target.value)} disabled={isLoadingVillages}>
                    <option value="">-- เลือกหมู่บ้าน --</option>
                    {villages.map(v => (
                      <option key={v.id} value={`หมู่ ${v.moo} ${v.name}`}>
                        หมู่ {v.moo} {v.name}
                      </option>
                    ))}
                  </select>
                  {errors.village && <span className="error-text">{errors.village}</span>}
                </div>

                <div className="form-group">
                  <label>จำนวนครัวเรือน (ประมาณ) *</label>
                  <input
                    type="number"
                    value={estimatedHouseholds}
                    onChange={(e) => setEstimatedHouseholds(e.target.value)}
                    placeholder="0"
                  />
                  {errors.estimatedHouseholds && <span className="error-text">{errors.estimatedHouseholds}</span>}
                </div>

                <div className="form-group">
                  <label>ความรุนแรง *</label>
                  <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                    <option value="">-- เลือกความรุนแรง --</option>
                    <option value="1">เล็กน้อย (1)</option>
                    <option value="2">ปานกลาง (2)</option>
                    <option value="3">รุนแรง (3)</option>
                    <option value="4">รุนแรงมาก (4)</option>
                    <option value="5">วิกฤต (5)</option>
                  </select>
                </div>

                {/* Additional Fields for Survey */}
                <div className="form-group">
                  <label>ผู้ได้รับบาดเจ็บ</label>
                  <input type="number" value={injured} onChange={(e) => setInjured(e.target.value)} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>ผู้เสียชีวิต</label>
                  <input type="number" value={deaths} onChange={(e) => setDeaths(e.target.value)} placeholder="0" />
                </div>
                <div className="form-group full-width">
                  <label>ความเสียหายโดยประมาณ (บาท)</label>
                  <input type="number" value={estimatedDamage} onChange={(e) => setEstimatedDamage(e.target.value)} placeholder="0" />
                </div>

                <div className="form-group full-width">
                  <label>รายละเอียดเพิ่มเติม</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="ระบุรายละเอียดความเสียหาย..."
                  />
                </div>

                <div className="form-group full-width">
                  <label>รูปภาพประกอบ</label>
                  <div className="photo-upload-container">
                    <div className="upload-drop-zone" onClick={() => document.getElementById('photo-upload')?.click()}>
                      <span className="upload-icon">📷</span>
                      <span className="upload-text">คลิกเพื่ออัปโหลดรูปภาพ</span>
                      <span className="upload-subtext">รองรับ JPG, PNG (สูงสุด 5 รูป)</span>
                      <input
                        type="file"
                        id="photo-upload"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>

                  {photos.length > 0 && (
                    <div className="photo-preview-grid">
                      {photos.map((photo, i) => (
                        <div key={i} className="photo-preview-item">
                          <img src={photo.preview} alt={`Preview ${i}`} />
                          <button type="button" className="photo-remove" onClick={() => removePhoto(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button type="submit" className="submit-btn" disabled={isSubmitting} style={{ flex: 1 }}>
                  {isSubmitting ? '⏳ กำลังประมวลผล...' : 'ถัดไป (ตรวจสอบข้อมูล) ➡️'}
                </button>
              </div>

            </form>
          </div>
        </div>


      </div>
    </DashboardLayout>
  );
}
