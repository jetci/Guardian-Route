# Supervisor Module - Extended Testing Guide

**Project:** Guardian Route - Disaster Management System  
**Module:** Supervisor Module  
**Version:** 1.1.0  
**Last Updated:** November 9, 2025  
**Status:** Extended per SA Requirements (SA-002, SA-004, SA-005)

---

## 📋 Overview

เอกสารนี้เป็นส่วนเพิ่มเติมจาก SUPERVISOR_MODULE_TESTING.md ตามคำสั่งของ SA เพื่อครอบคลุม:
- Mobile Breakpoint Testing (SA-002)
- Performance Testing (SA-004)
- Accessibility Testing (SA-005)
- Regression Testing Checklist

---

## 📱 Mobile Breakpoint Testing (SA-002)

### Test Case 7: Mobile Responsive Design

**Objective:** ทดสอบการแสดงผล Modals บนหน้าจอขนาดเล็ก

**Test Devices:**
- Mobile (< 480px)
- Tablet (480px - 768px)
- Desktop (> 768px)

**Test Steps:**

#### 7.1 AssignIncidentModal - Mobile (< 480px)

1. **Setup**
   - เปิด Chrome DevTools
   - เลือก Device: iPhone SE (375x667)
   - Navigate to Supervisor Dashboard

2. **Open Modal**
   - คลิกปุ่ม "มอบหมาย"
   - ✅ Modal เปิดขึ้นและไม่ล้นจอ
   - ✅ Modal width = 90vw หรือ max-width: 400px
   - ✅ Modal ไม่มี horizontal scroll

3. **Check Touch Targets**
   - ตรวจสอบขนาดปุ่มทั้งหมด
   - ✅ ปุ่ม "มอบหมาย" ≥ 44px height
   - ✅ ปุ่ม "ยกเลิก" ≥ 44px height
   - ✅ Close button (X) ≥ 44px x 44px
   - ✅ Dropdown ≥ 44px height
   - ✅ ระยะห่างระหว่างปุ่ม ≥ 8px

4. **Check Form Elements**
   - ✅ Dropdown แสดงผลเต็มความกว้าง
   - ✅ Textarea มีความสูงเพียงพอ (min 80px)
   - ✅ Font size ≥ 16px (ป้องกัน auto-zoom บน iOS)
   - ✅ Label ชัดเจน อ่านง่าย

5. **Check Toast Notifications**
   - Submit form
   - ✅ Toast แสดงอยู่ใน viewport
   - ✅ Toast ไม่บังปุ่มสำคัญ
   - ✅ Toast position: top-center หรือ bottom-center
   - ✅ Toast width ไม่เกิน 90vw

6. **Check Validation Messages**
   - Submit without selecting officer
   - ✅ Validation message แสดงใน viewport
   - ✅ Message ไม่ล้นจอ
   - ✅ Message color contrast ≥ 4.5:1

#### 7.2 ReviewIncidentModal - Mobile (< 480px)

1. **Setup**
   - Device: iPhone SE (375x667)
   - Navigate to Supervisor Dashboard

2. **Open Modal**
   - คลิกปุ่ม "ตรวจสอบ"
   - ✅ Modal เปิดขึ้นและไม่ล้นจอ
   - ✅ Scrollable content ทำงานได้
   - ✅ Header sticky อยู่ด้านบน

3. **Check Touch Targets**
   - ✅ Radio buttons ≥ 44px x 44px
   - ✅ ปุ่ม "อนุมัติ" ≥ 44px height
   - ✅ ปุ่ม "ปฏิเสธ" ≥ 44px height
   - ✅ ปุ่ม "ยกเลิก" ≥ 44px height

4. **Check Incident Details Display**
   - ✅ Title ไม่ล้นจอ (word-wrap)
   - ✅ Description ไม่ล้นจอ
   - ✅ Badges แสดงผลถูกต้อง
   - ✅ Font size เหมาะสม (≥ 14px)

5. **Check Form Scrolling**
   - Scroll ภายใน modal
   - ✅ Scroll ทำงานได้ smooth
   - ✅ Footer buttons sticky อยู่ด้านล่าง
   - ✅ ไม่มี scroll conflict กับ body

