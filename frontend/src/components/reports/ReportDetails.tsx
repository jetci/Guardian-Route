import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ReportStatus,
} from '../../types/Report';
import type {
  Report,
  ReviewReportDto,
} from '../../types/Report';
import { submitReport, reviewReport, generateReportPdf, downloadReportPdf } from '../../api/reports';
import { Role } from '../../types';
import { reportService } from '../../services/reportService';
import '../../pages/field-officer/SurveyReviewPage.css'; // Reuse the CSS

interface ReportDetailsProps {
  report: Report;
  currentUser: { id: string; role: Role };
  onUpdate: () => void;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({
  report,
  currentUser,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState<ReviewReportDto>({
    status: ReportStatus.APPROVED,
    reviewNotes: '',
  });

  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const canEdit = report.authorId === currentUser.id && report.status === ReportStatus.DRAFT;
  const canSubmit = report.authorId === currentUser.id && report.status === ReportStatus.DRAFT;
  const canReview =
    (currentUser.role === Role.SUPERVISOR ||
      currentUser.role === Role.EXECUTIVE ||
      currentUser.role === Role.ADMIN) &&
    (report.status === ReportStatus.SUBMITTED || report.status === ReportStatus.UNDER_REVIEW);

  // Helper to get data safely
  const details = report.details || {};
  const additionalData = details.additionalData || {};
  const incident = report.incident || ({} as any);

  // Extract location data
  const location = incident.location || (details.gpsLocation as any);
  const lat = location?.coordinates ? location.coordinates[1] : location?.lat;
  const lng = location?.coordinates ? location.coordinates[0] : location?.lng;

  // Effect 1: Initialize Map (Run once)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent double initialization
    if (mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      fadeAnimation: false,
      zoomAnimation: false,
      markerZoomAnimation: false
    });

    // Use Google Hybrid
    L.tileLayer('http://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '© Google Maps'
    }).addTo(map);

