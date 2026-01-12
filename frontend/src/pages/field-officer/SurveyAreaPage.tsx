/**
 * Survey Area Page - Field Officer
 * สำรวจพื้นที่พร้อม GPS และ Drawing Tools (Single Page)
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MapInstructionsOverlay } from '../../components/field-officer/MapInstructionsOverlay';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import { TAMBON_INFO } from '../../data/villages';
import { villagesApi, type LeafletVillage } from '../../api/villages';
import { fieldSurveyApi } from '../../api/fieldSurvey';
import { tasksApi } from '../../api/tasks';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function SurveyAreaPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const dialogIsOpen = useRef<boolean>(false);


  // Task Data
  const [task, setTask] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [supervisorComments, setSupervisorComments] = useState('');

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
  const [markerLabel, setMarkerLabel] = useState('');
  const [markerNote, setMarkerNote] = useState('');

  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [drawnArea, setDrawnArea] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [villages, setVillages] = useState<LeafletVillage[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<LeafletVillage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [surveyDate, setSurveyDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Form Data - Survey Fields Only (7 fields)
  const [formData, setFormData] = useState({
    village: '',
    disasterType: '',
    otherDisasterType: '',
    severity: '3',
    estimatedHouseholds: '',
    description: '',
  });

  const [showInstructions, setShowInstructions] = useState(false);

  // Fetch Task and Survey Data
  useEffect(() => {
    if (taskId) {
      const loadData = async () => {
        try {
          const taskData = await tasksApi.getById(taskId);
          setTask(taskData);

          // Check for revision status
          if (taskData.status === 'REVISION_REQUIRED') {
            setEditMode(true);
            setSupervisorComments(taskData.supervisorComment || '');
            toast.error('⚠️ งานนี้ต้องมีการแก้ไข กรุณาอ่านความคิดเห็นจากหัวหน้า');

            // Find existing survey for this task
            try {
              const surveys = await fieldSurveyApi.getMySurveys();
              const existingSurvey = surveys.find(s => s.taskId === taskId);

              if (existingSurvey) {
                // Pre-fill form with existing survey data
                setFormData((prev: any) => ({
                  ...prev,
                  ...existingSurvey.additionalData, // Spread additional assessment data
                  village: existingSurvey.villageName,
                  disasterType: existingSurvey.disasterType,
                  severity: existingSurvey.severity.toString(),
                  estimatedHouseholds: existingSurvey.estimatedHouseholds.toString(),
                  description: existingSurvey.notes,
                }));

                // Pre-fill map data
                if (existingSurvey.gpsLocation) {
                  setCurrentLocation(existingSurvey.gpsLocation);
                }
                if (existingSurvey.polygon) {
                  setDrawnArea(existingSurvey.polygon);
                }
                if (existingSurvey.photoUrls) {
                  setExistingPhotos(existingSurvey.photoUrls);
                }

                // Select village if ID matches
                if (existingSurvey.villageId) {
                  const v = villages.find(v => v.id.toString() === existingSurvey.villageId);
                  if (v) setSelectedVillage(v);
                }
              }
            } catch (err) {
              console.error('Failed to load existing survey:', err);
            }
          } else if (taskData) {
            // Normal task pre-fill
            setFormData((prev: any) => ({
              ...prev,
              description: taskData.description || prev.description,
            }));
          }
        } catch (err) {
          console.error('Failed to load task:', err);
        }
      };
      loadData();
    }
  }, [taskId, villages]);

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

  // Update form field helper
  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([TAMBON_INFO.centerLat, TAMBON_INFO.centerLng], 13);

    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri',
      maxZoom: 18,
    });

    const labelsLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Labels © Esri',
      maxZoom: 18,
    });

    (map as any)._streetLayer = streetLayer;
    (map as any)._satelliteLayer = satelliteLayer;
    (map as any)._labelsLayer = labelsLayer;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

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

    // Disable tools initially
    setTimeout(() => {
      if (map.pm && map.pm.Toolbar) {
        map.pm.Toolbar.setButtonDisabled('drawPolygon', true);
        map.pm.Toolbar.setButtonDisabled('drawRectangle', true);
        map.pm.Toolbar.setButtonDisabled('drawMarker', true);
        map.pm.Toolbar.setButtonDisabled('editMode', true);
        map.pm.Toolbar.setButtonDisabled('dragMode', true);
        map.pm.Toolbar.setButtonDisabled('removalMode', true);
      }
    }, 100);

    // Fullscreen control
    const fullscreenControl = L.Control.extend({
      options: { position: 'topright' },
      onAdd: function () {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = L.DomUtil.create('a', '', container);
        button.href = '#';
        button.innerHTML = '⛶';
        button.style.fontSize = '20px';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.textDecoration = 'none';
        button.style.color = '#333';

        L.DomEvent.on(button, 'click', function (e: any) {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          if (!document.fullscreenElement) {
            mapRef.current?.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        });
        return container;
      }
    });
    map.addControl(new fullscreenControl());

    map.pm.setGlobalOptions({ layerGroup: drawnItems });
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Initialize map once

  // Load villages
  useEffect(() => {
    const loadVillages = async () => {
      try {
        const villagesData = await villagesApi.getAllForMap();
        setVillages(villagesData);
      } catch (error) {
        console.error('❌ Error loading villages:', error);
        toast.error('ไม่สามารถโหลดข้อมูลหมู่บ้านได้');
        setVillages([]);
      }
    };
    loadVillages();
  }, []);

  // Handle village selection and map tools
  useEffect(() => {
    const map = mapInstanceRef.current as any;
    if (!map) return;

    if (!selectedVillage) {
      if (map.pm && map.pm.Toolbar) {
        map.pm.Toolbar.setButtonDisabled('drawPolygon', true);
        map.pm.Toolbar.setButtonDisabled('drawRectangle', true);
        map.pm.Toolbar.setButtonDisabled('drawMarker', true);
        map.pm.Toolbar.setButtonDisabled('editMode', true);
        map.pm.Toolbar.setButtonDisabled('dragMode', true);
        map.pm.Toolbar.setButtonDisabled('removalMode', true);
      }
      return;
    }

    if (map.pm && map.pm.Toolbar) {
      map.pm.Toolbar.setButtonDisabled('drawPolygon', false);
      map.pm.Toolbar.setButtonDisabled('drawRectangle', false);
      map.pm.Toolbar.setButtonDisabled('drawMarker', false);
      map.pm.Toolbar.setButtonDisabled('editMode', false);
      map.pm.Toolbar.setButtonDisabled('dragMode', false);
      map.pm.Toolbar.setButtonDisabled('removalMode', false);

      map.off('pm:create');
      map.off('pm:remove');

      map.on('pm:create', (e: any) => {
        const layer = e.layer;
        if (layer instanceof L.Marker) {
          const latlng = layer.getLatLng();
          if (mapInstanceRef.current) mapInstanceRef.current.removeLayer(layer);

          if (dialogIsOpen.current) return;

          setTempMarkerPosition({ lat: latlng.lat, lng: latlng.lng });
          setMarkerLabel('');
          setMarkerNote('');
          setShowMarkerDialog(true);
          dialogIsOpen.current = true;
          return;
        }

        if (layer && typeof layer.toGeoJSON === 'function') {
          const geojson = layer.toGeoJSON();
          setDrawnArea(geojson);

          if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
            // Calculate area logic here if needed
            toast.success('✅ วาดขอบเขตพื้นที่เรียบร้อย');
          }
        }
      });

      map.on('pm:remove', () => {
        setDrawnArea(null);
      });
    }

    // Switch to satellite
    if (map._streetLayer && map.hasLayer(map._streetLayer)) map.removeLayer(map._streetLayer);
    if (map._satelliteLayer && !map.hasLayer(map._satelliteLayer)) map.addLayer(map._satelliteLayer);
    if (map._labelsLayer && !map.hasLayer(map._labelsLayer)) map.addLayer(map._labelsLayer);

    // Display boundary
    if (selectedVillage.boundary && selectedVillage.boundary.length > 0) {
      // Clear existing
      map.eachLayer((layer: any) => {
        if (layer instanceof L.GeoJSON && layer.options.pmIgnore) {
          map.removeLayer(layer);
        }
      });

      const geoJsonLayer = L.geoJSON({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [selectedVillage.boundary.map((coord: [number, number]) => [coord[1], coord[0]])]
        }
      } as any, {
        style: {
          color: '#ff6b6b',
          weight: 3,
          opacity: 1,
          fillColor: '#ff6b6b',
          fillOpacity: 0.2,
          dashArray: '5, 5'
        },
        pmIgnore: true,
        interactive: false
      }).addTo(map);

      map.fitBounds(geoJsonLayer.getBounds(), { padding: [50, 50] });
    } else {
      map.setView([selectedVillage.lat, selectedVillage.lng], 14);
    }

  }, [selectedVillage]);

  const handleVillageSelect = (villageId: string) => {
    if (!villageId) {
      setSelectedVillage(null);
      setFormData((prev) => ({ ...prev, village: '' }));
      return;
    }
    const village = villages.find((v) => v.id.toString() === villageId);
    if (village) {
      setSelectedVillage(village);
      setFormData((prev) => ({ ...prev, village: village.name }));
      toast.success(`เลือกหมู่บ้าน: ${village.name}`);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      const toastId = toast.loading('กำลังระบุตำแหน่ง...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 16);

            // Add current location marker
            L.marker([latitude, longitude], {
              icon: L.divIcon({
                className: 'current-location-marker',
                html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })
            }).addTo(mapInstanceRef.current);
          }
          toast.dismiss(toastId);
          toast.success('ระบุตำแหน่งเรียบร้อย');
        },
        (error) => {
          toast.dismiss(toastId);
          toast.error('ไม่สามารถระบุตำแหน่งได้');
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error('เบราว์เซอร์ไม่รองรับ GPS');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...files]);

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removePhoto = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]); // Cleanup
      return newPreviews;
    });
  };


  const handleSubmit = async () => {
    // Validation
    if (!formData.village) {
      toast.error('กรุณาเลือกหมู่บ้าน');
      return;
    }
    if (!formData.disasterType) {
      toast.error('กรุณาเลือกประเภทภัย');
      return;
    }
    if (!drawnArea && !currentLocation) {
      toast.error('กรุณาระบุตำแหน่ง GPS หรือวาดพื้นที่บนแผนที่');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('กำลังเตรียมข้อมูล...');

    try {
      // Upload photos
      let photoUrls: string[] = [];
      if (selectedImages.length > 0) {
        try {
          photoUrls = await fieldSurveyApi.uploadImages(selectedImages);
        } catch (error) {
          console.error('Photo upload failed:', error);
          toast.error('อัปโหลดรูปภาพไม่สำเร็จ แต่จะดำเนินการต่อ');
        }
      }

      // Prepare survey data
      const surveyData = {
        taskId: taskId || undefined,
        villageId: selectedVillage?.id.toString() || '0',
        villageName: formData.village,
        disasterType: formData.disasterType === 'other' ? formData.otherDisasterType : formData.disasterType,
        severity: parseInt(formData.severity) || 3,
        estimatedHouseholds: parseInt(formData.estimatedHouseholds) || 0,
        notes: formData.description,
        gpsLocation: currentLocation || { lat: 0, lng: 0 },
        polygon: drawnArea,
        photoUrls: photoUrls,
        additionalData: {
          surveyDate: surveyDate
        }
      };

      toast.dismiss(loadingToast);
      toast.success('✅ ข้อมูลพร้อมแล้ว กรุณาตรวจสอบก่อนบันทึก');
      
      // Navigate to Review Page (NOT saving yet!)
      navigate('/survey-review', {
        state: { surveyData }
      });

    } catch (error: any) {
      console.error('Submit error:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message || 'เกิดข้อผิดพลาด');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Marker Dialog
  const handleSaveMarker = () => {
    if (!tempMarkerPosition || !markerLabel) return;

    const newMarker: MarkerPoint = {
      id: Date.now().toString(),
      lat: tempMarkerPosition.lat,
      lng: tempMarkerPosition.lng,
      label: markerLabel,
      note: markerNote,
      createdAt: new Date().toISOString()
    };

    setMarkers(prev => [...prev, newMarker]);

    // Add permanent marker to map
    if (mapInstanceRef.current) {
      L.marker([newMarker.lat, newMarker.lng], {
        icon: L.divIcon({
          className: 'custom-marker-label',
          html: `<div style="background: white; padding: 4px 8px; border-radius: 4px; border: 1px solid #333; font-weight: bold;">${newMarker.label}</div>`,
          iconSize: [100, 30],
          iconAnchor: [50, 35]
        })
      }).addTo(mapInstanceRef.current);
    }

    setShowMarkerDialog(false);
    dialogIsOpen.current = false;
    setTempMarkerPosition(null);
    setMarkerLabel('');
    setMarkerNote('');
  };

  return (
    <DashboardLayout noPadding>
      <div className="survey-area-page h-screen flex flex-col bg-gray-50">

        {/* Header */}
        <header className="bg-white shadow-sm px-4 py-3 z-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
              ←
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                {task ? `สำรวจ: ${task.title}` : 'สำรวจพื้นที่'}
              </h1>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative">

          {/* Revision Alert Banner */}
          {editMode && supervisorComments && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 m-4 shadow-sm">
              <h3 className="text-lg font-bold text-yellow-800 mb-2">⚠️ งานต้องแก้ไข</h3>
              <div className="bg-white rounded-lg p-4 mb-2 border border-yellow-200">
                <strong className="block text-sm text-gray-700 mb-1">💬 ความคิดเห็นจากผู้บังคับบัญชา:</strong>
                <p className="text-gray-600 text-sm leading-relaxed">{supervisorComments}</p>
                {task?.reviewedBy && (
                  <small className="text-xs text-gray-400 mt-2 block">แก้ไขโดย: {task.reviewedBy} | {task.reviewedAt}</small>
                )}
              </div>
              <p className="text-sm font-bold text-yellow-800">กรุณาตรวจสอบและแก้ไขข้อมูลตามที่ระบุ</p>
            </div>
          )}

          {/* Map & Form - Single Page */}
          <div className="h-full flex flex-col">
              {/* Map Container */}
              <div className="relative h-[60vh] bg-gray-200">
                <div ref={mapRef} className="w-full h-full z-0" />

                {/* Map Tools Overlay */}
                <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
                  <button
                    onClick={getCurrentLocation}
                    className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 text-blue-600"
                    title="ตำแหน่งปัจจุบัน"
                  >
                    📍
                  </button>
                </div>

                {/* Instructions Overlay */}
                {showInstructions && (
                  <MapInstructionsOverlay onClose={handleCloseInstructions} />
                )}
              </div>

              {/* Form Container */}
              <div className="flex-1 bg-white p-4 rounded-t-3xl -mt-6 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] overflow-y-auto">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

                <h2 className="text-lg font-bold mb-4">ข้อมูลการสำรวจ</h2>

                <div className="space-y-6">
                  {/* Village Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">หมู่บ้าน *</label>
                    <select
                      className="w-full p-2 border rounded-lg bg-gray-50"
                      value={selectedVillage?.id || ''}
                      onChange={(e) => handleVillageSelect(e.target.value)}
                    >
                      <option value="">-- เลือกหมู่บ้าน --</option>
                      {villages.map(v => (
                        <option key={v.id} value={v.id}>หมู่ {v.moo} - {v.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Disaster Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทภัย *</label>
                    <select
                      className="w-full p-2 border rounded-lg bg-gray-50"
                      value={formData.disasterType}
                      onChange={(e) => updateField('disasterType', e.target.value)}
                    >
                      <option value="">-- เลือกประเภทภัย --</option>
                      <option value="FLOOD">น้ำท่วม</option>
                      <option value="LANDSLIDE">ดินถล่ม</option>
                      <option value="STORM">วาตภัย</option>
                      <option value="FIRE">อัคคีภัย</option>
                      <option value="DROUGHT">ภัยแล้ง</option>
                      <option value="other">อื่นๆ</option>
                    </select>
                  </div>

                  {/* Severity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ความรุนแรง (1-5) *</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(level => (
                        <button
                          key={level}
                          onClick={() => updateField('severity', level.toString())}
                          className={`flex-1 py-2 rounded-lg border ${formData.severity === level.toString()
                            ? 'bg-red-50 border-red-500 text-red-700 font-bold shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Households */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนครัวเรือนประมาณ</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full p-2 border rounded-lg bg-gray-50"
                      value={formData.estimatedHouseholds}
                      onChange={(e) => updateField('estimatedHouseholds', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  {/* Photos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">รูปถ่ายสถานการณ์</label>
                    <div className="grid grid-cols-4 gap-2">
                      {/* Existing Photos */}
                      {existingPhotos.map((src, idx) => (
                        <div key={`existing-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-blue-200">
                          <img src={src} alt="existing" className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-blue-600/80 text-white text-[10px] px-1 text-center">
                            เดิม
                          </div>
                        </div>
                      ))}
                      {/* New Previews */}
                      {imagePreviews.map((src, idx) => (
                        <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border">
                          <img src={src} alt="preview" className="w-full h-full object-cover" />
                          <button
                            onClick={() => removePhoto(idx)}
                            className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50">
                        <span className="text-2xl">+</span>
                        <span className="text-xs">เพิ่มรูป</span>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดเพิ่มเติม</label>
                    <textarea
                      className="w-full p-2 border rounded-lg bg-gray-50"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="ระบุรายละเอียดสถานการณ์..."
                    />
                  </div>
                </div>
              </div>
            </div>

        </div>

        {/* Bottom Action Button */}
        <div className="bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:bg-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'กำลังเตรียมข้อมูล...' : 'บันทึก → ตรวจสอบ'}
          </button>
        </div>

        {/* Marker Dialog Modal */}
        {showMarkerDialog && (
          <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
              <h3 className="text-lg font-bold mb-4">📍 เพิ่มจุดสังเกต</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อจุด *</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    placeholder="เช่น จุดน้ำท่วมสูง, บ้านพัง"
                    value={markerLabel}
                    onChange={(e) => setMarkerLabel(e.target.value)}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    placeholder="รายละเอียดเพิ่มเติม..."
                    rows={2}
                    value={markerNote}
                    onChange={(e) => setMarkerNote(e.target.value)}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowMarkerDialog(false);
                      dialogIsOpen.current = false;
                      // Remove temp marker if needed
                    }}
                    className="flex-1 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleSaveMarker}
                    disabled={!markerLabel}
                    className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
