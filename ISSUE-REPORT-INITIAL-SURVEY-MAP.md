# 🐛 Issue Report: Initial Survey Page - แผนที่ไม่เต็มจอ

**วันที่:** 20 พฤศจิกายน 2568  
**ผู้รายงาน:** Development Team  
**ระดับความสำคัญ:** HIGH  
**สถานะ:** UNRESOLVED

---

## 📋 สรุปปัญหา

หน้า **Initial Survey Page** (`/field-survey/:taskId`) แผนที่ไม่แสดงผลเต็มจอ มีพื้นที่สีเทาว่างด้านบนและด้านล่าง แม้จะพยายามแก้ไขหลายวิธีแล้ว

---

## 🖼️ ภาพปัญหา

- แผนที่แสดงผลเพียงครึ่งจอ
- มีพื้นที่สีเทา (background) ว่างอยู่ด้านบนและด้านล่าง
- ปุ่มควบคุมถูกย้ายออกจากแผนที่แล้ว (Get Location, Clear Area, คู่มือ)

---

## 📁 ไฟล์ที่เกี่ยวข้อง

### 1. **Component Files**
- `frontend/src/pages/field-officer/InitialSurveyPage.tsx`
- `frontend/src/pages/field-officer/InitialSurveyPage.css`

### 2. **Layout Files**
- `frontend/src/components/layout/DashboardLayout.tsx`
- `frontend/src/components/layout/DashboardLayout.css`
- `frontend/src/components/layout/Sidebar.tsx`
- `frontend/src/components/layout/Sidebar.css`

---

## 🔍 โครงสร้าง Component

```tsx
<DashboardLayout noPadding>
  <div className="initial-survey-page">
    <div className="survey-header">
      {/* Header with title and task info */}
    </div>
    
    <div className="survey-content">
      <div className="map-section">
        <div id="survey-map"></div>
        {/* Leaflet map */}
      </div>
      
      <div className="form-section">
        {/* Form controls and inputs */}
      </div>
    </div>
  </div>
</DashboardLayout>
```

---

## 🎨 CSS ที่ใช้ปัจจุบัน

### **InitialSurveyPage.css**
```css
.initial-survey-page {
  position: fixed;
  top: 0;
  left: 240px;  /* Sidebar width */
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: #f7fafc;
  overflow: hidden;
  z-index: 1;
}

.survey-header {
  height: 70px;
  flex-shrink: 0;
}

.survey-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 70px);
}

.map-section {
  flex: 1;
  position: relative;
  height: 100%;
}

#survey-map {
  width: 100%;
  height: 100%;
}
```

### **DashboardLayout.css**
```css
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f7fafc;
}

.dashboard-main {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  min-height: 100vh;
}

.dashboard-main.no-padding {
  padding: 0;
  overflow: hidden;
  min-height: 100vh;
  max-height: 100vh;
  height: 100vh;
}
```

---

## 🔧 วิธีที่ลองแก้ไขแล้ว

### ✅ **1. เปลี่ยน height calculation**
- ลอง `height: 100vh`
- ลอง `height: 100%`
- ลอง `height: calc(100vh - 64px)`
- ลอง `height: calc(100vh - 70px)`

### ✅ **2. เปลี่ยน positioning**
- ลอง `position: relative`
- ลอง `position: absolute`
- ลอง `position: fixed`

### ✅ **3. ใช้ negative margin**
- ลอง `margin: -32px`
- ลอง `width: calc(100% + 64px)`

### ✅ **4. เพิ่ม flexbox constraints**
- เพิ่ม `flex-shrink: 0` ให้ header
- เพิ่ม `min-height: 0` ให้ content
- เพิ่ม `flex: 1` ให้ map section

### ✅ **5. Force Leaflet resize**
```typescript
// เพิ่ม invalidateSize
setTimeout(() => {
  map.invalidateSize();
}, 100);

// เพิ่ม window resize listener
window.addEventListener('resize', () => {
  map.invalidateSize();
});
```

### ✅ **6. แก้ไข DashboardLayout**
- เพิ่ม `noPadding` prop
- กำหนด `height: 100vh` ให้ `.dashboard-main.no-padding`

---

## ❌ ผลลัพธ์

