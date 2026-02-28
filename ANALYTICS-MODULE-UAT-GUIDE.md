# 📊 Analytics Module - UAT Guide

**Module:** Advanced Analytics Dashboard  
**Version:** 1.0.0  
**Date:** 25 พฤศจิกายน 2568 (2025)  
**Team:** W  
**Status:** ✅ Ready for UAT

---

## 📋 **Overview**

Analytics Module ให้ผู้ใช้ทุก role สามารถดูข้อมูลสถิติและแนวโน้มการทำงานผ่าน interactive charts พร้อม filter ช่วงเวลาแบบ Thai Buddhist Calendar

---

## 🎯 **Features Implemented**

### **1. Chart 1: Task Status Overview**
- **Type:** Horizontal Bar Chart
- **Data:** จำนวนงานแยกตามสถานะ
- **Features:**
  - แสดงจำนวนและเปอร์เซ็นต์
  - สี color-coded ตามสถานะ
  - Summary badges
  - Custom tooltip

### **2. Chart 2: Task Trend Over Time**
- **Type:** Multi-Line Chart
- **Data:** แนวโน้มการสร้างและทำงานเสร็จ
- **Features:**
  - 4 เส้น (สร้างใหม่, เสร็จสิ้น, กำลังดำเนินการ, รอดำเนินการ)
  - Trend indicator (UP/DOWN/STABLE)
  - Completion rate
  - Thai date labels

### **3. Date Range Filter**
- **Quick Ranges:** วันนี้, 7 วัน, 30 วัน, เดือนนี้, ไตรมาสนี้
- **Custom Range:** เลือกวันที่เริ่มต้น-สิ้นสุดเอง
- **Thai Calendar:** แสดง พ.ศ. ใน UI
- **Auto-refresh:** Charts อัปเดตอัตโนมัติเมื่อเปลี่ยนช่วงเวลา

---

## 🔐 **RBAC - Role-Based Access Control**

| Role | Access | Data Scope |
|------|--------|------------|
| **ADMIN** | ✅ Full Access | All tasks |
| **EXECUTIVE** | ✅ Full Access | All tasks |
| **SUPERVISOR** | ✅ Full Access | Team tasks (future) |
| **FIELD_OFFICER** | ✅ Full Access | Own tasks only |

---

## 🌐 **Access URL**

```
http://localhost:5173/analytics
```

**Note:** ต้อง login ก่อน และมี role ที่ได้รับอนุญาต

---

## 🧪 **UAT Test Cases**

### **Test Case 1: Access Control**

**Objective:** ตรวจสอบ RBAC

**Steps:**
1. Login ด้วย role ต่างๆ
2. Navigate to `/analytics`
3. ตรวจสอบว่าเข้าถึงได้หรือไม่

**Expected Results:**
- ✅ ADMIN: เข้าถึงได้
- ✅ EXECUTIVE: เข้าถึงได้
- ✅ SUPERVISOR: เข้าถึงได้
- ✅ FIELD_OFFICER: เข้าถึงได้
- ❌ Unauthenticated: Redirect to /login
- ❌ Other roles: Redirect to /unauthorized

---

### **Test Case 2: Chart 1 - Task Status Overview**

**Objective:** ตรวจสอบการแสดงผล Chart 1

**Steps:**
1. Login และเข้า `/analytics`
2. ตรวจสอบ Chart 1 (ซ้ายบน)

**Expected Results:**
- ✅ แสดง horizontal bar chart
- ✅ แสดงจำนวนงานแต่ละสถานะ
- ✅ แสดงเปอร์เซ็นต์
- ✅ สีตรงตามสถานะ (PENDING=gray, IN_PROGRESS=blue, COMPLETED=green, etc.)
- ✅ แสดง summary badges ด้านบน
- ✅ Tooltip แสดงรายละเอียดเมื่อ hover

**Data Validation:**
- ✅ จำนวนรวมตรงกับ badge "ทั้งหมด"
- ✅ เปอร์เซ็นต์รวมเป็น 100%

---

### **Test Case 3: Chart 2 - Task Trend**

**Objective:** ตรวจสอบการแสดงผล Chart 2

**Steps:**
1. Login และเข้า `/analytics`
2. ตรวจสอบ Chart 2 (ขวาบน)

