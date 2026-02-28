# 🧪 Test Report: Settings Page (6 Tabs)

**วันที่**: 29 พฤศจิกายน 2568  
**ผู้ทดสอบ**: Team W  
**Browser**: Chrome 120+  
**Screen Size**: 1920x1080

---

## 📋 Menu Information

**Menu Name**: ตั้งค่า (Settings)  
**Path**: `/settings`  
**Component**: `SettingsPage`  
**Access Role**: ADMIN  
**Priority**: 🔴 Critical

---

## 📝 Test Objectives

ตรวจสอบ Settings Page ที่ต้องมี **6 tabs** ตามเอกสาร SA:
1. ทั่วไป (General)
2. ผู้ใช้และความปลอดภัย (Users & Security)
3. แผนที่และภูมิสารสนเทศ (Map & GIS)
4. การแจ้งเตือน (Notifications)
5. การเชื่อมต่อและ API (Connectivity & API)
6. ข้อมูลและพื้นที่จัดเก็บ (Data & Storage)

---

## ✅ UI/UX Testing Checklist

### 1. Page Load & Layout
- [ ] หน้า UI โหลดได้
- [ ] Header "⚙️ ตั้งค่าระบบ" แสดงถูกต้อง
- [ ] Tab navigation แสดงครบ 6 tabs
- [ ] Default tab (General) แสดงเมื่อเปิดหน้าครั้งแรก
- [ ] Tab icons แสดงถูกต้อง

**Expected Tabs**:
1. 🔧 ทั่วไป (General)
2. 🔒 ผู้ใช้และความปลอดภัย (Security)
3. 🗺️ แผนที่และภูมิสารสนเทศ (Map)
4. 🔔 การแจ้งเตือน (Notifications)
5. 🔌 การเชื่อมต่อและ API (API)
6. 💾 ข้อมูลและพื้นที่จัดเก็บ (Data)

**Status**: ⚪ Not Tested Yet

---

## 📑 Tab 1: ทั่วไป (General)

### Settings:
- [ ] **ชื่อแอปพลิเคชัน** (Application Name)
  - Input field แสดงถูกต้อง
  - แก้ไขได้
  - บันทึกได้

- [ ] **Timezone**
  - Dropdown แสดงถูกต้อง
  - มี timezone options ครบถ้วน
  - Default: Asia/Bangkok
  - เปลี่ยนได้

- [ ] **โหมดบำรุงรักษา** (Maintenance Mode)
  - Toggle switch แสดงถูกต้อง
  - เปิด/ปิดได้
  - แสดง warning เมื่อเปิด
  - แสดงผลกระทบ (users ไม่สามารถเข้าใช้งานได้)

- [ ] **ปุ่ม "บันทึกการตั้งค่า"**
  - แสดงถูกต้อง
  - คลิกได้
  - แสดง success message

**API Calls**:
- GET /api/settings/general
- PUT /api/settings/general

**Status**: ⚪ Not Tested Yet

---

## 🔒 Tab 2: ผู้ใช้และความปลอดภัย (Users & Security)

### Settings:
- [ ] **2FA (Two-Factor Authentication)**
  - Toggle switch แสดงถูกต้อง
  - เปิด/ปิดได้
  - แสดงคำอธิบาย

- [ ] **Password Policy**
  - Min length (input number)
  - Require uppercase (checkbox)
  - Require lowercase (checkbox)
  - Require numbers (checkbox)
  - Require special characters (checkbox)

- [ ] **Session Timeout**
  - Input number (minutes)
  - Default: 30 minutes
  - Validation: min 5, max 1440

- [ ] **IP Allowlist**
  - Textarea สำหรับใส่ IP addresses
  - Format: one IP per line
  - Validation: valid IP format

- [ ] **ปุ่ม "บันทึกการตั้งค่า"**

**API Calls**:
- GET /api/settings/security
- PUT /api/settings/security

**Status**: ⚪ Not Tested Yet

---

## 🗺️ Tab 3: แผนที่และภูมิสารสนเทศ (Map & GIS)

### Settings:
- [ ] **Default Latitude**
  - Input number
  - Default: 19.9167 (ตำบลเวียง)
  - Validation: -90 to 90

- [ ] **Default Longitude**
  - Input number
  - Default: 99.8833 (ตำบลเวียง)
  - Validation: -180 to 180

