/**
 * Survey Review Page
 * หน้าตรวจทานข้อมูลก่อนบันทึก (ยังไม่บันทึกลงฐานข้อมูล)
 */

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { fieldSurveyApi } from '../../api/fieldSurvey';
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
  };
}

export default function SurveyReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const surveyData = location.state?.surveyData as SurveyFormData;
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('📋 Submitting survey to backend...', surveyData);

      const response = await fieldSurveyApi.submitSurvey(surveyData);

      console.log('✅ Survey saved successfully:', response);

      // Navigate to success page with saved data
      navigate('/survey-success', {
        state: { surveyData: response }
      });
    } catch (error: any) {
      console.error('❌ Error saving survey:', error);
      alert(
        '❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล\n\n' +
        (error.response?.data?.message || error.message || 'กรุณาลองใหม่อีกครั้ง')
      );
    } finally {
      setIsSaving(false);
    }
  };


  const handleEdit = () => {
    // Pass survey data back to form via navigation state
    navigate('/survey-area', {
      state: { editData: surveyData }
    });
  };

  return (
    <DashboardLayout>
      <div className="survey-review-page">
        {/* Header */}
        <div className="review-header">
          <div className="header-icon">📋</div>
          <h1>ตรวจทานข้อมูลการสำรวจ</h1>
          <p className="header-subtitle">
            กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนบันทึก
          </p>
        </div>

        {/* Warning Box */}
        <div className="warning-box">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <strong>โปรดตรวจสอบข้อมูลให้ถูกต้อง</strong>
            <p>ข้อมูลยังไม่ได้ถูกบันทึกลงระบบ กรุณาตรวจสอบความถูกต้องก่อนกดปุ่ม "บันทึก"</p>
          </div>
        </div>

        {/* Review Card */}
        <div className="review-card">
          <div className="card-section">
            <h2 className="section-title">📍 ข้อมูลพื้นที่</h2>

            {surveyData.additionalData?.surveyDate && (
              <div className="detail-row">
                <div className="detail-label">วันที่สำรวจ</div>
                <div className="detail-value">
                  {new Date(surveyData.additionalData.surveyDate).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}

            <div className="detail-row">
              <div className="detail-label">หมู่บ้าน</div>
              <div className="detail-value highlight">{surveyData.villageName}</div>
            </div>

            {/* Only show GPS if coordinates are valid (not 0, 0) */}
            {surveyData.gpsLocation &&
              surveyData.gpsLocation.lat !== 0 &&
              surveyData.gpsLocation.lng !== 0 && (
                <div className="detail-row">
                  <div className="detail-label">พิกัด GPS</div>
                  <div className="detail-value">
                    {surveyData.gpsLocation.lat.toFixed(6)}, {surveyData.gpsLocation.lng.toFixed(6)}
                  </div>
                </div>
              )}

            {surveyData.additionalData?.locationName && (
              <div className="detail-row">
                <div className="detail-label">ชื่อตำแหน่ง</div>
                <div className="detail-value">{surveyData.additionalData.locationName}</div>
              </div>
            )}

            {surveyData.additionalData?.accuracy && (
              <div className="detail-row">
                <div className="detail-label">ความแม่นยำ GPS</div>
                <div className="detail-value">±{surveyData.additionalData.accuracy.toFixed(0)} เมตร</div>
              </div>
            )}
          </div>

          <div className="divider"></div>

          <div className="card-section">
            <h2 className="section-title">⚠️ ข้อมูลภัย</h2>

            <div className="detail-row">
              <div className="detail-label">ประเภทภัย</div>
              <div className="detail-value">{getDisasterTypeLabel(surveyData.disasterType)}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">ความรุนแรง</div>
              <div className="detail-value">
                <span
                  className="severity-badge"
                  style={{ backgroundColor: getSeverityColor(surveyData.severity) }}
                >
                  {surveyData.severity}/5 - {getSeverityLabel(surveyData.severity)}
                </span>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">จำนวนครัวเรือน</div>
              <div className="detail-value">{surveyData.estimatedHouseholds.toLocaleString()} ครัวเรือน</div>
            </div>
          </div>

          {(surveyData.additionalData?.injured || surveyData.additionalData?.deaths || surveyData.additionalData?.estimatedDamage) && (
            <>
              <div className="divider"></div>
              <div className="card-section">
                <h2 className="section-title">💔 ผลกระทบ</h2>

                {surveyData.additionalData?.injured && surveyData.additionalData.injured > 0 && (
                  <div className="detail-row">
                    <div className="detail-label">ผู้บาดเจ็บ</div>
                    <div className="detail-value warning">{surveyData.additionalData.injured} คน</div>
                  </div>
                )}

                {surveyData.additionalData?.deaths && surveyData.additionalData.deaths > 0 && (
                  <div className="detail-row">
                    <div className="detail-label">ผู้เสียชีวิต</div>
                    <div className="detail-value danger">{surveyData.additionalData.deaths} คน</div>
                  </div>
                )}

                {surveyData.additionalData?.estimatedDamage && surveyData.additionalData.estimatedDamage > 0 && (
                  <div className="detail-row">
                    <div className="detail-label">ความเสียหาย</div>
                    <div className="detail-value">{surveyData.additionalData.estimatedDamage.toLocaleString()} บาท</div>
                  </div>
                )}
              </div>
            </>
          )}

          {surveyData.photoUrls && surveyData.photoUrls.length > 0 && (
            <>
              <div className="divider"></div>
              <div className="card-section">
                <h2 className="section-title">📷 รูปถ่าย ({surveyData.photoUrls.length} รูป)</h2>
                <div className="photo-grid">
                  {surveyData.photoUrls.map((url, index) => (
                    <div key={index} className="photo-item">
                      <img src={url} alt={`Photo ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {surveyData.notes && (
            <>
              <div className="divider"></div>
              <div className="card-section">
                <h2 className="section-title">📝 หมายเหตุ</h2>
                <div className="notes-box">{surveyData.notes}</div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn-secondary"
            onClick={handleEdit}
            disabled={isSaving}
          >
            ✏️ แก้ไขข้อมูล
          </button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '⏳ กำลังบันทึก...' : '💾 บันทึกข้อมูล'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
