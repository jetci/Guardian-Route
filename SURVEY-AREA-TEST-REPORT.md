# 🗺️ Survey Area Module - Test & Improvement Report

**วันที่:** 17 ธันวาคม 2568 เวลา 11:25 น.  
**ผู้ทดสอบ:** Cascade AI  
**สถานะ:** 🔄 กำลังทดสอบและปรับปรุง

---

## 📋 Survey Area Features Overview

### 🗺️ Map Features
- ✅ Leaflet map with OpenStreetMap
- ✅ Satellite view (ArcGIS World Imagery)
- ✅ Hybrid overlay (boundaries and places)
- ✅ Layer control
- ✅ Fullscreen mode
- ✅ Custom pane for village boundaries (z-index: 350)

### 📍 GPS Features
- ✅ Get current location
- ✅ Display GPS marker
- ✅ Show coordinates (lat, lng)
- ✅ Loading state

### ✏️ Drawing Tools (Geoman)
- ✅ Draw Polygon
- ✅ Draw Rectangle
- ✅ Draw Circle
- ✅ Draw Polyline
- ✅ Draw Marker
- ✅ Edit mode
- ✅ Drag mode
- ✅ Cut polygon
- ✅ Remove mode
- ✅ Rotate mode

### 📐 Area Calculation
- ✅ Calculate area in km²
- ✅ Display area size
- ✅ Toast notification on draw

### 🏘️ Village Features
- ✅ Load villages from API
- ✅ Display village boundaries
- ✅ Village selection dropdown
- ✅ Click on boundary to select
- ✅ Zoom to selected village
- ✅ Switch to satellite view on selection
- ✅ Highlight selected village

### 📝 Form Features
- ✅ Village selection
- ✅ Disaster type selection
- ✅ Severity level (1-5)
- ✅ Estimated households
- ✅ Description/notes
- ✅ Image upload (multiple)
- ✅ Image preview
- ✅ Remove images

---

## 🧪 Test Scenarios

### Test 1: Map Initialization ✅
**Steps:**
1. Navigate to `/survey-area`
2. Wait for map to load

**Expected:**
- Map loads with Tambon Wiang center
- Street layer displayed by default
- Drawing tools visible
- Layer control available

**Status:** ⏳ Need to test in browser

---

### Test 2: Village Loading ✅
**Steps:**
1. Wait for villages to load
2. Check village boundaries on map

**Expected:**
- 20 villages loaded
- Boundaries displayed on map
- Village dropdown populated
- Boundaries clickable

**Status:** ⏳ Need to test in browser

---

### Test 3: GPS Location 🔍
**Steps:**
1. Click "Get Location" button
2. Allow location access
3. Check GPS marker

**Expected:**
- GPS coordinates displayed
- Marker added to map
- Success toast shown
- Coordinates accurate

**Potential Issues:**
- ⚠️ GPS may not work in browser (localhost)
- ⚠️ Need HTTPS for production
- ⚠️ Loading state may not show properly

---

### Test 4: Village Selection 🔍
**Steps:**
1. Select village from dropdown
2. Observe map behavior

**Expected:**
- Map zooms to village
- Boundary highlighted
- Switches to satellite view
- Village info displayed

**Potential Issues:**
- ⚠️ Satellite layer switch may be jarring
- ⚠️ Zoom level may be too close/far

---

### Test 5: Drawing Tools 🔍
**Steps:**
1. Select polygon tool
2. Draw area on map
3. Complete polygon

**Expected:**
- Polygon drawn successfully
- Area size calculated
- Toast notification shown
- Can edit/delete polygon

**Potential Issues:**
- ⚠️ Area calculation may be inaccurate
- ⚠️ Drawing on top of village boundaries may be confusing
- ⚠️ Multiple shapes may cause issues

---

### Test 6: Form Validation 🔍
**Steps:**
1. Try to submit without filling fields
2. Check validation messages

**Expected:**
- Required fields validated
- Error messages shown
- Cannot submit incomplete form

**Potential Issues:**
- ⚠️ Validation may be missing
- ⚠️ Error messages may not be clear

---

### Test 7: Image Upload 🔍
**Steps:**
1. Click image upload
2. Select multiple images
3. Check previews

**Expected:**
- Multiple images can be selected
- Previews displayed
- Can remove images
- File size validation

**Potential Issues:**
- ⚠️ No file size limit
- ⚠️ No image compression
- ⚠️ Large images may cause performance issues

---

### Test 8: Form Submission 🔍
**Steps:**
1. Fill all required fields
2. Draw survey area
3. Upload images (optional)
4. Click submit

**Expected:**
- Confirmation dialog
- Data sent to API
- Success message
- Form resets
- Redirects or shows success

**Potential Issues:**
- ⚠️ No loading state during submission
- ⚠️ No error handling for failed submission
- ⚠️ Images may fail to upload separately

