import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { tasksApi } from '../../api/tasks';
import type { Task } from '../../types';
import { AssessmentSteps } from './AssessmentSteps';
import './DetailedAssessmentPage.css';

export interface AssessmentData {
  affectedHouseholds: string;
  peopleMale: string;
  peopleFemale: string;
  peopleChildren: string;
  injured: string;
  deceased: string;
  disabled: string;
  elderly: string;
  housesDestroyed: string;
  housesDamaged: string;
  refrigerators: string;
  tvs: string;
  washingMachines: string;
  fans: string;
  cars: string;
  motorcycles: string;
  riceFields: string;
  crops: string;
  cropsType: string;
  orchards: string;
  agricultureValue: string;
  cattle: string;
  buffalo: string;
  pigs: string;
  poultry: string;
  otherAnimals: string;
  roads: string;
  utilities: string;
  schools: string;
  temples: string;
  otherInfra: string;
  reliefMeasures: string;
  waterBottles: string;
  dryFood: string;
  supplies: string;
  personnel: string;
  budget: string;
  additionalComments: string;
}

export function DetailedAssessmentPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [taskLoading, setTaskLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  const [editMode, setEditMode] = useState(false);
  const [supervisorComments, setSupervisorComments] = useState('');

  const [formData, setFormData] = useState<AssessmentData>({
    affectedHouseholds: '', peopleMale: '', peopleFemale: '', peopleChildren: '',
    injured: '', deceased: '', disabled: '', elderly: '',
    housesDestroyed: '', housesDamaged: '', refrigerators: '', tvs: '',
    washingMachines: '', fans: '', cars: '', motorcycles: '',
    riceFields: '', crops: '', cropsType: '', orchards: '', agricultureValue: '',
    cattle: '', buffalo: '', pigs: '', poultry: '', otherAnimals: '',
    roads: '', utilities: '', schools: '', temples: '', otherInfra: '',
    reliefMeasures: '', waterBottles: '', dryFood: '', supplies: '',
    personnel: '', budget: '', additionalComments: ''
  });

  // Fetch task from API
  useEffect(() => {
    if (taskId) {
      setTaskLoading(true);
      tasksApi.getById(taskId)
        .then(taskData => {
          setTask(taskData);
          setTaskLoading(false);
        })
        .catch(error => {
          console.error('Failed to load task:', error);
          setTaskLoading(false);
        });
    }
  }, [taskId]);

  useEffect(() => {
    if (task && task.status === 'REVISION_REQUIRED') {
      setEditMode(true);
      // setSupervisorComments(task.supervisorComment || '');
      // TODO: Load saved assessment data and pre-fill form
    }
  }, [task]);

  const updateField = (field: keyof AssessmentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    console.log('📋 Detailed Assessment Data:', formData);
    alert('✅ ส่งรายงานฉบับเต็มสำเร็จ!');
    navigate('/dashboard/officer');
  };

  if (taskLoading) {
    return (
      <DashboardLayout>
        <div className="error-page">
          <h2>⏳ กำลังโหลดข้อมูลงาน...</h2>
        </div>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout>
        <div className="error-page">
          <h2>❌ ไม่พบงานนี้</h2>
          <button onClick={() => navigate('/dashboard/officer')}>กลับหน้าหลัก</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="detailed-assessment-page">
        <div className="assessment-header">
          <div>
            <h2>📋 รายงานฉบับเต็ม</h2>
            <p className="task-title">{task.title}</p>
          </div>
          <span className="task-id">Task ID: {taskId}</span>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
          </div>
          <div className="progress-text">ขั้นตอน {currentStep} จาก {totalSteps}</div>
        </div>

        <div className="step-indicators">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
            <div key={step} className={`step-indicator ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}>
              {step}
            </div>
          ))}
        </div>

        {/* Revision Alert Banner */}
        {editMode && supervisorComments && (
          <div className="revision-alert">
            <h3>⚠️ งานต้องแก้ไข</h3>
            <div className="supervisor-feedback">
              <strong>💬 ความคิดเห็นจากผู้บังคับบัญชา:</strong>
              <p>{supervisorComments}</p>
              {task?.reviewedBy && (
                <small>แก้ไขโดย: {task.reviewedBy} | {task.reviewedAt}</small>
              )}
            </div>
            <p className="revision-instruction">กรุณาตรวจสอบและแก้ไขข้อมูลตามที่ระบุ</p>
          </div>
        )}

        <div className="assessment-content">
          <AssessmentSteps
            currentStep={currentStep}
            formData={formData}
            updateField={updateField}
            task={task}
          />
        </div>

        <div className="assessment-navigation">
          <button className="btn btn-secondary" onClick={prevStep} disabled={currentStep === 1}>
            ← ย้อนกลับ
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard/officer')}>
            ยกเลิก
          </button>
          {currentStep < totalSteps ? (
            <button className="btn btn-primary" onClick={nextStep}>
              ถัดไป →
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit}>
              ✅ ส่งรายงาน
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
