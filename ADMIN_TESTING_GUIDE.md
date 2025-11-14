# 🧪 Admin Features Testing Guide

**Quick Start Guide for Team W**

---

## 🚀 Quick Setup (5 minutes)

### 1. Verify Services Running
```bash
# Backend should be running on port 3001
# Frontend should be running on port 5173
```

✅ **Backend:** http://localhost:3001  
✅ **Frontend:** http://localhost:5173  
✅ **API Docs:** http://localhost:3001/api/docs

### 2. Login as Admin
```
URL: http://localhost:5173/login

Credentials:
Email: admin@obtwiang.go.th
Password: password123
```

### 3. Navigate to Admin Dashboard
```
After login → Click "Admin Dashboard" or go to:
http://localhost:5173/dashboard/admin
```

---

## 📋 Testing Checklist

### Phase 1: User Management (60 min)

#### Test 1.1: Create User (10 min)
```
1. Click "User Management" tab
2. Click "เพิ่มผู้ใช้" button
3. Fill form:
   - First Name: Test
   - Last Name: Officer
   - Email: testofficer@obtwiang.go.th
   - Phone: 081-999-9999
   - Role: FIELD_OFFICER
   - Password: Test123456
4. Click Submit
5. ✅ Check: User appears in list
6. ✅ Check: Can login with new credentials
```

**Expected:** User created successfully  
**Record:** ✅ Pass / ❌ Fail (with details)

---

#### Test 1.2: List & View Users (5 min)
```
1. View user list
2. Check all columns visible
3. Check pagination (if >10 users)
4. Click on a user to view details
```

**Expected:** All users displayed correctly  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 1.3: Edit User (10 min)
```
1. Click "แก้ไข" (Edit) on test user
2. Change phone to: 081-888-8888
3. Change first name to: TestEdited
4. Click Save
5. ✅ Check: Changes reflected in list
```

**Expected:** User updated successfully  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 1.4: Change Role (10 min)
```
1. Click "เปลี่ยนบทบาท" on test user
2. Change from FIELD_OFFICER to SUPERVISOR
3. Confirm
4. ✅ Check: Role changed in list
5. ✅ Check: User's dashboard changed (login as that user)
```

**Expected:** Role changed successfully  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 1.5: Suspend User (10 min)
```
1. Click "ระงับ" (Suspend) on test user
2. Confirm
3. ✅ Check: Status changed to INACTIVE
4. Logout and try to login as suspended user
5. ✅ Check: Login should fail
6. Login as admin again
7. Click "เปิดใช้งาน" (Activate)
8. ✅ Check: Can login again
```

**Expected:** Suspend/Activate works correctly  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 1.6: Search & Filter (10 min)
```
1. Use search box: type "test"
2. ✅ Check: Only matching users shown
3. Clear search
4. Use role filter: select "FIELD_OFFICER"
5. ✅ Check: Only field officers shown
6. Use status filter: select "INACTIVE"
7. ✅ Check: Only inactive users shown
8. Clear all filters
```

**Expected:** All filters work correctly  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 1.7: View Stats (5 min)
```
1. Look at stats cards at top
2. Count users manually
3. ✅ Check: Total count matches
4. ✅ Check: Role breakdown correct
5. ✅ Check: Active/Inactive count correct
```

**Expected:** Stats accurate  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 1.8: Delete User (10 min)
```
1. Click "ลบ" (Delete) on test user
2. Confirm deletion
3. ✅ Check: User removed from list
4. Try to login as deleted user
5. ✅ Check: Login should fail
```

**Expected:** User deleted (soft delete)  
**Record:** ✅ Pass / ❌ Fail

---

### Phase 2: GeoJSON Management (30 min)

#### Test 2.1: Upload GeoJSON (10 min)
```
1. Click "GeoJSON Management" tab
2. Click "Upload" or drag & drop
3. Select a .geojson file (create sample if needed)
4. Fill metadata:
   - Name: Test Boundary
   - Description: Testing upload
5. Submit
6. ✅ Check: File uploaded
7. ✅ Check: Appears in list
```

