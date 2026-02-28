# 🧪 Testing Guide
## Field Officer Module - Complete Testing Instructions

**วันที่:** 23 ธันวาคม 2568 เวลา 12:31 น.  
**สถานะ:** ✅ Ready for Testing  
**TypeScript:** ✅ No Errors

---

## ✅ Pre-Testing Checklist

### Code Status
- ✅ All code implemented
- ✅ TypeScript compilation successful (no errors)
- ✅ All imports resolved
- ✅ Validation schema created
- ✅ Features integrated

### Files Modified
1. ✅ `frontend/src/validation/incident-validation.ts` (Created)
2. ✅ `frontend/src/pages/field-officer/CreateIncidentReportPage.tsx` (Modified)
3. ✅ `frontend/src/types/index.ts` (Modified)
4. ✅ `frontend/src/pages/field-officer/FieldOfficerDashboard.tsx` (Modified)

---

## 🚀 Quick Start

### 1. Start Development Server
```powershell
cd d:\Guardian-Route\frontend
npm run dev
```

**Expected Output:**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 2. Start Backend Server (if needed)
```powershell
cd d:\Guardian-Route\backend
npm run start:dev
```

### 3. Login as Field Officer
- **URL:** http://localhost:5173/login
- **Email:** field@obtwiang.go.th
- **Password:** password123

---

## 🧪 Test Scenarios

### Test 1: GPS Accuracy Warning ⭐
**Objective:** Verify GPS accuracy warnings display correctly

**Steps:**
1. Navigate to: Dashboard → "➕ รายงานเหตุการณ์ใหม่"
2. Click "📍 Get Location" button
3. Allow location access when prompted
4. Observe the toast notification

**Expected Results:**
- ✅ Toast appears with accuracy message
- ✅ Accuracy circle appears on map
- ✅ Circle color matches accuracy:
  - 🟢 Green (≤50m) → Success toast
  - 🟡 Yellow (50-100m) → Warning toast
  - 🔴 Red (>100m) → Error toast
- ✅ Marker is draggable
- ✅ Popup shows accuracy value

**Pass Criteria:**
- [ ] Toast message displays
- [ ] Accuracy value shown
- [ ] Circle color correct
- [ ] Marker draggable
- [ ] No console errors

---

### Test 2: Form Validation ⭐
**Objective:** Verify form validation prevents invalid submissions

**Steps:**
1. Navigate to Create Incident page
2. Leave all fields empty
3. Click "✅ ส่งรายงานเหตุการณ์"
4. Observe validation error

**Expected Results:**
- ✅ Error toast appears: "⚠️ กรุณาเลือกหมู่บ้าน"
- ✅ Form does not submit
- ✅ No API call made

**Test Cases:**

**A. Empty Village**
- Leave village empty → Submit
- Expected: "กรุณาเลือกหมู่บ้าน"

**B. Short Notes**
- Enter notes: "test" (< 10 chars) → Submit
- Expected: "รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร"

**C. No GPS**
- Don't click "Get Location" → Submit
- Expected: "กรุณาใช้ GPS เพื่อระบุตำแหน่ง"

**D. No Polygon**
- Don't draw polygon → Submit
- Expected: "กรุณาวาดพื้นที่ที่ได้รับผลกระทบบนแผนที่"

**E. Invalid Households**
- Enter households: "abc" → Submit
- Expected: "จำนวนครัวเรือนต้องเป็นตัวเลข"

**F. Future Date**
- Select future date → Submit
- Expected: "วันที่เกิดเหตุต้องไม่เกินวันปัจจุบัน"

**Pass Criteria:**
- [ ] All validation errors display correctly
- [ ] Error messages in Thai
- [ ] Form doesn't submit when invalid
- [ ] No console errors

---

### Test 3: Draft Auto-Save ⭐
**Objective:** Verify draft saves automatically every 30 seconds

**Steps:**
1. Navigate to Create Incident page
2. Fill in some fields:
   - Village: "บ้านทดสอบ"
   - Notes: "ทดสอบการบันทึกแบบร่าง"
3. Wait 30 seconds
4. Observe toast notification

**Expected Results:**
- ✅ After 30s: Toast "💾 บันทึกแบบร่างอัตโนมัติ" appears
- ✅ Toast duration: 2 seconds
- ✅ Draft saved to localStorage

**Verification:**
Open browser DevTools → Console:
```javascript
JSON.parse(localStorage.getItem('incident-draft'))
```

Expected output:
```json
{
  "village": "บ้านทดสอบ",
  "notes": "ทดสอบการบันทึกแบบร่าง",
  "timestamp": 1703311234567,
  ...
}
```

