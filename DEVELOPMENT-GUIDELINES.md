# 📚 คู่มือการพัฒนา Guardian Route

**Version:** 2.0  
**Last Updated:** 17 พฤศจิกายน 2567 11:28 น.  
**Project:** Guardian Route - ระบบจัดการภัยพิบัติ ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่

---

## 📑 สารบัญ (Table of Contents)

1. [มาตรฐานการใช้งาน Date Picker](#-มาตรฐานการใช้งาน-date-picker)
2. [โครงสร้างหน้า Settings (System Settings)](#-โครงสร้างหน้า-settings-system-settings)
3. [Admin UI Design Standards](#-admin-ui-design-standards)
4. [Code Review Checklist](#-code-review-checklist)

---

## 📅 มาตรฐานการใช้งาน Date Picker

### ⚠️ กฎสำคัญ (MANDATORY)

**รูปแบบปฏิทินในแอปพลิเคชันนี้จะต้องเป็นแบบ Thai Date Picker Component เท่านั้น**

### 🎯 เหตุผล

1. **ความเหมาะสมกับผู้ใช้งาน**
   - ผู้ใช้งานเป็นเจ้าหน้าที่ท้องถิ่นไทย
   - คุ้นเคยกับรูปแบบวันที่แบบไทย (วัน เดือน พ.ศ.)
   - ลดความสับสนในการเลือกวันที่

2. **ความสม่ำเสมอ (Consistency)**
   - UI/UX เป็นมาตรฐานเดียวกันทั้งระบบ
   - ลดความสับสนของผู้ใช้งาน
   - ง่ายต่อการบำรุงรักษา

3. **การแสดงผลที่ถูกต้อง**
   - แสดงปีพุทธศักราช (พ.ศ.) แทนคริสต์ศักราช (ค.ศ.)
   - ชื่อเดือนเป็นภาษาไทย
   - วันในสัปดาห์เป็นภาษาไทย

---

## 🔧 วิธีการใช้งาน Thai Date Picker

### 1. Import Component

```typescript
import ThaiDatePicker from '../../components/ThaiDatePicker';
```

### 2. State Management

```typescript
const [selectedDate, setSelectedDate] = useState<Date | null>(null);
```

### 3. การใช้งานใน JSX

```tsx
<ThaiDatePicker
  id="unique-date-picker-id"
  value={selectedDate}
  onChange={setSelectedDate}
  placeholder="เลือกวันที่"
  disabled={false}
/>
```

### 4. Props ที่รองรับ

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `id` | `string` | ✅ Yes | - | Unique identifier สำหรับ input |
| `value` | `Date \| null` | ✅ Yes | - | วันที่ที่เลือก |
| `onChange` | `(date: Date \| null) => void` | ✅ Yes | - | Callback เมื่อเลือกวันที่ |
| `placeholder` | `string` | ❌ No | `'เลือกวันที่'` | ข้อความ placeholder |
| `disabled` | `boolean` | ❌ No | `false` | สถานะ disabled |

---

## ✅ ตัวอย่างการใช้งานที่ถูกต้อง

### ตัวอย่างที่ 1: Form Filter

```tsx
import { useState } from 'react';
import ThaiDatePicker from '../../components/ThaiDatePicker';

function FilterForm() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div className="filter-form">
      <div className="form-group">
        <label>วันที่เริ่มต้น</label>
        <ThaiDatePicker
          id="start-date"
          value={startDate}
          onChange={setStartDate}
          placeholder="เลือกวันที่เริ่มต้น"
        />
      </div>

      <div className="form-group">
        <label>วันที่สิ้นสุด</label>
        <ThaiDatePicker
          id="end-date"
          value={endDate}
          onChange={setEndDate}
          placeholder="เลือกวันที่สิ้นสุด"
        />
      </div>
    </div>
  );
}
```

### ตัวอย่างที่ 2: Report Form

```tsx
function ReportForm() {
  const [reportDate, setReportDate] = useState<Date | null>(new Date());

  const handleSubmit = () => {
    if (!reportDate) {
      toast.error('กรุณาเลือกวันที่');
      return;
    }
    // Submit logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>วันที่รายงาน <span className="required">*</span></label>
        <ThaiDatePicker
          id="report-date"
          value={reportDate}
          onChange={setReportDate}
          placeholder="เลือกวันที่รายงาน"
        />
      </div>
      <button type="submit">บันทึก</button>
    </form>
  );
}
```

---

## ❌ สิ่งที่ห้ามทำ (DO NOT USE)

### ❌ ห้ามใช้ HTML Date Input

```tsx
// ❌ ผิด - ห้ามใช้
<input type="date" value={date} onChange={handleChange} />
```

### ❌ ห้ามใช้ Third-party Date Pickers

```tsx
// ❌ ผิด - ห้ามใช้
<DatePicker selected={date} onChange={setDate} />
<ReactDatePicker value={date} onChange={setDate} />
<MuiDatePicker value={date} onChange={setDate} />
```

### ❌ ห้ามใช้ Chakra UI DatePicker

```tsx
// ❌ ผิด - ห้ามใช้
<Input type="date" value={date} onChange={handleChange} />
```

---

## 🎨 การปรับแต่ง Styling

Thai Date Picker ใช้ inline styles แต่สามารถปรับแต่งได้ผ่าน CSS:

```css
/* ปรับแต่ง input field */
.filter-group input[type="text"][readonly] {
  cursor: pointer;
  background: white;
  color: #1a202c;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem;
}

/* Focus state */
.filter-group input[type="text"][readonly]:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
```

---

## 📋 Features ของ Thai Date Picker

### ✨ คุณสมบัติหลัก

1. **รูปแบบวันที่แบบไทย**
   - แสดงผลเป็น: `17 พฤศจิกายน 2567`
   - ปีพุทธศักราช (พ.ศ.)
   - ชื่อเดือนภาษาไทย

2. **ปฏิทินแบบ Popup**
   - คลิกเพื่อเปิดปฏิทิน
   - เลือกวันที่ได้ง่าย
   - ปิดอัตโนมัติเมื่อเลือกวันที่

3. **Navigation**
   - ปุ่มเลื่อนเดือนก่อนหน้า/ถัดไป
   - แสดงเดือนและปีปัจจุบัน
   - ปุ่ม "วันนี้" สำหรับเลือกวันที่ปัจจุบัน

4. **Visual Feedback**
   - Highlight วันที่ที่เลือก
   - Hover effect บนวันที่
   - Disabled state

5. **Responsive**
   - ทำงานได้ดีบนทุกขนาดหน้าจอ
   - Touch-friendly สำหรับ mobile

---

## 🔍 การ Debug และ Troubleshooting

### ปัญหา: วันที่ไม่แสดงผล

```tsx
// ✅ ถูกต้อง - ใช้ Date object
const [date, setDate] = useState<Date | null>(new Date());

// ❌ ผิด - ใช้ string
const [date, setDate] = useState<string>('2024-11-17');
```

### ปัญหา: onChange ไม่ทำงาน

```tsx
// ✅ ถูกต้อง
<ThaiDatePicker
  id="date"
  value={date}
  onChange={setDate}  // ส่ง function โดยตรง
/>

// ❌ ผิด
<ThaiDatePicker
  id="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}  // ผิด - ไม่ใช่ event
/>
```

### ปัญหา: ปฏิทินไม่ปิด

- ตรวจสอบว่า `onClick` outside listener ทำงานถูกต้อง
- Component ใช้ `useRef` และ `useEffect` สำหรับจัดการ

---

## 📦 Component Location

```
frontend/
  src/
    components/
      ThaiDatePicker.tsx  ← Component หลัก
```

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 17 พ.ย. 2567 | Initial implementation |
| 1.1 | 17 พ.ย. 2567 | Updated to light theme for better visibility |

---

---

## ⚙️ โครงสร้างหน้า Settings (System Settings)

### 📋 ภาพรวม

หน้า Settings เป็น **Central Control Panel** สำหรับ System Administrator (ADMIN role only) ในการกำหนดค่าการทำงานของระบบ Guardian Route โดยไม่ต้องแก้ไขโค้ด

### 🎯 ผู้ใช้งานเป้าหมาย

- **ADMIN role เท่านั้น**
- ผู้ดูแลระบบที่มีสิทธิ์ระดับสูงสุด

### 📑 โครงสร้าง 6 Tabs

Settings Page ใช้ **Tab-based Layout** แบ่งเป็น 6 ส่วนหลัก:

#### 1️⃣ ทั่วไป (General)

**วัตถุประสงค์:** ตั้งค่าพื้นฐานของแอปพลิเคชัน

| การตั้งค่า | ประเภท Control | คำอธิบาย |
|-----------|---------------|----------|
| ชื่อแอปพลิเคชัน | Text Input | ชื่อที่แสดงบน Header และหน้า Login |
| เขตเวลา | Dropdown | Timezone หลัก (Asia/Bangkok, Asia/Singapore, UTC) |
| โหมดบำรุงรักษา | Toggle Switch | เปิด/ปิด Maintenance Mode (ผู้ใช้ทั่วไปไม่สามารถเข้าถึงได้) |
| ข้อความบำรุงรักษา | Text Area | ข้อความที่แสดงเมื่ออยู่ในโหมดบำรุงรักษา |

**State Variables:**
```typescript
systemName: string
timezone: 'Asia/Bangkok' | 'Asia/Singapore' | 'UTC'
maintenanceMode: boolean
maintenanceMessage: string
```

---

#### 2️⃣ ผู้ใช้และความปลอดภัย (Users & Security)

**วัตถุประสงค์:** กำหนดนโยบายความปลอดภัยในการเข้าถึง

| การตั้งค่า | ประเภท Control | คำอธิบาย |
|-----------|---------------|----------|
| บังคับใช้ 2FA | Toggle Switch | ผู้ใช้ทุกคนต้องตั้งค่า Two-Factor Authentication |
| ความยาวรหัสผ่านขั้นต่ำ | Number Input | กำหนดความยาวขั้นต่ำของรหัสผ่าน (8-32 ตัวอักษร) |
| ระยะเวลาเซสชัน (นาที) | Number Input | Session Timeout - ออกจากระบบอัตโนมัติ (5-120 นาที) |
| IP Address Allowlist | Text Area | รายการ IP ที่อนุญาตให้เข้าถึง (คั่นด้วยจุลภาค) |

**State Variables:**
```typescript
enforce2FA: boolean
minPasswordLength: number  // 8-32
sessionTimeout: number     // 5-120 minutes
ipAllowlist: string        // comma-separated IPs
```

---

#### 3️⃣ แผนที่และภูมิสารสนเทศ (Map & GIS)

**วัตถุประสงค์:** ปรับแต่งการแสดงผลแผนที่

| การตั้งค่า | ประเภท Control | คำอธิบาย |
|-----------|---------------|----------|
| Default Latitude | Number Input | ตำแหน่ง Latitude เริ่มต้น (เช่น 19.9167) |
| Default Longitude | Number Input | ตำแหน่ง Longitude เริ่มต้น (เช่น 99.8833) |
| Default Zoom | Number Input | ระดับ Zoom เริ่มต้น (1-18) |
| Default Base Layer | Dropdown | ภาพถ่ายดาวเทียม / แผนที่ถนน |
| Custom Tile Server URL | Text Input | URL ของ Tile Server (เช่น GISTDA) |
| เรดาร์สภาพอากาศ | Toggle Switch | แสดงชั้นข้อมูลเรดาร์อัตโนมัติ |

**State Variables:**
```typescript
defaultLat: number         // 19.9167 (Fang, Chiang Mai)
defaultLng: number         // 99.8833
defaultZoom: number        // 1-18
defaultBaseLayer: 'satellite' | 'street'
customTileServer: string   // URL
enableWeatherRadar: boolean
```

---

#### 4️⃣ การแจ้งเตือน (Notifications)

**วัตถุประสงค์:** ควบคุมการส่งการแจ้งเตือนอัตโนมัติ

| การตั้งค่า | ประเภท Control | คำอธิบาย |
|-----------|---------------|----------|
| Email on New Incident | Toggle Switch | ส่งอีเมลเมื่อมีเหตุการณ์ใหม่ |
| SMS on High Severity | Toggle Switch | ส่ง SMS เมื่อเหตุการณ์ความรุนแรงสูง |
| Daily Email Summary | Toggle Switch | ส่งสรุปรายงานประจำวัน |
| เปิดใช้งาน LINE Notify | Toggle Switch | เปิด/ปิด LINE Notify |
| LINE Notify Token | Password Input | Access Token สำหรับ LINE Notify |

**State Variables:**
```typescript
emailOnNewIncident: boolean
smsOnHighSeverity: boolean
dailyEmailSummary: boolean
enableLineNotify: boolean
lineNotifyToken: string    // Sensitive data
```

---

#### 5️⃣ การเชื่อมต่อและ API (Connectivity & API)

**วัตถุประสงค์:** จัดการ API Keys และ Rate Limiting

| การตั้งค่า | ประเภท Control | คำอธิบาย |
|-----------|---------------|----------|
| Weather API Key | Password Input | API Key สำหรับข้อมูลสภาพอากาศ |
| SMS Gateway API Key | Password Input | API Key สำหรับส่ง SMS |
| จำนวนคำขอสูงสุด/นาที | Number Input | Rate Limiting - ป้องกันการโจมตี |
| ระยะเวลาที่บล็อก (วินาที) | Number Input | บล็อก IP ที่เรียก API เกินกำหนด |

**State Variables:**
```typescript
weatherApiKey: string         // Sensitive
smsGatewayApiKey: string      // Sensitive
maxRequestsPerMinute: number  // Rate limiting
blockDuration: number         // seconds
```

---

#### 6️⃣ ข้อมูลและพื้นที่จัดเก็บ (Data & Storage)

**วัตถุประสงค์:** กำหนดนโยบายการจัดเก็บและสำรองข้อมูล

| การตั้งค่า | ประเภท Control | คำอธิบาย |
|-----------|---------------|----------|
| ระยะเวลาจัดเก็บข้อมูล (วัน) | Number Input | Data Retention Policy - ลบข้อมูลเก่าอัตโนมัติ |
| ความถี่การสำรองข้อมูล | Dropdown | รายวัน / รายสัปดาห์ / รายเดือน / ปิดใช้งาน |

**Danger Zone (การกระทำที่มีความเสี่ยง):**

| การกระทำ | ประเภท | คำเตือน |
|---------|--------|---------|
| **Purge Old Data** | Button (Danger) | ⚠️ ลบข้อมูลเก่าทันที - ต้อง confirm |
| **Factory Reset** | Button (Danger) | 🚨 รีเซ็ตทั้งหมด - ต้อง double confirm |

**State Variables:**
```typescript
dataRetentionDays: number  // days
backupFrequency: 'daily' | 'weekly' | 'monthly' | 'disabled'
```

---

### 🔄 User Interaction Flow

```
1. Admin เข้าสู่หน้า Settings ผ่าน Sidebar
   ↓
2. เลือก Tab ที่ต้องการแก้ไข
   ↓
3. ปรับแก้ค่าต่างๆ ผ่าน UI Controls
   ↓
4. กดปุ่ม "บันทึกการตั้งค่า" (Save)
   ↓
5. ระบบแสดง Toast notification
   ↓
6. หรือกด "ยกเลิก" (Cancel) เพื่อคืนค่า
```

---

### 🎨 UI Components ที่ใช้

- **Toggle Switch** - สำหรับ boolean settings
- **Text Input** - สำหรับ string values
- **Number Input** - สำหรับ numeric values (มี min/max validation)
- **Password Input** - สำหรับ sensitive data (masked)
- **Text Area** - สำหรับ multi-line text
- **Dropdown/Select** - สำหรับ options
- **Buttons** - Save (Primary), Cancel (Secondary), Danger actions

---

### ⚠️ Danger Zone Guidelines

#### Purge Old Data
```typescript
const handlePurgeOldData = () => {
  if (confirm('⚠️ คุณแน่ใจหรือไม่ที่จะลบข้อมูลเก่า? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
    // Call API to purge old data
    toast.success('กำลังลบข้อมูลเก่า...');
  }
};
```

#### Factory Reset
```typescript
const handleFactoryReset = () => {
  if (confirm('🚨 คำเตือน: การรีเซ็ตจะลบข้อมูลทั้งหมด!')) {
    if (confirm('❗ คุณแน่ใจ 100% หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้!')) {
      // Call API to factory reset
      toast.error('กำลังรีเซ็ตระบบ...');
    }
  }
};
```

---

### 🔒 Security Requirements

1. **Role-based Access**
   - เฉพาะ ADMIN role เท่านั้น
   - ตรวจสอบ role ก่อนแสดงหน้า

2. **Sensitive Data**
   - API Keys ใช้ `type="password"`
   - Masked ในการแสดงผล
   - ไม่ส่งกลับมาจาก API (ใช้ placeholder)

3. **Confirmation Dialogs**
   - Danger actions ต้องมี confirmation
   - Factory Reset ต้องมี double confirmation

4. **Validation**
   - Number inputs มี min/max
   - Required fields ต้องไม่ว่าง
   - Email format validation
   - URL format validation

---

### 📁 File Structure

```
frontend/src/pages/admin/
  ├── SettingsPage.tsx       ← Main component (6 tabs)
  └── SettingsPage.css       ← Styling

Documentation:
  ├── SETTINGS-PAGE-SPEC.md  ← Technical specification
  └── DEVELOPMENT-GUIDELINES.md ← This file
```

---

### 🧪 Testing Checklist

Settings Page Testing:

- [ ] เฉพาะ ADMIN เข้าถึงได้
- [ ] ทุก Tab แสดงผลถูกต้อง
- [ ] Toggle switches ทำงาน
- [ ] Number inputs validate min/max
- [ ] Password inputs masked
- [ ] Save button บันทึกข้อมูล
- [ ] Cancel button คืนค่า
- [ ] Confirmation dialogs แสดงสำหรับ danger actions
- [ ] Toast notifications แสดงผล
- [ ] Settings persist หลัง reload
- [ ] Responsive บน mobile

---

## 🎨 Admin UI Design Standards

### การออกแบบหน้า Admin

ทุกหน้าใน Admin section ต้องปฏิบัติตามมาตรฐานเหล่านี้:

#### 1. Layout Structure

```tsx
<DashboardLayout>
  <div className="page-container">
    {/* Page Header */}
    <div className="page-header">
      <h1>📊 ชื่อหน้า</h1>
      <p className="subtitle">คำอธิบาย</p>
    </div>

    {/* Stats Cards (optional) */}
    <div className="stats-grid">
      {/* ... */}
    </div>

    {/* Main Content */}
    <div className="content-section">
      {/* ... */}
    </div>
  </div>
</DashboardLayout>
```

#### 2. Color Scheme

- **Primary:** `#667eea` (Purple gradient)
- **Success:** `#48bb78` (Green)
- **Warning:** `#ed8936` (Orange)
- **Danger:** `#f56565` (Red)
- **Background:** `#f7fafc` (Light gray)
- **Text:** `#1a202c` (Dark gray)

#### 3. Typography

- **Headings:** Font weight 600-700
- **Body:** Font size 1rem (16px)
- **Small text:** Font size 0.875rem (14px)
- **Hints:** Font size 0.75rem (12px), color `#a0aec0`

#### 4. Spacing

- **Section margin:** `2rem`
- **Card padding:** `2rem`
- **Form group margin:** `1.5rem`
- **Button padding:** `0.75rem 1.5rem`

#### 5. Components

- **Cards:** White background, rounded corners (16px), box shadow
- **Buttons:** Gradient background, hover effects, transitions
- **Inputs:** Border radius 8px, focus states with shadow
- **Tables:** Striped rows, hover effects, responsive

#### 6. Responsive Breakpoints

```css
/* Desktop: > 1024px */
/* Tablet: 768px - 1024px */
/* Mobile: < 768px */

@media (max-width: 1024px) {
  /* Adjust grid layouts */
}

@media (max-width: 768px) {
  /* Stack elements */
  /* Full width buttons */
}
```

---

## 👥 Code Review Checklist

### General

- [ ] ใช้ `DashboardLayout` wrapper
- [ ] มี page header พร้อม title และ subtitle
- [ ] ใช้ CSS classes ตามมาตรฐาน
- [ ] Responsive บนทุกขนาดหน้าจอ
- [ ] Dark mode compatible (ถ้าจำเป็น)

### Date Picker

- [ ] ใช้ `ThaiDatePicker` component แทน HTML date input
- [ ] State type เป็น `Date | null`
- [ ] มี `id` prop ที่ unique
- [ ] มี `placeholder` ที่เหมาะสม
- [ ] มีการ validate วันที่ก่อน submit (ถ้าจำเป็น)
- [ ] ไม่มีการใช้ third-party date picker อื่น

### Forms

- [ ] มี label สำหรับทุก input
- [ ] มี validation ที่เหมาะสม
- [ ] แสดง error messages ชัดเจน
- [ ] มี loading states
- [ ] มี success/error feedback (toast)

### Security

- [ ] ตรวจสอบ role-based access
- [ ] Sensitive data ใช้ password input
- [ ] Confirmation dialogs สำหรับ destructive actions
- [ ] Input validation ทั้ง frontend และ backend

### Performance

- [ ] ไม่มี unnecessary re-renders
- [ ] ใช้ `useState` และ `useEffect` อย่างถูกต้อง
- [ ] Lazy load components ที่ใหญ่
- [ ] Optimize images และ assets

---

## 📞 ติดต่อ

หากมีข้อสงสัยหรือพบปัญหา:
- สร้าง Issue ใน Repository
- ติดต่อ Team Lead
- อ่าน Component source code: `frontend/src/components/ThaiDatePicker.tsx`

---

## 📄 License

This guideline is part of Guardian Route project documentation.

**© 2567 องค์การบริหารส่วนตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่**

---

## 📋 มาตรฐานการรายงาน (Reporting Standards)

### ⚠️ กฎสำคัญ (MANDATORY)

**รายงานทุกฉบับที่นำเสนอต่อผู้ใช้งานหรือผู้บริหาร จะต้องเป็นภาษาไทยเท่านั้น**

### 🎯 รายละเอียด
1. **รายงานความคืบหน้า (Progress Reports):** ต้องสรุปเป็นภาษาไทย
2. **รายงานผลการทดสอบ (Test Reports):** ต้องสรุปผลและปัญหาเป็นภาษาไทย
3. **คู่มือการใช้งาน (User Manuals):** ต้องเป็นภาษาไทย
4. **ข้อความแจ้งเตือนในระบบ (System Notifications):** ต้องเป็นภาษาไทยที่เข้าใจง่าย
