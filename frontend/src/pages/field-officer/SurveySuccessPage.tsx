/**
 * Survey Success Page
 * หน้าแสดงผลสำเร็จหลังจากบันทึกข้อมูลแล้ว
 */

import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import './SurveySuccessPage.css';

interface SurveyData {
  id: string;
  villageName: string;
  disasterType: string;
  severity: number;
  estimatedHouseholds: number;
  notes: string;
  injured?: number;
  deaths?: number;
  estimatedDamage?: number;
  photoUrls: string[];
  gpsLocation: {
    lat: number;
    lng: number;
  };
  submittedAt: string;
  status: string;
}

export default function SurveySuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const surveyData = location.state?.surveyData as SurveyData;

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
    };
    return labels[type] || type;
  };

  const getSeverityColor = (severity: number): string => {
    if (severity >= 4) return '#ef4444';
    if (severity >= 3) return '#f59e0b';
    return '#10b981';
  };

  const getSeverityLabel = (severity: number): string => {
    const labels = ['', 'เล็กน้อย', 'ปานกลาง', 'รุนแรง', 'รุนแรงมาก', 'วิกฤต'];
    return labels[severity] || '';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout>
      <div className="survey-success-page">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">✅</div>
          <h1>บันทึกข้อมูลสำเร็จ!</h1>
          <p className="success-subtitle">
            ข้อมูลการสำรวจถูกบันทึกลงระบบเรียบร้อยแล้ว
          </p>
        </div>

        {/* Survey Details Card */}
        <div className="success-card">
          <div className="card-header">
            <h2>📋 รายงานการสำรวจ</h2>
            <span className="status-badge status-submitted">
              {surveyData.status === 'SUBMITTED' ? 'ส่งแล้ว' : surveyData.status}
            </span>
          </div>

          <div className="card-body">
            {/* Survey ID */}
            <div className="detail-row">
              <div className="detail-label">🔖 รหัสการสำรวจ</div>
              <div className="detail-value code">{surveyData.id}</div>
            </div>

            {/* Submitted At */}
            <div className="detail-row">
              <div className="detail-label">📅 วันที่บันทึก</div>
              <div className="detail-value">{formatDate(surveyData.submittedAt)}</div>
            </div>

            <div className="divider"></div>

            {/* Location */}
            <div className="detail-row">
              <div className="detail-label">📍 พื้นที่</div>
              <div className="detail-value highlight">{surveyData.villageName}</div>
            </div>

            {/* GPS */}
            <div className="detail-row">
              <div className="detail-label">🗺️ พิกัด GPS</div>
              <div className="detail-value">
                {surveyData.gpsLocation.lat.toFixed(6)}, {surveyData.gpsLocation.lng.toFixed(6)}
              </div>
            </div>

            <div className="divider"></div>

            {/* Disaster Type */}
            <div className="detail-row">
              <div className="detail-label">⚠️ ประเภทภัย</div>
              <div className="detail-value">{getDisasterTypeLabel(surveyData.disasterType)}</div>
            </div>

            {/* Severity */}
            <div className="detail-row">
              <div className="detail-label">📊 ความรุนแรง</div>
              <div className="detail-value">
                <span
                  className="severity-badge"
                  style={{ backgroundColor: getSeverityColor(surveyData.severity) }}
                >
                  {surveyData.severity}/5 - {getSeverityLabel(surveyData.severity)}
                </span>
              </div>
            </div>

            {/* Households */}
            <div className="detail-row">
              <div className="detail-label">🏠 จำนวนครัวเรือน</div>
              <div className="detail-value">{surveyData.estimatedHouseholds.toLocaleString()} ครัวเรือน</div>
            </div>

            {/* Casualties */}
            {(surveyData.injured || surveyData.deaths) && (
              <>
                <div className="divider"></div>
                {surveyData.injured && surveyData.injured > 0 && (
                  <div className="detail-row">
                    <div className="detail-label">🤕 ผู้บาดเจ็บ</div>
                    <div className="detail-value warning">{surveyData.injured} คน</div>
                  </div>
                )}
                {surveyData.deaths && surveyData.deaths > 0 && (
                  <div className="detail-row">
                    <div className="detail-label">💔 ผู้เสียชีวิต</div>
                    <div className="detail-value danger">{surveyData.deaths} คน</div>
                  </div>
                )}
              </>
            )}

            {/* Damage */}
            {surveyData.estimatedDamage && surveyData.estimatedDamage > 0 && (
              <div className="detail-row">
                <div className="detail-label">💰 ความเสียหาย</div>
                <div className="detail-value">{surveyData.estimatedDamage.toLocaleString()} บาท</div>
              </div>
            )}

            {/* Photos */}
            {surveyData.photoUrls && surveyData.photoUrls.length > 0 && (
              <>
                <div className="divider"></div>
                <div className="detail-row">
                  <div className="detail-label">📷 รูปถ่าย</div>
                  <div className="detail-value">{surveyData.photoUrls.length} รูป</div>
                </div>
                <div className="photo-grid">
                  {surveyData.photoUrls.map((url, index) => (
                    <div key={index} className="photo-item">
                      <img src={url} alt={`Photo ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Notes */}
            {surveyData.notes && (
              <>
                <div className="divider"></div>
                <div className="detail-row vertical">
                  <div className="detail-label">📝 หมายเหตุ</div>
                  <div className="detail-value notes">{surveyData.notes}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps-card">
          <h3>🎯 ขั้นตอนต่อไป</h3>
          <ul>
            <li>✅ ข้อมูลถูกบันทึกลงฐานข้อมูลแล้ว</li>
            <li>📊 สามารถดูประวัติการสำรวจได้ที่หน้า "ประวัติการสำรวจ"</li>
            <li>🔔 ระบบจะแจ้งเตือนเมื่อมีการอัพเดทสถานะ</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn-secondary"
            onClick={() => navigate('/dashboard/officer')}
          >
            🏠 กลับหน้าหลัก
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate('/survey-history')}
          >
            📋 ดูประวัติการสำรวจ
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
