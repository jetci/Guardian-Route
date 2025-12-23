# 🧪 Field Officer Module - Test Plan & Improvement

**วันที่:** 17 ธันวาคม 2568 เวลา 11:07 น.  
**ผู้ทดสอบ:** Cascade AI  
**สถานะ:** 🔄 กำลังทดสอบและปรับปรุง

---

## 📋 Field Officer Features Overview

### 🎯 Core Features (ฟีเจอร์หลัก)

1. **Dashboard** - แดชบอร์ดสำหรับเจ้าหน้าที่ภาคสนาม
2. **Survey Area** - สำรวจพื้นที่ประสบภัย
3. **Survey History** - ประวัติการสำรวจ
4. **My Tasks** - งานที่ได้รับมอบหมาย
5. **Create Incident** - สร้างรายงานเหตุการณ์
6. **Map Incidents** - แผนที่เหตุการณ์

---

## 🗺️ Field Officer Routes

| Route | Component | Description | Status |
|-------|-----------|-------------|--------|
| `/field-officer/dashboard` | FieldOfficerDashboard | แดชบอร์ดหลัก | ✅ |
| `/survey-area` | SurveyAreaPage | สำรวจพื้นที่ | ✅ |
| `/survey-history` | SurveyHistoryPage | ประวัติการสำรวจ | ✅ |
| `/tasks/my-tasks` | MyTasksPage | งานของฉัน | ✅ |
| `/tasks/:id` | TaskDetailPageNew | รายละเอียดงาน | ✅ |
| `/create-incident` | CreateIncidentReportPage | สร้างรายงาน | ✅ |
| `/map-incidents` | MapIncidentPage | แผนที่เหตุการณ์ | ✅ |
| `/workflow-guide` | WorkflowGuidePage | คู่มือการใช้งาน | ✅ |

---

## 🔌 API Endpoints

### Field Survey API (`/api/field-officer/surveys`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/field-officer/surveys` | Submit survey | ✅ |
| GET | `/field-officer/surveys/my-surveys` | Get my surveys | ✅ |
| GET | `/field-officer/surveys/:id` | Get survey by ID | ✅ |
| POST | `/upload/survey-images` | Upload images | ⚠️ |

### Tasks API (`/api/tasks`)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/tasks/my-tasks` | Get my tasks | ✅ |
| GET | `/tasks/:id` | Get task details | ✅ |
| PATCH | `/tasks/:id/accept` | Accept task | ✅ |
| PATCH | `/tasks/:id/complete` | Complete task | ✅ |

---

## 📝 Test Scenarios (สถานการณ์ทดสอบ)

### 1. Dashboard Testing (ทดสอบแดชบอร์ด)

#### Test Case 1.1: Load Dashboard
- **Steps:**
  1. Login as Field Officer (`field@obtwiang.go.th`)
  2. Navigate to `/field-officer/dashboard`
  3. Wait for data to load
- **Expected:**
  - ✅ Dashboard loads successfully
  - ✅ KPI cards show correct stats
  - ✅ Weather widget displays
  - ✅ Task list shows assigned tasks
  - ✅ Quick actions buttons work

#### Test Case 1.2: Dashboard Statistics
- **Steps:**
  1. Check KPI cards
  2. Verify task counts
- **Expected:**
  - ✅ My Tasks count matches API
  - ✅ Accepted Tasks count correct
  - ✅ Completed Tasks count correct
  - ✅ Reports Submitted count correct

#### Test Case 1.3: Quick Actions
- **Steps:**
  1. Click "รับงานใหม่" → Should go to `/tasks/my-tasks`
  2. Click "สำรวจพื้นที่" → Should go to `/survey-area`
  3. Click "ประวัติการสำรวจ" → Should go to `/survey-history`
  4. Click "แผนที่เหตุการณ์" → Should go to `/field-officer/map`
- **Expected:**
  - ✅ All navigation works correctly

---

### 2. Survey Area Testing (ทดสอบการสำรวจพื้นที่)

#### Test Case 2.1: Load Survey Area Page
- **Steps:**
  1. Navigate to `/survey-area`
  2. Wait for map to load
- **Expected:**
  - ✅ Map loads with village boundaries
  - ✅ Village dropdown populated
  - ✅ Drawing tools available
  - ✅ GPS button works

