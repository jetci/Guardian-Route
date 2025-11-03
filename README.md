# 🛡️ Guardian Route Dashboard

ระบบแดชบอร์ดเชิงภูมิสารสนเทศสำหรับการจัดการสาธารณภัย  
**องค์การบริหารส่วนตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่**

## 📋 Overview

Guardian Route Dashboard เป็นระบบจัดการสาธารณภัยแบบครบวงจร ที่ออกแบบมาโดยเฉพาะสำหรับหน่วยงานป้องกันและบรรเทาสาธารณภัย รองรับการทำงานแบบ Role-Based Access Control (RBAC) สำหรับ:

- 👮 **Field Officer** - เจ้าหน้าที่ภาคสนาม
- 👔 **Supervisor** - หัวหน้างาน
- 📊 **Executive** - ผู้บริหาร
- 🔧 **Admin** - ผู้ดูแลระบบ

## 🌟 Key Features

- 🗺️ **Interactive Geospatial Dashboard** - แผนที่แบบ real-time
- 📱 **Progressive Web App (PWA)** - ใช้งานแบบ offline ได้
- 🤖 **AI-Powered Analysis** - วิเคราะห์ความเสียหายด้วย Gemini API
- 📝 **Digital Reporting** - ระบบรายงานดิจิทัล
- 📊 **Analytics & KPIs** - Dashboard สำหรับผู้บริหาร
- 🏘️ **Village Management** - จัดการข้อมูล 20 หมู่บ้านในตำบลเวียง

## 🛠️ Tech Stack

### Backend
- **Framework:** NestJS + TypeScript
- **Database:** PostgreSQL 15 + PostGIS
- **ORM:** Prisma
- **Auth:** JWT
- **API Docs:** Swagger/OpenAPI

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Maps:** Leaflet.js + React Leaflet
- **AI:** Google Gemini API

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 15+ with PostGIS
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

Backend จะรันที่: http://localhost:3001  
API Docs: http://localhost:3001/api/docs

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

Frontend จะรันที่: http://localhost:5173

### Docker Setup (Optional)

```bash
# Start PostgreSQL with PostGIS
docker-compose up -d
```

## 📚 Documentation

- [Work Orders](./docs/work-orders/) - การมอบหมายงานแต่ละ Phase
- [Architecture](./docs/architecture/) - สถาปัตยกรรมระบบ
- [API Specs](./docs/architecture/api-specs.md) - API Documentation
- [User Guides](./docs/user-guides/) - คู่มือการใช้งาน

## 🏘️ Coverage Area

ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่ - **20 หมู่บ้าน:**

1. หนองตุ้ม
2. ป่าบง
3. เต๋าดิน, เวียงสุทโธ
4. สวนดอก
5. ต้นหนุน
6. สันทรายคองน้อย
7. แม่ใจใต้
8. แม่ใจเหนือ
9. ริมฝาง, สันป่าไหน่
10. ห้วยเฮี่ยน, สันป่ายางยาง
11. ท่าสะแล
12. โป่งถืบ
13. ห้วยบอน
14. เสาหิน
15. โป่งถืบใน
16. ปางผึ้ง
17. ใหม่คองน้อย
18. ศรีดอนชัย
19. ใหม่ชยาราม
20. สระนิคม

## 👥 Test Accounts

```
Admin:      admin@obtwiang.go.th / password123
Supervisor: supervisor@obtwiang.go.th / password123
Field:      field@obtwiang.go.th / password123
Executive:  executive@obtwiang.go.th / password123
```

## 🗓️ Development Timeline

- **Phase 1:** Foundation (Week 1-3) - Setup & Auth ✅
- **Phase 2:** Incident Management (Week 4-7) - Map & Tasks
- **Phase 3:** Field Survey + AI (Week 8-12)
- **Phase 4:** Report System (Week 13-16)
- **Phase 5:** Executive Dashboard (Week 17-19)
- **Phase 6:** Admin + PWA (Week 20-22)
- **Phase 7:** Testing & Deploy (Week 23-24)

## 📄 License

MIT License - See [LICENSE](./LICENSE) file

## 🤝 Contributing

This project is developed for องค์การบริหารส่วนตำบลเวียง.  
For contributions, please contact the development team.

## 📞 Contact

- **Organization:** องค์การบริหารส่วนตำบลเวียง
- **Location:** ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
- **Developer:** Manus AI Development Team

---

**Built with ❤️ for the safety of Tambon Wiang community**
