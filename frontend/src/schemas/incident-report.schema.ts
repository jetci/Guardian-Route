import { z } from 'zod';

export const incidentReportSchema = z.object({
  incidentDate: z.date({
    message: 'กรุณาเลือกวันที่เกิดเหตุ',
  }),

  disasterType: z.string({
    message: 'กรุณาเลือกประเภทภัย',
  }).min(1, 'กรุณาเลือกประเภทภัย'),

  village: z.string({
    message: 'กรุณาเลือกหมู่บ้านที่ได้รับผลกระทบ',
  }).min(1, 'กรุณาเลือกหมู่บ้านที่ได้รับผลกระทบ'),

  estimatedHouseholds: z.string({
    message: 'กรุณาระบุจำนวนครัวเรือน',
  })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'จำนวนครัวเรือนต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0',
    }),

  severity: z.string({
    message: 'กรุณาเลือกระดับความรุนแรง',
  })
    .refine((val) => ['1', '2', '3', '4', '5'].includes(val), {
      message: 'กรุณาเลือกระดับความรุนแรงที่ถูกต้อง',
    }),

  notes: z.string().optional(),

  latitude: z.number({
    message: 'กรุณาใช้ GPS เพื่อระบุตำแหน่งปัจจุบัน',
  }).min(-90).max(90),

  longitude: z.number({
    message: 'กรุณาใช้ GPS เพื่อระบุตำแหน่งปัจจุบัน',
  }).min(-180).max(180),

  polygonData: z.any().optional(),

  photos: z.array(z.any()).optional(),
});

export type IncidentReportFormData = z.infer<typeof incidentReportSchema>;

// Validation helper
export function validateIncidentReport(data: Partial<IncidentReportFormData>) {
  try {
    incidentReportSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err: any) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { _general: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล' } };
  }
}
