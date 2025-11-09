import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWizard } from '../../../context/wizard/WizardContext';
import { step5Schema } from '../../../validation/full-report-schemas';
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
import { AlertCircle } from 'lucide-react';

type Step5FormData = z.infer<typeof step5Schema>;

export const Step5Casualties: React.FC = () => {
  const { state, updateFormData } = useWizard();

  const form = useForm<Step5FormData>({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      casualties: state.formData.casualties,
      injuries: state.formData.injuries,
      missing: state.formData.missing,
      casualtyDetails: state.formData.casualtyDetails,
    },
  });

  const casualties = form.watch('casualties');
  const injuries = form.watch('injuries');
  const missing = form.watch('missing');
  const hasCasualties = casualties > 0 || injuries > 0 || missing > 0;

  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value as Partial<Step5FormData>);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateFormData]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="casualties"
            render={({ field }) => (
              <FormItem>
                <FormLabel>จำนวนผู้เสียชีวิต</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription>จำนวนผู้เสียชีวิต</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="injuries"
            render={({ field }) => (
              <FormItem>
                <FormLabel>จำนวนผู้บาดเจ็บ</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription>จำนวนผู้บาดเจ็บ</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="missing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>จำนวนผู้สูญหาย</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription>จำนวนผู้สูญหาย</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {hasCasualties && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">
                  ⚠️ จำเป็นต้องระบุรายละเอียด
                </h4>
                <p className="text-sm text-red-800">
                  เนื่องจากมีผู้ประสบภัย กรุณาระบุรายละเอียดเพิ่มเติมด้านล่าง
                </p>
              </div>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="casualtyDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                รายละเอียดผู้ประสบภัย
                {hasCasualties && <span className="text-red-600"> *</span>}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="ระบุรายละเอียดผู้ประสบภัย เช่น ช่วงอายุ, สาเหตุ, สถานที่, การช่วยเหลือ..."
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {hasCasualties ? (
                  <>
                    กรุณาระบุรายละเอียดผู้ประสบภัยอย่างละเอียด (อย่างน้อย 50
                    ตัวอักษร)
                    <br />
                    <span className="text-sm text-gray-500">
                      {field.value?.length || 0} ตัวอักษร
                    </span>
                  </>
                ) : (
                  'ระบุรายละเอียดเพิ่มเติม (ถ้ามี)'
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {!hasCasualties && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">
              ✅ ไม่มีผู้ประสบภัย
            </h4>
            <p className="text-sm text-green-800">
              หากไม่มีผู้เสียชีวิต บาดเจ็บ หรือสูญหาย
              สามารถข้ามไปขั้นตอนถัดไปได้เลย
            </p>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">
            📋 แนวทางการบันทึกข้อมูลผู้ประสบภัย
          </h4>
          <ul className="text-sm text-gray-800 space-y-1">
            <li>• ระบุจำนวนและช่วงอายุของผู้ประสบภัย</li>
            <li>• อธิบายสาเหตุและสถานการณ์ที่เกิดเหตุ</li>
            <li>• ระบุการช่วยเหลือที่ได้รับ</li>
            <li>• ระบุสถานที่รักษาพยาบาล (ถ้ามี)</li>
          </ul>
        </div>
      </form>
    </Form>
  );
};
