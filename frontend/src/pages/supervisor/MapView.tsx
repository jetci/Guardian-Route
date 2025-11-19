import { useState } from 'react';
import { IncidentsMap } from '../../components/maps/IncidentsMap';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import type { Incident } from '../../types';
import toast from 'react-hot-toast';

export const MapView = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
    toast.success(`เลือก: ${incident.title}`);
  };

  return (
    <DashboardLayout>
      <div style={{ width: '100%', height: '100%' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>
                🗺️ แผนที่เหตุการณ์
              </h1>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                แสดงตำแหน่งเหตุการณ์ทั้งหมดบนแผนที่
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6b7280' }}></div>
                <span>ต่ำ</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div>
                <span>ปานกลาง</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                <span>สูง</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                <span>วิกฤต</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <IncidentsMap 
            className="h-[600px] w-full"
            onIncidentClick={handleIncidentClick}
          />
        </div>

        {/* Selected Incident */}
        {selectedIncident && (
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginTop: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #3b82f6'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
              เหตุการณ์ที่เลือก:
            </h3>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#3b82f6', marginBottom: '12px' }}>
              {selectedIncident.title}
            </p>
            <button
              onClick={() => toast('Detail page coming soon!', { icon: 'ℹ️' })}
              style={{
                padding: '8px 16px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              👁️ ดูรายละเอียดเพิ่มเติม
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
