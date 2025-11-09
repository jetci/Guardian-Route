import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWizard } from '../../../context/wizard/WizardContext';
import { step1Schema } from '../../../validation/full-report-schemas';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';

type Step1FormData = z.infer<typeof step1Schema>;

export const Step1BasicInfo: React.FC = () => {
  const { state, updateFormData } = useWizard();

  const form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      taskId: state.formData.taskId,
      title: state.formData.title,
      summary: state.formData.summary,
    },
  });

  // Watch for changes and update context
  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value as Partial<Step1FormData>);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateFormData]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อรายงาน *</FormLabel>
              <FormControl>
                <Input
                  placeholder="เช่น รายงานสถานการณ์น้ำท่วมหมู่บ้านบ้านนา"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                ชื่อรายงานควรสื่อความหมายและระบุพื้นที่ได้ชัดเจน (10-200 ตัวอักษร)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>สรุปสถานการณ์โดยรวม *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="สรุปสถานการณ์ภัยพิบัติ ความเสียหาย และผลกระทบเบื้องต้น..."
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                สรุปสถานการณ์โดยรวมอย่างชัดเจนและครอบคลุม (100-2000 ตัวอักษร)
                <br />
                <span className="text-sm text-gray-500">
                  {field.value?.length || 0} / 2000 ตัวอักษร
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            💡 คำแนะนำในการเขียนสรุป
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• ระบุประเภทภัยพิบัติและวันเวลาที่เกิดเหตุ</li>
            <li>• สรุปความเสียหายและผลกระทบที่สำคัญ</li>
            <li>• ระบุพื้นที่และจำนวนผู้ประสบภัยโดยประมาณ</li>
            <li>• สรุปสถานะการตอบสนองในปัจจุบัน</li>
          </ul>
        </div>
      </form>
    </Form>
  );
};
