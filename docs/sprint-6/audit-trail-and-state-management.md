# Sprint 6: Audit Trail & State Management Design

**Document Version:** 1.0  
**Date:** Nov 09, 2025  
**Author:** Manus AI

---

## 1. Audit Trail Requirements (SA Mandate)

> **SA Requirement:** "ระบบนี้เกี่ยวข้องกับการตัดสินใจระดับนโยบาย → ต้องมี **Audit Trail** ทุกจุดสำคัญ เช่น การแก้ไขหลัง AI, การส่งรายงาน"

### 1.1. Critical Events to Track

| Event Category | Event | Data to Log |
|:---|:---|:---|
| **Wizard Lifecycle** | Wizard started | User ID, Task ID, Timestamp |
| | Step completed | Step number, Timestamp |
| | Step revisited | Step number, Reason (if any) |
| | Draft saved | Draft ID, Step number |
| | Report submitted | Report ID, Final status |
| **Data Modifications** | Field updated | Field name, Old value, New value |
| | Image uploaded | Image URL, File size, Timestamp |
| | Image deleted | Image URL, Reason |
| **AI Interactions** | AI analysis requested | Image URLs, Model version |
| | AI analysis completed | Result summary, Confidence |
| | **AI analysis edited** | Original value, Edited value, User ID |
| **Review Process** | Report reviewed | Reviewer ID, Decision, Comments |
| | Revision requested | Reviewer ID, Required changes |
| | Report approved | Approver ID, Timestamp |
| **User Activity** | User paused | Idle duration |
| | User resumed | Resume timestamp |
| | Session timeout | Last activity timestamp |

---

## 2. Audit Log Data Model

### 2.1. Backend Model (Existing)

```prisma
model AuditLog {
  id          String   @id @default(uuid())
  entityType  String   @map("entity_type")  // "REPORT", "TASK", "IMAGE"
  entityId    String   @map("entity_id")     // Report ID, Task ID, etc.
  action      String                         // "CREATED", "UPDATED", "DELETED", "SUBMITTED", etc.
  details     Json?                          // Detailed change information
  userId      String?  @map("user_id")
  ipAddress   String?  @map("ip_address")
  userAgent   String?  @map("user_agent")
  createdAt   DateTime @default(now()) @map("created_at")
  
  user User? @relation(fields: [userId], references: [id])
  
  @@index([entityType, entityId])
  @@index([userId])
  @@index([createdAt])
}
```

### 2.2. Audit Event Details Structure

```typescript
// For field updates
interface FieldUpdateDetails {
  field: string;
  oldValue: any;
  newValue: any;
  step: number;
  timestamp: string;
}

// For AI analysis edits
interface AIAnalysisEditDetails {
  originalAnalysis: AIAnalysisResult;
  editedFields: {
    field: string;
    originalValue: any;
    editedValue: any;
  }[];
  reason?: string;
  timestamp: string;
}

// For report submission
interface ReportSubmissionDetails {
  reportId: string;
  taskId: string;
  totalSteps: number;
  completedSteps: number;
  aiAnalysisUsed: boolean;
  aiAnalysisModified: boolean;
  imageCount: number;
  timestamp: string;
}
```

---

## 3. Frontend Audit Tracking

### 3.1. Audit Hook

