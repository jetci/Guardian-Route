# 🧪 Menu Testing Template

**วันที่**: _______________  
**ผู้ทดสอบ**: _______________  
**Browser**: _______________  
**Screen Size**: _______________

---

## 📋 Menu Information

**Menu Name**: _______________  
**Path**: _______________  
**Component**: _______________  
**Access Role**: _______________  
**Priority**: 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low

---

## ✅ UI/UX Testing Checklist

### 1. Page Load & Layout
- [ ] หน้า UI โหลดได้ (ไม่มี white screen)
- [ ] Layout ถูกต้อง (ไม่เบี้ยว, ไม่ซ้อนกัน)
- [ ] Header/Title แสดงถูกต้อง
- [ ] Sidebar/Navigation แสดงถูกต้อง
- [ ] Footer แสดงถูกต้อง (ถ้ามี)

**Screenshot**:
```
[แนบ screenshot ของหน้าเต็ม]
```

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

---

### 2. Responsive Design
- [ ] Desktop (1920x1080) - ✅ / ❌
- [ ] Laptop (1366x768) - ✅ / ❌
- [ ] Tablet (768x1024) - ✅ / ❌
- [ ] Mobile (375x667) - ✅ / ❌

**Screenshots**:
```
Desktop: [แนบ screenshot]
Tablet: [แนบ screenshot]
Mobile: [แนบ screenshot]
```

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

---

### 3. Interactive Elements

#### Buttons:
- [ ] ปุ่มทั้งหมดแสดงถูกต้อง
- [ ] Hover states ทำงานได้
- [ ] Click events ทำงานได้
- [ ] Disabled states ถูกต้อง
- [ ] Loading states แสดงถูกต้อง

**List of Buttons**:
1. _______________
2. _______________
3. _______________

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

#### Forms (ถ้ามี):
- [ ] Input fields แสดงถูกต้อง
- [ ] Placeholder text ชัดเจน
- [ ] Labels ครบถ้วน
- [ ] Required fields มีเครื่องหมาย *
- [ ] Validation ทำงานได้
- [ ] Error messages ชัดเจน
- [ ] Success feedback มี

**Form Fields**:
1. _______________
2. _______________
3. _______________

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

#### Tables/Lists (ถ้ามี):
- [ ] Headers แสดงถูกต้อง
- [ ] Data แสดงครบถ้วน
- [ ] Sorting ทำงานได้
- [ ] Pagination ทำงานได้
- [ ] Search/Filter ทำงานได้
- [ ] Empty state แสดงถูกต้อง

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

---

### 4. Navigation & User Flow
- [ ] เข้าถึงหน้านี้ได้จาก Sidebar
- [ ] Breadcrumb ถูกต้อง (ถ้ามี)
- [ ] Back button ทำงานได้
- [ ] Links ทั้งหมดทำงานได้
- [ ] Modal/Dialog เปิด-ปิดได้
- [ ] Tab navigation ทำงานได้ (ถ้ามี)

**User Flow**:
```
1. [ขั้นตอนที่ 1]
2. [ขั้นตอนที่ 2]
3. [ขั้นตอนที่ 3]
```

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

---

### 5. Visual Design & Consistency
- [ ] Colors ตรงตาม design system
- [ ] Typography ถูกต้อง (font, size, weight)
- [ ] Spacing/Padding สม่ำเสมอ
- [ ] Icons แสดงถูกต้อง
- [ ] Images โหลดได้
- [ ] Animations smooth (ไม่กระตุก)

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

---

### 6. Accessibility
- [ ] Keyboard navigation ทำงานได้
- [ ] Tab order ถูกต้อง
- [ ] Focus states ชัดเจน
- [ ] Alt text สำหรับ images
- [ ] ARIA labels ครบถ้วน
- [ ] Color contrast เพียงพอ

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

---

## 🔌 API Testing Checklist

### 1. API Endpoints
**List of API calls on this page**:
1. `GET /api/_______________`
2. `POST /api/_______________`
3. `PUT /api/_______________`
4. `DELETE /api/_______________`

---

### 2. Network Requests

#### Request 1: `[Method] /api/[endpoint]`
- [ ] Request sent successfully
- [ ] Response status: _____ (200, 400, 500, etc.)
- [ ] Response time: _____ ms
- [ ] Data format correct (JSON, etc.)

**Request Headers**:
```json
{
  "Authorization": "Bearer ...",
  "Content-Type": "application/json"
}
```

**Request Body** (ถ้ามี):
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

**Response**:
```json
{
  "status": "success",
  "data": { ... }
}
```

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

---

