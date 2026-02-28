# 📝 Commit Message Convention

โปรเจกต์นี้ใช้ **Conventional Commits** สำหรับการเขียน commit message เพื่อให้ประวัติการเปลี่ยนแปลงอ่านง่ายและสามารถสร้าง changelog อัตโนมัติได้

## 📐 รูปแบบ

```
<type>(<scope>): <subject>

<body>

<footer>
```

### ส่วนประกอบ

#### 1. **Type** (บังคับ)
ประเภทของการเปลี่ยนแปลง:

| Type | คำอธิบาย | ตัวอย่าง |
|------|----------|----------|
| `feat` | ฟีเจอร์ใหม่ | `feat(auth): add JWT refresh token` |
| `fix` | แก้ไข bug | `fix(map): correct polygon rendering` |
| `docs` | เอกสาร | `docs(readme): update installation guide` |
| `style` | การจัดรูปแบบโค้ด (ไม่เปลี่ยนตรรกะ) | `style(frontend): format with prettier` |
| `refactor` | ปรับปรุงโครงสร้างโค้ด | `refactor(api): simplify error handling` |
| `perf` | ปรับปรุงประสิทธิภาพ | `perf(db): add index to village table` |
| `test` | เพิ่มหรือแก้ไข test | `test(auth): add login unit tests` |
| `build` | เปลี่ยนแปลง build system | `build(docker): update postgres version` |
| `ci` | เปลี่ยนแปลง CI configuration | `ci(github): add lint workflow` |
| `chore` | งานบำรุงรักษาทั่วไป | `chore(deps): update dependencies` |
| `revert` | ยกเลิก commit ก่อนหน้า | `revert: feat(auth): add JWT` |

#### 2. **Scope** (ไม่บังคับ)
ส่วนของโค้ดที่เปลี่ยนแปลง:

- `auth` - Authentication/Authorization
- `map` - Map/GIS features
- `incident` - Incident management
- `task` - Task management
- `report` - Report generation
- `survey` - Survey system
- `user` - User management
- `village` - Village data
- `api` - API endpoints
- `db` - Database
- `ui` - User Interface
- `frontend` - Frontend general
- `backend` - Backend general

#### 3. **Subject** (บังคับ)
คำอธิบายสั้นๆ เกี่ยวกับการเปลี่ยนแปลง:

- ใช้ present tense ("add" ไม่ใช่ "added")
- ไม่ต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่
- ไม่ต้องใส่ `.` ท้ายประโยค
- ควรไม่เกิน 50 ตัวอักษร

#### 4. **Body** (ไม่บังคับ)
คำอธิบายโดยละเอียด:

- อธิบาย **อะไร** และ **ทำไม** (ไม่ใช่ **อย่างไร**)
- แยกจาก subject ด้วยบรรทัดว่าง
- ใช้ present tense
- สามารถมีหลายย่อหน้าได้

#### 5. **Footer** (ไม่บังคับ)
ข้อมูลเพิ่มเติม:

- **Breaking changes**: ขึ้นต้นด้วย `BREAKING CHANGE:`
- **Issue references**: `Closes #123`, `Fixes #456`

---

## ✅ ตัวอย่าง Commit Messages

### ตัวอย่างที่ดี ✅

```bash
# Feature ใหม่
feat(auth): add JWT refresh token mechanism

Implement refresh token to extend user session without
requiring re-login. Token expires after 7 days.

Closes #42

# Bug fix
fix(map): correct polygon rendering on mobile devices

The polygon was not rendering correctly on iOS Safari
due to coordinate precision issues.

# Documentation
docs(api): add Swagger documentation for incident endpoints

# Refactoring
refactor(incident): extract validation logic to separate service

# Breaking change
feat(api)!: change incident status enum values

BREAKING CHANGE: Status values changed from lowercase to UPPERCASE.
Migration script provided in prisma/migrations.

Closes #89
```

### ตัวอย่างที่ไม่ดี ❌

```bash
# ไม่มี type
Updated the login page

# Subject ยาวเกินไป
feat(auth): add new authentication system with JWT tokens and refresh tokens and remember me functionality

# ใช้ past tense
fix(map): fixed the polygon bug

# ไม่ชัดเจน
fix: bug fixes

# มี typo และไม่เป็นมาตรฐาน
Fix: Update some files
```

---

## 🔧 เครื่องมือช่วยเขียน Commit

### 1. Commitizen (แนะนำ)
```bash
# ติดตั้ง
npm install -g commitizen cz-conventional-changelog

# ใช้งาน
git cz
```

### 2. Commitlint (ตรวจสอบ commit message)
```bash
# ติดตั้ง
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# จะทำงานอัตโนมัติผ่าน Husky
```

---

## 📚 อ้างอิง

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)

---

## 💡 Tips

1. **Commit บ่อยๆ** - แต่ละ commit ควรทำเรื่องเดียว
2. **ใช้ type ให้ถูกต้อง** - จะช่วยในการสร้าง changelog
3. **เขียน subject ให้ชัดเจน** - คนอื่นควรเข้าใจได้โดยไม่ต้องดูโค้ด
4. **ใส่ body เมื่อจำเป็น** - อธิบาย "ทำไม" มากกว่า "อย่างไร"
5. **Reference issue** - เชื่อมโยงกับ issue/task ที่เกี่ยวข้อง

---

**Happy Committing! 🚀**