#### Test Case 2.2: Select Village
- **Steps:**
  1. Select village from dropdown
  2. Observe map behavior
- **Expected:**
  - ✅ Map zooms to selected village
  - ✅ Village boundary highlighted
  - ✅ Switches to satellite view
  - ✅ Village info displayed

#### Test Case 2.3: Get GPS Location
- **Steps:**
  1. Click "Get Location" button
  2. Allow location access
- **Expected:**
  - ✅ GPS coordinates displayed
  - ✅ Marker added to map
  - ✅ Success toast shown
  - ✅ Coordinates accurate

#### Test Case 2.4: Draw Survey Area
- **Steps:**
  1. Select polygon tool
  2. Draw area on map
  3. Complete polygon
- **Expected:**
  - ✅ Polygon drawn successfully
  - ✅ Area size calculated (km²)
  - ✅ Area info displayed
  - ✅ Can edit/delete polygon

#### Test Case 2.5: Fill Survey Form
- **Steps:**
  1. Select disaster type
  2. Select severity level
  3. Enter estimated households
  4. Add description
  5. Upload images (optional)
- **Expected:**
  - ✅ All fields work correctly
  - ✅ Validation works
  - ✅ Image preview shows
  - ✅ Can remove images

#### Test Case 2.6: Submit Survey
- **Steps:**
  1. Fill all required fields
  2. Click "บันทึกข้อมูลการสำรวจ"
  3. Confirm submission
- **Expected:**
  - ✅ Confirmation dialog shows
  - ✅ Data submitted to API
  - ✅ Success message displayed
  - ✅ Form resets after submit
  - ✅ Survey saved to database

---

### 3. Survey History Testing (ทดสอบประวัติการสำรวจ)

#### Test Case 3.1: Load Survey History
- **Steps:**
  1. Navigate to `/survey-history`
  2. Wait for data to load
- **Expected:**
  - ✅ List of surveys displayed
  - ✅ Sorted by date (newest first)
  - ✅ Shows survey details
  - ✅ Pagination works (if many)

#### Test Case 3.2: View Survey Details
- **Steps:**
  1. Click on a survey item
  2. View details
- **Expected:**
  - ✅ Shows full survey info
  - ✅ Shows GPS location
  - ✅ Shows images (if any)
  - ✅ Shows village info
  - ✅ Shows submission date

#### Test Case 3.3: Filter Surveys
- **Steps:**
  1. Use filters (if available)
  2. Filter by date/village/type
- **Expected:**
  - ✅ Filters work correctly
  - ✅ Results update immediately

---

### 4. Task Management Testing (ทดสอบการจัดการงาน)

#### Test Case 4.1: View My Tasks
- **Steps:**
  1. Navigate to `/tasks/my-tasks`
  2. View task list
- **Expected:**
  - ✅ Shows assigned tasks
  - ✅ Shows task status
  - ✅ Shows priority
  - ✅ Shows due date
  - ✅ Shows village

#### Test Case 4.2: Accept Task
- **Steps:**
  1. Click on pending task
  2. Click "Accept Task"
- **Expected:**
  - ✅ Task status changes to IN_PROGRESS
  - ✅ Success message shown
  - ✅ Task appears in accepted list

#### Test Case 4.3: View Task Details
- **Steps:**
  1. Click on task
  2. View details page
- **Expected:**
  - ✅ Shows full task info
  - ✅ Shows location on map
  - ✅ Shows assigned by
  - ✅ Shows deadline
  - ✅ Action buttons available

#### Test Case 4.4: Complete Task
- **Steps:**
  1. Open task details
  2. Click "Complete Task"
  3. Add completion notes
  4. Submit
- **Expected:**
  - ✅ Completion form shows
  - ✅ Can add notes/photos
  - ✅ Task marked as COMPLETED
  - ✅ Supervisor notified

---

### 5. Mobile Responsiveness Testing (ทดสอบ Mobile)

#### Test Case 5.1: Mobile Dashboard
- **Device:** iPhone/Android
- **Steps:**
  1. Open dashboard on mobile
  2. Test all features
- **Expected:**
  - ✅ Layout responsive
  - ✅ KPI cards stack vertically
  - ✅ Touch interactions work
  - ✅ Navigation menu accessible

