# 🧪 Field Officer API Testing Guide

**Base URL:** `http://localhost:3001/api`  
**Authentication:** JWT Bearer Token

---

## 1. Login & Get Token

### Request
```http
POST /auth/login
Content-Type: application/json; charset=utf-8

{
  "email": "field@obtwiang.go.th",
  "password": "password123"
}
```

### Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "field@obtwiang.go.th",
    "role": "FIELD_OFFICER",
    "firstName": "Somsri",
    "lastName": "Field"
  }
}
```

**📝 Copy the `access_token` for next requests**

---

## 2. Get My Surveys

### Request
```http
GET /field-officer/surveys/my-surveys
Authorization: Bearer {your_token}
Accept: application/json; charset=utf-8
```

### Expected Response
```json
[
  {
    "id": "uuid",
    "fieldOfficerId": "uuid",
    "taskId": "uuid",
    "incidentId": "uuid",
    "villageId": "uuid",
    "villageName": "ต้นหนุน",
    "disasterType": "ไฟไหม้",
    "severity": 3,
    "estimatedHouseholds": 45,
    "notes": "สำรวจพื้นที่...",
    "gpsLocation": {
      "lat": 19.9167,
      "lng": 99.2333,
      "accuracy": 15.5
    },
    "photoUrls": [],
    "polygon": null,
    "areaSize": null,
    "submittedAt": "2025-12-23T02:45:28.000Z",
    "status": "SUBMITTED"
  }
]
```

**✅ Success:** Should return 8 surveys  
**✅ Thai Text:** Should display correctly (ต้นหนุน, ไฟไหม้)

---

## 3. Submit New Survey

### Request
```http
POST /field-officer/surveys
Authorization: Bearer {your_token}
Content-Type: application/json; charset=utf-8

{
  "villageName": "บ้านทดสอบ",
  "disasterType": "น้ำท่วม",
  "severity": 4,
  "estimatedHouseholds": 30,
  "notes": "พื้นที่น้ำท่วมขัง ระดับน้ำประมาณ 60 ซม. ต้องการความช่วยเหลือเร่งด่วน",
  "gpsLocation": {
    "lat": 19.9167,
    "lng": 99.2333,
    "accuracy": 10
  },
  "polygon": {
    "type": "Polygon",
    "coordinates": [
      [
        [99.2333, 19.9167],
        [99.2343, 19.9167],
        [99.2343, 19.9157],
        [99.2333, 19.9157],
        [99.2333, 19.9167]
      ]
    ]
  },
  "areaSize": 1.5
}
```

### Expected Response
```json
{
  "id": "new-uuid",
  "fieldOfficerId": "uuid",
  "villageName": "บ้านทดสอบ",
  "disasterType": "น้ำท่วม",
  "severity": 4,
  "estimatedHouseholds": 30,
  "status": "SUBMITTED",
  "submittedAt": "2025-12-23T..."
}
```

**✅ Success:** Status 201 Created  
**✅ Thai Text:** Should save and return correctly

---

## 4. Submit Survey with Village Auto-Match

### Request (without villageId)
```http
POST /field-officer/surveys
Authorization: Bearer {your_token}
Content-Type: application/json; charset=utf-8

{
  "villageName": "สวนดอก",
  "disasterType": "ดินถล่ม",
  "severity": 5,
  "estimatedHouseholds": 20,
  "notes": "ดินถล่มบริเวณเชิงเขา ต้องการอพยพประชาชน",
  "gpsLocation": {
    "lat": 19.92,
    "lng": 99.24
  }
}
```

### Expected Behavior
- ✅ System auto-matches "สวนดอก" to existing village
- ✅ villageId populated automatically
- ✅ Survey created successfully

---

## 5. Get My Tasks

### Request
```http
GET /tasks/my-tasks
Authorization: Bearer {your_token}
```

### Expected Response
```json
[
  {
    "id": "uuid",
    "title": "สำรวจพื้นที่ - สวนดอก",
    "description": "สำรวจความเสียหาย...",
    "status": "PENDING",
    "priority": "HIGH",
    "dueDate": "2025-12-30T...",
    "assignedToId": "uuid",
    "incidentId": "uuid",
    "villageId": "uuid"
  }
]
```

**✅ Success:** Should return 13 tasks

---

## 6. Get My Incidents

### Request
```http
GET /incidents/my
Authorization: Bearer {your_token}
```

### Expected Response
```json
[
  {
    "id": "uuid",
    "title": "น้ำท่วม - สวนดอก",
    "description": "เหตุการณ์น้ำท่วม...",
    "status": "PENDING",
    "priority": "MEDIUM",
    "disasterType": "FLOOD",
    "location": {
      "type": "Point",
      "coordinates": [99.2333, 19.9167]
    },
    "address": "สวนดอก หมู่ 1...",
    "createdById": "uuid",
    "villageId": "uuid"
  }
]
```

**✅ Success:** Should return 11 incidents

---

## 7. Upload Survey Images

### Request
```http
POST /upload/survey-images
Authorization: Bearer {your_token}
Content-Type: multipart/form-data