**Expected Results:**
- ✅ แสดง line chart
- ✅ แสดง 4 เส้น (สร้างใหม่, เสร็จสิ้น, กำลังดำเนินการ, รอดำเนินการ)
- ✅ แสดง trend indicator (UP/DOWN/STABLE)
- ✅ แสดง completion rate
- ✅ วันที่แสดงเป็น Thai format (เช่น "25 พ.ย. 2567")
- ✅ Tooltip แสดงรายละเอียดเมื่อ hover

**Data Validation:**
- ✅ จำนวน "สร้างทั้งหมด" ตรงกับ badge
- ✅ จำนวน "เสร็จสิ้น" ตรงกับ badge
- ✅ Completion rate คำนวณถูกต้อง (เสร็จสิ้น/สร้างทั้งหมด * 100)

---

### **Test Case 4: Quick Date Filter**

**Objective:** ตรวจสอบ quick range buttons

**Steps:**
1. Login และเข้า `/analytics`
2. คลิกปุ่ม "วันนี้"
3. ตรวจสอบ charts อัปเดต
4. ทดสอบปุ่มอื่นๆ (7 วัน, 30 วัน, เดือนนี้, ไตรมาสนี้)

**Expected Results:**
- ✅ ปุ่มที่เลือกมีสีเข้ม (active state)
- ✅ Charts reload ทันที
- ✅ แสดง loading skeleton ระหว่างโหลด
- ✅ ข้อมูลตรงกับช่วงเวลาที่เลือก
- ✅ ไม่มี flickering

**Performance:**
- ✅ API response < 500ms
- ✅ UI smooth, ไม่กระตุก

---

### **Test Case 5: Custom Date Range**

**Objective:** ตรวจสอบ custom date picker

**Steps:**
1. Login และเข้า `/analytics`
2. คลิกปุ่ม date range (ด้านขวาของ "ช่วงเวลา")
3. เลือกวันที่เริ่มต้น
4. เลือกวันที่สิ้นสุด
5. คลิก "ตกลง"

**Expected Results:**
- ✅ Popover เปิดขึ้น
- ✅ แสดงวันที่เป็น Thai format (พ.ศ.)
- ✅ Input type="date" ทำงานได้
- ✅ คลิก "ตกลง" → Charts อัปเดต
- ✅ คลิก "ยกเลิก" → ไม่มีการเปลี่ยนแปลง
- ✅ ปุ่ม quick range ไม่มีสีเข้ม (deselected)

**Edge Cases:**
- ✅ เลือก start > end → ระบบ swap อัตโนมัติ
- ✅ เลือกวันเดียวกัน → แสดงข้อมูลวันนั้น

---

### **Test Case 6: Loading States**

**Objective:** ตรวจสอบ loading states

**Steps:**
1. Login และเข้า `/analytics`
2. สังเกต loading state ตอนโหลดครั้งแรก
3. เปลี่ยน date range
4. สังเกต loading state

**Expected Results:**
- ✅ แสดง skeleton placeholder ระหว่างโหลด
- ✅ แต่ละ chart มี loading state แยกกัน
- ✅ ไม่มี white screen
- ✅ Smooth transition จาก loading → data

---

### **Test Case 7: Empty State**

**Objective:** ตรวจสอบ empty state

**Steps:**
1. Login และเข้า `/analytics`
2. เลือกช่วงเวลาที่ไม่มีข้อมูล (เช่น อนาคต)

**Expected Results:**
- ✅ แสดงข้อความ "ไม่มีข้อมูล"
- ✅ แสดงคำแนะนำ "ลองเปลี่ยนช่วงเวลาหรือตัวกรองอื่น"
- ✅ ไม่มี error
- ✅ UI ยังคงใช้งานได้

---

### **Test Case 8: Error Handling**

**Objective:** ตรวจสอบ error handling

**Steps:**
1. Login และเข้า `/analytics`
2. ปิด backend server
3. เปลี่ยน date range

**Expected Results:**
- ✅ แสดง toast notification "เกิดข้อผิดพลาด"
- ✅ แสดงข้อความ error ใน chart
- ✅ ไม่ crash
- ✅ สามารถลองใหม่ได้

---

### **Test Case 9: Responsive Design**

**Objective:** ตรวจสอบ responsive UI

