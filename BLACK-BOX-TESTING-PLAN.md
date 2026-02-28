# 🧪 Black Box Testing Plan - Guardian Route Dashboard

**วันที่ทดสอบ**: 29 พฤศจิกายน 2568  
**ผู้ทดสอบ**: Team W  
**เวอร์ชัน**: v1.0  
**สถานะระบบ**: ✅ รันสำเร็จทั้งหมด

---

## 📋 ข้อมูลระบบที่ทดสอบ

### URLs:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/api/health

### บัญชีทดสอบ:
1. **SUPERVISOR**: supervisor@obtwiang.go.th / password123
2. **FIELD_OFFICER**: field1@obtwiang.go.th / password123

---

## 🎯 Test Scenarios

### 1. Authentication & Authorization (การยืนยันตัวตนและสิทธิ์)

#### TC-AUTH-001: Login สำเร็จ
- **Input**: Email + Password ที่ถูกต้อง
- **Expected**: เข้าสู่ระบบสำเร็จ, redirect ไปหน้า Dashboard ตาม role
- **Priority**: 🔴 Critical

#### TC-AUTH-002: Login ล้มเหลว (รหัสผ่านผิด)
- **Input**: Email ถูก + Password ผิด
- **Expected**: แสดง error message "Invalid credentials"
- **Priority**: 🔴 Critical

#### TC-AUTH-003: Login ล้มเหลว (email ไม่มีในระบบ)
- **Input**: Email ที่ไม่มีในระบบ
- **Expected**: แสดง error message
- **Priority**: 🟡 High

#### TC-AUTH-004: Logout
- **Input**: คลิกปุ่ม Logout
- **Expected**: ออกจากระบบ, redirect ไปหน้า Login
- **Priority**: 🔴 Critical

#### TC-AUTH-005: Session Timeout
- **Input**: ไม่มีการใช้งานเกิน session timeout
- **Expected**: ถูก logout อัตโนมัติ
- **Priority**: 🟡 High

#### TC-AUTH-006: Access Control - SUPERVISOR
- **Input**: Login ด้วย SUPERVISOR account
- **Expected**: เห็นเมนูทั้งหมดที่ SUPERVISOR มีสิทธิ์
- **Priority**: 🔴 Critical

#### TC-AUTH-007: Access Control - FIELD_OFFICER
- **Input**: Login ด้วย FIELD_OFFICER account
- **Expected**: เห็นเฉพาะเมนูที่ FIELD_OFFICER มีสิทธิ์
- **Priority**: 🔴 Critical

---

### 2. Dashboard (หน้าแดชบอร์ด)

#### TC-DASH-001: แสดงสถิติรวม
- **Input**: เข้าหน้า Dashboard
- **Expected**: แสดงจำนวน incidents, tasks, users ถูกต้อง
- **Priority**: 🔴 Critical

#### TC-DASH-002: แสดงกราฟ
- **Input**: เข้าหน้า Dashboard
- **Expected**: แสดงกราฟสถิติต่างๆ ถูกต้อง
- **Priority**: 🟡 High

#### TC-DASH-003: Recent Activities
- **Input**: เข้าหน้า Dashboard
- **Expected**: แสดงกิจกรรมล่าสุด
- **Priority**: 🟢 Medium

---

### 3. Incident Management (การจัดการเหตุการณ์)

#### TC-INC-001: สร้าง Incident ใหม่
- **Input**: กรอกข้อมูล incident ครบถ้วน + เลือกตำแหน่งบนแผนที่
- **Expected**: สร้าง incident สำเร็จ, แสดงในรายการ
- **Priority**: 🔴 Critical

#### TC-INC-002: สร้าง Incident (ข้อมูลไม่ครบ)
- **Input**: กรอกข้อมูลไม่ครบ
- **Expected**: แสดง validation error
- **Priority**: 🟡 High

#### TC-INC-003: อัพโหลดรูปภาพ
- **Input**: เลือกไฟล์รูปภาพ (jpg, png)
- **Expected**: อัพโหลดสำเร็จ, แสดง preview
- **Priority**: 🔴 Critical

#### TC-INC-004: อัพโหลดไฟล์ไม่ถูกต้อง
- **Input**: เลือกไฟล์ที่ไม่ใช่รูปภาพ (pdf, txt)
- **Expected**: แสดง error "Invalid file type"
- **Priority**: 🟡 High

#### TC-INC-005: ดูรายละเอียด Incident
- **Input**: คลิกดู incident ที่มีอยู่
- **Expected**: แสดงข้อมูลครบถ้วน + แผนที่
- **Priority**: 🔴 Critical

#### TC-INC-006: แก้ไข Incident
- **Input**: แก้ไขข้อมูล incident
- **Expected**: บันทึกสำเร็จ, ข้อมูลอัพเดท
- **Priority**: 🔴 Critical

