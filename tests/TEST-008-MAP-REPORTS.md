# 🧪 Test Report: Map & Reports

**วันที่**: 29 พฤศจิกายน 2568  
**ผู้ทดสอบ**: Team W  
**Browser**: Chrome 120+  
**Screen Size**: 1920x1080

---

## 📋 Menu Information

**Menu Name**: แผนที่และรายงาน (Map & Reports)  
**Path**: `/supervisor/map`  
**Component**: `MapReportsPage`  
**Access Role**: SUPERVISOR, EXECUTIVE  
**Priority**: 🔴 Critical

---

## 📝 Test Objectives

1. ตรวจสอบ Interactive Map แสดงและทำงานได้
2. ตรวจสอบ Incident Markers แสดงถูกต้อง
3. ตรวจสอบ Layer Controls (Incidents, Tasks, Villages, Weather)
4. ตรวจสอบ Filter & Search บน map
5. ตรวจสอบ Report Generation
6. ตรวจสอบ Export functionality

---

## ✅ UI/UX Testing Checklist

### 1. Page Load & Layout
- [ ] หน้า UI โหลดได้
- [ ] Header "🗺️ แผนที่และรายงาน" แสดงถูกต้อง
- [ ] Map loads successfully
- [ ] Sidebar แสดงถูกต้อง
- [ ] Layer controls แสดงถูกต้อง

**Expected Layout**:
- Left sidebar: Filters & Legend
- Center: Interactive map
- Right sidebar: Details panel (when item selected)

**Status**: ⚪ Not Tested Yet

---

### 2. Map Functionality
- [ ] Map renders correctly (Leaflet/Google Maps)
- [ ] Default center: ตำบลเวียง (19.9167, 99.8833)
- [ ] Default zoom: 13
- [ ] Zoom controls ทำงานได้
- [ ] Pan/drag ทำงานได้
- [ ] Fullscreen mode ทำงานได้
- [ ] Geolocation button ทำงานได้

**Status**: ⚪ Not Tested Yet

---

### 3. Incident Markers
- [ ] Incidents แสดงเป็น markers บน map
- [ ] Marker colors แสดง severity:
  - 🔴 Critical
  - 🟡 High
  - 🟢 Medium
  - ⚪ Low
- [ ] Marker icons แสดง incident type:
  - 💧 Flood
  - 🔥 Fire
  - ⛰️ Landslide
  - 🌪️ Storm
- [ ] Click marker แสดง popup
- [ ] Popup มีข้อมูลครบถ้วน
- [ ] Click "View Details" navigate ถูกต้อง

**Status**: ⚪ Not Tested Yet

---

### 4. Task Markers
- [ ] Tasks แสดงเป็น markers บน map
- [ ] Marker colors แสดง status:
  - 🔵 Pending
  - 🟠 In Progress
  - 🟢 Completed
- [ ] Click marker แสดง popup
- [ ] Popup แสดง:
  - Task title
  - Assigned to
  - Due date
  - Status
- [ ] Click "View Task" navigate ถูกต้อง

**Status**: ⚪ Not Tested Yet

---

### 5. Village Boundaries
- [ ] Village boundaries แสดงบน map
- [ ] Boundaries แสดงเป็น polygons
- [ ] แต่ละหมู่บ้านมีสีต่างกัน
- [ ] Click boundary แสดง popup
- [ ] Popup แสดง:
  - หมู่ที่
  - ชื่อหมู่บ้าน
  - จำนวน incidents
  - จำนวน tasks
- [ ] Hover แสดง highlight

**Status**: ⚪ Not Tested Yet

---

### 6. Weather Radar (ถ้ามี)
- [ ] Toggle "Weather Radar" แสดง
- [ ] เปิด/ปิด weather overlay ได้
- [ ] Weather data แสดงถูกต้อง
- [ ] Auto-refresh (if real-time)

**Status**: ⚪ Not Tested Yet

---

### 7. Layer Controls
- [ ] Checkbox "Incidents" toggle ทำงานได้
- [ ] Checkbox "Tasks" toggle ทำงานได้
- [ ] Checkbox "Villages" toggle ทำงานได้
- [ ] Checkbox "Weather" toggle ทำงานได้
- [ ] Checkbox "Heatmap" toggle ทำงานได้ (ถ้ามี)
- [ ] Layer visibility updates immediately

**Status**: ⚪ Not Tested Yet

---

### 8. Filters
- [ ] Filter by incident type ทำงานได้
- [ ] Filter by severity ทำงานได้
- [ ] Filter by status ทำงานได้
- [ ] Filter by date range ทำงานได้
- [ ] Filter by village ทำงานได้
- [ ] Multiple filters work together
- [ ] Clear all filters ทำงานได้

**Status**: ⚪ Not Tested Yet

---

