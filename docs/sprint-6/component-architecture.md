# Sprint 6: Component Architecture Design

**Document Version:** 1.0  
**Date:** Nov 09, 2025  
**Author:** Manus AI

---

## 1. Overview

The Full Report System uses a **10-step wizard form** architecture to guide Report Team members through creating comprehensive disaster reports. The system integrates with Gemini AI for intelligent image analysis and maintains a complete audit trail.

---

## 2. Component Hierarchy

```
/src/pages/reports/
├── FullReportWizardPage.tsx          # Main wizard container
└── FullReportReviewPage.tsx          # Review submitted reports

/src/components/full-report-wizard/
├── WizardContainer.tsx               # Wizard state management & navigation
├── WizardProgress.tsx                # Progress indicator (1/10, 2/10, etc.)
├── WizardNavigation.tsx              # Previous/Next/Submit buttons
│
├── steps/
│   ├── Step1BasicInfo.tsx            # Title, summary, incident reference
│   ├── Step2DamageAssessment.tsx     # Severity, damage description
│   ├── Step3AffectedArea.tsx         # Households, population, area description
│   ├── Step4Infrastructure.tsx       # Infrastructure damage details
│   ├── Step5Casualties.tsx           # Deaths, injuries, missing persons
│   ├── Step6ResourcesNeeded.tsx      # Required resources and support
│   ├── Step7CurrentResponse.tsx      # Ongoing response efforts
│   ├── Step8ImageUpload.tsx          # Upload photos + AI analysis
│   ├── Step9AIAnalysis.tsx           # Review/edit AI-generated insights
│   └── Step10Recommendations.tsx     # Final recommendations
│
├── shared/
│   ├── FormField.tsx                 # Reusable form field wrapper
│   ├── ImageUploader.tsx             # Drag & drop image upload
│   ├── ImagePreview.tsx              # Preview uploaded images
│   ├── AIAnalysisCard.tsx            # Display AI analysis results
│   └── EditableAIContent.tsx         # Editable AI-generated content
│
└── hooks/
    ├── useWizardState.ts             # Wizard state management
    ├── useFormValidation.ts          # Per-step validation
    ├── useImageUpload.ts             # Image upload logic
    └── useAIAnalysis.ts              # AI analysis integration
```

---

## 3. Wizard Container Design

### WizardContainer.tsx

**Responsibilities:**
- Manage wizard state (current step, form data, validation)
- Handle navigation between steps
- Persist draft data to localStorage
- Submit final report to backend

**State Structure:**
```typescript
interface WizardState {
  currentStep: number;
  totalSteps: number;
  formData: FullReportFormData;
  validation: Record<number, boolean>; // Step validation status
  isDraft: boolean;
  lastSaved: Date | null;
}

interface FullReportFormData {
  // Step 1: Basic Info
  taskId: string;
  title: string;
  summary: string;
  
  // Step 2: Damage Assessment
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  damageDescription: string;
  
  // Step 3: Affected Area
  affectedHouseholds: number;
  affectedPopulation: number;
  affectedAreaDescription: string;
  
  // Step 4: Infrastructure
  infrastructureDamage: string;
  
  // Step 5: Casualties
  casualties: number;
  injuries: number;
  missing: number;
  
  // Step 6: Resources
  resourcesNeeded: string;
  urgentNeeds: string[];
  
  // Step 7: Current Response
  currentResponse: string;
  respondingAgencies: string[];
  
  // Step 8: Images
  images: File[];
  imageUrls: string[];
  
  // Step 9: AI Analysis
  aiAnalysis: AIAnalysisResult | null;
  aiAnalysisEdited: string;
  
  // Step 10: Recommendations
  recommendations: string;
  preventiveMeasures: string;
}
```

---

## 4. Step Components Design

### Step 1: Basic Information

**Fields:**
- Task ID (auto-filled from preliminary report)
- Report Title (editable)
- Executive Summary (textarea, 500-1000 chars)

**Validation:**
- Title: required, min 10 chars
- Summary: required, min 100 chars

**Component:**
```tsx
export function Step1BasicInfo({ data, onChange, onValidate }: StepProps) {
  return (
    <VStack spacing={6}>
      <FormField label="ชื่อรายงาน" required>
        <Input value={data.title} onChange={(e) => onChange('title', e.target.value)} />
      </FormField>
      
      <FormField label="สรุปสำหรับผู้บริหาร" required>
        <Textarea 
          value={data.summary} 
          onChange={(e) => onChange('summary', e.target.value)}
          rows={6}
        />
        <Text fontSize="sm" color="gray.600">{data.summary.length}/1000</Text>
      </FormField>
    </VStack>
  );
}
```

---

### Step 2: Damage Assessment

