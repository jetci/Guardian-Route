import { DashboardLayout } from '../../../components/layout/DashboardLayout';

/**
 * Executive Budget Page
 * Budget overview and expense tracking for executives
 */
export default function DevExecutiveBudgetPage() {
    return (
        <DashboardLayout>
            <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
                <header style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '16px',
                    marginBottom: '2rem',
                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)'
                }}>
                    <h1 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '2rem' }}>
                        💰 ภาพรวมงบประมาณ (Budget Overview)
                    </h1>
                    <p style={{ margin: 0, opacity: 0.95 }}>
                        ติดตามค่าใช้จ่ายและการจัดสรรทรัพยากร
                    </p>
                </header>

                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💰</div>
                    <h3 style={{ fontSize: '1.5rem', color: '#1a202c', marginBottom: '1rem' }}>
                        Budget Management Component
                    </h3>
                    <p style={{ color: '#718096', marginBottom: '2rem' }}>
                        ระบบจัดการงบประมาณจะถูกเพิ่มที่นี่<br />
                        รวมถึงกราฟค่าใช้จ่ายและการติดตามงบประมาณ
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
                            • Budget allocation by department<br />
                            • Expense tracking and categorization<br />
                            • Budget vs. Actual comparison<br />
                            • Spending trends visualization<br />
                            • Budget alerts and notifications<br />
                            • Financial reports export
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
