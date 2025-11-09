import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWizard } from '../../../context/wizard/WizardContext';
import { step2Schema } from '../../../validation/full-report-schemas';
import { ReportSeverity } from '../../../types/full-report';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Textarea } from '../../ui/textarea';
import { Checkbox } from '../../ui/checkbox';

type Step2FormData = z.infer<typeof step2Schema>;

const damageCategories = [
  { value: 'STRUCTURAL', label: 'โครงสร้างอาคาร' },
  { value: 'ENVIRONMENTAL', label: 'สิ่งแวดล้อม' },
  { value: 'ECONOMIC', label: 'เศรษฐกิจ' },
  { value: 'SOCIAL', label: 'สังคม' },
];

const severityLabels = {
  [ReportSeverity.LOW]: 'ต่ำ',
  [ReportSeverity.MEDIUM]: 'ปานกลาง',
  [ReportSeverity.HIGH]: 'สูง',
  [ReportSeverity.CRITICAL]: 'วิกฤต',
};

export const Step2DamageAssessment: React.FC = () => {
  const { state, updateFormData } = useWizard();

  const form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      severity: state.formData.severity,
      damageDescription: state.formData.damageDescription,
      damageCategories: state.formData.damageCategories,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value as Partial<Step2FormData>);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateFormData]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ระดับความรุนแรง *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกระดับความรุนแรง" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(severityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                ประเมินระดับความรุนแรงของภัยพิบัติโดยรวม
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="damageCategories"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>ประเภทความเสียหาย *</FormLabel>
                <FormDescription>
                  เลือกประเภทความเสียหายที่เกิดขึ้น (เลือกได้หลายรายการ)
                </FormDescription>
              </div>
              {damageCategories.map((item) => (
                <FormField
                  key={item.value}
                  control={form.control}
                  name="damageCategories"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.value}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.value])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.value
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="damageDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รายละเอียดความเสียหาย *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="อธิบายรายละเอียดความเสียหายที่เกิดขึ้นอย่างละเอียด..."
                  rows={10}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                อธิบายความเสียหายอย่างละเอียดและเป็นระบบ (อย่างน้อย 200 ตัวอักษร)
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
            📋 แนวทางการประเมินความเสียหาย
          </h4>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• ระบุประเภทและขอบเขตของความเสียหาย</li>
            <li>• ประเมินมูลค่าความเสียหายเบื้องต้น (ถ้ามี)</li>
            <li>• ระบุพื้นที่ที่ได้รับผลกระทบ</li>
            <li>• อธิบายผลกระทบต่อชุมชนและสิ่งแวดล้อม</li>
          </ul>
        </div>
      </form>
    </Form>
  );
};