### 3. Data Display
- [ ] ข้อมูลแสดงถูกต้อง
- [ ] ข้อมูลครบถ้วน
- [ ] Format ถูกต้อง (date, number, etc.)
- [ ] Empty state แสดงเมื่อไม่มีข้อมูล
- [ ] Loading state แสดงขณะโหลด

**Screenshot**:
```
[แนบ screenshot ของข้อมูลที่แสดง]
```

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

---

### 4. Error Handling
- [ ] Network error แสดง error message
- [ ] 404 error แสดง error message
- [ ] 500 error แสดง error message
- [ ] Validation error แสดง error message
- [ ] Error message ชัดเจนและเป็นประโยชน์

**Test Cases**:
1. **Disconnect network**: _______________
2. **Invalid data**: _______________
3. **Server error**: _______________

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

---

### 5. CRUD Operations (ถ้ามี)

#### Create:
- [ ] Form validation ทำงานได้
- [ ] API call สำเร็จ
- [ ] Success message แสดง
- [ ] Data refresh หลัง create
- [ ] Redirect ถูกต้อง (ถ้ามี)

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

#### Read:
- [ ] Data โหลดได้
- [ ] Pagination ทำงานได้
- [ ] Filter ทำงานได้
- [ ] Search ทำงานได้
- [ ] Sort ทำงานได้

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

#### Update:
- [ ] Form pre-fill ด้วยข้อมูลเดิม
- [ ] Validation ทำงานได้
- [ ] API call สำเร็จ
- [ ] Success message แสดง
- [ ] Data refresh หลัง update

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

#### Delete:
- [ ] Confirmation dialog แสดง
- [ ] API call สำเร็จ
- [ ] Success message แสดง
- [ ] Data refresh หลัง delete
- [ ] Undo option มี (ถ้าเหมาะสม)

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

---

### 6. Authorization & Security
- [ ] Unauthorized users ถูก redirect
- [ ] Role-based access ทำงานถูกต้อง
- [ ] Token refresh ทำงานได้
- [ ] Sensitive data ไม่แสดงใน console
- [ ] HTTPS ใช้งานได้

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

---

## 📊 Performance Testing

### Load Time:
- **First Load**: _____ ms
- **Subsequent Load**: _____ ms
- **API Response Time**: _____ ms

### Performance Metrics:
- [ ] Page load < 3 seconds
- [ ] API response < 1 second
- [ ] No memory leaks
- [ ] No console errors
- [ ] No console warnings

**Issues Found**:
```
[บันทึก issues ที่พบ]
```

---

## 🐛 Bug Report

### Bug #1:
**Severity**: 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low  
**Type**: UI / API / Performance / Security

**Description**:
```
[รายละเอียดของ bug]
```

**Steps to Reproduce**:
1. [ขั้นตอนที่ 1]
2. [ขั้นตอนที่ 2]
3. [ขั้นตอนที่ 3]

**Expected Result**:
```
[ผลลัพธ์ที่คาดหวัง]
```

**Actual Result**:
```
[ผลลัพธ์ที่เกิดขึ้นจริง]
```

**Screenshot/Video**:
```
[แนบ screenshot หรือ video]
```

**Console Log**:
```
[แนบ console log]
```

**Network Log**:
```
[แนบ network log]
```

---

### Bug #2:
[ใช้ template เดียวกับ Bug #1]

---

## 📈 Overall Assessment

### UI Status:
- ✅ Complete - มี UI ครบถ้วน ไม่มี bug
- 🟡 Partial - มี UI แต่มี bug เล็กน้อย
- 🔴 Missing - ไม่มี UI หรือมี bug ร้ายแรง

### API Status:
- ✅ Complete - API เชื่อมต่อถูกต้อง ไม่มี bug
- 🟡 Partial - API เชื่อมต่อได้ แต่มี bug เล็กน้อย
- 🔴 Missing - API ยังไม่เชื่อมต่อ หรือมี bug ร้ายแรง

### Priority:
- 🔴 Critical - ต้องแก้ไขทันที
- 🟡 High - ต้องแก้ไขเร็ว
- 🟢 Medium - แก้ไขได้ภายหลัง
- ⚪ Low - ไม่เร่งด่วน

### Estimate to Fix:
- **Time**: _____ hours
- **Complexity**: Easy / Medium / Hard
- **Dependencies**: _______________

---

## 📝 Notes & Recommendations

```
[บันทึกข้อสังเกตและคำแนะนำเพิ่มเติม]
```

---

## ✅ Sign-off

**Tested by**: _______________  
**Date**: _______________  
**Signature**: _______________

**Reviewed by**: _______________  
**Date**: _______________  
**Signature**: _______________

---

**Template Version**: 1.0  
**Last Updated**: 29 พฤศจิกายน 2568