- [ ] **Default Zoom Level**
  - Input number or slider
  - Default: 13
  - Validation: 1 to 18

- [ ] **Base Layer**
  - Dropdown
  - Options: OpenStreetMap, Google Maps, Satellite, etc.
  - Default: OpenStreetMap

- [ ] **Tile Server URL**
  - Input text
  - Default: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
  - Validation: valid URL

- [ ] **Weather Radar**
  - Toggle switch
  - เปิด/ปิด weather radar overlay

- [ ] **ปุ่ม "บันทึกการตั้งค่า"**

**API Calls**:
- GET /api/settings/map
- PUT /api/settings/map

**Status**: ⚪ Not Tested Yet

---

## 🔔 Tab 4: การแจ้งเตือน (Notifications)

### Settings:
- [ ] **Email Notifications**
  - Toggle switch
  - เปิด/ปิด email notifications

- [ ] **SMS Notifications**
  - Toggle switch
  - เปิด/ปิด SMS notifications

- [ ] **LINE Notify Token**
  - Input text (password type)
  - Placeholder: "ใส่ LINE Notify Token"
  - Validation: required if LINE notify enabled

- [ ] **Test Notification Button**
  - ปุ่ม "ทดสอบการแจ้งเตือน"
  - ส่ง test notification
  - แสดงผลสำเร็จ/ล้มเหลว

- [ ] **ปุ่ม "บันทึกการตั้งค่า"**

**API Calls**:
- GET /api/settings/notifications
- PUT /api/settings/notifications
- POST /api/settings/notifications/test

**Status**: ⚪ Not Tested Yet

---

## 🔌 Tab 5: การเชื่อมต่อและ API (Connectivity & API)

### Settings:
- [ ] **Weather API Key**
  - Input text (password type)
  - Placeholder: "ใส่ API Key"

- [ ] **Weather API Provider**
  - Dropdown
  - Options: OpenWeatherMap, WeatherAPI, etc.

- [ ] **SMS Gateway URL**
  - Input text
  - Validation: valid URL

- [ ] **SMS Gateway API Key**
  - Input text (password type)

- [ ] **Rate Limiting**
  - Toggle switch
  - Input number: requests per minute
  - Default: 100

- [ ] **API Timeout**
  - Input number (seconds)
  - Default: 30

- [ ] **ปุ่ม "ทดสอบการเชื่อมต่อ"**
  - Test Weather API
  - Test SMS Gateway
  - แสดงผลสำเร็จ/ล้มเหลว

- [ ] **ปุ่ม "บันทึกการตั้งค่า"**

**API Calls**:
- GET /api/settings/api
- PUT /api/settings/api
- POST /api/settings/api/test-weather
- POST /api/settings/api/test-sms

**Status**: ⚪ Not Tested Yet

---

## 💾 Tab 6: ข้อมูลและพื้นที่จัดเก็บ (Data & Storage)

### Settings:
- [ ] **Data Retention Policy**
  - Dropdown
  - Options: 30 days, 90 days, 1 year, Forever
  - Default: 1 year

- [ ] **Backup Frequency**
  - Dropdown
  - Options: Daily, Weekly, Monthly
  - Default: Daily

- [ ] **Auto Backup Time**
  - Time picker
  - Default: 02:00 AM

- [ ] **ปุ่ม "สำรองข้อมูลทันที"**
  - Manual backup trigger
  - แสดง progress
  - แสดงผลสำเร็จ/ล้มเหลว

- [ ] **ปุ่ม "ลบข้อมูลเก่า" (Purge Data)**
  - แสดง confirmation dialog
  - ต้องใส่ CAPTCHA หรือ confirmation text
  - แสดง warning ชัดเจน
  - ลบข้อมูลที่เก่ากว่า retention policy

- [ ] **ปุ่ม "รีเซ็ตระบบ" (Factory Reset)**
  - แสดง confirmation dialog ที่รุนแรง
  - ต้องใส่ CAPTCHA
  - ต้องพิมพ์ "RESET" เพื่อยืนยัน
  - แสดง warning ว่าจะลบข้อมูลทั้งหมด
  - รีเซ็ตระบบกลับไปเป็นค่าเริ่มต้น

- [ ] **ปุ่ม "บันทึกการตั้งค่า"**

**API Calls**:
- GET /api/settings/data
- PUT /api/settings/data
- POST /api/backup/manual
- POST /api/data/purge
- POST /api/system/factory-reset

