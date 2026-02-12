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
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Camera, AlertTriangle, ChevronRight, ChevronLeft, Save, Trash2, Navigation, Layers, CheckCircle2, Flame, CloudRain, Wind, Mountain, Sun } from 'lucide-react';
import { LoadingSpinner } from '../../components/common';

// Fix Leaflet default marker
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

  // Refs for Map Layers
  const osmLayerRef = useRef<L.TileLayer | null>(null);
  const googleHybridLayerRef = useRef<L.TileLayer | null>(null);
  const villageBoundaryLayerRef = useRef<L.Polygon | null>(null);

  // Stepper State
  const [step, setStep] = useState(1);

  // Form State
  const [incidentDate, setIncidentDate] = useState<Date | null>(new Date());
  const [disasterType, setDisasterType] = useState('');
  const [disasterTypeOther, setDisasterTypeOther] = useState('');
  const [village, setVillage] = useState('');
  const [estimatedHouseholds, setEstimatedHouseholds] = useState('');
  const [severity, setSeverity] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);

  // Data & UI State
  const [villages, setVillages] = useState<LeafletVillage[]>([]);
  const [isLoadingVillages, setIsLoadingVillages] = useState(true);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [polygonData, setPolygonData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<L.Layer | null>(null);
  const [showMarkerModal, setShowMarkerModal] = useState(false);
  const [markerLabel, setMarkerLabel] = useState('');

  // Fetch Villages
  useEffect(() => {
    const fetchVillages = async () => {
      try {
        setIsLoadingVillages(true);
        const data = await villagesApi.getAllForMap();
        setVillages(data);
      } catch (error) {
        toast.error('ไม่สามารถโหลดข้อมูลหมู่บ้านได้');
        setVillages([]);
      } finally {
        setIsLoadingVillages(false);
      }
    };
    fetchVillages();
  }, []);

  // Update villageRef for event listeners
  useEffect(() => {
    villageRef.current = village;
  }, [village]);

  // MAP INITIALIZATION (Only when step === 2)
  useEffect(() => {
    if (step !== 2) return;

    // Give time for DOM to render
    const timer = setTimeout(() => {
      if (!document.getElementById('survey-map')) return;
      if (mapRef.current) return; // Already initialized

      const map = L.map('survey-map', {
        zoomControl: false // Custom controls
      }).setView(latitude && longitude ? [latitude, longitude] : [19.9169, 99.2145], latitude && longitude ? 15 : 13);

      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);
      osmLayerRef.current = osmLayer;

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;

      // Add Marker if exists
      if (latitude && longitude) {
        const marker = L.marker([latitude, longitude], { draggable: true }).addTo(map);
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          setLatitude(pos.lat);
          setLongitude(pos.lng);
        });
        currentMarkerRef.current = marker;
      }

      // Add Geoman
      map.pm.setGlobalOptions({ layerGroup: drawnItems });
      map.pm.addControls({
        position: 'topright',
        drawMarker: true,
        drawCircle: false,
        drawCircleMarker: false,
        drawPolyline: false,
        drawRectangle: true,
        drawPolygon: true,
        editMode: true,
        dragMode: true,
        cutPolygon: false,
        removalMode: true,
        rotateMode: false,
      });

      // Event Listeners
      map.on('pm:create', (e: any) => {
        const layer = e.layer;
        const shape = e.shape;

        if (shape === 'Marker') {
          // Remove previous marker if exists (Single point mode preferred for simple mobile)
          if (currentMarkerRef.current) {
            map.removeLayer(currentMarkerRef.current);
          }
          currentMarkerRef.current = layer;
          const pos = layer.getLatLng();
          setLatitude(pos.lat);
          setLongitude(pos.lng);
          setAccuracy(5);
          toast.success('ปักหมุดตำแหน่งแล้ว');
        } else {
          if (drawnItemsRef.current) {
            // Collect polygons
            const geoJson = (drawnItemsRef.current.toGeoJSON() as any);
            setPolygonData(geoJson.features);
            toast.success('วาดพื้นที่สำเร็จ');
          }
        }
      });

      map.on('pm:remove', () => {
        if (drawnItemsRef.current && drawnItemsRef.current.getLayers().length === 0) {
          setPolygonData(null);
        }
      });

      mapRef.current = map;

      // Restore polygon if exists
      if (polygonData && drawnItemsRef.current) {
        L.geoJSON(polygonData).eachLayer((layer: any) => {
          drawnItemsRef.current?.addLayer(layer);
        });
      }

    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [step]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return toast.error('Browser does not support GPS');

    toast.loading('กำลังระบุตำแหน่ง...', { id: 'gps-locating' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
        setLatitude(lat);
        setLongitude(lng);
        setAccuracy(acc);

        toast.dismiss('gps-locating');
        toast.success(`พบตำแหน่ง (แม่นยำ ±${Math.round(acc)}m)`);

        if (mapRef.current) {
          mapRef.current.flyTo([lat, lng], 16);
          if (currentMarkerRef.current) mapRef.current.removeLayer(currentMarkerRef.current);

          const marker = L.marker([lat, lng], { draggable: true }).addTo(mapRef.current);
          currentMarkerRef.current = marker;

          marker.on('dragend', () => {
            const p = marker.getLatLng();
            setLatitude(p.lat);
            setLongitude(p.lng);
          });
        }
      },
      (err) => {
        toast.dismiss('gps-locating');
        toast.error('ไม่สามารถระบุตำแหน่งได้: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPhotos = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name
      }));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const mapDisasterTypeToEnum = (thai: string) => {
    const map: any = { 'น้ำท่วม': 'FLOOD', 'ไฟป่า': 'FIRE', 'ดินถล่ม': 'LANDSLIDE', 'วาตภัย': 'STORM', 'แผ่นดินไหว': 'EARTHQUAKE', 'ภัยแล้ง': 'DROUGHT' };
    return map[thai] || 'OTHER';
  };

  const handleSubmit = async () => {
    // Validate
    if (!incidentDate || !disasterType || !severity || !estimatedHouseholds || !latitude || !longitude) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload Photos
      let photoUrls: string[] = [];
      if (photos.length > 0) {
        const files = photos.map(p => p.file);
        photoUrls = await fieldSurveyApi.uploadImages(files);
      }

      const submission = {
        villageId: '',
        villageName: village, // Simplified: use string if not matched
        disasterType: mapDisasterTypeToEnum(disasterType),
        severity: Number(severity),
        estimatedHouseholds: Number(estimatedHouseholds),
        notes: notes,
        gpsLocation: { lat: latitude!, lng: longitude! },
        polygon: polygonData,
        photoUrls,
        additionalData: {
          incidentDate: incidentDate.toISOString(),
          disasterTypeThai: disasterType,
          disasterTypeOther
        }
      };

      // Find village ID if possible
      const matchedVillage = villages.find(v => `หมู่ ${v.moo} ${v.name}` === village);
      if (matchedVillage) submission.villageId = matchedVillage.id.toString();

      // Navigate to review (Using same flow as before, but simplified)
      // For now, let's direct submit? No, the original used review page.
      navigate('/survey-review', {
        state: {
          surveyData: submission,
          isNewIncident: true
        }
      });

    } catch (err) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาด');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ paddingBottom: '100px', fontFamily: "'Sarabun', sans-serif" }}>

        {/* --- HEADER --- */}
        <div style={{ background: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 10 }}>
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard/officer')} style={{ background: 'none', border: 'none' }}>
            <ChevronLeft size={24} color="#334155" />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>รายงานเหตุการณ์</h1>
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', background: s <= step ? '#2563eb' : '#e2e8f0' }} />
              ))}
            </div>
          </div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#2563eb' }}>{step}/3</div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div style={{ padding: '20px' }}>
          <AnimatePresence mode="wait">

            {/* STEP 1: TYPE & SEVERITY */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>เกิดเหตุอะไรขึ้น?</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { label: 'น้ำท่วม', icon: CloudRain, color: '#3b82f6' },
                    { label: 'ไฟป่า', icon: Flame, color: '#f97316' },
                    { label: 'ดินถล่ม', icon: Mountain, color: '#8b5cf6' },
                    { label: 'วาตภัย', icon: Wind, color: '#06b6d4' },
                    { label: 'ภัยแล้ง', icon: Sun, color: '#eab308' },
                    { label: 'อื่นๆ', icon: AlertTriangle, color: '#64748b' },
                  ].map(item => (
                    <div
                      key={item.label}
                      onClick={() => setDisasterType(item.label)}
                      style={{
                        background: disasterType === item.label ? item.color : 'white',
                        color: disasterType === item.label ? 'white' : '#64748b',
                        border: `1px solid ${disasterType === item.label ? item.color : '#e2e8f0'}`,
                        borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                        cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition: 'all 0.2s'
                      }}
                    >
                      <item.icon size={32} />
                      <span style={{ fontWeight: '700' }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                {disasterType === 'อื่นๆ' && (
                  <input
                    type="text" placeholder="โปรดระบุ..." value={disasterTypeOther} onChange={e => setDisasterTypeOther(e.target.value)}
                    style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '16px', marginBottom: '24px' }}
                  />
                )}

                <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>ความรุนแรงระดับไหน?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(lvl => (
                    <div
                      key={lvl}
                      onClick={() => setSeverity(lvl.toString())}
                      style={{
                        height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px', fontWeight: '800', cursor: 'pointer',
                        background: severity === lvl.toString()
                          ? (lvl >= 4 ? '#ef4444' : lvl === 3 ? '#f97316' : '#22c55e')
                          : '#f1f5f9',
                        color: severity === lvl.toString() ? 'white' : '#94a3b8'
                      }}
                    >
                      {lvl}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                  <span>เล็กน้อย</span>
                  <span>ปานกลาง</span>
                  <span>วิกฤต</span>
                </div>
              </motion.div>
            )}

            {/* STEP 2: LOCATION */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ height: 'calc(100vh - 240px)', borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <div id="survey-map" style={{ width: '100%', height: '100%', zIndex: 1 }} />

                  {/* Controls */}
                  <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={getCurrentLocation} style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                      <Navigation size={24} />
                    </motion.button>
                  </div>

                  {/* Status Pill */}
                  <div style={{ position: 'absolute', top: 16, left: 50 + '%', transform: 'translateX(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', color: '#1e293b', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backdropFilter: 'blur(4px)', display: 'flex', gap: '6px', whiteSpace: 'nowrap' }}>
                    {latitude ? <><CheckCircle2 size={16} color="#10b981" /> ปักหมุดแล้ว</> : 'แตะเพื่อปักหมุด'}
                  </div>
                </div>
                <div style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>พิกัดที่เลือก:</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                    {latitude ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` : '- ยังไม่ได้ระบุ -'}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: DETAILS */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px', display: 'block' }}>หมู่บ้าน</label>
                    <select
                      value={village} onChange={e => setVillage(e.target.value)}
                      style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #cbd5e1', fontSize: '16px', background: 'white' }}
                    >
                      <option value="">-- เลือกหมู่บ้าน --</option>
                      {villages.map(v => (
                        <option key={v.id} value={`หมู่ ${v.moo} ${v.name}`}>หมู่ {v.moo} {v.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px', display: 'block' }}>วันที่เกิดเหตุ</label>
                    <ThaiDatePicker value={incidentDate} onChange={setIncidentDate} />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px', display: 'block' }}>ครัวเรือนที่ได้รับผลกระทบ</label>
                    <input
                      type="number" value={estimatedHouseholds} onChange={e => setEstimatedHouseholds(e.target.value)} placeholder="0"
                      style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #cbd5e1', fontSize: '16px' }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '8px', display: 'block' }}>รายละเอียดเพิ่มเติม</label>
                    <textarea
                      rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="รายละเอียดเหตุการณ์..."
                      style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #cbd5e1', fontSize: '16px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '12px', display: 'block' }}>รูปถ่ายหน้างาน</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      <label style={{
                        aspectRatio: '1/1', borderRadius: '12px', border: '2px dashed #cbd5e1', background: '#f8fafc',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b'
                      }}>
                        <Camera size={24} />
                        <span style={{ fontSize: '10px', marginTop: '4px' }}>เพิ่มรูป</span>
                        <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                      </label>
                      {photos.map((p, i) => (
                        <div key={i} style={{ aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                          <img src={p.preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '4px', color: 'white' }}>
                            <Trash2 size={12} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* --- BOTTOM ACTIONS --- */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', padding: '16px 20px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)', zIndex: 100 }}>
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? (!disasterType || !severity) : (!latitude)}
              style={{
                width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                background: (step === 1 ? (!disasterType || !severity) : (!latitude)) ? '#e2e8f0' : '#2563eb',
                color: (step === 1 ? (!disasterType || !severity) : (!latitude)) ? '#94a3b8' : 'white',
                fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
              }}
            >
              ไปต่อ <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                background: '#10b981', color: 'white',
                fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
              }}
            >
              {isSubmitting ? <LoadingSpinner size="sm" color="white" /> : <><Save size={20} /> ยืนยันการแจ้งเหตุ</>}
            </button>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