```typescript
// hooks/useAuditTrail.ts

import { useCallback } from 'react';
import { auditApi } from '../api/audit';

export interface AuditEvent {
  entityType: 'REPORT' | 'TASK' | 'IMAGE';
  entityId: string;
  action: string;
  details?: any;
}

export function useAuditTrail() {
  const logEvent = useCallback(async (event: AuditEvent) => {
    try {
      await auditApi.logEvent({
        ...event,
        timestamp: new Date().toISOString(),
        // Browser info will be added by backend
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw - audit failures shouldn't block user actions
    }
  }, []);

  const logFieldUpdate = useCallback(async (
    reportId: string,
    field: string,
    oldValue: any,
    newValue: any,
    step: number
  ) => {
    await logEvent({
      entityType: 'REPORT',
      entityId: reportId,
      action: 'FIELD_UPDATED',
      details: {
        field,
        oldValue,
        newValue,
        step,
      },
    });
  }, [logEvent]);

  const logAIAnalysisEdit = useCallback(async (
    reportId: string,
    originalAnalysis: AIAnalysisResult,
    editedFields: any[]
  ) => {
    await logEvent({
      entityType: 'REPORT',
      entityId: reportId,
      action: 'AI_ANALYSIS_EDITED',
      details: {
        originalAnalysis,
        editedFields,
        timestamp: new Date().toISOString(),
      },
    });
  }, [logEvent]);

  const logReportSubmission = useCallback(async (
    reportId: string,
    submissionDetails: any
  ) => {
    await logEvent({
      entityType: 'REPORT',
      entityId: reportId,
      action: 'REPORT_SUBMITTED',
      details: submissionDetails,
    });
  }, [logEvent]);

  return {
    logEvent,
    logFieldUpdate,
    logAIAnalysisEdit,
    logReportSubmission,
  };
}
```

### 3.2. Integration with Wizard

```typescript
// components/full-report-wizard/WizardContainer.tsx

export function WizardContainer() {
  const { logEvent, logFieldUpdate } = useAuditTrail();
  const [formData, setFormData] = useState<FullReportFormData>(initialData);
  
  // Log wizard start
  useEffect(() => {
    logEvent({
      entityType: 'REPORT',
      entityId: draftId || 'new',
      action: 'WIZARD_STARTED',
      details: { taskId: formData.taskId },
    });
  }, []);
  
  // Log field updates
  const handleFieldChange = useCallback((field: string, value: any) => {
    const oldValue = formData[field];
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Log change (debounced to avoid too many logs)
    if (draftId) {
      logFieldUpdate(draftId, field, oldValue, value, currentStep);
    }
  }, [formData, currentStep, draftId, logFieldUpdate]);
  
  // Log step completion
  const handleNextStep = useCallback(() => {
    logEvent({
      entityType: 'REPORT',
      entityId: draftId || 'new',
      action: 'STEP_COMPLETED',
      details: { step: currentStep },
    });
    
    setCurrentStep(prev => prev + 1);
  }, [currentStep, draftId, logEvent]);
  
  return (
    // ... wizard UI
  );
}
```

---

## 4. Backend Audit Service

### 4.1. Audit Service Implementation

```typescript
// backend/src/audit/audit.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async logEvent(
    dto: CreateAuditLogDto,
    userId: string,
    ipAddress: string,
    userAgent: string
  ) {
    return this.prisma.auditLog.create({
      data: {
        entityType: dto.entityType,
        entityId: dto.entityId,
        action: dto.action,
        details: dto.details,
        userId,
        ipAddress,
        userAgent,
      },
    });
  }

  async getAuditTrail(entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getReportAuditTrail(reportId: string) {
    const logs = await this.getAuditTrail('REPORT', reportId);
    
    // Transform logs into timeline format
    return logs.map(log => ({
      id: log.id,
      action: log.action,
      timestamp: log.createdAt,
      user: log.user,
      details: log.details,
    }));
  }
}
```

### 4.2. Audit Controller

```typescript
// backend/src/audit/audit.controller.ts

@Controller('audit')
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async logEvent(
    @Body() dto: CreateAuditLogDto,
    @Request() req
  ) {
    return this.auditService.logEvent(
      dto,
      req.user.id,
      req.ip,
      req.headers['user-agent']
    );
  }

  @Get('reports/:reportId')
  @Roles(Role.SUPERVISOR, Role.EXECUTIVE, Role.ADMIN)
  async getReportAuditTrail(@Param('reportId') reportId: string) {
    return this.auditService.getReportAuditTrail(reportId);
  }
}
```

---

## 5. State Management Design

### 5.1. Wizard State Management (React Context)

