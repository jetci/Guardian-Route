# 🟢 Medium Priority Issues (#7-10) - Implementation Guide

**Status:** Ready to Implement  
**Estimated Time:** 2 days  
**Priority:** Medium (P3)

---

## Issue #7: แก้ไข Map Race Condition

### ปัญหา
ใช้ `setTimeout` หลายจุดใน `InitialSurveyPage.tsx` ทำให้เกิด race condition

### ตำแหน่งที่พบ
```typescript
// Line 102: Map initialization
setTimeout(() => { /* init map */ }, 0);

// Line 174: Geoman tools disable
setTimeout(() => {
  Object.keys((map as any).pm.Toolbar.buttons).forEach(...)
}, 0);

// Line 199, 203: Fullscreen
setTimeout(() => map.invalidateSize(), 100);

// Line 276: Force resize
setTimeout(() => map.invalidateSize(), 100);

// Line 306: Resize handler
const timer = setTimeout(() => {
  if (mapRef.current) mapRef.current.invalidateSize();
}, 100);
```

### วิธีแก้ไข

#### 1. ใช้ Geoman Events แทน setTimeout

```typescript
// ❌ เดิม
setTimeout(() => {
  Object.keys((map as any).pm.Toolbar.buttons).forEach(key => {
    const button = (map as any).pm.Toolbar.buttons[key];
    if (button && button.disable) {
      button.disable();
    }
  });
}, 0);

// ✅ ใหม่ - ใช้ Geoman events
map.on('pm:globaldrawmodetoggled', (e) => {
  console.log('Draw mode toggled:', e.enabled);
});

map.on('pm:globalremovalmodetoggled', (e) => {
  console.log('Removal mode toggled:', e.enabled);
});

// Disable tools properly
map.pm.disableDraw();
map.pm.disableGlobalRemovalMode();
```

#### 2. ใช้ ResizeObserver แทน setTimeout

```typescript
// ❌ เดิม
setTimeout(() => map.invalidateSize(), 100);

// ✅ ใหม่
useEffect(() => {
  if (!mapRef.current) return;
  
  const resizeObserver = new ResizeObserver(() => {
    mapRef.current?.invalidateSize();
  });
  
  const mapContainer = document.getElementById('survey-map');
  if (mapContainer) {
    resizeObserver.observe(mapContainer);
  }
  
  return () => resizeObserver.disconnect();
}, []);
```

#### 3. ใช้ requestAnimationFrame

```typescript
// ❌ เดิม
setTimeout(() => map.invalidateSize(), 100);

// ✅ ใหม่
requestAnimationFrame(() => {
  map.invalidateSize();
});
```

### Acceptance Criteria
- [ ] ไม่มี setTimeout ใน map initialization
- [ ] ใช้ Geoman events สำหรับ tool state
- [ ] ใช้ ResizeObserver สำหรับ resize handling
- [ ] Map แสดงผลถูกต้องทุกครั้ง

---

## Issue #8: Inconsistent Status Labels

### ปัญหา
Status labels ไม่สอดคล้องกันระหว่าง frontend และ backend

### Status ที่พบ

**Backend (FieldSurveyStatus):**
- DRAFT
- SUBMITTED
- REVIEWED
- APPROVED
- REJECTED

**Frontend (หลายแบบ):**
- PENDING
- IN_PROGRESS
- COMPLETED
- SUBMITTED
- etc.

### วิธีแก้ไข

#### 1. สร้าง Status Constants