**Sample GeoJSON:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Test Area"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [98.9, 19.9],
          [98.9, 20.0],
          [99.0, 20.0],
          [99.0, 19.9],
          [98.9, 19.9]
        ]]
      }
    }
  ]
}
```

**Expected:** Upload successful  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 2.2: List GeoJSON (5 min)
```
1. View GeoJSON list
2. ✅ Check: All files shown
3. ✅ Check: Name, date, size visible
```

**Expected:** List displays correctly  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 2.3: View GeoJSON (5 min)
```
1. Click "View" on uploaded file
2. ✅ Check: Map displays
3. ✅ Check: Polygon/features visible
4. ✅ Check: Can zoom/pan
```

**Expected:** Map renders correctly  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 2.4: Edit GeoJSON (5 min)
```
1. Click "Edit" on file
2. Change name to: "Test Boundary Edited"
3. Save
4. ✅ Check: Name updated in list
```

**Expected:** Edit successful  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 2.5: Delete GeoJSON (5 min)
```
1. Click "Delete" on file
2. Confirm
3. ✅ Check: File removed from list
```

**Expected:** Delete successful  
**Record:** ✅ Pass / ❌ Fail

---

### Phase 3: Audit Logs (30 min)

#### Test 3.1: View Logs (10 min)
```
1. Click "Audit Logs" tab
2. ✅ Check: Logs displayed
3. ✅ Check: Shows timestamp, user, action
4. ✅ Check: Most recent first
5. ✅ Check: Previous actions logged (user create, edit, etc.)
```

**Expected:** Logs visible and accurate  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 3.2: Filter by Action (10 min)
```
1. Use action filter dropdown
2. Select "CREATE_USER"
3. ✅ Check: Only user creation logs shown
4. Select "UPDATE_USER"
5. ✅ Check: Only user update logs shown
6. Clear filter
```

**Expected:** Action filter works  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 3.3: Filter by Date (10 min)
```
1. Use date range filter
2. Select today's date (in Thai calendar พ.ศ.)
3. ✅ Check: Only today's logs shown
4. Select last week
5. ✅ Check: Last week's logs shown
6. Clear filter
```

**Expected:** Date filter works with Thai calendar  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 3.4: Export CSV (10 min)
```
1. Click "Export CSV" button
2. ✅ Check: File downloads
3. Open file in Excel/Notepad
4. ✅ Check: Contains log data
5. ✅ Check: Properly formatted
```

**Expected:** CSV export works  
**Record:** ✅ Pass / ❌ Fail

---

### Phase 4: System Settings (30 min)

#### Test 4.1: View Settings (10 min)
```
1. Click "System Settings" tab
2. ✅ Check: Settings displayed
3. ✅ Check: Shows key, value, description
4. ✅ Check: Organized by category
```

**Expected:** Settings visible  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 4.2: Update Setting (10 min)
```
1. Click "Edit" on a setting
2. Change value
3. Save
4. ✅ Check: Value updated
5. ✅ Check: Change reflected immediately
```

**Expected:** Update successful  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 4.3: Reset Setting (5 min)
```
1. Click "Reset to Default"
2. Confirm
3. ✅ Check: Value reset
```

**Expected:** Reset successful  
**Record:** ✅ Pass / ❌ Fail

---

#### Test 4.4: Search Settings (5 min)
```
1. Use search box
2. Type setting key
3. ✅ Check: Filtered correctly
```

**Expected:** Search works  
**Record:** ✅ Pass / ❌ Fail

---

## 🐛 Bug Reporting Template

When you find a bug, document it like this:

```markdown
### [BUG-001] Short Description

**Severity:** Critical / High / Medium / Low
**Module:** User Management / GeoJSON / Audit Logs / Settings
**Status:** New

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:**
What should happen

**Actual Result:**
What actually happened

**Screenshots:**
[Attach screenshots]

**Environment:**
- Browser: Chrome/Firefox/Edge
- OS: Windows/Mac/Linux
- Date: 2025-11-14
- Time: 16:00

**Additional Notes:**
Any other relevant information
```

---

## 📊 Progress Tracking

Update this as you go:

### User Management
- [ ] Create User
- [ ] List Users
- [ ] Edit User
- [ ] Change Role
- [ ] Suspend/Activate
- [ ] Search & Filter
- [ ] View Stats
- [ ] Delete User

### GeoJSON Management
- [ ] Upload
- [ ] List
- [ ] View
- [ ] Edit
- [ ] Delete

### Audit Logs
- [ ] View Logs
- [ ] Filter by Action
- [ ] Filter by Date
- [ ] Export CSV

### System Settings
- [ ] View Settings
- [ ] Update Setting
- [ ] Reset Setting
- [ ] Search Settings

---

## ✅ Completion Criteria

**Ready to Sign-off when:**
- ✅ All 23 tests completed
- ✅ All bugs documented
- ✅ Success rate >90%
- ✅ Critical bugs: 0
- ✅ High priority bugs: <3

---

## 📞 Need Help?

**If you encounter issues:**
1. Check browser console (F12)
2. Check network tab for API errors
3. Check backend logs
4. Document the issue
5. Take screenshots
6. Report to team

**Common Issues:**
- **401 Unauthorized:** Token expired, login again
- **403 Forbidden:** Insufficient permissions
- **500 Server Error:** Check backend logs
- **Network Error:** Check if backend is running

---

## 🎯 Success!

When all tests pass:
1. Update ADMIN_TESTING_REPORT.md
2. Calculate success rate
3. Document all findings
4. Create bug tickets
5. Report to team lead

**Good luck! 🚀**