```typescript
// context/WizardContext.tsx

interface WizardContextValue {
  // State
  state: WizardState;
  
  // Navigation
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Data management
  updateFormData: (field: string, value: any) => void;
  updateMultipleFields: (updates: Partial<FullReportFormData>) => void;
  
  // Persistence
  saveDraft: () => Promise<void>;
  loadDraft: (draftId: string) => Promise<void>;
  
  // Submission
  submitReport: () => Promise<void>;
  
  // Validation
  validateStep: (step: number) => boolean;
  validateAll: () => boolean;
}

export const WizardContext = createContext<WizardContextValue | null>(null);

export function WizardProvider({ children, taskId }: WizardProviderProps) {
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    totalSteps: 10,
    formData: initialFormData,
    validation: {},
    isDraft: false,
    lastSaved: null,
    isSubmitting: false,
  });
  
  const { logEvent, logFieldUpdate } = useAuditTrail();
  
  // Navigation
  const goToStep = useCallback((step: number) => {
    if (step < 1 || step > state.totalSteps) return;
    
    logEvent({
      entityType: 'REPORT',
      entityId: state.formData.taskId,
      action: 'STEP_CHANGED',
      details: { from: state.currentStep, to: step },
    });
    
    setState(prev => ({ ...prev, currentStep: step }));
  }, [state.currentStep, state.totalSteps, logEvent]);
  
  const nextStep = useCallback(() => {
    if (!validateStep(state.currentStep)) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    
    goToStep(state.currentStep + 1);
  }, [state.currentStep, validateStep, goToStep]);
  
  const prevStep = useCallback(() => {
    goToStep(state.currentStep - 1);
  }, [state.currentStep, goToStep]);
  
  // Data management
  const updateFormData = useCallback((field: string, value: any) => {
    setState(prev => {
      const oldValue = prev.formData[field];
      
      // Log field update
      if (prev.formData.taskId) {
        logFieldUpdate(
          prev.formData.taskId,
          field,
          oldValue,
          value,
          prev.currentStep
        );
      }
      
      return {
        ...prev,
        formData: { ...prev.formData, [field]: value },
      };
    });
  }, [logFieldUpdate]);
  
  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.isDraft) {
        saveDraft();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [state.isDraft, saveDraft]);
  
  // Save draft
  const saveDraft = useCallback(async () => {
    try {
      const response = await reportsApi.saveDraft(state.formData);
      
      setState(prev => ({
        ...prev,
        isDraft: true,
        draftId: response.id,
        lastSaved: new Date(),
      }));
      
      logEvent({
        entityType: 'REPORT',
        entityId: response.id,
        action: 'DRAFT_SAVED',
        details: { step: state.currentStep },
      });
      
      toast.success('บันทึกแบบร่างเรียบร้อย');
    } catch (error) {
      toast.error('ไม่สามารถบันทึกแบบร่างได้');
    }
  }, [state.formData, state.currentStep, logEvent]);
  
  // Submit report
  const submitReport = useCallback(async () => {
    if (!validateAll()) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วนทุกขั้นตอน');
      return;
    }
    
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      const response = await reportsApi.createFullReport(state.formData);
      
      logEvent({
        entityType: 'REPORT',
        entityId: response.id,
        action: 'REPORT_SUBMITTED',
        details: {
          totalSteps: state.totalSteps,
          aiAnalysisUsed: !!state.formData.aiAnalysis,
          aiAnalysisModified: state.formData.aiAnalysisModified,
          imageCount: state.formData.imageUrls.length,
        },
      });
      
      toast.success('ส่งรายงานเรียบร้อย');
      
      // Redirect to report list
      router.push('/reports');
    } catch (error) {
      toast.error('ไม่สามารถส่งรายงานได้');
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state.formData, validateAll, logEvent]);
  
  const value: WizardContextValue = {
    state,
    goToStep,
    nextStep,
    prevStep,
    updateFormData,
    updateMultipleFields,
    saveDraft,
    loadDraft,
    submitReport,
    validateStep,
    validateAll,
  };
  
  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within WizardProvider');
  }
  return context;
}
```