**Fields:**
- Severity Level (dropdown: LOW, MEDIUM, HIGH, CRITICAL)
- Damage Description (rich text editor)
- Damage Categories (checkboxes: structural, environmental, economic, social)

**Validation:**
- Severity: required
- Description: required, min 200 chars

---

### Step 3: Affected Area

**Fields:**
- Number of Affected Households (number input)
- Affected Population (number input)
- Area Description (textarea)
- GeoJSON Area (auto-filled from preliminary report, readonly)

**Validation:**
- Households: required, >= 0
- Population: required, >= 0
- Description: required

---

### Step 4: Infrastructure Damage

**Fields:**
- Infrastructure Types (checkboxes: roads, bridges, buildings, utilities, schools, hospitals)
- Damage Details (textarea per type)
- Estimated Repair Cost (optional, number input)

**Validation:**
- At least one infrastructure type selected
- Details: min 50 chars

---

### Step 5: Casualties

**Fields:**
- Deaths (number input)
- Injuries (number input)
- Missing Persons (number input)
- Casualty Details (textarea)

**Validation:**
- All numbers >= 0
- If any > 0, details required

---

### Step 6: Resources Needed

**Fields:**
- Resource Categories (checkboxes: food, water, shelter, medical, rescue equipment)
- Detailed Needs (textarea per category)
- Urgent Priority Items (multi-select)

**Validation:**
- At least one category selected
- Details: min 50 chars

---

### Step 7: Current Response

**Fields:**
- Response Status (dropdown: not started, in progress, completed)
- Response Description (textarea)
- Responding Agencies (multi-select or tags input)
- Resources Deployed (textarea)

**Validation:**
- Status: required
- Description: min 100 chars

---

### Step 8: Image Upload

**Features:**
- Drag & drop or file picker
- Max 5 images, 20MB each
- Supported formats: JPG, PNG, WEBP
- Preview with delete option
- Auto-trigger AI analysis when images uploaded

**Component:**
```tsx
export function Step8ImageUpload({ data, onChange }: StepProps) {
  const { uploadImages, isUploading } = useImageUpload();
  
  const handleUpload = async (files: File[]) => {
    const urls = await uploadImages(files);
    onChange('images', files);
    onChange('imageUrls', urls);
  };
  
  return (
    <VStack spacing={6}>
      <ImageUploader 
        onUpload={handleUpload}
        maxFiles={5}
        maxSize={20 * 1024 * 1024}
      />
      
      {data.images.length > 0 && (
        <ImagePreview images={data.images} onDelete={(index) => {/* ... */}} />
      )}
    </VStack>
  );
}
```

---

### Step 9: AI Analysis

**Features:**
- Display AI-generated analysis
- Editable text fields for each section
- "🔁 Re-analyze" button
- "✏️ Edit Mode" toggle
- Show confidence score

**Component:**
```tsx
export function Step9AIAnalysis({ data, onChange }: StepProps) {
  const { analyzeImages, isAnalyzing } = useAIAnalysis();
  const [isEditing, setIsEditing] = useState(false);
  
  const handleReanalyze = async () => {
    const result = await analyzeImages(data.imageUrls);
    onChange('aiAnalysis', result);
  };
  
  return (
    <VStack spacing={6}>
      <HStack justify="space-between">
        <Heading size="md">การวิเคราะห์จาก AI</Heading>
        <HStack>
          <Button leftIcon={<RepeatIcon />} onClick={handleReanalyze} isLoading={isAnalyzing}>
            วิเคราะห์ใหม่
          </Button>
          <Button leftIcon={<EditIcon />} onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'บันทึก' : 'แก้ไข'}
          </Button>
        </HStack>
      </HStack>
      
      {data.aiAnalysis && (
        <AIAnalysisCard 
          analysis={data.aiAnalysis}
          isEditing={isEditing}
          onEdit={(field, value) => onChange(`aiAnalysis.${field}`, value)}
        />
      )}
    </VStack>
  );
}
```

---

### Step 10: Recommendations

**Fields:**
- Short-term Recommendations (textarea)
- Long-term Recommendations (textarea)
- Preventive Measures (textarea)
- Priority Actions (ordered list)

**Validation:**
- Short-term: required, min 100 chars
- Long-term: required, min 100 chars

---

## 5. Shared Components

### ImageUploader.tsx

**Features:**
- Drag & drop zone
- File picker button
- File type validation
- Size validation
- Progress indicator

---

### AIAnalysisCard.tsx

**Display Sections:**
- Damage Level (badge with color)
- Damage Types (tags)
- Affected Structures (list)
- Risk Factors (list with icons)
- Summary (paragraph)
- Confidence Score (progress bar)

---

## 6. State Management Strategy

### Option 1: React Context (Recommended)

