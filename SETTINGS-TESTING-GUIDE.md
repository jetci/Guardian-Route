# 🧪 Settings Page Testing Guide

**เวลาสร้าง:** 17 พ.ย. 2568 - 13:40 น.  
**สถานะ:** ✅ พร้อมทดสอบ  
**ผู้ทดสอบ:** J (Tester)

---

## 📋 ข้อมูลระบบ

### Backend API
- **URL:** `http://localhost:3000`
- **Status:** ✅ Running
- **Database:** ✅ Connected (PostgreSQL)
- **Settings Table:** ✅ Created (23 fields)

### Frontend
- **URL:** `http://localhost:5173`
- **Status:** ✅ Running
- **Page:** `/admin/settings`

### Authentication
- **Required:** ADMIN or DEVELOPER role
- **Test Account:**
  - Email: `admin@obtwiang.go.th`
  - Password: `password123`

---

## 🎯 Test Cases - Settings Page

### Test 1: Page Access ✅
**Steps:**
1. Login as ADMIN
2. Navigate to Settings page (`/admin/settings`)
3. Verify page loads

**Expected:**
- ✅ Page displays with 6 tabs
- ✅ Loading spinner shows briefly
- ✅ Settings data loads from API
- ✅ Toast: "โหลดการตั้งค่าเรียบร้อย"

---

### Test 2: Tab Navigation ✅
**Steps:**
1. Click each tab in sidebar
2. Verify content changes

**Expected:**
- ✅ Tab 1: ⚙️ ทั่วไป (General)
- ✅ Tab 2: 🔒 ผู้ใช้และความปลอดภัย (Security)
- ✅ Tab 3: 🗺️ แผนที่และภูมิสารสนเทศ (Map & GIS)
- ✅ Tab 4: 🔔 การแจ้งเตือน (Notifications)
- ✅ Tab 5: 🔌 การเชื่อมต่อและ API (API)
- ✅ Tab 6: 💾 ข้อมูลและพื้นที่จัดเก็บ (Data & Storage)

---

### Test 3: General Settings (Tab 1) ✅

**Fields to Test:**
1. **System Name** (Text Input)
   - Default: "Guardian Route"
   - Change to: "Guardian Route Test"
   
2. **Timezone** (Dropdown)
   - Options: Bangkok, Singapore, UTC
   - Change to: Singapore
   
3. **Maintenance Mode** (Toggle)
   - Default: OFF
   - Toggle ON → Maintenance Message field appears
   - Toggle OFF → Maintenance Message field hides
   
4. **Maintenance Message** (Text Area)
   - Only visible when Maintenance Mode = ON
   - Enter custom message

**Steps:**
1. Modify all fields
2. Click "💾 บันทึกการตั้งค่า"
3. Verify toast: "บันทึกการตั้งค่าทั่วไปเรียบร้อย"
4. Refresh page
5. Verify changes persisted

---

### Test 4: Security Settings (Tab 2) ✅

**Fields to Test:**
1. **Enforce 2FA** (Toggle)
   - Default: OFF
   - Toggle ON/OFF
   
2. **Min Password Length** (Number Input)
   - Default: 8
   - Range: 8-32
   - Change to: 12
   
3. **Session Timeout** (Number Input)
   - Default: 30 minutes
   - Range: 5-120
   - Change to: 60
   
4. **IP Allowlist** (Text Area)
   - Enter: "192.168.1.1, 10.0.0.1"

**Steps:**
1. Modify all fields
2. Click "💾 บันทึกการตั้งค่า"
3. Verify toast: "บันทึกการตั้งค่าความปลอดภัยเรียบร้อย"
4. Refresh page
5. Verify changes persisted

---

### Test 5: Map & GIS Settings (Tab 3) ✅

**Fields to Test:**
1. **Default Latitude** (Number Input)
   - Default: 19.9167
   - Change to: 20.0000
   
2. **Default Longitude** (Number Input)
   - Default: 99.8833
   - Change to: 100.0000
   
3. **Default Zoom** (Number Input)
   - Default: 13
   - Range: 1-18
   - Change to: 15
   
4. **Default Base Layer** (Dropdown)
   - Options: Satellite, Street
   - Change to: Satellite
   
5. **Custom Tile Server** (Text Input)
   - Enter: "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
   
6. **Enable Weather Radar** (Toggle)
   - Default: OFF
   - Toggle ON

**Steps:**
1. Modify all fields
2. Click "💾 บันทึกการตั้งค่า"
3. Verify toast: "บันทึกการตั้งค่าแผนที่เรียบร้อย"
4. Refresh page
5. Verify changes persisted

---