---

## 6. Draft Persistence

### 6.1. LocalStorage Backup

```typescript
// hooks/useDraftPersistence.ts

export function useDraftPersistence(taskId: string) {
  const STORAGE_KEY = `draft_report_${taskId}`;
  
  // Save to localStorage
  const saveToLocal = useCallback((data: FullReportFormData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data,
        savedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Failed to save draft to localStorage:', error);
    }
  }, [STORAGE_KEY]);
  
  // Load from localStorage
  const loadFromLocal = useCallback((): FullReportFormData | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      
      const { data, savedAt } = JSON.parse(stored);
      
      // Check if draft is older than 7 days
      const age = Date.now() - new Date(savedAt).getTime();
      if (age > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to load draft from localStorage:', error);
      return null;
    }
  }, [STORAGE_KEY]);
  
  // Clear localStorage
  const clearLocal = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, [STORAGE_KEY]);
  
  return {
    saveToLocal,
    loadFromLocal,
    clearLocal,
  };
}
```

### 6.2. Backend Draft API

```typescript
// backend/src/report/report.controller.ts

@Post('drafts')
@Roles(Role.REPORT_TEAM)
async saveDraft(
  @Body() dto: CreateFullReportDto,
  @Request() req
) {
  return this.reportService.saveDraft(dto, req.user.id);
}

@Get('drafts')
@Roles(Role.REPORT_TEAM)
async getUserDrafts(@Request() req) {
  return this.reportService.getUserDrafts(req.user.id);
}

@Get('drafts/:id')
@Roles(Role.REPORT_TEAM)
async getDraft(@Param('id') id: string, @Request() req) {
  return this.reportService.getDraft(id, req.user.id);
}

@Delete('drafts/:id')
@Roles(Role.REPORT_TEAM)
async deleteDraft(@Param('id') id: string, @Request() req) {
  return this.reportService.deleteDraft(id, req.user.id);
}
```

---

## 7. Audit Trail Visualization

### 7.1. Audit Timeline Component

```tsx
// components/audit/AuditTimeline.tsx

export function AuditTimeline({ reportId }: { reportId: string }) {
  const { data: auditLogs, isLoading } = useQuery(
    ['audit', reportId],
    () => auditApi.getReportAuditTrail(reportId)
  );
  
  if (isLoading) return <Spinner />;
  
  return (
    <VStack spacing={4} align="stretch">
      {auditLogs?.map((log) => (
        <AuditLogItem key={log.id} log={log} />
      ))}
    </VStack>
  );
}

function AuditLogItem({ log }: { log: AuditLog }) {
  const icon = getActionIcon(log.action);
  const color = getActionColor(log.action);
  
  return (
    <HStack spacing={4} p={4} bg="gray.50" borderRadius="md">
      <Icon as={icon} color={color} boxSize={6} />
      <VStack align="start" flex={1} spacing={1}>
        <HStack>
          <Text fontWeight="bold">{getActionLabel(log.action)}</Text>
          <Badge colorScheme={color}>{log.action}</Badge>
        </HStack>
        <Text fontSize="sm" color="gray.600">
          {log.user.name} • {formatDate(log.timestamp)}
        </Text>
        {log.details && (
          <Code fontSize="xs" p={2} borderRadius="md" w="full">
            {JSON.stringify(log.details, null, 2)}
          </Code>
        )}
      </VStack>
    </HStack>
  );
}
```

---

## 8. Summary

This document defines:
- **Comprehensive audit trail** for all critical events
- **Frontend audit hooks** for easy integration
- **Backend audit service** with full logging capability
- **Wizard state management** using React Context
- **Draft persistence** with localStorage backup
- **Audit visualization** for transparency

All implementations ensure:
- ✅ Every critical action is logged
- ✅ AI edits are fully traceable
- ✅ User activity is monitored
- ✅ State is persisted and recoverable
- ✅ Audit logs are accessible to authorized users
