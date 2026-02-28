import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { fieldSurveyApi } from '../../api/fieldSurvey';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Swal from 'sweetalert2';
import { villagesApi, type LeafletVillage } from '../../api/villages';
import { incidentService } from '../../services/incidentService';
import './SurveyReviewPage.css';

interface SurveyFormData {
  taskId?: string;
  villageId: string;
  villageName: string;
  disasterType: string;
  severity: number;
  estimatedHouseholds: number;
  notes: string;
  gpsLocation: {
    lat: number;
    lng: number;
  };
  polygon: any;
  photoUrls: string[];
  additionalData?: {
    injured?: number;
    deaths?: number;
    estimatedDamage?: number;
    incidentDate?: string;
    accuracy?: number;
    locationName?: string;
    surveyDate?: string;
    deviceGps?: {
      lat: number;
      lng: number;
    };
    markers?: Array<{
      lat: number;
      lng: number;
      label: string;
    }>;
  };
}

export default function SurveyReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const surveyData = location.state?.surveyData as SurveyFormData;
  const [isSaving, setIsSaving] = useState(false);
  const [villages, setVillages] = useState<LeafletVillage[]>([]);
  const mapRef = useRef<L.Map | null>(null);

  // Fetch villages to draw boundary
  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const data = await villagesApi.getAllForMap();
        setVillages(data);
      } catch (error) {
        console.error('Failed to fetch villages:', error);
      }
    };
    fetchVillages();
  }, []);

  useEffect(() => {
    // Safety checks
    if (!surveyData) return;
    if (mapRef.current) return; // Already initialized

    const mapContainer = document.getElementById('mini-map');
    if (!mapContainer) {
      console.warn('Map container not found in DOM');
      return;
    }

    try {
      const map = L.map('mini-map', {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true
      }).setView([surveyData.gpsLocation.lat, surveyData.gpsLocation.lng], 15);

      // Use Google Hybrid if village is selected, else OSM
      if (surveyData.villageName) {
        L.tileLayer('http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          attribution: '© Google Maps'
        }).addTo(map);
      } else {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
      }

      const drawnItems = new L.FeatureGroup().addTo(map);

      // Add Village Boundary if available
      const selectedVillage = villages.find(v => v.name === surveyData.villageName || `หมู่ ${v.moo} ${v.name}` === surveyData.villageName);
      if (selectedVillage && selectedVillage.boundary && selectedVillage.boundary.length > 0) {
        L.polygon(selectedVillage.boundary, {
          color: '#F59E0B',
          weight: 2,
          fillColor: '#F59E0B',
          fillOpacity: 0.1,
          dashArray: '5, 5',
          interactive: false
        }).addTo(map);
      }

      // Add Village Center Marker
      L.marker([surveyData.gpsLocation.lat, surveyData.gpsLocation.lng], {
        icon: L.divIcon({
          className: 'village-center-icon',
          html: '🏠',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      }).addTo(map).bindTooltip('จุดศูนย์กลางหมู่บ้าน', { permanent: false, direction: 'top' });

      // Add Multi-point Markers
      if (surveyData.additionalData?.markers) {
        surveyData.additionalData.markers.forEach((m, i) => {
          const markerNumber = i + 1;
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

          L.marker([m.lat, m.lng], { icon })
            .addTo(drawnItems)
            .bindPopup(`
              <div style="text-align: center;">
                <strong>จุดที่ ${markerNumber}</strong><br>
                ${m.label || '📍 ตำแหน่ง'}<br>
                <small style="color: #666;">${m.lat.toFixed(6)}, ${m.lng.toFixed(6)}</small>
              </div>
            `);
        });
      }

      // Add Polygon
      if (surveyData.polygon) {
        L.geoJSON(surveyData.polygon, {
          style: {
            color: '#3b82f6',
            weight: 3,
            opacity: 0.6,
            fillColor: '#3b82f6',
            fillOpacity: 0.2
          }
        }).addTo(drawnItems);
      }

      // Don't use fitBounds - it causes issues with React Strict Mode
      // The initial setView with zoom 15 is sufficient for review

      mapRef.current = map;
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (error) {
          console.warn('Error removing map:', error);
        }
        mapRef.current = null;
      }
    };
  }, [surveyData, villages]);

  if (!surveyData) {
    navigate('/dashboard/officer');
    return null;
  }

  const getDisasterTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'น้ำท่วม': '🌊 น้ำท่วม',
      'ดินถลม': '⛰️ ดินถลม',
      'วาตภัย': '🌪️ วาตภัย',
      'อัคคีภัย': '🔥 อัคคีภัย',
      'แผ่นดินไหว': '🌍 แผ่นดินไหว',
      'ภัยแล้ง': '☀️ ภัยแล้ง',
      'ไฟป่า': '🔥 ไฟป่า',
      'อื่นๆ': '❓ อื่นๆ',
    };
    return labels[type] || type;
  };

  const getSeverityColor = (severity: number): string => {
    if (severity >= 5) return '#7f1d1d'; // Critical
    if (severity >= 4) return '#ef4444'; // High
    if (severity >= 3) return '#f59e0b'; // Medium
    return '#10b981'; // Low
  };

  const getSeverityLabel = (severity: number): string => {
    const labels = ['', 'เล็กน้อย', 'ปานกลาง', 'รุนแรง', 'รุนแรงมาก', 'วิกฤต'];
    return labels[severity] || '';
  };

  const handleSave = async () => {
    const isNewIncident = location.state?.isNewIncident;

    const result = await Swal.fire({
      title: 'ยืนยันการบันทึกข้อมูล?',
      text: "คุณตรวจสอบข้อมูลความถูกต้องเรียบร้อยแล้วใช่หรือไม่?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'ใช่, บันทึกข้อมูล',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    setIsSaving(true);
    try {
      if (isNewIncident) {
        // Handle New Incident Report
        const markers = surveyData.additionalData?.markers || [];
        let markerDescription = '';
        if (markers.length > 1) {
          markerDescription = `\n\n[พิกัดจุดเกิดเหตุทั้งหมด (${markers.length} จุด)]\n` +
            markers.map((m: any, i: number) => `${i + 1}. ${m.lat.toFixed(6)}, ${m.lng.toFixed(6)}`).join('\n');
        }

        // Find village UUID from name
        const selectedVillage = villages.find(v =>
          v.name === surveyData.villageName ||
          `หมู่ ${v.moo} ${v.name}` === surveyData.villageName
        );

        console.log('🔍 Selected village:', selectedVillage);
        console.log('📋 Survey data:', surveyData);

        const payload: any = {
          title: `${surveyData.disasterType} - ${surveyData.villageName}`,
          description: surveyData.notes + markerDescription,
          disasterType: surveyData.disasterType, // Already in English enum format (FLOOD, FIRE, etc.)
          severity: surveyData.severity, // Keep as number 1-5
          location: {
            type: 'Point' as const,
            coordinates: [surveyData.gpsLocation.lng, surveyData.gpsLocation.lat] // GeoJSON format: [longitude, latitude]
          },
          address: surveyData.villageName,
        };

        // Add villageId if found
        if (selectedVillage?.id) {
          payload.villageId = selectedVillage.id;
          console.log('✅ Village ID added:', selectedVillage.id);
        } else {
          console.warn('⚠️ Village not found in list, villageId will be omitted');
        }

        // Add affectedArea - ONLY include Polygon, not markers
        // Markers are already in description
        if (surveyData.polygon && surveyData.polygon.features) {
          // Filter only Polygon features
          const polygonFeatures = surveyData.polygon.features.filter(
            (f: any) => f.geometry?.type === 'Polygon'
          );

          if (polygonFeatures.length > 0) {
            payload.affectedArea = {
              type: "FeatureCollection",
              features: polygonFeatures
            };
            console.log('✅ Affected area added:', polygonFeatures.length, 'polygons');
          }
        }

        // Validate payload before sending
        console.log('📦 Final payload:', JSON.stringify(payload, null, 2));
        
        // Validate required fields
        if (!payload.title || !payload.disasterType || !payload.severity || !payload.location) {
          throw new Error('Missing required fields in payload');
        }

        // Validate disasterType enum
        const validDisasterTypes = ['FLOOD', 'LANDSLIDE', 'FIRE', 'STORM', 'EARTHQUAKE', 'DROUGHT', 'OTHER'];
        if (!validDisasterTypes.includes(payload.disasterType)) {
          throw new Error(`Invalid disasterType: ${payload.disasterType}. Must be one of: ${validDisasterTypes.join(', ')}`);
        }

        // Validate severity range
        if (payload.severity < 1 || payload.severity > 5) {
          throw new Error(`Invalid severity: ${payload.severity}. Must be between 1 and 5`);
        }

        // Validate location coordinates
        if (!Array.isArray(payload.location.coordinates) || payload.location.coordinates.length !== 2) {
          throw new Error('Invalid location coordinates');
        }

        console.log('✅ Payload validation passed, sending to backend...');

        await incidentService.create(payload);

        await Swal.fire({
          title: 'บันทึกสำเร็จ!',
          text: 'รายงานเหตุการณ์ใหม่ถูกส่งไปยังผู้บังคับบัญชาแล้ว',
          icon: 'success',
          confirmButtonColor: '#10b981'
        });

        navigate('/report-history');
      } else {
        // Handle Regular Survey Task
        const response = await fieldSurveyApi.submitSurvey(surveyData);

        await Swal.fire({
          title: 'บันทึกสำเร็จ!',
          text: 'ข้อมูลการสำรวจของคุณถูกบันทึกเข้าระบบแล้ว',
          icon: 'success',
          confirmButtonColor: '#10b981'
        });

        navigate('/survey-success', {
          state: { surveyData: response }
        });
      }
    } catch (error: any) {
      console.error('❌ Error saving data:', error);
      console.error('📋 Error response:', error.response?.data);
      console.error('📦 Error config:', error.config);
      console.error('🔴 Full error object:', JSON.stringify(error, null, 2));

      // Extract detailed error messages
      let errorMessage = 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
      let errorDetails = '';

      if (error.response?.status === 500) {
        errorMessage = 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ (500)';
        errorDetails = 'กรุณาตรวจสอบ Console Log และรายงานให้ผู้ดูแลระบบทราบ';
        
        // Try to extract backend error details
        if (error.response?.data?.message) {
          errorDetails += '\n\nรายละเอียด: ' + (
            Array.isArray(error.response.data.message)
              ? error.response.data.message.join(', ')
              : error.response.data.message
          );
        }
      } else if (error.response?.data?.message) {
        const messages = Array.isArray(error.response.data.message)
          ? error.response.data.message
          : [error.response.data.message];

        console.error('🔴 Validation errors:', messages);

        // Format error messages for display
        if (messages.length > 0) {
          errorMessage = messages.join('\n');
        }
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        html: `
          <div style="text-align: left; white-space: pre-line; font-size: 0.95rem;">
            <strong>${errorMessage}</strong>
            ${errorDetails ? `<div style="margin-top: 12px; color: #666;">${errorDetails}</div>` : ''}
            ${error.response?.status ? `<div style="margin-top: 12px; color: #999; font-size: 0.85rem;">Status Code: ${error.response.status}</div>` : ''}
          </div>
        `,
        icon: 'error',
        confirmButtonColor: '#ef4444',
        width: '600px',
        footer: '<span style="color: #999;">กรุณาเปิด Console (F12) เพื่อดูรายละเอียดเพิ่มเติม</span>'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    const isNewIncident = location.state?.isNewIncident;

    if (isNewIncident) {
      navigate('/create-incident', {
        state: { editData: surveyData }
      });
    } else if (surveyData.taskId) {
      navigate(`/field-survey/${surveyData.taskId}`, {
        state: { editData: surveyData }
      });
    } else {
      navigate('/field-survey/new', {
        state: { editData: surveyData }
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="survey-review-page">
        {/* Header */}
        <div className="review-header">
          <div className="header-icon">📋</div>
          <h1>ตรวจทานข้อมูลการสำรวจ</h1>
          <p className="header-subtitle">
            กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนบันทึกเข้าระบบ
          </p>
        </div>

        <div className="review-grid">
          {/* Left Column: Map & Markers */}
          <div className="review-left">
            <div className="review-card map-card">
              <div className="card-header-premium">
                <span className="icon">🗺️</span>
                <h3>แผนที่และพิกัด</h3>
              </div>
              <div id="mini-map" className="mini-map-container"></div>

              <div className="marker-details-list">
                <h4>📍 รายละเอียดจุดที่ปักหมุด ({surveyData.additionalData?.markers?.length || 0} จุด)</h4>
                {surveyData.additionalData?.markers && surveyData.additionalData.markers.length > 0 ? (
                  <div className="markers-scroll">
                    {surveyData.additionalData.markers.map((m, i) => {
                      // Clean label: remove "จุดที่ X:" and trailing colons/whitespace
                      const cleanLabel = typeof m.label === 'string'
                        ? m.label.replace(/^จุดที่ \d+[:\s]*/, '').trim()
                        : '📍 ตำแหน่ง';

                      return (
                        <div key={i} className="marker-item-detail">
                          <div className="marker-number">{i + 1}</div>
                          <div className="marker-info">
                            <div className="marker-label">{cleanLabel || '📍 ตำแหน่ง'}</div>
                            <div className="marker-coords">{m.lat.toFixed(6)}, {m.lng.toFixed(6)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="no-data">ไม่มีการปักหมุดพิกัดเพิ่มเติม</p>
                )}
              </div>
            </div>

            {surveyData.photoUrls && surveyData.photoUrls.length > 0 && (
              <div className="review-card photo-card">
                <div className="card-header-premium">
                  <span className="icon">📷</span>
                  <h3>รูปถ่ายประกอบ ({surveyData.photoUrls.length})</h3>
                </div>
                <div className="photo-grid-premium">
                  {surveyData.photoUrls.map((url, index) => (
                    <div key={index} className="photo-item-premium">
                      <img src={url} alt={`Survey ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Form Data */}
          <div className="review-right">
            <div className="review-card data-card">
              <div className="card-header-premium">
                <span className="icon">🏘️</span>
                <h3>ข้อมูลพื้นที่</h3>
              </div>
              <div className="data-list">
                <div className="data-item">
                  <span className="label">🏘️ หมู่บ้าน</span>
                  <span className="value highlight">{surveyData.villageName}</span>
                </div>
                <div className="data-item">
                  <span className="label">📍 พิกัดศูนย์กลางหมู่บ้าน</span>
                  <span className="value">{surveyData.gpsLocation.lat.toFixed(6)}, {surveyData.gpsLocation.lng.toFixed(6)}</span>
                </div>
                {surveyData.additionalData?.incidentDate && (
                  <div className="data-item">
                    <span className="label">📅 วันที่เกิดเหตุ</span>
                    <span className="value">
                      {new Date(surveyData.additionalData.incidentDate).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                {surveyData.additionalData?.locationName && (
                  <div className="data-item">
                    <span className="label">🏢 ชื่อตำแหน่ง/สถานที่</span>
                    <span className="value">{surveyData.additionalData.locationName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="review-card disaster-card">
              <div className="card-header-premium">
                <span className="icon">⚠️</span>
                <h3>ข้อมูลความเสียหาย</h3>
              </div>
              <div className="data-list">
                <div className="data-item">
                  <span className="label">🌪️ ประเภทภัย</span>
                  <span className="value">{getDisasterTypeLabel(surveyData.disasterType)}</span>
                </div>
                <div className="data-item">
                  <span className="label">📊 ความรุนแรง</span>
                  <span className="value">
                    <span
                      className="severity-tag"
                      style={{ backgroundColor: getSeverityColor(surveyData.severity) }}
                    >
                      {surveyData.severity}/5 - {getSeverityLabel(surveyData.severity)}
                    </span>
                  </span>
                </div>
                <div className="data-item">
                  <span className="label">🏠 จำนวนครัวเรือนที่กระทบ</span>
                  <span className="value">{surveyData.estimatedHouseholds.toLocaleString()} ครัวเรือน</span>
                </div>
                <div className="divider-light"></div>
                <div className="data-item">
                  <span className="label">🤕 ผู้บาดเจ็บ</span>
                  <span className={`value ${surveyData.additionalData?.injured ? 'warning-text' : ''}`}>
                    {surveyData.additionalData?.injured || 0} คน
                  </span>
                </div>
                <div className="data-item">
                  <span className="label">💔 ผู้เสียชีวิต</span>
                  <span className={`value ${surveyData.additionalData?.deaths ? 'danger-text' : ''}`}>
                    {surveyData.additionalData?.deaths || 0} คน
                  </span>
                </div>
                <div className="data-item">
                  <span className="label">💰 ความเสียหายโดยประมาณ</span>
                  <span className="value">
                    {surveyData.additionalData?.estimatedDamage?.toLocaleString() || 0} บาท
                  </span>
                </div>
              </div>
            </div>

            {surveyData.notes && (
              <div className="review-card notes-card">
                <div className="card-header-premium">
                  <span className="icon">📝</span>
                  <h3>หมายเหตุเพิ่มเติม</h3>
                </div>
                <div className="notes-content-premium">
                  {surveyData.notes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="review-actions-premium">
          <button
            className="btn-edit-premium"
            onClick={handleEdit}
            disabled={isSaving}
          >
            <span className="icon">✏️</span> แก้ไขข้อมูล
          </button>
          <button
            className="btn-save-premium"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <><span className="spinner"></span> กำลังบันทึก...</>
            ) : (
              <><span className="icon">💾</span> ยืนยันและบันทึกข้อมูล</>
            )}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