```typescript
// frontend/src/constants/surveyStatus.ts

export const SURVEY_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  REVIEWED: 'REVIEWED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
} as const;

export type SurveyStatus = typeof SURVEY_STATUS[keyof typeof SURVEY_STATUS];

export const SURVEY_STATUS_LABELS: Record<SurveyStatus, string> = {
  DRAFT: 'แบบร่าง',
  SUBMITTED: 'ส่งแล้ว',
  REVIEWED: 'ตรวจสอบแล้ว',
  APPROVED: 'อนุมัติแล้ว',
  REJECTED: 'ปฏิเสธ'
};

export const SURVEY_STATUS_COLORS: Record<SurveyStatus, string> = {
  DRAFT: 'gray',
  SUBMITTED: 'blue',
  REVIEWED: 'purple',
  APPROVED: 'green',
  REJECTED: 'red'
};

export const SURVEY_STATUS_ICONS: Record<SurveyStatus, string> = {
  DRAFT: '📝',
  SUBMITTED: '📤',
  REVIEWED: '👁️',
  APPROVED: '✅',
  REJECTED: '❌'
};
```

#### 2. สร้าง Status Badge Component

```typescript
// frontend/src/components/SurveyStatusBadge.tsx

import { SURVEY_STATUS_LABELS, SURVEY_STATUS_COLORS, SURVEY_STATUS_ICONS } from '../constants/surveyStatus';
import type { SurveyStatus } from '../constants/surveyStatus';

interface SurveyStatusBadgeProps {
  status: SurveyStatus;
  showIcon?: boolean;
}

export function SurveyStatusBadge({ status, showIcon = true }: SurveyStatusBadgeProps) {
  const label = SURVEY_STATUS_LABELS[status] || status;
  const color = SURVEY_STATUS_COLORS[status] || 'gray';
  const icon = SURVEY_STATUS_ICONS[status] || '📋';

  return (
    <span className={`badge badge-${color}`}>
      {showIcon && <span className="mr-1">{icon}</span>}
      {label}
    </span>
  );
}
```

#### 3. อัพเดท Backend Enum

```typescript
// backend/src/survey/dto/field-officer-survey.dto.ts

export enum FieldSurveyStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  REVIEWED = 'REVIEWED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}
```

### Acceptance Criteria
- [ ] Status constants defined
- [ ] Status badge component created
- [ ] All pages use consistent status
- [ ] Backend enum matches frontend

---

## Issue #9: Drawing Tools Disabled by Default

### ปัญหา
Drawing tools ถูก disable โดย default ทำให้ user ต้อง enable เอง

### ตำแหน่งที่พบ

```typescript
// InitialSurveyPage.tsx, SurveyAreaPage.tsx
setTimeout(() => {
  Object.keys((map as any).pm.Toolbar.buttons).forEach(key => {
    const button = (map as any).pm.Toolbar.buttons[key];
    if (button && button.disable) {
      button.disable(); // ❌ Disable all tools
    }
  });
}, 0);
```

### วิธีแก้ไข

#### 1. Enable Tools by Default

```typescript
// ✅ Enable polygon drawing by default
map.pm.addControls({
  position: 'topleft',
  drawPolygon: true,      // ✅ Enable
  drawRectangle: true,    // ✅ Enable
  drawCircle: false,      // Disable (not needed)
  drawMarker: true,       // ✅ Enable
  editMode: true,         // ✅ Enable
  dragMode: false,
  cutPolygon: false,
  removalMode: true       // ✅ Enable
});

// Set polygon as default active tool
map.pm.enableDraw('Polygon', {
  snappable: true,
  snapDistance: 20,
  finishOn: 'dblclick'
});
```

#### 2. เพิ่ม Instructions

```typescript
// Add instructions overlay
const InstructionsOverlay = () => (
  <div className="map-instructions">
    <h4>📍 วิธีใช้งานแผนที่:</h4>
    <ol>
      <li>🖱️ คลิกปุ่ม <strong>Polygon</strong> ด้านซ้ายบน</li>
      <li>📍 คลิกบนแผนที่เพื่อสร้างจุดมุม</li>
      <li>🔄 คลิกจุดแรกอีกครั้งเพื่อปิดรูปหลายเหลี่ยม</li>
      <li>✏️ ใช้ปุ่ม <strong>Edit</strong> เพื่อแก้ไข</li>
      <li>🗑️ ใช้ปุ่ม <strong>Delete</strong> เพื่อลบ</li>
    </ol>
    <button onClick={() => setShowInstructions(false)}>
      เข้าใจแล้ว
    </button>
  </div>
);
```

