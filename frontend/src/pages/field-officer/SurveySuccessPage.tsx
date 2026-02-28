import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { CheckCircle, Home, List, ChevronRight, MapPin, Calendar, AlertCircle } from 'lucide-react';

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

  const containerStyle = {
    fontFamily: "'Sarabun', sans-serif",
    padding: '24px 16px',
    maxWidth: '600px',
    margin: '0 auto',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center'
  };

  const successBoxStyle = {
    textAlign: 'center' as const,
    marginBottom: '40px',
    animation: 'fadeInUp 0.6s ease-out'
  };

  const checkCircleStyle = {
    width: '100px', height: '100px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white',
    margin: '0 auto 24px',
    boxShadow: '0 20px 40px rgba(16, 185, 129, 0.25)',
    animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  };

  const cardStyle = {
    width: '100%',
    background: 'white',
    borderRadius: '32px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
    border: '1px solid #f1f5f9',
    marginBottom: '24px'
  };

  const labelStyle = { fontSize: '14px', color: '#64748b', marginBottom: '4px' };
  const valueStyle = { fontSize: '18px', fontWeight: '700', color: '#1e293b' };

  const buttonStyle = (isPrimary: boolean) => ({
    width: '100%',
    padding: '18px',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    marginBottom: '16px',
    background: isPrimary ? '#0f172a' : 'white',
    color: isPrimary ? 'white' : '#0f172a',
    boxShadow: isPrimary ? '0 10px 20px rgba(15, 23, 42, 0.15)' : 'none',
    borderStyle: isPrimary ? 'none' : 'solid',
    borderWidth: '2px',
    borderColor: '#e2e8f0'
  });

  return (
    <DashboardLayout>
      <div style={containerStyle}>

        {/* Success Visual */}
        <div style={successBoxStyle}>
          <div style={checkCircleStyle}>
            <CheckCircle size={56} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
            บันทึกสำเร็จ!
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b' }}>
            ข้อมูลการสำรวจถูกส่งเข้าระบบเรียบร้อยแล้ว
          </p>
        </div>

        {/* Info Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#3b82f6', background: '#eff6ff', padding: '6px 12px', borderRadius: '10px' }}>
              #{surveyData.id.slice(-6).toUpperCase()}
            </span>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>
              {new Date(surveyData.submittedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
            </span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={labelStyle}>พื้นที่สำรวจ</div>
            <div style={{ ...valueStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#ef4444" /> {surveyData.villageName}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <div style={labelStyle}>ประเภทภัย</div>
              <div style={valueStyle}>{surveyData.disasterType}</div>
            </div>
            <div>
              <div style={labelStyle}>วันที่</div>
              <div style={valueStyle}>
                {new Date(surveyData.submittedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
              </div>
            </div>
          </div>
        </div>

        {/* Next Actions */}
        <div style={{ width: '100%', marginTop: 'auto' }}>
          <button
            onClick={() => navigate('/survey-history')}
            style={buttonStyle(true)}
          >
            <List size={22} /> ดูประวัติการสำรวจ
          </button>
          <button
            onClick={() => navigate('/dashboard/officer')}
            style={buttonStyle(false)}
          >
            <Home size={22} /> กลับหน้าหลัก
          </button>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' }}>
            <AlertCircle size={14} /> ข้อมูลนี้จะแสดงบนแดชบอร์ดส่วนกลางทันที
          </div>
        </div>

        <style>{`
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes scaleIn {
                from { transform: scale(0.5); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `}</style>
      </div>
    </DashboardLayout>
  );
}
