# 🔴 Diagnostic Guide: 500 Error on Incident Creation

**Date:** 19 Jan 2026, 13:12 PM
**Issue:** Request failed with status code 500 when submitting incident report
**Location:** SurveyReviewPage.tsx → incidentService.create()

---

## ✅ Changes Made

### 1. Enhanced Logging (SurveyReviewPage.tsx)
Added comprehensive console logging to track:
- Selected village data
- Survey data structure
- Final payload before sending
- Validation results
- Detailed error responses

### 2. Client-Side Validation
Added validation checks for:
- Required fields (title, disasterType, severity, location)
- DisasterType enum values (FLOOD, LANDSLIDE, FIRE, STORM, EARTHQUAKE, DROUGHT, OTHER)
- Severity range (1-5)
- Location coordinates format
- VillageId existence

### 3. Improved Error Display
Enhanced error dialog to show:
- Specific error message
- HTTP status code
- Backend error details
- Console log reminder

---

## 🔍 How to Diagnose

### Step 1: Reproduce the Error
1. Navigate to `/create-incident` page
2. Fill out the incident report form
3. Click "ถัดไป" to go to review page
4. Click "ยืนยันและบันทึกข้อมูล"

### Step 2: Check Browser Console (F12)
Look for these log entries in order:

```
🔍 Selected village: { id: "...", name: "...", ... }
📋 Survey data: { villageId: "...", villageName: "...", ... }
📦 Final payload: { ... }
✅ Payload validation passed, sending to backend...
```

If error occurs, you'll see:
```
❌ Error saving data: ...
📋 Error response: ...
📦 Error config: ...
🔴 Full error object: ...
```

### Step 3: Identify the Issue

#### Common Issues:

**A. Invalid villageId**
```
Error: villageId must be a valid UUID
```
**Solution:** Check if village exists in database

**B. Invalid disasterType**
```
Error: disasterType must be a valid enum value
```
**Solution:** Verify mapping in CreateIncidentReportPage.tsx (line 768-782)

**C. Invalid affectedArea GeoJSON**
```
Error: Invalid GeoJSON structure
```
**Solution:** Check polygon data format

**D. Database constraint violation**
```
Error: Foreign key constraint failed
```
**Solution:** Village or user doesn't exist in database

**E. Missing required field**
```
Error: [field] should not be empty
```
**Solution:** Check DTO validation in create-incident.dto.ts

---

## 🛠️ Debugging Steps

### 1. Check Backend Server Status
```powershell
# Check if backend is running
Get-Process -Name "node" | Where-Object { $_.StartTime -gt (Get-Date).AddHours(-1) }

# Check backend port
netstat -ano | findstr :3000
```

### 2. Check Backend Logs
```powershell
# If using PM2
pm2 logs backend

# If running with npm run dev
# Check the terminal where backend is running
```

### 3. Test API Directly
```powershell
# Test with curl or Postman
curl -X POST http://localhost:3000/api/incidents `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -d '{
    "title": "Test Incident",
    "description": "Test description",
    "disasterType": "FLOOD",
    "severity": 3,
    "location": {
      "type": "Point",
      "coordinates": [99.2333, 19.9167]
    },
    "address": "Test Address"
  }'
```

### 4. Check Database Connection
```powershell
cd backend
npx prisma studio
# Check if villages table has data
# Check if users table has the current user
```

---

## 📋 Information Needed

Please provide the following from the browser console:

1. **Selected Village Log:**
   ```
   🔍 Selected village: ...
   ```

2. **Survey Data Log:**
   ```
   📋 Survey data: ...
   ```

3. **Final Payload Log:**
   ```
   📦 Final payload: ...
   ```

4. **Error Response Log:**
   ```
   ❌ Error saving data: ...
   📋 Error response: ...
   ```

5. **Backend Terminal Output:**
   - Any error messages
   - Stack traces
   - Validation errors

---

## 🎯 Quick Fixes

### Fix 1: Village Not Found
If village is not found in the list:
```typescript
// The villageId will be omitted (optional field)
// This should work, but check backend logs
```

### Fix 2: Invalid Enum Value
Check the disaster type mapping:
```typescript
// CreateIncidentReportPage.tsx line 768-782
const mapping: Record<string, string> = {
  'น้ำท่วม': 'FLOOD',
  'ไฟป่า': 'FIRE',
  'ดินถลม': 'LANDSLIDE',
  'วาตภัย': 'STORM',
  'อัคคีภัย': 'FIRE',
  'แผ่นดินไหว': 'EARTHQUAKE',
  'ภัยแล้ง': 'DROUGHT',
  'อื่นๆ': 'OTHER'
};
```

### Fix 3: Backend Validation
Check create-incident.dto.ts for validation rules:
- All required fields must be present
- Enum values must match exactly
- GeoJSON must be valid format

---

## 🚀 Next Actions

1. **Try submitting again** and check console logs
2. **Copy all console output** (especially the payload and error)
3. **Check backend terminal** for error messages
4. **Share the logs** so we can identify the exact issue

---

## 📝 Related Files

- `frontend/src/pages/field-officer/SurveyReviewPage.tsx` (line 232-412)
- `frontend/src/pages/field-officer/CreateIncidentReportPage.tsx` (line 768-782)
- `frontend/src/services/incidentService.ts`
- `backend/src/incidents/incidents.controller.ts`
- `backend/src/incidents/incidents.service.ts`
- `backend/src/incidents/dto/create-incident.dto.ts`
- `backend/prisma/schema.prisma` (DisasterType enum)

---

## ✅ Status

- [x] Enhanced logging added
- [x] Client-side validation added
- [x] Improved error display
- [ ] Waiting for console logs to diagnose
- [ ] Fix backend issue once identified
- [ ] Test and verify fix