### Test 6: Notifications Settings (Tab 4) ✅

**Fields to Test:**
1. **Email on New Incident** (Toggle)
   - Default: ON
   - Toggle OFF/ON
   
2. **SMS on High Severity** (Toggle)
   - Default: OFF
   - Toggle ON
   
3. **Daily Email Summary** (Toggle)
   - Default: ON
   - Toggle OFF/ON
   
4. **Enable LINE Notify** (Toggle)
   - Default: OFF
   - Toggle ON → LINE Token field appears
   - Toggle OFF → LINE Token field hides
   
5. **LINE Notify Token** (Password Input)
   - Only visible when Enable LINE Notify = ON
   - Enter: "test_token_12345"

**Steps:**
1. Modify all fields
2. Click "💾 บันทึกการตั้งค่า"
3. Verify toast: "บันทึกการตั้งค่าการแจ้งเตือนเรียบร้อย"
4. Refresh page
5. Verify changes persisted
6. Verify LINE Token is masked (password field)

---

### Test 7: API Settings (Tab 5) ✅

**Fields to Test:**
1. **Weather API Key** (Password Input)
   - Enter: "weather_api_key_test"
   - Verify masked
   
2. **SMS Gateway API Key** (Password Input)
   - Enter: "sms_api_key_test"
   - Verify masked
   
3. **Max Requests Per Minute** (Number Input)
   - Default: 60
   - Range: 10-1000
   - Change to: 100
   
4. **Block Duration** (Number Input)
   - Default: 300 seconds
   - Range: 60-3600
   - Change to: 600

**Steps:**
1. Modify all fields
2. Click "💾 บันทึกการตั้งค่า"
3. Verify toast: "บันทึกการตั้งค่า API เรียบร้อย"
4. Refresh page
5. Verify changes persisted
6. Verify API keys are masked

---

### Test 8: Data & Storage Settings (Tab 6) ✅

**Fields to Test:**
1. **Data Retention Days** (Number Input)
   - Default: 365 days
   - Range: 30-3650
   - Change to: 730
   
2. **Backup Frequency** (Dropdown)
   - Options: Daily, Weekly, Monthly, Disabled
   - Default: Daily
   - Change to: Weekly

**Steps:**
1. Modify all fields
2. Click "💾 บันทึกการตั้งค่า"
3. Verify toast: "บันทึกการตั้งค่าข้อมูลเรียบร้อย"
4. Refresh page
5. Verify changes persisted

---

### Test 9: Purge Old Data (Danger Zone) ⚠️

**Steps:**
1. Go to Data & Storage tab
2. Scroll to "Danger Zone"
3. Click "🗑️ ลบข้อมูลเก่า"
4. Verify confirmation dialog appears
5. Click "OK" to confirm
6. Verify toast: "ลบข้อมูลเก่าเรียบร้อย (ก่อน [date])"

**Expected:**
- ⚠️ Confirmation dialog shows
- ✅ Data purge executes
- ✅ Success message shows retention date

---

### Test 10: Factory Reset (Danger Zone) ⚠️⚠️

**Steps:**
1. Go to Data & Storage tab
2. Scroll to "Danger Zone"
3. Click "🚨 Factory Reset"
4. Verify FIRST confirmation dialog
5. Click "OK"
6. Verify SECOND confirmation dialog
7. Click "OK" to confirm
8. Verify toast: "รีเซ็ตระบบเรียบร้อย กำลังโหลดการตั้งค่าใหม่..."
9. Verify all settings reset to defaults
10. Verify page reloads settings

**Expected:**
- ⚠️⚠️ TWO confirmation dialogs
- ✅ All settings reset to default values
- ✅ Settings reload automatically
- ✅ All tabs show default values

---

### Test 11: Cancel Button ✅

**Steps:**
1. Go to any tab
2. Modify some fields
3. Click "❌ ยกเลิก"
4. Verify toast: "ยกเลิกการเปลี่ยนแปลง"

**Expected:**
- ✅ Toast notification shows
- ⚠️ Note: Cancel doesn't revert changes (UI only)

---

### Test 12: Loading States ✅

**Test Scenarios:**
1. **Page Load**
   - Verify spinner shows
   - Verify "กำลังโหลดข้อมูล..." message
   
2. **Saving**
   - Click save button
   - Verify button text changes to "กำลังบันทึก..."
   - Verify button is disabled
   - Verify cancel button is disabled

**Expected:**
- ✅ Loading indicators show
- ✅ Buttons disabled during save
- ✅ UI responsive

---

### Test 13: Error Handling ✅

