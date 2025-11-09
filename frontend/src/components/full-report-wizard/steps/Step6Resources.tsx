import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWizard } from '../../../context/wizard/WizardContext';
import { step6Schema } from '../../../validation/full-report-schemas';
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
import { Button } from '../../ui/button';
import { Plus, X } from 'lucide-react';

type Step6FormData = z.infer<typeof step6Schema>;

const resourceCategories = [
  { value: 'FOOD', label: 'อาหารและเครื่องดื่ม' },
  { value: 'WATER', label: 'น้ำสะอาด' },
  { value: 'SHELTER', label: 'ที่พักพิง' },
  { value: 'MEDICAL', label: 'เวชภัณฑ์และยา' },
  { value: 'RESCUE_EQUIPMENT', label: 'อุปกรณ์กู้ภัย' },
  { value: 'TRANSPORTATION', label: 'ยานพาหนะ' },
  { value: 'COMMUNICATION', label: 'อุปกรณ์สื่อสาร' },
];

export const Step6Resources: React.FC = () => {
  const { state, updateFormData } = useWizard();

  const form = useForm<Step6FormData>({
    resolver: zodResolver(step6Schema),
    defaultValues: {
      resourceCategories: state.formData.resourceCategories,
      resourceDetails: state.formData.resourceDetails,
      urgentPriorityItems: state.formData.urgentPriorityItems || [''],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'urgentPriorityItems',
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      updateFormData(value as Partial<Step6FormData>);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateFormData]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="resourceCategories"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>ประเภททรัพยากรที่ต้องการ *</FormLabel>
                <FormDescription>
                  เลือกประเภททรัพยากรที่ต้องการ (เลือกได้หลายรายการ)
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resourceCategories.map((item) => (
                  <FormField
                    key={item.value}
                    control={form.control}
                    name="resourceCategories"
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
          name="resourceDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>รายละเอียดทรัพยากรที่ต้องการ *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="อธิบายรายละเอียดทรัพยากรที่ต้องการ จำนวน และความจำเป็น..."
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                อธิบายรายละเอียดทรัพยากรที่ต้องการอย่างละเอียด (อย่างน้อย 50
                ตัวอักษร)
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
          <FormLabel>รายการเร่งด่วนที่ต้องการ</FormLabel>
          <FormDescription className="mb-4">
            ระบุรายการที่ต้องการเร่งด่วนเป็นลำดับความสำคัญ
          </FormDescription>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <Input
                  placeholder={`รายการที่ ${index + 1}`}
                  {...form.register(`urgentPriorityItems.${index}` as const)}
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
            เพิ่มรายการ
          </Button>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900 mb-2">
            📦 แนวทางการระบุทรัพยากร
          </h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• ระบุประเภทและจำนวนทรัพยากรที่ต้องการ</li>
            <li>• จัดลำดับความสำคัญของทรัพยากร</li>
            <li>• ระบุระยะเวลาที่ต้องการทรัพยากร</li>
            <li>• ระบุสถานที่ส่งมอบทรัพยากร</li>
          </ul>
        </div>
      </form>
    </Form>
  );
};
