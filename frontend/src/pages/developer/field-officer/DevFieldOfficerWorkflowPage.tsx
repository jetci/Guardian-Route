import { DashboardLayout } from '../../../components/layout/DashboardLayout';

/**
 * Field Officer Workflow Page
 * Shows the workflow diagram and process explanation for field officers
 */
export default function DevFieldOfficerWorkflowPage() {
    return (
        <DashboardLayout>
            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '2rem',
                    borderRadius: '16px',
                    marginBottom: '2rem',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
                }}>
                    <h1 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '2rem' }}>
                        🔄 ขั้นตอนการทำงาน (Field Officer Workflow)
                    </h1>
                    <p style={{ margin: 0, opacity: 0.95 }}>
                        แผนภาพและคำอธิบายขั้นตอนการทำงานของเจ้าหน้าที่ภาคสนาม
                    </p>
                </header>

                {/* Workflow Steps */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[
                        {
                            step: 1,
                            title: 'รับมอบหมายงาน',
                            description: 'Supervisor มอบหมายงานผ่านระบบ → แจ้งเตือนทาง Email/SMS',
                            icon: '📥'
                        },
                        {
                            step: 2,
                            title: 'ตรวจสอบรายละเอียดงาน',
                            description: 'เปิดดูรายละเอียดงาน สถานที่ และข้อมูลเบื้องต้น',
                            icon: '📋'
                        },
                        {
                            step: 3,
                            title: 'ออกสำรวจพื้นที่',
                            description: 'เดินทางไปยังจุดเกิดเหตุตามพิกัดที่ระบุ',
                            icon: '🚗'
                        },
                        {
                            step: 4,
                            title: 'บันทึกข้อมูลภาคสนาม',
                            description: 'ถ่ายรูป, บันทึกพิกัด, วาดแปลงที่ดิน (ถ้ามี)',
                            icon: '📸'
                        },
                        {
                            step: 5,
                            title: 'สร้างรายงาน',
                            description: 'กรอกฟอร์มรายงานเหตุด่วนสาธารณภัย พร้อมแนบรูปภาพ',
                            icon: '📝'
                        },
                        {
                            step: 6,
                            title: 'ส่งรายงาน',
                            description: 'ส่งรายงานเข้าระบบเพื่อรอ Supervisor ตรวจสอบ',
                            icon: '📤'
                        },
                        {
                            step: 7,
                            title: 'รอการอนุมัติ',
                            description: 'Supervisor ตรวจสอบและอนุมัติรายงาน',
                            icon: '⏳'
                        },
                        {
                            step: 8,
                            title: 'เสร็จสิ้น',
                            description: 'งานเสร็จสมบูรณ์ สามารถรับงานใหม่ได้',
                            icon: '✅'
                        }
                    ].map((item) => (
                        <div key={item.step} style={{
                            background: 'white',
                            padding: '1.5rem 2rem',
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                flexShrink: 0
                            }}>
                                {item.step}
                            </div>
                            <div style={{ fontSize: '2rem', flexShrink: 0 }}>{item.icon}</div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0, marginBottom: '0.5rem', color: '#1a202c', fontSize: '1.25rem' }}>
                                    {item.title}
                                </h3>
                                <p style={{ margin: 0, color: '#718096' }}>
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tips */}
                <div style={{
                    marginTop: '2rem',
                    background: '#f7fafc',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '2px solid #e2e8f0'
                }}>
                    <h3 style={{ margin: 0, marginBottom: '1rem', color: '#1a202c' }}>
                        💡 เคล็ดลับการทำงาน
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#4a5568' }}>
                        <li>ตรวจสอบสัญญาณ GPS ก่อนออกสำรวจ</li>
                        <li>ถ่ายรูปหลายมุมเพื่อความชัดเจน</li>
                        <li>บันทึกพิกัดทุกจุดสำคัญ</li>
                        <li>กรอกข้อมูลให้ครบถ้วนก่อนส่งรายงาน</li>
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
}