**Pass Criteria:**
- [ ] Auto-save toast appears after 30s
- [ ] Draft saved to localStorage
- [ ] All form data included
- [ ] Timestamp present
- [ ] No console errors

---

### Test 4: Draft Restore ⭐
**Objective:** Verify draft restores on page reload

**Steps:**
1. Continue from Test 3 (draft saved)
2. Refresh the page (F5)
3. Observe confirmation dialog

**Expected Results:**
- ✅ Dialog appears: "พบแบบร่างที่บันทึกไว้"
- ✅ Shows timestamp: "บันทึกเมื่อ: [date/time]"
- ✅ Asks: "ต้องการกู้คืนหรือไม่?"

**Test Case A: Accept Restore**
1. Click "OK" in dialog
2. Observe form fields

Expected:
- ✅ All fields restored
- ✅ Toast: "✅ กู้คืนแบบร่างสำเร็จ"
- ✅ Data matches saved draft

**Test Case B: Reject Restore**
1. Click "Cancel" in dialog
2. Observe form fields

Expected:
- ✅ Form remains empty
- ✅ Draft deleted from localStorage
- ✅ No error

**Pass Criteria:**
- [ ] Restore dialog appears
- [ ] Timestamp displays correctly
- [ ] Accept restores all data
- [ ] Reject clears draft
- [ ] No console errors

---

### Test 5: Draft Expiry ⭐
**Objective:** Verify draft expires after 24 hours

**Steps:**
1. Manually set old timestamp in localStorage:
```javascript
const draft = JSON.parse(localStorage.getItem('incident-draft'));
draft.timestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
localStorage.setItem('incident-draft', JSON.stringify(draft));
```
2. Refresh page
3. Observe behavior

**Expected Results:**
- ✅ No restore dialog appears
- ✅ Draft deleted from localStorage
- ✅ Form starts fresh

**Pass Criteria:**
- [ ] Old draft not restored
- [ ] Draft deleted automatically
- [ ] No errors

---

### Test 6: Complete Incident Creation Flow ⭐⭐⭐
**Objective:** Test complete end-to-end flow

**Steps:**
1. Navigate to Create Incident page
2. Click "📍 Get Location"
   - Verify GPS accuracy message
3. Draw polygon on map
   - Use polygon tool
   - Draw around an area
   - Verify "✅ วาดพื้นที่เรียบร้อย"
4. Fill all form fields:
   - วันที่เกิดเหตุ: Today
   - ประเภทภัย: "น้ำท่วม"
   - หมู่บ้าน: "บ้านทดสอบ หมู่ 1"
   - จำนวนครัวเรือน: "25"
   - ความรุนแรง: "3 - รุนแรง"
   - หมายเหตุ: "ทดสอบการสร้างรายงานเหตุการณ์ใหม่"
5. Upload photo (optional)
6. Click "✅ ส่งรายงานเหตุการณ์"

**Expected Results:**
- ✅ No validation errors
- ✅ Loading state shows
- ✅ API call succeeds
- ✅ Draft cleared from localStorage
- ✅ Success toast: "✅ รายงานเหตุการณ์ใหม่สำเร็จ!"
- ✅ Redirects to dashboard

**Pass Criteria:**
- [ ] All steps complete successfully
- [ ] No validation errors
- [ ] Submission succeeds
- [ ] Draft cleared
- [ ] Redirect works
- [ ] No console errors

---

### Test 7: Error Handling & Retry ⭐
**Objective:** Test error handling with retry button

**Steps:**
1. Navigate to Dashboard
2. Stop backend server (simulate network error)
3. Refresh dashboard
4. Observe error toast

**Expected Results:**
- ✅ Error toast appears
- ✅ Shows error message
- ✅ Shows "🔄 ลองใหม่" button
- ✅ Button is clickable

**Test Retry:**
1. Start backend server
2. Click "🔄 ลองใหม่" button
3. Observe result

Expected:
- ✅ Toast dismissed
- ✅ Data loads successfully
- ✅ No page reload

**Pass Criteria:**
- [ ] Error toast displays
- [ ] Retry button works
- [ ] Data loads on retry
- [ ] No page reload needed

---

### Test 8: Status Mapping ⭐
**Objective:** Verify status displays correctly

**Steps:**
1. Navigate to Dashboard
2. Observe task status labels
3. Check status colors

**Expected Results:**
- ✅ Status labels in Thai:
  - PENDING → "รอดำเนินการ" (gray)
  - IN_PROGRESS → "กำลังดำเนินการ" (orange)
  - SURVEYED → "สำรวจเสร็จแล้ว" (blue)
  - COMPLETED → "เสร็จสิ้น" (green)
  - CANCELLED → "ยกเลิก" (red)

