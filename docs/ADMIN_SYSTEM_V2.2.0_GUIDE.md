# Admin System v2.2.0 - User Guide

**Version:** 2.2.0  
**Last Updated:** November 9, 2025  
**New Features:** GeoJSON History, Polygon Undo/Redo, Custom Layers, Settings Notifications

---

## 🎯 What's New in v2.2.0

### 1. 📜 GeoJSON History Log
- บันทึกประวัติการเปลี่ยนแปลง GeoJSON ทุกครั้ง
- ดูประวัติแต่ละ version
- เปรียบเทียบ versions
- Restore เป็น version เก่าได้

### 2. ↩️ Polygon Undo/Redo
- แก้ไข Polygon ด้วย Undo/Redo
- รองรับ keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- เก็บประวัติสูงสุด 50 actions
- Visual feedback แสดงสถานะ

### 3. 🎨 Custom Layer Editor
- สร้าง Custom Layers บนแผนที่
- จัดการ Layer order (z-index)
- เปิด/ปิด Layer visibility
- Export เป็น GeoJSON

### 4. 🔔 Settings Change Notifications
- แจ้งเตือนเมื่อมีการเปลี่ยน Settings
- Notification bell ที่ header
- Mark as read/unread
- Auto-refresh ทุก 30 วินาที

---

## 📚 Feature Guides

### GeoJSON History Log

#### การเข้าถึง
1. ไปที่ **Admin Dashboard** → **ขอบเขตภูมิศาสตร์** tab
2. คลิกที่ **GeoJSON** ที่ต้องการดูประวัติ
3. เลือก **ดูประวัติ** จาก Actions menu
4. Modal จะแสดงประวัติทั้งหมด

#### ฟีเจอร์
**ตารางประวัติ:**
- **Version:** เลข version (เริ่มจาก 1)
- **ชื่อ:** ชื่อ GeoJSON ณ เวลานั้น
- **ประเภท:** village, district, province, custom
- **การเปลี่ยนแปลง:** CREATE, UPDATE, DELETE, RESTORE
- **เปลี่ยนโดย:** Username ของผู้เปลี่ยน
- **วันที่:** วันเวลาที่เปลี่ยน

**Actions:**
- **ดูรายละเอียด:** แสดง JSON details
- **Restore:** กู้คืนเป็น version นี้

#### การ Restore Version
1. คลิกปุ่ม **Restore** (ไอคอน ↩️)
2. ยืนยันการ restore
3. GeoJSON จะถูกอัพเดทเป็น version ที่เลือก
4. ระบบจะบันทึกเป็น RESTORE ใน history

---

### Polygon Editor with Undo/Redo

#### การใช้งาน
1. ไปที่ **GeoJSON Management**
2. คลิก **แก้ไข** GeoJSON
3. Polygon Editor จะเปิดขึ้น

#### Toolbar
- **Undo (↶):** ย้อนกลับ 1 action (Ctrl+Z)
- **Redo (↷):** ทำซ้ำ 1 action (Ctrl+Y)
- **History Counter:** แสดง position ใน history (เช่น 5/10)
- **มีการเปลี่ยนแปลง:** Badge สีส้มแสดงว่ามีการแก้ไข
- **ยกเลิก:** ยกเลิกการแก้ไข (ถ้ามีการเปลี่ยนแปลงจะถามยืนยัน)
- **บันทึก:** บันทึกการเปลี่ยนแปลง

#### Drawing Tools (ด้านขวาบนแผนที่)
- **Draw a marker:** วาด marker
- **Draw a polyline:** วาดเส้น
- **Draw a polygon:** วาด polygon
- **Draw a rectangle:** วาดสี่เหลี่ยม
- **Draw a circle:** วาดวงกลม
- **Edit layers:** แก้ไข shapes ที่มีอยู่
- **Delete layers:** ลบ shapes

