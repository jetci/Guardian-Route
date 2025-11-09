import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWizard } from '../../../context/wizard/WizardContext';
import { step10Schema } from '../../../validation/full-report-schemas';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Textarea } from '../../ui/textarea';
import { Lightbulb } from 'lucide-react';

type Step10FormData = z.infer<typeof step10Schema>;

export const Step10Recommendations: React.FC = () => {
  const { state, updateFormData } = useWizard();

  const form = useForm<Step10FormData>({
    resolver: zodResolver(step10Schema),
    defaultValues: {
      recommendations: state.formData.recommendations,
      policyRecommendations: state.formData.policyRecommendations,
      futurePreventionMeasures: state.formData.futurePreventionMeasures,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value as Partial<Step10FormData>);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateFormData]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 text-lg mb-2">
                ขั้นตอนสุดท้าย: ข้อเสนอแนะและแนวทางการดำเนินการ
              </h3>
              <p className="text-sm text-blue-800">
                กรุณาให้ข้อเสนอแนะเชิงนโยบายและแนวทางการป้องกันในอนาคต
                เพื่อใช้ในการตัดสินใจและวางแผนระยะยาว
              </p>
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="recommendations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ข้อเสนอแนะทั่วไป *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="ข้อเสนอแนะสำหรับการดำเนินการต่อเนื่อง การฟื้นฟู และการช่วยเหลือผู้ประสบภัย..."
                  rows={10}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                ข้อเสนอแนะทั่วไปสำหรับการดำเนินการ (อย่างน้อย 100 ตัวอักษร)
                <br />
                <span className="text-sm text-gray-500">
                  {field.value?.length || 0} ตัวอักษร
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="policyRecommendations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ข้อเสนอแนะเชิงนโยบาย *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="ข้อเสนอแนะเชิงนโยบายสำหรับผู้บริหารและหน่วยงานที่เกี่ยวข้อง..."
                  rows={10}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                ข้อเสนอแนะเชิงนโยบายระดับผู้บริหาร (อย่างน้อย 100 ตัวอักษร)
                <br />
                <span className="text-sm text-gray-500">
                  {field.value?.length || 0} ตัวอักษร
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="futurePreventionMeasures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>มาตรการป้องกันในอนาคต *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="มาตรการป้องกันและลดผลกระทบจากภัยพิบัติในอนาคต..."
                  rows={10}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                มาตรการป้องกันและเตรียมความพร้อม (อย่างน้อย 100 ตัวอักษร)
                <br />
                <span className="text-sm text-gray-500">
                  {field.value?.length || 0} ตัวอักษร
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-900 mb-2">
            📋 แนวทางการเขียนข้อเสนอแนะ
          </h4>
          <div className="space-y-3 text-sm text-amber-800">
            <div>
              <strong>ข้อเสนอแนะทั่วไป:</strong>
              <ul className="list-disc ml-5 mt-1">
                <li>แนวทางการฟื้นฟูพื้นที่และชุมชน</li>
                <li>การช่วยเหลือผู้ประสบภัยระยะสั้นและระยะยาว</li>
                <li>การจัดการทรัพยากรและงบประมาณ</li>
              </ul>
            </div>
            <div>
              <strong>ข้อเสนอแนะเชิงนโยบาย:</strong>
              <ul className="list-disc ml-5 mt-1">
                <li>นโยบายการจัดการภัยพิบัติ</li>
                <li>การประสานงานระหว่างหน่วยงาน</li>
                <li>การจัดสรรงบประมาณและทรัพยากร</li>
              </ul>
            </div>
            <div>
              <strong>มาตรการป้องกันในอนาคต:</strong>
              <ul className="list-disc ml-5 mt-1">
                <li>ระบบเตือนภัยและการสื่อสาร</li>
                <li>โครงสร้างพื้นฐานที่ทนทานต่อภัย</li>
                <li>การฝึกอบรมและสร้างความตระหนัก</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">
            ✅ พร้อมส่งรายงาน
          </h4>
          <p className="text-sm text-green-800">
            เมื่อกรอกข้อมูลครบถ้วนแล้ว คุณสามารถกดปุ่ม "ส่งรายงาน" ด้านล่าง
            เพื่อส่งรายงานฉบับเต็มไปยังผู้ตรวจสอบ
          </p>
        </div>
      </form>
    </Form>
  );
};
