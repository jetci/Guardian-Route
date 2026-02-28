# 📦 Installation Notes - Guardian Route

**วันที่:** 28 พฤศจิกายน 2568  
**สถานะ:** Phase 1-3 Complete

---

## ⚠️ Dependencies ที่ต้องติดตั้ง

### Backend Dependencies

#### 1. Turf.js (สำหรับ GeoJSON Validation)
```bash
cd backend
npm install @turf/turf
npm install --save-dev @types/turf
```

**ใช้ใน:**
- `backend/src/villages/villages.service.ts`
- ตรวจสอบ self-intersections
- คำนวณ bounding box
- Validate geometry

---

## ✅ Dependencies ที่มีอยู่แล้ว

### Frontend
- ✅ react-leaflet
- ✅ leaflet
- ✅ react-hot-toast
- ✅ react-router-dom
- ✅ recharts
- ✅ chakra-ui

### Backend
- ✅ @nestjs/core
- ✅ @nestjs/swagger
- ✅ @nestjs/platform-express
- ✅ @prisma/client
- ✅ multer
- ✅ sharp

---

## 🚀 Quick Start

### 1. ติดตั้ง Backend Dependencies
```bash
cd backend
npm install @turf/turf
npm install --save-dev @types/turf
```

### 2. Generate OpenAPI Spec
```bash
cd backend
npm run generate:openapi
```

### 3. Start Backend
```bash
cd backend
npm run start:dev
```

### 4. Start Frontend
```bash
cd frontend
npm run dev
```

---

## 📋 Feature Checklist

### Phase 1 ✅
- [x] Settings Page (6 tabs)
- [x] Survey Form (Leaflet Geoman)
- [x] OpenAPI Spec Generation

### Phase 2 ✅
- [x] Executive Reports Page
- [x] Executive Budget Page

### Phase 3 ✅
- [x] Admin GeoJSON Upload
- [x] GeoJSON Validation
- [x] Map Preview

### Phase 4 (Next)
- [ ] Data Version Control
- [ ] Bulk Operations
- [ ] Advanced Validation

---

## 🔗 Important URLs

### Development
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api/docs
- OpenAPI JSON: http://localhost:3001/api/docs-json

### Key Pages
- Developer Dashboard: http://localhost:5173/dashboard/developer
- Settings Page: http://localhost:5173/settings
- Executive Reports: http://localhost:5173/developer/executive/reports
- Executive Budget: http://localhost:5173/developer/executive/budget
- Admin Data: http://localhost:5173/developer/admin/data

---

## 📊 Progress Summary

| Phase | Status | Features | Progress |
|-------|--------|----------|----------|
| Phase 1 | ✅ Complete | 3 features | 100% |
| Phase 2 | ✅ Complete | 2 features | 100% |
| Phase 3 | ✅ Complete | 1 feature | 100% |
| **Total** | **65%** | **6 features** | **13/20 menus** |

---

## 🎯 Next Steps

1. **Install @turf/turf** in backend
2. **Test GeoJSON Upload** with sample data
3. **Start Phase 4** (optional)
4. **Deploy to Production** (when ready)

---

**Last Updated:** 28 พฤศจิกายน 2568, 13:45 น.
