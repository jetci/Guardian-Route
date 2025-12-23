# 🗓️ Feature: ปฏิทิน Popup เป็นภาษาไทยและปี พ.ศ.

**วันที่:** 23 ธันวาคม 2568 เวลา 15:25 น.  
**Feature:** Custom Thai Calendar with Buddhist Era  
**สถานะ:** ✅ Complete (Code Ready - Need Testing)

---

## 🎯 Problem

**User Report:**
```
การแสดง ปฏิทินป๊อปอัพ ยังแสดงเป้นภาาาอังกฤษ
```

### ปัญหา:
- ✅ แสดงผลในช่อง input เป็นภาษาไทยแล้ว
- ❌ แต่ popup calendar ยังเป็นภาษาอังกฤษ
- ❌ Native date picker ไม่สามารถเปลี่ยนภาษาได้

---

## ✨ Solution

### สร้าง Custom Thai Date Picker

**Component:** `ThaiDateInput.tsx`

**Features:**
- ✅ ปฏิทินเป็นภาษาไทย 100%
- ✅ ชื่อเดือนภาษาไทย
- ✅ ปี พ.ศ. (Buddhist Era)
- ✅ วันภาษาไทย (อา, จ, อ, พ, พฤ, ศ, ส)
- ✅ ปุ่ม "วันนี้" และ "ปิด"
- ✅ Responsive design
- ✅ Click outside to close

---

## 🎨 UI Preview

### Calendar Popup

```
┌─────────────────────────────────────┐
│ 📅 วันที่สำรวจ *                    │
├─────────────────────────────────────┤
│ [23 ธันวาคม 2568_________] 📅      │ ← Click to open
└─────────────────────────────────────┘
         ↓ Opens popup
┌─────────────────────────────────────┐
│ [ธันวาคม ▼]  [2568 ▼]              │ ← Thai selectors
├─────────────────────────────────────┤
│ อา  จ  อ  พ  พฤ  ศ  ส              │ ← Thai days
├─────────────────────────────────────┤
│          1   2   3   4   5          │
│  6   7   8   9  10  11  12          │
│ 13  14  15  16  17  18  19          │
│ 20  21  22 [23] 24  25  26          │ ← Selected
│ 27  28  29  30  31                  │
├─────────────────────────────────────┤
│ [วันนี้]                    [ปิด]  │ ← Thai buttons
└─────────────────────────────────────┘
```

---

## 📝 Implementation

### Files Created

**1. ThaiDateInput.tsx**
```typescript
export const ThaiDateInput: React.FC<ThaiDateInputProps> = ({
  value,
  onChange,
  disabled,
  required,
  max
}) => {
  // Thai month names
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', ...
  ];
  
  // Thai day names
  const thaiDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  
  // Convert to Buddhist Era
  const thaiYear = gregorianYear + 543;
  
  // Render calendar...
};
```

### Files Modified

**2. SurveyAreaPage.tsx**
```typescript
// Import
import { ThaiDateInput } from '../../components/field-officer/ThaiDateInput';

// Usage
<ThaiDateInput
  value={surveyDate}
  onChange={setSurveyDate}
  disabled={!selectedVillage}
  required={true}
  max={new Date().toISOString().split('T')[0]}
/>
```

---

## 🎯 Features

### 1. ✅ Thai Month Names

```typescript
const thaiMonths = [
  'มกราคม',    // January
  'กุมภาพันธ์', // February
  'มีนาคม',     // March
  'เมษายน',     // April
  'พฤษภาคม',    // May
  'มิถุนายน',   // June
  'กรกฎาคม',    // July
  'สิงหาคม',    // August
  'กันยายน',    // September
  'ตุลาคม',     // October
  'พฤศจิกายน',  // November
  'ธันวาคม'     // December
];
```

### 2. ✅ Buddhist Era (พ.ศ.)

```typescript
const thaiYear = gregorianYear + 543;
// 2025 → 2568
```

### 3. ✅ Thai Day Names

```typescript
const thaiDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
// Sunday = อา (red color)
```

