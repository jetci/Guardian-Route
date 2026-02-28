# 🔧 Survey Area Improvements - Implementation Guide

**วันที่:** 17 ธันวาคม 2568  
**สถานะ:** 📝 Ready to Implement

---

## 🎯 Improvements Overview

### ✅ Current Status
- Map loading: Working
- GPS location: Working (basic)
- Drawing tools: Working
- Village selection: Working
- Form submission: Working
- Image upload: Working

### 🔧 Improvements Needed

1. **GPS Error Handling** - Better error messages
2. **Drawing Tools** - Limit to one shape
3. **Image Compression** - Reduce file size
4. **Form Validation** - More comprehensive
5. **Area Calculation** - More accurate

---

## 📝 Implementation Details

### Improvement 1: Enhanced GPS Error Handling

**File:** `frontend/src/pages/field-officer/SurveyAreaPage.tsx`

**Location:** `handleGetLocation` function (around line 390-435)

**Changes:**
```typescript
const handleGetLocation = () => {
  if (!navigator.geolocation) {
    toast.error('เบราว์เซอร์ของคุณไม่รองรับ GPS');
    return;
  }

  setIsLoadingLocation(true);
  const loadingToast = toast.loading('กำลังค้นหาตำแหน่ง...');

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      setCurrentLocation({ lat: latitude, lng: longitude });

      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([latitude, longitude], 15);

        if (gpsMarkerRef.current) {
          mapInstanceRef.current.removeLayer(gpsMarkerRef.current);
        }

        const newMarker = L.marker([latitude, longitude], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: '<div style="background: #3b82f6; color: white; padding: 8px 12px; border-radius: 20px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">📍 ตำแหน่งปัจจุบัน</div>',
            iconSize: [150, 40],
            iconAnchor: [75, 40]
          })
        }).addTo(mapInstanceRef.current);

        gpsMarkerRef.current = newMarker;
      }

      setIsLoadingLocation(false);
      toast.success(
        `📍 พบตำแหน่ง: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\nความแม่นยำ: ${Math.round(accuracy)}m`,
        { id: loadingToast, duration: 4000 }
      );
    },
    (error) => {
      setIsLoadingLocation(false);
      
      let errorMessage = 'ไม่สามารถระบุตำแหน่งได้';
      let errorDetail = '';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = '❌ ไม่ได้รับอนุญาตเข้าถึงตำแหน่ง';
          errorDetail = 'กรุณาอนุญาตการเข้าถึงตำแหน่งในการตั้งค่าเบราว์เซอร์';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = '❌ ไม่สามารถระบุตำแหน่งได้';
          errorDetail = 'กรุณาตรวจสอบการเชื่อมต่อ GPS หรือลองใหม่อีกครั้ง';
          break;
        case error.TIMEOUT:
          errorMessage = '⏱️ หมดเวลาในการค้นหาตำแหน่ง';
          errorDetail = 'กรุณาลองใหม่อีกครั้ง';
          break;
        default:
          errorDetail = error.message;
      }
      
      toast.error(`${errorMessage}\n${errorDetail}`, { 
        id: loadingToast,
        duration: 5000 
      });
      
      console.error('GPS Error:', error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};
```

**Benefits:**
- ✅ Specific error messages for each error type
- ✅ Shows GPS accuracy
- ✅ Better timeout handling
- ✅ User-friendly messages

---

### Improvement 2: Limit Drawing to One Shape

**File:** `frontend/src/pages/field-officer/SurveyAreaPage.tsx`

**Location:** `map.on('pm:create')` event handler (around line 168-193)

**Changes:**
```typescript
map.on('pm:create', (e: any) => {
  // Clear previous shapes before adding new one
  if (drawnItemsRef.current) {
    drawnItemsRef.current.clearLayers();
  }
  
  const layer = e.layer;
  
  // Add new layer to drawn items
  if (drawnItemsRef.current) {
    drawnItemsRef.current.addLayer(layer);
  }
  
  if (layer && typeof layer.toGeoJSON === 'function') {
    const geojson = layer.toGeoJSON();
    setDrawnArea(geojson);

    if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
      const latlngs = layer.getLatLngs()[0] as L.LatLng[];
      let area = 0;

      for (let i = 0; i < latlngs.length; i++) {
        const j = (i + 1) % latlngs.length;
        area += latlngs[i].lat * latlngs[j].lng;
        area -= latlngs[j].lat * latlngs[i].lng;
      }
      area = Math.abs(area / 2);

      const areaKm2 = area * 111 * 111 * Math.cos(latlngs[0].lat * Math.PI / 180);
      setAreaSize(parseFloat(areaKm2.toFixed(4)));

      toast.success(`✅ วาดขอบเขตพื้นที่เรียบร้อย (${areaKm2.toFixed(4)} ตร.กม.)`);
    } else {
      toast.success('✅ วาดขอบเขตพื้นที่เรียบร้อย');
    }
  }
});
```