#### 7.3 Tablet Testing (480px - 768px)

1. **Setup**
   - Device: iPad Mini (768x1024)

2. **Test Both Modals**
   - ✅ Modal width = 600px หรือ 80vw
   - ✅ Layout เปลี่ยนเป็น 2 columns (ถ้ามี)
   - ✅ Touch targets ยังคง ≥ 44px
   - ✅ Spacing เพิ่มขึ้นเหมาะสม

#### 7.4 Landscape Orientation

1. **Setup**
   - Rotate device to landscape

2. **Test Modals**
   - ✅ Modal ไม่สูงเกินจอ
   - ✅ Scrollable ถ้าจำเป็น
   - ✅ Buttons อยู่ใน viewport
   - ✅ ไม่มี layout break

**Expected Results:**
- ✅ Modals responsive บนทุก breakpoint
- ✅ Touch targets ≥ 44px
- ✅ ไม่มี horizontal scroll
- ✅ Toast/Validation อยู่ใน viewport
- ✅ Font size เหมาะสม (≥ 16px for inputs)

---

## ⚡ Performance Testing (SA-004)

### Test Case 8: Load Time Performance

**Objective:** ทดสอบประสิทธิภาพการโหลดข้อมูล

**Tools:**
- Chrome DevTools (Lighthouse)
- Network tab
- Performance tab

**Test Scenarios:**

#### 8.1 Initial Page Load

1. **Setup**
   - Clear cache
   - Open Chrome DevTools
   - Navigate to Supervisor Dashboard

2. **Measure**
   - ✅ First Contentful Paint (FCP) < 1.5s
   - ✅ Largest Contentful Paint (LCP) < 2.5s
   - ✅ Time to Interactive (TTI) < 3.5s
   - ✅ Total Blocking Time (TBT) < 300ms
   - ✅ Cumulative Layout Shift (CLS) < 0.1

#### 8.2 Load Incidents List (50+ items)

1. **Setup**
   - Seed database with 50+ incidents
   - Clear cache
   - Navigate to dashboard

2. **Measure API Response**
   - ✅ GET /incidents/unassigned < 500ms
   - ✅ Response size < 100KB
   - ✅ No N+1 queries

3. **Measure Rendering**
   - ✅ List render time < 200ms
   - ✅ Scroll performance ≥ 60fps
   - ✅ No janky animations

#### 8.3 Modal Open Performance

1. **Test AssignIncidentModal**
   - Click "มอบหมาย" button
   - ✅ Modal opens < 100ms
   - ✅ Field Officers loaded < 300ms
   - ✅ No layout shift

2. **Test ReviewIncidentModal**
   - Click "ตรวจสอบ" button
   - ✅ Modal opens < 100ms
   - ✅ Incident details rendered < 50ms

#### 8.4 Form Submission Performance

1. **Test Assign**
   - Submit assignment
   - ✅ API response < 500ms
   - ✅ Toast appears < 100ms
   - ✅ List refresh < 500ms

2. **Test Review**
   - Submit review
   - ✅ API response < 500ms
   - ✅ Toast appears < 100ms
   - ✅ List refresh < 500ms

#### 8.5 Lighthouse Score

1. **Run Lighthouse**
   - Open DevTools > Lighthouse
   - Select "Desktop" or "Mobile"
   - Run audit

2. **Target Scores**
   - ✅ Performance ≥ 90
   - ✅ Accessibility ≥ 90
   - ✅ Best Practices ≥ 90
   - ✅ SEO ≥ 80

**Performance Optimization Tips:**
- Use React.memo for list items
- Implement virtual scrolling for 100+ items
- Lazy load modals
- Optimize images (WebP, lazy loading)
- Use code splitting
- Enable gzip/brotli compression
- Use CDN for static assets

**Expected Results:**
- ✅ Page load < 2s
- ✅ API responses < 500ms
- ✅ Smooth 60fps scrolling
- ✅ Lighthouse score ≥ 90

---

## ♿ Accessibility Testing (SA-005)

### Test Case 9: Accessibility Compliance

