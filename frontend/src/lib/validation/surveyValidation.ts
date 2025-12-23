/**
 * Survey Form Validation
 * Centralized validation logic for field surveys
 */

export interface ValidationErrors {
    village?: string;
    disasterType?: string;
    severity?: string;
    estimatedHouseholds?: string;
    notes?: string;
    location?: string;
}

export interface SurveyFormData {
    village?: string;
    villageName?: string;
    disasterType: string;
    severity: string;
    estimatedHouseholds: string;
    notes: string;
    latitude?: number;
    longitude?: number;
    polygon?: any;
}

export const validateSurveyForm = (data: SurveyFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Village validation
    if (!data.village && !data.villageName) {
        errors.village = 'กรุณาเลือกหมู่บ้านหรือระบุชื่อหมู่บ้าน';
    }

    // Disaster type validation
    if (!data.disasterType || data.disasterType.trim() === '') {
        errors.disasterType = 'กรุณาเลือกประเภทภัย';
    }

    // Severity validation
    const severityNum = parseInt(data.severity);
    if (!data.severity || isNaN(severityNum) || severityNum < 1 || severityNum > 5) {
        errors.severity = 'กรุณาระบุระดับความรุนแรง 1-5';
    }

    // Households validation
    const householdsNum = parseInt(data.estimatedHouseholds);
    if (!data.estimatedHouseholds || isNaN(householdsNum) || householdsNum < 0) {
        errors.estimatedHouseholds = 'กรุณาระบุจำนวนครัวเรือนที่ถูกต้อง';
    }

    // Notes validation  
    if (!data.notes || data.notes.trim().length < 10) {
        errors.notes = 'กรุณาระบุรายละเอียดอย่างน้อย 10 ตัวอักษร';
    }

    // Location validation (GPS or Polygon required)
    if (!data.latitude && !data.longitude && !data.polygon) {
        errors.location = 'กรุณาระบุตำแหน่ง GPS หรือวาดพื้นที่บนแผนที่';
    }

    return errors;
};