### 4. ✅ Thai Buttons

```typescript
<button>วันนี้</button>  // Today
<button>ปิด</button>     // Close
```

---

## 💡 Technical Details

### Calendar Logic

**1. Month/Year Selection**
```typescript
<select value={selectedMonth}>
  {thaiMonths.map((month, index) => (
    <option value={index}>{month}</option>
  ))}
</select>

<select value={selectedYear}>
  {/* Last 10 years in พ.ศ. */}
</select>
```

**2. Days Grid**
```typescript
// Calculate first day of month
const firstDayOfMonth = new Date(year, month, 1).getDay();

// Empty cells before month starts
{Array.from({ length: firstDayOfMonth }).map(...)}

// Days of month
{Array.from({ length: daysInMonth }).map(...)}
```

**3. Date Selection**
```typescript
const handleDateSelect = (day: number) => {
  const gregorianYear = selectedYear - 543;
  const date = new Date(gregorianYear, selectedMonth, day);
  const isoString = date.toISOString().split('T')[0];
  onChange(isoString);
  setIsOpen(false);
};
```

---

## 🎨 Styling

### Calendar Popup

```typescript
{
  position: 'absolute',
  top: '100%',
  left: 0,
  marginTop: '4px',
  background: 'white',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  padding: '16px',
  zIndex: 1000,
  minWidth: '300px'
}
```

### Day Cells

```typescript
{
  padding: '8px',
  borderRadius: '6px',
  background: isSelected ? '#3b82f6' : 'transparent',
  color: isSelected ? 'white' : '#1e293b',
  cursor: 'pointer'
}
```

---

## 🧪 Testing

### Test Case 1: Open Calendar

**Steps:**
```
1. Refresh browser (Ctrl+Shift+R)
2. Go to /survey-area
3. Select village
4. Click date field
```

**Expected:**
- ✅ Calendar popup opens
- ✅ Shows Thai months
- ✅ Shows พ.ศ. years
- ✅ Shows Thai day names

**Result:** ⏳ Pending

---

### Test Case 2: Select Date

**Steps:**
```
1. Open calendar
2. Select month (Thai)
3. Select year (พ.ศ.)
4. Click day
```

**Expected:**
- ✅ Date selected
- ✅ Popup closes
- ✅ Display shows Thai format
- ✅ Value saved correctly

**Result:** ⏳ Pending

---

### Test Case 3: Today Button

**Steps:**
```
1. Open calendar
2. Click "วันนี้"
```

**Expected:**
- ✅ Selects today's date
- ✅ Popup closes
- ✅ Display updates

**Result:** ⏳ Pending

---

### Test Case 4: Close Button

**Steps:**
```
1. Open calendar
2. Click "ปิด"
```

**Expected:**
- ✅ Popup closes
- ✅ No date selected

**Result:** ⏳ Pending

---

### Test Case 5: Click Outside

**Steps:**
```
1. Open calendar
2. Click outside popup
```

**Expected:**
- ✅ Popup closes automatically

**Result:** ⏳ Pending

---

## 📊 Comparison

### ❌ Before (Native Picker)

**Popup:**
```
┌─────────────────────────────────────┐
│ December 2025                       │ ← English
│ Su Mo Tu We Th Fr Sa                │ ← English
│  1  2  3  4  5  6  7                │
│  8  9 10 11 12 13 14                │
└─────────────────────────────────────┘
```

**Problems:**
- ❌ English only
- ❌ ค.ศ. year
- ❌ Cannot customize

---

### ✅ After (Custom Picker)

**Popup:**
```
┌─────────────────────────────────────┐
│ [ธันวาคม ▼]  [2568 ▼]              │ ← Thai
│ อา  จ  อ  พ  พฤ  ศ  ส              │ ← Thai
│  1  2  3  4  5  6  7                │
│  8  9 10 11 12 13 14                │
│ [วันนี้]              [ปิด]        │ ← Thai
└─────────────────────────────────────┘
```

**Benefits:**
- ✅ Thai language 100%
- ✅ พ.ศ. year
- ✅ Fully customizable
- ✅ Better UX

