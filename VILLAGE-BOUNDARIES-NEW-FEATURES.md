# 🚀 ฟีเจอร์ใหม่ - หน้ากำหนดขอบเขตหมู่บ้าน

**วันที่**: 21 พฤศจิกายน 2025  
**ผู้พัฒนา**: Team W  
**Version**: 1.2.0

---

## ✅ ฟีเจอร์ที่เพิ่มเสร็จแล้ว

### 1. 📥 Export แบบเลือกเฉพาะหมู่บ้าน ✅

#### คุณสมบัติ
- เปิด Modal สำหรับเลือกหมู่บ้านที่ต้องการส่งออก
- แสดงรายการหมู่บ้านทั้งหมดที่มีขอบเขต
- แสดงสีประจำหมู่พร้อม checkbox
- ปุ่ม "เลือกทั้งหมด" และ "ยกเลิกทั้งหมด"
- แสดงจำนวนที่เลือก
- ส่งออกเฉพาะที่เลือก หรือทั้งหมด
- ชื่อไฟล์แสดงจำนวนที่ส่งออก

#### การใช้งาน
1. คลิกปุ่ม "📥 ส่งออก GeoJSON"
2. Modal จะเปิดขึ้นแสดงรายการหมู่บ้าน
3. เลือกหมู่บ้านที่ต้องการ (หรือเลือกทั้งหมด)
4. คลิก "📥 ส่งออก (X หมู่)"
5. ไฟล์จะถูกดาวน์โหลดอัตโนมัติ

#### ไฟล์ที่แก้ไข
- `VillageBoundariesPage.tsx` (เพิ่ม state และ functions)
- `VillageBoundariesPage.css` (เพิ่ม modal styles)

#### Code Highlights

**State Management:**
```typescript
const [showExportModal, setShowExportModal] = useState(false);
const [selectedVillagesForExport, setSelectedVillagesForExport] = useState<string[]>([]);
```

**Export Functions:**
```typescript
const handleExportGeoJSON = () => {
  // Show modal for selection
  setSelectedVillagesForExport([]);
  setShowExportModal(true);
};

const handleConfirmExport = () => {
  const villagesToExport = selectedVillagesForExport.length > 0
    ? villageBoundaries.filter(v => selectedVillagesForExport.includes(v.id) && v.boundary)
    : villageBoundaries.filter(v => v.boundary);
  
  // Create GeoJSON and download
  const featureCollection = {
    type: 'FeatureCollection',
    features: villagesToExport.map(v => ({
      type: 'Feature',
      properties: { villageNo: v.villageNo, name: v.name, id: v.id },
      geometry: v.boundary,
    })),
  };
  
  // Download file
  const filename = selectedVillagesForExport.length > 0
    ? `village-boundaries-selected-${villagesToExport.length}-${date}.geojson`
    : `village-boundaries-all-${date}.geojson`;
};
```

**Modal UI:**
```tsx
{showExportModal && (
  <div className="modal-overlay">
    <div className="modal-content export-modal">
      <div className="modal-header">
        <h2>📥 ส่งออกขอบเขตหมู่บ้าน</h2>
        <button className="modal-close">✕</button>
      </div>
      
      <div className="modal-body">
        <div className="selection-controls">
          <button onClick={selectAllVillages}>✅ เลือกทั้งหมด</button>
          <button onClick={deselectAllVillages}>❌ ยกเลิกทั้งหมด</button>
          <span>เลือกแล้ว: {selectedVillagesForExport.length} หมู่</span>
        </div>
        
        <div className="villages-selection-list">
          {/* Village items with checkboxes */}
        </div>
      </div>
      
      <div className="modal-footer">
        <button onClick={() => setShowExportModal(false)}>❌ ยกเลิก</button>
        <button onClick={handleConfirmExport}>📥 ส่งออก</button>
      </div>
    </div>
  </div>
)}
```

---

## 🔄 ฟีเจอร์ที่รอดำเนินการ

### 2. 📁 Import GeoJSON แบบ Batch (รอดำเนินการ)

#### แนวทางการพัฒนา

**คุณสมบัติที่ควรมี:**
- อัปโหลดหลายไฟล์ GeoJSON พร้อมกัน
- แสดง preview ของแต่ละไฟล์ก่อนนำเข้า
- ตรวจสอบความถูกต้องของ GeoJSON
- แสดง progress bar ระหว่างนำเข้า
- รายงานผลการนำเข้า (สำเร็จ/ล้มเหลว)
- ตัวเลือก: เขียนทับหรือข้าม

**Implementation Steps:**

1. **เพิ่ม State:**
```typescript
const [showImportModal, setShowImportModal] = useState(false);
const [importFiles, setImportFiles] = useState<File[]>([]);
const [importProgress, setImportProgress] = useState<{
  current: number;
  total: number;
  status: 'idle' | 'processing' | 'completed' | 'error';
}>({ current: 0, total: 0, status: 'idle' });
```