**ทุกวิธียังไม่สามารถแก้ปัญหาได้** - แผนที่ยังคงแสดงผลไม่เต็มจอ

---

## 🎯 หน้าที่ทำงานได้ถูกต้อง (เปรียบเทียบ)

### **Survey Area Page** (`/survey-area`)
- แผนที่แสดงผลได้ปกติ (แม้จะไม่เต็มจอ แต่ไม่มีพื้นที่ว่างผิดปกติ)
- ใช้ `height: 500px` คงที่
- อยู่ภายใน `<DashboardLayout>` ปกติ (มี padding)

**Code:**
```tsx
<DashboardLayout>
  <div style={{ padding: '0' }}>
    <div ref={mapRef} style={{ height: '500px' }}></div>
  </div>
</DashboardLayout>
```

---

## 💡 สมมติฐานสาเหตุ

### **1. CSS Specificity Issues**
- อาจมี CSS อื่นที่ override styles
- Global styles หรือ CSS จาก library อาจมีผลกระทบ

### **2. Leaflet Initialization Timing**
- Leaflet อาจ initialize ก่อนที่ container จะมีขนาดที่ถูกต้อง
- `invalidateSize()` อาจถูกเรียกเร็วเกินไป

### **3. DashboardLayout Constraints**
- `min-height: 100vh` อาจทำให้เกิด scrollbar ซ่อน
- Flexbox nesting อาจทำให้ height calculation ผิดพลาด

### **4. Browser Rendering Issues**
- Cache ของ browser อาจยังเก็บ CSS เก่า
- Hot reload ของ Vite อาจไม่ update CSS ทั้งหมด

---

## 🔍 ข้อมูลเพิ่มเติม

### **Tech Stack**
- React 18.x + TypeScript
- Vite (dev server)
- Leaflet.js 1.9.x
- Geoman (drawing tools)
- React Router DOM 6.x

### **Browser**
- ทดสอบบน Chrome/Edge (Windows)
- ยังไม่ได้ทดสอบบน Firefox/Safari

### **Screen Resolution**
- Desktop: 1920x1080 (หรือใหญ่กว่า)

---

## 📝 ข้อมูลที่ต้องการจาก SA

### **1. การตรวจสอบ**
- [ ] ตรวจสอบ CSS hierarchy และ specificity
- [ ] ตรวจสอบว่ามี global styles ที่กระทบหรือไม่
- [ ] ตรวจสอบ browser DevTools (Computed styles)

### **2. แนวทางแก้ไข**
- [ ] แนะนำ CSS architecture ที่เหมาะสม
- [ ] แนะนำวิธี debug CSS issues
- [ ] แนะนำ best practices สำหรับ full-screen map

### **3. ทางเลือกอื่น**
- [ ] ใช้ CSS-in-JS (styled-components, emotion) แทน CSS files?
- [ ] ใช้ CSS Modules เพื่อ scope styles?
- [ ] สร้าง Layout แยกสำหรับหน้าที่ต้องการ full-screen?

---

## 🚀 Expected Behavior

แผนที่ควรแสดงผลเต็มพื้นที่ที่เหลือหลัง Sidebar โดย:
- ไม่มีพื้นที่สีเทาว่างด้านบนและด้านล่าง
- แผนที่ขยายเต็มความสูงของ viewport
- Form section (380px) อยู่ด้านขวา
- Header (70px) อยู่ด้านบน

---

## 📸 Screenshot Request

กรุณาแนบ screenshot ของ:
1. หน้าจอปัจจุบัน (แสดงปัญหา)
2. Browser DevTools - Elements tab (แสดง computed styles)
3. Browser DevTools - Console (แสดง errors ถ้ามี)

---

## 🔗 Related Files

- `/frontend/src/pages/field-officer/InitialSurveyPage.tsx`
- `/frontend/src/pages/field-officer/InitialSurveyPage.css`
- `/frontend/src/components/layout/DashboardLayout.tsx`
- `/frontend/src/components/layout/DashboardLayout.css`

---

## ✉️ Contact

หากต้องการข้อมูลเพิ่มเติม กรุณาติดต่อ Development Team

**วันที่สร้างรายงาน:** 20 พฤศจิกายน 2568 เวลา 15:03 น.