#### 3. เพิ่ม Tooltips

```typescript
// Add tooltips to Geoman buttons
useEffect(() => {
  if (!mapRef.current) return;
  
  const map = mapRef.current;
  
  // Add custom tooltips
  const buttons = document.querySelectorAll('.leaflet-pm-toolbar button');
  buttons.forEach(button => {
    const action = button.getAttribute('data-action');
    const tooltips: Record<string, string> = {
      'drawPolygon': 'วาดพื้นที่ได้รับผลกระทบ',
      'editMode': 'แก้ไขพื้นที่',
      'removalMode': 'ลบพื้นที่',
      'drawMarker': 'ปักหมุด'
    };
    
    if (action && tooltips[action]) {
      button.setAttribute('title', tooltips[action]);
    }
  });
}, []);
```

### Acceptance Criteria
- [ ] Polygon tool enabled by default
- [ ] Instructions overlay shown on first visit
- [ ] Tooltips in Thai language
- [ ] Clear visual feedback

---

## Issue #10: No Form Validation

### ปัญหา
ไม่มี validation ก่อน submit form

### วิธีแก้ไข

#### 1. สร้าง Validation Function

```typescript
// frontend/src/pages/field-officer/InitialSurveyPage.tsx

interface ValidationErrors {
  village?: string;
  disasterType?: string;
  severity?: string;
  estimatedHouseholds?: string;
  notes?: string;
  location?: string;
}

const validateForm = (): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Village validation
  if (!village && !villageName) {
    errors.village = 'กรุณาเลือกหมู่บ้านหรือระบุชื่อหมู่บ้าน';
  }

  // Disaster type validation
  if (!disasterType || disasterType.trim() === '') {
    errors.disasterType = 'กรุณาเลือกประเภทภัย';
  }

  // Severity validation
  const severityNum = parseInt(severity);
  if (!severity || isNaN(severityNum) || severityNum < 1 || severityNum > 5) {
    errors.severity = 'กรุณาระบุระดับความรุนแรง 1-5';
  }

  // Estimated households validation
  const householdsNum = parseInt(estimatedHouseholds);
  if (!estimatedHouseholds || isNaN(householdsNum) || householdsNum < 0) {
    errors.estimatedHouseholds = 'กรุณาระบุจำนวนครัวเรือนที่ถูกต้อง';
  }

  // Notes validation
  if (!notes || notes.trim().length < 10) {
    errors.notes = 'กรุณาระบุรายละเอียดอย่างน้อย 10 ตัวอักษร';
  }

  // Location validation (GPS or Polygon required)
  if (!latitude && !longitude && !polygonData) {
    errors.location = 'กรุณาระบุตำแหน่ง GPS หรือวาดพื้นที่บนแผนที่';
  }

  return errors;
};
```

#### 2. แสดง Error Messages

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate form
  const validationErrors = validateForm();
  
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    
    // Show toast with first error
    const firstError = Object.values(validationErrors)[0];
    toast.error(firstError, {
      duration: 4000,
      icon: '⚠️'
    });
    
    // Scroll to first error
    const firstErrorField = Object.keys(validationErrors)[0];
    const element = document.querySelector(`[name="${firstErrorField}"]`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    return;
  }
  
  // Clear errors
  setErrors({});
  
  // Submit form
  setIsSubmitting(true);
  try {
    // ... submit logic
  } catch (error) {
    // ... error handling
  } finally {
    setIsSubmitting(false);
  }
};
```

#### 3. Error Display Component

```typescript
// Show error message below field
{errors.village && (
  <div className="error-message">
    <span className="error-icon">⚠️</span>
    {errors.village}
  </div>
)}