#### TC-INC-007: เปลี่ยนสถานะ Incident
- **Input**: เปลี่ยนสถานะจาก PENDING → IN_PROGRESS → RESOLVED
- **Expected**: สถานะเปลี่ยนสำเร็จ
- **Priority**: 🔴 Critical

#### TC-INC-008: ลบ Incident
- **Input**: คลิกลบ incident
- **Expected**: แสดง confirmation dialog, ลบสำเร็จ
- **Priority**: 🟡 High

#### TC-INC-009: Filter Incidents ตามสถานะ
- **Input**: เลือก filter สถานะ
- **Expected**: แสดงเฉพาะ incidents ที่ตรงกับสถานะ
- **Priority**: 🟢 Medium

#### TC-INC-010: Search Incidents
- **Input**: ค้นหาด้วย keyword
- **Expected**: แสดงผลลัพธ์ที่ตรงกับคำค้น
- **Priority**: 🟢 Medium

---

### 4. Map & GIS Features (แผนที่และระบบภูมิสารสนเทศ)

#### TC-MAP-001: แสดงแผนที่พื้นฐาน
- **Input**: เข้าหน้าที่มีแผนที่
- **Expected**: แผนที่โหลดสำเร็จ, แสดง base layer
- **Priority**: 🔴 Critical

#### TC-MAP-002: แสดง Incident Markers
- **Input**: เข้าหน้าแผนที่
- **Expected**: แสดง markers ของ incidents ทั้งหมด
- **Priority**: 🔴 Critical

#### TC-MAP-003: คลิก Marker
- **Input**: คลิก marker บนแผนที่
- **Expected**: แสดง popup ข้อมูล incident
- **Priority**: 🔴 Critical

#### TC-MAP-004: Zoom In/Out
- **Input**: ใช้ zoom controls
- **Expected**: แผนที่ zoom ได้ถูกต้อง
- **Priority**: 🟡 High

#### TC-MAP-005: Pan แผนที่
- **Input**: ลากแผนที่
- **Expected**: แผนที่เลื่อนได้ถูกต้อง
- **Priority**: 🟡 High

#### TC-MAP-006: แสดงขอบเขตหมู่บ้าน
- **Input**: เข้าหน้า Village Boundaries
- **Expected**: แสดงขอบเขตหมู่บ้านที่มีอยู่
- **Priority**: 🔴 Critical

#### TC-MAP-007: วาดขอบเขตหมู่บ้านใหม่
- **Input**: เลือกหมู่บ้าน + ใช้ polygon tool วาดขอบเขต
- **Expected**: วาดได้, บันทึกสำเร็จ
- **Priority**: 🔴 Critical

#### TC-MAP-008: แก้ไขขอบเขตหมู่บ้าน
- **Input**: เลือก Edit mode + แก้ไขขอบเขต
- **Expected**: แก้ไขได้, บันทึกสำเร็จ
- **Priority**: 🔴 Critical

#### TC-MAP-009: ลบขอบเขตหมู่บ้าน
- **Input**: คลิกลบขอบเขต
- **Expected**: แสดง confirmation, ลบสำเร็จ
- **Priority**: 🟡 High

#### TC-MAP-010: สีขอบเขตหมู่บ้าน
- **Input**: ตรวจสอบสีของแต่ละหมู่บ้าน
- **Expected**: แต่ละหมู่บ้านมีสีไม่ซ้ำกัน (20 สี)
- **Priority**: 🟢 Medium

---

### 5. Task Management (การจัดการงาน)

#### TC-TASK-001: สร้าง Task ใหม่
- **Input**: กรอกข้อมูล task + assign ให้ field officer
- **Expected**: สร้างสำเร็จ, แสดงในรายการ
- **Priority**: 🔴 Critical

#### TC-TASK-002: Assign Task
- **Input**: เลือก field officer ที่จะ assign
- **Expected**: assign สำเร็จ, officer เห็น task
- **Priority**: 🔴 Critical

#### TC-TASK-003: เปลี่ยนสถานะ Task
- **Input**: เปลี่ยนสถานะ task
- **Expected**: สถานะเปลี่ยนสำเร็จ
- **Priority**: 🔴 Critical

#### TC-TASK-004: ดูรายละเอียด Task
- **Input**: คลิกดู task
- **Expected**: แสดงข้อมูลครบถ้วน
- **Priority**: 🟡 High

#### TC-TASK-005: Filter Tasks ตาม assignee
- **Input**: เลือก filter assignee
- **Expected**: แสดงเฉพาะ tasks ของ assignee นั้น
- **Priority**: 🟢 Medium

---

### 6. User Management (การจัดการผู้ใช้) - ADMIN Only