### 9. Search
- [ ] Search bar แสดง
- [ ] Search by incident ID ทำงานได้
- [ ] Search by location ทำงานได้
- [ ] Search results แสดงบน map
- [ ] Click result zoom to location

**Status**: ⚪ Not Tested Yet

---

### 10. Clustering (ถ้ามี)
- [ ] Markers cluster เมื่อ zoom out
- [ ] Cluster แสดงจำนวน items
- [ ] Click cluster zoom in
- [ ] Markers แยกเมื่อ zoom in

**Status**: ⚪ Not Tested Yet

---

### 11. Report Generation
- [ ] ปุ่ม "Generate Report" แสดง
- [ ] เลือก report type:
  - Incident Summary
  - Task Performance
  - Village Statistics
  - Custom Report
- [ ] เลือก date range ได้
- [ ] เลือก format: PDF, Excel, CSV
- [ ] Generate report สำเร็จ
- [ ] Download report ทำงานได้

**Status**: ⚪ Not Tested Yet

---

### 12. Export Map
- [ ] ปุ่ม "Export Map" แสดง
- [ ] Export as PNG ทำงานได้
- [ ] Export as PDF ทำงานได้
- [ ] Export includes legend
- [ ] Export quality good

**Status**: ⚪ Not Tested Yet

---

### 13. Responsive Design
- [ ] Desktop (1920x1080) - ✅ / ❌
- [ ] Laptop (1366x768) - ✅ / ❌
- [ ] Tablet (768x1024) - ✅ / ❌
- [ ] Mobile (375x667) - ✅ / ❌

**Status**: ⚪ Not Tested Yet

---

## 🔌 API Testing Checklist

### Expected API Calls:

1. **GET /api/incidents?includeLocation=true** - Incidents with location
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Incidents with lat/lng returned

2. **GET /api/tasks?includeLocation=true** - Tasks with location
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Tasks with lat/lng returned

3. **GET /api/villages** - Village boundaries
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Villages with GeoJSON returned

4. **GET /api/weather/radar** - Weather data (ถ้ามี)
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Weather data returned

5. **POST /api/reports/generate** - Generate report
   - [ ] Request with parameters
   - [ ] Response status: 200 OK
   - [ ] Report file returned

**Status**: ⚪ Not Tested Yet

---

## 🎯 Test Scenarios

### Scenario 1: View All Incidents on Map
1. Navigate to Map & Reports
2. Verify all incidents show as markers
3. Verify marker colors match severity
4. Click a critical incident marker
5. Verify popup shows correct info

**Expected**: All incidents visible on map

---

### Scenario 2: Filter Critical Incidents
1. Select filter: Severity = CRITICAL
2. Verify only critical incidents shown
3. Verify marker count matches filter

**Expected**: Only critical incidents visible

---

### Scenario 3: Generate Incident Summary Report
1. Click "Generate Report"
2. Select "Incident Summary"
3. Select date range: Last 30 days
4. Select format: PDF
5. Click "Generate"
6. Download report
7. Open PDF and verify content

**Expected**: PDF report generated with correct data

---

### Scenario 4: Toggle Layers
1. Uncheck "Tasks" layer
2. Verify task markers disappear
3. Check "Tasks" layer again
4. Verify task markers reappear

**Expected**: Layer toggle works correctly

---

### Scenario 5: Export Map as Image
1. Click "Export Map"
2. Select PNG format
3. Download image
4. Verify image quality and content

**Expected**: Map exported as PNG

---

## 📸 Screenshots

### Screenshot 1: Map Overview
```
[แนบ screenshot ของ map with all layers]
```

### Screenshot 2: Incident Markers
```
[แนบ screenshot ของ incident markers with popup]
```

### Screenshot 3: Village Boundaries
```
[แนบ screenshot ของ village polygons]
```

### Screenshot 4: Layer Controls
```
[แนบ screenshot ของ layer control panel]
```

### Screenshot 5: Report Generation
```
[แนบ screenshot ของ report generation dialog]
```

### Screenshot 6: Generated Report
```
[แนบ screenshot ของ PDF report]
```

---

## 🐛 Bugs Found

### Bug #1: [ถ้าพบ]
**Severity**: 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low

**Description**:
```
[รายละเอียด]
```

---

## 📈 Overall Assessment

**UI Status**: ⚪ Not Tested Yet  
**API Status**: ⚪ Not Tested Yet  
**Priority**: 🔴 Critical  
**Estimate to Fix**: TBD

### Critical Features:
- ✅ Map must load and be interactive
- ✅ Markers must show correct data
- ✅ Filters must work
- ✅ Report generation must work

---

## ✅ Sign-off

**Tested by**: _______________  
**Date**: _______________  
**Status**: [ ] PASS  [ ] FAIL  [ ] PARTIAL

---

**Status**: 🟡 Ready to Test  
**Created**: 29 พฤศจิกายน 2568 12:35 น.
