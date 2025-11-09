# Post-Deployment Testing Checklist - Admin System v2.2.0

**Version:** 2.2.0  
**Date:** November 9, 2025  
**Environment:** Production  
**Tester:** QA Team

---

## 📋 Testing Overview

**Purpose:** Verify all new features in v2.2.0 work correctly in production environment.

**Scope:**
1. GeoJSON History Log
2. Polygon Editor with Undo/Redo
3. Custom Layer Editor
4. Settings Change Notifications

**Prerequisites:**
- ✅ Database migration completed
- ✅ Services restarted
- ✅ Admin user account ready
- ✅ Test data prepared

---

## 🧪 Test Cases

### 1. GeoJSON History Log

#### Test 1.1: View History
**Steps:**
1. Login as ADMIN
2. Navigate to **Admin Dashboard** → **ขอบเขตภูมิศาสตร์**
3. Click on any GeoJSON item
4. Select **ดูประวัติ** from Actions menu

**Expected Result:**
- ✅ Modal opens with history table
- ✅ Shows version, name, type, change type, changed by, date
- ✅ Pagination works (if more than 20 items)

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 1.2: View Version Details
**Steps:**
1. Open GeoJSON history (from Test 1.1)
2. Click **View Details** (eye icon) on any version

**Expected Result:**
- ✅ Modal shows detailed information
- ✅ Displays JSON details correctly
- ✅ Shows change type badge with correct color

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 1.3: Restore Version
**Steps:**
1. Open GeoJSON history
2. Click **Restore** (↩️ icon) on an old version
3. Confirm restoration

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ GeoJSON is updated to selected version
- ✅ New RESTORE entry appears in history
- ✅ Success toast notification shows
- ✅ GeoJSON list refreshes

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 1.4: History After Upload
**Steps:**
1. Upload a new GeoJSON file
2. Open history for that GeoJSON

**Expected Result:**
- ✅ History shows CREATE entry
- ✅ Version is 1
- ✅ Change type is CREATE (green badge)
- ✅ Correct user and timestamp

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 1.5: History After Edit
**Steps:**
1. Edit an existing GeoJSON
2. Save changes
3. Open history

**Expected Result:**
- ✅ New UPDATE entry appears
- ✅ Version incremented
- ✅ Change type is UPDATE (blue badge)
- ✅ Previous version still visible

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 1.6: History After Delete
**Steps:**
1. Delete a GeoJSON
2. Check if history is preserved (via database query)

**Expected Result:**
- ✅ DELETE entry created before deletion
- ✅ History preserved in database
- ✅ Can be used for restore if needed

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### 2. Polygon Editor with Undo/Redo

#### Test 2.1: Open Polygon Editor
**Steps:**
1. Navigate to GeoJSON Management
2. Click **แก้ไข** on any GeoJSON

**Expected Result:**
- ✅ Polygon Editor opens
- ✅ Map displays with drawing tools
- ✅ Toolbar shows Undo, Redo, Save, Cancel buttons
- ✅ History counter shows 1/1 (initial state)

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 2.2: Draw and Undo
**Steps:**
1. Open Polygon Editor
2. Draw a polygon on the map
3. Click **Undo** button (or press Ctrl+Z)

**Expected Result:**
- ✅ Polygon disappears
- ✅ History counter decrements
- ✅ Toast notification shows "Undo สำเร็จ"
- ✅ "มีการเปลี่ยนแปลง" badge appears/disappears

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 2.3: Redo
**Steps:**
1. After undoing (Test 2.2)
2. Click **Redo** button (or press Ctrl+Y)

**Expected Result:**
- ✅ Polygon reappears
- ✅ History counter increments
- ✅ Toast notification shows "Redo สำเร็จ"

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 2.4: Keyboard Shortcuts
**Steps:**
1. Open Polygon Editor
2. Draw multiple shapes
3. Press **Ctrl+Z** multiple times
4. Press **Ctrl+Y** multiple times
5. Press **Ctrl+Shift+Z** (alternative Redo)

**Expected Result:**
- ✅ Ctrl+Z undoes actions
- ✅ Ctrl+Y redoes actions
- ✅ Ctrl+Shift+Z also redoes actions
- ✅ All shortcuts work consistently

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 2.5: History Limit
**Steps:**
1. Open Polygon Editor
2. Draw 51+ shapes (exceeding 50 limit)
3. Try to undo all

