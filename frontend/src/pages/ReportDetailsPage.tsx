import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft, MapPin, Calendar, AlertCircle, CheckCircle,
  Clock, XCircle, FileText, Download, Share2, Eye,
  Users, Home, HeartPulse, Building2, Trees, Zap, Camera,
  ArrowRight, Info
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { getReportById, generateReportPdf } from '../api/reports';
import { reportService } from '../services/reportService';
import { incidentService } from '../services/incidentService';
import { taskService } from '../services/taskService';
import { villagesApi } from '../api/villages';
import { useAuthStore } from '../stores/authStore';
import { ReportType, ReportStatus } from '../types/Report';
import type { Report } from '../types/Report';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';

export function ReportDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (id) loadReport();
  }, [id]);

  const loadReport = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      let data: any;
      try {
        // 1. Try fetching as Report
        data = await getReportById(id);
      } catch (err) {
        try {
          // 2. Try fetching as Incident
          const incident = await incidentService.getById(id);
          if (incident) {
            if (!incident.village && incident.villageId) {
              try {
                incident.village = await villagesApi.getById(incident.villageId);
              } catch (vErr) { }
            }

            let markers: any[] = [];
            if (incident.affectedArea?.features) {
              markers = incident.affectedArea.features
                .filter((f: any) => f.geometry.type === 'Point')
                .map((f: any) => ({
                  lat: f.geometry.coordinates[1],
                  lng: f.geometry.coordinates[0],
                  label: f.properties?.label || `จุดที่ ${f.properties?.number || '?'}`
                }));
            }

            data = {
              id: incident.id,
              type: ReportType.INCIDENT,
              status: mapIncidentStatusToReportStatus(incident.status),
              title: incident.title,
              summary: incident.description,
              photoUrls: incident.images || [],
              createdAt: incident.createdAt,
              details: {
                gpsLocation: incident.location,
                disasterType: incident.disasterType,
                severity: incident.severity,
                address: incident.address,
                villageName: incident.village?.name,
                additionalData: {
                  incidentDate: incident.createdAt,
                  markers: markers
                }
              },
              village: incident.village,
              author: incident.createdBy || { firstName: 'เจ้าหน้าที่', lastName: '', role: 'FIELD_OFFICER' }
            };
          } else {
            throw new Error('NotIncident');
          }
        } catch (incErr) {
          // 3. Try fetching as Task (for reports mapped from tasks)
          try {
            const task = await taskService.getById(id);
            if (task) {
              data = {
                id: task.id,
                type: ReportType.TASK,
                status: task.status,
                title: task.title,
                summary: task.description,
                photoUrls: [],
                createdAt: task.createdAt,
                details: {
                  gpsLocation: task.village?.centerPoint || task.location,
                  disasterType: 'งานสำรวจ',
                  severity: task.priority === 'HIGH' ? 4 : task.priority === 'MEDIUM' ? 3 : 2,
                  address: task.village?.name ? `หมู่บ้าน${task.village.name} ต.เวียง อ.ฝาง จ.เชียงใหม่` : 'ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่',
                  villageName: task.village?.name,
                  additionalData: {
                    incidentDate: task.createdAt,
                    markers: []
                  }
                },
                village: task.village,
                author: task.createdBy || { firstName: 'เจ้าหน้าที่', lastName: '', role: 'FIELD_OFFICER' }
              };
            } else {
              throw new Error('NotFound');
            }
          } catch (taskErr) {
            throw new Error('AllFetchFailed');
          }
        }
      }
      setReport(data);
    } catch (err) {
      setError('ไม่พบข้อมูลรายงานหรือเหตุการณ์ที่ระบุ');
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const mapIncidentStatusToReportStatus = (status: string): ReportStatus => {
    switch (status) {
      case 'PENDING': return ReportStatus.SUBMITTED;
      case 'IN_PROGRESS': return ReportStatus.UNDER_REVIEW;
      case 'RESOLVED':
      case 'CLOSED': return ReportStatus.APPROVED;
      default: return ReportStatus.SUBMITTED;
    }
  };

  useEffect(() => {
    if (!report || !mapContainerRef.current || mapRef.current) return;

    const details = report.details || {};
    const addData = details.additionalData || {};

    // Support multiple location formats (GeoJSON, {lat,lng}, or result from task)
    const rawLoc = report.incident?.location || details.gpsLocation || report.village?.centerPoint;
    let lat = 19.9169; // @manual: Tambon Wieng, Fang center
    let lng = 99.2145;
    // ... (lines omitted for brevity but I will include them in the real call)

    if (rawLoc) {
      if (rawLoc.coordinates) {
        lat = rawLoc.coordinates[1];
        lng = rawLoc.coordinates[0];
      } else if (rawLoc.lat && rawLoc.lng) {
        lat = rawLoc.lat;
        lng = rawLoc.lng;
      } else if (Array.isArray(rawLoc) && rawLoc.length === 2) {
        lng = rawLoc[0];
        lat = rawLoc[1];
      }
    }

    console.log('📍 Initializing map at:', lat, lng);

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

    const drawnItems = new L.FeatureGroup().addTo(map);

    // 1. Village Boundary - Handle GeoJSON coordinates properly
    if (report.village?.boundary) {
      try {
        L.geoJSON(report.village.boundary as any, {
          style: { color: '#F59E0B', weight: 2, fillOpacity: 0.05, dashArray: '5, 5' }
        }).addTo(drawnItems);
      } catch (err) {
        console.warn('Failed to draw village boundary:', err);
      }
    }

    // 2. Affected Area Polygon (Survey data or Incident area)
    const affectedArea = report.incident?.affectedArea || details.affectedArea;
    if (affectedArea) {
      try {
        L.geoJSON(affectedArea as any, {
          style: { color: '#3b82f6', weight: 4, fillOpacity: 0.2, opacity: 0.8 }
        }).addTo(drawnItems);
      } catch (err) {
        console.warn('Failed to draw affected area:', err);
      }
    }

    // 3. Main Marker
    const mainMarker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: '',
        html: `<div style="background: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); font-size: 22px; border: 3px solid #3b82f6; position: relative;">
                🏠
              </div>`,
        iconSize: [44, 44], iconAnchor: [22, 22]
      })
    }).addTo(drawnItems);
    mainMarker.bindPopup('จุดศูนย์กลางหมู่บ้าน/ที่ตั้งหลัก');

    // 4. Additional Numbered Markers
    const markers = addData.markers || [];
    markers.forEach((m: any, i: number) => {
      L.marker([m.lat, m.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="background: #ef4444; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; border: 2.5px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); font-size: 14px;">${i + 1}</div>`,
          iconSize: [30, 30], iconAnchor: [15, 15]
        })
      }).addTo(drawnItems)
        .bindPopup(`จุดที่ ${i + 1}: ${m.label || 'พิกัดความเสียหาย'}`);
    });

    // Fit bounds properly to see everything
    if (drawnItems.getLayers().length > 0) {
      map.fitBounds(drawnItems.getBounds(), { padding: [40, 40], maxZoom: 16 });
    }

    // Crucial: Invalidate size after a short delay to ensure the container is visible and has size
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    mapRef.current = map;
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [report, loading]);

  const getDisasterTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'FLOOD': '🌊 น้ำท่วม',
      'LANDSLIDE': '⛰️ ดินถล่ม',
      'STORM': '🌪️ วาตภัย',
      'FIRE': '🔥 อัคคีภัย',
      'EARTHQUAKE': '🌍 แผ่นดินไหว',
      'DROUGHT': '☀️ ภัยแล้ง',
      'FOREST_FIRE': '🔥 ไฟป่า',
      'OTHER': '❓ อื่นๆ',
      'น้ำท่วม': '🌊 น้ำท่วม',
      'ดินถล่ม': '⛰️ ดินถล่ม',
      'วาตภัย': '🌪️ วาตภัย',
      'อัคคีภัย': '🔥 อัคคีภัย',
      'แผ่นดินไหว': '🌍 แผ่นดินไหว',
      'ภัยแล้ง': '☀️ ภัยแล้ง',
      'ไฟป่า': '🔥 ไฟป่า',
      'อื่นๆ': '❓ อื่นๆ',
      'งานสำรวจ': '📋 งานสำรวจ'
    };
    return labels[type?.toUpperCase()] || labels[type] || type || 'ไม่ระบุ';
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROVED': return { label: 'อนุมัติแล้ว', color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle size={18} /> };
      case 'REJECTED': return { label: 'ปฏิเสธ', color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={18} /> };
      case 'REVISION_REQUIRED': return { label: 'ต้องแก้ไข', color: '#f59e0b', bg: '#fffbeb', icon: <AlertCircle size={18} /> };
      case 'PENDING_REVIEW':
      case 'SUBMITTED':
      case 'UNDER_REVIEW': return { label: 'รอตรวจสอบ', color: '#3b82f6', bg: '#eff6ff', icon: <Clock size={18} /> };
      default: return { label: 'แบบร่าง', color: '#64748b', bg: '#f8fafc', icon: <FileText size={18} /> };
    }
  };

  const handleDownloadPDF = async () => {
    if (!report) return;
    try {
      toast.loading('กำลังสร้างไฟล์ PDF...', { id: 'pdf' });
      await generateReportPdf(report.id);
      toast.success('สร้างแผนที่รายงานสำเร็จ', { id: 'pdf' });
    } catch (error) {
      toast.error('ไม่สามารถสร้าง PDF ได้', { id: 'pdf' });
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#94a3b8' }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '20px', fontWeight: '600' }}>กำลังโหลดข้อมูลรายงาน...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </DashboardLayout>
  );

  if (error || !report) return (
    <DashboardLayout>
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ background: '#fef2f2', padding: '40px', borderRadius: '24px', border: '1px solid #fee2e2' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#991b1b', marginBottom: '8px' }}>เกิดข้อผิดพลาด</h2>
          <p style={{ color: '#b91c1c' }}>{error || 'ไม่พบข้อมูลที่ต้องการ'}</p>
          <button onClick={() => navigate('/report-history')} style={{ marginTop: '24px', padding: '12px 24px', background: 'white', border: '1px solid #fee2e2', borderRadius: '12px', color: '#ef4444', fontWeight: '700' }}>กลับหน้าประวัติรายงาน</button>
        </div>
      </div>
    </DashboardLayout>
  );

  const config = getStatusConfig(report.status);
  const details = report.details || {};
  const addData = details.additionalData || {};

  const sectionStyle = { background: 'white', borderRadius: '28px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' };
  const sectionTitleStyle = { fontSize: '18px', fontWeight: '900', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' };
  const dataRowStyle = { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f8fafc' };
  const labelStyle = { color: '#64748b', fontSize: '14px', fontWeight: '600' };
  const valueStyle = { color: '#1e293b', fontSize: '15px', fontWeight: '700', textAlign: 'right' as const };

  return (
    <DashboardLayout>
      <div style={{ fontFamily: "'Sarabun', sans-serif", padding: '16px', background: '#f0f4f8', minHeight: '100vh', paddingBottom: '100px' }}>

        {/* Header Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button onClick={() => navigate(-1)} style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <ChevronLeft size={24} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{report.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
              <Calendar size={13} /> {new Date(report.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div style={{ padding: '8px 14px', borderRadius: '12px', background: config.bg, color: config.color, fontSize: '13px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {config.icon} {config.label}
          </div>
        </div>

        {/* Key Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', padding: '16px', borderRadius: '20px', color: 'white' }}>
            <Users size={16} />
            <div style={{ fontSize: '18px', fontWeight: '900', margin: '4px 0' }}>{report.affectedHouseholds || 0}</div>
            <div style={{ fontSize: '10px', opacity: 0.8, fontWeight: '700' }}>ครัวเรือน</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', padding: '16px', borderRadius: '20px', color: 'white' }}>
            <Home size={16} />
            <div style={{ fontSize: '18px', fontWeight: '900', margin: '4px 0' }}>{details.damagedBuildings || 0}</div>
            <div style={{ fontSize: '10px', opacity: 0.8, fontWeight: '700' }}>อาคาร</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', padding: '16px', borderRadius: '20px', color: 'white' }}>
            <Zap size={16} />
            <div style={{ fontSize: '18px', fontWeight: '900', margin: '4px 0' }}>{report.totalDamageEstimate?.toLocaleString() || 0}</div>
            <div style={{ fontSize: '10px', opacity: 0.8, fontWeight: '700' }}>มูลค่า (บาท)</div>
          </div>
        </div>

        {/* Map Section */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}><MapPin size={20} color="#ef4444" /> แผนที่พิกัดความเสียหาย</div>
          <div ref={mapContainerRef} style={{ height: '220px', borderRadius: '20px', overflow: 'hidden', marginBottom: '16px', border: '1px solid #e2e8f0' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
            {report.details?.address || report.village?.name || 'ไม่ระบุสถานที่'}
          </div>
        </div>

        {/* Damage Summary */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}><AlertCircle size={20} color="#f59e0b" /> สรุปความเสียหายที่พบ</div>
          <div style={dataRowStyle}>
            <span style={labelStyle}>ประเภทภัย:</span>
            <span style={valueStyle}>{getDisasterTypeLabel(details.disasterType)}</span>
          </div>
          <div style={dataRowStyle}>
            <span style={labelStyle}>ระดับความรุนแรง:</span>
            <div style={{ ...valueStyle, padding: '2px 10px', borderRadius: '6px', background: '#fee2e2', color: '#ef4444' }}>
              {details.severity}/5 - รุนแรง
            </div>
          </div>
          <div style={dataRowStyle}>
            <span style={labelStyle}>ผู้บาดเจ็บ:</span>
            <span style={{ ...valueStyle, color: addData.injured > 0 ? '#ef4444' : '#1e293b' }}>{addData.injured || 0} ราย</span>
          </div>
          <div style={dataRowStyle}>
            <span style={labelStyle}>ผู้เสียชีวิต:</span>
            <span style={{ ...valueStyle, color: addData.deaths > 0 ? '#ef4444' : '#1e293b' }}>{addData.deaths || 0} ราย</span>
          </div>

          <div style={{ marginTop: '20px', background: '#f8fafc', padding: '16px', borderRadius: '16px', fontSize: '14px', lineHeight: 1.6 }}>
            <div style={{ fontWeight: '800', color: '#475569', marginBottom: '4px' }}>คำอธิบายเพิ่มเติม:</div>
            {report.summary || 'ไม่มีข้อมูลรายละเอียดเพิ่มเติม'}
          </div>
        </div>

        {/* Photo Evidence */}
        {report.photoUrls && report.photoUrls.length > 0 && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}><Camera size={20} color="#3b82f6" /> รูปถ่ายพยานหลักฐาน ({report.photoUrls.length})</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {report.photoUrls.map((url, idx) => (
                <div key={idx} style={{ aspectRatio: '4/3', borderRadius: '16px', overflow: 'hidden', background: '#f1f5f9' }}>
                  <img src={url} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Author Info */}
        <div style={{ ...sectionStyle, background: 'linear-gradient(to right, #ffffff, #f1f5f9)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '20px' }}>
              {report.author?.firstName?.charAt(0) || 'A'}
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '700' }}>ผู้จัดทำรายงาน</div>
              <div style={{ fontSize: '17px', fontWeight: '900', color: '#0f172a' }}>{report.author?.firstName} {report.author?.lastName}</div>
              <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '700' }}>บทบาท: {report.author?.role}</div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '20px', background: 'rgba(240, 244, 248, 0.9)', backdropFilter: 'blur(10px)', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', zIndex: 1000 }}>
          <button onClick={handleDownloadPDF} style={{ flex: 1, padding: '16px', borderRadius: '20px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', border: 'none', fontWeight: '800', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)' }}>
            <Download size={20} /> ออกรายงาน PDF
          </button>
          <button style={{ width: '60px', borderRadius: '20px', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
            <Share2 size={24} />
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default ReportDetailsPage;