2. **File Upload Handler:**
```typescript
const handleBatchUpload = async (files: File[]) => {
  setImportFiles(files);
  setShowImportModal(true);
  
  // Validate files
  const validFiles = files.filter(f => 
    f.name.endsWith('.json') || f.name.endsWith('.geojson')
  );
  
  if (validFiles.length === 0) {
    toast.error('ไม่พบไฟล์ GeoJSON ที่ถูกต้อง');
    return;
  }
  
  // Show preview
  const previews = await Promise.all(
    validFiles.map(async (file) => {
      const text = await file.text();
      const geojson = JSON.parse(text);
      return { file, geojson, valid: validateGeoJSON(geojson) };
    })
  );
  
  setImportPreviews(previews);
};
```

3. **Batch Import Function:**
```typescript
const handleConfirmBatchImport = async () => {
  setImportProgress({ current: 0, total: importFiles.length, status: 'processing' });
  
  const results = [];
  
  for (let i = 0; i < importFiles.length; i++) {
    try {
      const file = importFiles[i];
      const text = await file.text();
      const geojson = JSON.parse(text);
      
      await boundariesService.uploadGeoJSON({
        name: file.name.replace(/\.(geo)?json$/i, ''),
        type: 'custom',
        geojson: geojson,
      });
      
      results.push({ file: file.name, status: 'success' });
      setImportProgress(prev => ({ ...prev, current: i + 1 }));
    } catch (error) {
      results.push({ file: importFiles[i].name, status: 'error', error });
    }
  }
  
  setImportProgress(prev => ({ ...prev, status: 'completed' }));
  
  // Show results
  const successCount = results.filter(r => r.status === 'success').length;
  toast.success(`นำเข้าสำเร็จ ${successCount}/${importFiles.length} ไฟล์`);
  
  await loadBoundaries();
  setShowImportModal(false);
};
```

4. **UI Components:**
```tsx
<div className="import-modal">
  <h2>📁 นำเข้า GeoJSON แบบ Batch</h2>
  
  {/* File List */}
  <div className="import-files-list">
    {importFiles.map((file, index) => (
      <div key={index} className="import-file-item">
        <span>{file.name}</span>
        <span>{(file.size / 1024).toFixed(2)} KB</span>
        {importProgress.current > index && <span>✅</span>}
      </div>
    ))}
  </div>
  
  {/* Progress Bar */}
  {importProgress.status === 'processing' && (
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
      />
      <span>{importProgress.current} / {importProgress.total}</span>
    </div>
  )}
  
  {/* Actions */}
  <button onClick={handleConfirmBatchImport}>
    📁 นำเข้าทั้งหมด
  </button>
</div>
```

---

### 3. ↩️ Undo/Redo สำหรับการวาด (รอดำเนินการ)

#### แนวทางการพัฒนา

**คุณสมบัติที่ควรมี:**
- เก็บประวัติการวาดทุกครั้ง
- ปุ่ม Undo และ Redo
- Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- แสดงจำนวนขั้นตอนที่สามารถ undo ได้
- จำกัดประวัติไม่เกิน 20 ขั้นตอน

**Implementation Steps:**

1. **History State:**
```typescript
const [drawHistory, setDrawHistory] = useState<any[]>([]);
const [historyIndex, setHistoryIndex] = useState(-1);
const MAX_HISTORY = 20;
```

2. **Add to History:**
```typescript
const addToHistory = (geojson: any) => {
  // Remove any redo history
  const newHistory = drawHistory.slice(0, historyIndex + 1);
  
  // Add new state
  newHistory.push(geojson);
  
  // Limit history size
  if (newHistory.length > MAX_HISTORY) {
    newHistory.shift();
  }
  
  setDrawHistory(newHistory);
  setHistoryIndex(newHistory.length - 1);
};
```

3. **Undo/Redo Functions:**
```typescript
const handleUndo = () => {
  if (historyIndex > 0) {
    setHistoryIndex(historyIndex - 1);
    setDrawnBoundary(drawHistory[historyIndex - 1]);
    toast('↩️ Undo', { icon: 'ℹ️' });
  }
};

const handleRedo = () => {
  if (historyIndex < drawHistory.length - 1) {
    setHistoryIndex(historyIndex + 1);
    setDrawnBoundary(drawHistory[historyIndex + 1]);
    toast('↪️ Redo', { icon: 'ℹ️' });
  }
};
```

4. **Keyboard Shortcuts:**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        handleRedo();
      }
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [historyIndex, drawHistory]);
```

5. **UI Buttons:**
```tsx
<div className="history-controls">
  <button 
    onClick={handleUndo} 
    disabled={historyIndex <= 0}
    title="Undo (Ctrl+Z)"
  >
    ↩️ Undo
  </button>
  <button 
    onClick={handleRedo} 
    disabled={historyIndex >= drawHistory.length - 1}
    title="Redo (Ctrl+Y)"
  >
    ↪️ Redo
  </button>
  <span className="history-info">
    {historyIndex + 1} / {drawHistory.length}
  </span>