    // Create a FeatureGroup for drawn items and save it to the map object for reuse
    const drawnItems = new L.FeatureGroup().addTo(map);
    (map as any).drawnItems = drawnItems;

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Effect 2: Update Map Content (Run when data changes)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !lat || !lng) return;

    // Update View
    map.setView([lat, lng], 15, { animate: false });

    // Clear existing layers
    const drawnItems = (map as any).drawnItems as L.FeatureGroup;
    if (drawnItems) {
      drawnItems.clearLayers();
    }

    // Add Village Boundary if available
    if (report.village?.boundary) {
      L.polygon(report.village.boundary.coordinates as any, {
        color: '#F59E0B',
        weight: 2,
        fillColor: '#F59E0B',
        fillOpacity: 0.1,
        dashArray: '5, 5',
        interactive: false
      }).addTo(map); // Add directly to map or drawnItems? Village boundary is usually static context.
      // Let's add to map directly so it doesn't get cleared by drawnItems.clearLayers() if we want to keep it? 
      // Actually, if report changes, village might change. Let's put it in drawnItems or manage it separately.
      // For simplicity, let's put everything in drawnItems so it clears cleanly.
    }

    // Re-add Village Boundary (we need to clear it too if we want to support changing reports)
    // To do this properly, we should clear EVERYTHING on the map except tiles.
    // Or just use drawnItems for everything dynamic.

    // Let's use a specific layer group for dynamic content
    if (drawnItems) {
      // Add Village Boundary
      if (report.village?.boundary) {
        L.polygon(report.village.boundary.coordinates as any, {
          color: '#F59E0B',
          weight: 2,
          fillColor: '#F59E0B',
          fillOpacity: 0.1,
          dashArray: '5, 5',
          interactive: false
        }).addTo(drawnItems);
      }

      // Add Incident Marker (Village Center)
      L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'village-center-icon',
          html: '🏠',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      }).addTo(drawnItems).bindTooltip('จุดศูนย์กลางหมู่บ้าน', { permanent: false, direction: 'top' });

      // Add Affected Area Polygon
      const affectedArea = incident.affectedArea || details.polygon;
      if (affectedArea) {
        L.geoJSON(affectedArea, {
          style: {
            color: '#3b82f6',
            weight: 3,
            opacity: 0.6,
            fillColor: '#3b82f6',
            fillOpacity: 0.2
          }
        }).addTo(drawnItems);
      }

      // Add Multi-point Markers
      const markers = additionalData.markers || [];
      if (markers.length > 0) {
        markers.forEach((m: any, i: number) => {
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

      // Fit bounds
      if (drawnItems.getLayers().length > 0) {
        map.fitBounds(drawnItems.getBounds(), { padding: [40, 40], animate: false });
      }
    }
  }, [lat, lng, report]); // Update when data changes

  const handleSubmit = async () => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะส่งรายงานนี้เพื่อตรวจสอบ?')) return;

    try {
      setLoading(true);
      setError(null);
      await submitReport(report.id);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถส่งรายงานได้');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    try {
      setLoading(true);
      setError(null);
      await reviewReport(report.id, reviewData);
      setShowReviewModal(false);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถบันทึกผลการตรวจสอบได้');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePdf = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await generateReportPdf(report.id, { forceRegenerate: true });
      alert(`สร้าง PDF สำเร็จ: ${result.pdfUrl}`);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถสร้าง PDF ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!report.pdfUrl) return;

    try {
      await reportService.downloadPdf(report.pdfUrl, `${report.title}.pdf`);
    } catch (err: any) {
      setError('ไม่สามารถดาวน์โหลด PDF ได้');
    }
  };

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

  return (
    <div className="survey-review-page font-sarabun">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-xl shadow-md font-medium mb-6">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="review-header mb-6">
        <div className="header-icon">📋</div>
        <h1>{report.title}</h1>
        <p className="header-subtitle">
          สถานะ: <span className={`px-2 py-1 rounded-md text-sm font-bold ${report.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
            report.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
              report.status === 'REVISION_REQUIRED' ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
            }`}>{
              report.status === 'APPROVED' ? 'อนุมัติแล้ว' :
                report.status === 'REJECTED' ? 'ปฏิเสธ' :
                  report.status === 'REVISION_REQUIRED' ? 'ต้องแก้ไข' :
                    report.status === 'PENDING_REVIEW' ? 'รอตรวจสอบ' :
                      report.status === 'SUBMITTED' ? 'ส่งแล้ว' :
                        report.status === 'DRAFT' ? 'แบบร่าง' : report.status
            }</span>
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
            <div ref={mapContainerRef} className="mini-map-container" style={{ height: '300px' }}></div>

            <div className="marker-details-list">
              <h4>📍 รายละเอียดจุดที่ปักหมุด ({additionalData.markers?.length || 0} จุด)</h4>
              {additionalData.markers && additionalData.markers.length > 0 ? (
                <div className="markers-scroll">
                  {additionalData.markers.map((m: any, i: number) => {
                    // Clean label
                    let cleanLabel = typeof m.label === 'string'
                      ? m.label.replace(/^จุดที่ \d+[:\s]*/, '').trim()
                      : '📍 ตำแหน่ง';

                    // If cleaning resulted in empty string (e.g. label was just "จุดที่ 1"), use original
                    if (!cleanLabel && typeof m.label === 'string') {
                      cleanLabel = m.label;
                    }

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
          </div >

          {
            report.photoUrls && report.photoUrls.length > 0 && (
              <div className="review-card photo-card">
                <div className="card-header-premium">
                  <span className="icon">📷</span>
                  <h3>รูปถ่ายประกอบ ({report.photoUrls.length})</h3>
                </div>
                <div className="photo-grid-premium">
                  {report.photoUrls.map((url, index) => (
                    <div key={index} className="photo-item-premium">
                      <img src={url} alt={`Report ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )
          }
        </div >

        {/* Right Column: Form Data */}
        < div className="review-right" >
          <div className="review-card data-card">
            <div className="card-header-premium">
              <span className="icon">🏘️</span>
              <h3>ข้อมูลพื้นที่</h3>
            </div>
            <div className="data-list">
              <div className="data-item">
                <span className="label">🏘️ หมู่บ้าน</span>
                <span className="value highlight">{details.villageName || incident.address || 'ไม่ระบุ'}</span>
              </div>
              <div className="data-item">
                <span className="label">📍 พิกัดศูนย์กลาง</span>
                <span className="value">
                  {incident.location?.coordinates
                    ? `${incident.location.coordinates[1].toFixed(6)}, ${incident.location.coordinates[0].toFixed(6)}`
                    : details.gpsLocation
                      ? `${details.gpsLocation.lat.toFixed(6)}, ${details.gpsLocation.lng.toFixed(6)}`
                      : '-'}
                </span>
              </div>
              {additionalData.incidentDate && (
                <div className="data-item">
                  <span className="label">📅 วันที่เกิดเหตุ</span>
                  <span className="value">
                    {new Date(additionalData.incidentDate).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
              {additionalData.locationName && (
                <div className="data-item">
                  <span className="label">🏢 ชื่อตำแหน่ง/สถานที่</span>
                  <span className="value">{additionalData.locationName}</span>
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
                <span className="value">{getDisasterTypeLabel(incident.disasterType || incident.type || details.disasterType)}</span>
              </div>
              <div className="data-item">
                <span className="label">📊 ความรุนแรง</span>
                <span className="value">
                  <span
                    className="severity-tag"
                    style={{ backgroundColor: getSeverityColor(incident.severity || details.severity || 0) }}
                  >
                    {incident.severity || details.severity || 0}/5 - {getSeverityLabel(incident.severity || details.severity || 0)}
                  </span>
                </span>
              </div>
              <div className="data-item">
                <span className="label">🏠 จำนวนครัวเรือนที่กระทบ</span>
                <span className="value">{report.affectedHouseholds?.toLocaleString() || 0} ครัวเรือน</span>
              </div>
              <div className="divider-light"></div>
              <div className="data-item">
                <span className="label">🤕 ผู้บาดเจ็บ</span>
                <span className={`value ${additionalData.injured ? 'warning-text' : ''}`}>
                  {additionalData.injured || 0} คน
                </span>
              </div>
              <div className="data-item">
                <span className="label">💔 ผู้เสียชีวิต</span>
                <span className={`value ${additionalData.deaths ? 'danger-text' : ''}`}>
                  {additionalData.deaths || 0} คน
                </span>
              </div>
              <div className="data-item">
                <span className="label">💰 ความเสียหายโดยประมาณ</span>
                <span className="value">
                  {report.totalDamageEstimate?.toLocaleString() || 0} บาท
                </span>
              </div>
            </div>
          </div>

          {
            (report.summary || details.notes) && (
              <div className="review-card notes-card">
                <div className="card-header-premium">
                  <span className="icon">📝</span>
                  <h3>หมายเหตุเพิ่มเติม</h3>
                </div>
                <div className="notes-content-premium">
                  {report.summary || details.notes}
                </div>
              </div>
            )
          }
        </div >
      </div >

      {/* Action Buttons */}
      < div className="review-actions-premium mt-8" >
        {canEdit && (
          <Link
            to={`/reports/${report.id}/edit`}
            className="btn-edit-premium"
          >
            <span className="icon">✏️</span> แก้ไข
          </Link>
        )}
        {
          canSubmit && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-save-premium"
            >
              <span className="icon">📤</span> ส่งตรวจสอบ
            </button>
          )
        }
        {
          canReview && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="btn-save-premium bg-green-600 hover:bg-green-700"
            >
              <span className="icon">✅</span> ตรวจสอบ
            </button>
          )
        }
        <button
          onClick={handleGeneratePdf}
          disabled={loading}
          className="btn-edit-premium bg-purple-600 text-white hover:bg-purple-700"
        >
          <span className="icon">📄</span> สร้าง PDF
        </button>
        {
          report.pdfUrl && (
            <button
              onClick={handleDownloadPdf}
              className="btn-edit-premium bg-gray-600 text-white hover:bg-gray-700"
            >
              <span className="icon">⬇️</span> โหลด PDF
            </button>
          )
        }
      </div >

      {/* Review Modal */}
      {
        showReviewModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-6">ตรวจสอบรายงาน</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ผลการตรวจสอบ
                  </label>
                  <select
                    value={reviewData.status}
                    onChange={(e) =>
                      setReviewData((prev) => ({
                        ...prev,
                        status: e.target.value as any,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value={ReportStatus.APPROVED}>อนุมัติ</option>
                    <option value={ReportStatus.REVISION_REQUIRED}>ต้องแก้ไข</option>
                    <option value={ReportStatus.REJECTED}>ปฏิเสธ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    หมายเหตุ
                  </label>
                  <textarea
                    value={reviewData.reviewNotes}
                    onChange={(e) =>
                      setReviewData((prev) => ({
                        ...prev,
                        reviewNotes: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="ระบุหมายเหตุหรือข้อเสนอแนะ"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowReviewModal(false)}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors font-medium shadow-sm"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleReview}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors font-medium shadow-md"
                >
                  {loading ? 'กำลังบันทึก...' : 'บันทึกผล'}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default ReportDetails;