**Expected Result:**
- ✅ Can undo up to 50 actions
- ✅ Oldest actions are discarded
- ✅ No errors or crashes

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 2.6: Save Changes
**Steps:**
1. Open Polygon Editor
2. Make changes
3. Click **บันทึก**

**Expected Result:**
- ✅ Changes saved to database
- ✅ Success toast notification
- ✅ Editor closes
- ✅ GeoJSON list updates
- ✅ History entry created

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 2.7: Cancel with Changes
**Steps:**
1. Open Polygon Editor
2. Make changes
3. Click **ยกเลิก**

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ "มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก" message
- ✅ Can confirm or cancel
- ✅ If confirmed, editor closes without saving

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### 3. Custom Layer Editor

#### Test 3.1: View Custom Layers
**Steps:**
1. Navigate to **Admin Dashboard**
2. Click **Custom Layers** tab

**Expected Result:**
- ✅ Custom Layer Editor displays
- ✅ Table shows existing layers (if any)
- ✅ Filter dropdown works
- ✅ Total count displays

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 3.2: Create Custom Layer
**Steps:**
1. Click **สร้าง Layer**
2. Fill in form:
   - Name: "Test Layer"
   - Description: "Test description"
   - Type: "polygon"
   - GeoJSON: Valid GeoJSON object
   - Fill Color: #FF0000
   - Stroke Color: #000000
   - Opacity: 0.7
3. Click **สร้าง**

**Expected Result:**
- ✅ Layer created successfully
- ✅ Success toast notification
- ✅ Layer appears in table
- ✅ Modal closes

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 3.3: Edit Custom Layer
**Steps:**
1. Click Actions menu on a layer
2. Select **แก้ไข**
3. Modify name and color
4. Click **อัพเดท**

**Expected Result:**
- ✅ Modal opens with existing data
- ✅ Changes saved successfully
- ✅ Table updates immediately
- ✅ Success toast notification

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 3.4: Toggle Visibility
**Steps:**
1. Click eye icon (👁️) on a layer
2. Click again to toggle back

**Expected Result:**
- ✅ Icon changes color (green ↔ gray)
- ✅ isVisible status updates
- ✅ No page refresh needed

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 3.5: Reorder Layers
**Steps:**
1. Click **↑** (up arrow) on a layer
2. Click **↓** (down arrow) on a layer

**Expected Result:**
- ✅ Layer moves up/down in table
- ✅ z-index updates
- ✅ Order persists after page refresh

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 3.6: Clone Layer
**Steps:**
1. Click Actions menu on a layer
2. Select **คัดลอก**

**Expected Result:**
- ✅ New layer created with "(Copy)" suffix
- ✅ All properties copied
- ✅ Success toast notification
- ✅ Table updates

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 3.7: Delete Layer
**Steps:**
1. Click Actions menu on a layer
2. Select **ลบ**
3. Confirm deletion

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Layer deleted from database
- ✅ Success toast notification
- ✅ Table updates

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 3.8: Export Layers
**Steps:**
1. Click **Export GeoJSON** button
2. Check downloaded file

**Expected Result:**
- ✅ File downloads as "custom-layers.geojson"
- ✅ File is valid GeoJSON FeatureCollection
- ✅ Contains all visible layers
- ✅ Properties preserved

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 3.9: Filter by Type
**Steps:**
1. Select "Polygon" from filter dropdown
2. Select "Marker" from filter dropdown
3. Select "ทุกประเภท"

**Expected Result:**
- ✅ Table filters correctly
- ✅ Count updates
- ✅ No errors

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### 4. Settings Change Notifications

#### Test 4.1: View Notification Bell
**Steps:**
1. Navigate to Admin Dashboard
2. Check top-right corner for bell icon

**Expected Result:**
- ✅ Bell icon visible
- ✅ Badge shows unread count (if any)
- ✅ Badge is red color

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 4.2: Create Notification
**Steps:**
1. Go to **การตั้งค่าระบบ** tab
2. Change any setting (e.g., toggle Gemini AI)
3. Click **บันทึก**
4. Check notification bell

**Expected Result:**
- ✅ Badge count increments
- ✅ Notification appears in list
- ✅ Shows correct setting name
- ✅ Shows "ใหม่" badge

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 4.3: View Notifications
**Steps:**
1. Click notification bell
2. Review notification list

**Expected Result:**
- ✅ Popover opens (400px width)
- ✅ Shows up to 10 recent notifications
- ✅ Unread items have blue background
- ✅ Read items have white background
- ✅ Each shows: setting name, changed by, timestamp

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 4.4: Mark as Read
**Steps:**
1. Click on an unread notification

