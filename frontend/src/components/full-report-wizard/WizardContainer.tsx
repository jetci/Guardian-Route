import React, { useState } from 'react';
import { useWizard } from '../../context/wizard/WizardContext';
import { useSubmitFullReport } from '../../hooks/useSubmitFullReport';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { ChevronLeft, ChevronRight, Save, Send, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface WizardContainerProps {
  children: React.ReactNode;
}

const stepTitles = [
  'ข้อมูลพื้นฐาน',
  'ประเมินความเสียหาย',
  'พื้นที่ได้รับผลกระทบ',
  'โครงสร้างพื้นฐาน',
  'ผู้ประสบภัย',
  'ทรัพยากรที่ต้องการ',
  'การตอบสนองปัจจุบัน',
  'อัปโหลดรูปภาพ',
  'วิเคราะห์ด้วย AI',
  'คำแนะนำและสรุป',
];

export const WizardContainer: React.FC<WizardContainerProps> = ({
  children,
}) => {
  const {
    state,
    nextStep,
    prevStep,
    saveDraft,
  } = useWizard();
  const { taskId } = useParams<{ taskId: string }>();
  const { isSubmitting, submitAndRedirect, validateBeforeSubmit } = useSubmitFullReport();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const progress = (state.currentStep / state.totalSteps) * 100;
  const isLastStep = state.currentStep === state.totalSteps;
  const validationError = isLastStep ? validateBeforeSubmit(state.formData) : null;

  const handleSaveDraft = async () => {
    await saveDraft();
    alert('บันทึกแบบร่างเรียบร้อย');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">
            สร้างรายงานฉบับเต็ม
          </h2>
          <span className="text-sm text-gray-600">
            ขั้นตอนที่ {state.currentStep} จาก {state.totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-600 mt-2">
          {stepTitles[state.currentStep - 1]}
        </p>
        {state.lastSaved && (
          <p className="text-xs text-gray-500 mt-1">
            บันทึกล่าสุด: {state.lastSaved.toLocaleString('th-TH')}
          </p>
        )}
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center mb-8 overflow-x-auto">
        <div className="flex space-x-2">
          {Array.from({ length: state.totalSteps }, (_, i) => i + 1).map(
            (step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                  step === state.currentStep
                    ? 'bg-blue-600 text-white'
                    : step < state.currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            )
          )}
        </div>
      </div>

      {/* Main Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{stepTitles[state.currentStep - 1]}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={state.currentStep === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          ย้อนกลับ
        </Button>

        <Button variant="outline" onClick={handleSaveDraft}>
          <Save className="mr-2 h-4 w-4" />
          บันทึกแบบร่าง
        </Button>

        {!isLastStep && (
          <Button onClick={nextStep}>
            ถัดไป
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        {isLastStep && (
          <div className="flex flex-col items-end space-y-2">
            <Button
              type="button"
              onClick={() => setShowConfirmDialog(true)}
              disabled={isSubmitting || !!validationError}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังส่งรายงาน...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  ส่งรายงาน
                </>
              )}
            </Button>
            {validationError && (
              <p className="text-sm text-red-600">{validationError}</p>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการส่งรายงาน</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการส่งรายงานฉบับเต็มนี้หรือไม่?
              <br />
              <br />
              เมื่อส่งรายงานแล้ว:
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>รายงานจะถูกส่งไปยังผู้ตรวจสอบ</li>
                <li>สถานะงานจะเปลี่ยนเป็น "รอการตรวจสอบ"</li>
                <li>คุณจะไม่สามารถแก้ไขรายงานได้จนกว่าจะได้รับการอนุมัติ</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (taskId) {
                  await submitAndRedirect({
                    taskId,
                    formData: state.formData,
                  });
                }
              }}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'กำลังส่ง...' : 'ยืนยันการส่ง'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

