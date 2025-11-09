import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWizard } from '../../../context/wizard/WizardContext';
import { step4Schema } from '../../../validation/full-report-schemas';
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
import { Checkbox } from '../../ui/checkbox';

type Step4FormData = z.infer<typeof step4Schema>;

const infrastructureTypes = [
  { value: 'ROADS', label: 'ถนน' },
  { value: 'BRIDGES', label: 'สะพาน' },
  { value: 'BUILDINGS', label: 'อาคาร' },
  { value: 'UTILITIES', label: 'สาธารณูปโภค' },
  { value: 'SCHOOLS', label: 'โรงเรียน' },
  { value: 'HOSPITALS', label: 'โรงพยาบาล' },
  { value: 'WATER_SUPPLY', label: 'ระบบน้ำประปา' },
  { value: 'POWER_GRID', label: 'ระบบไฟฟ้า' },
];

export const Step4Infrastructure: React.FC = () => {
  const { state, updateFormData } = useWizard();

  const form = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      infrastructureTypes: state.formData.infrastructureTypes,
      infrastructureDetails: state.formData.infrastructureDetails,
      estimatedRepairCost: state.formData.estimatedRepairCost,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value as Partial<Step4FormData>);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateFormData]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="infrastructureTypes"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>ประเภทโครงสร้างพื้นฐานที่ได้รับความเสียหาย *</FormLabel>
                <FormDescription>
                  เลือกประเภทโครงสร้างที่ได้รับความเสียหาย (เลือกได้หลายรายการ)
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infrastructureTypes.map((item) => (
                  <FormField
                    key={item.value}
                    control={form.control}
                    name="infrastructureTypes"
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
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="infrastructureDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รายละเอียดความเสียหายของโครงสร้างพื้นฐาน *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="อธิบายความเสียหายของแต่ละโครงสร้างอย่างละเอียด..."
                  rows={10}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                อธิบายความเสียหายของโครงสร้างพื้นฐานอย่างละเอียด (อย่างน้อย 50 ตัวอักษร)
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
          name="estimatedRepairCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ประเมินค่าใช้จ่ายในการซ่อมแซม (บาท)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || undefined)
                  }
                />
              </FormControl>
              <FormDescription>
                ประเมินค่าใช้จ่ายในการซ่อมแซมเบื้องต้น (ถ้ามีข้อมูล)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-semibold text-orange-900 mb-2">
            🏗️ แนวทางการประเมินโครงสร้างพื้นฐาน
          </h4>
          <ul className="text-sm text-orange-800 space-y-1">
            <li>• ระบุประเภทและจำนวนโครงสร้างที่ได้รับความเสียหาย</li>
            <li>• อธิบายระดับความเสียหาย (เล็กน้อย, ปานกลาง, รุนแรง)</li>
            <li>• ประเมินผลกระทบต่อการใช้งาน</li>
            <li>• ระบุความจำเป็นในการซ่อมแซมเร่งด่วน</li>
          </ul>
        </div>
      </form>
    </Form>
  );
};
