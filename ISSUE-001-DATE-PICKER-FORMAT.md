# 🐛 ISSUE-001: Date Picker Format Incorrect

**วันที่พบ**: 29 พฤศจิกายน 2568  
**ผู้รายงาน**: SA  
**ผู้รับผิดชอบ**: Team W  
**Priority**: 🟡 High  
**Status**: 🔴 Open

---

## 📋 Issue Summary

**Menu**: Testing Mode: Create Report Form  
**Path**: `/developer/test/create-report`  
**Component**: `TestCreateReportPage`

**Problem**: Date Picker ใช้รูปแบบ `mm/dd/yyyy` ซึ่งไม่ตรงกับมาตรฐานในประเทศไทย และมีปัญหา UX/UI หลายประการ

---

## ❌ ปัญหาที่พบ

### 1. 📅 รูปแบบวันที่ผิด
- **Current**: `mm/dd/yyyy --:-- --`
- **Expected**: `dd/mm/yyyy` (สำหรับผู้ใช้ไทย) หรือ `yyyy-mm-dd` (ISO standard)
- **Impact**: สับสน, ผู้ใช้อาจกรอกผิด

### 2. ⛔ Placeholder ไม่เหมาะสม
- **Current**: `*mm/dd/yyyy --:-- --`
- **Expected**: `วว/ดด/ปปปป` หรือ `ปปปป-ดด-วว`
- **Impact**: ไม่ชัดเจน, ดูไม่เป็นมืออาชีพ

### 3. 🧭 UI/UX ไม่ดี
- **Missing**: ไอคอนปฏิทิน 📅 สำหรับคลิกเปิด calendar picker
- **Missing**: ปุ่ม "วันนี้" หรือ "Clear"
- **Impact**: ผู้ใช้ต้องพิมพ์เอง, ไม่สะดวก

### 4. 🧪 Accessibility Issues
- **Missing**: Keyboard navigation support
- **Missing**: Validation ว่า format ถูกต้องหรือไม่
- **Missing**: Error messages ที่ชัดเจน
- **Impact**: ไม่รองรับผู้พิการ, ไม่ user-friendly

### 5. 🟪 Testing Mode vs Production
- **Issue**: Testing Mode ควรใช้ UI เดียวกับ Production
- **Current**: ใช้ placeholder และ format ที่ไม่ตรงกับ production
- **Impact**: การทดสอบไม่สะท้อนความเป็นจริง

---

## 📸 Screenshot

![Date Picker Issue](../screenshots/issue-001-date-picker.png)

**จากภาพ**:
- วันที่เริ่มต้น: `*mm/dd/yyyy --:-- --`
- วันที่สิ้นสุด: `*mm/dd/yyyy --:-- --`
- ไม่มีไอคอนปฏิทิน
- ไม่มี calendar popup

---

## ✅ แนวทางแก้ไข

### Solution 1: ใช้ HTML5 Date Input (Simple)
```tsx
<div className="form-group">
  <label htmlFor="startDate">วันที่เริ่มต้น *</label>
  <input
    type="date"
    id="startDate"
    name="startDate"
    required
    className="form-control"
  />
</div>

<div className="form-group">
  <label htmlFor="endDate">วันที่สิ้นสุด *</label>
  <input
    type="date"
    id="endDate"
    name="endDate"
    required
    className="form-control"
  />
</div>
```

**Pros**:
- ✅ Native browser support
- ✅ Built-in validation
- ✅ Mobile-friendly
- ✅ Accessibility support

**Cons**:
- ❌ Limited customization
- ❌ Different UI across browsers

---

### Solution 2: ใช้ React DatePicker Library (Recommended)

#### Option A: react-datepicker
```tsx
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { th } from 'date-fns/locale';

<DatePicker
  selected={startDate}
  onChange={(date) => setStartDate(date)}
  dateFormat="dd/MM/yyyy"
  locale={th}
  placeholderText="เลือกวันที่เริ่มต้น"
  showYearDropdown
  showMonthDropdown
  dropdownMode="select"
  className="form-control"
  required
/>
```

**Pros**:
- ✅ Highly customizable
- ✅ Thai locale support
- ✅ Good UX
- ✅ Lightweight

---

#### Option B: MUI DatePicker (Material UI)
```tsx
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { th } from 'date-fns/locale';

<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={th}>
  <DatePicker
    label="วันที่เริ่มต้น"
    value={startDate}
    onChange={(newValue) => setStartDate(newValue)}
    format="dd/MM/yyyy"
    slotProps={{
      textField: {
        required: true,
        fullWidth: true,
      },
    }}
  />
</LocalizationProvider>
```

**Pros**:
- ✅ Beautiful UI
- ✅ Full accessibility
- ✅ Thai locale support
- ✅ Consistent with Material Design

**Cons**:
- ❌ Larger bundle size
- ❌ Requires @mui/x-date-pickers

---

