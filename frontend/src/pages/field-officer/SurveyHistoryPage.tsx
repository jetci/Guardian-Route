/**
 * Survey History Page - Field Officer
 * ดูประวัติการสำรวจที่ส่งไปแล้ว
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { fieldSurveyApi, type FieldSurveyResponse } from '../../api/fieldSurvey';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export default function SurveyHistoryPage() {
  const [surveys, setSurveys] = useState<FieldSurveyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState<FieldSurveyResponse | null>(null);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    setIsLoading(true);
    try {
      const data = await fieldSurveyApi.getMySurveys();
      setSurveys(data);
      console.log('✅ Loaded surveys:', data.length);
    } catch (error: any) {
      console.error('❌ Error loading surveys:', error);
      toast.error('ไม่สามารถโหลดประวัติการสำรวจได้');
    } finally {
      setIsLoading(false);
    }
  };

  const getDisasterTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'flood': 'น้ำท่วม',
      'landslide': 'ดินถล่ม',
      'fire': 'อัคคีภัย',
      'earthquake': 'แผ่นดินไหว',
      'storm': 'วาตภัย'
    };
    return labels[type] || type;
  };

  const getSeverityColor = (severity: number): string => {
    if (severity >= 4) return '#ef4444'; // red
    if (severity >= 3) return '#f59e0b'; // orange
    if (severity >= 2) return '#eab308'; // yellow
    return '#10b981'; // green
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
      'SUBMITTED': { label: 'ส่งแล้ว', color: '#10b981', bg: '#d1fae5' },
      'UNDER_REVIEW': { label: 'กำลังตรวจสอบ', color: '#f59e0b', bg: '#fef3c7' },
      'APPROVED': { label: 'อนุมัติแล้ว', color: '#3b82f6', bg: '#dbeafe' },
      'REJECTED': { label: 'ปฏิเสธ', color: '#ef4444', bg: '#fee2e2' },
    };

    const config = statusConfig[status] || { label: status, color: '#6b7280', bg: '#f3f4f6' };

    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        color: config.color,
        background: config.bg
      }}>
        {config.label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '0' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a202c', margin: '0 0 8px 0' }}>
              📋 ประวัติการสำรวจ
            </h1>
            <p style={{ color: '#718096', margin: 0 }}>
              ดูรายการสำรวจพื้นที่ที่ส่งไปแล้ว
            </p>
          </div>
          <button
            onClick={loadSurveys}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? '⏳ กำลังโหลด...' : '🔄 รีเฟรช'}
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner
            size="lg"
            message="กำลังโหลดข้อมูล..."
            centered
          />
        ) : surveys.length === 0 ? (
          <EmptyState
            icon="search"
            title="ยังไม่มีประวัติการสำรวจ"
            description="เริ่มสำรวจพื้นที่เพื่อบันทึกข้อมูล"
            action={{
              label: '🔍 ไปสำรวจพื้นที่',
              onClick: () => window.location.href = '/survey-area'
            }}
          />
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {surveys.map((survey) => (
              <div
                key={survey.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: selectedSurvey?.id === survey.id ? '2px solid #3b82f6' : '2px solid transparent'
                }}
                onClick={() => setSelectedSurvey(selectedSurvey?.id === survey.id ? null : survey)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>
                      🏘️ {survey.villageName}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: '#eff6ff',
                        color: '#1e40af',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        {getDisasterTypeLabel(survey.disasterType)}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        background: getSeverityColor(survey.severity) + '20',
                        color: getSeverityColor(survey.severity),
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        ระดับ {survey.severity}/5
                      </span>
                      {getStatusBadge(survey.status)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#6b7280' }}>
                    <div>📅 {format(new Date(survey.submittedAt), 'dd MMM yyyy', { locale: th })}</div>
                    <div>🕐 {format(new Date(survey.submittedAt), 'HH:mm น.')}</div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '12px',
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}>
                  <div>
                    <span style={{ color: '#6b7280' }}>👥 ครัวเรือน:</span>
                    <strong style={{ marginLeft: '6px', color: '#1a202c' }}>{survey.estimatedHouseholds}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280' }}>📍 GPS:</span>
                    <strong style={{ marginLeft: '6px', color: '#1a202c', fontSize: '12px' }}>
                      {survey.gpsLocation.lat.toFixed(4)}, {survey.gpsLocation.lng.toFixed(4)}
                    </strong>
                  </div>
                  {survey.photoUrls && survey.photoUrls.length > 0 && (
                    <div>
                      <span style={{ color: '#6b7280' }}>📸 รูปภาพ:</span>
                      <strong style={{ marginLeft: '6px', color: '#1a202c' }}>{survey.photoUrls.length} รูป</strong>
                    </div>
                  )}
                </div>

                {selectedSurvey?.id === survey.id && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>
                      📝 รายละเอียด:
                    </h4>
                    <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6', marginBottom: '12px' }}>
                      {survey.notes || 'ไม่มีรายละเอียดเพิ่มเติม'}
                    </p>

                    {survey.photoUrls && survey.photoUrls.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>
                          📸 รูปภาพ:
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                          {survey.photoUrls.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`Survey photo ${i + 1}`}
                              style={{
                                width: '100%',
                                height: '120px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '2px solid #e5e7eb',
                                cursor: 'pointer'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(url, '_blank');
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: '12px', fontSize: '12px', color: '#9ca3af' }}>
                      Survey ID: {survey.id}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
