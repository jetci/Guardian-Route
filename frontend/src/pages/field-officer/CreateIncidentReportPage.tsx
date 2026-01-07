import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { incidentService } from '../../services/incidentService';
import ThaiDatePicker from '../../components/ThaiDatePicker';
import { validateIncidentForm, hasValidationErrors, getFirstError, type IncidentValidationErrors } from '../../validation/incident-validation';
import { VILLAGES } from '../../data/villages';
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
  const villageRef = useRef<string>('');

  // Form state
  const [incidentDate, setIncidentDate] = useState<Date | null>(new Date());
  const [disasterType, setDisasterType] = useState('');
  const [village, setVillage] = useState('');
  const [estimatedHouseholds, setEstimatedHouseholds] = useState('');
  const [severity, setSeverity] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);

  // GPS state
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // Polygon state
  const [polygonData, setPolygonData] = useState<any>(null);

  // Validation errors state
  const [errors, setErrors] = useState<IncidentValidationErrors>({});

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const saveDraft = () => {
      const draft = {
        incidentDate: incidentDate?.toISOString(),
        disasterType,
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
      toast.success('💾 บันทึกแบบร่างอัตโนมัติ', {
        duration: 2000,
        icon: '💾'
      });
    };

    // Save every 30 seconds
    const interval = setInterval(saveDraft, 30000);

    return () => clearInterval(interval);
  }, [incidentDate, disasterType, village, severity, estimatedHouseholds, notes, latitude, longitude, polygonData]);

  // Sync village state to ref for event listeners
  useEffect(() => {
    villageRef.current = village;
  }, [village]);

  // Load draft on mount
  useEffect(() => {
    const draftStr = localStorage.getItem('incident-draft');
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);

        // Check if draft is not too old (24 hours)
        const age = Date.now() - draft.timestamp;
        if (age > 24 * 60 * 60 * 1000) {
          localStorage.removeItem('incident-draft');
          return;
        }

        // Ask user if they want to restore
        const restore = window.confirm(
          'พบแบบร่างที่บันทึกไว้\n' +
          `บันทึกเมื่อ: ${new Date(draft.timestamp).toLocaleString('th-TH')}\n\n` +
          'ต้องการกู้คืนหรือไม่?'
        );

        if (restore) {
          setIncidentDate(draft.incidentDate ? new Date(draft.incidentDate) : null);
          setDisasterType(draft.disasterType || 'น้ำท่วม');
          setVillage(draft.village || '');
          setSeverity(draft.severity || '3');
          setEstimatedHouseholds(draft.estimatedHouseholds || '');
          setNotes(draft.notes || '');
          setLatitude(draft.latitude);
          setLongitude(draft.longitude);
          setPolygonData(draft.polygonData);

          toast.success('✅ กู้คืนแบบร่างสำเร็จ');
        } else {
          localStorage.removeItem('incident-draft');
        }
      } catch (e) {
        console.error('Failed to load draft:', e);
        localStorage.removeItem('incident-draft');
      }
    }
  }, []);

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

      // ✅ Add Leaflet-Geoman controls (modern drawing tools)
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
        cutPolygon: false,
        removalMode: true,
        rotateMode: false,
      });

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

      // ✅ Event: pm:create - FOR POLYGON/RECTANGLE ONLY
      map.on('pm:create', (e: any) => {
        const layer = e.layer;
        const shape = e.shape;

        console.log('✅ pm:create fired:', shape);

        // ✅ CRITICAL: Skip Marker
        if (shape === 'Marker') {
          console.log('ℹ️ Marker detected in pm:create - processing');
          drawnItems.addLayer(layer);
          return;
        }

        // ✅ Process Polygon/Rectangle here
        if (shape === 'Polygon' || shape === 'Rectangle') {
          console.log(`🔷 Processing ${shape} in pm:create`);

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

          console.log(`✅ Valid ${shape}:`, points.length, 'points');

          // Convert to GeoJSON
          const geojson = (layer as any).toGeoJSON();
          setPolygonData(geojson);

          toast.success(`✅ วาด${shape === 'Polygon' ? 'รูปหลายเหลี่ยม' : 'สี่เหลี่ยม'}สำเร็จ (${points.length} จุด)`, {
            icon: '🎉'
          });

          console.log(`✅ ${shape} drawn successfully`);
        }
      });

      // ✅ Handle shape edited (Geoman)
      map.on('pm:edit', (e: any) => {
        console.log('✏️ pm:edit event triggered');
        const layer = e.layer;
        if (layer) {
          const geoJSON = layer.toGeoJSON();
          setPolygonData(geoJSON);
          toast.success('✏️ แก้ไขพื้นที่สำเร็จ');
        }
      });

      // ✅ Handle shape deleted (Geoman)
      map.on('pm:remove', () => {
        console.log('🗑️ pm:remove event triggered');
        setPolygonData(null);
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
            if (currentMarkerRef.current) {
              mapRef.current.removeLayer(currentMarkerRef.current);
            }

            // Add marker with accuracy circle
            const marker = L.marker([lat, lng], { draggable: true })
              .addTo(mapRef.current)
              .bindPopup(
                `📍 ตำแหน่งปัจจุบัน<br>` +
                `<small>ความแม่นยำ: ±${Math.round(acc)}m</small><br>` +
                `<small>ลากย้ายเพื่อปรับตำแหน่ง</small>`
              )
              .openPopup();

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

    // Comprehensive validation
    const validationErrors = validateIncidentForm({
      village,
      disasterType,
      severity,
      estimatedHouseholds,
      notes,
      latitude,
      longitude,
      polygonData,
      incidentDate
    });

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      const firstError = getFirstError(validationErrors);
      toast.error(`⚠️ ${firstError}`, { duration: 4000 });
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
          lat: latitude!,  // Safe: validated above
          lng: longitude!, // Safe: validated above
          address: village
        },
        affectedArea: polygonData,
        photos: photos.map(p => p.name)
      };

      await incidentService.create(payload);

      // Clear draft on success
      localStorage.removeItem('incident-draft');

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
                  <option value="">-- เลือกประเภทภัย --</option>
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
                  <option value="">-- เลือกหมู่บ้าน --</option>
                  {VILLAGES.map((v) => (
                    <option key={v.id} value={`หมู่ ${v.moo} ${v.name}`}>
                      หมู่ {v.moo} - {v.name}
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
                  <option value="">-- เลือกความรุนแรง --</option>
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
                  id="camera-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('camera-input') as HTMLInputElement;
                      if (input) input.click();
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '600'
                    }}
                  >
                    📷 ถ่ายรูป
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('file-input') as HTMLInputElement;
                      if (input) input.click();
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#48bb78',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '600'
                    }}
                  >
                    📁 เลือกไฟล์
                  </button>
                </div>
                <p className="help-text" style={{ marginTop: '8px', fontSize: '13px', color: '#718096' }}>
                  รองรับไฟล์ภาพทุกประเภท
                </p>
              </div>

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
