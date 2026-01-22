# ✅ Test Checklist: 500 Error Fix

**Date:** 19 Jan 2026, 13:17 PM  
**Status:** Ready for Testing

---

## 🎯 Quick Test Steps

### Step 1: Prepare Browser
- [ ] Open browser to http://localhost:5173
- [ ] Open Developer Console (Press **F12**)
- [ ] Go to **Console** tab
- [ ] Clear console (click 🚫 icon or Ctrl+L)

### Step 2: Navigate to Incident Report
- [ ] Login as Field Officer
- [ ] Click "สร้างรายงานเหตุการณ์" or navigate to `/create-incident`

### Step 3: Fill Out Form
- [ ] **วันที่เกิดเหตุ:** Select today's date
- [ ] **หมู่บ้าน:** Select any village from dropdown (e.g., "บ้านเต๋าดิน")
- [ ] **ประเภทภัย:** Select "น้ำท่วม" (Flood)
- [ ] **ความรุนแรง:** Select "3" (Medium)
- [ ] **จำนวนครัวเรือน:** Enter "10"
- [ ] **รายละเอียด:** Enter "ทดสอบระบบ - Test incident report"

### Step 4: Add Location (Optional)
- [ ] Click on map to set location
- [ ] Or use current GPS location

### Step 5: Submit
- [ ] Click "ถัดไป" button
- [ ] Review page should appear
- [ ] Click "ยืนยันและบันทึกข้อมูล"

### Step 6: Check Results

#### ✅ Success Case:
- [ ] Success dialog appears: "บันทึกสำเร็จ!"
- [ ] Redirects to `/report-history`
- [ ] Console shows:
  ```
  🔍 Selected village: {...}
  📋 Survey data: {...}
  ✅ Village ID added: ...
  📦 Final payload: {...}
  ✅ Payload validation passed, sending to backend...
  ```

#### ❌ Error Case:
- [ ] Error dialog appears with clear message
- [ ] Status code is shown (400, 500, etc.)
- [ ] Console shows detailed error logs
- [ ] Error message is helpful (not generic)

---

## 🔍 What to Look For in Console

### Expected Logs (in order):

1. **Village Selection:**
   ```
   🔍 Selected village: { id: "...", name: "บ้านเต๋าดิน", ... }
   ```

2. **Survey Data:**
   ```
   📋 Survey data: { 
     villageId: "...",
     villageName: "บ้านเต๋าดิน",
     disasterType: "FLOOD",
     severity: 3,
     ...
   }
   ```

3. **Village ID Status:**
   ```
   ✅ Village ID added: uuid-here
   ```
   OR
   ```
   ⚠️ Village not found in list, villageId will be omitted
   ```

4. **Final Payload:**
   ```
   📦 Final payload: {
     "title": "FLOOD - บ้านเต๋าดิน",
     "description": "ทดสอบระบบ...",
     "disasterType": "FLOOD",
     "severity": 3,
     "location": {
       "type": "Point",
       "coordinates": [99.2333, 19.9167]
     },
     "address": "บ้านเต๋าดิน",
     "villageId": "..."
   }
   ```

5. **Validation:**
   ```
   ✅ Payload validation passed, sending to backend...
   ```

---

## 🐛 Common Errors & What They Mean

### Error 1: "Village with ID ... not found"
**Status:** 400 Bad Request  
**Meaning:** Village doesn't exist in database  
**Action:** 
```powershell
cd backend
npx prisma studio
# Check if villages table has data
# If empty, run: npx prisma db seed
```

### Error 2: "Invalid disasterType: ..."
**Status:** Client-side validation error  
**Meaning:** DisasterType mapping failed  
**Action:** Check console for the invalid value, report to developer

### Error 3: "Foreign key constraint failed"
**Status:** 400 Bad Request  
**Meaning:** Invalid villageId or userId  
**Action:** Check if user is logged in, check if village exists

### Error 4: "Missing required fields"
**Status:** Client-side validation error  
**Meaning:** Form data incomplete  
**Action:** Fill all required fields

### Error 5: 500 Internal Server Error
**Status:** 500  
**Meaning:** Unexpected backend error  
**Action:** 
- Check backend terminal for error logs
- Copy full console output
- Report to developer with all details

---

## 📋 Information to Collect (If Error Occurs)

### From Browser Console:
1. **Copy all logs** starting from "🔍 Selected village"
2. **Copy error response** (❌ Error saving data)
3. **Copy payload** (📦 Final payload)
4. **Screenshot** of error dialog

### From Backend Terminal:
1. **Copy error stack trace** (if any)
2. **Copy Prisma errors** (if any)
3. **Note timestamp** of error

### Additional Info:
1. **Which village** was selected?
2. **What disaster type** was selected?
3. **Was location** set on map?
4. **Were markers** added?
5. **Was polygon** drawn?

---

## 🎯 Test Scenarios

### Scenario 1: Basic Incident (No Optional Fields)
- Village: บ้านเต๋าดิน
- Disaster: น้ำท่วม (FLOOD)
- Severity: 3
- Households: 10
- Notes: "Basic test"
- **Expected:** ✅ Success

### Scenario 2: With Markers
- Same as Scenario 1
- Add 2-3 markers on map
- **Expected:** ✅ Success

### Scenario 3: With Polygon
- Same as Scenario 1
- Draw a polygon on map
- **Expected:** ✅ Success

### Scenario 4: Full Data
- All fields filled
- Multiple markers
- Polygon drawn
- **Expected:** ✅ Success

### Scenario 5: No Village Selected
- Leave village dropdown empty
- Fill other fields
- **Expected:** Should show validation error OR create without villageId

---

## 📊 Results Template

Copy this and fill in your results:

```
## Test Results - [Your Name] - [Date/Time]

### Environment:
- Backend Status: [ ] Running / [ ] Not Running
- Frontend Status: [ ] Running / [ ] Not Running
- Browser: [ ] Chrome / [ ] Firefox / [ ] Edge
- User Role: Field Officer

### Test 1: Basic Incident
- Status: [ ] ✅ Success / [ ] ❌ Failed
- Error (if any): 
- Console logs:
  ```
  [paste logs here]
  ```

### Test 2: With Markers
- Status: [ ] ✅ Success / [ ] ❌ Failed
- Error (if any):
- Console logs:
  ```
  [paste logs here]
  ```

### Test 3: With Polygon
- Status: [ ] ✅ Success / [ ] ❌ Failed
- Error (if any):
- Console logs:
  ```
  [paste logs here]
  ```

### Overall Assessment:
- [ ] All tests passed
- [ ] Some tests failed (specify which)
- [ ] All tests failed

### Additional Notes:
[Any observations, issues, or suggestions]
```

---

## 🚀 Ready to Test!

1. **Open browser** → http://localhost:5173
2. **Open console** → Press F12
3. **Follow checklist** above
4. **Report results** using template

**Good luck! 🎉**
