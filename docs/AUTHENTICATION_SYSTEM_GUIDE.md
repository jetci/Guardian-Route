# Authentication System - User Guide

**Version:** 1.0.0  
**Last Updated:** November 9, 2025  
**Sprint:** 3 Week 2

---

## 🎯 Overview

Guardian Route Authentication System เป็นระบบ authentication และ authorization ที่สมบูรณ์ รองรับ JWT tokens, refresh tokens, role-based access control, และ rate limiting

---

## 🔐 Features

### Authentication
- ✅ User Registration (with username/email)
- ✅ User Login (support email or username)
- ✅ JWT Access Token (8 hours expiration)
- ✅ Refresh Token (7 days expiration)
- ✅ Token Refresh
- ✅ Logout (clear refresh token)
- ✅ Token Verification

### Authorization
- ✅ Role-based Access Control (RBAC)
- ✅ 4 Roles: ADMIN, EXECUTIVE, SUPERVISOR, FIELD_OFFICER
- ✅ Role Guards
- ✅ Protected Endpoints

### Security
- ✅ Password Hashing (bcrypt, 10 rounds)
- ✅ Refresh Token Storage in Database
- ✅ Rate Limiting (Login: 5/5min, Register: 3/10min)
- ✅ Activity Logging
- ✅ IP-based Throttling

---

## 📚 API Endpoints

### 1. Register

**Endpoint:** `POST /api/auth/register`

**Description:** ลงทะเบียนผู้ใช้ใหม่ (role เป็น FIELD_OFFICER โดยอัตโนมัติ)

**Rate Limit:** 3 attempts per 10 minutes

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "081-234-5678",
  "department": "IT Department"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "username": "johndoe",
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "phone": "081-234-5678",
  "department": "IT Department",
  "role": "FIELD_OFFICER",
  "isActive": true,
  "createdAt": "2025-11-09T00:00:00.000Z"
}
```

**Validation Rules:**
- `username`: required, min 3 characters
- `email`: required, valid email format
- `password`: required, min 8 characters
- `firstName`: required
- `lastName`: required
- `phone`: optional
- `department`: optional

---

### 2. Register by Admin

**Endpoint:** `POST /api/auth/register-by-admin`

**Description:** ลงทะเบียนผู้ใช้โดย ADMIN (สามารถกำหนด role ได้)

**Authorization:** Bearer Token (ADMIN role required)

**Request Body:**
```json
{
  "username": "supervisor1",
  "email": "supervisor@example.com",
  "password": "SecurePassword123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "081-234-5679",
  "department": "Field Operations",
  "role": "SUPERVISOR"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "username": "supervisor1",
  "email": "supervisor@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "SUPERVISOR",
  "isActive": true,
  "createdAt": "2025-11-09T00:00:00.000Z"
}
```

---

### 3. Login

**Endpoint:** `POST /api/auth/login`

**Description:** เข้าสู่ระบบด้วย email หรือ username

**Rate Limit:** 5 attempts per 5 minutes

**Request Body:**
```json
{
  "email": "admin@guardianroute.com",
  "password": "Password123!"
}
```

**หรือใช้ username:**
```json
{
  "email": "admin",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@guardianroute.com",
    "firstName": "System",
    "lastName": "Administrator",
    "role": "ADMIN"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `401 Unauthorized`: Account is inactive
- `429 Too Many Requests`: Rate limit exceeded

---

### 4. Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Description:** Refresh access token โดยใช้ refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@guardianroute.com",
    "firstName": "System",
    "lastName": "Administrator",
    "role": "ADMIN"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid refresh token
- `401 Unauthorized`: Token expired
- `401 Unauthorized`: Token not found in database

---

### 5. Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** ออกจากระบบ (clear refresh token)

**Authorization:** Bearer Token required

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 6. Get Profile

**Endpoint:** `GET /api/auth/me`

**Description:** ดึงข้อมูลผู้ใช้ปัจจุบัน

**Authorization:** Bearer Token required

**Response (200):**
```json
{
  "id": "uuid",
  "username": "admin",
  "email": "admin@guardianroute.com",
  "firstName": "System",
  "lastName": "Administrator",
  "fullName": "System Administrator",
  "phone": "081-000-0001",
  "department": "IT Department",
  "role": "ADMIN",
  "isActive": true,
  "createdAt": "2025-11-09T00:00:00.000Z",
  "updatedAt": "2025-11-09T00:00:00.000Z"
}
```

---

### 7. Verify Token

**Endpoint:** `POST /api/auth/verify`

**Description:** ตรวจสอบความถูกต้องของ JWT token

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "admin@guardianroute.com",
  "firstName": "System",
  "lastName": "Administrator",
  "role": "ADMIN",
  "isActive": true
}
```

---

## 🔑 Default Users

ระบบมี default users สำหรับ development และ testing:

| Role | Username | Email | Password | Status |
|------|----------|-------|----------|--------|
| ADMIN | admin | admin@guardianroute.com | Password123! | Active |
| EXECUTIVE | executive | executive@guardianroute.com | Password123! | Active |
| SUPERVISOR | supervisor | supervisor@guardianroute.com | Password123! | Active |
| FIELD_OFFICER | officer | officer@guardianroute.com | Password123! | Active |
| TEST | testuser | test@guardianroute.com | Password123! | Inactive |

**การ seed users:**
```bash
cd backend
./scripts/seed-users.sh
```

---

## 🛡️ Role-based Access Control

### Roles Hierarchy
```
ADMIN (highest)
  └── EXECUTIVE
      └── SUPERVISOR
          └── FIELD_OFFICER (lowest)
