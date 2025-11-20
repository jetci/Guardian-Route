import { DashboardLayout } from '../../../components/layout/DashboardLayout';

/**
 * Test: Survey Form Page
 * Developer shortcut to test the Survey Form with Leaflet Draw
 */
export default function TestSurveyFormPage() {
    return (
        <DashboardLayout>
            <div style={{ padding: '2rem' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    padding: '1.5rem 2rem',
                    borderRadius: '16px',
                    marginBottom: '2rem',
                    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)'
                }}>
                    <h2 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                        🧪 Testing Mode: Survey Form
                    </h2>
                    <p style={{ margin: 0, opacity: 0.95 }}>
                        นี่คือ Developer Shortcut - ทดสอบแผนที่สำรวจและ Leaflet Draw โดยตรง
                    </p>
                </div>

                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
                    <h3 style={{ fontSize: '1.5rem', color: '#1a202c', marginBottom: '1rem' }}>
                        Survey Form Component
                    </h3>
                    <p style={{ color: '#718096', marginBottom: '2rem' }}>
                        Survey Form component จะถูกเพิ่มที่นี่<br />
                        สำหรับทดสอบการวาดแปลงที่ดินและบันทึกพิกัด GeoJSON
                    </p>
                    <div style={{
                        background: '#f7fafc',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '2px dashed #cbd5e0'
                    }}>
                        <p style={{ margin: 0, color: '#4a5568', fontSize: '0.875rem' }}>
                            💡 <strong>Features to test:</strong><br />
                            • Leaflet Draw tools (Polygon, Marker, etc.)<br />
                            • GeoJSON export/import<br />
                            • GPS location capture<br />
                            • Form validation
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
