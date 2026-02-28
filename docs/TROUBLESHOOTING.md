# 🔧 Troubleshooting Guide - Village Boundaries Module

**Guardian Route System**  
**Version:** 1.0  
**Last Updated:** November 18, 2025

---

## 📋 Table of Contents

1. [Common Issues](#common-issues)
2. [Error Messages](#error-messages)
3. [FAQ](#faq)
4. [Debug Tools](#debug-tools)
5. [Contact Support](#contact-support)

---

## 🐛 Common Issues

### 1. Boundary Not Saving

#### **Symptoms:**
- Click "บันทึกขอบเขต" but nothing happens
- No success toast message
- List doesn't update

#### **Possible Causes:**

**A. Village not selected**
```
Problem: selectedVillageNo is empty
Solution: 
1. Check dropdown "ประเภทขอบเขต"
2. Select a village (หมู่ 1-20)
3. Try saving again
```

**B. Boundary name not entered**
```
Problem: boundaryName is empty
Solution:
1. Fill in "ชื่อขอบเขต" field
2. Example: "หมู่ 1 - หนองตุ้ม"
3. Try saving again
```

**C. Boundary not drawn**
```
Problem: drawnBoundary is null
Solution:
1. Use drawing tools to draw boundary
2. Make sure polygon is closed
3. Try saving again
```

**D. API connection failed**
```
Problem: Backend not responding
Solution:
1. Check backend is running (port 3001)
2. Check network connection
3. Check browser console for errors
4. Try refreshing page (F5)
```

#### **Debug Steps:**

```typescript
// Open browser console (F12)
// Check these values:
console.log('Selected Village:', selectedVillageNo);
console.log('Boundary Name:', boundaryName);
console.log('Drawn Boundary:', drawnBoundary);

// If any is null/empty, that's the problem
```

#### **Solution:**

```
1. ✅ Select village from dropdown
2. ✅ Enter boundary name
3. ✅ Draw boundary on map
4. ✅ Click "บันทึกขอบเขต"
5. ✅ Wait for success message
6. ✅ Verify in list
```

---

### 2. List Not Updating

#### **Symptoms:**
- Saved boundary but list still shows "ยังไม่มีขอบเขต"
- Old data showing
- Changes not reflected

#### **Possible Causes:**

**A. Cache issue**
```
Problem: Browser cached old data
Solution:
1. Hard refresh: Ctrl + Shift + R (Windows)
2. Or: Cmd + Shift + R (Mac)
3. Clear browser cache
```

**B. API not called**
```
Problem: loadBoundaries() not triggered
Solution:
1. Check browser console for errors
2. Manually refresh page (F5)
3. Check network tab for API calls
```

**C. Database not updated**
```
Problem: Data not saved to database
Solution:
1. Check backend logs
2. Verify database connection
3. Run: node check-villages.js
```

#### **Debug Steps:**

```bash
# Backend: Check database directly
cd backend
node check-villages.js

# Expected output:
# ✅ หมู่ 1 - หนองตุ้ม - มีขอบเขต (Polygon)
# ❌ หมู่ 2 - ป่าบง - ไม่มีขอบเขต
```

#### **Solution:**

```
1. ✅ Hard refresh browser (Ctrl + Shift + R)
2. ✅ Check backend logs
3. ✅ Verify database with check script
4. ✅ If still not working, restart backend
```

---

### 3. Markers Not Appearing

#### **Symptoms:**
- Click "ปักหมุด" but marker doesn't show
- Coordinates entered but nothing happens
- Map doesn't move to marker

#### **Possible Causes:**

**A. Invalid coordinates**
```
Problem: Lat/Lng format wrong
Solution:
1. Check format: Latitude = 19.938422
2. Check format: Longitude = 99.230760
3. No letters, only numbers and decimal point
```

**B. Coordinates out of bounds**
```
Problem: Coordinates outside map area
Solution:
1. Verify coordinates are in Fang District
2. Latitude should be around 19.9
3. Longitude should be around 99.2
```

**C. Label not entered**
```
Problem: Marker label empty
Solution:
1. Enter marker label
2. Example: "จุดเริ่มต้นหมู่ 1"
3. Try adding marker again
```

#### **Debug Steps:**

```typescript
// Check coordinate values
console.log('Input Lat:', inputLat);
console.log('Input Lng:', inputLng);
console.log('Marker Label:', markerLabel);

// Valid example:
// Lat: 19.93842280996853
// Lng: 99.23076089434804
```

#### **Solution:**

```
1. ✅ Enter valid latitude (around 19.9)
2. ✅ Enter valid longitude (around 99.2)
3. ✅ Enter marker label
4. ✅ Click "ปักหมุด"
5. ✅ Marker should appear on map
```

---

### 4. Delete Not Working

#### **Symptoms:**
- Click delete button but nothing happens
- Confirmation dialog doesn't appear
- Item not deleted

#### **Possible Causes:**

**A. JavaScript error**
```
Problem: Error in delete function
Solution:
1. Open browser console (F12)
2. Look for red error messages
3. Report error to developer
```

**B. SweetAlert2 not loaded**
```
Problem: Confirmation library missing
Solution:
1. Check browser console for errors
2. Verify SweetAlert2 imported
3. Refresh page (F5)
```

**C. API permission denied**
```
Problem: User not authorized
Solution:
1. Check user role (must be ADMIN)
2. Re-login if needed
3. Contact admin for permissions
```

#### **Debug Steps:**

```typescript
// Check if SweetAlert2 loaded
console.log('Swal:', typeof Swal);
// Should output: "function"

// Check user role
console.log('User role:', user?.role);
// Should be: "ADMIN" or "DEVELOPER"
```

#### **Solution:**

```
1. ✅ Verify you're logged in as Admin
2. ✅ Refresh page (F5)
3. ✅ Try delete again
4. ✅ Confirm in dialog
5. ✅ Verify deletion in list
```

---

### 5. Map Not Loading

#### **Symptoms:**
- Gray screen instead of map
- "Loading..." forever
- Tiles not showing

#### **Possible Causes:**

**A. Internet connection**
```
Problem: Can't load map tiles
Solution:
1. Check internet connection
2. Try different network
3. Wait and retry
```

**B. Tile server down**
```
Problem: OpenStreetMap/Esri server down
Solution:
1. Wait a few minutes
2. Try different layer type
3. Check status: https://status.openstreetmap.org/
```

**C. Leaflet not loaded**
```
Problem: Leaflet library missing
Solution:
1. Check browser console for errors
2. Verify Leaflet imported
3. Refresh page (F5)
```

#### **Debug Steps:**

```typescript
// Check Leaflet loaded
console.log('Leaflet:', typeof L);
// Should output: "object"

// Check map initialized
console.log('Map:', mapRef.current);
// Should output: Leaflet Map object
```

#### **Solution:**

```
1. ✅ Check internet connection
2. ✅ Refresh page (F5)
3. ✅ Try different layer type
4. ✅ Clear browser cache
5. ✅ If still not working, contact support
```

---

### 6. Colors Not Showing

#### **Symptoms:**
- All boundaries same color (blue)
- Legend shows but colors wrong
- List doesn't show color indicators

#### **Possible Causes:**

**A. Old code version**
```
Problem: Using old version without colors
Solution:
1. Hard refresh: Ctrl + Shift + R
2. Clear browser cache
3. Verify latest code deployed
```

**B. villageNo missing**
```
Problem: Boundary doesn't have villageNo
Solution:
1. Re-save boundary with village selected
2. Verify villageNo in database
3. Run: node check-villages.js
```

**C. CSS not loaded**
```
Problem: Styles not applied
Solution:
1. Check browser console for CSS errors
2. Refresh page (F5)
3. Clear browser cache
```

#### **Debug Steps:**

```typescript
// Check color function
const color = getVillageColor(1);
console.log('Village 1 color:', color);
// Should output: "#e74c3c" (red)

// Check boundary data
console.log('Boundary:', boundary);
console.log('Village No:', boundary.villageNo);
// Should have villageNo: 1-20
```

#### **Solution:**

```
1. ✅ Hard refresh (Ctrl + Shift + R)
2. ✅ Verify villageNo exists
3. ✅ Re-save boundary if needed
4. ✅ Check legend shows colors
5. ✅ Verify colors on map
```

---

### 7. Mobile Issues

#### **Symptoms:**
- Controls overlap map
- Can't tap buttons
- Map doesn't respond to touch
- Legend covers map

#### **Possible Causes:**

**A. Old version**
```
Problem: Using old version without mobile fixes
Solution:
1. Hard refresh: Ctrl + Shift + R
2. Clear browser cache
3. Verify latest code deployed
```

**B. Zoom level**
```
Problem: Map too zoomed in/out
Solution:
1. Pinch to zoom out
2. Double tap to zoom in
3. Use zoom controls
```

**C. Browser compatibility**
```
Problem: Browser doesn't support features
Solution:
1. Update browser to latest version
2. Try different browser (Chrome recommended)
3. Enable JavaScript
```

#### **Debug Steps:**

```typescript
// Check mobile detection
console.log('Is mobile:', /Mobile|Android|iPhone/i.test(navigator.userAgent));

// Check touch support
console.log('Touch support:', 'ontouchstart' in window);
```

#### **Solution:**

```
1. ✅ Update browser
2. ✅ Hard refresh page
3. ✅ Verify controls outside map
4. ✅ Test touch gestures
5. ✅ Report if still not working
```

---

## ⚠️ Error Messages

### Frontend Errors

#### **"ไม่พบข้อมูลหมู่ X"**
```
Meaning: Village not found in database
Cause: Invalid villageNo or village deleted
Solution:
1. Check villageNo is correct (1-20)
2. Verify village exists in database
3. Contact admin if village missing
```

#### **"ไม่สามารถลบขอบเขตได้"**
```
Meaning: Delete operation failed
Cause: API error or permission denied
Solution:
1. Check user permissions (Admin only)
2. Check backend logs
3. Retry after refresh
```

#### **"เกิดข้อผิดพลาดในการบันทึก"**
```
Meaning: Save operation failed
Cause: API error or invalid data
Solution:
1. Check all fields filled correctly
2. Check backend running
3. Check browser console for details
```

### Backend Errors

#### **"Village with ID xxx not found"**
```
Meaning: Village doesn't exist in database
Cause: Invalid ID or village deleted
Solution:
1. Verify village ID
2. Check database
3. Re-create village if needed
```

#### **"Unauthorized"**
```
Meaning: User not authorized
Cause: Not logged in or insufficient permissions
Solution:
1. Login as Admin
2. Check JWT token valid
3. Re-login if needed
```

#### **"Invalid GeoJSON format"**
```
Meaning: Boundary data format wrong
Cause: Corrupted or invalid GeoJSON
Solution:
1. Re-draw boundary
2. Verify GeoJSON structure
3. Contact developer if persists
```

---

## ❓ FAQ

### General Questions

**Q: ต้องใช้บัญชีอะไรในการจัดการขอบเขต?**
```
A: ต้องเป็นบัญชี Admin หรือ Developer เท่านั้น
   Field Officer ไม่สามารถแก้ไขขอบเขตได้
```

**Q: สามารถลบขอบเขตที่บันทึกแล้วได้หรือไม่?**
```
A: ได้ แต่ต้องยืนยันการลบ และไม่สามารถกู้คืนได้
   ควรส่งออก GeoJSON เป็นสำรองก่อนลบ
```

**Q: ทำไมบางหมู่บ้านไม่มีขอบเขต?**
```
A: เพราะยังไม่มีการวาดและบันทึกขอบเขต
   สถานะจะแสดง "⚠️ ยังไม่มีขอบเขต"
```

### Technical Questions

**Q: รองรับ browser อะไรบ้าง?**
```
A: รองรับ browser ทุกตัวที่ทันสมัย:
   - Chrome 90+ (แนะนำ)
   - Firefox 88+
   - Safari 14+
   - Edge 90+
```

**Q: ขนาดไฟล์ GeoJSON ที่รองรับ?**
```
A: ไม่จำกัดขนาด แต่แนะนำไม่เกิน 10 MB
   ถ้าใหญ่เกินไปอาจทำให้แผนที่ช้า
```

**Q: สามารถ import ขอบเขตจากไฟล์ได้หรือไม่?**
```
A: ได้ ใช้แท็บ "📤 อัปโหลด GeoJSON"
   รองรับไฟล์ .geojson และ .json
```

### Troubleshooting Questions

**Q: ทำไมแผนที่โหลดช้า?**
```
A: สาเหตุที่เป็นไปได้:
   1. Internet ช้า
   2. Tile server ช้า
   3. ขอบเขตมีจุดมากเกินไป
   
   วิธีแก้:
   - ใช้ layer แผนที่ถนนแทนดาวเทียม
   - ลดจำนวนจุดในขอบเขต
   - รอให้โหลดเสร็จ
```

**Q: ทำไมสีขอบเขตไม่ตรงกับ legend?**
```
A: ลอง:
   1. Hard refresh (Ctrl + Shift + R)
   2. Clear browser cache
   3. ตรวจสอบ villageNo ถูกต้อง
```

**Q: จะกู้คืนขอบเขตที่ลบไปแล้วได้อย่างไร?**
```
A: ไม่สามารถกู้คืนได้ ถ้าไม่มีสำรอง
   ควรส่งออก GeoJSON เป็นสำรองเสมอ
   ก่อนลบข้อมูลสำคัญ
```

---

## 🛠️ Debug Tools

### Browser Console

```javascript
// Open console: F12 (Windows) or Cmd+Option+I (Mac)

// Check current state
console.log('Villages:', villageBoundaries);
console.log('Selected:', selectedVillageNo);
console.log('Drawn:', drawnBoundary);

// Check API calls
// Go to Network tab
// Filter: XHR
// Look for /api/admin/villages calls
```

### Backend Scripts

```bash
# Check villages in database
cd backend
node check-villages.js

# Clear all boundaries (DANGEROUS!)
node clear-boundaries.js

# Check database connection
npx prisma studio
```

### Database Queries

```sql
-- Check all villages
SELECT id, "villageNo", name, 
       CASE WHEN boundary IS NOT NULL THEN 'Yes' ELSE 'No' END as has_boundary
FROM villages
ORDER BY "villageNo";

-- Check specific village
SELECT * FROM villages WHERE "villageNo" = 1;

-- Count villages with boundaries
SELECT COUNT(*) FROM villages WHERE boundary IS NOT NULL;
```

---

## 📞 Contact Support

### When to Contact

Contact support if:
- ✅ Error persists after troubleshooting
- ✅ Data loss or corruption
- ✅ Security concerns
- ✅ Feature requests
- ✅ Bug reports

### What to Include

When reporting issues, include:

```
1. Error Message (exact text or screenshot)
2. Steps to Reproduce
3. Expected Behavior
4. Actual Behavior
5. Browser & Version
6. User Role
7. Timestamp
8. Console Errors (F12 → Console tab)
```

### Support Channels

- **Developer Team**: Team W
- **System Admin**: SA
- **Testing Team**: J

### Response Time

- **Critical (data loss)**: Immediate
- **High (can't work)**: Within 2 hours
- **Medium (workaround exists)**: Within 1 day
- **Low (enhancement)**: Within 1 week

---

## 📚 Additional Resources

### Documentation

- [Admin User Guide](./ADMIN_USER_GUIDE.md)
- [Developer Documentation](./DEVELOPER_DOCUMENTATION.md)
- [API Documentation](./API_DOCUMENTATION.md)

### External Links

- [Leaflet Documentation](https://leafletjs.com/)
- [GeoJSON Specification](https://geojson.org/)
- [PostGIS Documentation](https://postgis.net/)

---

**Last Updated:** November 18, 2025  
**Maintained by:** Team W  
**For:** Guardian Route System
