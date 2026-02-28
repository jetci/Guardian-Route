# 📋 Settings Page - Technical Specification

**Based on SA Document**  
**Date:** 17 พฤศจิกายน 2567

---

## 🎯 Overview

Settings Page เป็น Central Control Panel สำหรับ System Administrator (ADMIN role only) ในการกำหนดค่าการทำงานของระบบ Guardian Route

---

## 📑 Tab Structure (6 Tabs)

### 1️⃣ ทั่วไป (General)
- ชื่อแอปพลิเคชัน (Text Input)
- เขตเวลา (Dropdown: Asia/Bangkok, Asia/Singapore, UTC)
- เปิดใช้งานโหมดบำรุงรักษา (Toggle)
- ข้อความในโหมดบำรุงรักษา (Text Area)

### 2️⃣ ผู้ใช้และความปลอดภัย (Users & Security)
- บังคับใช้ 2FA (Toggle)
- ความยาวรหัสผ่านขั้นต่ำ (Number Input)
- ระยะเวลาเซสชัน นาที (Number Input)
- IP Address Allowlist (Text Area - comma separated)

### 3️⃣ แผนที่และภูมิสารสนเทศ (Map & GIS)
- Default Latitude (Number Input)
- Default Longitude (Number Input)
- Default Zoom (Number Input)
- Default Base Layer (Dropdown: ภาพถ่ายดาวเทียม, แผนที่ถนน)
- Custom Map Tile Server URL (Text Input)
- เปิดใช้งานเรดาร์สภาพอากาศ (Toggle)

### 4️⃣ การแจ้งเตือน (Notifications)
- Email on New Incident (Toggle)
- SMS on High Severity Incident (Toggle)
- Daily Email Summary (Toggle)
- เปิดใช้งาน LINE Notify (Toggle)
- LINE Notify Access Token (Password Input)

### 5️⃣ การเชื่อมต่อและ API (Connectivity & API)
- Weather API Key (Password Input)
- SMS Gateway API Key (Password Input)
- จำนวนคำขอสูงสุดต่อนาที (Number Input - Rate Limiting)
- ระยะเวลาที่บล็อก วินาที (Number Input - Rate Limiting)

### 6️⃣ ข้อมูลและพื้นที่จัดเก็บ (Data & Storage)
- ระยะเวลาจัดเก็บข้อมูล วัน (Number Input)
- ความถี่ในการสำรองข้อมูล (Dropdown: รายวัน, รายสัปดาห์, รายเดือน, ปิดใช้งาน)
- **Danger Zone:**
  - Purge Old Data (Button - requires confirmation)
  - Factory Reset (Button - requires double confirmation)

---

## 🔄 User Flow

1. Admin เข้าหน้า Settings
2. เลือก Tab ที่ต้องการ
3. แก้ไขค่าต่างๆ
4. กด "บันทึกการตั้งค่า" หรือ "ยกเลิก"
5. ระบบแสดง Toast notification

---

## 💾 State Variables

```typescript
// Tab 1: General
systemName: string
timezone: string
maintenanceMode: boolean
maintenanceMessage: string

// Tab 2: Security
enforce2FA: boolean
minPasswordLength: number
sessionTimeout: number
ipAllowlist: string

// Tab 3: Map
defaultLat: number
defaultLng: number
defaultZoom: number
defaultBaseLayer: 'satellite' | 'street'
customTileServer: string
enableWeatherRadar: boolean

// Tab 4: Notifications
emailOnNewIncident: boolean
smsOnHighSeverity: boolean
dailyEmailSummary: boolean
enableLineNotify: boolean
lineNotifyToken: string

// Tab 5: API
weatherApiKey: string
smsGatewayApiKey: string
maxRequestsPerMinute: number
blockDuration: number

// Tab 6: Data
dataRetentionDays: number
backupFrequency: 'daily' | 'weekly' | 'monthly' | 'disabled'
```

---

## 🎨 UI Components

- Toggle Switch (for boolean settings)
- Text Input (for strings)
- Number Input (for numbers)
- Password Input (for sensitive data)
- Text Area (for multi-line text)
- Dropdown/Select (for options)
- Buttons (Save, Cancel, Danger actions)

---

## ⚠️ Danger Zone Actions

### Purge Old Data
- Confirmation dialog required
- Deletes data older than retention period
- Cannot be undone

### Factory Reset
- Double confirmation required
- Resets ALL settings to default
- Deletes ALL data
- Cannot be undone

---

## 🔒 Security

- Only ADMIN role can access
- Sensitive fields use password input type
- Confirmation dialogs for destructive actions
- API keys are masked in UI

---

## 📱 Responsive Design

- Sidebar navigation on desktop
- Horizontal tabs on mobile
- Form fields stack on small screens

---

## 🧪 Testing Checklist

- [ ] All toggles work correctly
- [ ] Number inputs validate min/max
- [ ] Save button persists changes
- [ ] Cancel button reverts changes
- [ ] Confirmation dialogs appear for danger actions
- [ ] Toast notifications show on save
- [ ] Settings persist after page reload
- [ ] Only ADMIN can access page