**Objective:** ทดสอบการเข้าถึงสำหรับผู้พิการ

**Tools:**
- Chrome Lighthouse
- axe DevTools
- NVDA/JAWS (Screen readers)
- Keyboard only

**Standards:**
- WCAG 2.1 Level AA

**Test Steps:**

#### 9.1 Keyboard Navigation

1. **Test Tab Order**
   - Press Tab key
   - ✅ Focus order logical (top to bottom, left to right)
   - ✅ All interactive elements focusable
   - ✅ Focus indicator visible (outline ≥ 2px)
   - ✅ No keyboard traps

2. **Test Modal Navigation**
   - Open AssignIncidentModal
   - ✅ Focus trapped in modal
   - ✅ Tab cycles through modal elements
   - ✅ Shift+Tab works backward
   - ✅ Escape closes modal

3. **Test Form Submission**
   - ✅ Enter submits form
   - ✅ Space toggles radio buttons
   - ✅ Arrow keys navigate radio group

#### 9.2 Screen Reader Testing

1. **Test with NVDA/JAWS**
   - Navigate to dashboard
   - ✅ Page title announced
   - ✅ Headings announced correctly
   - ✅ Buttons have accessible names
   - ✅ Form labels associated with inputs

2. **Test AssignIncidentModal**
   - Open modal
   - ✅ Modal title announced
   - ✅ Dropdown label announced
   - ✅ Required fields announced
   - ✅ Error messages announced

3. **Test ReviewIncidentModal**
   - Open modal
   - ✅ Incident details announced
   - ✅ Radio group announced
   - ✅ Form instructions clear

#### 9.3 Color Contrast

1. **Test Text Contrast**
   - ✅ Body text: ≥ 4.5:1
   - ✅ Large text (≥ 18pt): ≥ 3:1
   - ✅ UI components: ≥ 3:1
   - ✅ Focus indicators: ≥ 3:1

2. **Test Button Colors**
   - ✅ "มอบหมาย" (green): ≥ 4.5:1
   - ✅ "ตรวจสอบ" (purple): ≥ 4.5:1
   - ✅ "อนุมัติ" (green): ≥ 4.5:1
   - ✅ "ปฏิเสธ" (red): ≥ 4.5:1

#### 9.4 ARIA Attributes

1. **Check Modal ARIA**
   - ✅ role="dialog"
   - ✅ aria-modal="true"
   - ✅ aria-labelledby points to title
   - ✅ aria-describedby points to description

2. **Check Form ARIA**
   - ✅ aria-required on required fields
   - ✅ aria-invalid on error fields
   - ✅ aria-describedby for error messages

3. **Check Button ARIA**
   - ✅ aria-label for icon buttons
   - ✅ aria-expanded for dropdowns
   - ✅ aria-pressed for toggle buttons

#### 9.5 Lighthouse Accessibility Audit

1. **Run Audit**
   - Open DevTools > Lighthouse
   - Select "Accessibility"
   - Run audit

2. **Check Results**
   - ✅ Score ≥ 90
   - ✅ No critical issues
   - ✅ All images have alt text
   - ✅ All forms have labels

#### 9.6 axe DevTools Scan

1. **Install axe DevTools**
   - Chrome extension

2. **Run Scan**
   - Click "Scan ALL of my page"
   - ✅ 0 critical issues
   - ✅ 0 serious issues
   - ✅ Minor issues documented

**Expected Results:**
- ✅ WCAG 2.1 Level AA compliant
- ✅ Keyboard navigable
- ✅ Screen reader compatible
- ✅ Color contrast ≥ 4.5:1
- ✅ ARIA attributes correct
- ✅ Lighthouse accessibility ≥ 90

---

## 🔄 Regression Testing Checklist

### Purpose
ใช้ทดสอบหลังจาก refactor, bug fix, หรือ deployment ใหม่

### Checklist

#### Core Functionality
- [ ] Login as SUPERVISOR
- [ ] View incidents list
- [ ] Filter incidents (status, priority, type)
- [ ] Search incidents
- [ ] View incident details

