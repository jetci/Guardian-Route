# 🔧 แผนการแก้ไขปัญหา Field Officer Module - 10 รายการ

**วันที่จัดทำ:** 23 ธันวาคม 2568 เวลา 09:03 น.  
**ผู้จัดทำ:** Cascade AI  
**จำนวนปัญหา:** 10 รายการ  
**ระยะเวลาโดยรวม:** 4 สัปดาห์

---

## 📊 สรุปภาพรวม

| Priority | จำนวน | ระยะเวลา | ความเสี่ยง |
|----------|-------|----------|-----------|
| 🔴 Critical | 2 | 1 สัปดาห์ | สูง |
| 🟡 High | 4 | 1 สัปดาห์ | กลาง |
| 🟢 Medium | 4 | 2 สัปดาห์ | ต่ำ |
| **รวม** | **10** | **4 สัปดาห์** | - |

---

## 🎯 Timeline Overview

```
Week 1 (Critical): Issues #1-2
├─ Day 1-2: FieldSurvey Table + Migration
├─ Day 3: Thai Encoding Fix
└─ Day 4-5: Testing

Week 2 (High Priority): Issues #3-6
├─ Day 1: Test Data Seeder
├─ Day 2: Validation Fix
├─ Day 3: GPS Error Handling
├─ Day 4: Upload Endpoint
└─ Day 5: Integration Testing

Week 3 (Medium Priority): Issues #7-10
├─ Day 1-2: Map Race Condition
├─ Day 2-3: Status Labels
├─ Day 3-4: Drawing Tools UX
└─ Day 4-5: Form Validation

Week 4 (Testing & Documentation)
├─ Day 1-2: E2E Testing
├─ Day 3: Performance Testing
├─ Day 4: Documentation
└─ Day 5: Final Review
```

---

# 🔴 WEEK 1: CRITICAL ISSUES

## Issue #1: Survey System ไม่มี Dedicated Table
- **Priority:** P1 | **Effort:** 1.5 วัน
- **แก้ไข:** สร้าง `FieldSurvey` table + Migration + Service update
- **ไฟล์:** `schema.prisma`, `field-officer-survey.service.ts`

## Issue #2: Thai Language Encoding
- **Priority:** P1 | **Effort:** 0.5 วัน
- **แก้ไข:** UTF-8 config ใน Database, Backend, Frontend, PowerShell
- **ไฟล์:** `main.ts`, `prisma.service.ts`, `client.ts`

---

# 🟡 WEEK 2: HIGH PRIORITY ISSUES

## Issue #3: Missing Test Data
- **Priority:** P2 | **Effort:** 0.5 วัน
- **แก้ไข:** สร้าง seeder script สำหรับ incidents, tasks, surveys
- **ไฟล์:** `seed-field-officer-data.ts`

## Issue #4: villageId Validation
- **Priority:** P2 | **Effort:** 0.4 วัน
- **แก้ไข:** เปลี่ยน villageId เป็น optional + autocomplete
- **ไฟล์:** `field-officer-survey.dto.ts`, `InitialSurveyPage.tsx`

## Issue #5: GPS Error Handling
- **Priority:** P2 | **Effort:** 0.6 วัน
- **แก้ไข:** สร้าง useGPS hook + fallback to manual pin
- **ไฟล์:** `useGPS.ts`, `InitialSurveyPage.tsx`

## Issue #6: Missing Upload Endpoint
- **Priority:** P2 | **Effort:** 0.5 วัน
- **แก้ไข:** สร้าง `/upload/survey-images` endpoint
- **ไฟล์:** `upload.controller.ts`, `upload.service.ts`

---

# 🟢 WEEK 3: MEDIUM PRIORITY ISSUES

## Issue #7: Map Race Condition
- **Priority:** P3 | **Effort:** 0.5 วัน
- **แก้ไข:** ใช้ Geoman events แทน setTimeout
- **ไฟล์:** `InitialSurveyPage.tsx`, `SurveyAreaPage.tsx`

## Issue #8: Inconsistent Status Labels
- **Priority:** P3 | **Effort:** 0.5 วัน
- **แก้ไข:** Standardize status enum + mapping
- **ไฟล์:** `schema.prisma`, status utils

## Issue #9: Drawing Tools Disabled
- **Priority:** P3 | **Effort:** 0.5 วัน
- **แก้ไข:** Enable by default + add instructions
- **ไฟล์:** `SurveyAreaPage.tsx`

## Issue #10: No Form Validation
- **Priority:** P3 | **Effort:** 0.5 วัน
- **แก้ไข:** Add comprehensive validation + error messages
- **ไฟล์:** Form components

---

# 📋 รายละเอียดการแก้ไขแต่ละ Issue

## 🔴 Issue #1: FieldSurvey Table (1.5 วัน)

### Steps:
1. **Schema Design** (2h) - สร้าง FieldSurvey model
2. **Migration** (30m) - `npx prisma migrate dev`
3. **Service Update** (3h) - แก้ไข service ให้ใช้ table ใหม่
4. **Controller** (1h) - เพิ่ม endpoints
5. **Data Migration** (2h) - Migrate existing data
6. **Testing** (2h) - E2E tests

