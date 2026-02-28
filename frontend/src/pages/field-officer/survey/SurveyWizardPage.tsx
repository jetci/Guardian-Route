import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { tasksApi } from '../../../api/tasks';
import { SurveyProvider, useSurvey } from '../../../context/SurveyContext';
import toast from 'react-hot-toast';
import {
    ChevronLeft, ChevronRight, Calendar, AlertTriangle,
    MapPin, Info, ArrowRight, Save
} from 'lucide-react';

import Step1_IncidentInfo from '../../../components/field-officer/survey/steps/Step1_IncidentInfo';
import Step2_AffectedPeople from '../../../components/field-officer/survey/steps/Step2_AffectedPeople';
import Step3_DamageAssessment from '../../../components/field-officer/survey/steps/Step3_DamageAssessment';
import Step4_Relief from '../../../components/field-officer/survey/steps/Step4_Relief';
import Step5_Resources from '../../../components/field-officer/survey/steps/Step5_Resources';
import Step6_Operations from '../../../components/field-officer/survey/steps/Step6_Operations';
import Step7_Certification from '../../../components/field-officer/survey/steps/Step7_Certification';
import Step8_Review from '../../../components/field-officer/survey/steps/Step8_Review';

function SurveyWizardContent() {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    const {
        currentStep,
        setStep,
        nextStep,
        prevStep,
        data,
        updateData
    } = useSurvey();

    const [loading, setLoading] = useState(true);
    const [task, setTask] = useState<any>(null);
    const [showLanding, setShowLanding] = useState(true);

    // Load Task Data
    useEffect(() => {
        if (!taskId) {
            navigate('/survey-area');
            return;
        }

        const loadTask = async () => {
            try {
                const taskData = await tasksApi.getById(taskId);
                setTask(taskData);

                updateData({
                    taskId: taskData.id,
                    villageId: taskData.villageId || '',
                    villageName: taskData.village?.name || '',
                    disasterType: taskData.incident?.disasterType || '',
                });

            } catch (error) {
                console.error('Failed to load task:', error);
                toast.error('ไม่สามารถโหลดข้อมูลงานได้');
                navigate('/survey-area');
            } finally {
                setLoading(false);
            }
        };
        loadTask();
    }, [taskId, navigate]); // Removed updateData to avoid loop

    const handleWizardBack = () => {
        if (currentStep === 1) {
            setShowLanding(true);
        } else {
            prevStep();
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
            </DashboardLayout>
        );
    }

    if (showLanding) {
        return (
            <DashboardLayout>
                <div style={{ padding: '20px', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Sarabun', sans-serif" }}>
                    <button
                        onClick={() => navigate('/survey-area')}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            color: '#64748b', fontWeight: '600', marginBottom: '20px'
                        }}
                    >
                        <ChevronLeft size={20} /> กลับไปหน้ารายการ
                    </button>

                    <div style={{
                        background: 'white', borderRadius: '24px', overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9'
                    }}>
                        {/* Header Banner */}
                        <div style={{
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            padding: '32px 24px', color: 'white', position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />

                            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px', lineHeight: 1.3 }}>
                                {task.title}
                            </h1>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '100px' }}>
                                    <Calendar size={14} color="white" />
                                    <span>{new Date(task.createdAt).toLocaleDateString('th-TH')}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '100px' }}>
                                    <AlertTriangle size={14} color="white" />
                                    <span>{task.incident?.disasterType}</span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '24px' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                    รายละเอียด
                                </h3>
                                <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.6 }}>
                                    {task.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>หมู่บ้าน</span>
                                    <strong style={{ fontSize: '15px', color: '#0f172a' }}>{task.village?.name || '-'}</strong>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>สถานะ</span>
                                    <strong style={{ fontSize: '15px', color: '#2563eb' }}>{task.status}</strong>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setShowLanding(false);
                                    setStep(1);
                                }}
                                style={{
                                    width: '100%', padding: '18px',
                                    background: '#2563eb', color: 'white',
                                    border: 'none', borderRadius: '16px',
                                    fontSize: '16px', fontWeight: '700',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.4)',
                                    transition: 'transform 0.1s'
                                }}
                            >
                                <span>เริ่มการสำรวจ</span>
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Wizard Rendering
    return (
        <DashboardLayout noPadding>
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', fontFamily: "'Sarabun', sans-serif" }}>
                {/* Wizard Header */}
                <header style={{
                    background: 'white', padding: '12px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)', position: 'sticky', top: 0, zIndex: 20
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={handleWizardBack}
                            style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: '#64748b' }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: 0 }}>ขั้นตอนที่ {currentStep}/8</h2>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                                {currentStep === 1 && 'ข้อมูลเหตุการณ์'}
                                {currentStep === 2 && 'ผู้ประสบภัย'}
                                {currentStep === 3 && 'ความเสียหาย'}
                                {currentStep === 4 && 'การบรรเทาภัย'}
                                {currentStep === 5 && 'ทรัพยากร'}
                                {currentStep === 6 && 'การดำเนินงาน'}
                                {currentStep === 7 && 'การรับรอง'}
                                {currentStep === 8 && 'ตรวจสอบข้อมูล'}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Progress Bar */}
                <div style={{ height: '4px', background: '#e2e8f0', width: '100%' }}>
                    <div
                        style={{
                            height: '100%', background: '#2563eb',
                            width: `${(currentStep / 8) * 100}%`,
                            transition: 'width 0.3s ease-out'
                        }}
                    />
                </div>

                {/* Step Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '100px' }}>
                    <div style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        {currentStep === 1 && <Step1_IncidentInfo data={data} updateData={updateData} />}
                        {currentStep === 2 && <Step2_AffectedPeople data={data} updateData={updateData} />}
                        {currentStep === 3 && <Step3_DamageAssessment data={data} updateData={updateData} />}
                        {currentStep === 4 && <Step4_Relief data={data} updateData={updateData} />}
                        {currentStep === 5 && <Step5_Resources data={data} updateData={updateData} />}
                        {currentStep === 6 && <Step6_Operations data={data} updateData={updateData} />}
                        {currentStep === 7 && <Step7_Certification data={data} updateData={updateData} />}
                        {currentStep === 8 && <Step8_Review data={data} updateData={updateData} />}
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{
                    background: 'white', borderTop: '1px solid #f1f5f9', padding: '16px 20px',
                    display: 'flex', gap: '12px', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10,
                    // If dashboard has sidebar, we might need padding-left 280px on desktop, but for mobile it's fine.
                    // Assuming mobile first, fixed is okay. On desktop DashboardLayout might handle wrapping.
                    // But 'noPadding' prop on DashboardLayout usually means full width.
                    // To be safe on desktop with Sidebar, we might want 'sticky' instead or ensure context.
                    // Let's use sticky in a footer container if not 'fixed'. 
                    // But 'fixed' ensures it's always visible on mobile.
                }}>
                    <button
                        onClick={handleWizardBack}
                        style={{
                            flex: 1, padding: '14px', borderRadius: '14px',
                            border: '1px solid #cbd5e1', background: 'white',
                            color: '#475569', fontWeight: '700', fontSize: '15px', cursor: 'pointer'
                        }}
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        onClick={nextStep}
                        style={{
                            flex: 1, padding: '14px', borderRadius: '14px',
                            border: 'none', background: '#2563eb',
                            color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}
                    >
                        {currentStep === 8 ? (
                            <>
                                <Save size={18} /> ยืนยันข้อมูล
                            </>
                        ) : (
                            <>
                                ถัดไป <ChevronRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default function SurveyWizardPage() {
    return (
        <SurveyProvider>
            <SurveyWizardContent />
        </SurveyProvider>
    );
}