```tsx
// WizardContext.tsx
interface WizardContextValue {
  state: WizardState;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (field: string, value: any) => void;
  saveDraft: () => Promise<void>;
  submitReport: () => Promise<void>;
}

export const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(initialState);
  
  // Implementation...
  
  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
}
```

### Option 2: Zustand (Alternative)

```tsx
// useWizardStore.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useWizardStore = create(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: {},
      goToStep: (step) => set({ currentStep: step }),
      updateFormData: (field, value) => set((state) => ({
        formData: { ...state.formData, [field]: value }
      })),
    }),
    {
      name: 'wizard-storage',
    }
  )
);
```

**Recommendation:** Use React Context for Sprint 6 (simpler, no additional dependencies)

---

## 7. Validation Strategy

### Per-Step Validation

```tsx
// useFormValidation.ts
export function useFormValidation(step: number, data: any) {
  const validators: Record<number, () => boolean> = {
    1: () => data.title?.length >= 10 && data.summary?.length >= 100,
    2: () => !!data.severity && data.damageDescription?.length >= 200,
    3: () => data.affectedHouseholds >= 0 && data.affectedPopulation >= 0,
    // ... more validators
  };
  
  return {
    isValid: validators[step]?.() ?? false,
    validate: () => validators[step]?.() ?? false,
  };
}
```

### Schema Validation (Zod)

```tsx
import { z } from 'zod';

const step1Schema = z.object({
  title: z.string().min(10, 'ชื่อรายงานต้องมีอย่างน้อย 10 ตัวอักษร'),
  summary: z.string().min(100, 'สรุปต้องมีอย่างน้อย 100 ตัวอักษร'),
});

// In component
const { errors } = useForm({
  resolver: zodResolver(step1Schema),
});
```

---

## 8. Navigation Flow

```
Step 1 → Step 2 → Step 3 → Step 4 → Step 5 
  ↓        ↓        ↓        ↓        ↓
Step 10 ← Step 9 ← Step 8 ← Step 7 ← Step 6

Navigation Rules:
- Can go back to any previous step
- Can only go forward if current step is valid
- Can save draft at any step
- Can only submit from Step 10 if all steps valid
```

---

## 9. Audit Trail Integration

### Events to Track

1. **Wizard Events:**
   - Wizard started
   - Step completed
   - Step revisited
   - Draft saved
   - Report submitted

2. **Data Events:**
   - Field updated (field name, old value, new value)
   - Image uploaded
   - Image deleted
   - AI analysis requested
   - AI analysis edited

3. **User Events:**
   - User paused (idle > 5 min)
   - User resumed
   - Session timeout

### Implementation

```tsx
// useAuditTrail.ts
export function useAuditTrail() {
  const logEvent = async (event: AuditEvent) => {
    await auditApi.logEvent({
      entityType: 'REPORT',
      entityId: reportId,
      action: event.action,
      details: event.details,
      timestamp: new Date(),
    });
  };
  
  return { logEvent };
}

// In WizardContainer
const { logEvent } = useAuditTrail();

const handleStepChange = (newStep: number) => {
  logEvent({
    action: 'STEP_COMPLETED',
    details: { step: currentStep, nextStep: newStep },
  });
  setCurrentStep(newStep);
};
```

---

## 10. Performance Considerations

### Code Splitting

```tsx
// Lazy load step components
const Step1 = lazy(() => import('./steps/Step1BasicInfo'));
const Step2 = lazy(() => import('./steps/Step2DamageAssessment'));
// ... etc

// In WizardContainer
<Suspense fallback={<Spinner />}>
  {currentStep === 1 && <Step1 />}
  {currentStep === 2 && <Step2 />}
</Suspense>
```

### Draft Auto-Save

```tsx
// Auto-save every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    saveDraft();
  }, 30000);
  
  return () => clearInterval(interval);
}, [formData]);
```

---

## 11. Accessibility

- **Keyboard Navigation:** Tab through fields, Enter to submit
- **Screen Reader Support:** ARIA labels on all form fields
- **Progress Indicator:** Announce step changes
- **Error Messages:** Clear, actionable error messages
- **Focus Management:** Auto-focus first field on step change

---

## 12. Mobile Responsiveness

- **Stack layout on mobile** (< 768px)
- **Simplified navigation** (dropdown instead of tabs)
- **Touch-friendly buttons** (min 44px height)
- **Optimized image upload** (camera integration)

---

## 13. Summary

The 10-step wizard architecture provides:
- **Clear separation of concerns** (one step = one component)
- **Reusable components** (FormField, ImageUploader, etc.)
- **Flexible state management** (Context or Zustand)
- **Comprehensive validation** (per-step and final)
- **Complete audit trail** (every action logged)
- **Performance optimized** (code splitting, auto-save)
- **Accessible and responsive** (WCAG 2.1 AA compliant)
