import { DashboardLayout } from '../../../components/layout/DashboardLayout';

/**
 * Admin Settings Page
 * System configuration and feature toggles
 */
export default function DevAdminSettingsPage() {
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
                        ⚙️ ตั้งค่าระบบ (System Settings)
                    </h1>
                    <p style={{ margin: 0, opacity: 0.95 }}>
                        กำหนดค่าระบบและ Feature Toggles
                    </p>
                </header>

                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚙️</div>
                    <h3 style={{ fontSize: '1.5rem', color: '#1a202c', marginBottom: '1rem' }}>
                        System Settings Component
                    </h3>
                    <p style={{ color: '#718096', marginBottom: '2rem' }}>
                        หน้าตั้งค่าระบบจะถูกเพิ่มที่นี่<br />
                        รวมถึง Config ต่างๆ และ Feature Toggles
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
                            • System configuration (API endpoints, timeouts, etc.)<br />
                            • Feature toggles (enable/disable features)<br />
                            • Email/SMS notification settings<br />
                            • Map default settings (center, zoom, etc.)<br />
                            • Security settings (password policy, session timeout)<br />
                            • Maintenance mode toggle
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