images: [file1.jpg, file2.jpg, file3.jpg]
```

### Expected Response
```json
{
  "urls": [
    "http://localhost:3001/uploads/surveys/uuid-1.jpg",
    "http://localhost:3001/uploads/surveys/uuid-2.jpg",
    "http://localhost:3001/uploads/surveys/uuid-3.jpg"
  ],
  "count": 3,
  "message": "3 survey images uploaded successfully"
}
```

**✅ Success:** Returns array of URLs  
**✅ Limit:** Max 10 images

---

## 8. Get Specific Survey

### Request
```http
GET /field-officer/surveys/{surveyId}
Authorization: Bearer {your_token}
```

### Expected Response
```json
{
  "id": "uuid",
  "fieldOfficerId": "uuid",
  "villageName": "ต้นหนุน",
  "disasterType": "ไฟไหม้",
  "severity": 3,
  "estimatedHouseholds": 45,
  "notes": "...",
  "gpsLocation": {...},
  "status": "SUBMITTED",
  "submittedAt": "..."
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Happy Path
1. ✅ Login → Get token
2. ✅ Get my surveys → See 8 surveys
3. ✅ Submit new survey → Success
4. ✅ Get my surveys again → See 9 surveys

### Scenario 2: Village Auto-Match
1. ✅ Submit survey with villageName only
2. ✅ System finds matching village
3. ✅ villageId populated automatically
4. ✅ Survey created successfully

### Scenario 3: With Polygon
1. ✅ Submit survey with polygon data
2. ✅ Include areaSize
3. ✅ Polygon saved correctly
4. ✅ Can retrieve polygon data

### Scenario 4: Thai Language
1. ✅ Submit survey with Thai text
2. ✅ Thai text saved correctly
3. ✅ Thai text retrieved correctly
4. ✅ No encoding issues

### Scenario 5: GPS Data
1. ✅ Submit with GPS coordinates
2. ✅ Include accuracy and altitude
3. ✅ GPS data saved correctly
4. ✅ Can retrieve GPS data

---

## ❌ Error Cases to Test

### 1. Invalid Token
```http
GET /field-officer/surveys/my-surveys
Authorization: Bearer invalid_token
```
**Expected:** 401 Unauthorized

### 2. Missing Required Fields
```http
POST /field-officer/surveys
{
  "villageName": "Test"
  // Missing other required fields
}
```
**Expected:** 400 Bad Request with validation errors

### 3. Invalid Severity
```http
POST /field-officer/surveys
{
  "severity": 10  // Should be 1-5
}
```
**Expected:** 400 Bad Request

### 4. Unauthorized Access
```http
GET /field-officer/surveys/{other_user_survey_id}
```
**Expected:** 403 Forbidden or 404 Not Found

---

## 📊 Performance Testing

### Response Time Targets
- Login: < 500ms
- Get Surveys: < 300ms
- Submit Survey: < 800ms
- Upload Images: < 2s per image

### Load Testing
```bash
# Use Apache Bench or similar
ab -n 100 -c 10 -H "Authorization: Bearer {token}" \
   http://localhost:3001/api/field-officer/surveys/my-surveys
```

---

## ✅ Acceptance Criteria

### Functional
- [ ] Can login successfully
- [ ] Can get list of surveys
- [ ] Can submit new survey
- [ ] Can submit with optional villageId
- [ ] Can submit with polygon
- [ ] Can upload images
- [ ] Thai text works correctly

### Non-Functional
- [ ] Response times acceptable
- [ ] No memory leaks
- [ ] No console errors
- [ ] UTF-8 encoding works
- [ ] Authentication enforced
- [ ] Authorization enforced

---

## 🐛 Known Issues

1. **Prisma Client Generation:** May need manual restart if schema changes
2. **File Upload:** Ensure uploads directory exists
3. **CORS:** Frontend must be on allowed origins

---

## 📝 Notes

- All timestamps in UTC
- Use charset=utf-8 for Thai language
- Max 10 images per survey
- Polygon must be valid GeoJSON
- Severity must be 1-5

---

**Status:** ✅ Ready for Testing  
**Backend:** http://localhost:3001  
**Swagger Docs:** http://localhost:3001/api/docs
