import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { incidentService } from '../../services/incidentService';
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

export function CreateIncidentReportPage() {
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const currentMarkerRef = useRef<L.Marker | null>(null);

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

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('survey-map').setView([19.9422, 99.2195], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;

      const drawControl = new L.Control.Draw({
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            drawError: {
              color: '#e74c3c',
              timeout: 1000
            },
            shapeOptions: {
              color: '#667eea',
              weight: 3,
              fillOpacity: 0.2
            },
            repeatMode: false
          },
          polyline: false,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false
        },
        edit: {
          featureGroup: drawnItems,
          remove: true
        }
      });
      map.addControl(drawControl);

      map.on(L.Draw.Event.CREATED, (e: any) => {
        const layer = e.layer;
        drawnItems.addLayer(layer);
        const geoJSON = layer.toGeoJSON();
        setPolygonData(geoJSON);
      });

      map.on(L.Draw.Event.EDITED, (e: any) => {
        const layers = e.layers;
        layers.eachLayer((layer: any) => {
          const geoJSON = layer.toGeoJSON();
          setPolygonData(geoJSON);
        });
      });

      map.on(L.Draw.Event.DELETED, () => {
        setPolygonData(null);
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

          if (mapRef.current) {
            if (currentMarkerRef.current) {
              mapRef.current.removeLayer(currentMarkerRef.current);
            }

            const marker = L.marker([lat, lng])
              .addTo(mapRef.current)
              .bindPopup('📍 ตำแหน่งปัจจุบัน')
              .openPopup();
            
            currentMarkerRef.current = marker;
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
    if (drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers();
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
      URL.revokeObjectURL(prev[index].preview);
      return updated;
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!polygonData) {
      toast.error('⚠️ กรุณาวาดพื้นที่ที่ได้รับผลกระทบบนแผนที่');
      return;
    }

    if (!latitude || !longitude) {
      toast.error('⚠️ กรุณาใช้ GPS เพื่อระบุตำแหน่งปัจจุบัน');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: `${disasterType} - ${village}`,
        description: notes || `เหตุการณ์${disasterType}ที่${village}`,
        type: disasterType,
        severity: severity === '5' ? 'CRITICAL' : severity === '4' ? 'HIGH' : severity === '3' ? 'MEDIUM' : 'LOW',
        location: {
          lat: latitude,
          lng: longitude,
          address: village
        },
        affectedArea: polygonData,
        photos: photos.map(p => p.name)
      };

      await incidentService.create(payload);
      
      toast.success('✅ รายงานเหตุการณ์ใหม่สำเร็จ!\nรายงานจะถูกส่งไปยังผู้บังคับบัญชา');
      navigate('/dashboard/officer');
    } catch (error) {
      console.error('Error creating incident:', error);
      toast.error('❌ ไม่สามารถส่งรายงานได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
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
            onClick={() => navigate('/dashboard/officer')}
          >
            ✕ ยกเลิก
          </button>
        </div>

        <div className="survey-content">
          
          <div className="map-section">
            <div id="survey-map"></div>
            
            <div className="map-controls">
              <button className="map-btn" onClick={getCurrentLocation} title="ระบุตำแหน่งปัจจุบัน">
                📍 Get Location
              </button>
              <button className="map-btn" onClick={clearPolygon} title="ลบพื้นที่ที่วาด">
                🗑️ Clear Area
              </button>
            </div>

            {polygonData && (
              <div className="map-info">
                ✅ วาดพื้นที่เรียบร้อย
              </div>
            )}
          </div>

          <div className="form-section">
            
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
                <input 
                  type="text" 
                  placeholder="เช่น บ้านหนองบัว หมู่ 3 ต.เวียง"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  required 
                />
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

              <div className="form-group">
                <label>รูปถ่าย</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handlePhotoUpload}
                  className="file-input"
                />
                <p className="help-text">อัปโหลดรูปภาพเหตุการณ์</p>
              </div>

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
                ✅ ส่งรายงานเหตุการณ์
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
  );
}
