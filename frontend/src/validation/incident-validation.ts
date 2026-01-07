/**
 * Shared Validation Schema for Incident Reports
 * Used by both Frontend and Backend to ensure consistency
 */

export interface IncidentValidationErrors {
  village?: string;
  disasterType?: string;
  severity?: string;
  estimatedHouseholds?: string;
  notes?: string;
  location?: string;
  polygon?: string;
  incidentDate?: string;
}

export interface IncidentFormData {
  village: string;
  disasterType: string;
  severity: string;
  estimatedHouseholds: string;
  notes: string;
  latitude: number | null;
  longitude: number | null;
  polygonData: any;
  incidentDate: Date | null;
}

/**
 * Validate incident form data
 * Returns object with error messages for each field
 */
export function validateIncidentForm(data: IncidentFormData): IncidentValidationErrors {
  const errors: IncidentValidationErrors = {};

  // Village validation
  if (!data.village || data.village.trim().length === 0) {
    errors.village = 'กรุณาเลือกหมู่บ้าน';
  }

  // Disaster type validation
  if (!data.disasterType || data.disasterType.trim().length === 0) {
    errors.disasterType = 'กรุณาเลือกประเภทภัย';
  }

  // Severity validation
  const severityNum = parseInt(data.severity);
  if (!data.severity || isNaN(severityNum)) {
    errors.severity = 'กรุณาระบุระดับความรุนแรง';
  } else if (severityNum < 1 || severityNum > 5) {
    errors.severity = 'ระดับความรุนแรงต้องอยู่ระหว่าง 1-5';
  }

  // Estimated households validation
  if (data.estimatedHouseholds && data.estimatedHouseholds.trim().length > 0) {
    const households = parseInt(data.estimatedHouseholds);
    if (isNaN(households)) {
      errors.estimatedHouseholds = 'จำนวนครัวเรือนต้องเป็นตัวเลข';
    } else if (households < 0) {
      errors.estimatedHouseholds = 'จำนวนครัวเรือนต้องมากกว่าหรือเท่ากับ 0';
    } else if (households > 10000) {
      errors.estimatedHouseholds = 'จำนวนครัวเรือนสูงเกินไป (สูงสุด 10,000)';
    }
  }

  // Notes validation
  if (!data.notes || data.notes.trim().length === 0) {
    errors.notes = 'กรุณาระบุรายละเอียด';
  } else if (data.notes.trim().length < 10) {
    errors.notes = 'รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร';
  } else if (data.notes.trim().length > 2000) {
    errors.notes = 'รายละเอียดต้องไม่เกิน 2,000 ตัวอักษร';
  }

  // Location validation
  if (!data.latitude || !data.longitude) {
    errors.location = 'กรุณาใช้ GPS เพื่อระบุตำแหน่ง';
  } else {
    // Validate Thailand bounds (approximately)
    const lat = data.latitude;
    const lng = data.longitude;
    
    if (lat < 5.0 || lat > 21.0) {
      errors.location = 'ตำแหน่ง GPS อยู่นอกประเทศไทย (ละติจูดผิดปกติ)';
    }
    
    if (lng < 97.0 || lng > 106.0) {
      errors.location = 'ตำแหน่ง GPS อยู่นอกประเทศไทย (ลองจิจูดผิดปกติ)';
    }
  }

  // Polygon validation
  if (!data.polygonData) {
    errors.polygon = 'กรุณาวาดพื้นที่ที่ได้รับผลกระทบบนแผนที่';
  } else {
    // Validate polygon has minimum points (must be at least 4 points)
    try {
      const coords = data.polygonData?.geometry?.coordinates?.[0];
      if (!coords || coords.length < 4) {
        errors.polygon = 'พื้นที่ต้องมีอย่างน้อย 4 จุด';
      }
    } catch (e) {
      errors.polygon = 'ข้อมูลพื้นที่ไม่ถูกต้อง';
    }
  }

  // Incident date validation
  if (!data.incidentDate) {
    errors.incidentDate = 'กรุณาระบุวันที่เกิดเหตุ';
  } else {
    const now = new Date();
    const incidentDate = new Date(data.incidentDate);
    
    // Check if date is in the future
    if (incidentDate > now) {
      errors.incidentDate = 'วันที่เกิดเหตุต้องไม่เกินวันปัจจุบัน';
    }
    
    // Check if date is too far in the past (more than 1 year)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (incidentDate < oneYearAgo) {
      errors.incidentDate = 'วันที่เกิดเหตุต้องไม่เกิน 1 ปีที่ผ่านมา';
    }
  }

  return errors;
}

/**
 * Check if form has any validation errors
 */
export function hasValidationErrors(errors: IncidentValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Get first error message
 */
export function getFirstError(errors: IncidentValidationErrors): string | null {
  const firstKey = Object.keys(errors)[0];
  return firstKey ? errors[firstKey as keyof IncidentValidationErrors] || null : null;
}

/**
 * Get all error messages as array
 */
export function getAllErrors(errors: IncidentValidationErrors): string[] {
  return Object.values(errors).filter((msg): msg is string => !!msg);
}

/**
 * Validate single field
 */
export function validateField(
  fieldName: keyof IncidentFormData,
  value: any,
  allData: Partial<IncidentFormData>
): string | undefined {
  const tempData: IncidentFormData = {
    village: '',
    disasterType: '',
    severity: '',
    estimatedHouseholds: '',
    notes: '',
    latitude: null,
    longitude: null,
    polygonData: null,
    incidentDate: null,
    ...allData,
    [fieldName]: value
  };
  
  const errors = validateIncidentForm(tempData);
  return errors[fieldName as keyof IncidentValidationErrors];
}