**Steps:**
1. Login และเข้า `/analytics`
2. ทดสอบบน desktop (1920x1080)
3. ทดสอบบน tablet (768x1024)
4. ทดสอบบน mobile (375x667)

**Expected Results:**
- ✅ Desktop: 2 columns
- ✅ Tablet/Mobile: 1 column (stack)
- ✅ Charts ปรับขนาดอัตโนมัติ
- ✅ Filter buttons wrap ได้
- ✅ ไม่มี horizontal scroll
- ✅ Text อ่านได้ชัดเจน

---

### **Test Case 10: RBAC Data Filtering**

**Objective:** ตรวจสอบ data filtering ตาม role

**Steps:**
1. Login ด้วย FIELD_OFFICER
2. เข้า `/analytics`
3. ตรวจสอบข้อมูล
4. Login ด้วย ADMIN
5. เข้า `/analytics`
6. เปรียบเทียบข้อมูล

**Expected Results:**
- ✅ FIELD_OFFICER: เห็นเฉพาะงานของตัวเอง
- ✅ ADMIN: เห็นงานทั้งหมด
- ✅ จำนวนงานต่างกัน (ถ้ามีข้อมูล)

---

## ⚡ **Performance Benchmarks**

| Metric | Target | Actual |
|--------|--------|--------|
| API Latency (Task Status) | < 500ms | ✅ To be measured |
| API Latency (Task Trend) | < 500ms | ✅ To be measured |
| Initial Page Load | < 2s | ✅ To be measured |
| Chart Render Time | < 100ms | ✅ To be measured |
| Filter Change Response | < 500ms | ✅ To be measured |

**How to Measure:**
1. เปิด DevTools → Network tab
2. เข้า `/analytics`
3. ดู response time ของ `/analytics/tasks/status` และ `/analytics/tasks/trend`
4. บันทึกผลลัพธ์

---

## 🐛 **Known Issues**

**None at this time** ✅

---

## 📝 **UAT Checklist**

### **Functional Testing:**
- [ ] Test Case 1: Access Control
- [ ] Test Case 2: Chart 1 Display
- [ ] Test Case 3: Chart 2 Display
- [ ] Test Case 4: Quick Date Filter
- [ ] Test Case 5: Custom Date Range
- [ ] Test Case 6: Loading States
- [ ] Test Case 7: Empty State
- [ ] Test Case 8: Error Handling
- [ ] Test Case 9: Responsive Design
- [ ] Test Case 10: RBAC Data Filtering

### **Performance Testing:**
- [ ] API Latency < 500ms
- [ ] Page Load < 2s
- [ ] Smooth transitions
- [ ] No memory leaks

### **Security Testing:**
- [ ] RBAC enforced
- [ ] JWT validation
- [ ] No data leakage

### **Usability Testing:**
- [ ] Thai language correct
- [ ] Buddhist calendar accurate
- [ ] Intuitive UI
- [ ] Clear error messages

---

## 🚀 **Deployment Checklist**

### **Backend:**
- [x] ✅ Analytics Module created
- [x] ✅ Endpoints implemented
- [x] ✅ RBAC enforced
- [x] ✅ Database indexes (if needed)
- [x] ✅ Error handling
- [x] ✅ Logging

### **Frontend:**
- [x] ✅ Components created
- [x] ✅ Routes configured
- [x] ✅ RBAC integrated
- [x] ✅ Error boundaries
- [x] ✅ Loading states
- [x] ✅ Responsive design

### **Documentation:**
- [x] ✅ UAT Guide
- [x] ✅ API Documentation (Swagger)
- [x] ✅ Code comments
- [ ] User manual (if needed)

---

## 📞 **Support**

**Issues/Questions:**
- Report to: ทีม W
- Response Time: < 24 hours

**UAT Period:**
- Start: 26 พฤศจิกายน 2568
- Duration: TBD
- Tester: J (ฝ่ายทดสอบ)

---

## ✅ **Sign-off**

**Developed by:** ทีม W  
**Reviewed by:** System Analyst  
**Date:** 25 พฤศจิกายน 2568  
**Status:** ✅ **READY FOR UAT**

---

**Guardian Route - Analytics Module**  
**Version 1.0.0**  
**© 2568 (2025)**