### Acceptance Criteria:
- [ ] Table created successfully
- [ ] All data migrated
- [ ] API endpoints working
- [ ] No breaking changes

---

## 🔴 Issue #2: Thai Encoding (0.5 วัน)

### Steps:
1. **Database** (30m) - SET CLIENT_ENCODING TO 'UTF8'
2. **Backend** (1h) - UTF-8 headers in main.ts
3. **Frontend** (30m) - UTF-8 in API client
4. **PowerShell** (15m) - UTF-8 encoding script
5. **Testing** (1h) - E2E tests with Thai text

### Acceptance Criteria:
- [ ] Thai text displays correctly
- [ ] No `???` in responses
- [ ] Database stores Thai correctly

---

## 🟡 Issue #3: Test Data (0.5 วัน)

### Steps:
1. **Seeder Script** (3h) - Create comprehensive seeder
2. **Run Seeder** (10m) - Execute script
3. **Verification** (1h) - Check data in UI

### Data Created:
- 5 Incidents
- 10 Tasks
- 8 Field Surveys
- All with proper relationships

---

## 🟡 Issue #4: Validation (0.4 วัน)

### Steps:
1. **DTO Update** (30m) - Make villageId optional
2. **Service Logic** (30m) - Auto-match village by name
3. **Frontend** (1h) - Add autocomplete
4. **Testing** (1h) - Test all scenarios

---

## 🟡 Issue #5: GPS Handling (0.6 วัน)

### Steps:
1. **useGPS Hook** (2h) - Comprehensive GPS hook
2. **Update Pages** (2h) - Integrate hook
3. **Manual Pin** (1h) - Fallback option
4. **Testing** (1h) - Test all error cases

### Features:
- Permission denied handling
- Timeout handling
- Position unavailable handling
- Manual pin fallback
- Accuracy display

---

## 🟡 Issue #6: Upload Endpoint (0.5 วัน)

### Steps:
1. **Controller** (1h) - Create endpoint
2. **Service** (1h) - Image processing
3. **Validation** (30m) - File type/size checks
4. **Testing** (1h) - Upload tests

### Features:
- Multiple file upload
- Image compression
- File type validation
- Size limits (5MB per file)

---

## 🟢 Issue #7: Map Race Condition (0.5 วัน)

### Steps:
1. **Remove setTimeout** (1h)
2. **Use Geoman Events** (1h)
3. **Testing** (1h)

### Solution:
```typescript
map.on('pm:globalremovalmodetoggled', (e) => {
  // Handle removal mode
});
```

---

## 🟢 Issue #8: Status Labels (0.5 วัน)

### Steps:
1. **Define Enum** (30m)
2. **Create Mapping** (30m)
3. **Update Components** (1h)
4. **Testing** (1h)

### Standard Statuses:
- DRAFT
- SUBMITTED
- IN_PROGRESS
- REVIEWED
- APPROVED
- REJECTED
- COMPLETED

---

## 🟢 Issue #9: Drawing Tools (0.5 วัน)

### Steps:
1. **Enable by Default** (30m)
2. **Add Instructions** (1h)
3. **Improve UX** (1h)
4. **Testing** (30m)

---

## 🟢 Issue #10: Form Validation (0.5 วัน)

### Steps:
1. **Validation Function** (1h)
2. **Error Display** (1h)
3. **Testing** (1h)

### Validations:
- Required fields
- GPS or polygon required
- Severity 1-5
- Households >= 0

---

# 📊 Resource Allocation

## Developer Hours:
- Week 1: 16 hours (2 days)
- Week 2: 20 hours (2.5 days)
- Week 3: 20 hours (2.5 days)
- Week 4: 24 hours (3 days)
- **Total: 80 hours (10 days)**

## Team Needed:
- 1 Backend Developer (40h)
- 1 Frontend Developer (40h)
- 1 QA Engineer (20h)
- 1 DevOps (optional, 10h)

---

# ✅ Success Metrics

## Code Quality:
- [ ] All tests passing (100%)
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Code coverage > 80%

## Performance:
- [ ] API response < 500ms (p95)
- [ ] Map loads < 2s
- [ ] GPS fix < 10s

## User Experience:
- [ ] Thai text displays correctly
- [ ] GPS errors handled gracefully
- [ ] Forms validate properly
- [ ] Clear error messages

---

# 🚀 Deployment Plan

## Phase 1: Development (Week 1-3)
- Fix all 10 issues
- Write tests
- Code review

## Phase 2: Testing (Week 4)
- E2E testing
- Performance testing
- UAT with Field Officers

## Phase 3: Staging Deploy
- Deploy to staging
- Smoke tests
- Bug fixes

## Phase 4: Production Deploy
- Deploy to production
- Monitor closely
- Rollback plan ready

---

# 📞 Contact & Support

**Project Lead:** Cascade AI  
**Timeline:** 4 weeks  
**Start Date:** 23 ธันวาคม 2568  
**Target Completion:** 20 มกราคม 2569

---

**สถานะ:** ✅ แผนพร้อมดำเนินการ