</div>
```

---

### 4. 👁️ Preview ก่อนบันทึก (รอดำเนินการ)

#### แนวทางการพัฒนา

**คุณสมบัติที่ควรมี:**
- แสดง preview ของขอบเขตที่วาด
- แสดงข้อมูลสรุป (พื้นที่, จำนวนจุด, พิกัดกลาง)
- เปรียบเทียบกับขอบเขตเดิม (ถ้ามี)
- ตัวเลือก: บันทึก, แก้ไข, ยกเลิก

**Implementation Steps:**

1. **Preview State:**
```typescript
const [showPreview, setShowPreview] = useState(false);
const [previewData, setPreviewData] = useState<{
  boundary: any;
  name: string;
  villageNo: number | '';
  area: number;
  pointsCount: number;
  centerPoint: [number, number];
} | null>(null);
```

2. **Calculate Preview Data:**
```typescript
const calculatePreviewData = (geojson: any) => {
  const coords = geojson.geometry.coordinates[0];
  
  // Calculate area
  const area = Math.abs(coords.reduce((sum: number, coord: number[], i: number) => {
    const j = (i + 1) % coords.length;
    return sum + (coord[0] * coords[j][1] - coords[j][0] * coord[1]);
  }, 0) / 2);
  const areaKm2 = (area * 111 * 111 / 1000000).toFixed(2);
  
  // Calculate center
  let sumLat = 0, sumLng = 0;
  coords.forEach((coord: number[]) => {
    sumLng += coord[0];
    sumLat += coord[1];
  });
  const centerPoint: [number, number] = [
    sumLng / coords.length,
    sumLat / coords.length
  ];
  
  return {
    boundary: geojson,
    name: boundaryName,
    villageNo: selectedVillageNo,
    area: parseFloat(areaKm2),
    pointsCount: coords.length,
    centerPoint,
  };
};
```

3. **Show Preview:**
```typescript
const handleShowPreview = () => {
  if (!drawnBoundary) {
    toast.error('กรุณาวาดขอบเขตก่อน');
    return;
  }
  
  const preview = calculatePreviewData(drawnBoundary);
  setPreviewData(preview);
  setShowPreview(true);
};
```

4. **Preview UI:**
```tsx
{showPreview && previewData && (
  <div className="preview-modal">
    <h2>👁️ ตรวจสอบก่อนบันทึก</h2>
    
    <div className="preview-info">
      <div className="info-item">
        <label>ชื่อ:</label>
        <strong>{previewData.name}</strong>
      </div>
      <div className="info-item">
        <label>หมู่:</label>
        <strong>{previewData.villageNo || 'ไม่ระบุ'}</strong>
      </div>
      <div className="info-item">
        <label>พื้นที่:</label>
        <strong>{previewData.area} ตร.กม.</strong>
      </div>
      <div className="info-item">
        <label>จำนวนจุด:</label>
        <strong>{previewData.pointsCount} จุด</strong>
      </div>
      <div className="info-item">
        <label>พิกัดกลาง:</label>
        <strong>
          {previewData.centerPoint[1].toFixed(6)}, 
          {previewData.centerPoint[0].toFixed(6)}
        </strong>
      </div>
    </div>
    
    {/* Mini Map Preview */}
    <div className="preview-map">
      <VillageBoundaryMap
        existingBoundaries={[]}
        center={previewData.centerPoint}
        zoom={14}
        // Show only the drawn boundary
      />
    </div>
    
    <div className="preview-actions">
      <button onClick={() => setShowPreview(false)}>
        ✏️ แก้ไข
      </button>
      <button onClick={() => {
        setShowPreview(false);
        handleSaveDrawnBoundary();
      }}>
        💾 บันทึก
      </button>
    </div>
  </div>
)}
```

5. **Replace Save Button:**
```tsx
{/* Replace direct save with preview */}
<button onClick={handleShowPreview}>
  👁️ ตรวจสอบและบันทึก
</button>
```

---

## 📋 สรุปการพัฒนา

### ✅ เสร็จแล้ว
1. **Export แบบเลือกเฉพาะหมู่บ้าน** - ใช้งานได้แล้ว

### 🔄 รอดำเนินการ
2. **Import GeoJSON แบบ Batch** - มีแนวทางแล้ว
3. **Undo/Redo สำหรับการวาด** - มีแนวทางแล้ว
4. **Preview ก่อนบันทึก** - มีแนวทางแล้ว

---

## 🚀 การใช้งาน

### Export แบบเลือกเฉพาะหมู่บ้าน
1. คลิกปุ่ม "📥 ส่งออก GeoJSON"
2. เลือกหมู่บ้านที่ต้องการ
3. คลิก "📥 ส่งออก"
4. ไฟล์จะถูกดาวน์โหลด

---

## 📝 หมายเหตุสำหรับการพัฒนาต่อ

1. **Import Batch**: ควรเพิ่มการตรวจสอบ duplicate และ conflict resolution
2. **Undo/Redo**: ควรเก็บ history ใน localStorage เพื่อกู้คืนได้หลัง refresh
3. **Preview**: ควรเพิ่มการเปรียบเทียบกับขอบเขตเดิม (overlay)
4. **Performance**: ถ้ามีหมู่บ้านเยอะ ควรใช้ virtualization สำหรับ list

---

**สถานะ**: 🔄 กำลังพัฒนา  
**Version**: 1.2.0  
**Last Updated**: 2025-11-21 08:33 UTC+7
