# Guardian Route - Backend API

NestJS backend API with PostgreSQL + PostGIS

## 🚀 Setup

```bash
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

## 📚 API Documentation

Swagger UI: http://localhost:3001/api/docs

## 👥 Test Users

| Email | Password | Role |
|-------|----------|------|
| admin@obtwiang.go.th | password123 | ADMIN |
| executive@obtwiang.go.th | password123 | EXECUTIVE |
| supervisor@obtwiang.go.th | password123 | SUPERVISOR |
| field@obtwiang.go.th | password123 | FIELD_OFFICER |

## 🗄️ Database Schema

- **User** - ผู้ใช้งานระบบ (4 roles)
- **Incident** - เหตุการณ์สาธารณภัย
- **Task** - งานที่มอบหมาย
- **Survey** - การสำรวจพื้นที่
- **Report** - รายงาน
- **ActivityLog** - บันทึกการใช้งาน
- **SystemConfig** - การตั้งค่าระบบ

## 🛠️ Tech Stack

- **Framework:** NestJS 10+
- **Language:** TypeScript
- **Database:** PostgreSQL 15 + PostGIS
- **ORM:** Prisma
- **Auth:** JWT + Passport
- **Validation:** class-validator
- **API Docs:** Swagger/OpenAPI