**Expected Result:**
- ✅ Background changes to white
- ✅ "ใหม่" badge disappears
- ✅ Badge count decrements
- ✅ isRead status updates in database

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 4.5: Mark All as Read
**Steps:**
1. Open notification popover
2. Click **อ่านทั้งหมด** button

**Expected Result:**
- ✅ All notifications marked as read
- ✅ Badge count becomes 0
- ✅ Success toast notification
- ✅ All backgrounds turn white

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 4.6: Delete Notification
**Steps:**
1. Open notification popover
2. Click menu (⋮) on a notification
3. Select **ลบ**
4. Confirm deletion

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Notification removed from list
- ✅ Success toast notification
- ✅ Count updates

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 4.7: Filter Notifications
**Steps:**
1. Open notification popover
2. Click **แสดงเฉพาะที่ยังไม่อ่าน**
3. Click **แสดงทั้งหมด**

**Expected Result:**
- ✅ Filter toggles correctly
- ✅ List updates immediately
- ✅ Button text changes

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test 4.8: Auto-Refresh
**Steps:**
1. Open notification popover
2. Wait 30 seconds (or have another user change settings)
3. Observe notification list

**Expected Result:**
- ✅ List refreshes automatically every 30s
- ✅ New notifications appear without manual refresh
- ✅ Badge count updates

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

## 🔒 Security Testing

### Test S.1: Authorization
**Steps:**
1. Try to access admin endpoints without ADMIN role
2. Try to access with expired token

**Expected Result:**
- ✅ 403 Forbidden for non-ADMIN users
- ✅ 401 Unauthorized for invalid/expired tokens

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### Test S.2: Input Validation
**Steps:**
1. Try to create layer with invalid GeoJSON
2. Try to upload invalid GeoJSON file
3. Try SQL injection in search fields

**Expected Result:**
- ✅ Validation errors displayed
- ✅ No database errors
- ✅ No security vulnerabilities

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

## 📊 Performance Testing

### Test P.1: Large History
**Steps:**
1. Create GeoJSON with 100+ history entries
2. Open history viewer
3. Navigate through pages

**Expected Result:**
- ✅ Pagination works smoothly
- ✅ Response time < 100ms
- ✅ No UI lag

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### Test P.2: Many Layers
**Steps:**
1. Create 50+ custom layers
2. Reorder layers
3. Toggle visibility

**Expected Result:**
- ✅ Operations complete quickly
- ✅ No performance degradation
- ✅ UI remains responsive

**Status:** ⬜ Not Tested | ✅ Pass | ❌ Fail

---

## 🐛 Bug Report Template

**Bug ID:** BUG-V2.2.0-XXX  
**Severity:** Critical / High / Medium / Low  
**Test Case:** [Test case number]

**Description:**
[Describe the bug]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[Attach screenshots]

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- User Role: [e.g., ADMIN]

---

## 📋 Test Summary

### Overall Results
- **Total Test Cases:** 32
- **Passed:** ⬜
- **Failed:** ⬜
- **Not Tested:** ⬜
- **Pass Rate:** ⬜%

### Feature Results
| Feature | Test Cases | Passed | Failed | Pass Rate |
|---------|-----------|--------|--------|-----------|
| GeoJSON History | 6 | ⬜ | ⬜ | ⬜% |
| Polygon Editor | 7 | ⬜ | ⬜ | ⬜% |
| Custom Layers | 9 | ⬜ | ⬜ | ⬜% |
| Notifications | 8 | ⬜ | ⬜ | ⬜% |
| Security | 2 | ⬜ | ⬜ | ⬜% |
| Performance | 2 | ⬜ | ⬜ | ⬜% |

### Critical Issues
⬜ None found  
⬜ Issues found (list below):
- [Issue 1]
- [Issue 2]

### Recommendations
- [ ] Deploy to production
- [ ] Fix critical bugs first
- [ ] Additional testing needed

---

## ✅ Sign-off

**Tested By:** ___________________  
**Date:** ___________________  
**Approved By:** ___________________  
**Date:** ___________________

---

**Version:** 2.2.0  
**Status:** ⬜ Testing In Progress | ✅ Testing Complete | ❌ Testing Failed  
**Date:** November 9, 2025

**© 2025 Guardian Route - Post-Deployment Testing**
