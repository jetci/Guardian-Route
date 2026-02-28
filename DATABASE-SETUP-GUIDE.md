# 🗄️ Database Setup Guide - Phase 1

**Project:** Guardian Route  
**Date:** November 13, 2025  
**Time:** 11:04 น.  
**Phase:** 1 - Database Setup  
**Duration:** 30 minutes

---

## 📋 Prerequisites

### Required Software
- ✅ PostgreSQL 14+ installed
- ✅ pgAdmin or psql command line tool
- ✅ Node.js 18+ installed
- ✅ npm installed

---

## 🔧 Step-by-Step Setup

### Step 1: Create Database (5 min)

#### Option A: Using psql Command Line
```bash
# Login to PostgreSQL as superuser
psql -U postgres

# Create database
CREATE DATABASE guardian_route;

# Create user
CREATE USER guardian_admin WITH PASSWORD 'guardian_password_2024';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE guardian_route TO guardian_admin;

# Exit psql
\q
```

#### Option B: Using pgAdmin
1. Open pgAdmin
2. Right-click "Databases" → "Create" → "Database"
3. Name: `guardian_route`
4. Owner: Create new role `guardian_admin` with password `guardian_password_2024`
5. Save

---

### Step 2: Enable PostGIS Extension (2 min)

```bash
# Connect to the database
psql -U postgres -d guardian_route

# Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

# Verify PostGIS is installed
SELECT PostGIS_Version();

# Exit
\q
```

**Expected Output:**
```
PostGIS_Version
-----------------
3.x.x XXXX
```

---

### Step 3: Configure Backend Environment (3 min)

```bash
# Navigate to backend directory
cd d:\Guardian-Route\backend

# Copy .env.example to .env
copy .env.example .env

# Edit .env file with your database credentials
```

**Update `.env` file:**
```env
# Database Configuration
DATABASE_URL="postgresql://guardian_admin:guardian_password_2024@localhost:5432/guardian_route?schema=public"

# JWT Authentication
JWT_SECRET="guardian-route-jwt-secret-2024-production-key"
JWT_EXPIRATION="8h"
REFRESH_TOKEN_SECRET="guardian-route-refresh-token-secret-2024"
REFRESH_TOKEN_EXPIRATION="7d"

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./uploads"

# Logging
LOG_LEVEL="debug"
```

---

### Step 4: Run Prisma Migrations (10 min)

```bash
# Make sure you're in backend directory
cd d:\Guardian-Route\backend

# Install dependencies (if not already installed)
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# This will:
# 1. Create all tables in the database
# 2. Set up relationships
# 3. Create indexes
# 4. Apply constraints
```

**Expected Output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "guardian_route"

Applying migration `20231113_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20231113_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client
```

---

### Step 5: Seed Initial Data (5 min)

```bash
# Run seed script
npx prisma db seed

# This will create:
# - 4 test users (one for each role)
# - Sample incidents
# - Sample reports
# - Sample tasks
```

**Expected Output:**
```
Running seed command: ts-node prisma/seed.ts
🌱 Seeding database...
✅ Created 4 users
✅ Created 5 incidents
✅ Created 8 reports
✅ Created 12 tasks
✅ Created 10 notifications
🎉 Seeding completed!
```

---

### Step 6: Verify Database (5 min)

```bash
# Open Prisma Studio to verify data
npx prisma studio

# This will open http://localhost:5555
# Check all tables have data
```

**Or verify via psql:**
```bash
psql -U guardian_admin -d guardian_route

# Check tables
\dt

# Check users
SELECT id, username, email, role FROM "User";

# Check incidents
SELECT id, title, type, severity, status FROM "Incident";

# Exit
\q
```

---

### Step 7: Test Backend Connection (5 min)

```bash
# Start backend server
npm run start:dev

# Watch for successful startup messages
```

**Expected Output:**
```
[Nest] INFO [NestFactory] Starting Nest application...
[Nest] INFO [InstanceLoader] AppModule dependencies initialized
[Nest] INFO [InstanceLoader] DatabaseModule dependencies initialized
[Nest] INFO [InstanceLoader] AuthModule dependencies initialized
[Nest] INFO [InstanceLoader] UsersModule dependencies initialized
[Nest] INFO [InstanceLoader] IncidentsModule dependencies initialized
[Nest] INFO [InstanceLoader] ReportsModule dependencies initialized
[Nest] INFO [InstanceLoader] TasksModule dependencies initialized
[Nest] INFO [NestApplication] Nest application successfully started
[Nest] INFO Application is running on: http://localhost:3001
```

**Test API endpoint:**
```bash
# In another terminal
curl http://localhost:3001/health

# Expected response:
{"status":"ok","timestamp":"2025-11-13T04:04:00.000Z"}
```

---

## ✅ Verification Checklist

```
Database Setup:
☐ PostgreSQL installed and running
☐ Database 'guardian_route' created
☐ User 'guardian_admin' created with correct password
☐ PostGIS extension enabled
☐ .env file configured correctly
☐ Prisma migrations completed (0 errors)
☐ Seed data inserted successfully
☐ All tables visible in database
☐ Backend server starts without errors
☐ API health check responds
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "role 'guardian_admin' does not exist"
```bash
# Solution: Create the role first
psql -U postgres
CREATE USER guardian_admin WITH PASSWORD 'guardian_password_2024';
GRANT ALL PRIVILEGES ON DATABASE guardian_route TO guardian_admin;
\q
```

### Issue 2: "PostGIS extension not found"
```bash
# Solution: Install PostGIS
# Windows: Use Stack Builder (comes with PostgreSQL installer)
# Or download from: https://postgis.net/install/
```

### Issue 3: "Migration failed"
```bash
# Solution: Reset database and try again
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Issue 4: "Cannot connect to database"
```bash
# Solution: Check PostgreSQL is running
# Windows: Services → PostgreSQL → Start
# Or: pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start
```

### Issue 5: "Seed script fails"
```bash
# Solution: Check seed.ts for errors
# Make sure all migrations ran first
npx prisma generate
npx prisma db seed
```

---

## 📊 Test Users Created by Seed

After seeding, you can login with these accounts:

```
Admin User:
Email: admin@obtwiang.go.th
Password: password123
Role: ADMIN

Executive User:
Email: executive@obtwiang.go.th
Password: password123
Role: EXECUTIVE

Supervisor User:
Email: supervisor@obtwiang.go.th
Password: password123
Role: SUPERVISOR

Field Officer User:
Email: field@obtwiang.go.th
Password: password123
Role: FIELD_OFFICER
```

---

## 🎯 Success Criteria

Phase 1 is complete when:
- ✅ Database created and accessible
- ✅ PostGIS extension enabled
- ✅ All migrations applied (0 errors)
- ✅ Seed data inserted successfully
- ✅ Backend server starts and runs
- ✅ API responds to health check
- ✅ Can login with test users

---

## 📞 Report to SA

When Phase 1 is complete, report:

```
✅ Phase 1 Complete!

Database Status:
- Database: guardian_route ✅
- User: guardian_admin ✅
- PostGIS: Enabled ✅
- Tables: [count] created ✅
- Seed Data: Inserted ✅
- Backend: Running on port 3001 ✅
- API Health: OK ✅

Ready for Phase 2: Integration!
```

---

**Created by:** Team W  
**For:** SA - Guardian Route Project  
**Status:** 🟢 Ready to Execute
