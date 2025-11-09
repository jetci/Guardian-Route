import { z } from 'zod';
import { ReportSeverity } from '../types/full-report';

// Step 1: Basic Information
export const step1Schema = z.object({
  taskId: z.string().uuid('Task ID ไม่ถูกต้อง'),
  title: z
    .string()
    .min(10, 'ชื่อรายงานต้องมีอย่างน้อย 10 ตัวอักษร')
    .max(200, 'ชื่อรายงานต้องไม่เกิน 200 ตัวอักษร'),
  summary: z
    .string()
    .min(100, 'สรุปต้องมีอย่างน้อย 100 ตัวอักษร')
    .max(2000, 'สรุปต้องไม่เกิน 2000 ตัวอักษร'),
});

// Step 2: Damage Assessment
export const step2Schema = z.object({
  severity: z.nativeEnum(ReportSeverity, {
    errorMap: () => ({ message: 'กรุณาเลือกระดับความรุนแรง' }),
  }),
  damageDescription: z
    .string()
    .min(200, 'รายละเอียดความเสียหายต้องมีอย่างน้อย 200 ตัวอักษร'),
  damageCategories: z
    .array(z.string())
    .min(1, 'กรุณาเลือกประเภทความเสียหายอย่างน้อย 1 ประเภท'),
});

// Step 3: Affected Area
export const step3Schema = z.object({
  affectedHouseholds: z
    .number()
    .min(0, 'จำนวนครัวเรือนต้องไม่ติดลบ')
    .int('จำนวนครัวเรือนต้องเป็นจำนวนเต็ม'),
  affectedPopulation: z
    .number()
    .min(0, 'จำนวนประชากรต้องไม่ติดลบ')
    .int('จำนวนประชากรต้องเป็นจำนวนเต็ม'),
  affectedAreaDescription: z
    .string()
    .min(50, 'รายละเอียดพื้นที่ต้องมีอย่างน้อย 50 ตัวอักษร'),
});

// Step 4: Infrastructure Damage
export const step4Schema = z.object({
  infrastructureTypes: z
    .array(z.string())
    .min(1, 'กรุณาเลือกประเภทโครงสร้างอย่างน้อย 1 ประเภท'),
  infrastructureDetails: z
    .string()
    .min(50, 'รายละเอียดความเสียหายต้องมีอย่างน้อย 50 ตัวอักษร'),
  estimatedRepairCost: z.number().min(0).optional(),
});

// Step 5: Casualties
export const step5Schema = z
  .object({
    casualties: z.number().min(0, 'จำนวนต้องไม่ติดลบ').int(),
    injuries: z.number().min(0, 'จำนวนต้องไม่ติดลบ').int(),
    missing: z.number().min(0, 'จำนวนต้องไม่ติดลบ').int(),
    casualtyDetails: z.string().optional(),
  })
  .refine(
    (data) => {
      // If any casualties, details required
      if (data.casualties > 0 || data.injuries > 0 || data.missing > 0) {
        return !!data.casualtyDetails && data.casualtyDetails.length >= 50;
      }
      return true;
    },
    {
      message:
        'กรุณาระบุรายละเอียดผู้ประสบภัยเมื่อมีผู้เสียชีวิต บาดเจ็บ หรือสูญหาย',
      path: ['casualtyDetails'],
    }
  );

// Step 6: Resources Needed
export const step6Schema = z.object({
  resourceCategories: z
    .array(z.string())
    .min(1, 'กรุณาเลือกประเภททรัพยากรอย่างน้อย 1 ประเภท'),
  resourceDetails: z
    .string()
    .min(50, 'รายละเอียดทรัพยากรต้องมีอย่างน้อย 50 ตัวอักษร'),
  urgentPriorityItems: z.array(z.string()),
});

// Step 7: Current Response
export const step7Schema = z.object({
  responseStatus: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'], {
    errorMap: () => ({ message: 'กรุณาเลือกสถานะการตอบสนอง' }),
  }),
  responseDescription: z
    .string()
    .min(100, 'รายละเอียดการตอบสนองต้องมีอย่างน้อย 100 ตัวอักษร'),
  respondingAgencies: z.array(z.string()),
  resourcesDeployed: z.string().optional(),
});

// Step 8: Images (validation in component)
export const step8Schema = z.object({
  images: z.array(z.any()),
  imageUrls: z.array(z.string()),
});

// Step 9: AI Analysis (optional, validated in component)
export const step9Schema = z.object({
  aiAnalysis: z.any().nullable(),
  aiAnalysisEdited: z.string().optional(),
  aiAnalysisModified: z.boolean(),
});

// Step 10: Recommendations
export const step10Schema = z.object({
  shortTermRecommendations: z
    .string()
    .min(100, 'คำแนะนำระยะสั้นต้องมีอย่างน้อย 100 ตัวอักษร'),
  longTermRecommendations: z
    .string()
    .min(100, 'คำแนะนำระยะยาวต้องมีอย่างน้อย 100 ตัวอักษร'),
  preventiveMeasures: z
    .string()
    .min(50, 'มาตรการป้องกันต้องมีอย่างน้อย 50 ตัวอักษร'),
  priorityActions: z.array(z.string()),
});

// Complete form validation
export const fullReportSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema)
  .merge(step6Schema)
  .merge(step7Schema)
  .merge(step8Schema)
  .merge(step9Schema)
  .merge(step10Schema);