**Test Scenarios:**
1. **Network Error**
   - Stop backend server
   - Try to save settings
   - Verify error toast: "ไม่สามารถบันทึกการตั้งค่าได้"
   
2. **Invalid Data**
   - Enter invalid number (e.g., -1 for password length)
   - Try to save
   - Verify validation error

**Expected:**
- ✅ Error messages show
- ✅ User informed of failure
- ✅ No crash or blank screen

---

### Test 14: Persistence ✅

**Steps:**
1. Modify settings in ALL 6 tabs
2. Save each tab
3. Close browser
4. Reopen browser
5. Login again
6. Navigate to Settings page
7. Check all 6 tabs

**Expected:**
- ✅ ALL changes persisted
- ✅ Data loaded from database
- ✅ No data loss

---

### Test 15: Conditional Rendering ✅

**Test Cases:**
1. **Maintenance Message**
   - Only shows when Maintenance Mode = ON
   
2. **LINE Notify Token**
   - Only shows when Enable LINE Notify = ON

**Steps:**
1. Toggle switches
2. Verify fields appear/disappear

**Expected:**
- ✅ Fields show/hide correctly
- ✅ No layout issues
- ✅ Smooth transitions

---

## 🐛 Known Issues

### Backend Lint Errors (Non-Critical)
- ❌ `Cannot write file 'd:/Guardian-Route/backend/dist/...'`
- **Impact:** None - TypeScript config issue
- **Fix:** Rebuild project or restart IDE

### EPERM Error (Non-Critical)
- ❌ `EPERM: operation not permitted, rename '...query_engine-windows.dll.node'`
- **Impact:** None - Prisma Client still works
- **Fix:** Close backend server before running migrations

---

## ✅ Test Checklist

**UI Tests:**
- [ ] All 6 tabs accessible
- [ ] All 23 fields visible
- [ ] All toggles work
- [ ] All dropdowns work
- [ ] All inputs accept values
- [ ] Loading states show
- [ ] Error messages show
- [ ] Toast notifications work

**Functionality Tests:**
- [ ] Load settings on mount
- [ ] Save General settings
- [ ] Save Security settings
- [ ] Save Map settings
- [ ] Save Notifications settings
- [ ] Save API settings
- [ ] Save Data settings
- [ ] Purge old data works
- [ ] Factory reset works
- [ ] Confirmations show

**Persistence Tests:**
- [ ] Settings persist after save
- [ ] Settings persist after refresh
- [ ] Settings persist after logout/login
- [ ] All 23 fields persist correctly

**Edge Cases:**
- [ ] Empty fields handled
- [ ] Invalid numbers rejected
- [ ] Long text handled
- [ ] Special characters handled
- [ ] Concurrent saves handled

---

## 📊 Test Results Template

```
Tester: J
Date: 17 พ.ย. 2568
Time: 13:40 น.

Test 1: Page Access - [ ] PASS [ ] FAIL
Test 2: Tab Navigation - [ ] PASS [ ] FAIL
Test 3: General Settings - [ ] PASS [ ] FAIL
Test 4: Security Settings - [ ] PASS [ ] FAIL
Test 5: Map Settings - [ ] PASS [ ] FAIL
Test 6: Notifications Settings - [ ] PASS [ ] FAIL
Test 7: API Settings - [ ] PASS [ ] FAIL
Test 8: Data Settings - [ ] PASS [ ] FAIL
Test 9: Purge Old Data - [ ] PASS [ ] FAIL
Test 10: Factory Reset - [ ] PASS [ ] FAIL
Test 11: Cancel Button - [ ] PASS [ ] FAIL
Test 12: Loading States - [ ] PASS [ ] FAIL
Test 13: Error Handling - [ ] PASS [ ] FAIL
Test 14: Persistence - [ ] PASS [ ] FAIL
Test 15: Conditional Rendering - [ ] PASS [ ] FAIL

Overall Status: [ ] PASS [ ] FAIL
Issues Found: _______________________________
```

---

## 🎯 Success Criteria

**Settings System is READY when:**
- ✅ All 15 tests PASS
- ✅ No critical bugs found
- ✅ All 23 settings work correctly
- ✅ Data persists reliably
- ✅ UI is responsive and intuitive

---

## 📝 Notes for J

1. **Test Account:** Use `admin@obtwiang.go.th` / `password123`
2. **Test Order:** Follow test cases 1-15 in sequence
3. **Report Issues:** Document any failures with screenshots
4. **Database:** Settings table has default values on first load
5. **API:** All endpoints require authentication (JWT token)

---

**Status:** 🟢 READY FOR TESTING  
**Prepared by:** Team W  
**Date:** 17 พ.ย. 2568 - 13:40 น.
