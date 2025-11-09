import React, { useState, useEffect } from 'react';
import { useWizard } from '../../../context/wizard/WizardContext';
import { AIAnalysisResult } from '../../../types/full-report';
import { AIAnalysisCard } from '../AIAnalysisCard';
import {
  Form,
  FormDescription,
  FormItem,
  FormLabel,
} from '../../ui/form';
import { Button } from '../../ui/button';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '../../ui/skeleton';

export const Step9AIAnalysis: React.FC = () => {
  const { state, updateFormData } = useWizard();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(
    state.formData.aiAnalysis || null
  );
  const [error, setError] = useState<string | null>(null);

  const photoUrls = state.formData.photoUrls || [];
  const hasPhotos = photoUrls.length > 0;

  const analyzeImages = async () => {
    if (!hasPhotos) {
      setError('กรุณาอัปโหลดรูปภาพก่อนวิเคราะห์');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/reports/analyze-images', {
      //   imageUrls: photoUrls,
      // });
      // setAnalysis(response.data);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock AI response
      const mockAnalysis: AIAnalysisResult = {
        damageLevel: 'สูง - ความเสียหายรุนแรง',
        affectedStructures:
          'อาคารบ้านเรือน 15 หลัง, ถนนคอนกรีต 200 เมตร, สะพานไม้ 1 แห่ง',
        estimatedAffectedArea: 5000,
        visibleHazards:
          'น้ำท่วมขัง, ซากปรักหักพัง, สายไฟฟ้าขาด, ต้นไม้ล้ม',
        recommendations:
          '1. อพยพประชาชนออกจากพื้นที่เสี่ยง\n2. ตัดกระแสไฟฟ้าในพื้นที่\n3. ส่งทีมกู้ภัยเข้าช่วยเหลือ\n4. จัดหาที่พักชั่วคราว\n5. ประเมินความเสียหายโดยละเอียด',
        confidence: 0.87,
      };

      setAnalysis(mockAnalysis);
      updateFormData({ aiAnalysis: mockAnalysis });
    } catch (err) {
      setError('ไม่สามารถวิเคราะห์ภาพได้ กรุณาลองใหม่อีกครั้ง');
      console.error('AI Analysis Error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateAnalysis = (updatedAnalysis: AIAnalysisResult) => {
    setAnalysis(updatedAnalysis);
    updateFormData({ aiAnalysis: updatedAnalysis });
  };

  // Auto-analyze if photos exist and no analysis yet
  useEffect(() => {
    if (hasPhotos && !analysis && !isAnalyzing && !error) {
      analyzeImages();
    }
  }, [hasPhotos]);

  return (
    <Form>
      <div className="space-y-6">
        <FormItem>
          <FormLabel>การวิเคราะห์ภาพด้วย AI</FormLabel>
          <FormDescription>
            ระบบจะวิเคราะห์รูปภาพที่อัปโหลดเพื่อให้ข้อมูลเบื้องต้นเกี่ยวกับความเสียหาย
            คุณสามารถตรวจสอบและแก้ไขข้อมูลได้
          </FormDescription>
        </FormItem>

        {!hasPhotos && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900">
                  ยังไม่มีรูปภาพ
                </h4>
                <p className="text-sm text-yellow-800">
                  กรุณากลับไปขั้นตอนที่ 8 เพื่ออัปโหลดรูปภาพก่อนวิเคราะห์
                </p>
              </div>
            </div>
          </div>
        )}

        {hasPhotos && !analysis && !isAnalyzing && !error && (
          <Button
            type="button"
            onClick={analyzeImages}
            className="w-full"
            size="lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            เริ่มวิเคราะห์ภาพด้วย AI
          </Button>
        )}

        {isAnalyzing && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-medium">กำลังวิเคราะห์ภาพ...</span>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <p className="text-sm text-gray-500 text-center">
              กระบวนการนี้อาจใช้เวลาสักครู่ กรุณารอสักครู่...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900">เกิดข้อผิดพลาด</h4>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={analyzeImages}
            >
              ลองใหม่อีกครั้ง
            </Button>
          </div>
        )}

        {analysis && !isAnalyzing && (
          <AIAnalysisCard
            analysis={analysis}
            onUpdate={handleUpdateAnalysis}
          />
        )}

        {analysis && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              💡 คำแนะนำ
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• ตรวจสอบความถูกต้องของข้อมูลที่ AI วิเคราะห์</li>
              <li>• แก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่ครบถ้วน</li>
              <li>• เพิ่มรายละเอียดเพิ่มเติมตามความเหมาะสม</li>
              <li>• การแก้ไขจะถูกบันทึกใน Audit Trail</li>
            </ul>
          </div>
        )}
      </div>
    </Form>
  );
};
