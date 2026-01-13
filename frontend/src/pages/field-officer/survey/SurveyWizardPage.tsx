import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { tasksApi } from '../../../api/tasks';
import { SurveyProvider, useSurvey } from '../../../context/SurveyContext';
import toast from 'react-hot-toast';

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

                // Initialize Context Data if empty (or always to sync?)
                // Only if we haven't started editing? For now, let's sync on load.
                updateData({
                    taskId: taskData.id,
                    villageId: taskData.villageId || '',
                    villageName: taskData.village?.name || '',
                    disasterType: taskData.incident?.disasterType || '',
                    // We could also pre-fill other fields if editing an existing survey
                });

            } catch (error) {
                console.error('Failed to load task:', error);
                toast.error('ไม่สามารถโหลดข้อมูลงานได้ (ใช้ข้อมูลจำลอง)');

                // Mock Data
                const mockTask = {
                    id: taskId,
                    title: 'งานสำรวจจำลอง (Offline Mode)',
                    description: 'นี่คือข้อมูลจำลองสำหรับทดสอบระบบขณะ Offline',
                    status: 'PENDING',
                    createdAt: new Date().toISOString(),
                    village: { name: 'หมู่บ้านตัวอย่าง' },
                    incident: { disasterType: 'FLOOD' },
                    villageId: '1'
                };
                setTask(mockTask);

                updateData({
                    taskId: mockTask.id,
                    villageId: mockTask.villageId,
                    villageName: mockTask.village.name,
                    disasterType: mockTask.incident.disasterType,
                    surveyDate: new Date().toISOString()
                });
            } finally {
                setLoading(false);
            }
        };
        loadTask();
    }, [taskId, navigate]); // Remove updateData from deps to avoid loop if it's not stable (it should be)

    const handleStartSurvey = () => {
        setStep(1);
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    // Render Task Details (Step 0 / Landing for this specific task)
    // Note: currentStep in context starts at 1, but we can use 0 for landing if we want, 
    // OR we can just use a local state for "started". 
    // But context has currentStep. Let's assume we want to show details first.
    // We can use a separate "started" flag or just use step 0 in context if we modify context.
    // For now, let's use a local check: if currentStep is 1 but we haven't "started" explicitly?
    // Actually, context default is 1. Let's add a "Landing" step 0 to context or just handle it here.
    // Let's assume if we are at step 1 and haven't clicked "Start", we show landing?
    // Simpler: Let's use a local state `showLanding` initialized to true.

    // Wait, the previous code used currentStep=0 for landing. 
    // Let's stick to that pattern but we need to support it in context or just handle it here.
    // If context.currentStep is 1 (default), we can still show landing if we want.
    // Let's use a local `isStarted` state.

    // Actually, let's use the context step. If I set step to 0 in context, it might break if I didn't allow it.
    // My context defined: const [currentStep, setCurrentStep] = useState(1);
    // I should probably update context to allow 0 if I want to store it there.
    // Or just use local state for the "Landing" view.

    // Let's use a local state `showLanding` which defaults to true.
    // When "Start" is clicked, set `showLanding` to false.
    // When "Back" is clicked on Step 1, set `showLanding` to true.

    const [showLanding, setShowLanding] = useState(true);

    const handleWizardBack = () => {
        if (currentStep === 1) {
            setShowLanding(true);
        } else {
            prevStep();
        }
    };

    if (showLanding) {
        return (
            <DashboardLayout>
                <div className="max-w-3xl mx-auto p-4">
                    <button onClick={() => navigate('/survey-area')} className="mb-4 text-gray-500 hover:text-gray-700">← กลับไปหน้ารายการ</button>

                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="bg-blue-600 p-6 text-white">
                            <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
                            <div className="flex gap-4 text-blue-100 text-sm">
                                <span>📅 {new Date(task.createdAt).toLocaleDateString('th-TH')}</span>
                                <span>🚨 {task.incident?.disasterType}</span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">รายละเอียด</h3>
                                <p className="text-gray-700 leading-relaxed">{task.description || 'ไม่มีรายละเอียด'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <span className="block text-xs text-gray-500 mb-1">หมู่บ้าน</span>
                                    <strong className="text-gray-800">{task.village?.name || '-'}</strong>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <span className="block text-xs text-gray-500 mb-1">สถานะ</span>
                                    <strong className="text-blue-600">{task.status}</strong>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setShowLanding(false);
                                    setStep(1);
                                }}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span>เริ่มการสำรวจ</span>
                                <span>→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout noPadding>
            <div className="h-screen flex flex-col bg-gray-50">
                {/* Wizard Header */}
                <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button onClick={handleWizardBack} className="text-gray-500 hover:text-gray-700">←</button>
                        <div>
                            <h2 className="font-bold text-gray-800">ขั้นตอนที่ {currentStep}/8</h2>
                            <p className="text-xs text-gray-500">
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
                    <div className="w-1/3 bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-600 h-full transition-all duration-300"
                            style={{ width: `${(currentStep / 8) * 100}%` }}
                        />
                    </div>
                </header>

                {/* Step Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm min-h-[300px] mb-20">
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
                <div className="bg-white border-t p-4 flex gap-3 fixed bottom-0 left-0 right-0 md:static z-10">
                    <button
                        onClick={handleWizardBack}
                        className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                    >
                        ย้อนกลับ
                    </button>
                    <button
                        onClick={nextStep}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
                    >
                        {currentStep === 8 ? 'ยืนยันข้อมูล' : 'ถัดไป'}
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
