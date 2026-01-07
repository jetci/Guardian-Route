/**
 * Survey Area Page - Field Officer
 * สำรวจพื้นที่พร้อม GPS และ Drawing Tools
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ThaiDateInput } from '../../components/field-officer/ThaiDateInput';
import { MapInstructionsOverlay } from '../../components/field-officer/MapInstructionsOverlay';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { validateSurveyForm, type ValidationErrors } from '../../lib/validation/surveyValidation';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import { TAMBON_INFO } from '../../data/villages';
import { villagesApi, type LeafletVillage } from '../../api/villages';
import { fieldSurveyApi } from '../../api/fieldSurvey';

export default function SurveyAreaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const gpsMarkerRef = useRef<L.Marker | null>(null);
  const villageBoundariesRef = useRef<Map<number, L.GeoJSON>>(new Map());
  const markersRef = useRef<Map<string, L.Marker>>(new Map()); // Store marker references
  const dialogIsOpen = useRef<boolean>(false); // Prevent multiple pm:create events

  // Multi-marker support
  interface MarkerPoint {
    id: string;
    lat: number;
    lng: number;
    label: string;
    note?: string;
    createdAt: string;
  }

  const [markers, setMarkers] = useState<MarkerPoint[]>([]);
  const [showMarkerDialog, setShowMarkerDialog] = useState(false);
  const [tempMarkerPosition, setTempMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [editingMarker, setEditingMarker] = useState<MarkerPoint | null>(null);
  const [markerLabel, setMarkerLabel] = useState('');
  const [markerNote, setMarkerNote] = useState('');

  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [drawnArea, setDrawnArea] = useState<any>(null);
  const [areaSize, setAreaSize] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [villages, setVillages] = useState<LeafletVillage[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<LeafletVillage | null>(null);
  const [isManualPinMode, setIsManualPinMode] = useState(false);
  const [isLoadingVillages, setIsLoadingVillages] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [surveyDate, setSurveyDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // New fields to match review page expectations
  const [incidentDate, setIncidentDate] = useState<string>('');
  const [injured, setInjured] = useState<string>('');
  const [deaths, setDeaths] = useState<string>('');
  const [estimatedDamage, setEstimatedDamage] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('');
  const [accuracy, setAccuracy] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    disasterType: '', // User must select
    otherDisasterType: '',
    severity: '', // User must select
    village: '',
    description: '',
    estimatedHouseholds: '' // User must enter
  });
  const [showInstructions, setShowInstructions] = useState(false);

  // Show instructions on first visit
  useEffect(() => {
    const hasSeenInstructions = localStorage.getItem('survey-area-instructions-seen');
    if (!hasSeenInstructions) {
      setShowInstructions(true);
    }
  }, []);

  const handleCloseInstructions = () => {
    setShowInstructions(false);
    localStorage.setItem('survey-area-instructions-seen', 'true');
  };

  // Auto-save draft every 10 seconds (faster than before)
  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      if (formData.village || formData.description || currentLocation || drawnArea) {
        saveDraft();
      }
    }, 10000); // 10 seconds (was 30)

    return () => clearInterval(autosaveInterval);
  }, [formData, currentLocation, drawnArea, selectedImages]);

  // Save draft when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formData.village || formData.description || currentLocation || drawnArea) {
        saveDraft();
        // Show warning if there's unsaved data
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, currentLocation, drawnArea]);

  // Debounced save on form changes (save 2 seconds after user stops typing)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (formData.village || formData.description) {
        saveDraft();
      }
    }, 2000); // 2 seconds after last change

    return () => clearTimeout(debounceTimer);
  }, [formData]);

  // Debug: Log when showMarkerDialog changes
  useEffect(() => {
    console.log('🔔 showMarkerDialog changed:', showMarkerDialog);
    if (showMarkerDialog) {
      console.log('📍 Dialog should be visible now');
      console.log('📍 tempMarkerPosition:', tempMarkerPosition);
    } else {
      console.log('❌ Dialog closed');
      console.trace('Stack trace for dialog close:');
    }
  }, [showMarkerDialog]);

  // Debug: Log when markerLabel changes
  useEffect(() => {
    console.log('✏️ markerLabel changed:', markerLabel);
    if (markerLabel === '') {
      console.trace('Stack trace for markerLabel clear:');
    }
  }, [markerLabel]);

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, []);

  const saveDraft = () => {
    try {
      const draft = {
        formData,
        currentLocation,
        drawnArea,
        areaSize,
        surveyDate,
        selectedVillage: selectedVillage ? {
          id: selectedVillage.id,
          name: selectedVillage.name,
          moo: selectedVillage.moo
        } : null,
        // Don't save images to localStorage (too large)
        imageCount: selectedImages.length,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('survey-area-draft', JSON.stringify(draft));
      console.log('💾 Draft saved automatically at', new Date().toLocaleTimeString('th-TH'));

      // Silent auto-save - no notification to avoid spam
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error('ไม่สามารถบันทึกแบบร่างได้');
    }
  };

  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem('survey-area-draft');
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        const savedTime = new Date(draft.savedAt);
        const hoursSince = (Date.now() - savedTime.getTime()) / (1000 * 60 * 60);

        // Only load if saved within last 24 hours
        if (hoursSince < 24) {
          toast.loading(
            (t) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span>พบแบบร่างที่บันทึกไว้</span>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  บันทึกเมื่อ: {new Date(draft.savedAt).toLocaleString('th-TH')}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setFormData(draft.formData);
                      setCurrentLocation(draft.currentLocation);
                      setDrawnArea(draft.drawnArea);
                      setAreaSize(draft.areaSize);
                      setSurveyDate(draft.surveyDate);

                      // Restore village selection
                      if (draft.selectedVillage) {
                        const village = villages.find(v => v.id === draft.selectedVillage.id);
                        if (village) {
                          setSelectedVillage(village);
                        }
                      }

                      toast.dismiss(t.id);
                      toast.success('โหลดแบบร่างสำเร็จ');
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 12px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    ✅ โหลดแบบร่าง
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('survey-area-draft');
                      toast.dismiss(t.id);
                      toast('เริ่มต้นใหม่', { icon: 'ℹ️' });
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 12px',
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ ลบแบบร่าง
                  </button>
                </div>
              </div>
            ),
            { duration: Infinity }
          );
        } else {
          // Remove old draft
          localStorage.removeItem('survey-area-draft');
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  };

  // Populate form when returning from review page with edit data
  useEffect(() => {
    if (editData && villages.length > 0) {
      console.log('📝 Populating form with edit data:', editData);

      // Set form data
      setFormData({
        disasterType: editData.disasterType || '',
        otherDisasterType: editData.otherDisasterType || '',
        severity: editData.severity?.toString() || '',
        village: editData.villageName || '',
        description: editData.notes || '',
        estimatedHouseholds: editData.estimatedHouseholds?.toString() || ''
      });

      // Set GPS location
      if (editData.gpsLocation && editData.gpsLocation.lat !== 0 && editData.gpsLocation.lng !== 0) {
        setCurrentLocation({
          lat: editData.gpsLocation.lat,
          lng: editData.gpsLocation.lng
        });
      }

      // Set other fields
      if (editData.polygon) {
        setDrawnArea(editData.polygon);
      }
      if (editData.areaSize) {
        setAreaSize(editData.areaSize);
      }
      if (editData.additionalData?.surveyDate) {
        setSurveyDate(editData.additionalData.surveyDate);
      }
      if (editData.additionalData?.incidentDate) {
        setIncidentDate(editData.additionalData.incidentDate);
      }
      if (editData.additionalData?.injured !== undefined) {
        setInjured(editData.additionalData.injured.toString());
      }
      if (editData.additionalData?.deaths !== undefined) {
        setDeaths(editData.additionalData.deaths.toString());
      }
      if (editData.additionalData?.estimatedDamage !== undefined) {
        setEstimatedDamage(editData.additionalData.estimatedDamage.toString());
      }
      if (editData.additionalData?.locationName) {
        setLocationName(editData.additionalData.locationName);
      }
      if (editData.additionalData?.accuracy) {
        setAccuracy(editData.additionalData.accuracy);
      }

      // Set village
      const village = villages.find(v => v.id === editData.villageId || v.name === editData.villageName);
      if (village) {
        setSelectedVillage(village);
      }

      // Restore photos if available
      // Note: Photo URLs are already in editData.photoUrls, but we can't restore File objects
      // The user will see the existing photos in the review, but would need to re-upload if editing

      toast.success('✅ โหลดข้อมูลเพื่อแก้ไขแล้ว');
    }
  }, [editData, villages]);


  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map centered on ตำบลเวียง อำเภอฝาง
    const map = L.map(mapRef.current).setView([TAMBON_INFO.centerLat, TAMBON_INFO.centerLng], 13);

    // Add OpenStreetMap tiles (default)
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Add Satellite tiles (Esri World Imagery) - initially NOT added
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri',
      maxZoom: 18,
    });

    // Add Labels layer (Esri World Boundaries and Places) - initially NOT added
    const labelsLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Labels © Esri',
      maxZoom: 18,
    });

    // Store layer references for switching
    (map as any)._streetLayer = streetLayer;
    (map as any)._satelliteLayer = satelliteLayer;
    (map as any)._labelsLayer = labelsLayer;

    // Add FeatureGroup for drawn items
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    // Add Geoman controls
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: true,
      drawPolygon: true,
      drawMarker: true,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true,
    });

    // ✅ DISABLE all tools by default - will be enabled when village is selected
    setTimeout(() => {
      if (map.pm && map.pm.Toolbar) {
        map.pm.Toolbar.setButtonDisabled('drawPolygon', true);
        map.pm.Toolbar.setButtonDisabled('drawRectangle', true);
        map.pm.Toolbar.setButtonDisabled('drawMarker', true);
        map.pm.Toolbar.setButtonDisabled('editMode', true);
        map.pm.Toolbar.setButtonDisabled('dragMode', true);
        map.pm.Toolbar.setButtonDisabled('removalMode', true);
        console.log('🔒 All Geoman tools DISABLED by default - select village to enable');
      }
    }, 100);


    // Add Fullscreen Control
    const fullscreenControl = L.Control.extend({
      options: {
        position: 'topright'
      },
      onAdd: function () {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = L.DomUtil.create('a', '', container);
        button.href = '#';
        button.title = 'Toggle Fullscreen';
        button.innerHTML = '⛶'; // Fullscreen icon
        button.style.fontSize = '20px';
        button.style.lineHeight = '30px';
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.textDecoration = 'none';
        button.style.color = '#333';

        L.DomEvent.on(button, 'click', function (e: any) {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);

          const mapContainer = mapRef.current;
          if (!mapContainer) return;

          if (!document.fullscreenElement) {
            // Enter fullscreen
            mapContainer.requestFullscreen().then(() => {
              button.innerHTML = '⛶'; // Keep same icon or use different one
              button.title = 'Exit Fullscreen';
              // Invalidate map size immediately after entering fullscreen
              if (map) {
                requestAnimationFrame(() => map.invalidateSize());
              }
            }).catch((err: any) => {
              console.error('Error entering fullscreen:', err);
              toast.error('ไม่สามารถเข้าโหมดเต็มจอได้');
            });
          } else {
            // Exit fullscreen
            document.exitFullscreen().then(() => {
              button.innerHTML = '⛶';
              button.title = 'Toggle Fullscreen';
              // Invalidate map size immediately after exiting fullscreen
              if (map) {
                requestAnimationFrame(() => map.invalidateSize());
              }
            });
          }
        });

        return container;
      }
    });

    map.addControl(new fullscreenControl());


    // Set Geoman to work with our feature group
    map.pm.setGlobalOptions({
      layerGroup: drawnItems,
    });

    // NOTE: pm:create and pm:remove listeners are now in the tool-enabling useEffect
    // This ensures they are attached after Geoman is fully ready

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch villages and display boundaries
  useEffect(() => {
    const loadVillages = async () => {
      try {
        const villagesData = await villagesApi.getAllForMap();
        setVillages(villagesData);
        setIsLoadingVillages(false);
        console.log('✅ Loaded villages from API:', villagesData.length);

        // NOTE: Do NOT display boundaries here - only show when village is selected
        // This enforces the village-first workflow
      } catch (error) {
        console.error('❌ Error loading villages from API:', error);
        toast.error('ไม่สามารถโหลดข้อมูลหมู่บ้านได้ กรุณาเข้าสู่ระบบใหม่');
        setVillages([]);
        setIsLoadingVillages(false);
      }
    };

    loadVillages();
  }, []);

  // Enable Geoman tools when a village is selected
  useEffect(() => {
    const map = mapInstanceRef.current as any;

    if (!selectedVillage || !map) {
      console.log('⏭️ No village selected - disabling tools');

      // ✅ DISABLE tools when no village is selected
      if (map && map.pm && map.pm.Toolbar) {
        map.pm.Toolbar.setButtonDisabled('drawPolygon', true);
        map.pm.Toolbar.setButtonDisabled('drawRectangle', true);
        map.pm.Toolbar.setButtonDisabled('drawMarker', true);
        map.pm.Toolbar.setButtonDisabled('editMode', true);
        map.pm.Toolbar.setButtonDisabled('dragMode', true);
        map.pm.Toolbar.setButtonDisabled('removalMode', true);
        console.log('🔒 All Geoman tools DISABLED');
      }
      return;
    }

    console.log('🔧 useEffect: Enabling Geoman tools for village:', selectedVillage.moo);

    // ✅ ENABLE tools when village is selected
    if (map.pm && map.pm.Toolbar) {
      map.pm.Toolbar.setButtonDisabled('drawPolygon', false);
      map.pm.Toolbar.setButtonDisabled('drawRectangle', false);
      map.pm.Toolbar.setButtonDisabled('drawMarker', false);
      map.pm.Toolbar.setButtonDisabled('editMode', false);
      map.pm.Toolbar.setButtonDisabled('dragMode', false);
      map.pm.Toolbar.setButtonDisabled('removalMode', false);
      console.log('🔓 All Geoman tools ENABLED');

      // Setup event listeners AFTER tools are enabled
      // Remove any existing listeners first to prevent duplicates
      map.off('pm:create');
      map.off('pm:remove');

      // Listen for drawn shapes
      map.on('pm:create', (e: any) => {
        console.log('🎨 pm:create event fired!', e);
        const layer = e.layer;


        // ✅ If it's a Marker, show dialog to add label
        if (layer instanceof L.Marker) {
          const latlng = layer.getLatLng();

          // Remove the temporary marker from map
          if (mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(layer);
          }

          // ⚠️ CRITICAL: Prevent opening new dialog if one is already open
          if (dialogIsOpen.current) {
            console.log('⚠️ Dialog already open - ignoring pm:create event');
            return;
          }

          // Store position and show dialog
          setTempMarkerPosition({ lat: latlng.lat, lng: latlng.lng });
          setMarkerLabel('');
          setMarkerNote('');
          setEditingMarker(null);
          setShowMarkerDialog(true);
          dialogIsOpen.current = true; // Mark as open

          return; // Don't process as polygon
        }

        // For Polygon/Rectangle, set drawn area
        if (layer && typeof layer.toGeoJSON === 'function') {
          const geojson = layer.toGeoJSON();
          console.log('📍 Setting drawnArea:', geojson);
          setDrawnArea(geojson);

          // Calculate area for Polygon/Rectangle
          if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
            const latlngs = layer.getLatLngs()[0] as L.LatLng[];
            let area = 0;

            // Simple area calculation using Shoelace formula
            for (let i = 0; i < latlngs.length; i++) {
              const j = (i + 1) % latlngs.length;
              area += latlngs[i].lat * latlngs[j].lng;
              area -= latlngs[j].lat * latlngs[i].lng;
            }
            area = Math.abs(area / 2);

            // Convert to km² (rough approximation)
            const areaKm2 = area * 111 * 111 * Math.cos(latlngs[0].lat * Math.PI / 180);
            setAreaSize(parseFloat(areaKm2.toFixed(4)));

            toast.success(`✅ วาดขอบเขตพื้นที่เรียบร้อย (${areaKm2.toFixed(4)} ตร.กม.)`);
          } else {
            toast.success('✅ วาดขอบเขตพื้นที่เรียบร้อย');
          }
        }
      });

      map.on('pm:remove', () => {
        setDrawnArea(null);
        setAreaSize(null);
        toast('ลบขอบเขตพื้นที่แล้ว', { icon: 'ℹ️' });
      });

      console.log('✅ Event listeners attached');
    } else {
      console.error('❌ Geoman toolbar not ready in useEffect');
    }


    // Auto-switch to satellite view for better visualization
    if (map._streetLayer && map.hasLayer(map._streetLayer)) {
      map.removeLayer(map._streetLayer);
    }
    if (map._satelliteLayer && !map.hasLayer(map._satelliteLayer)) {
      map.addLayer(map._satelliteLayer);
    }
    if (map._labelsLayer && !map.hasLayer(map._labelsLayer)) {
      map.addLayer(map._labelsLayer);
    }

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up event listeners');
      if (map && map.off) {
        map.off('pm:create');
        map.off('pm:remove');
      }
    };
  }, [selectedVillage]);


  // Display village boundaries on map
  const displayVillageBoundaries = (villagesData: LeafletVillage[]) => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    villagesData.forEach(village => {
      if (village.boundary && village.boundary.length > 0) {
        // Create GeoJSON layer
        const geoJsonLayer = L.geoJSON({
          type: 'Feature',
          properties: {
            villageId: village.id,
            villageName: village.name,
            villageNo: village.moo
          },
          geometry: {
            type: 'Polygon',
            coordinates: [village.boundary.map((coord: [number, number]) => [coord[1], coord[0]])] // [lat, lng] -> [lng, lat]
          }
        } as any, {
          style: {
            color: '#2563eb',
            weight: 2.5,
            opacity: 0.8,
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
            dashArray: '5, 5'
          },
          pmIgnore: true  // Prevent Geoman from editing village boundaries
        });

        // Bind popup
        geoJsonLayer.bindPopup(`
          <div style="text-align: center;">
            <strong style="font-size: 16px;">หมู่ ${village.moo}</strong><br/>
            <span style="font-size: 14px;">${village.name}</span><br/>
            <span style="font-size: 12px; color: #666;">👥 ${village.households || 0} ครัวเรือน</span>
          </div>
        `);

        // Bind tooltip
        geoJsonLayer.bindTooltip(`หมู่ ${village.moo}`, {
          permanent: false,
          direction: 'center',
          className: 'village-tooltip'
        });

        // Click event - prevent event interference
        geoJsonLayer.on('click', (e: any) => {
          L.DomEvent.stopPropagation(e);
          handleVillageClick(village);
        });

        geoJsonLayer.addTo(map);

        // Make layer non-blocking for drawing - set pointer-events to none on fill, but keep stroke clickable
        const villageElement = (geoJsonLayer as any).getElement();
        if (villageElement) {
          (villageElement as HTMLElement).style.pointerEvents = 'stroke';
        }

        villageBoundariesRef.current.set(village.moo, geoJsonLayer);
      }
    });

    console.log('✅ Displayed', villageBoundariesRef.current.size, 'village boundaries');
  };

  // Display and highlight only a single village's boundary
  const displaySingleVillageBoundary = (village: LeafletVillage) => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear all existing village boundaries from map
    // Method 1: Remove from ref
    villageBoundariesRef.current.forEach((layer) => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    villageBoundariesRef.current.clear();

    // Method 2: Remove all GeoJSON layers from map (cleanup any orphaned layers)
    map.eachLayer((layer: any) => {
      if (layer instanceof L.GeoJSON) {
        // Check if this layer has village properties
        const features = layer.getLayers();
        if (features && features.length > 0) {
          const firstFeature = features[0] as any;
          if (firstFeature && firstFeature.feature && firstFeature.feature.properties) {
            if (firstFeature.feature.properties.villageId || firstFeature.feature.properties.villageNo) {
              map.removeLayer(layer);
            }
          }
        }
      }
    });

    console.log('🧹 Cleared all village boundary layers');

    // Display only the selected village's boundary
    if (village.boundary && village.boundary.length > 0) {
      const geoJsonLayer = L.geoJSON({
        type: 'Feature',
        properties: {
          villageId: village.id,
          villageName: village.name,
          villageNo: village.moo
        },
        geometry: {
          type: 'Polygon',
          coordinates: [village.boundary.map((coord: [number, number]) => [coord[1], coord[0]])]
        }
      } as any, {
        style: {
          color: '#ff6b6b',  // Highlighted color for selected village
          weight: 3,
          opacity: 1,
          fillColor: '#ff6b6b',
          fillOpacity: 0.2,
          dashArray: '5, 5'
        },
        pmIgnore: true,  // Tell Geoman to ignore this layer
        interactive: false  // Make layer non-interactive for better tool usage
      });

      // Bind popup
      geoJsonLayer.bindPopup(`
        <div style="text-align: center;">
          <strong style="font-size: 16px;">หมู่ ${village.moo}</strong><br/>
          <span style="font-size: 14px;">${village.name}</span><br/>
          <span style="font-size: 12px; color: #666;">👥 ${village.households || 0} ครัวเรือน</span>
        </div>
      `);

      // Bind tooltip
      geoJsonLayer.bindTooltip(`หมู่ ${village.moo}`, {
        permanent: false,
        direction: 'center',
        className: 'village-tooltip'
      });

      geoJsonLayer.addTo(map);

      // Make layer non-blocking for drawing - apply to all polygons in the layer
      geoJsonLayer.eachLayer((layer: any) => {
        const element = layer.getElement ? layer.getElement() : null;
        if (element) {
          element.style.pointerEvents = 'none';  // Changed to 'none' for drawing tools to work
        }
      });

      villageBoundariesRef.current.set(village.moo, geoJsonLayer);

      console.log(`✅ Displayed boundary for หมู่ ${village.moo}`);
    }
  };

  // Handle village selection from dropdown
  const handleVillageSelect = (villageId: string) => {
    console.log('🏘️ handleVillageSelect called with villageId:', villageId);

    if (!villageId) {
      console.log('❌ No villageId provided');
      setSelectedVillage(null);
      resetHighlight();
      return;
    }

    const village = villages.find(v => v.id.toString() === villageId);
    console.log('🔍 Found village:', village);
    if (village) {
      setSelectedVillage(village);
      setFormData({ ...formData, village: village.name });

      // Display and highlight only the selected village's boundary
      displaySingleVillageBoundary(village);
      zoomToVillage(village);
      toast.success(`เลือกหมู่ ${village.moo} - ${village.name}`);

      // Note: Tool enabling is now handled by useEffect that watches selectedVillage
    }
  };

  // Handle village click from map
  const handleVillageClick = (village: LeafletVillage) => {
    setSelectedVillage(village);
    setFormData({ ...formData, village: village.name, otherDisasterType: formData.otherDisasterType });

    // Display and highlight only the selected village's boundary
    displaySingleVillageBoundary(village);
    zoomToVillage(village);
    toast.success(`เลือกหมู่ ${village.moo} - ${village.name}`);

    // Note: Tool enabling and satellite view switch are now handled by useEffect that watches selectedVillage

  };

  // Highlight selected village
  const highlightVillage = (village: LeafletVillage) => {
    // Reset all styles
    resetHighlight();

    // Highlight selected village
    const layer = villageBoundariesRef.current.get(village.moo);
    if (layer) {
      layer.setStyle({
        color: '#ff6b6b',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.3
      });
      layer.bringToFront();
    }
  };

  // Reset highlight
  const resetHighlight = () => {
    villageBoundariesRef.current.forEach(layer => {
      layer.setStyle({
        color: '#2563eb',
        weight: 2.5,
        opacity: 0.8,
        fillColor: '#3b82f6',
        fillOpacity: 0.15,
        dashArray: '5, 5'
      });
    });
  };

  // Zoom to village
  const zoomToVillage = (village: LeafletVillage) => {
    if (!mapInstanceRef.current) return;

    const layer = villageBoundariesRef.current.get(village.moo);
    if (layer) {
      const bounds = layer.getBounds();
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (village.lat && village.lng) {
      // Fallback to center point
      mapInstanceRef.current.setView([village.lat, village.lng], 15);
    }
  };

  // ========== MARKER MANAGEMENT FUNCTIONS ==========

  // Save new marker or update existing
  const handleSaveMarker = () => {
    console.log('🔵 handleSaveMarker called');
    console.log('📝 markerLabel:', markerLabel);
    console.log('📍 tempMarkerPosition:', tempMarkerPosition);
    console.log('🗺️ mapInstanceRef.current:', mapInstanceRef.current);

    if (!markerLabel.trim()) {
      toast.error('กรุณาใส่ชื่อจุด');
      return;
    }

    if (!tempMarkerPosition) return;

    if (editingMarker) {
      // Update existing marker
      const updatedMarkers = markers.map(m =>
        m.id === editingMarker.id
          ? { ...m, label: markerLabel, note: markerNote }
          : m
      );
      setMarkers(updatedMarkers);

      // Update marker on map
      const leafletMarker = markersRef.current.get(editingMarker.id);
      if (leafletMarker) {
        leafletMarker.getPopup()?.setContent(`
          <div style="min-width: 150px;">
            <strong>${markerLabel}</strong><br/>
            ${markerNote ? `<span style="font-size: 12px;">${markerNote}</span><br/>` : ''}
            <small style="color: #666;">${tempMarkerPosition.lat.toFixed(6)}, ${tempMarkerPosition.lng.toFixed(6)}</small>
          </div>
        `);
      }

      toast.success('แก้ไขหมุดสำเร็จ');
    } else {
      // Add new marker
      const newMarker: MarkerPoint = {
        id: `marker-${Date.now()}`,
        lat: tempMarkerPosition.lat,
        lng: tempMarkerPosition.lng,
        label: markerLabel,
        note: markerNote,
        createdAt: new Date().toISOString()
      };

      const updatedMarkers = [...markers, newMarker];
      setMarkers(updatedMarkers);

      // Add marker to map
      addMarkerToMap(newMarker, updatedMarkers.length - 1);

      toast.success(`เพิ่มหมุดที่ ${updatedMarkers.length}: ${markerLabel}`);
    }

    // Close dialog
    console.log('🚪 Closing dialog');
    setShowMarkerDialog(false);
    setMarkerLabel('');
    setMarkerNote('');
    setTempMarkerPosition(null);
    setEditingMarker(null);
    dialogIsOpen.current = false; // Reset dialog state
    console.log('✅ handleSaveMarker completed');
  };

  // Add marker to map with numbered pin
  const addMarkerToMap = (marker: MarkerPoint, index: number) => {
    console.log('🗺️ addMarkerToMap called');
    console.log('📍 marker:', marker);
    console.log('🔢 index:', index);
    console.log('🗺️ mapInstanceRef.current:', mapInstanceRef.current);

    if (!mapInstanceRef.current) {
      console.error('❌ mapInstanceRef.current is null!');
      return;
    }

    const markerIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="position: relative; width: 40px; height: 50px;">
          <div style="
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 12px solid #3b82f6;
          "></div>
          <div style="
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 32px;
            height: 32px;
            background: #3b82f6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            color: white;
          ">${index + 1}</div>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 50]
    });

    console.log('🎨 Created marker icon');

    const leafletMarker = L.marker([marker.lat, marker.lng], {
      icon: markerIcon,
      draggable: true
    }).addTo(mapInstanceRef.current);

    console.log('✅ Added marker to map');

    // Bind popup
    leafletMarker.bindPopup(`
      <div style="min-width: 150px;">
        <strong>${marker.label}</strong><br/>
        ${marker.note ? `<span style="font-size: 12px;">${marker.note}</span><br/>` : ''}
        <small style="color: #666;">${marker.lat.toFixed(6)}, ${marker.lng.toFixed(6)}</small>
      </div>
    `);

    // Handle drag
    leafletMarker.on('dragend', () => {
      const pos = leafletMarker.getLatLng();
      const updatedMarkers = markers.map(m =>
        m.id === marker.id
          ? { ...m, lat: pos.lat, lng: pos.lng }
          : m
      );
      setMarkers(updatedMarkers);
      toast.success('ปรับตำแหน่งหมุดแล้ว');
    });

    // Store reference
    markersRef.current.set(marker.id, leafletMarker);
    console.log('💾 Stored marker reference');
  };

  // Delete marker
  const handleDeleteMarker = (markerId: string) => {
    const updatedMarkers = markers.filter(m => m.id !== markerId);
    setMarkers(updatedMarkers);

    // Remove from map
    const leafletMarker = markersRef.current.get(markerId);
    if (leafletMarker && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(leafletMarker);
      markersRef.current.delete(markerId);
    }

    toast.success('ลบหมุดแล้ว');
  };

  // Edit marker
  const handleEditMarker = (marker: MarkerPoint) => {
    setEditingMarker(marker);
    setMarkerLabel(marker.label);
    setMarkerNote(marker.note || '');
    setTempMarkerPosition({ lat: marker.lat, lng: marker.lng });
    setShowMarkerDialog(true);
  };

  // ========== END MARKER MANAGEMENT ==========

  // Get current location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('เบราว์เซอร์ไม่รองรับ GPS');
      return;
    }

    toast.loading('กำลังค้นหาตำแหน่ง...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy: gpsAccuracy } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        setAccuracy(gpsAccuracy); // Capture GPS accuracy


        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);

          // Remove old GPS marker if exists
          if (gpsMarkerRef.current) {
            mapInstanceRef.current.removeLayer(gpsMarkerRef.current);
          }

          // Add new draggable marker with clear pin icon
          const newMarker = L.marker([latitude, longitude], {
            draggable: true,
            icon: L.divIcon({
              className: 'custom-marker',
              html: `
                <div style="position: relative; width: 40px; height: 50px;">
                  <div style="
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-top: 12px solid #ef4444;
                  "></div>
                  <div style="
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 32px;
                    height: 32px;
                    background: #ef4444;
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                  ">📍</div>
                </div>
              `,
              iconSize: [40, 50],
              iconAnchor: [20, 50]
            })
          }).addTo(mapInstanceRef.current);

          // Update location when marker is dragged
          newMarker.on('dragend', () => {
            const pos = newMarker.getLatLng();
            setCurrentLocation({ lat: pos.lat, lng: pos.lng });
            toast.success(`📍 ปรับตำแหน่ง: ${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`);
          });

          gpsMarkerRef.current = newMarker;
        }

        toast.dismiss();
        toast.success(`📍 พบตำแหน่ง: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      },
      (error) => {
        toast.dismiss();
        toast.error('ไม่สามารถค้นหาตำแหน่งได้: ' + error.message);
      }
    );
  };

  // Manual pin placement - click on map to set GPS location
  const handleManualPin = () => {
    if (!mapInstanceRef.current) return;
    if (!selectedVillage) {
      toast.error('กรุณาเลือกหมู่บ้านก่อน');
      return;
    }

    setIsManualPinMode(true);
    toast('📌 คลิกบนแผนที่เพื่อปักหมุด', { duration: 3000 });

    const mapContainer = mapInstanceRef.current.getContainer();
    mapContainer.style.cursor = 'crosshair';

    const onMapClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setCurrentLocation({ lat, lng });

      // Remove old marker if exists
      if (gpsMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(gpsMarkerRef.current);
      }

      // Add new draggable marker with clear pin icon
      const newMarker = L.marker([lat, lng], {
        draggable: true,
        icon: L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="position: relative; width: 40px; height: 50px;">
              <div style="
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 12px solid #ef4444;
              "></div>
              <div style="
                position: absolute;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                width: 32px;
                height: 32px;
                background: #ef4444;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
              ">📍</div>
            </div>
          `,
          iconSize: [40, 50],
          iconAnchor: [20, 50]
        })
      }).addTo(mapInstanceRef.current!);

      // Update location when marker is dragged
      newMarker.on('dragend', () => {
        const pos = newMarker.getLatLng();
        setCurrentLocation({ lat: pos.lat, lng: pos.lng });
        toast.success(`📍 ปรับตำแหน่ง: ${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`);
      });

      gpsMarkerRef.current = newMarker;

      // Reset manual pin mode
      mapContainer.style.cursor = '';
      setIsManualPinMode(false);
      mapInstanceRef.current!.off('click', onMapClick);

      toast.success(`📍 ปักหมุด: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    };

    mapInstanceRef.current.on('click', onMapClick);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validate form using centralized validation
    const errors = validateSurveyForm({
      village: selectedVillage?.id,
      villageName: formData.village,
      disasterType: formData.disasterType === 'other' ? formData.otherDisasterType : formData.disasterType,
      severity: formData.severity,
      estimatedHouseholds: formData.estimatedHouseholds,
      notes: formData.description,
      latitude: currentLocation?.lat,
      longitude: currentLocation?.lng,
      polygon: drawnArea,
      markers: markers // ✅ Include markers for validation
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);

      // Show first error
      const firstError = Object.values(errors)[0];
      toast.error(firstError, {
        duration: 4000,
        icon: '⚠️'
      });

      // Scroll to first error field
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      return;
    }

    // Clear errors if validation passed
    setValidationErrors({});

    setIsSubmitting(true);

    try {
      // 1. Upload images first with better error handling
      let photoUrls: string[] = [];
      if (selectedImages.length > 0) {
        console.log('📷 Uploading', selectedImages.length, 'images...');

        // Show uploading toast
        const uploadToastId = toast.loading(`กำลังอัปโหลดรูปภาพ ${selectedImages.length} รูป...`);

        try {
          photoUrls = await fieldSurveyApi.uploadImages(selectedImages);
          console.log('✅ Images uploaded:', photoUrls);

          // Update toast to success
          toast.success(
            `✅ อัปโหลดรูปภาพสำเร็จ ${photoUrls.length}/${selectedImages.length} รูป`,
            { id: uploadToastId }
          );
        } catch (uploadError: any) {
          console.error('❌ Image upload failed:', uploadError);
          toast.dismiss(uploadToastId);

          // Show error with retry option
          const shouldRetry = await new Promise<boolean>((resolve) => {
            toast.error(
              (t) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span>❌ ไม่สามารถอัปโหลดรูปภาพได้</span>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {uploadError.response?.data?.message || uploadError.message}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        toast.dismiss(t.id);
                        resolve(true); // Retry
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      🔄 ลองใหม่
                    </button>
                    <button
                      onClick={() => {
                        toast.dismiss(t.id);
                        resolve(false); // Continue without images
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      ⏭️ ข้ามไป
                    </button>
                  </div>
                </div>
              ),
              { duration: Infinity }
            );
          });

          if (shouldRetry) {
            // Retry upload
            try {
              toast.loading('กำลังลองอัปโหลดอีกครั้ง...');
              photoUrls = await fieldSurveyApi.uploadImages(selectedImages);
              toast.success(`✅ อัปโหลดสำเร็จ ${photoUrls.length} รูป`);
            } catch (retryError) {
              toast.error('ไม่สามารถอัปโหลดได้ จะบันทึกข้อมูลโดยไม่มีรูปภาพ');
              photoUrls = [];
            }
          } else {
            toast('บันทึกข้อมูลโดยไม่มีรูปภาพ', { icon: 'ℹ️' });
            photoUrls = [];
          }
        }
      }

      // 2. Prepare survey data
      const surveyData = {
        villageId: selectedVillage?.id,
        villageName: formData.village,
        disasterType: formData.disasterType === 'other'
          ? formData.otherDisasterType
          : formData.disasterType,
        severity: parseInt(formData.severity),
        estimatedHouseholds: parseInt(formData.estimatedHouseholds) || 0,
        notes: formData.description || '',
        gpsLocation: {
          lat: currentLocation?.lat ?? 0,
          lng: currentLocation?.lng ?? 0,
        },
        polygon: drawnArea, // GeoJSON object
        areaSize: areaSize || undefined, // size in km² (convert null to undefined)
        photoUrls: photoUrls,
        additionalData: {
          surveyDate: surveyDate, // วันที่สำรวจ
          incidentDate: incidentDate, // วันที่เกิดเหตุ
          injured: injured ? parseInt(injured) : 0, // ผู้บาดเจ็บ
          deaths: deaths ? parseInt(deaths) : 0, // ผู้เสียชีวิต
          estimatedDamage: estimatedDamage ? parseFloat(estimatedDamage) : 0, // ความเสียหาย
          locationName: locationName, // ชื่อตำแหน่ง
          accuracy: accuracy, // ความแม่นยำ GPS
        }
      };

      console.log('📋 Navigating to review page with data:', surveyData);

      // 3. Navigate to review page (NOT saving yet)
      toast.success('✅ ข้อมูลพร้อมแล้ว กรุณาตรวจสอบก่อนบันทึก');
      navigate('/survey-review', {
        state: { surveyData }
      });

    } catch (error: any) {
      console.error('❌ Error submitting survey:', error);
      toast.error(
        'เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' +
        (error.response?.data?.message || error.message || 'กรุณาลองใหม่อีกครั้ง')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to reset form
  const resetForm = () => {
    setFormData({
      disasterType: '',
      otherDisasterType: '',
      severity: '',
      village: '',
      description: '',
      estimatedHouseholds: ''
    });
    setDrawnArea(null);
    setAreaSize(null);
    setCurrentLocation(null);
    setSelectedImages([]);
    setImagePreviews([]);
    setSelectedVillage(null);

    // Clear map layers
    if (drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers();
    }

    // Remove GPS marker
    if (gpsMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(gpsMarkerRef.current);
      gpsMarkerRef.current = null;
    }

    toast.success('พร้อมสำรวจพื้นที่ใหม่');
  };

  return (
    <DashboardLayout>
      {showInstructions && <MapInstructionsOverlay onClose={handleCloseInstructions} />}

      <div style={{ padding: '0' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a202c', margin: '0 0 8px 0' }}>
            🔍 สำรวจพื้นที่ (Survey Area)
          </h1>
          <p style={{ color: '#718096', margin: '0 0 8px 0' }}>
            ระบุตำแหน่ง GPS และวาดขอบเขตพื้นที่ประสบภัย
          </p>
          <button
            onClick={() => setShowInstructions(true)}
            style={{
              padding: '8px 16px',
              background: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #dbeafe',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            📖 ดูวิธีใช้งาน
          </button>
        </div>

        {/* Map Section */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>🗺️ แผนที่สำรวจ</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleGetLocation}
                disabled={!selectedVillage}
                title={!selectedVillage ? 'กรุณาเลือกหมู่บ้านก่อนใช้งาน' : 'คลิกเพื่อค้นหาตำแหน่งปัจจุบัน'}
                style={{
                  padding: '10px 20px',
                  background: !selectedVillage ? '#94a3b8' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: !selectedVillage ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                📍 Get Location
              </button>
              <button
                onClick={handleManualPin}
                disabled={!selectedVillage || isManualPinMode}
                title={!selectedVillage ? 'กรุณาเลือกหมู่บ้านก่อนใช้งาน' : 'คลิกเพื่อปักหมุดบนแผนที่'}
                style={{
                  padding: '10px 16px',
                  background: (!selectedVillage || isManualPinMode) ? '#94a3b8' : '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: (!selectedVillage || isManualPinMode) ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                📌 ปักหมุดเอง
              </button>
            </div>
          </div>

          {/* Village Selector with Alert */}
          <div style={{ marginBottom: '16px' }}>
            {!selectedVillage && (
              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                borderRadius: '12px',
                border: '2px solid #f59e0b',
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '32px' }}>⚠️</span>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: '#92400e', marginBottom: '4px' }}>
                      กรุณาเลือกหมู่บ้านก่อนเริ่มสำรวจ
                    </div>
                    <div style={{ fontSize: '14px', color: '#78350f' }}>
                      เครื่องมือวาดขอบเขตและปักหมุดจะใช้งานได้หลังจากเลือกหมู่บ้านแล้ว
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{
              padding: '16px',
              background: selectedVillage ? '#f0fdf4' : '#f0f9ff',
              borderRadius: '8px',
              border: selectedVillage ? '2px solid #86efac' : '2px solid #bfdbfe',
              transition: 'all 0.3s ease'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                fontSize: '14px',
                color: selectedVillage ? '#16a34a' : '#1e40af'
              }}>
                🏘️ เลือกหมู่บ้าน * {selectedVillage && '✅'}
              </label>
              <select
                value={selectedVillage?.id || ''}
                onChange={(e) => handleVillageSelect(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: selectedVillage ? '2px solid #10b981' : '2px solid #3b82f6',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  background: 'white',
                  transition: 'all 0.3s ease'
                }}
                required
              >
                <option value="">-- เลือกหมู่บ้าน หรือคลิกบนแผนที่ --</option>
                {villages.map(v => (
                  <option key={v.id} value={v.id}>
                    หมู่ {v.moo} - {v.name} {v.households ? `(${v.households} ครัวเรือน)` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {currentLocation && (
            <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', marginBottom: '16px', border: '1px solid #86efac' }}>
              <strong style={{ color: '#16a34a' }}>✅ ตำแหน่งปัจจุบัน:</strong>
              <span style={{ marginLeft: '8px', color: '#166534' }}>
                Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
              </span>
            </div>
          )}

          {areaSize && (
            <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', marginBottom: '16px', border: '1px solid #93c5fd' }}>
              <strong style={{ color: '#1e40af' }}>📏 พื้นที่ที่วาด:</strong>
              <span style={{ marginLeft: '8px', color: '#1e3a8a', fontSize: '16px', fontWeight: '600' }}>
                {areaSize} ตร.กม.
              </span>
            </div>
          )}

          <div
            ref={mapRef}
            style={{
              height: '500px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0'
            }}
          />

          <div style={{ marginTop: '12px', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
            <strong style={{ fontSize: '14px' }}>💡 วิธีใช้:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '14px', color: '#4a5568' }}>
              <li>คลิก "Get Location" เพื่อระบุตำแหน่งปัจจุบัน</li>
              <li>ใช้เครื่องมือด้านซ้ายบนแผนที่เพื่อวาด Polygon หรือ Rectangle</li>
              <li>สามารถแก้ไข ลบ หรือย้ายรูปร่างได้</li>
            </ul>
          </div>
        </div>

        {/* Marker Dialog - Using Portal to render outside component tree */}
        {showMarkerDialog && ReactDOM.createPortal(
          <div
            onClick={(e) => {
              // Only close if clicking on the backdrop, not the dialog content
              if (e.target === e.currentTarget) {
                console.log('🚫 Backdrop clicked - closing dialog');
                setShowMarkerDialog(false);
                setMarkerLabel('');
                setMarkerNote('');
                setTempMarkerPosition(null);
                setEditingMarker(null);
              }
            }}
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '2147483647' // Maximum z-index value
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#1a202c' }}>
                {editingMarker ? '✏️ แก้ไขหมุด' : '📍 เพิ่มหมุดใหม่'}
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  ชื่อจุด *
                </label>
                <input
                  type="text"
                  value={markerLabel}
                  onChange={(e) => setMarkerLabel(e.target.value)}
                  placeholder="เช่น บ้านนายสมชาย, ถนนสายหลัก"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  รายละเอียดเพิ่มเติม (ถ้ามี)
                </label>
                <textarea
                  value={markerNote}
                  onChange={(e) => setMarkerNote(e.target.value)}
                  placeholder="เช่น ได้รับผลกระทบหนัก, น้ำท่วมสูง 50 ซม."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {tempMarkerPosition && (
                <div style={{
                  padding: '12px',
                  background: '#f7fafc',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: '#4a5568'
                }}>
                  <strong>พิกัด:</strong> {tempMarkerPosition.lat.toFixed(6)}, {tempMarkerPosition.lng.toFixed(6)}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowMarkerDialog(false);
                    setMarkerLabel('');
                    setMarkerNote('');
                    setTempMarkerPosition(null);
                    setEditingMarker(null);
                    dialogIsOpen.current = false; // Reset dialog state
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#e2e8f0',
                    color: '#4a5568',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSaveMarker();
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  {editingMarker ? 'บันทึกการแก้ไข' : 'เพิ่มหมุด'}
                </button>
              </div>
            </div>
          </div>,
          // Render to fullscreen element if in fullscreen, otherwise to body
          document.fullscreenElement || document.body
        )}

        {/* Marker List Panel */}
        {markers.length > 0 && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              📍 จุดที่ทำเครื่องหมาย ({markers.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {markers.map((marker, index) => (
                <div
                  key={marker.id}
                  style={{
                    padding: '16px',
                    background: '#f7fafc',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          background: '#3b82f6',
                          color: 'white',
                          borderRadius: '50%',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {index + 1}
                        </span>
                        <strong style={{ fontSize: '16px', color: '#1a202c' }}>{marker.label}</strong>
                      </div>
                      {marker.note && (
                        <p style={{ fontSize: '14px', color: '#4a5568', margin: '0 0 8px 32px' }}>
                          {marker.note}
                        </p>
                      )}
                      <div style={{ fontSize: '13px', color: '#718096', marginLeft: '32px' }}>
                        📍 {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditMarker(marker)}
                        style={{
                          padding: '6px 12px',
                          background: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          borderRadius: '6px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        ✏️ แก้ไข
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`ต้องการลบหมุด "${marker.label}" หรือไม่?`)) {
                            handleDeleteMarker(marker.id);
                          }
                        }}
                        style={{
                          padding: '6px 12px',
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          borderRadius: '6px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        🗑️ ลบ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Section */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>📝 บันทึกข้อมูลการสำรวจ</h2>

          <form onSubmit={handleSubmit}>
            {/* Survey Date */}
            <div style={{
              marginBottom: '20px',
              opacity: !selectedVillage ? 0.5 : 1,
              pointerEvents: !selectedVillage ? 'none' : 'auto'
            }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                📅 วันที่สำรวจ *
              </label>
              <ThaiDateInput
                value={surveyDate}
                onChange={setSurveyDate}
                disabled={!selectedVillage}
                required={true}
                max={new Date().toISOString().split('T')[0]}
              />
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                รูปแบบ: วัน เดือน ปี พ.ศ. (เช่น 23 ธันวาคม 2568)
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>ประเภทภัย *</label>
                <select
                  value={formData.disasterType}
                  onChange={(e) => setFormData({ ...formData, disasterType: e.target.value })}
                  disabled={!selectedVillage}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: !selectedVillage ? '#f3f4f6' : 'white',
                    cursor: !selectedVillage ? 'not-allowed' : 'default',
                    color: !selectedVillage ? '#9ca3af' : 'inherit'
                  }}
                  required
                >
                  <option value="">เลือกประเภทภัย</option>
                  <option value="flood">น้ำท่วม</option>
                  <option value="landslide">ดินถล่ม</option>
                  <option value="fire">อัคคีภัย</option>
                  <option value="earthquake">แผ่นดินไหว</option>
                  <option value="storm">วาตภัย</option>
                  <option value="wildfire">ไฟป่า</option>
                  <option value="drought">ภัยแล้ง</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              {/* Other Disaster Type - Only show when "other" is selected */}
              {formData.disasterType === 'other' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>ระบุประเภทภัยอื่นๆ *</label>
                  <input
                    type="text"
                    value={formData.otherDisasterType}
                    onChange={(e) => setFormData({ ...formData, otherDisasterType: e.target.value })}
                    placeholder="เช่น ภัยแล้ง, ไฟป่า"
                    disabled={!selectedVillage}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: !selectedVillage ? '#f3f4f6' : 'white',
                      cursor: !selectedVillage ? 'not-allowed' : 'default',
                      color: !selectedVillage ? '#9ca3af' : 'inherit'
                    }}
                    required
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>ระดับความรุนแรง *</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  disabled={!selectedVillage}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: !selectedVillage ? '#f3f4f6' : 'white',
                    cursor: !selectedVillage ? 'not-allowed' : 'default',
                    color: !selectedVillage ? '#9ca3af' : 'inherit'
                  }}
                  required
                >
                  <option value="">เลือกระดับ</option>
                  <option value="1">1 - เล็กน้อย</option>
                  <option value="2">2 - ปานกลาง</option>
                  <option value="3">3 - รุนแรง</option>
                  <option value="4">4 - รุนแรงมาก</option>
                  <option value="5">5 - ภัยพิบัติ</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>จำนวนครัวเรือนประมาณ</label>
                <input
                  type="number"
                  value={formData.estimatedHouseholds}
                  onChange={(e) => setFormData({ ...formData, estimatedHouseholds: e.target.value })}
                  placeholder="เช่น 50"
                  disabled={!selectedVillage}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: !selectedVillage ? '#f3f4f6' : 'white',
                    cursor: !selectedVillage ? 'not-allowed' : 'default',
                    color: !selectedVillage ? '#9ca3af' : 'inherit'
                  }}
                />
              </div>

              {/* New Fields - Added to match review page expectations */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>วันที่เกิดเหตุ</label>
                <ThaiDateInput
                  value={incidentDate}
                  onChange={setIncidentDate}
                  disabled={!selectedVillage}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>ชื่อตำแหน่ง</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="เช่น บ้านเลขที่ 15, หน้าโรงเรียน"
                  disabled={!selectedVillage}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: !selectedVillage ? '#f3f4f6' : 'white',
                    cursor: !selectedVillage ? 'not-allowed' : 'default',
                    color: !selectedVillage ? '#9ca3af' : 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>ผู้บาดเจ็บ</label>
                <input
                  type="number"
                  value={injured}
                  onChange={(e) => setInjured(e.target.value)}
                  placeholder="0"
                  min="0"
                  disabled={!selectedVillage}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: !selectedVillage ? '#f3f4f6' : 'white',
                    cursor: !selectedVillage ? 'not-allowed' : 'default',
                    color: !selectedVillage ? '#9ca3af' : 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>ผู้เสียชีวิต</label>
                <input
                  type="number"
                  value={deaths}
                  onChange={(e) => setDeaths(e.target.value)}
                  placeholder="0"
                  min="0"
                  disabled={!selectedVillage}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: !selectedVillage ? '#f3f4f6' : 'white',
                    cursor: !selectedVillage ? 'not-allowed' : 'default',
                    color: !selectedVillage ? '#9ca3af' : 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>ความเสียหายโดยประมาณ (บาท)</label>
                <input
                  type="number"
                  value={estimatedDamage}
                  onChange={(e) => setEstimatedDamage(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1000"
                  disabled={!selectedVillage}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: !selectedVillage ? '#f3f4f6' : 'white',
                    cursor: !selectedVillage ? 'not-allowed' : 'default',
                    color: !selectedVillage ? '#9ca3af' : 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>รายละเอียดเพิ่มเติม</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="บันทึกรายละเอียดการสำรวจ สภาพพื้นที่ ความเสียหาย..."
                disabled={!selectedVillage}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  background: !selectedVillage ? '#f3f4f6' : 'white',
                  cursor: !selectedVillage ? 'not-allowed' : 'default',
                  color: !selectedVillage ? '#9ca3af' : 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                📷 รูปภาพประกอบ (ถ่ายจากกล้องหรือเลือกจากเครื่อง)
              </label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                disabled={!selectedVillage}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setSelectedImages(files);

                  // Create previews
                  const previews = files.map(file => URL.createObjectURL(file));
                  setImagePreviews(previews);

                  if (files.length > 0) {
                    toast.success(`✅ เลือก ${files.length} รูปภาพ`);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: !selectedVillage ? '#f3f4f6' : 'white',
                  cursor: !selectedVillage ? 'not-allowed' : 'default'
                }}
              />

              {imagePreviews.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <strong style={{ fontSize: '14px', color: '#4a5568', marginBottom: '8px', display: 'block' }}>
                    📸 ภาพที่เลือก ({imagePreviews.length} รูป)
                  </strong>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                    {imagePreviews.map((preview, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img
                          src={preview}
                          alt={`Preview ${i + 1}`}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = selectedImages.filter((_, idx) => idx !== i);
                            const newPreviews = imagePreviews.filter((_, idx) => idx !== i);
                            setSelectedImages(newImages);
                            setImagePreviews(newPreviews);
                            toast('ลบรูปภาพแล้ว', { icon: 'ℹ️' });
                          }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!selectedVillage && (
              <div style={{
                padding: '12px',
                background: '#fef3c7',
                border: '2px solid #fbbf24',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px',
                color: '#92400e',
                fontWeight: '600'
              }}>
                ⚠️ กรุณาเลือกหมู่บ้านก่อนกรอกข้อมูล
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedVillage || isSubmitting}
              style={{
                width: '100%',
                padding: '14px',
                background: (!selectedVillage || isSubmitting) ? '#94a3b8' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (!selectedVillage || isSubmitting) ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                opacity: (!selectedVillage || isSubmitting) ? 0.6 : 1
              }}
            >
              {isSubmitting ? '⏳ กำลังบันทึก...' : '💾 บันทึกข้อมูลการสำรวจ'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