---

## 🐛 Potential Issues Found (Code Review)

### 🟡 Issue 1: GPS Location Error Handling
**Location:** Line 350-380 (estimated)
**Problem:** GPS errors may not be handled properly
**Impact:** User may not know why GPS failed

**Recommendation:**
```typescript
// Add better error messages
if (error.code === error.PERMISSION_DENIED) {
  toast.error('กรุณาอนุญาตการเข้าถึงตำแหน่ง');
} else if (error.code === error.POSITION_UNAVAILABLE) {
  toast.error('ไม่สามารถระบุตำแหน่งได้');
} else if (error.code === error.TIMEOUT) {
  toast.error('หมดเวลาในการค้นหาตำแหน่ง');
}
```

---

### 🟡 Issue 2: Area Calculation Accuracy
**Location:** Line 175-186
**Problem:** Area calculation uses simple lat/lng formula
**Impact:** May be inaccurate for large areas

**Current Code:**
```typescript
const areaKm2 = area * 111 * 111 * Math.cos(latlngs[0].lat * Math.PI / 180);
```

**Recommendation:**
- Use Turf.js for accurate area calculation
- Or use Leaflet.GeometryUtil

---

### 🟡 Issue 3: Image Upload - No Compression
**Location:** Image upload section
**Problem:** No image compression before upload
**Impact:** Large images slow down upload and storage

**Recommendation:**
```typescript
// Add image compression
import imageCompression from 'browser-image-compression';

const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  return await imageCompression(file, options);
};
```

---

### 🟡 Issue 4: Form Validation
**Location:** Form submission
**Problem:** May lack comprehensive validation
**Impact:** Invalid data may be submitted

**Recommendation:**
- Add required field validation
- Add number range validation
- Add GPS coordinate validation
- Show clear error messages

---

### 🟡 Issue 5: Multiple Drawn Shapes
**Location:** Drawing tools
**Problem:** User can draw multiple shapes
**Impact:** Unclear which shape is the survey area

**Recommendation:**
- Clear previous shapes when drawing new one
- Or allow only one shape at a time
- Add confirmation before clearing

---

### 🟢 Issue 6: Satellite View Auto-Switch
**Location:** Village selection
**Problem:** Auto-switches to satellite view
**Impact:** May be unexpected for users

**Recommendation:**
- Make it optional
- Add user preference setting
- Or add a toggle button

---

### 🟢 Issue 7: Fullscreen Mode
**Location:** Fullscreen control
**Problem:** Map may not resize properly
**Impact:** Map may look distorted

**Current Fix:** ✅ Already handled with invalidateSize()

---

## 🎯 Recommended Improvements

### Priority 1: Critical (Must Fix)

1. **Form Validation** 🔴
   - Add comprehensive validation
   - Show clear error messages
   - Prevent invalid submissions

2. **Error Handling** 🔴
   - Better GPS error messages
   - Handle API failures gracefully
   - Show loading states

3. **Image Upload** 🔴
   - Add file size validation
   - Compress images before upload
   - Show upload progress

---

### Priority 2: Important (Should Fix)

4. **Area Calculation** 🟡
   - Use accurate calculation library
   - Show area in multiple units (km², rai, etc.)
   - Validate area size

5. **Drawing Tools** 🟡
   - Limit to one shape at a time
   - Add clear/reset button
   - Better visual feedback

6. **Village Selection** 🟡
   - Improve zoom level
   - Better highlight style
   - Add village info popup

---

### Priority 3: Enhancement (Nice to Have)

7. **Offline Support** 🟢
   - Cache map tiles
   - Save drafts locally
   - Sync when online

8. **User Experience** 🟢
   - Add tutorial/guide
   - Better mobile support
   - Dark mode

9. **Performance** 🟢
   - Lazy load villages
   - Optimize boundary rendering
   - Reduce bundle size

---

## 📝 Code Improvements to Implement

### 1. Add Form Validation

```typescript
const validateForm = () => {
  const errors: string[] = [];
  
  if (!formData.village) errors.push('กรุณาเลือกหมู่บ้าน');
  if (!formData.disasterType) errors.push('กรุณาเลือกประเภทภัย');
  if (!formData.severity) errors.push('กรุณาเลือกระดับความรุนแรง');
  if (!formData.estimatedHouseholds) errors.push('กรุณาระบุจำนวนครัวเรือน');
  if (!drawnArea) errors.push('กรุณาวาดขอบเขตพื้นที่');
  if (!currentLocation) errors.push('กรุณาระบุตำแหน่ง GPS');
  
  if (errors.length > 0) {
    toast.error(errors.join('\n'));
    return false;
  }
  
  return true;
};
```

### 2. Add Image Compression