**Status**: ⚪ Not Tested Yet

---

## 🎯 Test Scenarios

### Scenario 1: Change Application Name
1. Navigate to Settings → General tab
2. Change "ชื่อแอปพลิเคชัน" to "Guardian Route - Test"
3. Click "บันทึกการตั้งค่า"
4. Verify success message
5. Refresh page
6. Verify name persisted

**Expected**: Name changed and saved

---

### Scenario 2: Enable Maintenance Mode
1. Navigate to Settings → General tab
2. Toggle "โหมดบำรุงรักษา" ON
3. Verify warning message appears
4. Click "บันทึกการตั้งค่า"
5. Logout
6. Try to login with different user

**Expected**: Maintenance mode message shown to other users

---

### Scenario 3: Configure Password Policy
1. Navigate to Settings → Security tab
2. Set min length = 12
3. Enable all checkboxes (uppercase, lowercase, numbers, special)
4. Click "บันทึกการตั้งค่า"
5. Try to create user with weak password

**Expected**: Password validation enforced

---

### Scenario 4: Test LINE Notify
1. Navigate to Settings → Notifications tab
2. Enter valid LINE Notify Token
3. Click "ทดสอบการแจ้งเตือน"
4. Check LINE for test message

**Expected**: Test notification received

---

### Scenario 5: Purge Old Data (with CAPTCHA)
1. Navigate to Settings → Data & Storage tab
2. Click "ลบข้อมูลเก่า"
3. Verify CAPTCHA appears
4. Enter CAPTCHA correctly
5. Confirm deletion

**Expected**: Old data purged successfully

---

### Scenario 6: Factory Reset Protection
1. Navigate to Settings → Data & Storage tab
2. Click "รีเซ็ตระบบ"
3. Verify severe warning appears
4. Try to confirm without typing "RESET"

**Expected**: Cannot proceed without typing "RESET"

---

## 📸 Screenshots

### Screenshot 1: All 6 Tabs
```
[แนบ screenshot แสดง tab navigation]
```

### Screenshot 2: General Tab
```
[แนบ screenshot ของ General settings]
```

### Screenshot 3: Security Tab
```
[แนบ screenshot ของ Security settings]
```

### Screenshot 4: Map Tab
```
[แนบ screenshot ของ Map settings]
```

### Screenshot 5: Notifications Tab
```
[แนบ screenshot ของ Notifications settings]
```

### Screenshot 6: API Tab
```
[แนบ screenshot ของ API settings]
```

### Screenshot 7: Data & Storage Tab
```
[แนบ screenshot ของ Data settings]
```

### Screenshot 8: Purge Data Confirmation
```
[แนบ screenshot ของ CAPTCHA dialog]
```

### Screenshot 9: Factory Reset Confirmation
```
[แนบ screenshot ของ severe warning]
```

---

## 🐛 Known Issues (From Requirements)

### Critical Requirements:
1. **6 Tabs Required**
   - ต้องมีครบทั้ง 6 tabs
   - Tab type: 'general' | 'security' | 'map' | 'notifications' | 'api' | 'data'

2. **CAPTCHA Required**
   - Purge Data ต้องมี CAPTCHA
   - Factory Reset ต้องมี CAPTCHA + พิมพ์ "RESET"

3. **Validation Required**
   - ทุก input ต้องมี validation
   - Error messages ชัดเจน

---

## 📈 Overall Assessment

**UI Status**: ⚪ Not Tested Yet  
**API Status**: ⚪ Not Tested Yet  
**Priority**: 🔴 Critical  
**Estimate to Fix**: TBD

### Critical Checks:
- [ ] มีครบ 6 tabs
- [ ] แต่ละ tab มี settings ครบตามเอกสาร SA
- [ ] Purge Data มี CAPTCHA
- [ ] Factory Reset มี CAPTCHA + confirmation
- [ ] ทุก setting บันทึกได้และ persist

---

## ✅ Sign-off

**Tested by**: _______________  
**Date**: _______________  
**Status**: [ ] PASS  [ ] FAIL  [ ] PARTIAL

**Reviewer**: _______________  
**Date**: _______________

---

**Status**: 🟡 Ready to Test  
**Created**: 29 พฤศจิกายน 2568 12:15 น.

**Note**: Settings Page เป็นหน้าที่สำคัญมาก ต้องทดสอบอย่างละเอียด!
