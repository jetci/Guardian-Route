# 🎯 Dashboard Standardization Plan

**วันที่**: 2025-11-19  
**เวลา**: 11:12  
**ผู้รับผิดชอบ**: Team W

---

## 📋 แผนการปรับปรุง

### ✅ ขั้นตอนที่ 1: Fix Sidebar Width (เสร็จแล้ว)
- ✅ เปลี่ยน Sidebar width เป็น 260px มาตรฐาน
- ✅ เปลี่ยน dashboard-main margin-left เป็น 260px
- ✅ HMR update สำเร็จ

---

### 🔄 ขั้นตอนที่ 2: Standardize SupervisorDashboardModern

**ปัญหา**:
- ❌ ใช้ custom sidebar (ไม่ใช้ DashboardLayout)
- ❌ มี inline styles เยอะ
- ❌ ไม่ตรงมาตรฐาน

**วิธีแก้**:
1. ลบ custom sidebar ออก
2. ใช้ `<DashboardLayout>` แทน
3. ย้าย content ไปใน DashboardLayout
4. ลบ SupervisorDashboardModern.css ที่ไม่จำเป็น

**ไฟล์ที่ต้องแก้**:
- `SupervisorDashboardModern.tsx` (530 บรรทัด)
- `SupervisorDashboardModern.css`

---

### 🔄 ขั้นตอนที่ 3: Standardize ExecutiveDashboard

**ปัญหา**:
- ❌ ใช้ custom sidebar
- ❌ ไม่ตรงมาตรฐาน

**วิธีแก้**:
1. ลบ custom sidebar ออก
2. ใช้ `<DashboardLayout>` แทน
3. ย้าย content ไปใน DashboardLayout

**ไฟล์ที่ต้องแก้**:
- `ExecutiveDashboard.tsx` (458 บรรทัด)
- `ExecutiveDashboard.css`

---

### ✅ ขั้นตอนที่ 4: ทดสอบทุก Dashboard

**ต้องทดสอบ**:
- [ ] Admin Dashboard
- [ ] Supervisor Dashboard
- [ ] Executive Dashboard
- [ ] Field Officer Dashboard
- [ ] Developer Dashboard

**ตรวจสอบ**:
- [ ] Sidebar width 260px
- [ ] Content ไม่ทับกัน
- [ ] Navigation ทำงาน
- [ ] Responsive design

---

### 🗑️ ขั้นตอนที่ 5: ลบเวอร์ชันเก่า

**ไฟล์ที่ควรลบ**:
- `SupervisorDashboard.tsx` (เก่า)
- `SupervisorDashboardV2.tsx`
- `SupervisorDashboardSimple.tsx`
- `SupervisorDashboardStandalone.tsx`
- `ExecutiveDashboardV2.tsx`
- `ExecutiveDashboardPage.tsx`
- `AdminDashboardPage.tsx`
- `dashboards/` folder (ถ้าไม่ใช้)

---

## 📊 มาตรฐานที่กำหนด

### 1. **Layout Standard**
```tsx
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export default function XxxDashboard() {
  return (
    <DashboardLayout>
      {/* Dashboard content */}
    </DashboardLayout>
  );
}
```

### 2. **Sidebar Standard**
- Width: 260px
- Position: fixed left
- z-index: 1000
- Background: gradient purple

### 3. **Main Content Standard**
- margin-left: 260px
- padding: 32px
- width: calc(100% - 260px)

### 4. **File Structure**
```
pages/
  admin/
    AdminDashboard.tsx ✅ (เดียว)
  supervisor/
    SupervisorDashboard.tsx ✅ (เดียว)
  executive/
    ExecutiveDashboard.tsx ✅ (เดียว)
  field-officer/
    FieldOfficerDashboard.tsx ✅ (เดียว)
  developer/
    DeveloperDashboard.tsx ✅ (เดียว)
```

---

## ⏰ Timeline

| ขั้นตอน | เวลา | สถานะ |
|---------|------|-------|
| 1. Fix Sidebar Width | 5 min | ✅ เสร็จ |
| 2. Standardize Supervisor | 20 min | 🔄 กำลังทำ |
| 3. Standardize Executive | 20 min | ⏳ รอ |
| 4. ทดสอบทุก Dashboard | 15 min | ⏳ รอ |
| 5. ลบเวอร์ชันเก่า | 10 min | ⏳ รอ |
| **รวม** | **70 min** | |

---

## 🎯 ผลลัพธ์ที่คาดหวัง

### ✅ หลังจากเสร็จ:
1. ทุก Dashboard ใช้ DashboardLayout เดียวกัน
2. Sidebar width 260px ทุกหน้า
3. Layout consistent ทุก role
4. ไม่มีเวอร์ชันซ้ำซ้อน
5. Code สะอาด maintainable

---

**Team W กำลังดำเนินการ!** 🚀