#### Test Case 5.2: Mobile Map
- **Device:** iPhone/Android
- **Steps:**
  1. Open survey area on mobile
  2. Test map interactions
- **Expected:**
  - ✅ Map loads correctly
  - ✅ Touch zoom/pan works
  - ✅ Drawing tools accessible
  - ✅ GPS works on mobile
  - ✅ Form inputs work

#### Test Case 5.3: Mobile Forms
- **Device:** iPhone/Android
- **Steps:**
  1. Fill survey form on mobile
  2. Upload photos from camera
- **Expected:**
  - ✅ Form fields accessible
  - ✅ Dropdowns work
  - ✅ Camera upload works
  - ✅ Submit works

---

## 🐛 Known Issues & Improvements

### 🔴 Critical Issues
- [ ] **Image Upload API** - Need to verify `/upload/survey-images` endpoint exists
- [ ] **GPS Accuracy** - Test GPS accuracy in different locations
- [ ] **Offline Mode** - No offline support yet

### 🟡 Medium Priority
- [ ] **Map Performance** - Optimize for many village boundaries
- [ ] **Image Compression** - Compress images before upload
- [ ] **Form Validation** - Add more detailed validation messages
- [ ] **Error Handling** - Better error messages for network failures

### 🟢 Low Priority / Enhancements
- [ ] **Dark Mode** - Add dark mode support
- [ ] **Export Survey** - Export survey data as PDF/Excel
- [ ] **Offline Cache** - Cache survey data for offline viewing
- [ ] **Voice Notes** - Add voice note recording
- [ ] **Barcode Scanner** - Scan QR codes for quick village selection

---

## 🎯 Test Execution Plan

### Phase 1: Basic Functionality (30 min)
- [ ] Login as Field Officer
- [ ] Test Dashboard loading
- [ ] Test navigation between pages
- [ ] Test API connectivity

### Phase 2: Survey Workflow (45 min)
- [ ] Test Survey Area page
- [ ] Test village selection
- [ ] Test GPS location
- [ ] Test drawing tools
- [ ] Test form submission
- [ ] Test survey history

### Phase 3: Task Management (30 min)
- [ ] Test My Tasks page
- [ ] Test task acceptance
- [ ] Test task completion
- [ ] Test task details

### Phase 4: Mobile Testing (30 min)
- [ ] Test on iPhone
- [ ] Test on Android
- [ ] Test all core features
- [ ] Test touch interactions

### Phase 5: Edge Cases (30 min)
- [ ] Test without GPS
- [ ] Test with slow network
- [ ] Test with large images
- [ ] Test form validation
- [ ] Test error scenarios

**Total Estimated Time:** 2.5 - 3 hours

---

## 📊 Success Criteria

### Must Have (ต้องผ่าน)
- ✅ Dashboard loads without errors
- ✅ Can view assigned tasks
- ✅ Can submit survey successfully
- ✅ GPS location works
- ✅ Map drawing tools work
- ✅ Form validation works
- ✅ Data saves to database

### Should Have (ควรผ่าน)
- ✅ Mobile responsive
- ✅ Fast page load (<3s)
- ✅ Image upload works
- ✅ Survey history displays
- ✅ Task status updates
- ✅ Error messages clear

### Nice to Have (ดีถ้าผ่าน)
- ⏳ Offline mode
- ⏳ Export features
- ⏳ Voice notes
- ⏳ Dark mode

---

## 🚀 Next Steps

1. **Start Testing** - Begin with Phase 1
2. **Document Issues** - Record all bugs found
3. **Fix Critical Issues** - Address blockers first
4. **Improve UX** - Enhance user experience
5. **Optimize Performance** - Speed improvements
6. **Add Features** - Implement enhancements

---

## 📝 Test Results Log

### Test Session 1: [Date/Time]
- **Tester:** 
- **Duration:** 
- **Tests Passed:** 
- **Tests Failed:** 
- **Issues Found:** 
- **Notes:** 

---

**Status:** 🔄 Ready to Start Testing

**Test Account:**
- Email: `field@obtwiang.go.th`
- Password: `password123`
- Role: FIELD_OFFICER

**Test Environment:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Database: PostgreSQL (localhost:5432)