**Pass Criteria:**
- [ ] All status labels correct
- [ ] All colors correct
- [ ] SURVEYED status displays

---

## 📊 Test Results Template

### Test Summary
```
Date: [วันที่ทดสอบ]
Tester: [ชื่อผู้ทดสอบ]
Environment: Development / Staging / Production
Browser: Chrome / Firefox / Safari / Edge
```

### Results

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | GPS Accuracy Warning | ⏳ | |
| 2 | Form Validation | ⏳ | |
| 3 | Draft Auto-Save | ⏳ | |
| 4 | Draft Restore | ⏳ | |
| 5 | Draft Expiry | ⏳ | |
| 6 | Complete Flow | ⏳ | |
| 7 | Error Handling | ⏳ | |
| 8 | Status Mapping | ⏳ | |

**Legend:**
- ✅ Pass
- ❌ Fail
- ⚠️ Pass with issues
- ⏳ Not tested

### Issues Found
```
1. [Issue description]
   - Severity: Critical / High / Medium / Low
   - Steps to reproduce:
   - Expected:
   - Actual:
   - Screenshot:

2. [Issue description]
   ...
```

---

## 🐛 Common Issues & Solutions

### Issue 1: GPS Not Working
**Symptoms:** "Get Location" button does nothing

**Solutions:**
1. Check browser permissions
2. Use HTTPS (or localhost)
3. Check console for errors
4. Try different browser

### Issue 2: Validation Not Working
**Symptoms:** Form submits with invalid data

**Solutions:**
1. Check validation import
2. Verify validation function called
3. Check console for errors
4. Clear browser cache

### Issue 3: Draft Not Saving
**Symptoms:** No auto-save toast after 30s

**Solutions:**
1. Check localStorage enabled
2. Check console for errors
3. Verify useEffect dependencies
4. Check interval setup

### Issue 4: Draft Not Restoring
**Symptoms:** No restore dialog on refresh

**Solutions:**
1. Check localStorage has draft
2. Verify timestamp not expired
3. Check console for errors
4. Clear localStorage and retry

---

## 🔍 Debugging Tips

### Check localStorage
```javascript
// View draft
console.log(JSON.parse(localStorage.getItem('incident-draft')));

// Clear draft
localStorage.removeItem('incident-draft');

// View all localStorage
console.log(localStorage);
```

### Check Validation
```javascript
// In browser console
import { validateIncidentForm } from './validation/incident-validation';

const errors = validateIncidentForm({
  village: '',
  disasterType: 'น้ำท่วม',
  // ... other fields
});

console.log(errors);
```

### Monitor Network
1. Open DevTools → Network tab
2. Filter: XHR
3. Watch for API calls
4. Check request/response

### Check Console
1. Open DevTools → Console
2. Look for errors (red)
3. Look for warnings (yellow)
4. Check logs

---

## ✅ Acceptance Criteria

### Must Pass
- ✅ No TypeScript errors
- ✅ No console errors
- ✅ GPS accuracy warning works
- ✅ Form validation works
- ✅ Draft save/restore works
- ✅ Complete flow succeeds

### Should Pass
- ✅ All error messages in Thai
- ✅ All features responsive
- ✅ Good performance (< 2s load)
- ✅ No memory leaks

### Nice to Have
- ✅ Smooth animations
- ✅ Good UX feedback
- ✅ Helpful tooltips
- ✅ Clear instructions

---

## 📈 Performance Benchmarks

### Target Metrics
- **Page Load:** < 2 seconds
- **Form Validation:** < 100ms
- **Draft Save:** < 50ms
- **GPS Warning:** < 200ms
- **API Response:** < 1 second

### How to Measure
1. Open DevTools → Performance
2. Record interaction
3. Check timing
4. Compare to targets

---

## 🚀 Next Steps After Testing

### If All Tests Pass ✅
1. Document test results
2. Create test report
3. Deploy to staging
4. User acceptance testing
5. Production deployment

### If Tests Fail ❌
1. Document failures
2. Create bug tickets
3. Fix issues
4. Re-test
5. Repeat until pass

---

## 📞 Support

### Need Help?
- Check documentation
- Review code comments
- Check console errors
- Ask team for help

### Report Issues
Create issue with:
1. Test number
2. Steps to reproduce
3. Expected vs actual
4. Screenshots
5. Console errors

---

**สถานะ:** ✅ Ready for Testing  
**TypeScript:** ✅ No Errors  
**ผู้จัดทำ:** Cascade AI  
**วันที่:** 23 ธันวาคม 2568

**เริ่มทดสอบได้เลย!** 🧪🚀
