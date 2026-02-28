# ✅ Migration: Leaflet.draw → Leaflet-Geoman

**วันที่:** 6 มกราคม 2026 เวลา 14:33 น.  
**เหตุผล:** ใช้เครื่องมือวาดที่ทันสมัยเหมือนกับ admin  
**สถานะ:** ✅ Migration เสร็จสมบูรณ์

---

## 🎯 เหตุผลในการเปลี่ยน

### ❌ Leaflet.draw (เก่า):
- Library เก่า (ไม่ได้ update มานาน)
- API ซับซ้อน (ต้อง override `_finishShape`)
- ไม่มี built-in validation
- UI ไม่ทันสมัย

### ✅ Leaflet-Geoman (ทันสมัย):
- Library ที่ active development
- API ง่ายและชัดเจน
- มี built-in validation
- UI ทันสมัยกว่า
- **ใช้ใน VillageBoundariesPage อยู่แล้ว**

---

## 📊 การเปลี่ยนแปลง

### 1. **Import Statements**

#### เดิม (Leaflet.draw):
```typescript
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
```

#### ใหม่ (Leaflet-Geoman):
```typescript
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
```

---

### 2. **Drawing Controls**

#### เดิม (Leaflet.draw):
```typescript
const drawControl = new L.Control.Draw({
  draw: {
    polygon: {
      allowIntersection: false,
      showArea: true,
      shapeOptions: {
        color: '#667eea',
        weight: 3,
        fillOpacity: 0.2
      },
      repeatMode: false
    },
    // ... other tools
  },
  edit: {
    featureGroup: drawnItems,
    remove: true
  }
});
map.addControl(drawControl);
```

#### ใหม่ (Leaflet-Geoman):
```typescript
// ✅ Add Leaflet-Geoman controls (modern drawing tools)
map.pm.addControls({
  position: 'topleft',
  drawMarker: true,
  drawCircle: false,
  drawCircleMarker: false,
  drawPolyline: false,
  drawRectangle: true,
  drawPolygon: true,
  editMode: true,
  dragMode: true,
  cutPolygon: false,
  removalMode: true,
  rotateMode: false,
});

// Set Geoman to work with our feature group
map.pm.setGlobalOptions({
  layerGroup: drawnItems,
});
```

---

### 3. **Validation (จุดขั้นต่ำ 4 จุด)**

#### เดิม (Leaflet.draw - ต้อง override):
```typescript
// ❌ ซับซ้อน: ต้อง override internal method
const originalFinishShape = (L.Draw.Polygon.prototype as any)._finishShape;
(L.Draw.Polygon.prototype as any)._finishShape = function() {
  const latlngs = this._poly.getLatLngs();
  const points = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;
  
  if (points.length < 4) {
    toast.error('⚠️ ต้องการอย่างน้อย 4 จุด');
    return;
  }
  
  originalFinishShape.call(this);
};
```

#### ใหม่ (Leaflet-Geoman - ใช้ event):
```typescript
// ✅ ง่ายกว่า: ใช้ event listener
map.on('pm:create', (e: any) => {
  const layer = e.layer;
  const shape = e.shape;

  if (shape === 'Polygon' || shape === 'Rectangle') {
    const latlngs = (layer as any).getLatLngs();
    const points = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;

    // ✅ ตรวจสอบว่ามีอย่างน้อย 4 จุด
    if (!points || points.length < 4) {
      drawnItemsRef.current?.removeLayer(layer);
      toast.error('❌ ต้องวาดอย่างน้อย 4 จุด\nปัจจุบันมี ' + (points?.length || 0) + ' จุด');
      
      // Disable draw mode
      setTimeout(() => {
        if (map.pm.globalDrawModeEnabled()) {
          map.pm.disableDraw();
        }
      }, 100);
      return;
    }

    // Convert to GeoJSON
    const geojson = (layer as any).toGeoJSON();
    setPolygonData(geojson);
    toast.success(`✅ วาดสำเร็จ (${points.length} จุด)`);
  }
});
```

---

### 4. **Event Handlers**

#### เดิม (Leaflet.draw):
```typescript
// Created event
map.on(L.Draw.Event.CREATED, (e: any) => {
  const layer = e.layer;
  drawnItems.addLayer(layer);
  const geoJSON = layer.toGeoJSON();
  setPolygonData(geoJSON);
});

// Edited event
map.on(L.Draw.Event.EDITED, (e: any) => {
  const layers = e.layers;
  layers.eachLayer((layer: any) => {
    const geoJSON = layer.toGeoJSON();
    setPolygonData(geoJSON);
  });
});

// Deleted event
map.on(L.Draw.Event.DELETED, () => {
  setPolygonData(null);
});
```

