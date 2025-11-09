import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AIAnalysisResult } from '../../types/full-report';
import { useAuditTrail } from '../../hooks/useAuditTrail';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Sparkles, Edit2, Save, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AIAnalysisCardProps {
  analysis: AIAnalysisResult;
  onUpdate: (updatedAnalysis: AIAnalysisResult) => void;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({
  analysis,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { logAIEdit } = useAuditTrail();

  const form = useForm<AIAnalysisResult>({
    defaultValues: analysis,
  });

  const handleSave = () => {
    const updatedData = form.getValues();
    
    // Log changes for audit trail
    Object.keys(updatedData).forEach((key) => {
      const originalValue = analysis[key as keyof AIAnalysisResult];
      const newValue = updatedData[key as keyof AIAnalysisResult];
      
      if (JSON.stringify(originalValue) !== JSON.stringify(newValue)) {
        logAIEdit(key, originalValue, newValue);
      }
    });

    onUpdate(updatedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    form.reset(analysis);
    setIsEditing(false);
  };

  return (
    <Card className="border-2 border-purple-200 bg-purple-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-purple-900">
              ผลการวิเคราะห์จาก AI
            </CardTitle>
          </div>
          {!isEditing ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              แก้ไข
            Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleSave}
              >
                <Save className="mr-2 h-4 w-4" />
                บันทึก
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                <X className="mr-2 h-4 w-4" />
                ยกเลิก
              </Button>
            </div>
          )}
        </div>
        <CardDescription>
          ข้อมูลนี้ได้จากการวิเคราะห์รูปภาพด้วย AI คุณสามารถตรวจสอบและแก้ไขได้
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="damageLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ระดับความเสียหาย</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      className={cn(!isEditing && 'bg-white')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="affectedStructures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>โครงสร้างที่ได้รับผลกระทบ</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!isEditing}
                      className={cn(!isEditing && 'bg-white')}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedAffectedArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>พื้นที่ที่ได้รับผลกระทบ (ตร.ม.)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      disabled={!isEditing}
                      className={cn(!isEditing && 'bg-white')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibleHazards"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>อันตรายที่มองเห็นได้</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!isEditing}
                      className={cn(!isEditing && 'bg-white')}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recommendations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ข้อเสนอแนะเบื้องต้น</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!isEditing}
                      className={cn(!isEditing && 'bg-white')}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {analysis.confidence && (
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <strong>ความเชื่อมั่นของ AI:</strong>{' '}
                  {(analysis.confidence * 100).toFixed(0)}%
                </p>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
