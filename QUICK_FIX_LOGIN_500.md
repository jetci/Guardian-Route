# 🔴 URGENT: Quick Login 500 Error Fix

**Date:** 19 Jan 2026, 13:20 PM  
**Issue:** Quick Login ได้ 500 error  
**Root Cause:** Database ไม่มี users และ schema ไม่ตรงกัน

---

## 🎯 Quick Fix (เลือก 1 วิธี)

### วิธีที่ 1: Reset Database (แนะนำ - ใช้เวลา 2 นาที)

```powershell
cd d:\Guardian-Route\backend

# Reset database และ seed ใหม่
npx prisma migrate reset --force

# Seed จะรันอัตโนมัติหลัง reset
```

**ข้อดี:**
- ✅ แก้ปัญหาได้หมด
- ✅ Database สะอาด
- ✅ Schema ตรงกัน 100%

**ข้อเสีย:**
- ❌ ข้อมูลเก่าหายหมด (ถ้ามี)

---

### วิธีที่ 2: สร้าง Users เอง (ถ้าไม่อยากลบข้อมูล)

```powershell
cd d:\Guardian-Route\backend
npx prisma studio
```

จากนั้นสร้าง users ด้วยตัวเอง:

**1. Developer:**
- email: `jetci.jm@gmail.com`
- password: (hash ของ `g0KEk,^],k;yo`)
- role: `DEVELOPER`
- firstName: `Jetci`
- lastName: `Developer`

**2. Admin:**
- email: `admin@obtwiang.go.th`
- password: (hash ของ `password123`)
- role: `ADMIN`
- firstName: `Admin`
- lastName: `User`

**3. Supervisor:**
- email: `supervisor@obtwiang.go.th`
- password: (hash ของ `password123`)
- role: `SUPERVISOR`
- firstName: `Supervisor`
- lastName: `User`

**4. Executive:**
- email: `executive@obtwiang.go.th`
- password: (hash ของ `password123`)
- role: `EXECUTIVE`
- firstName: `Executive`
- lastName: `User`

**5. Field Officer:**
- email: `field@obtwiang.go.th`
- password: (hash ของ `password123`)
- role: `FIELD_OFFICER`
- firstName: `Field`
- lastName: `Officer`

**หมายเหตุ:** ต้อง hash password ด้วย bcrypt (10 rounds)

---

## ✅ แนะนำ: ใช้วิธีที่ 1 (Reset)

เพราะ:
1. ง่ายและรวดเร็ว
2. แก้ปัญหา schema ไม่ตรงกันด้วย
3. ได้ข้อมูล villages 13 หมู่บ้านด้วย
4. ได้ users ครบทุก role

---

## 🚀 คำสั่งเดียวจบ

```powershell
cd d:\Guardian-Route\backend && npx prisma migrate reset --force
```

หลังจากนั้น:
1. รอ seed เสร็จ (ประมาณ 10-20 วินาที)
2. ลอง Quick Login อีกครั้ง
3. ควรใช้งานได้แล้ว! ✅

---

## 📋 ตรวจสอบหลัง Reset

```powershell
# ตรวจสอบ users
node -e "const { PrismaClient } = require('@prisma/client'); const p = new PrismaClient(); p.user.count().then(c => console.log('Users:', c)).finally(() => p.$disconnect());"

# ตรวจสอบ villages
node check-villages.js
```

**Expected:**
- Users: 5 (Developer, Admin, Supervisor, Executive, Field Officer)
- Villages: 13

---

## ⚠️ ข้อควรระวัง

หาก database มีข้อมูลสำคัญ:
1. **Backup ก่อน:**
   ```powershell
   pg_dump guardian_route > backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql
   ```

2. **แล้วค่อย reset:**
   ```powershell
   npx prisma migrate reset --force
   ```

---

## 🎯 หลังจาก Fix แล้ว

ทดสอบ Quick Login:
1. เปิด http://localhost:5173
2. คลิก "Developer" button
3. ควรเข้าสู่ระบบได้ทันที ✅

---

**STATUS:** 🔴 Waiting for Action  
**ACTION:** Run `npx prisma migrate reset --force`  
**TIME:** ~2 minutes