---

## 📈 Impact

### Before ❌

**Calendar:**
- ❌ English months
- ❌ English days
- ❌ ค.ศ. years
- ❌ User confused

### After ✅

**Calendar:**
- ✅ Thai months
- ✅ Thai days
- ✅ พ.ศ. years
- ✅ User happy

---

## 🎯 Success Criteria

### ✅ Requirements Met

- [x] Popup เป็นภาษาไทย
- [x] เดือนเป็นภาษาไทย
- [x] วันเป็นภาษาไทย
- [x] ปี พ.ศ.
- [x] ปุ่มเป็นภาษาไทย
- [x] Responsive
- [x] Click outside to close
- [x] Mobile-friendly

---

## ⚠️ สำคัญ: ยังไม่ได้ทดสอบ!

### ฉันสร้าง Component แล้ว แต่:

**ที่ทำ:**
- ✅ สร้าง ThaiDateInput component
- ✅ เพิ่ม Thai months
- ✅ เพิ่ม Thai days
- ✅ แปลงปี พ.ศ.
- ✅ เพิ่ม Thai buttons
- ✅ แก้ไข SurveyAreaPage

**ที่ยังไม่ได้ทำ:**
- ❌ **ทดสอบจริง**
- ❌ **เปิด browser ดู**
- ❌ **ยืนยันว่าใช้งานได้**

---

## 📝 Testing Instructions

### กรุณาทดสอบ:

**1. Refresh**
```bash
Ctrl+Shift+R (Hard reload)
```

**2. Test Calendar**
```
1. ไปที่ /survey-area
2. เลือกหมู่บ้าน
3. คลิกฟิลด์วันที่
4. ตรวจสอบ popup:
   - เดือนเป็นภาษาไทย?
   - วันเป็นภาษาไทย?
   - ปี พ.ศ.?
   - ปุ่มเป็นภาษาไทย?
```

**3. Test Functionality**
```
1. เลือกเดือน
2. เลือกปี
3. คลิกวันที่
4. ตรวจสอบ:
   - Popup ปิด?
   - วันที่ถูกต้อง?
   - แสดงภาษาไทย?
```

---

## 📝 กรุณารายงานผล

### Format:

```
Test 1: Open Calendar
- Popup เปิด: ✅ ใช่ / ❌ ไม่ใช่
- เดือนภาษาไทย: ✅ ใช่ / ❌ ไม่ใช่
- วันภาษาไทย: ✅ ใช่ / ❌ ไม่ใช่
- ปี พ.ศ.: ✅ ใช่ / ❌ ไม่ใช่
- Screenshot: [ถ้าเป็นไปได้]

Test 2: Select Date
- เลือกได้: ✅ ใช่ / ❌ ไม่ใช่
- Popup ปิด: ✅ ใช่ / ❌ ไม่ใช่
- แสดงถูกต้อง: ✅ ใช่ / ❌ ไม่ใช่

Test 3: Buttons
- "วันนี้" ทำงาน: ✅ ใช่ / ❌ ไม่ใช่
- "ปิด" ทำงาน: ✅ ใช่ / ❌ ไม่ใช่

Error (ถ้ามี):
- Error message: ___________
- Screenshot: ___________
```

---

## 📝 Status

**Feature Status:** ✅ Code Complete  
**Testing Status:** ❌ Not Tested Yet  
**Verified:** ❌ Waiting for user  
**Working:** ❓ Unknown

---

## 📞 Contact

**Implemented By:** Cascade AI  
**Date:** 23 ธันวาคม 2568  
**Time:** 15:25 น.

**Next Steps:**
1. Refresh browser
2. Test calendar popup
3. Verify Thai language
4. Verify พ.ศ. year
5. Report results

---

**สถานะ:** ✅ Code Ready  
**ผลกระทบ:** Major UX Improvement  
**ต่อไป:** รอผลการทดสอบ

**ปฏิทินภาษาไทยพร้อมแล้ว - รอทดสอบ!** 🗓️🇹🇭
