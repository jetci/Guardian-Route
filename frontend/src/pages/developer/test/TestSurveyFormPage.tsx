import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { SurveyFormContent } from '../../../components/survey/SurveyFormContent';

/**
 * Test: Survey Form Page
 * Developer shortcut to test the Survey Form with Leaflet Draw
 * Uses SurveyFormContent component (without nested DashboardLayout)
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
                        นี่คือ Developer Shortcut - ทดสอบแผนที่สำรวจและ Leaflet Geoman Draw โดยตรง
                    </p>
                    <div style={{ 
                        marginTop: '1rem', 
                        padding: '0.75rem', 
                        background: 'rgba(255,255,255,0.2)', 
                        borderRadius: '8px',
                        fontSize: '0.875rem'
                    }}>
                        ✅ <strong>Features:</strong> GPS Location • Geoman Drawing Tools • Village Boundaries • Area Calculation • Image Upload
                    </div>
                </div>

                {/* Render Survey Form Content (no nested DashboardLayout) */}
                <SurveyFormContent />
            </div>
        </DashboardLayout>
    );
}