// CSS
.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-icon {
  font-size: 1rem;
}

input.error,
textarea.error,
select.error {
  border-color: #dc2626;
  background-color: #fef2f2;
}
```

#### 4. Real-time Validation

```typescript
// Validate on blur
const handleBlur = (field: keyof ValidationErrors) => {
  const validationErrors = validateForm();
  
  if (validationErrors[field]) {
    setErrors(prev => ({
      ...prev,
      [field]: validationErrors[field]
    }));
  } else {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }
};

// Usage
<input
  name="estimatedHouseholds"
  value={estimatedHouseholds}
  onChange={(e) => setEstimatedHouseholds(e.target.value)}
  onBlur={() => handleBlur('estimatedHouseholds')}
  className={errors.estimatedHouseholds ? 'error' : ''}
/>
```

### Acceptance Criteria
- [ ] All required fields validated
- [ ] Error messages in Thai
- [ ] Visual feedback (red border)
- [ ] Scroll to first error
- [ ] Real-time validation on blur
- [ ] Clear errors on fix

---

## 📊 Implementation Checklist

### Issue #7: Map Race Condition
- [ ] Remove all setTimeout from map init
- [ ] Use Geoman events
- [ ] Use ResizeObserver
- [ ] Test on different screen sizes
- [ ] Test fullscreen mode

### Issue #8: Status Labels
- [ ] Create status constants
- [ ] Create StatusBadge component
- [ ] Update all pages
- [ ] Update backend enum
- [ ] Test all status transitions

### Issue #9: Drawing Tools
- [ ] Enable tools by default
- [ ] Add instructions overlay
- [ ] Add Thai tooltips
- [ ] Test polygon drawing
- [ ] Test edit/delete

### Issue #10: Form Validation
- [ ] Create validation function
- [ ] Add error display
- [ ] Add real-time validation
- [ ] Test all validation rules
- [ ] Test error clearing

---

## 🧪 Testing Plan

### Manual Testing
1. **Map Functionality**
   - [ ] Map loads without setTimeout
   - [ ] Resize works smoothly
   - [ ] Fullscreen works
   - [ ] No race conditions

2. **Drawing Tools**
   - [ ] Polygon tool active by default
   - [ ] Instructions clear
   - [ ] Edit works
   - [ ] Delete works

3. **Form Validation**
   - [ ] Required fields validated
   - [ ] Error messages show
   - [ ] Errors clear on fix
   - [ ] Submit blocked if invalid

4. **Status Display**
   - [ ] Correct labels shown
   - [ ] Correct colors
   - [ ] Correct icons
   - [ ] Consistent everywhere

### Automated Testing
```typescript
// Example test
describe('Form Validation', () => {
  it('should show error for empty village', () => {
    const errors = validateForm({
      village: null,
      disasterType: 'น้ำท่วม',
      severity: 3,
      estimatedHouseholds: 10,
      notes: 'Test notes',
      latitude: 19.9167,
      longitude: 99.2333
    });
    
    expect(errors.village).toBe('กรุณาเลือกหมู่บ้านหรือระบุชื่อหมู่บ้าน');
  });
});
```

---

## 📝 Notes

### ข้อควรระวัง
1. **Map Race Condition:** ต้องทดสอบบนหลาย browser
2. **Status Labels:** ต้อง sync กับ backend
3. **Drawing Tools:** ต้องทดสอบ UX กับ field officers จริง
4. **Form Validation:** ต้องครอบคลุมทุก edge case

### Best Practices
1. ใช้ TypeScript types สำหรับ validation
2. แยก validation logic ออกจาก component
3. ใช้ constants สำหรับ status
4. เขียน tests สำหรับ validation

---

**Status:** ✅ Ready to Implement  
**Estimated Time:** 2 days (16 hours)  
**Priority:** Medium (can be done after backend restart and testing)
