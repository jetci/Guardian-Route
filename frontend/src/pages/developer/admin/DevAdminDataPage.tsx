import { DashboardLayout } from '../../../components/layout/DashboardLayout';

/**
 * Admin Data Management Page
 * Upload and manage GeoJSON and other base data
 */
export default function DevAdminDataPage() {
    return (
        <DashboardLayout>
            <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
                <header style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '16px',
                    marginBottom: '2rem',
                    boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)'
                }}>
                    <h1 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '2rem' }}>
                        📦 จัดการข้อมูล (Data Management)
                    </h1>
                    <p style={{ margin: 0, opacity: 0.95 }}>
                        อัปโหลดและจัดการไฟล์ GeoJSON และข้อมูลพื้นฐาน
                    </p>
                </header>

                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                    <h3 style={{ fontSize: '1.5rem', color: '#1a202c', marginBottom: '1rem' }}>
                        Data Management Component
                    </h3>
                    <p style={{ color: '#718096', marginBottom: '2rem' }}>
                        เครื่องมือจัดการข้อมูลจะถูกเพิ่มที่นี่<br />
                        รวมถึงการอัปโหลด GeoJSON และข้อมูลพื้นฐานอื่นๆ
                    </p>
                    <div style={{
                        background: '#f7fafc',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '2px dashed #cbd5e0',
                        textAlign: 'left'
                    }}>
                        <p style={{ margin: 0, color: '#4a5568', fontSize: '0.875rem' }}>
                            💡 <strong>Features:</strong><br />
                            • Upload GeoJSON files (villages, districts, etc.)<br />
                            • Validate GeoJSON format<br />
                            • Preview map data before import<br />
                            • Bulk data import/export<br />
                            • Data backup and restore<br />
                            • Version control for data files
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