#### Keyboard Shortcuts
- **Ctrl+Z:** Undo
- **Ctrl+Y:** Redo
- **Ctrl+Shift+Z:** Redo (alternative)

#### Tips
- ระบบจะเก็บประวัติทุก action อัตโนมัติ
- สูงสุด 50 actions
- ถ้าทำ Undo แล้ววาดใหม่ → ประวัติข้างหน้าจะถูกลบ
- กดบันทึกเมื่อเสร็จแล้วเท่านั้น

---

### Custom Layer Editor

#### การเข้าถึง
1. ไปที่ **Admin Dashboard**
2. เลือก **Custom Layers** tab

#### การสร้าง Layer ใหม่
1. คลิกปุ่ม **สร้าง Layer**
2. กรอกข้อมูล:
   - **ชื่อ Layer:** (required)
   - **คำอธิบาย:** (optional)
   - **ประเภท:** marker, polygon, polyline, circle
   - **GeoJSON:** JSON object ของ geometry
   - **Fill Color:** สีเติม (สำหรับ polygon/circle)
   - **Stroke Color:** สีขอบ
   - **Opacity:** ความโปร่งใส (0-1)
3. คลิก **สร้าง**

#### การจัดการ Layers
**Layer Order:**
- ใช้ปุ่ม **↑** และ **↓** เพื่อเปลี่ยนลำดับ
- Layer ที่อยู่บนสุดจะแสดงทับ Layer ล่าง

**Visibility:**
- คลิกไอคอน **👁️** เพื่อเปิด/ปิด Layer
- สีเขียว = เปิด, สีเทา = ปิด

**Actions Menu:**
- **แก้ไข:** แก้ไขข้อมูล Layer
- **คัดลอก:** สร้าง Layer ใหม่จากต้นฉบับ
- **ลบ:** ลบ Layer

#### การ Export
1. คลิกปุ่ม **Export GeoJSON**
2. ไฟล์ `custom-layers.geojson` จะถูกดาวน์โหลด
3. Format: GeoJSON FeatureCollection
4. แต่ละ Feature มี properties ของ Layer

#### GeoJSON Format Example
```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [98.9853, 18.7883]
  }
}
```

---

### Settings Change Notifications

#### การเข้าถึง
- Notification bell อยู่ที่มุมขวาบนของ Admin Dashboard
- Badge สีแดงแสดงจำนวนการแจ้งเตือนที่ยังไม่อ่าน

#### ฟีเจอร์
**Notification List:**
- แสดงการแจ้งเตือนล่าสุด 10 รายการ
- พื้นหลังสีฟ้า = ยังไม่อ่าน
- พื้นหลังขาว = อ่านแล้ว

**แต่ละ Notification แสดง:**
- **Setting ที่เปลี่ยน:** เช่น "การตั้งค่าแผนที่", "Gemini AI"
- **เปลี่ยนโดย:** Username
- **วันเวลา:** Thai format

**Actions:**
- **คลิก Notification:** ทำเครื่องหมายว่าอ่านแล้ว
- **Menu → ทำเครื่องหมายว่าอ่านแล้ว:** Mark as read
- **Menu → ลบ:** ลบการแจ้งเตือน

**Footer Buttons:**
- **แสดงทั้งหมด / แสดงเฉพาะที่ยังไม่อ่าน:** Toggle filter
- **อ่านทั้งหมด:** Mark all as read

#### Auto-Refresh
- ระบบจะ refresh ทุก 30 วินาทีอัตโนมัติ
- ไม่ต้องรีเฟรชหน้าเว็บ

---

## 🔧 Technical Details

### API Endpoints (New in v2.2.0)

**GeoJSON History:**
```
GET    /api/admin/geojson/:id/history
GET    /api/admin/geojson/:id/history/stats
GET    /api/admin/geojson/:id/history/:version
GET    /api/admin/geojson/:id/history/compare?version1=1&version2=2
POST   /api/admin/geojson/:id/history/:version/restore
```

