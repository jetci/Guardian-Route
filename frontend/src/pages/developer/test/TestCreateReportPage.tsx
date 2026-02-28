import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import CreateReportPage from '../../CreateReportPage';

/**
 * Test: Create Report Page
 * Developer shortcut to test the Create Report form without going through workflow
 */
export default function TestCreateReportPage() {
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
                        🧪 Testing Mode: Create Report Form
                    </h2>
                    <p style={{ margin: 0, opacity: 0.95 }}>
                        นี่คือ Developer Shortcut - ข้ามขั้นตอน Workflow เพื่อทดสอบฟอร์มโดยตรง
                    </p>
                </div>

                <CreateReportPage />
            </div>
        </DashboardLayout>
    );
}