**Benefits:**
- ✅ Only one shape at a time
- ✅ Clear previous shape automatically
- ✅ Less confusion for users
- ✅ Cleaner map

---

### Improvement 3: Image Compression

**File:** `frontend/src/pages/field-officer/SurveyAreaPage.tsx`

**Step 1:** Install dependency
```bash
npm install browser-image-compression
```

**Step 2:** Add import
```typescript
import imageCompression from 'browser-image-compression';
```

**Step 3:** Add compression function
```typescript
const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg'
  };
  
  try {
    const compressedFile = await imageCompression(file, options);
    console.log(`✅ Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file; // Return original if compression fails
  }
};
```

**Step 4:** Update image selection handler
```typescript
const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  
  if (files.length === 0) return;
  
  // Validate file size (max 10MB per file before compression)
  const maxSize = 10 * 1024 * 1024;
  const oversizedFiles = files.filter(f => f.size > maxSize);
  
  if (oversizedFiles.length > 0) {
    toast.error(`ไฟล์บางไฟล์มีขนาดใหญ่เกิน 10MB: ${oversizedFiles.map(f => f.name).join(', ')}`);
    return;
  }
  
  // Show loading toast
  const loadingToast = toast.loading(`กำลังประมวลผลรูปภาพ ${files.length} รูป...`);
  
  try {
    // Compress images
    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        if (file.type.startsWith('image/')) {
          return await compressImage(file);
        }
        return file;
      })
    );
    
    setSelectedImages(prev => [...prev, ...compressedFiles]);
    
    // Create previews
    const newPreviews = await Promise.all(
      compressedFiles.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );
    
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    toast.success(`✅ เพิ่มรูปภาพ ${files.length} รูปเรียบร้อย`, { id: loadingToast });
  } catch (error) {
    console.error('Error processing images:', error);
    toast.error('เกิดข้อผิดพลาดในการประมวลผลรูปภาพ', { id: loadingToast });
  }
};
```

**Benefits:**
- ✅ Reduce file size by 70-90%
- ✅ Faster upload
- ✅ Less storage space
- ✅ Better performance

---

### Improvement 4: Enhanced Form Validation

**File:** `frontend/src/pages/field-officer/SurveyAreaPage.tsx`

**Add validation function:**
```typescript
const validateForm = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Required fields
  if (!selectedVillage) {
    errors.push('❌ กรุณาเลือกหมู่บ้าน');
  }
  
  if (!formData.disasterType) {
    errors.push('❌ กรุณาเลือกประเภทภัย');
  }
  
  if (!formData.severity) {
    errors.push('❌ กรุณาเลือกระดับความรุนแรง');
  } else {
    const severity = parseInt(formData.severity);
    if (severity < 1 || severity > 5) {
      errors.push('❌ ระดับความรุนแรงต้องอยู่ระหว่าง 1-5');
    }
  }
  
  if (!formData.estimatedHouseholds) {
    errors.push('❌ กรุณาระบุจำนวนครัวเรือนโดยประมาณ');
  } else {
    const households = parseInt(formData.estimatedHouseholds);
    if (households < 0) {
      errors.push('❌ จำนวนครัวเรือนต้องเป็นจำนวนบวก');
    }
    if (households > 10000) {
      errors.push('⚠️ จำนวนครัวเรือนดูเยอะผิดปกติ กรุณาตรวจสอบ');
    }
  }
  
  if (!currentLocation) {
    errors.push('❌ กรุณาระบุตำแหน่ง GPS');
  }
  
  if (!drawnArea) {
    errors.push('❌ กรุณาวาดขอบเขตพื้นที่บนแผนที่');
  }
  
  // Optional but recommended
  if (!formData.description || formData.description.trim().length < 10) {
    errors.push('⚠️ แนะนำให้เพิ่มรายละเอียดอย่างน้อย 10 ตัวอักษร');
  }
  
  if (selectedImages.length === 0) {
    errors.push('⚠️ แนะนำให้แนบรูปภาพประกอบ');
  }
  
  return {
    isValid: errors.filter(e => e.startsWith('❌')).length === 0,
    errors
  };
};
```

**Update submit handler:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validate form
  const validation = validateForm();
  
  if (!validation.isValid) {
    // Show all errors
    const errorHtml = validation.errors.map(e => `<div style="text-align: left; margin: 4px 0;">${e}</div>`).join('');
    
    await Swal.fire({
      title: 'กรุณาตรวจสอบข้อมูล',
      html: `<div style="padding: 10px;">${errorHtml}</div>`,
      icon: 'warning',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#f59e0b'
    });
    
    return;
  }
  
  // Show warnings if any
  const warnings = validation.errors.filter(e => e.startsWith('⚠️'));
  if (warnings.length > 0) {
    const warningHtml = warnings.map(w => `<div style="text-align: left; margin: 4px 0;">${w}</div>`).join('');
    
    const result = await Swal.fire({
      title: 'คำเตือน',
      html: `<div style="padding: 10px;">${warningHtml}<br/><p>คุณต้องการดำเนินการต่อหรือไม่?</p></div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ดำเนินการต่อ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280'
    });
    
    if (!result.isConfirmed) return;
  }

  // Rest of submit logic...
};
```

**Benefits:**
- ✅ Comprehensive validation
- ✅ Clear error messages
- ✅ Warnings for optional fields
- ✅ Better user experience

---

### Improvement 5: Add Clear/Reset Button

**File:** `frontend/src/pages/field-officer/SurveyAreaPage.tsx`

**Add button in UI:**
```typescript
<div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
  <button
    type="button"
    onClick={resetForm}
    style={{
      flex: 1,
      padding: '14px',
      background: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '16px'
    }}
  >
    🔄 ล้างข้อมูล
  </button>
  
  <button
    type="submit"
    disabled={isSubmitting}
    style={{
      flex: 2,
      padding: '14px',
      background: isSubmitting ? '#9ca3af' : '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      fontSize: '16px'
    }}
  >
    {isSubmitting ? '⏳ กำลังบันทึก...' : '💾 บันทึกข้อมูลการสำรวจ'}
  </button>