#### Assign Functionality
- [ ] Open Assign Modal
- [ ] Load Field Officers
- [ ] Select Field Officer
- [ ] Add notes
- [ ] Submit assignment
- [ ] Verify assignment in database
- [ ] Verify ActivityLog entry

#### Review Functionality
- [ ] Open Review Modal
- [ ] View incident details
- [ ] Select Approve
- [ ] Enter review notes
- [ ] Submit review
- [ ] Verify status change to INVESTIGATING
- [ ] Select Reject
- [ ] Submit review
- [ ] Verify status change to REJECTED
- [ ] Verify ActivityLog entry

#### Role-Based Access
- [ ] Login as FIELD_OFFICER
- [ ] Verify no Assign/Review buttons
- [ ] Verify API 403 on supervisor endpoints
- [ ] Login as SUPERVISOR
- [ ] Verify Assign/Review buttons visible
- [ ] Login as ADMIN
- [ ] Verify full access

#### UI/UX
- [ ] Toast notifications appear
- [ ] Loading states work
- [ ] Validation messages show
- [ ] Error handling works
- [ ] Modals open/close smoothly
- [ ] List refreshes after actions

#### Performance
- [ ] Page load < 2s
- [ ] API responses < 500ms
- [ ] Smooth scrolling
- [ ] No console errors

#### Mobile
- [ ] Responsive on mobile
- [ ] Touch targets ≥ 44px
- [ ] No horizontal scroll
- [ ] Toast in viewport

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Color contrast ≥ 4.5:1

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## 📊 Test Coverage Report Template

### Backend Coverage

```
=============================== Coverage summary ===============================
Statements   : 85.5% ( 234/274 )
Branches     : 78.2% ( 89/114 )
Functions    : 82.1% ( 46/56 )
Lines        : 86.3% ( 219/254 )
================================================================================

File                                    | % Stmts | % Branch | % Funcs | % Lines
----------------------------------------|---------|----------|---------|--------
incidents/incidents.controller.ts       |   92.5  |   85.7   |   100   |   93.2
incidents/incidents.service.ts          |   88.3  |   81.2   |   87.5  |   89.1
common/activity-log.service.ts          |   95.0  |   90.0   |   100   |   95.8
```

### Frontend Coverage

```
=============================== Coverage summary ===============================
Statements   : 72.3% ( 156/216 )
Branches     : 65.4% ( 51/78 )
Functions    : 70.8% ( 34/48 )
Lines        : 73.1% ( 149/204 )
================================================================================

File                                    | % Stmts | % Branch | % Funcs | % Lines
----------------------------------------|---------|----------|---------|--------
AssignIncidentModal.tsx                 |   85.2  |   75.0   |   90.0  |   86.4
ReviewIncidentModal.tsx                 |   83.7  |   72.5   |   88.9  |   84.2
IncidentsList.tsx                       |   68.5  |   60.2   |   65.0  |   69.3
```

---

## 🐛 Bug Tracking Template

### Bug Report Format

```markdown
**Bug ID:** BUG-001

**Title:** [Short description]

**Severity:** Critical / High / Medium / Low

**Priority:** P0 / P1 / P2 / P3

**Found in:** Sprint 1 - Week 3

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Backend: v1.0.0
- Frontend: v1.0.0

**Steps to Reproduce:**
1. Login as supervisor
2. Click "มอบหมาย" button
3. ...

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[Attach screenshots]

**Console Errors:**
```
[Paste console errors]
```

**Impact:**
[How many users affected? Business impact?]

**Workaround:**
[Temporary solution if any]

**Root Cause:**
[After investigation]

**Fix:**
[Solution implemented]

**Status:** Open / In Progress / Fixed / Verified / Closed
```

---

## 📞 Support

**QA Team:** qa@guardianroute.local  
**Developer Team:** dev@guardianroute.local  
**System Analyst:** sa@guardianroute.local  
**Bug Tracker:** [GitHub Issues](https://github.com/jetci/Guardian-Route/issues)

---

**Document Version:** 1.1.0  
**Last Updated:** November 9, 2025  
**Status:** ✅ Extended per SA Requirements  
**Approved by:** System Analyst
