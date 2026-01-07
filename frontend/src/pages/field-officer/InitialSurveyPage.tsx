import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { VILLAGE_NAMES, TAMBON_INFO } from '../../data/villages';
import { villagesApi, type LeafletVillage } from '../../api/villages';
import { fieldSurveyApi } from '../../api/fieldSurvey';
import { tasksApi } from '../../api/tasks';
import type { Task } from '../../types';
import ThaiDatePicker from '../../components/ThaiDatePicker';
import './InitialSurveyPage.css';

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

export function InitialSurveyPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const currentMarkerRef = useRef<L.Marker | null>(null);
  const streetLayerRef = useRef<L.TileLayer | null>(null);
  const satelliteLayerRef = useRef<L.TileLayer | null>(null);
  const hybridLayerRef = useRef<L.TileLayer | null>(null);

  // Task state - fetch from API if taskId provided
  const [task, setTask] = useState<Task | null>(null);
  const [taskLoading, setTaskLoading] = useState(false);

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
        });
    }
  }, [taskId]);

  // Populate form data from task when task is loaded
  useEffect(() => {
    if (task) {
      console.log('📋 Populating form from task:', task);

      // Set disaster type from incident if available
      if (task.incident?.disasterType) {
        const disasterMap: Record<string, string> = {
          'FLOOD': 'น้ำท่วม',
          'LANDSLIDE': 'ดินถลม',
          'STORM': 'วาตภัย',
          'FIRE': 'อัคคีภัย',
          'EARTHQUAKE': 'แผ่นดินไหว',
          'DROUGHT': 'ภัยแล้ง',
          'OTHER': 'อื่นๆ'
        };
        setDisasterType(disasterMap[task.incident.disasterType] || task.incident.disasterType);
      }

      // Set notes/description if available
      if (task.description) {
        setNotes(task.description);
      } else if (task.incident?.description) {
        setNotes(task.incident.description);
      }

      // Set location from incident address if available
      if (task.incident?.address) {
        setLocationName(task.incident.address);
      }

      // Set severity from incident priority if available
      if (task.incident?.priority) {
        // Map priority to severity number (1-5)
        const severityMap: Record<string, string> = {
          'LOW': '1',
          'MEDIUM': '3',
          'HIGH': '4',
          'URGENT': '5',
          'CRITICAL': '5'
        };
        setSeverity(severityMap[task.incident.priority] || '3');
      }

      // Set incident date
      if (task.incident?.reportedAt) {
        setIncidentDate(new Date(task.incident.reportedAt));
      } else if (task.createdAt) {
        setIncidentDate(new Date(task.createdAt));
      }

      // Set estimated households from village data if available
      if (task.village?.households) {
        setEstimatedHouseholds(task.village.households.toString());
      }

      console.log('✅ Form populated from task');
    }
  }, [task]);

  // Form state
  const [incidentDate, setIncidentDate] = useState<Date | null>(new Date());
  const [disasterType, setDisasterType] = useState('น้ำท่วม');
  const [village, setVillage] = useState<LeafletVillage | null>(null);
  const [estimatedHouseholds, setEstimatedHouseholds] = useState('');
  const [severity, setSeverity] = useState('3');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);

  // Additional fields for casualties and damage
  const [injured, setInjured] = useState('');
  const [deaths, setDeaths] = useState('');
  const [estimatedDamage, setEstimatedDamage] = useState('');

  // GPS state
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [locationName, setLocationName] = useState<string>('ตำแหน่งปัจจุบัน');

  // Polygon state
  const [polygonData, setPolygonData] = useState<any>(null);

  // Instructions modal state
  const [showInstructions, setShowInstructions] = useState(false);

  // UI State for loading and validation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Village boundary marker
  const villageBoundaryRef = useRef<L.Circle | L.Polygon | null>(null);
  const villageMarkerRef = useRef<L.Marker | null>(null);

  // Villages data from API
  const [villages, setVillages] = useState<LeafletVillage[]>([]);

  // Populate village from task when villages are loaded
  useEffect(() => {
    if (task && task.village && villages.length > 0) {
      console.log('🏘️ Populating village from task:', task.village);

      // Strategy 1: Match by ID (String/Number safe)
      let matchingVillage = villages.find(v => v.id.toString() === task.village?.id?.toString());

      // Strategy 2: Match by Name (Exact)
      if (!matchingVillage && task.village?.name) {
        matchingVillage = villages.find(v => v.name === task.village?.name);
      }

      // Strategy 3: Match by Name (Partial/Trimmed)
      if (!matchingVillage && task.village?.name) {
        const taskVillageName = task.village.name.trim();
        matchingVillage = villages.find(v => v.name.includes(taskVillageName) || taskVillageName.includes(v.name));
      }

      // Strategy 4: Fallback - Parse from Task Title (e.g. "สำรวจพื้นที่ - แม่ใจเหนือ")
      if (!matchingVillage && task.title) {
        console.log('⚠️ No village relation found, trying to parse from title:', task.title);
        const titleParts = task.title.split('-');
        if (titleParts.length > 1) {
          const potentialName = titleParts[titleParts.length - 1].trim(); // Get last part
          console.log('🔍 Potential village name from title:', potentialName);
          matchingVillage = villages.find(v => v.name.includes(potentialName) || potentialName.includes(v.name));
        }
      }

      if (matchingVillage) {
        setVillage(matchingVillage);
        console.log('✅ Village populated:', matchingVillage.name);
      } else {
        console.warn('⚠️ Village not found in list:', task.village);
      }
    }
  }, [task, villages]);

  // Initialize map
  useEffect(() => {
    // Check if already initialized
    if (mapRef.current) {
      console.log('✅ Map already initialized');
      return;
    }

    // Check if element exists
    const mapElement = document.getElementById('survey-map');
    if (!mapElement) {
      console.error('❌ Map element #survey-map not found!');
      return;
    }

    try {
      console.log('🗺️ Initializing map...');
      // Create map centered on Tambon Wiang, Fang District
      const map = L.map('survey-map').setView([TAMBON_INFO.centerLat, TAMBON_INFO.centerLng], 13);

      // Create tile layers
      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      });

      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri',
        maxZoom: 19
      });

      const hybridLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Labels © Esri',
        maxZoom: 19
      });

      // Add default street layer
      streetLayer.addTo(map);

      // Store layer references
      streetLayerRef.current = streetLayer;
      satelliteLayerRef.current = satelliteLayer;
      hybridLayerRef.current = hybridLayer;

      // Add layer control
      const baseMaps = {
        "🗺️ แผนที่ถนน": streetLayer,
        "🛰️ ดาวเทียม": satelliteLayer
      };

      const overlays = {
        "🏷️ ชื่อสถานที่": hybridLayer
      };

      L.control.layers(baseMaps, overlays, { position: 'topright' }).addTo(map);

      // Initialize Geoman controls - Create all tools first, then disable
      (map as any).pm.addControls({
        position: 'topleft',
        drawCircle: true,
        drawCircleMarker: false,
        drawPolyline: true,
        drawRectangle: true,
        drawMarker: true,
        drawPolygon: true,
        drawText: true,
        editMode: true,
        dragMode: true,
        cutPolygon: true,
        removalMode: true,
        rotateMode: true,
      });

      // Disable all Geoman tools initially using proper event
      map.on('pm:globalremovalmodetoggled', () => {
        console.log('Geoman removal mode toggled');
      });

      // Disable tools after Geoman is ready
      requestAnimationFrame(() => {
        Object.keys((map as any).pm.Toolbar.buttons).forEach(key => {
          const button = (map as any).pm.Toolbar.buttons[key];
          if (button && button.disable) {
            button.disable();
          }
        });
      });

      // Add Fullscreen control
      const fullscreenControl = L.control({ position: 'topleft' } as any);
      (fullscreenControl as any).onAdd = function () {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = `
            <a href="#" class="leaflet-control-fullscreen" title="Toggle Fullscreen" role="button" aria-label="Toggle Fullscreen">
              <span style="font-size: 18px;">⛶</span>
            </a>
          `;

        div.onclick = function (e) {
          e.preventDefault();
          const mapContainer = document.getElementById('survey-map');
          if (mapContainer) {
            if (!document.fullscreenElement) {
              mapContainer.requestFullscreen().then(() => {
                requestAnimationFrame(() => map.invalidateSize());
              });
            } else {
              document.exitFullscreen().then(() => {
                requestAnimationFrame(() => map.invalidateSize());
              });
            }
          }
        };

        return div;
      };
      fullscreenControl.addTo(map);

      // Set global options with minimum vertex requirement
      (map as any).pm.setGlobalOptions({
        finishOn: 'dblclick', // ต้องดับเบิลคลิกเพื่อปิด polygon
        allowSelfIntersection: false,
        minRadiusCircle: 0,
        minRadiusCircleMarker: 0,
        editable: true,
        draggable: true,
        snapDistance: 20,
        requireSnapToFinish: false,
        continueDrawing: false,
        templineStyle: {
          color: '#667eea',
        },
        hintlineStyle: {
          color: '#667eea',
          dashArray: '5,5',
        },
      });

      // Set polygon style
      (map as any).pm.setPathOptions({
        color: '#667eea',
        fillColor: '#667eea',
        fillOpacity: 0.2,
        weight: 3,
      });

      // Handle polygon creation
      map.on('pm:create', (e: any) => {
        const layer = e.layer;
        const geoJSON = layer.toGeoJSON();

        // ตรวจสอบจำนวนจุดขั้นต่ำ (ต้องมีอย่างน้อย 4 จุด)
        const coordinates = geoJSON.geometry.coordinates[0];
        if (coordinates.length < 5) { // 5 เพราะจุดแรกและจุดสุดท้ายซ้ำกัน (closed polygon)
          alert('⚠️ กรุณาวาดพื้นที่ให้มีอย่างน้อย 4 จุด');
          map.removeLayer(layer);
          return;
        }

        setPolygonData(geoJSON);

        // Store reference for later removal
        drawnItemsRef.current = layer;
      });

      // Handle polygon edit
      map.on('pm:edit', (e: any) => {
        const layer = e.layer;
        const geoJSON = layer.toGeoJSON();
        setPolygonData(geoJSON);
      });

      // Handle polygon removal
      map.on('pm:remove', () => {
        setPolygonData(null);
        drawnItemsRef.current = null;
      });

      mapRef.current = map;

      // Force map to resize after layout is ready
      requestAnimationFrame(() => {
        map.invalidateSize();
      });

      console.log('✅ Map initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing map:', error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle window resize with ResizeObserver
  useEffect(() => {
    if (!mapRef.current) return;

    const mapElement = document.getElementById('survey-map');
    if (!mapElement) return;

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        requestAnimationFrame(() => {
          mapRef.current?.invalidateSize();
        });
      }
    });

    resizeObserver.observe(mapElement);

    // Initial resize
    requestAnimationFrame(() => {
      mapRef.current?.invalidateSize();
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Update marker popup when location name changes
  useEffect(() => {
    if (currentMarkerRef.current && locationName) {
      currentMarkerRef.current.bindPopup(
        `📍 ${locationName}<br/><small>ลากเพื่อปรับตำแหน่ง</small>`,
        {
          autoPan: true,
          autoPanPadding: [50, 50]
        }
      );
    }
  }, [locationName]);

  // Load villages from API
  useEffect(() => {
    const loadVillages = async () => {
      try {
        console.log('🔄 Loading villages from API...');
        const data = await villagesApi.getAllForMap();
        console.log('✅ Loaded villages from API:', data.length, data);
        setVillages(data);
      } catch (error: any) {
        console.error('❌ Error loading villages:', error);
        console.error('Error details:', error.message, error.response?.data);
        // Fallback to VILLAGE_NAMES if API fails
        const fallbackVillages = VILLAGE_NAMES.map((name, index) => ({
          id: index + 1,
          name: name,
          moo: index + 1,
          lat: TAMBON_INFO.centerLat,
          lng: TAMBON_INFO.centerLng
        }));
        setVillages(fallbackVillages);
        console.log('⚠️ Using fallback villages:', fallbackVillages.length);
      }
    };
    loadVillages();
  }, []);

  // Show village boundary when village is selected
  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    // Enable/Disable Geoman tools based on village selection
    if (village) {
      // Enable all Geoman tools when village is selected
      Object.keys((mapRef.current as any).pm.Toolbar.buttons).forEach(key => {
        const button = (mapRef.current as any).pm.Toolbar.buttons[key];
        if (button && button.enable) {
          button.enable();
        }
      });
    } else {
      // Disable all Geoman tools when village is not selected
      Object.keys((mapRef.current as any).pm.Toolbar.buttons).forEach(key => {
        const button = (mapRef.current as any).pm.Toolbar.buttons[key];
        if (button && button.disable) {
          button.disable();
        }
      });
    }

    if (!village) {
      // Remove existing boundary if village is deselected
      if (villageBoundaryRef.current) {
        mapRef.current?.removeLayer(villageBoundaryRef.current);
        villageBoundaryRef.current = null;
      }
      if (villageMarkerRef.current) {
        mapRef.current?.removeLayer(villageMarkerRef.current);
        villageMarkerRef.current = null;
      }
      return;
    }

    // Find selected village data
    const selectedVillage = village;
    if (!selectedVillage) {
      console.warn('⚠️ Village not found:', village);
      return;
    }

    console.log('📍 Selected village:', selectedVillage);
    console.log('🗺️ Village boundary:', selectedVillage.boundary);

    // Remove existing boundary and marker
    if (villageBoundaryRef.current) {
      mapRef.current.removeLayer(villageBoundaryRef.current);
      villageBoundaryRef.current = null;
    }
    if (villageMarkerRef.current) {
      mapRef.current.removeLayer(villageMarkerRef.current);
      villageMarkerRef.current = null;
    }

    // Add boundary (polygon if available, otherwise circle)
    let boundary: L.Circle | L.Polygon;

    if (selectedVillage.boundary && selectedVillage.boundary.length > 0) {
      // Use actual boundary polygon
      console.log('✅ Drawing polygon boundary with', selectedVillage.boundary.length, 'points');
      boundary = L.polygon(selectedVillage.boundary, {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.15,
        weight: 3,
        dashArray: '5, 5'
      }).addTo(mapRef.current);
    } else {
      // Use approximate circle (500m radius)
      console.log('⚠️ No boundary data, using circle');
      boundary = L.circle([selectedVillage.lat, selectedVillage.lng], {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        radius: 500,
        weight: 2,
        dashArray: '5, 5'
      }).addTo(mapRef.current);
    }

    // Add marker with village name
    const marker = L.marker([selectedVillage.lat, selectedVillage.lng], {
      icon: L.divIcon({
        className: 'village-marker',
        html: `<div style="background: #3b82f6; color: white; padding: 6px 12px; border-radius: 12px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.3); white-space: nowrap;">
          📍 ${selectedVillage.name} (หมู่ ${selectedVillage.moo})
        </div>`,
        iconSize: [150, 40],
        iconAnchor: [75, 40]
      })
    }).addTo(mapRef.current);

    villageBoundaryRef.current = boundary;
    villageMarkerRef.current = marker;

    // Switch to satellite view with labels when village is selected
    if (streetLayerRef.current && satelliteLayerRef.current && hybridLayerRef.current) {
      // Remove street layer
      if (mapRef.current.hasLayer(streetLayerRef.current)) {
        mapRef.current.removeLayer(streetLayerRef.current);
      }
      // Add satellite layer
      if (!mapRef.current.hasLayer(satelliteLayerRef.current)) {
        satelliteLayerRef.current.addTo(mapRef.current);
      }
      // Add labels layer
      if (!mapRef.current.hasLayer(hybridLayerRef.current)) {
        hybridLayerRef.current.addTo(mapRef.current);
      }
      console.log('🛰️ Switched to satellite view with labels');
    }

    // Pan to village location and fit bounds
    if (selectedVillage.boundary && selectedVillage.boundary.length > 0) {
      const bounds = boundary.getBounds();
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else {
      mapRef.current.setView([selectedVillage.lat, selectedVillage.lng], 14);
    }

    console.log('✅ Village boundary displayed');
  }, [village, villages]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng, accuracy: acc } = position.coords;

          setLatitude(lat);
          setLongitude(lng);
          setAccuracy(acc);

          if (mapRef.current) {
            // Remove old marker
            if (currentMarkerRef.current) {
              mapRef.current.removeLayer(currentMarkerRef.current);
            }

            // Add new draggable marker
            const marker = L.marker([lat, lng], {
              draggable: true,
              icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })
            })
              .addTo(mapRef.current)
              .bindPopup(`📍 ${locationName}<br/><small>ลากเพื่อปรับตำแหน่ง</small>`, {
                autoPan: true,
                autoPanPadding: [50, 50]
              })
              .openPopup();

            // Handle drag end event
            marker.on('dragend', (event) => {
              const newLatLng = event.target.getLatLng();
              setLatitude(newLatLng.lat);
              setLongitude(newLatLng.lng);

              // Update popup
              marker.bindPopup(`📍 ${locationName} (ปรับแล้ว)<br/><small>ลากเพื่อปรับตำแหน่ง</small>`).openPopup();
            });

            currentMarkerRef.current = marker;

            // Center map
            mapRef.current.setView([lat, lng], 15);
          }
        },
        (error) => {
          alert('ไม่สามารถระบุตำแหน่งได้: ' + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert('เบราว์เซอร์ไม่รองรับ GPS');
    }
  };

  const clearPolygon = () => {
    // Only remove the user-drawn polygon, not the village boundary
    if (drawnItemsRef.current && mapRef.current) {
      mapRef.current.removeLayer(drawnItemsRef.current);
      drawnItemsRef.current = null;
      setPolygonData(null);
      console.log('✅ Cleared user-drawn polygon (village boundary preserved)');
    }
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
      // Revoke URL to free memory
      URL.revokeObjectURL(prev[index].preview);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});
    const newErrors: Record<string, string> = {};

    // Enhanced Validation
    if (!incidentDate) {
      newErrors.incidentDate = 'กรุณาเลือกวันที่เกิดเหตุ';
    }

    if (!village) {
      newErrors.village = 'กรุณาเลือกหมู่บ้านที่ได้รับผลกระทบ';
    }

    if (!estimatedHouseholds || Number(estimatedHouseholds) < 0) {
      newErrors.estimatedHouseholds = 'กรุณาระบุจำนวนครัวเรือนที่ถูกต้อง';
    }

    if (!polygonData) {
      newErrors.polygon = 'กรุณาวาดพื้นที่ที่ได้รับผลกระทบบนแผนที่';
    }

    if (!latitude || !longitude) {
      newErrors.gps = 'กรุณาใช้ GPS เพื่อระบุตำแหน่งปัจจุบัน';
    }

    // Check for errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert('⚠️ กรุณากรอกข้อมูลให้ครบถ้วน\n\n' + Object.values(newErrors).join('\n'));
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      if (firstErrorField === 'polygon' || firstErrorField === 'gps') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Set loading state
    setIsSubmitting(true);

    try {
      // Upload photos first
      let photoUrls: string[] = [];
      if (photos.length > 0) {
        console.log('📷 Uploading', photos.length, 'photos...');
        try {
          const photosToUpload = photos.map(p => p.file);
          photoUrls = await fieldSurveyApi.uploadImages(photosToUpload);
          console.log('✅ Photos uploaded:', photoUrls);
        } catch (photoError) {
          console.error('❌ Photo upload failed:', photoError);
          alert('⚠️ ไม่สามารถอัปโหลดรูปภาพได้ แต่จะบันทึกข้อมูลอื่นๆ');
        }
      }

      // Prepare survey data matching API interface
      const surveyData = {
        taskId: taskId || undefined,
        villageId: village.id.toString(),
        villageName: village.name,
        disasterType,
        severity: Number(severity),
        estimatedHouseholds: Number(estimatedHouseholds),
        notes,
        gpsLocation: {
          lat: latitude!,
          lng: longitude!,
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
        }
      };

      console.log('📋 Navigating to review page...', surveyData);

      // Navigate to review page (NOT saving yet)
      navigate('/survey-review', {
        state: { surveyData }
      });
    } catch (error: any) {
      console.error('❌ Error submitting survey:', error);
      alert(
        '❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล\n\n' +
        (error.response?.data?.message || error.message || 'กรุณาลองใหม่อีกครั้ง')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Task is optional - page works with or without task

  return (
    <>
      <DashboardLayout noPadding>
        <div className="initial-survey-page">
          {/* Header */}
          <div className="survey-header">
            <div>
              <h2>🔍 {task ? 'สำรวจเบื้องต้น' : 'สร้างรายงานเหตุการณ์'}</h2>
              {task && <p className="task-title">{task.title}</p>}
            </div>
            {task && (
              <div className="task-info">
                <span className="task-id">Task ID: {taskId}</span>
                <span className={`priority priority-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="survey-content">

            {/* Left: Map */}
            <div className="map-section" style={{
              flex: 1,
              position: 'relative',
              height: '100%'
            }}>
              <div id="survey-map" style={{ width: '100%', height: '100%' }}></div>

              {/* Instructions Modal */}
              {showInstructions && (
                <div className="modal-overlay" onClick={() => setShowInstructions(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3>📐 วิธีวาดพื้ศที่บนแผนที่</h3>
                      <button className="modal-close" onClick={() => setShowInstructions(false)}>×</button>
                    </div>
                    <div className="modal-body">
                      <ol>
                        <li>คลิกปุ่ม <strong>🔷 Draw Polygon</strong> ที่มุมบนซ้ายของแผนที่</li>
                        <li>คลิกบนแผนที่เพื่อสร้างจุด (คลิกได้ไม่จำกัด)</li>
                        <li>คลิกที่จุดแรกอีกครั้งเพื่อปิดรูปหลังคา</li>
                      </ol>
                      <div className="note">
                        <strong>✅ เคล็ดลับ:</strong>
                        <ul>
                          <li>คลิกได้ไม่จำกัดจุด วาดได้ตามพื้นที่จริง</li>
                          <li>สามารถลบและวาดใหม่ได้</li>
                          <li>กด "Clear Area" เพื่อลบแล้ววาดใหม่</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Map Info */}
              {!village && (
                <div className="map-info" style={{ backgroundColor: '#fff3cd', border: '2px solid #ffc107', color: '#856404' }}>
                  ⚠️ กรุณาเลือกหมู่บ้านที่ได้รับผลกระทบก่อนวาดพื้นที่
                </div>
              )}
              {polygonData && (
                <div className="map-info">
                  ✅ วาดพื้นที่เรียบร้อย
                </div>
              )}
            </div>

            {/* Right: Form */}
            <div className="form-section">

              {/* Map Controls - Moved here */}
              <div className="form-map-controls">
                <button className="control-btn" onClick={getCurrentLocation}>
                  📍 Get Location
                </button>
                <button className="control-btn" onClick={clearPolygon}>
                  🗑️ Clear Area
                </button>
                <button className="control-btn help" onClick={() => setShowInstructions(true)}>
                  ❓ คู่มือ
                </button>
              </div>

              {/* GPS Info */}
              {latitude && longitude && (
                <div className="gps-info">
                  <h3>📍 พิกัดปัจจุบัน</h3>
                  <div className="gps-data">
                    <p><strong>Lat:</strong> {latitude.toFixed(6)}</p>
                    <p><strong>Lng:</strong> {longitude.toFixed(6)}</p>
                    <p><strong>Accuracy:</strong> ±{accuracy?.toFixed(0)}m</p>
                  </div>

                  {/* Location Name Input */}
                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label htmlFor="location-name" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
                      <span>🏷️</span>
                      ชื่อตำแหน่ง
                    </label>
                    <input
                      type="text"
                      id="location-name"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="เช่น บ้านเลขที่ 15, หน้าโรงเรียน"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        transition: 'all 0.2s'
                      }}
                    />
                    <p className="help-text" style={{ marginTop: '6px', fontSize: '12px', color: '#64748b' }}>ระบุชื่อตำแหน่งเพื่อให้ง่ายต่อการจดจำ</p>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="survey-form">

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
                  <label>ประเภทภัย *</label>
                  <select
                    value={disasterType}
                    onChange={(e) => setDisasterType(e.target.value)}
                    required
                  >
                    <option>น้ำท่วม</option>
                    <option>ดินถลม</option>
                    <option>วาตภัย</option>
                    <option>อัคคีภัย</option>
                    <option>แผ่นดินไหว</option>
                    <option>ภัยแล้ง</option>
                    <option>อื่นๆ</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>หมู่บ้านที่ได้รับผลกระทบ *</label>
                  <select
                    value={village?.id || ''}
                    onChange={(e) => {
                      const selectedVillage = villages.find(v => v.id === e.target.value);
                      setVillage(selectedVillage || null);
                    }}
                    required
                  >
                    <option value="">เลือกหมู่บ้าน</option>
                    {villages.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} (หมู่ {v.moo})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>จำนวนครัวเรือน (ประมาณ) *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={estimatedHouseholds}
                    onChange={(e) => setEstimatedHouseholds(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>ความรุนแรง *</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    required
                  >
                    <option value="1">1 - เล็กน้อย</option>
                    <option value="2">2 - ปานกลาง</option>
                    <option value="3">3 - รุนแรง</option>
                    <option value="4">4 - รุนแรงมาก</option>
                    <option value="5">5 - วิกฤต</option>
                  </select>
                </div>

                {/* New Fields: Casualties and Damage */}
                <div className="form-group">
                  <label>ผู้ได้รับบาดเจ็บ</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={injured}
                    onChange={(e) => setInjured(e.target.value)}
                  />
                  <p className="help-text">จำนวนผู้ได้รับบาดเจ็บ (ถ้ามี)</p>
                </div>

                <div className="form-group">
                  <label>ผู้เสียชีวิต</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={deaths}
                    onChange={(e) => setDeaths(e.target.value)}
                  />
                  <p className="help-text">จำนวนผู้เสียชีวิต (ถ้ามี)</p>
                </div>

                <div className="form-group">
                  <label>ความเสียหายโดยประมาณ (บาท)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="0"
                    value={estimatedDamage}
                    onChange={(e) => setEstimatedDamage(e.target.value)}
                  />
                  <p className="help-text">ประเมินมูลค่าความเสียหายโดยประมาณ</p>
                </div>

                <div className="form-group">
                  <label>หมายเหตุ</label>
                  <textarea
                    rows={3}
                    placeholder="รายละเอียดเพิ่มเติม..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>

                {/* Photo Upload */}
                <div className="form-group">
                  <label>รูปถ่าย</label>
                  <div className="photo-upload-buttons">
                    {/* ปุ่มอัพโหลดจากไฟล์ */}
                    <label htmlFor="photo-upload" className="upload-btn">
                      📁 เลือกรูปจากเครื่อง
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {/* ปุ่มถ่ายรูปด้วยกล้อง */}
                    <label htmlFor="photo-camera" className="camera-btn">
                      📷 ถ่ายรูป
                      <input
                        id="photo-camera"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  <p className="help-text">อัปโหลดหรือถ่ายรูปพื้นที่ที่ได้รับผลกระทบ</p>
                </div>

                {/* Photo Preview */}
                {photos.length > 0 && (
                  <div className="photo-preview">
                    {photos.map((photo, i) => (
                      <div key={i} className="photo-item">
                        <img src={photo.preview} alt={`Photo ${i + 1}`} />
                        <button
                          type="button"
                          className="remove-photo"
                          onClick={() => removePhoto(i)}
                          title="ลบรูป"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button type="submit" className="submit-btn" disabled={isSubmitting} style={{ flex: 1 }}>
                    {isSubmitting ? '⏳ กำลังบันทึก...' : '✅ ส่งรายงานเบื้องต้น'}
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => navigate('/dashboard/officer')}
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