#### TC-USER-001: สร้างผู้ใช้ใหม่
- **Input**: กรอกข้อมูลผู้ใช้ครบถ้วน
- **Expected**: สร้างสำเร็จ, แสดงในรายการ
- **Priority**: 🔴 Critical

#### TC-USER-002: สร้างผู้ใช้ (email ซ้ำ)
- **Input**: ใช้ email ที่มีในระบบแล้ว
- **Expected**: แสดง error "Email already exists"
- **Priority**: 🟡 High

#### TC-USER-003: แก้ไขข้อมูลผู้ใช้
- **Input**: แก้ไขข้อมูลผู้ใช้
- **Expected**: บันทึกสำเร็จ, ข้อมูลอัพเดท
- **Priority**: 🔴 Critical

#### TC-USER-004: เปลี่ยน Role
- **Input**: เปลี่ยน role ของผู้ใช้
- **Expected**: role เปลี่ยนสำเร็จ, สิทธิ์เปลี่ยนตาม
- **Priority**: 🔴 Critical

#### TC-USER-005: ปิดการใช้งานผู้ใช้
- **Input**: คลิก deactivate user
- **Expected**: ผู้ใช้ login ไม่ได้
- **Priority**: 🟡 High

#### TC-USER-006: ลบผู้ใช้
- **Input**: คลิกลบผู้ใช้
- **Expected**: แสดง confirmation, ลบสำเร็จ
- **Priority**: 🟡 High

---

### 7. Settings (การตั้งค่า) - ตาม SA Memory

#### TC-SET-001: ทั่วไป (General)
- **Input**: แก้ไขชื่อแอป, timezone
- **Expected**: บันทึกสำเร็จ
- **Priority**: 🟡 High

#### TC-SET-002: ผู้ใช้และความปลอดภัย (Users & Security)
- **Input**: เปิด/ปิด 2FA, ตั้ง password policy
- **Expected**: บันทึกสำเร็จ
- **Priority**: 🔴 Critical

#### TC-SET-003: แผนที่และภูมิสารสนเทศ (Map & GIS)
- **Input**: ตั้งค่า default lat/lng/zoom
- **Expected**: บันทึกสำเร็จ, แผนที่ใช้ค่าใหม่
- **Priority**: 🟡 High

#### TC-SET-004: การแจ้งเตือน (Notifications)
- **Input**: เปิด/ปิด email/SMS, ใส่ LINE token
- **Expected**: บันทึกสำเร็จ
- **Priority**: 🟡 High

#### TC-SET-005: การเชื่อมต่อและ API (Connectivity & API)
- **Input**: ตั้งค่า Weather API, SMS Gateway
- **Expected**: บันทึกสำเร็จ
- **Priority**: 🟢 Medium

#### TC-SET-006: ข้อมูลและพื้นที่จัดเก็บ (Data & Storage)
- **Input**: ตั้งค่า retention policy, backup frequency
- **Expected**: บันทึกสำเร็จ
- **Priority**: 🟡 High

#### TC-SET-007: Purge Data (ลบข้อมูล)
- **Input**: คลิก Purge Data + ยืนยัน CAPTCHA
- **Expected**: แสดง confirmation + CAPTCHA, ลบสำเร็จ
- **Priority**: 🔴 Critical

#### TC-SET-008: Factory Reset
- **Input**: คลิก Factory Reset + ยืนยัน
- **Expected**: แสดง warning รุนแรง, reset สำเร็จ
- **Priority**: 🔴 Critical

---

### 8. Notifications (การแจ้งเตือน)

#### TC-NOTIF-001: แสดงรายการแจ้งเตือน
- **Input**: คลิกไอคอนแจ้งเตือน
- **Expected**: แสดงรายการแจ้งเตือนทั้งหมด
- **Priority**: 🟡 High

#### TC-NOTIF-002: อ่านแจ้งเตือน
- **Input**: คลิกแจ้งเตือน
- **Expected**: สถานะเปลี่ยนเป็น "อ่านแล้ว"
- **Priority**: 🟢 Medium

#### TC-NOTIF-003: ลบแจ้งเตือน
- **Input**: คลิกลบแจ้งเตือน
- **Expected**: ลบสำเร็จ
- **Priority**: 🟢 Medium

---

### 9. Mobile Responsiveness (การรองรับมือถือ)

#### TC-MOB-001: แสดงผลบนมือถือ (375px)
- **Input**: เปิดบนมือถือหรือ resize browser
- **Expected**: UI ปรับตัวถูกต้อง, ใช้งานได้
- **Priority**: 🔴 Critical

#### TC-MOB-002: แสดงผลบน Tablet (768px)
- **Input**: เปิดบน tablet หรือ resize browser
- **Expected**: UI ปรับตัวถูกต้อง
- **Priority**: 🟡 High

