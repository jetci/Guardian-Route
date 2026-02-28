# 🐛 Bug Fix: Survey History Empty After Submission
## ปัญหา: บันทึกข้อมูลสำรวจแล้ว แต่ไม่มีรายงานในประวัติ

**วันที่:** 23 ธันวาคม 2568 เวลา 13:18 น.  
**ผู้รายงาน:** User  
**สถานะ:** 🔍 Investigating

---

## 🔍 ปัญหาที่พบ

### User Report
```
สำรวจพื้นที่ บันทึกข้อมูลสำรวจเสร็จแล้ว 
ไม่มีรายงานแจ้ง ใน ประวัติการรายงาน
```

### อาการ
- บันทึกข้อมูลสำรวจสำเร็จ (มี alert แจ้ง)
- ไปที่ "ประวัติการสำรวจ" → ว่างเปล่า
- ไม่มีรายการที่บันทึกไว้แสดง

### Expected Behavior
- หลังบันทึกสำเร็จ → ควรเห็นในประวัติ
- แสดงรายการสำรวจทั้งหมดที่เคยส่ง
- แสดงรายละเอียด: วันที่, พื้นที่, ความรุนแรง, สถานะ

---

## 🔎 Investigation Results

### ✅ Frontend Code - Correct

**Submit API Call:**
```typescript
// InitialSurveyPage.tsx line 740
const response = await fieldSurveyApi.submitSurvey(surveyData);
```

**Get History API Call:**
```typescript
// SurveyHistoryPage.tsx line 26
const data = await fieldSurveyApi.getMySurveys();
```

**API Endpoints:**
```typescript
// fieldSurvey.ts
submitSurvey: POST /field-officer/surveys
getMySurveys: GET /field-officer/surveys/my-surveys
```

### ✅ Backend Code - Correct

**Controller:**
```typescript
// field-officer-survey.controller.ts
@Controller('field-officer/surveys')
export class FieldOfficerSurveyController {
  
  @Post()
  @Roles(Role.FIELD_OFFICER)
  async submitSurvey(@Req() req, @Body() surveyDto) {
    return this.surveyService.submitFieldSurvey(userId, surveyDto);
  }

  @Get('my-surveys')
  @Roles(Role.FIELD_OFFICER)
  async getMySurveys(@Req() req) {
    return this.surveyService.getFieldOfficerSurveys(userId);
  }
}
```

**Service:**
```typescript
// field-officer-survey.service.ts
async submitFieldSurvey(fieldOfficerId, surveyDto) {
  const fieldSurvey = await this.prisma.fieldSurvey.create({
    data: {
      fieldOfficerId,
      taskId: surveyDto.taskId,
      villageId: surveyDto.villageId,
      villageName: surveyDto.villageName,
      disasterType: surveyDto.disasterType,
      severity: surveyDto.severity,
      // ... other fields
      status: 'SUBMITTED'
    }
  });
  return new FieldOfficerSurveyResponseDto(fieldSurvey);
}

async getFieldOfficerSurveys(fieldOfficerId) {
  return await this.prisma.fieldSurvey.findMany({
    where: { fieldOfficerId },
    orderBy: { submittedAt: 'desc' }
  });
}
```

**Database Schema:**
```prisma
model FieldSurvey {
  id                  String   @id @default(uuid())
  fieldOfficerId      String   @map("field_officer_id")
  taskId              String?  @map("task_id")
  villageId           String?  @map("village_id")
  villageName         String   @map("village_name")
  disasterType        String   @map("disaster_type")
  severity            Int
  // ... other fields
  submittedAt         DateTime @default(now()) @map("submitted_at")
  status              String
  
  fieldOfficer        User     @relation(...)
  village             Village? @relation(...)
  task                Task?    @relation(...)
}
```

### ✅ Module Registration - Correct

```typescript
// survey.module.ts
@Module({
  imports: [DatabaseModule],
  controllers: [
    SurveyController,
    SurveyTemplateController,
    FieldOfficerSurveyController,  // ✅ Registered
  ],
  providers: [SurveyService, FieldOfficerSurveyService],
  exports: [SurveyService, FieldOfficerSurveyService],
})
export class SurveyModule {}
```

---

## 🔍 Possible Causes

### 1. Backend Not Running ⚠️
```bash
# Check if backend is running
# Should see: Server running on http://localhost:3001
```

### 2. Database Migration Not Run ⚠️
```bash
# Check if FieldSurvey table exists
npx prisma migrate status
```

### 3. API Request Failing Silently ⚠️
```javascript
// Check browser console for errors
// Network tab → Check API calls
```

### 4. Authentication Issue ⚠️
```javascript
// Check if JWT token is valid
// Check if user has FIELD_OFFICER role
```

### 5. CORS Issue ⚠️
```javascript
// Check if API URL is correct
// Check CORS configuration
```

---

## ✅ Debugging Steps

### Step 1: Check Backend Status
```bash
# Terminal 1: Check if backend is running
cd backend
npm run dev

# Should see:
# ✅ Server running on http://localhost:3001
# ✅ Database connected
```

### Step 2: Check Database
```bash
# Check if table exists
cd backend
npx prisma studio

# Navigate to FieldSurvey table
# Check if records exist
```

### Step 3: Check Frontend Console
```javascript
// Open browser DevTools (F12)
// Console tab → Look for errors

// Should see:
📋 Submitting survey data to backend...
✅ Survey submitted successfully: { id: "...", ... }

// When loading history:
✅ Loaded surveys: 1
```

### Step 4: Check Network Tab
```
// DevTools → Network tab
// Filter: XHR

// Should see:
POST /field-officer/surveys → 201 Created
GET /field-officer/surveys/my-surveys → 200 OK
```

