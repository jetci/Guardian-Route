# 🚀 Phase 1 - Quick Start Guide

**Updated:** 11:10 น. - Includes all SA commands  
**Team:** W  
**Status:** 🟢 READY TO EXECUTE

---

## ⚡ Super Quick Start (5 minutes)

### Step 1: Prepare PostgreSQL (2 min)

```bash
# Open psql as superuser (postgres)
psql -U postgres

# Run these commands:
CREATE DATABASE guardian_route;
CREATE USER guardian_admin WITH PASSWORD 'guardian_password_2024';
GRANT ALL PRIVILEGES ON DATABASE guardian_route TO guardian_admin;

# Connect to database
\c guardian_route

# Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

# Verify
SELECT PostGIS_Version();

# Exit
\q
```

### Step 2: Run Automated Script (3 min)

```bash
cd d:\Guardian-Route\backend
execute-phase1.bat
```

**That's it!** The script will:
- ✅ Create .env file (SA Command 1)
- ✅ Validate Prisma schema (SA Command 2)
- ✅ Run migrations
- ✅ Seed database
- ✅ Start backend (SA Command 3)
- ✅ Test health endpoint (SA Command 3)
- ✅ Show completion report (SA Command 4)

---

## 📋 SA's 4 Commands - Checklist

```
✅ [Command 1] Create .env file
   - DATABASE_URL with correct credentials
   - JWT_SECRET="guardianroute2025"
   - File created, not committed to Git

✅ [Command 2] Validate Prisma schema
   - Run: npx prisma validate
   - Must show: "The Prisma schema is valid"
   - No warnings

✅ [Command 3] Test backend after migration
   - Run: npm run start:dev
   - Test: GET http://localhost:3001/health
   - Must return: 200 OK + {"status":"ok"}

✅ [Command 4] Report to SA when complete
   - All conditions met
   - Message: "✅ Phase 1 Complete! พร้อมเริ่ม Phase 2"
```

---

## 🎯 Success Criteria

Phase 1 is complete when ALL of these are true:

```
Database:
✅ PostgreSQL running
✅ Database 'guardian_route' created
✅ User 'guardian_admin' created
✅ PostGIS extension enabled
✅ Permissions granted

Backend:
✅ .env file created with SA credentials
✅ Prisma schema validated (no warnings)
✅ Migrations applied successfully
✅ Seed data inserted
✅ Server running on port 3001
✅ Health check returns 200 OK

Ready:
✅ Can login with test users
✅ Database has sample data
✅ API endpoints responding
✅ Ready for Phase 2 integration
```

---

## 🧪 Test Users (After Completion)

```
Admin:
Email: admin@obtwiang.go.th
Password: password123
Role: ADMIN

Executive:
Email: executive@obtwiang.go.th
Password: password123
Role: EXECUTIVE

Supervisor:
Email: supervisor@obtwiang.go.th
Password: password123
Role: SUPERVISOR

Field Officer:
Email: field@obtwiang.go.th
Password: password123
Role: FIELD_OFFICER
```

---

## 🐛 If Errors Occur

### Error: "Database does not exist"
```bash
# Solution: Create database first
psql -U postgres
CREATE DATABASE guardian_route;
\q
```

### Error: "Role does not exist"
```bash
# Solution: Create user
psql -U postgres
CREATE USER guardian_admin WITH PASSWORD 'guardian_password_2024';
GRANT ALL PRIVILEGES ON DATABASE guardian_route TO guardian_admin;
\q
```

### Error: "PostGIS not found"
```bash
# Solution: Install PostGIS
# Windows: Use Stack Builder or download from postgis.net
# Then enable it:
psql -U postgres -d guardian_route
CREATE EXTENSION postgis;
\q
```

### Error: "Migration failed"
```bash
# Solution: Check DATABASE_URL in .env
# Should be exactly:
DATABASE_URL="postgresql://guardian_admin:guardian_password_2024@localhost:5432/guardian_route?schema=public"
```

### Error: "Health check failed"
```bash
# Solution: Wait a bit longer for server to start
# Then manually test:
# Open browser: http://localhost:3001/health
# Should see: {"status":"ok","timestamp":"..."}
```

---

## 📞 Report to SA

### ✅ Success Report:
```
✅ Phase 1 Complete! พร้อมเริ่ม Phase 2

Status:
- Database: ✅ Created and connected
- PostGIS: ✅ Enabled
- Prisma: ✅ Validated, migrated, seeded
- Backend: ✅ Running on port 3001
- Health: ✅ OK (200)

Test Login:
- All 4 roles working ✅

Ready for Phase 2 Integration! 🚀
```

### ⚠️ Error Report:
```
⚠️ Phase 1 Error - ขอความช่วยเหลือจาก SA

Error: [describe error]
Command: [command that failed]
Screenshot: [attach if possible]

Details:
[paste error message]
```

---

## ⏰ Timeline

```
11:10 - 11:15  PostgreSQL setup (5 min)
11:15 - 11:20  Run execute-phase1.bat (5 min)
11:20 - 11:25  Verify and test (5 min)
11:25 - 11:30  Report to SA (5 min)

Total: 20 minutes (faster than planned!)
```

---

## 🎯 Next Steps (Phase 2)

After Phase 1 complete, SA will provide:
- ✅ api.ts configuration
- ✅ authStore.ts updates
- ✅ incidentService.ts implementation
- ✅ useEffect() integration samples
- ✅ Integration checklist

---

## 📂 Files Created

```
✅ create-env.bat          - Creates .env with SA credentials
✅ execute-phase1.bat      - Complete Phase 1 automation
✅ setup-database.sql      - SQL commands for database
✅ DATABASE-SETUP-GUIDE.md - Detailed guide
✅ PHASE1-QUICK-START.md   - This file
```

---

## 💪 Team W - Ready!

**All scripts prepared!**  
**All commands understood!**  
**All success criteria defined!**

**Execute:** `execute-phase1.bat`  
**Report:** When complete  
**Proceed:** To Phase 2

---

**Team W - Standing by for execution!** 🚀

**Time:** 11:10 น.  
**Status:** 🟢 READY  
**Target:** Phase 1 complete by 11:30 น.
