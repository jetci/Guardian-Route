# Supervisor Module - Testing Guide

**Project:** Guardian Route - Disaster Management System  
**Module:** Supervisor Module  
**Version:** 1.0.0  
**Last Updated:** November 9, 2025

---

## 📋 Overview

เอกสารนี้เป็นคู่มือสำหรับการทดสอบ Supervisor Module ครอบคลุมทั้ง Manual Testing และ Automated Testing

---

## 🎯 Testing Scope

### Features to Test

1. ✅ Assign Incidents to Field Officers
2. ✅ Review and Approve Incidents
3. ✅ Review and Reject Incidents
4. ✅ Role-Based Access Control
5. ✅ Activity Logging
6. ✅ Error Handling
7. ✅ UI/UX Validation

---

## 🔧 Test Environment Setup

### Prerequisites

1. **Database:**
   ```bash
   docker compose up -d postgres
   ```

2. **Seed Data:**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   ```

3. **Backend:**
   ```bash
   cd backend
   npm run start:dev
   ```

4. **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### Test Accounts

| Role | Username | Password | Email |
|------|----------|----------|-------|
| SUPERVISOR | supervisor1 | password123 | supervisor@test.com |
| FIELD_OFFICER | officer1 | password123 | officer1@test.com |
| FIELD_OFFICER | officer2 | password123 | officer2@test.com |
| ADMIN | admin | password123 | admin@test.com |

---

## 🧪 Manual Testing

### Test Case 1: Assign Incident to Field Officer

**Objective:** ทดสอบการมอบหมายเหตุการณ์ให้กับเจ้าหน้าที่ภาคสนาม

**Preconditions:**
- Login as SUPERVISOR
- มีเหตุการณ์ที่ status = PENDING อย่างน้อย 1 รายการ
- มี Field Officer อย่างน้อย 1 คน

**Test Steps:**

1. **Navigate to Dashboard**
   - เข้าสู่ระบบด้วย supervisor account
   - ไปที่หน้า Supervisor Dashboard
   - ✅ ต้องเห็นรายการเหตุการณ์

2. **Open Assign Modal**
   - คลิกปุ่ม "มอบหมาย" ที่เหตุการณ์ที่มี status = PENDING
   - ✅ Modal "มอบหมายเหตุการณ์" เปิดขึ้น
   - ✅ แสดงข้อมูลเหตุการณ์ (title, description)
   - ✅ แสดง dropdown สำหรับเลือก Field Officer
   - ✅ แสดง textarea สำหรับหมายเหตุ

3. **Load Field Officers**
   - ตรวจสอบ dropdown
   - ✅ มี placeholder "-- เลือกเจ้าหน้าที่ --"
   - ✅ มีรายชื่อ Field Officers ในระบบ
   - ✅ แสดงชื่อ-นามสกุล และ username

4. **Submit Assignment (Valid)**
   - เลือก Field Officer จาก dropdown
   - ใส่หมายเหตุ "กรุณาตรวจสอบพื้นที่โดยเร็ว"
   - คลิกปุ่ม "มอบหมาย"
   - ✅ แสดง loading state
   - ✅ แสดง toast "มอบหมายงานสำเร็จ"
   - ✅ Modal ปิดลง
   - ✅ รายการเหตุการณ์ refresh

5. **Verify Assignment**
   - ดูรายละเอียดเหตุการณ์ที่มอบหมาย
   - ✅ มี assignedTo = Field Officer ที่เลือก
   - ✅ มี ActivityLog บันทึกการมอบหมาย

6. **Submit Assignment (Invalid - No Officer Selected)**
   - เปิด Assign Modal อีกครั้ง
   - ไม่เลือก Field Officer
   - คลิกปุ่ม "มอบหมาย"
   - ✅ แสดง toast "กรุณาเลือกเจ้าหน้าที่"
   - ✅ Modal ยังเปิดอยู่

7. **Cancel Assignment**
   - เปิด Assign Modal
   - คลิกปุ่ม "ยกเลิก"
   - ✅ Modal ปิดลง
   - ✅ ไม่มีการเปลี่ยนแปลงข้อมูล

**Expected Results:**
- ✅ สามารถมอบหมายเหตุการณ์ได้สำเร็จ
- ✅ Validation ทำงานถูกต้อง
- ✅ UI feedback ชัดเจน
- ✅ ActivityLog บันทึกครบถ้วน

---

### Test Case 2: Review and Approve Incident

**Objective:** ทดสอบการตรวจสอบและอนุมัติเหตุการณ์

**Preconditions:**
- Login as SUPERVISOR
- มีเหตุการณ์ที่ status = PENDING อย่างน้อย 1 รายการ

**Test Steps:**

1. **Navigate to Dashboard**
   - เข้าสู่ระบบด้วย supervisor account
   - ไปที่หน้า Supervisor Dashboard
   - ✅ ต้องเห็นรายการเหตุการณ์

2. **Open Review Modal**
   - คลิกปุ่ม "ตรวจสอบ" ที่เหตุการณ์ที่มี status = PENDING
   - ✅ Modal "ตรวจสอบเหตุการณ์" เปิดขึ้น
   - ✅ แสดงข้อมูลเหตุการณ์แบบละเอียด
   - ✅ แสดง radio buttons (อนุมัติ/ปฏิเสธ)
   - ✅ แสดง textarea สำหรับความเห็น (required)
   - ✅ แสดง textarea สำหรับหมายเหตุเพิ่มเติม (optional)

3. **Select Approve**
   - เลือก radio "อนุมัติ (ส่งต่อเพื่อดำเนินการ)"
   - ✅ ปุ่ม submit เป็นสีเขียว
   - ✅ ข้อความปุ่มเป็น "อนุมัติ"

4. **Submit Review (Valid)**
   - ใส่ความเห็น "เหตุการณ์มีความสำคัญ ควรดำเนินการโดยเร็ว"
   - ใส่หมายเหตุ "ติดต่อผู้ใหญ่บ้านเพื่อประสานงาน"
   - คลิกปุ่ม "อนุมัติ"
   - ✅ แสดง loading state
   - ✅ แสดง toast "ตรวจสอบสำเร็จ - ได้อนุมัติเหตุการณ์แล้ว"
   - ✅ Modal ปิดลง
   - ✅ รายการเหตุการณ์ refresh

5. **Verify Approval**
   - ดูรายละเอียดเหตุการณ์ที่อนุมัติ
   - ✅ status เปลี่ยนเป็น INVESTIGATING
   - ✅ มี reviewNotes บันทึกไว้
   - ✅ มี additionalNotes บันทึกไว้
   - ✅ มี ActivityLog บันทึกการตรวจสอบ

6. **Submit Review (Invalid - No Review Notes)**
   - เปิด Review Modal อีกครั้ง
   - ไม่ใส่ความเห็น
   - คลิกปุ่ม "อนุมัติ"
   - ✅ แสดง toast "กรุณากรอกความเห็น"
   - ✅ Modal ยังเปิดอยู่

7. **Cancel Review**
   - เปิด Review Modal
   - คลิกปุ่ม "ยกเลิก"
   - ✅ Modal ปิดลง
   - ✅ ไม่มีการเปลี่ยนแปลงข้อมูล

**Expected Results:**
- ✅ สามารถอนุมัติเหตุการณ์ได้สำเร็จ
- ✅ Status เปลี่ยนเป็น INVESTIGATING
- ✅ Validation ทำงานถูกต้อง
- ✅ ActivityLog บันทึกครบถ้วน

---

### Test Case 3: Review and Reject Incident

**Objective:** ทดสอบการตรวจสอบและปฏิเสธเหตุการณ์

**Preconditions:**
- Login as SUPERVISOR
- มีเหตุการณ์ที่ status = PENDING อย่างน้อย 1 รายการ

**Test Steps:**

1. **Open Review Modal**
   - คลิกปุ่ม "ตรวจสอบ" ที่เหตุการณ์ที่มี status = PENDING
   - ✅ Modal "ตรวจสอบเหตุการณ์" เปิดขึ้น

2. **Select Reject**
   - เลือก radio "ปฏิเสธ (ไม่ดำเนินการ)"
   - ✅ ปุ่ม submit เป็นสีแดง
   - ✅ ข้อความปุ่มเป็น "ปฏิเสธ"

3. **Submit Review**
   - ใส่ความเห็น "ข้อมูลไม่ครบถ้วน ไม่สามารถดำเนินการได้"
   - คลิกปุ่ม "ปฏิเสธ"
   - ✅ แสดง loading state
   - ✅ แสดง toast "ตรวจสอบสำเร็จ - ได้ปฏิเสธเหตุการณ์แล้ว"
   - ✅ Modal ปิดลง
   - ✅ รายการเหตุการณ์ refresh

4. **Verify Rejection**
   - ดูรายละเอียดเหตุการณ์ที่ปฏิเสธ
   - ✅ status เปลี่ยนเป็น REJECTED
   - ✅ มี reviewNotes บันทึกไว้
   - ✅ มี ActivityLog บันทึกการตรวจสอบ

**Expected Results:**
- ✅ สามารถปฏิเสธเหตุการณ์ได้สำเร็จ
- ✅ Status เปลี่ยนเป็น REJECTED
- ✅ ActivityLog บันทึกครบถ้วน

---

### Test Case 4: Role-Based Access Control

**Objective:** ทดสอบการควบคุมสิทธิ์การเข้าถึงตาม role

**Test Steps:**

1. **Test as FIELD_OFFICER**
   - Login as officer1
   - ไปที่หน้า Incidents List
   - ✅ ไม่เห็นปุ่ม "มอบหมาย"
   - ✅ ไม่เห็นปุ่ม "ตรวจสอบ"
   - พยายามเข้า `/incidents/unassigned` ด้วย API
   - ✅ ได้รับ 403 Forbidden

2. **Test as SUPERVISOR**
   - Login as supervisor1
   - ไปที่หน้า Incidents List
   - ✅ เห็นปุ่ม "มอบหมาย" (เฉพาะ PENDING)
   - ✅ เห็นปุ่ม "ตรวจสอบ" (เฉพาะ PENDING)
   - สามารถเข้า `/incidents/unassigned`
   - ✅ ได้รับข้อมูลเหตุการณ์

3. **Test as ADMIN**
   - Login as admin
   - ไปที่หน้า Incidents List
   - ✅ เห็นปุ่ม "มอบหมาย"
   - ✅ เห็นปุ่ม "ตรวจสอบ"
   - สามารถเข้า `/incidents/unassigned`
   - ✅ ได้รับข้อมูลเหตุการณ์

**Expected Results:**
- ✅ FIELD_OFFICER ไม่สามารถเข้าถึงฟีเจอร์ Supervisor ได้
- ✅ SUPERVISOR และ ADMIN เข้าถึงได้
- ✅ UI แสดง/ซ่อนปุ่มตาม role

---

### Test Case 5: Activity Logging

**Objective:** ทดสอบการบันทึก Activity Log

**Test Steps:**

1. **Assign Incident**
   - มอบหมายเหตุการณ์ให้ Field Officer
   - ตรวจสอบ ActivityLog table
   - ✅ มี record ใหม่
   - ✅ action = "ASSIGN_INCIDENT"
   - ✅ userId = supervisor id
   - ✅ incidentId = incident id
   - ✅ details มี fieldOfficerId และ notes

2. **Review Incident**
   - ตรวจสอบและอนุมัติเหตุการณ์
   - ตรวจสอบ ActivityLog table
   - ✅ มี record ใหม่
   - ✅ action = "REVIEW_INCIDENT"
   - ✅ userId = supervisor id
   - ✅ incidentId = incident id
   - ✅ details มี status, reviewNotes, additionalNotes

**Expected Results:**
- ✅ ทุก action บันทึกใน ActivityLog
- ✅ ข้อมูลครบถ้วนและถูกต้อง

---

### Test Case 6: Error Handling

**Objective:** ทดสอบการจัดการ errors

**Test Steps:**

1. **Network Error**
   - ปิด Backend
   - พยายามมอบหมายเหตุการณ์
   - ✅ แสดง toast "เกิดข้อผิดพลาด - ไม่สามารถมอบหมายงานได้"
   - ✅ Modal ยังเปิดอยู่

2. **Invalid Field Officer ID**
   - ส่ง request ด้วย fieldOfficerId ที่ไม่มีในระบบ
   - ✅ ได้รับ 404 Not Found
   - ✅ แสดง error message

3. **Incident Already Assigned**
   - พยายามมอบหมายเหตุการณ์ที่มอบหมายแล้ว
   - ✅ ได้รับ 400 Bad Request
   - ✅ แสดง error message

**Expected Results:**
- ✅ Error handling ทำงานถูกต้อง
- ✅ แสดง error message ที่เข้าใจได้
- ✅ ไม่ crash

---

## 🤖 Automated Testing

### Backend Unit Tests

**File:** `backend/src/incidents/incidents.service.spec.ts`

```typescript
describe('IncidentsService - Supervisor Functions', () => {
  let service: IncidentsService;
  let prisma: PrismaService;
  let activityLog: ActivityLogService;

  beforeEach(async () => {
    // Setup test module
  });

  describe('assign', () => {
    it('should assign incident to field officer', async () => {
      const incident = await service.assign('incident-id', {
        fieldOfficerId: 'officer-id',
        notes: 'Test notes',
      }, 'supervisor-id');

      expect(incident.assignedToId).toBe('officer-id');
      expect(activityLog.log).toHaveBeenCalledWith({
        action: 'ASSIGN_INCIDENT',
        userId: 'supervisor-id',
        incidentId: 'incident-id',
        details: expect.any(Object),
      });
    });

    it('should throw error if incident not found', async () => {
      await expect(
        service.assign('invalid-id', { fieldOfficerId: 'officer-id' }, 'supervisor-id')
      ).rejects.toThrow('Incident not found');
    });

    it('should throw error if field officer not found', async () => {
      await expect(
        service.assign('incident-id', { fieldOfficerId: 'invalid-id' }, 'supervisor-id')
      ).rejects.toThrow('Field officer not found');
    });
  });

  describe('review', () => {
    it('should approve incident', async () => {
      const incident = await service.review('incident-id', {
        status: IncidentStatus.INVESTIGATING,
        reviewNotes: 'Approved',
      }, 'supervisor-id');

      expect(incident.status).toBe(IncidentStatus.INVESTIGATING);
      expect(incident.reviewNotes).toBe('Approved');
    });

    it('should reject incident', async () => {
      const incident = await service.review('incident-id', {
        status: IncidentStatus.REJECTED,
        reviewNotes: 'Rejected',
      }, 'supervisor-id');

      expect(incident.status).toBe(IncidentStatus.REJECTED);
      expect(incident.reviewNotes).toBe('Rejected');
    });

    it('should require review notes', async () => {
      await expect(
        service.review('incident-id', {
          status: IncidentStatus.INVESTIGATING,
          reviewNotes: '',
        }, 'supervisor-id')
      ).rejects.toThrow('Review notes are required');
    });
  });
});
```

### Backend E2E Tests

**File:** `backend/test/supervisor.e2e-spec.ts`

```typescript
describe('Supervisor Module (E2E)', () => {
  let app: INestApplication;
  let supervisorToken: string;
  let officerToken: string;

  beforeAll(async () => {
    // Setup app and get tokens
  });

  describe('POST /incidents/:id/assign', () => {
    it('should assign incident as supervisor', () => {
      return request(app.getHttpServer())
        .patch('/incidents/incident-id/assign')
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send({
          fieldOfficerId: 'officer-id',
          notes: 'Test notes',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.assignedToId).toBe('officer-id');
        });
    });

    it('should reject as field officer', () => {
      return request(app.getHttpServer())
        .patch('/incidents/incident-id/assign')
        .set('Authorization', `Bearer ${officerToken}`)
        .send({
          fieldOfficerId: 'officer-id',
        })
        .expect(403);
    });
  });

  describe('POST /incidents/:id/review', () => {
    it('should review incident as supervisor', () => {
      return request(app.getHttpServer())
        .patch('/incidents/incident-id/review')
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send({
          status: 'INVESTIGATING',
          reviewNotes: 'Approved',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('INVESTIGATING');
        });
    });
  });
});
```

### Frontend Component Tests

**File:** `frontend/src/components/supervisor/AssignIncidentModal.test.tsx`

```typescript
describe('AssignIncidentModal', () => {
  it('should render modal', () => {
    render(
      <AssignIncidentModal
        isOpen={true}
        onClose={jest.fn()}
        incident={mockIncident}
        onSuccess={jest.fn()}
      />
    );

    expect(screen.getByText('มอบหมายเหตุการณ์')).toBeInTheDocument();
  });

  it('should load field officers', async () => {
    render(<AssignIncidentModal {...props} />);

    await waitFor(() => {
      expect(screen.getByText('สมหญิง ขยัน')).toBeInTheDocument();
    });
  });

  it('should submit assignment', async () => {
    const onSuccess = jest.fn();
    render(<AssignIncidentModal {...props} onSuccess={onSuccess} />);

    // Select officer
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'officer-id' },
    });

    // Submit
    fireEvent.click(screen.getByText('มอบหมาย'));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

---

## 📊 Test Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| Backend Unit Tests | 80% | TBD |
| Backend E2E Tests | 70% | TBD |
| Frontend Component Tests | 60% | TBD |
| Manual Test Cases | 100% | 100% |

---

## 🐛 Bug Report Template

```markdown
### Bug Report

**Title:** [Short description]

**Severity:** Critical / High / Medium / Low

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Backend: v1.0.0
- Frontend: v1.0.0

**Steps to Reproduce:**
1. Login as supervisor
2. Click "มอบหมาย" button
3. ...

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[Attach screenshots]

**Console Errors:**
```
[Paste console errors]
```

**Additional Notes:**
[Any other relevant information]
```

---

## ✅ Test Checklist

### Before Release

- [ ] All manual test cases passed
- [ ] Backend unit tests passed (>80% coverage)
- [ ] Backend E2E tests passed
- [ ] Frontend component tests passed
- [ ] Role-based access control verified
- [ ] Activity logging verified
- [ ] Error handling verified
- [ ] UI/UX validated
- [ ] Performance tested (load time < 2s)
- [ ] Mobile responsive tested
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Security audit passed
- [ ] Documentation updated

---

## 📞 Support

**QA Team:** qa@guardianroute.local  
**Developer Team:** dev@guardianroute.local  
**Bug Tracker:** [GitHub Issues](https://github.com/jetci/Guardian-Route/issues)

---

**Document Version:** 1.0.0  
**Last Updated:** November 9, 2025  
**Status:** ✅ Ready for Testing