### Step 5: Check API Response
```javascript
// Network tab → Click on request
// Response tab → Check data

// Should see:
{
  "id": "uuid",
  "fieldOfficerId": "user-id",
  "villageName": "บ้านทดสอบ",
  "disasterType": "น้ำท่วม",
  "severity": 3,
  "submittedAt": "2025-12-23T...",
  "status": "SUBMITTED"
}
```

---

## 🔧 Solutions

### Solution 1: Start Backend
```bash
cd backend
npm run dev
```

### Solution 2: Run Migrations
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### Solution 3: Check Environment Variables
```bash
# backend/.env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
PORT=3001
```

### Solution 4: Clear Cache & Restart
```bash
# Frontend
cd frontend
rm -rf node_modules/.vite
npm run dev

# Backend
cd backend
npm run dev
```

### Solution 5: Check API URL
```typescript
// frontend/.env or vite.config.ts
VITE_API_URL=http://localhost:3001/api
```

---

## 🧪 Testing Checklist

### Manual Testing
- [ ] **Start Backend**
  ```bash
  cd backend
  npm run dev
  # ✅ Server running on http://localhost:3001
  ```

- [ ] **Check Database**
  ```bash
  npx prisma studio
  # ✅ FieldSurvey table exists
  ```

- [ ] **Submit Survey**
  - [ ] Login as field officer
  - [ ] Go to "เริ่มสำรวจพื้นที่"
  - [ ] Fill form completely
  - [ ] Click "ส่งรายงาน"
  - [ ] ✅ See success alert

- [ ] **Check Console**
  - [ ] Open DevTools (F12)
  - [ ] Console tab
  - [ ] ✅ See "✅ Survey submitted successfully"
  - [ ] ✅ No errors

- [ ] **Check Network**
  - [ ] Network tab
  - [ ] ✅ POST /field-officer/surveys → 201
  - [ ] ✅ Response has survey data

- [ ] **Check History**
  - [ ] Go to "ประวัติการสำรวจ"
  - [ ] ✅ See survey in list
  - [ ] ✅ Details are correct

### Database Verification
```sql
-- Check if data was saved
SELECT * FROM field_surveys 
WHERE field_officer_id = 'your-user-id'
ORDER BY submitted_at DESC;

-- Should see recent survey
```

---

## 📊 Expected vs Actual

### Expected Flow
```
1. User fills survey form
2. Click "ส่งรายงาน"
3. Frontend: POST /field-officer/surveys
4. Backend: Save to FieldSurvey table
5. Backend: Return survey data
6. Frontend: Show success message
7. User goes to "ประวัติการสำรวจ"
8. Frontend: GET /field-officer/surveys/my-surveys
9. Backend: Query FieldSurvey table
10. Backend: Return surveys array
11. Frontend: Display surveys
```

### Actual Flow (If Bug Exists)
```
1-6. ✅ Same as expected
7. User goes to "ประวัติการสำรวจ"
8. Frontend: GET /field-officer/surveys/my-surveys
9. ❌ Backend not responding / Database empty
10. ❌ Returns empty array []
11. Frontend: Shows "ยังไม่มีประวัติการสำรวจ"
```

---

## 💡 Quick Fixes

### Fix 1: Restart Everything
```bash
# Kill all processes
# Ctrl+C on all terminals

# Start backend
cd backend
npm run dev

# Start frontend (new terminal)
cd frontend
npm run dev

# Test again
```

### Fix 2: Check Logs
```bash
# Backend logs
cd backend
npm run dev

# Watch for:
# ✅ POST /field-officer/surveys
# ✅ GET /field-officer/surveys/my-surveys
# ❌ Any errors
```

### Fix 3: Test API Directly
```bash
# Get auth token first (from browser DevTools → Application → Local Storage)
TOKEN="your-jwt-token"

# Test submit
curl -X POST http://localhost:3001/api/field-officer/surveys \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "villageName": "Test Village",
    "disasterType": "น้ำท่วม",
    "severity": 3,
    "estimatedHouseholds": 10,
    "notes": "Test",
    "gpsLocation": {"lat": 19.9, "lng": 99.9}
  }'

# Test get history
curl http://localhost:3001/api/field-officer/surveys/my-surveys \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 Status

**Investigation:** ✅ Complete  
**Root Cause:** ⏳ Pending verification  
**Most Likely:** Backend not running or Database not migrated  
**Solution:** Start backend + Run migrations  
**Testing:** ⏳ Pending user verification

---

## 🎯 Action Items

### Immediate
1. ⏳ **Start backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. ⏳ **Check if server is running**
   - Open http://localhost:3001/api
   - Should see API documentation

3. ⏳ **Test survey submission**
   - Submit a new survey
   - Check console for success message

4. ⏳ **Check history page**
   - Go to "ประวัติการสำรวจ"
   - Should see the survey

### If Still Not Working
5. ⏳ **Run database migrations**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

6. ⏳ **Check database directly**
   ```bash
   npx prisma studio
   # Check FieldSurvey table
   ```

7. ⏳ **Check logs for errors**
   - Backend console
   - Frontend console
   - Network tab

---

## 📞 Contact

**Investigated By:** Cascade AI  
**Date:** 23 ธันวาคม 2568  
**Time:** 13:18 น.

**Next Steps:**
1. Start backend server
2. Test survey submission
3. Check history page
4. Report results

---

**สถานะ:** 🔍 Investigation Complete  
**แนวทาง:** Start backend + Test  
**ต่อไป:** User verification

**กรุณาทดสอบตามขั้นตอนและแจ้งผลครับ! 🙏**