#### Option C: Ant Design DatePicker
```tsx
import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/th_TH';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

<DatePicker
  locale={locale}
  format="DD/MM/YYYY"
  placeholder="เลือกวันที่เริ่มต้น"
  style={{ width: '100%' }}
  onChange={(date) => setStartDate(date)}
/>
```

**Pros**:
- ✅ Enterprise-grade
- ✅ Thai locale built-in
- ✅ Rich features
- ✅ Good documentation

---

### Solution 3: Custom Component (Best for Guardian Route)

สร้าง `ThaiDatePicker` component ที่:
- ✅ รองรับ Thai locale
- ✅ มี validation built-in
- ✅ Accessible
- ✅ Consistent UI across app

---

## 🔧 Implementation Plan

### Phase 1: Quick Fix (1 hour)
1. เปลี่ยนจาก text input เป็น `<input type="date">`
2. อัพเดท placeholder และ labels
3. เพิ่ม validation พื้นฐาน

### Phase 2: Proper Solution (3 hours)
1. ติดตั้ง `react-datepicker` หรือใช้ library ที่มีอยู่
2. สร้าง `ThaiDatePicker` component
3. แทนที่ date inputs ทั้งหมดในฟอร์ม
4. เพิ่ม validation ครบถ้วน
5. ทดสอบ accessibility

### Phase 3: System-wide (6 hours)
1. หา date inputs ทั้งหมดในระบบ
2. แทนที่ด้วย `ThaiDatePicker`
3. ทดสอบทุกหน้า
4. อัพเดท documentation

---

## 📊 Validation Rules

### Date Range Validation:
```typescript
const validateDateRange = (startDate: Date, endDate: Date) => {
  if (!startDate || !endDate) {
    return 'กรุณาเลือกวันที่เริ่มต้นและวันที่สิ้นสุด';
  }
  
  if (startDate > endDate) {
    return 'วันที่เริ่มต้นต้องไม่เกินวันที่สิ้นสุด';
  }
  
  const maxRange = 365; // days
  const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysDiff > maxRange) {
    return `ช่วงเวลาต้องไม่เกิน ${maxRange} วัน`;
  }
  
  return null; // Valid
};
```

---

## 🎯 Acceptance Criteria

### ถือว่าแก้ไขเสร็จเมื่อ:
- ✅ Date format เป็น `dd/mm/yyyy` หรือ `yyyy-mm-dd`
- ✅ มีไอคอนปฏิทิน 📅 ที่คลิกได้
- ✅ มี calendar popup สำหรับเลือกวัน
- ✅ มี validation ว่า start date ≤ end date
- ✅ มี error messages ที่ชัดเจน
- ✅ รองรับ keyboard navigation
- ✅ รองรับ screen reader
- ✅ ทำงานได้บน mobile
- ✅ Placeholder เป็นภาษาไทย
- ✅ ไม่มี console errors

---

## 📝 Testing Checklist

### Manual Testing:
- [ ] เลือกวันที่จาก calendar popup
- [ ] พิมพ์วันที่เอง (ถ้า allow)
- [ ] ทดสอบ validation (start > end)
- [ ] ทดสอบ validation (empty fields)
- [ ] ทดสอบบน mobile
- [ ] ทดสอบด้วย keyboard only
- [ ] ทดสอบด้วย screen reader

### Automated Testing:
- [ ] Unit tests สำหรับ validation
- [ ] Integration tests สำหรับ form submission
- [ ] E2E tests สำหรับ user flow

---

## 🔗 Related Issues

- Related to: MENU-STATUS-MATRIX.md (Testing Forms section)
- Affects: All forms with date inputs
- Similar issues in:
  - Initial Survey Page
  - Detailed Assessment Page
  - Report History filters
  - Analytics date range

---

## 📚 References

- [React DatePicker](https://reactdatepicker.com/)
- [MUI DatePicker](https://mui.com/x/react-date-pickers/)
- [Ant Design DatePicker](https://ant.design/components/date-picker)
- [HTML5 Date Input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)
- [date-fns Thai Locale](https://date-fns.org/v2.29.3/docs/Locale)

---

## 💰 Estimate

**Time to Fix**:
- Quick Fix (HTML5 date): 1 hour
- Proper Solution (React DatePicker): 3 hours
- System-wide Update: 6 hours
- **Total**: 10 hours

**Priority**: 🟡 High (affects UX significantly)

---

## ✅ Action Items

1. [ ] ติดตั้ง date picker library
2. [ ] สร้าง ThaiDatePicker component
3. [ ] แก้ไข TestCreateReportPage
4. [ ] ทดสอบ functionality
5. [ ] ทดสอบ accessibility
6. [ ] อัพเดท documentation
7. [ ] หา date inputs อื่นๆ ในระบบ
8. [ ] แทนที่ทั้งหมด
9. [ ] ทดสอบ regression
10. [ ] Close issue

---

## 📞 Contact

**Reported by**: SA  
**Assigned to**: Team W  
**Reviewer**: _______________

---

**Status**: 🔴 Open  
**Created**: 29 พฤศจิกายน 2568 11:52 น.  
**Updated**: 29 พฤศจิกายน 2568 11:52 น.