#### TC-MOB-003: Touch Controls บนแผนที่
- **Input**: ใช้ touch บนแผนที่ (mobile)
- **Expected**: zoom, pan ได้ถูกต้อง
- **Priority**: 🔴 Critical

---

### 10. Performance & Error Handling (ประสิทธิภาพและการจัดการข้อผิดพลาด)

#### TC-PERF-001: Page Load Time
- **Input**: โหลดหน้าต่างๆ
- **Expected**: โหลดเสร็จภายใน 3 วินาที
- **Priority**: 🟡 High

#### TC-PERF-002: API Response Time
- **Input**: เรียก API ต่างๆ
- **Expected**: response ภายใน 1 วินาที
- **Priority**: 🟡 High

#### TC-ERR-001: Network Error
- **Input**: ปิด backend, ลองใช้งาน
- **Expected**: แสดง error message ที่เข้าใจได้
- **Priority**: 🟡 High

#### TC-ERR-002: 404 Not Found
- **Input**: เข้า URL ที่ไม่มี
- **Expected**: แสดงหน้า 404 ที่สวยงาม
- **Priority**: 🟢 Medium

#### TC-ERR-003: 500 Server Error
- **Input**: ทำให้ server error (ถ้าทำได้)
- **Expected**: แสดง error message ที่เหมาะสม
- **Priority**: 🟢 Medium

---

## 📊 Test Execution Template

### สำหรับแต่ละ Test Case:

```
TC-XXX-XXX: [ชื่อ Test Case]
┌─────────────────────────────────────────┐
│ Status: [ ] PASS  [ ] FAIL  [ ] SKIP    │
│ Tester: _________________________       │
│ Date: ___________________________       │
├─────────────────────────────────────────┤
│ Actual Result:                          │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│ Screenshots/Evidence:                   │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│ Notes/Issues:                           │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Test Coverage Summary

| Module | Total Cases | Critical | High | Medium |
|--------|-------------|----------|------|--------|
| Authentication | 7 | 4 | 2 | 0 |
| Dashboard | 3 | 1 | 1 | 1 |
| Incidents | 10 | 6 | 3 | 1 |
| Map & GIS | 10 | 6 | 2 | 2 |
| Tasks | 5 | 3 | 1 | 1 |
| Users | 6 | 3 | 3 | 0 |
| Settings | 8 | 2 | 4 | 1 |
| Notifications | 3 | 0 | 1 | 2 |
| Mobile | 3 | 2 | 1 | 0 |
| Performance | 5 | 0 | 3 | 2 |
| **TOTAL** | **60** | **27** | **21** | **10** |

---

## 📝 Testing Checklist

### Before Testing:
- [ ] ระบบรันครบทั้ง 3 ส่วน (DB, Backend, Frontend)
- [ ] มีบัญชีทดสอบทุก role
- [ ] มีข้อมูลทดสอบในระบบ
- [ ] เตรียม browser ทดสอบ (Chrome, Firefox, Safari)
- [ ] เตรียมอุปกรณ์มือถือ/tablet (ถ้ามี)

### During Testing:
- [ ] บันทึกผลทุก test case
- [ ] Screenshot ทุก bug ที่พบ
- [ ] บันทึก error messages
- [ ] ทดสอบตามลำดับ priority (Critical → High → Medium)

### After Testing:
- [ ] สรุปผลการทดสอบ
- [ ] รายงาน bugs ที่พบ
- [ ] แนะนำการปรับปรุง
- [ ] ส่งรายงานให้ SA

---

## 🐛 Bug Report Template

```markdown
### BUG-XXX: [ชื่อ Bug]

**Severity**: 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low
**Module**: [ชื่อ Module]
**Found in**: TC-XXX-XXX

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**:


**Actual Result**:


**Screenshots**:
[แนบ screenshots]

**Environment**:
- Browser: 
- OS: 
- Screen Size: 

**Additional Notes**:

```

---

## 📈 Success Criteria

### ระบบผ่านการทดสอบได้ถ้า:
- ✅ Critical test cases ผ่านทั้งหมด (100%)
- ✅ High priority test cases ผ่านอย่างน้อย 90%
- ✅ Medium priority test cases ผ่านอย่างน้อย 80%
- ✅ ไม่มี Critical bugs
- ✅ High bugs ไม่เกิน 3 bugs
- ✅ ระบบใช้งานได้บนมือถือ

---

## 📞 Contact

**หากพบปัญหาหรือมีคำถาม**:
- สร้าง issue ใน GitHub
- ติดต่อ SA
- ดูเอกสารเพิ่มเติมใน `/docs`

---

**Happy Testing! 🧪✨**
