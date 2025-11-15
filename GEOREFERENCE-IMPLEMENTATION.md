# 🗺️ Georeference Tool Implementation Guide

## ✅ สิ่งที่ทำเสร็จแล้ว (Completed)

### 1. Frontend UI - VillageBoundariesPage
- ✅ เพิ่ม State สำหรับ Georeference Image
  ```typescript
  const [georeferenceImage, setGeoreferenceImage] = useState<{
    url: string;
    opacity: number;
    scale: number;
    rotation: number;
    position: [number, number];
    naturalWidth: number;
    naturalHeight: number;
  } | null>(null);
  ```

- ✅ ฟังก์ชันจัดการภาพ:
  - `handleImageUpload()` - อัปโหลดและโหลดภาพ
  - `handleRemoveGeoreferenceImage()` - ลบภาพ
  - `updateGeoreferenceProperty()` - อัปเดต opacity, scale, rotation
  - `updateGeoreferencePosition()` - อัปเดตตำแหน่ง

- ✅ UI Panel สำหรับ Georeference Tool:
  - ปุ่มอัปโหลดภาพ (JPG, PNG)
  - Slider สำหรับ Opacity (0-100%)
  - Slider สำหรับ Scale (0.1x-5x)
  - Slider สำหรับ Rotation (0-360°)
  - ปุ่มลบภาพ

- ✅ CSS Styling ครบถ้วน

---

## ⏳ สิ่งที่ต้องทำต่อ (TODO)

### 2. Map Component Integration

#### A. แก้ไข VillageBoundaryMap.tsx

**เพิ่ม Props:**
```typescript
interface VillageBoundaryMapProps {
  onBoundaryDrawn?: (geojson: any) => void;
  existingBoundaries?: any[];
  center?: [number, number];
  zoom?: number;
  // NEW:
  georeferenceOverlay?: {
    url: string;
    opacity: number;
    scale: number;
    rotation: number;
    position: [number, number];
    naturalWidth: number;
    naturalHeight: number;
  } | null;
  onGeoreferencePositionChange?: (position: [number, number]) => void;
}
```

**เพิ่ม State และ Refs:**
```typescript
const georeferenceMarkerRef = useRef<L.Marker | null>(null);
const [currentZoom, setCurrentZoom] = useState(zoom);
```

**เพิ่ม useEffect สำหรับ Georeference Overlay:**
```typescript
useEffect(() => {
  if (!mapRef.current || !georeferenceOverlay) return;

  const map = mapRef.current;

  // Remove existing marker
  if (georeferenceMarkerRef.current) {
    map.removeLayer(georeferenceMarkerRef.current);
  }

  // Calculate pixel size based on zoom
  const calculatePixelSize = (zoom: number) => {
    const baseSize = 200; // Base size at zoom 13
    const zoomDiff = zoom - 13;
    return baseSize * Math.pow(2, zoomDiff) * georeferenceOverlay.scale;
  };

  const pixelSize = calculatePixelSize(currentZoom);

  // Create custom icon with image
  const customIcon = L.divIcon({
    className: 'georeference-marker',
    html: `
      <img 
        src="${georeferenceOverlay.url}" 
        style="
          width: ${pixelSize}px;
          opacity: ${georeferenceOverlay.opacity};
          transform: rotate(${georeferenceOverlay.rotation}deg);
          pointer-events: none;
        "
      />
    `,
    iconSize: [pixelSize, pixelSize * (georeferenceOverlay.naturalHeight / georeferenceOverlay.naturalWidth)],
    iconAnchor: [pixelSize / 2, (pixelSize * (georeferenceOverlay.naturalHeight / georeferenceOverlay.naturalWidth)) / 2],
  });

  // Create draggable marker
  const marker = L.marker(georeferenceOverlay.position, {
    icon: customIcon,
    draggable: true,
  }).addTo(map);

  // Handle drag end
  marker.on('dragend', () => {
    const pos = marker.getLatLng();
    if (onGeoreferencePositionChange) {
      onGeoreferencePositionChange([pos.lat, pos.lng]);
    }
  });

  georeferenceMarkerRef.current = marker;

  // Update on zoom
  const handleZoom = () => {
    const newZoom = map.getZoom();
    setCurrentZoom(newZoom);
  };

  map.on('zoom', handleZoom);

  return () => {
    map.off('zoom', handleZoom);
    if (georeferenceMarkerRef.current) {
      map.removeLayer(georeferenceMarkerRef.current);
    }
  };
}, [georeferenceOverlay, currentZoom]);
```

