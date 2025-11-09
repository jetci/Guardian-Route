import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWizard } from '../../../context/wizard/WizardContext';
import { step3Schema } from '../../../validation/full-report-schemas';
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

type Step3FormData = z.infer<typeof step3Schema>;

export const Step3AffectedArea: React.FC = () => {
  const { state, updateFormData } = useWizard();

  const form = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      affectedHouseholds: state.formData.affectedHouseholds,
      affectedPopulation: state.formData.affectedPopulation,
      affectedAreaDescription: state.formData.affectedAreaDescription,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value as Partial<Step3FormData>);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateFormData]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="affectedHouseholds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>จำนวนครัวเรือนที่ได้รับผลกระทบ *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  จำนวนครัวเรือนที่ได้รับผลกระทบโดยตรง
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="affectedPopulation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>จำนวนประชากรที่ได้รับผลกระทบ *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  จำนวนประชากรที่ได้รับผลกระทบโดยตรง
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="affectedAreaDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รายละเอียดพื้นที่ที่ได้รับผลกระทบ *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="อธิบายพื้นที่ที่ได้รับผลกระทบ เช่น หมู่บ้าน ตำบล อำเภอ และลักษณะพื้นที่..."
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                อธิบายพื้นที่ที่ได้รับผลกระทบอย่างละเอียด (อย่างน้อย 50 ตัวอักษร)
                <br />
                <span className="text-sm text-gray-500">
                  {field.value?.length || 0} ตัวอักษร
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {state.formData.geoJsonArea && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">
              ✅ พบข้อมูลพิกัดจากการสำรวจเบื้องต้น
            </h4>
            <p className="text-sm text-green-800">
              ระบบได้นำเข้าข้อมูลพิกัดพื้นที่ภัยจากการสำรวจเบื้องต้นแล้ว
              คุณสามารถดูและแก้ไขได้ในขั้นตอนถัดไป
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            📍 แนวทางการระบุพื้นที่
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• ระบุชื่อหมู่บ้าน ตำบล อำเภอ จังหวัด</li>
            <li>• อธิบายลักษณะภูมิประเทศและการเข้าถึง</li>
            <li>• ระบุขอบเขตพื้นที่ที่ได้รับผลกระทบ</li>
            <li>• ระบุพื้นที่ใกล้เคียงที่อาจได้รับผลกระทบ</li>
          </ul>
        </div>
      </form>
    </Form>
  );
};