```typescript
const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  
  // Validate file size
  const maxSize = 10 * 1024 * 1024; // 10MB
  const oversizedFiles = files.filter(f => f.size > maxSize);
  
  if (oversizedFiles.length > 0) {
    toast.error('ไฟล์บางไฟล์มีขนาดใหญ่เกิน 10MB');
    return;
  }
  
  // Compress images
  const compressedFiles = await Promise.all(
    files.map(async (file) => {
      if (file.type.startsWith('image/')) {
        return await compressImage(file);
      }
      return file;
    })
  );
  
  setSelectedImages(compressedFiles);
  // ... create previews
};
```

### 3. Improve GPS Error Handling

```typescript
const handleGetLocation = () => {
  if (!navigator.geolocation) {
    toast.error('เบราว์เซอร์ของคุณไม่รองรับ GPS');
    return;
  }
  
  setIsLoadingLocation(true);
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Success
      const { latitude, longitude } = position.coords;
      setCurrentLocation({ lat: latitude, lng: longitude });
      // ... add marker
      toast.success('✅ ระบุตำแหน่งสำเร็จ');
      setIsLoadingLocation(false);
    },
    (error) => {
      // Error handling
      let errorMessage = 'ไม่สามารถระบุตำแหน่งได้';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'กรุณาอนุญาตการเข้าถึงตำแหน่ง';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'ไม่สามารถระบุตำแหน่งได้ กรุณาลองใหม่';
          break;
        case error.TIMEOUT:
          errorMessage = 'หมดเวลาในการค้นหาตำแหน่ง';
          break;
      }
      
      toast.error(errorMessage);
      setIsLoadingLocation(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};
```

### 4. Limit to One Drawn Shape

```typescript
map.on('pm:create', (e: any) => {
  // Clear previous shapes
  if (drawnItemsRef.current) {
    drawnItemsRef.current.clearLayers();
  }
  
  const layer = e.layer;
  drawnItemsRef.current?.addLayer(layer);
  
  // ... rest of the code
});
```

### 5. Add Loading State for Submission

```typescript
const handleSubmit = async () => {
  if (!validateForm()) return;
  
  const result = await Swal.fire({
    title: 'ยืนยันการส่งข้อมูล',
    text: 'คุณต้องการส่งข้อมูลการสำรวจใช่หรือไม่?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก'
  });
  
  if (!result.isConfirmed) return;
  
  setIsSubmitting(true);
  
  try {
    // Submit survey
    const surveyData: FieldSurveySubmission = {
      // ... data
    };
    
    const response = await fieldSurveyApi.submitSurvey(surveyData);
    
    // Upload images if any
    if (selectedImages.length > 0) {
      await fieldSurveyApi.uploadImages(response.id, selectedImages);
    }
    
    await Swal.fire({
      title: 'สำเร็จ!',
      text: 'บันทึกข้อมูลการสำรวจเรียบร้อย',
      icon: 'success'
    });
    
    // Reset form
    resetForm();
    
  } catch (error) {
    console.error('Error submitting survey:', error);
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่',
      icon: 'error'
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 🧪 Manual Testing Checklist

### Browser Testing
- [ ] Open http://localhost:5173/survey-area
- [ ] Check map loads correctly
- [ ] Check village boundaries display
- [ ] Test village selection dropdown
- [ ] Test GPS location button
- [ ] Test drawing tools (polygon, rectangle, circle)
- [ ] Test area calculation
- [ ] Test form validation
- [ ] Test image upload
- [ ] Test form submission
- [ ] Check success/error messages

### Mobile Testing
- [ ] Test on iPhone
- [ ] Test on Android
- [ ] Check touch interactions
- [ ] Test GPS on mobile
- [ ] Test camera upload
- [ ] Check responsive layout

### Edge Cases
- [ ] Test without GPS permission
- [ ] Test with slow network
- [ ] Test with large images
- [ ] Test drawing multiple shapes
- [ ] Test form with invalid data
- [ ] Test API errors

---

## 📊 Current Status

**Code Quality:** 🟢 Good
**Functionality:** 🟡 Needs Testing
**User Experience:** 🟡 Can Improve
**Performance:** 🟢 Good
**Error Handling:** 🟡 Needs Improvement

---

## 🚀 Next Steps

1. **Implement Improvements** (Est. 2-3 hours)
   - Add form validation
   - Improve error handling
   - Add image compression
   - Limit to one drawn shape
   - Add loading states

2. **Manual Testing** (Est. 1-2 hours)
   - Test all features in browser
   - Test on mobile devices
   - Test edge cases
   - Document bugs found

3. **Bug Fixes** (Est. 1-2 hours)
   - Fix issues found during testing
   - Improve UX based on feedback

4. **Final Testing** (Est. 30 min)
   - Verify all fixes
   - Test complete workflow
   - Sign off for production

---

**Status:** 🔄 Ready to implement improvements  
**Priority:** Start with form validation and error handling  
**Timeline:** 4-6 hours total