</div>
```

**Update resetForm function:**
```typescript
const resetForm = () => {
  // Confirm before reset
  Swal.fire({
    title: 'ยืนยันการล้างข้อมูล?',
    text: 'ข้อมูลทั้งหมดจะถูกลบและไม่สามารถกู้คืนได้',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280'
  }).then((result) => {
    if (result.isConfirmed) {
      // Reset all state
      setFormData({
        disasterType: '',
        severity: '',
        village: '',
        description: '',
        estimatedHouseholds: ''
      });
      setDrawnArea(null);
      setAreaSize(null);
      setCurrentLocation(null);
      setSelectedImages([]);
      setImagePreviews([]);
      setSelectedVillage(null);
      resetHighlight();

      // Clear map layers
      if (drawnItemsRef.current) {
        drawnItemsRef.current.clearLayers();
      }

      if (gpsMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(gpsMarkerRef.current);
        gpsMarkerRef.current = null;
      }
      
      // Reset map view
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([TAMBON_INFO.centerLat, TAMBON_INFO.centerLng], 13);
      }
      
      toast.success('✅ ล้างข้อมูลเรียบร้อย');
    }
  });
};
```

---

## 📦 Installation Steps

### 1. Install Dependencies
```bash
cd frontend
npm install browser-image-compression
```

### 2. Apply Code Changes
- Update `SurveyAreaPage.tsx` with improvements above
- Test each improvement individually
- Verify no breaking changes

### 3. Test Improvements
- Test GPS error handling
- Test drawing tools (one shape limit)
- Test image compression
- Test form validation
- Test reset button

---

## ✅ Testing Checklist

### GPS Error Handling
- [ ] Test without GPS permission
- [ ] Test with GPS disabled
- [ ] Test with timeout
- [ ] Verify error messages are clear

### Drawing Tools
- [ ] Draw first shape
- [ ] Draw second shape (should clear first)
- [ ] Verify only one shape exists
- [ ] Test edit/delete

### Image Compression
- [ ] Upload large image (>5MB)
- [ ] Verify compression works
- [ ] Check compressed file size
- [ ] Verify image quality

### Form Validation
- [ ] Submit empty form
- [ ] Submit with missing fields
- [ ] Submit with invalid data
- [ ] Verify error messages

### Reset Button
- [ ] Click reset button
- [ ] Verify confirmation dialog
- [ ] Verify all data cleared
- [ ] Verify map reset

---

## 📊 Expected Results

### Before Improvements
- GPS errors: Generic messages
- Drawing: Multiple shapes possible
- Images: No compression (5-10MB per image)
- Validation: Basic checks only
- Reset: No confirmation

### After Improvements
- GPS errors: Specific, helpful messages ✅
- Drawing: One shape at a time ✅
- Images: Compressed (500KB-1MB per image) ✅
- Validation: Comprehensive with warnings ✅
- Reset: Confirmation dialog ✅

---

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run preview
```

---

## 📝 Notes

- All improvements are backward compatible
- No breaking changes to API
- Improves user experience significantly
- Reduces server load (smaller images)
- Better error handling

---

**Status:** 📝 Ready to implement  
**Priority:** Medium-High  
**Estimated Time:** 2-3 hours  
**Impact:** High (Better UX, Performance)
