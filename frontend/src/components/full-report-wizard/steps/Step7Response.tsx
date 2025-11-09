import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWizard } from '../../../context/wizard/WizardContext';
import { step7Schema } from '../../../validation/full-report-schemas';
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
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Plus, X } from 'lucide-react';

type Step7FormData = z.infer<typeof step7Schema>;

const responseStatusLabels = {
  NOT_STARTED: 'ยังไม่เริ่มดำเนินการ',
  IN_PROGRESS: 'กำลังดำเนินการ',
  COMPLETED: 'ดำเนินการเสร็จสิ้น',
};

export const Step7Response: React.FC = () => {
  const { state, updateFormData } = useWizard();

  const form = useForm<Step7FormData>({
    resolver: zodResolver(step7Schema),
    defaultValues: {
      responseStatus: state.formData.responseStatus,
      responseDescription: state.formData.responseDescription,
      respondingAgencies: state.formData.respondingAgencies || [''],
      resourcesDeployed: state.formData.resourcesDeployed,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'respondingAgencies',
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value as Partial<Step7FormData>);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateFormData]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="responseStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>สถานะการตอบสนอง *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานะการตอบสนอง" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(responseStatusLabels).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                สถานะการตอบสนองต่อภัยพิบัติในปัจจุบัน
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="responseDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รายละเอียดการตอบสนอง *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="อธิบายการตอบสนองต่อภัยพิบัติ การช่วยเหลือ และการประสานงาน..."
                  rows={10}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                อธิบายการตอบสนองอย่างละเอียด (อย่างน้อย 100 ตัวอักษร)
                <br />
                <span className="text-sm text-gray-500">
                  {field.value?.length || 0} ตัวอักษร
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>หน่วยงานที่เข้าร่วมตอบสนอง</FormLabel>
          <FormDescription className="mb-4">
            ระบุชื่อหน่วยงานที่เข้าร่วมการตอบสนองภัยพิบัติ
          </FormDescription>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Input
                  placeholder={`หน่วยงานที่ ${index + 1}`}
                  {...form.register(`respondingAgencies.${index}` as const)}
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => append('')}
          >
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มหน่วยงาน
          </Button>
        </div>

        <FormField
          control={form.control}
          name="resourcesDeployed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ทรัพยากรที่ส่งไปแล้ว</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="ระบุทรัพยากรที่ส่งไปช่วยเหลือแล้ว (ถ้ามี)..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                ระบุทรัพยากรที่ส่งไปช่วยเหลือแล้ว (ถ้ามี)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <h4 className="font-semibold text-teal-900 mb-2">
            🚨 แนวทางการบันทึกการตอบสนอง
          </h4>
          <ul className="text-sm text-teal-800 space-y-1">
            <li>• ระบุหน่วยงานที่เข้าร่วมและบทบาทของแต่ละหน่วยงาน</li>
            <li>• อธิบายการประสานงานระหว่างหน่วยงาน</li>
            <li>• ระบุทรัพยากรที่ใช้ในการตอบสนอง</li>
            <li>• ระบุปัญหาและอุปสรรคในการตอบสนอง</li>
          </ul>
        </div>
      </form>
    </Form>
  );
};