**Custom Layers:**
```
POST   /api/admin/layers
GET    /api/admin/layers
GET    /api/admin/layers/stats
GET    /api/admin/layers/export
GET    /api/admin/layers/:id
PATCH  /api/admin/layers/:id
PATCH  /api/admin/layers/:id/toggle-visibility
POST   /api/admin/layers/reorder
POST   /api/admin/layers/:id/clone
DELETE /api/admin/layers/:id
DELETE /api/admin/layers
```

**Settings Notifications:**
```
GET    /api/admin/notifications
GET    /api/admin/notifications/stats
PATCH  /api/admin/notifications/:id/read
POST   /api/admin/notifications/mark-all-read
DELETE /api/admin/notifications/:id
```

### Database Models (New)

**GeoBoundaryHistory:**
- id, boundaryId, version, name, type, geojson
- properties, changeType, changeDetails
- changedBy, changedAt

**CustomLayer:**
- id, name, description, type, geojson
- style, zIndex, isVisible, metadata
- createdBy, createdAt, updatedAt

**SettingsNotification:**
- id, settingKey, oldValue, newValue
- changedBy, notifiedTo[], isRead, createdAt

---

## 📊 Statistics

**Total API Endpoints:** 51 (27 from v2.1.0 + 24 new)

**Backend Services:**
- GeoJsonHistoryService (7 methods)
- SettingsNotificationService (8 methods)
- CustomLayerService (11 methods)

**Frontend Components:**
- GeoJSONHistoryViewer
- SettingsNotifications
- PolygonEditorWithUndo
- CustomLayerEditor

---

## 🎓 Best Practices

### GeoJSON History
1. ตรวจสอบประวัติก่อน Restore
2. ใช้ Compare เพื่อดูความแตกต่าง
3. Restore จะสร้าง version ใหม่ (ไม่ลบประวัติเดิม)

### Polygon Editor
1. บันทึกบ่อยๆ เพื่อไม่สูญเสียข้อมูล
2. ใช้ Undo/Redo แทนการลบและวาดใหม่
3. ตรวจสอบ History counter เพื่อดู position

### Custom Layers
1. ตั้งชื่อ Layer ให้ชัดเจน
2. ใช้ z-index เพื่อควบคุมการแสดงผล
3. Export เป็น backup ก่อนลบ Layer สำคัญ

### Settings Notifications
1. อ่านการแจ้งเตือนทุกครั้ง
2. ลบการแจ้งเตือนเก่าเป็นระยะ
3. ตรวจสอบ Settings ที่เปลี่ยนก่อนดำเนินการต่อ

---

## 🐛 Troubleshooting

### GeoJSON History ไม่แสดง
**สาเหตุ:** GeoJSON ยังไม่มีประวัติ  
**แก้ไข:** Upload หรือแก้ไข GeoJSON อย่างน้อย 1 ครั้ง

### Undo/Redo ไม่ทำงาน
**สาเหตุ:** ไม่มีประวัติใน stack  
**แก้ไข:** ตรวจสอบ History counter, ถ้าเป็น 1/1 แสดงว่าไม่มีประวัติ

### Custom Layer ไม่แสดงบนแผนที่
**สาเหตุ:** Layer ถูกปิด (isVisible = false)  
**แก้ไข:** คลิกไอคอน 👁️ เพื่อเปิด Layer

### Notification ไม่แสดง
**สาเหตุ:** ยังไม่มีการเปลี่ยน Settings  
**แก้ไข:** ทดสอบโดยเปลี่ยน Settings ใดๆ

---

## 📞 Support

**Issues:** https://github.com/jetci/Guardian-Route/issues  
**Documentation:** `/docs/ADMIN_SYSTEM_V2.2.0_GUIDE.md`  
**API Docs:** `/docs/API_REFERENCE.md`

---

**© 2025 Guardian Route - Admin System v2.2.0**
