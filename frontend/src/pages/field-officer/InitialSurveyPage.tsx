import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { mockTasks } from '../../mocks/dashboardData';
import { VILLAGE_NAMES, TAMBON_INFO, VILLAGES } from '../../data/villages';
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

  const task = mockTasks.find(t => t.id === Number(taskId));

  // Form state
  const [incidentDate, setIncidentDate] = useState<Date | null>(new Date());
  const [disasterType, setDisasterType] = useState('น้ำท่วม');
  const [village, setVillage] = useState('');
  const [estimatedHouseholds, setEstimatedHouseholds] = useState('');
  const [severity, setSeverity] = useState('3');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);

  // GPS state
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // Polygon state
  const [polygonData, setPolygonData] = useState<any>(null);
  
  // Instructions modal state
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Village boundary marker
  const villageBoundaryRef = useRef<L.Circle | L.Polygon | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      // Create map centered on Tambon Wiang, Fang District
      const map = L.map('survey-map').setView([TAMBON_INFO.centerLat, TAMBON_INFO.centerLng], 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Initialize Geoman controls
      (map as any).pm.addControls({
        position: 'topleft',
        drawCircle: false,
        drawCircleMarker: false,
        drawPolyline: false,
        drawRectangle: false,
        drawMarker: false,
        drawPolygon: true,
        editMode: true,
        dragMode: false,
        cutPolygon: false,
        removalMode: true,
      });

      // Set global options to prevent auto-finish
      (map as any).pm.setGlobalOptions({
        finishOn: 'click',
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
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Also invalidate on mount
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Show village boundary when village is selected
  useEffect(() => {
    if (!mapRef.current || !village) {
      // Remove existing boundary if village is deselected
      if (villageBoundaryRef.current) {
        mapRef.current?.removeLayer(villageBoundaryRef.current);
        villageBoundaryRef.current = null;
      }
      return;
    }

    // Find selected village data
    const selectedVillage = VILLAGES.find(v => v.name === village);
    if (!selectedVillage) return;

    // Remove existing boundary
    if (villageBoundaryRef.current) {
      mapRef.current.removeLayer(villageBoundaryRef.current);
    }

    // Add boundary (polygon if available, otherwise circle)
    let boundary: L.Circle | L.Polygon;
    
    if (selectedVillage.boundary && selectedVillage.boundary.length > 0) {
      // Use actual boundary polygon
      boundary = L.polygon(selectedVillage.boundary, {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '5, 5'
      }).addTo(mapRef.current);
    } else {
      // Use approximate circle (500m radius)
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
    L.marker([selectedVillage.lat, selectedVillage.lng], {
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

    // Pan to village location
    mapRef.current.setView([selectedVillage.lat, selectedVillage.lng], 14);
  }, [village]);

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

            // Add new marker
            const marker = L.marker([lat, lng])
              .addTo(mapRef.current)
              .bindPopup('📍 ตำแหน่งปัจจุบัน')
              .openPopup();
            
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
    if (drawnItemsRef.current && mapRef.current) {
      mapRef.current.removeLayer(drawnItemsRef.current);
      drawnItemsRef.current = null;
      setPolygonData(null);
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

    // Validation
    if (!polygonData) {
      alert('⚠️ กรุณาวาดพื้นที่ที่ได้รับผลกระทบบนแผนที่');
      return;
    }

    if (!latitude || !longitude) {
      alert('⚠️ กรุณาใช้ GPS เพื่อระบุตำแหน่งปัจจุบัน');
      return;
    }

    // Prepare data
    const surveyData = {
      taskId,
      incidentDate,
      disasterType,
      village,
      estimatedHouseholds: Number(estimatedHouseholds),
      severity: Number(severity),
      notes,
      latitude,
      longitude,
      accuracy,
      polygon: polygonData,
      photoCount: photos.length,
      submittedAt: new Date().toISOString()
    };

    console.log('📋 Initial Survey Data:', surveyData);
    console.log('📷 Photos:', photos.map(p => p.name));

    // Mock API call
    alert('✅ ส่งรายงานเบื้องต้นสำเร็จ!\n\nข้อมูลที่บันทึก:\n' +
      `- พื้นที่: ${village}\n` +
      `- ครัวเรือน: ${estimatedHouseholds}\n` +
      `- ความรุนแรง: ${severity}/5\n` +
      `- รูปถ่าย: ${photos.length} รูป\n` +
      `- พิกัด: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    );

    // Navigate back
    navigate('/dashboard/officer');
  };

  if (!task) {
    return (
      <DashboardLayout>
        <div className="error-page">
          <h2>❌ ไม่พบงานนี้</h2>
          <button onClick={() => navigate('/dashboard/officer')}>กลับหน้าหลัก</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <DashboardLayout noPadding>
        <div className="initial-survey-page">
        {/* Header */}
        <div className="survey-header">
          <div>
            <h2>🔍 สำรวจเบื้องต้น</h2>
            <p className="task-title">{task.title}</p>
          </div>
          <div className="task-info">
            <span className="task-id">Task ID: {taskId}</span>
            <span className={`priority priority-${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="survey-content">
          
          {/* Left: Map */}
          <div style={{
            position: 'fixed',
            top: '70px',
            left: '240px',
            right: '380px',
            bottom: 0,
            zIndex: 1
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
            {polygonData && (
              <div className="map-info">
                ✅ วาดพื้นที่เรียบร้อย
              </div>
            )}
          </div>

          {/* Right: Form */}
          <div style={{
            position: 'fixed',
            top: '70px',
            right: 0,
            bottom: 0,
            width: '380px',
            background: 'white',
            borderLeft: '1px solid #e2e8f0',
            overflowY: 'auto',
            padding: '24px',
            zIndex: 2
          }}>
            
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
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  required
                >
                  <option value="">เลือกหมู่บ้าน</option>
                  {VILLAGE_NAMES.map((name, index) => (
                    <option key={index} value={name}>
                      {name} (หมู่ {index + 1})
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
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handlePhotoUpload}
                  className="file-input"
                />
                <p className="help-text">อัปโหลดรูปภาพรวมพื้นที่</p>
              </div>

              {/* Photo Preview */}
              {photos.length > 0 && (
                <div className="photo-preview">
                  {photos.map((photo, i) => (
                    <div key={i} className="photo-item">
                      <img src={photo.preview} alt={`Photo ${i+1}`} />
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

              <button type="submit" className="submit-btn">
                ✅ ส่งรายงานเบื้องต้น
              </button>

              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => navigate('/dashboard/officer')}
              >
                ยกเลิก
              </button>
            </form>

          </div>
        </div>
      </div>
      </DashboardLayout>
    </>
  );
}
