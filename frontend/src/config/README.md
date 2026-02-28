# Configuration Files

โฟลเดอร์นี้เก็บไฟล์ configuration ต่างๆ ของแอปพลิเคชัน

## 📁 ไฟล์ในโฟลเดอร์นี้

### `mapConfig.json`
ไฟล์ configuration สำหรับระบบแผนที่ (Leaflet.js)

**ประกอบด้วย:**
- **defaultCenter**: จุดศูนย์กลางเริ่มต้นของแผนที่ (ตำบลเวียง)
- **defaultZoom**: ระดับ zoom เริ่มต้น
- **bounds**: ขอบเขตพื้นที่ที่แสดงในแผนที่
- **tileLayers**: ชั้นแผนที่ต่างๆ (OpenStreetMap, Satellite, Terrain)
- **markerIcons**: ไอคอนสำหรับ marker แต่ละประเภท
- **polygonStyles**: สไตล์สำหรับ polygon (หมู่บ้าน, พื้นที่เสี่ยง)
- **clustering**: การตั้งค่า marker clustering
- **geolocation**: การตั้งค่า GPS/Location
- **offline**: การตั้งค่า offline mode

### `mapConfig.ts`
ไฟล์ TypeScript สำหรับ import `mapConfig.json` พร้อม type definitions

**วิธีใช้งาน:**
```typescript
import mapConfig from '@/config/mapConfig';

// ใช้ค่า default center
const center = mapConfig.defaultCenter;

// ใช้ tile layer
const tileUrl = mapConfig.tileLayers.default.url;

// ใช้ marker icon
const floodIcon = mapConfig.markerIcons.incident.flood;
```

## 🔧 การปรับแต่ง

### เปลี่ยนจุดศูนย์กลางแผนที่
แก้ไขใน `mapConfig.json`:
```json
{
  "defaultCenter": {
    "lat": 19.9167,
    "lng": 99.2333,
    "description": "ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่"
  }
}
```

### เพิ่ม Tile Layer ใหม่
แก้ไขใน `mapConfig.json`:
```json
{
  "tileLayers": {
    "custom": {
      "name": "Custom Map",
      "url": "https://your-tile-server/{z}/{x}/{y}.png",
      "attribution": "Your attribution",
      "maxZoom": 18
    }
  }
}
```

### เปลี่ยนไอคอน Marker
แก้ไขใน `mapConfig.json`:
```json
{
  "markerIcons": {
    "incident": {
      "flood": "🌊"
    }
  }
}
```

## 📚 อ้างอิง

- [Leaflet Documentation](https://leafletjs.com/)
- [React Leaflet](https://react-leaflet.js.org/)
- [OpenStreetMap](https://www.openstreetmap.org/)

## 💡 Tips

1. **ใช้ environment variables** สำหรับค่าที่แตกต่างกันในแต่ละ environment
2. **ทดสอบบนแผนที่จริง** หลังจากเปลี่ยนค่า configuration
3. **ระวังเรื่อง attribution** - ต้องแสดง attribution ของ tile provider ตามกฎหมาย
4. **Offline mode** - ระวังเรื่อง storage quota ของเบราว์เซอร์