```

### Role Permissions

**ADMIN:**
- ทุกอย่างที่ EXECUTIVE ทำได้
- จัดการผู้ใช้ (create, update, delete, suspend)
- กำหนด role ให้ผู้ใช้อื่น
- เข้าถึง Admin Dashboard
- จัดการ System Settings

**EXECUTIVE:**
- ทุกอย่างที่ SUPERVISOR ทำได้
- ดู Analytics และ Reports ทั้งหมด
- อนุมัติ/ปฏิเสธ Reports
- จัดการ Incidents ระดับสูง

**SUPERVISOR:**
- ทุกอย่างที่ FIELD_OFFICER ทำได้
- มอบหมาย Tasks ให้ Field Officers
- ตรวจสอบและอนุมัติ Reports
- ดู Analytics ของทีม

**FIELD_OFFICER:**
- สร้างและอัพเดท Incidents
- รับและทำ Tasks ที่ได้รับมอบหมาย
- สร้าง Reports
- ดูข้อมูลของตนเอง

---

## 🔒 Security Best Practices

### Password Requirements
- ✅ ความยาวอย่างน้อย 8 ตัวอักษร
- ✅ ควรมีตัวพิมพ์ใหญ่และเล็ก
- ✅ ควรมีตัวเลข
- ✅ ควรมีอักขระพิเศษ

### Token Management
- ✅ เก็บ Access Token ใน memory (ไม่ใช่ localStorage)
- ✅ เก็บ Refresh Token ใน httpOnly cookie หรือ secure storage
- ✅ Refresh token ก่อนหมดอายุ
- ✅ Logout เมื่อ refresh token หมดอายุ

### Rate Limiting
- ✅ Login: 5 attempts per 5 minutes
- ✅ Register: 3 attempts per 10 minutes
- ✅ Track by IP address

---

## 🧪 Testing

### Manual Testing

**1. Register New User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@guardianroute.com",
    "password": "Password123!"
  }'
```

**3. Get Profile:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**4. Refresh Token:**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

**5. Logout:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🐛 Troubleshooting

### Login Failed
**Problem:** `401 Unauthorized: Invalid credentials`

**Solutions:**
1. ตรวจสอบ email/username และ password
2. ตรวจสอบว่า account active หรือไม่
3. ตรวจสอบว่า user มีอยู่ในระบบ

---

### Token Expired
**Problem:** `401 Unauthorized: Token expired`

**Solutions:**
1. ใช้ refresh token เพื่อขอ access token ใหม่
2. ถ้า refresh token หมดอายุ ให้ login ใหม่

---

### Rate Limit Exceeded
**Problem:** `429 Too Many Requests`

**Solutions:**
1. รอ 5 นาที (สำหรับ login)
2. รอ 10 นาที (สำหรับ register)
3. ตรวจสอบว่าไม่มี script ที่ทำ request บ่อยเกินไป

---

### Refresh Token Invalid
**Problem:** `401 Unauthorized: Invalid refresh token`

**Solutions:**
1. ตรวจสอบว่า token ถูกต้อง
2. ตรวจสอบว่า user ยัง active
3. Login ใหม่เพื่อขอ refresh token ใหม่

---

## 📞 Support

**Issues:** https://github.com/jetci/Guardian-Route/issues  
**Documentation:** `/docs/AUTHENTICATION_SYSTEM_GUIDE.md`  
**API Docs:** `/docs/API_REFERENCE.md`

---

**© 2025 Guardian Route - Authentication System v1.0.0**