**เพิ่ม CSS:**
```css
.georeference-marker {
  border: none !important;
  background: transparent !important;
}

.georeference-marker img {
  display: block;
}
```

---

### 3. ขอบเขตตำบลเวียง (Tambon Boundary)

#### A. สร้างไฟล์ข้อมูล: `frontend/src/data/mapData.ts`

```typescript
export const tambonWiangBoundary = {
  type: 'Feature',
  properties: {
    name: 'ตำบลเวียง',
    type: 'tambon',
    district: 'อำเภอฝาง',
    province: 'จังหวัดเชียงใหม่',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [99.1800, 19.9500],
      [99.2800, 19.9500],
      [99.2800, 19.8800],
      [99.1800, 19.8800],
      [99.1800, 19.9500],
    ]],
  },
};
```

#### B. แก้ไข VillageBoundaryMap.tsx - เพิ่ม Tambon Layer

```typescript
useEffect(() => {
  if (!mapRef.current) return;

  const map = mapRef.current;

  // Add Tambon boundary layer
  const tambonLayer = L.geoJSON(tambonWiangBoundary, {
    style: {
      color: '#e53e3e',
      weight: 3,
      fillColor: '#feb2b2',
      fillOpacity: 0.1,
    },
  }).addTo(map);

  return () => {
    map.removeLayer(tambonLayer);
  };
}, []);
```

#### C. เพิ่มตัวเลือกแก้ไขตำบล

ใน `VillageBoundariesPage.tsx`:
```typescript
<select value={selectedVillageNo} onChange={...}>
  <option value="">-- เลือกพื้นที่ --</option>
  <option value="tambon">ขอบเขตตำบลเวียง</option>
  {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
    <option key={num} value={num}>หมู่ {num}</option>
  ))}
</select>
```

---

## 🎯 ขั้นตอนการทำงาน (Workflow)

### การใช้ Georeference Tool:

1. **อัปโหลดภาพ:**
   - คลิกปุ่ม "📷 เลือกภาพ"
   - เลือกไฟล์ JPG หรือ PNG
   - ภาพจะปรากฏที่กลางแผนที่

2. **ปรับแต่งภาพ:**
   - ลาก Slider "ความโปร่งใส" เพื่อปรับ opacity
   - ลาก Slider "ขนาด" เพื่อขยาย/ย่อภาพ
   - ลาก Slider "การหมุน" เพื่อหมุนภาพ

3. **วางตำแหน่ง:**
   - คลิกและลากภาพไปวางตำแหน่งที่ต้องการ
   - ซูมแผนที่เข้า/ออก - ภาพจะขยาย/ย่อตาม

4. **วาดขอบเขต:**
   - ใช้เครื่องมือวาดของ Leaflet Draw
   - วาดตามขอบเขตที่เห็นในภาพ
   - บันทึกขอบเขต

5. **ลบภาพ:**
   - คลิกปุ่ม "🗑️ ลบภาพอ้างอิง" เมื่อเสร็จ

---

## 📝 หมายเหตุสำคัญ

### Performance Considerations:
- ใช้ `URL.createObjectURL()` แทนการ encode เป็น base64
- ต้อง `URL.revokeObjectURL()` เมื่อลบภาพเพื่อป้องกัน memory leak
- อัปเดต icon เฉพาะเมื่อ zoom เปลี่ยน (ไม่ใช่ทุก frame)

### Browser Compatibility:
- รองรับ Chrome, Firefox, Edge, Safari
- ต้องการ HTML5 File API
- ต้องการ Canvas API สำหรับ image processing

### File Size Limits:
- แนะนำ: < 5MB
- รองรับ: JPG, PNG
- ไม่รองรับ: GIF, SVG, WebP (ยัง)

---

## 🔧 Testing Checklist

- [ ] อัปโหลดภาพ JPG ได้
- [ ] อัปโหลดภาพ PNG ได้
- [ ] ปรับ Opacity ได้
- [ ] ปรับ Scale ได้
- [ ] ปรับ Rotation ได้
- [ ] ลากภาพได้
- [ ] ภาพขยาย/ย่อตามการซูม
- [ ] ลบภาพได้
- [ ] ไม่มี memory leak
- [ ] ทำงานบน mobile (responsive)

---

## 📚 References

- [Leaflet Documentation](https://leafletjs.com/)
- [Leaflet Draw](https://leaflet.github.io/Leaflet.draw/)
- [GeoJSON Specification](https://geojson.org/)
- [HTML5 File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