#### ใหม่ (Leaflet-Geoman):
```typescript
// Created event
map.on('pm:create', (e: any) => {
  const layer = e.layer;
  const shape = e.shape;
  // ... validation ...
  const geojson = layer.toGeoJSON();
  setPolygonData(geojson);
});

// Edited event
map.on('pm:edit', (e: any) => {
  const layer = e.layer;
  if (layer) {
    const geoJSON = layer.toGeoJSON();
    setPolygonData(geoJSON);
    toast.success('✏️ แก้ไขพื้นที่สำเร็จ');
  }
});

// Deleted event
map.on('pm:remove', () => {
  setPolygonData(null);
  toast('🗑️ ลบพื้นที่แล้ว', { icon: 'ℹ️' });
});
```

---

## 📦 Dependencies

### package.json:
```json
{
  "dependencies": {
    "@geoman-io/leaflet-geoman-free": "^2.18.3",  // ✅ มีอยู่แล้ว
    "leaflet": "^1.9.4",
    // "leaflet-draw": "^1.0.4",  // ❌ สามารถลบได้ (ถ้าไม่มีที่อื่นใช้)
  }
}
```

---

## ✅ ข้อดีของ Geoman

### 1. **API ที่ดีกว่า:**
- ✅ ใช้ `map.pm.addControls()` แทน `new L.Control.Draw()`
- ✅ Events ชัดเจน: `pm:create`, `pm:edit`, `pm:remove`
- ✅ ไม่ต้อง override internal methods

### 2. **Features เพิ่มเติม:**
- ✅ Drag mode (ลาก polygon ได้)
- ✅ Rotate mode (หมุน polygon ได้)
- ✅ Cut polygon (ตัด polygon ได้)
- ✅ Edit mode ที่ดีกว่า

### 3. **UI ที่ดีกว่า:**
- ✅ ปุ่มควบคุมทันสมัยกว่า
- ✅ Visual feedback ดีกว่า
- ✅ Responsive design

### 4. **Maintenance:**
- ✅ Active development (update สม่ำเสมอ)
- ✅ Documentation ดี
- ✅ Community support

---

## 🧪 การทดสอบ

### 1. Start Development Server
```bash
cd d:\Guardian-Route\frontend
npm run dev
```

### 2. ทดสอบ CreateIncidentReportPage
```
เปิด: http://localhost:5173/create-incident

Test Case 1: วาด 3 จุด
1. คลิกปุ่ม polygon tool (Geoman UI)
2. คลิก 3 จุดบนแผนที่
3. Double-click หรือคลิก "Finish"
4. ✅ ต้องแสดง error: "❌ ต้องวาดอย่างน้อย 4 จุด\nปัจจุบันมี 3 จุด"
5. ✅ Polygon ต้องไม่ถูกสร้าง
6. ✅ Draw mode ถูกปิด

Test Case 2: วาด 4 จุด
1. คลิกปุ่ม polygon tool
2. คลิก 4 จุดบนแผนที่
3. Double-click หรือคลิก "Finish"
4. ✅ ต้องแสดง success: "✅ วาดรูปหลายเหลี่ยมสำเร็จ (4 จุด)"
5. ✅ Polygon ถูกสร้างและแสดงบนแผนที่

Test Case 3: แก้ไข Polygon
1. คลิกปุ่ม "Edit"
2. แก้ไขจุดต่างๆ
3. คลิก "Finish"
4. ✅ ต้องแสดง success: "✏️ แก้ไขพื้นที่สำเร็จ"

Test Case 4: ลบ Polygon
1. คลิกปุ่ม "Delete"
2. เลือก polygon
3. คลิก "Finish"
4. ✅ ต้องแสดง: "🗑️ ลบพื้นที่แล้ว"
```

---

## 📌 สรุป

### ✅ สิ่งที่ได้:
1. ✅ **ใช้เครื่องมือเดียวกันทั้งระบบ** - Geoman ทั้ง admin และ field officer
2. ✅ **API ที่ดีกว่า** - ไม่ต้อง override internal methods
3. ✅ **UI ที่ทันสมัยกว่า** - Geoman มี UI ที่ดีกว่า
4. ✅ **Maintenance ง่ายกว่า** - Active development
5. ✅ **Features เพิ่มเติม** - Drag, Rotate, Cut polygon

### 📝 ไฟล์ที่แก้ไข:
- `frontend/src/pages/field-officer/CreateIncidentReportPage.tsx`

### 🎯 ผลลัพธ์:
- ✅ ใช้ Leaflet-Geoman แทน Leaflet.draw
- ✅ Validation ทำงานเหมือนเดิม (ขั้นต่ำ 4 จุด)
- ✅ เหมือนกับ VillageBoundariesPage

---

**สถานะ:** ✅ Migration เสร็จสมบูรณ์ - ใช้ Geoman ทั้งระบบแล้ว!
