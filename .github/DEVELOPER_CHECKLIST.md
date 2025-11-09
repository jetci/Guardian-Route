# 📋 Developer Daily Checklist

เช็คลิสต์รายวันสำหรับนักพัฒนา Guardian Route

---

## 🌅 เริ่มวัน (Morning Routine)

- [ ] Pull latest code จาก `main` หรือ `develop`
  ```bash
  git checkout develop
  git pull origin develop
  ```
- [ ] ตรวจสอบว่า dependencies ล่าสุดหรือยัง
  ```bash
  cd backend && npm install
  cd ../frontend && npm install --legacy-peer-deps
  ```
- [ ] เริ่ม Docker services
  ```bash
  docker-compose up -d
  ```
- [ ] ตรวจสอบ database connection
  ```bash
  cd backend && npx prisma studio
  ```
- [ ] อ่าน notifications/issues/PRs ที่ assigned ให้

---

## 💻 ระหว่างการพัฒนา (During Development)

### ก่อนเริ่มงานใหม่
- [ ] สร้าง branch ใหม่จาก `develop`
  ```bash
  git checkout -b feat/feature-name
  # หรือ
  git checkout -b fix/bug-name
  ```
- [ ] ตรวจสอบว่า issue/task ที่จะทำมีรายละเอียดชัดเจน
- [ ] อ่าน acceptance criteria

### ระหว่างเขียนโค้ด
- [ ] ทดสอบโค้ดบน browser/device จริง
- [ ] ตรวจสอบ console ไม่มี error
- [ ] ลบ `console.log` ที่ไม่จำเป็นออก
- [ ] เขียน comment สำหรับโค้ดที่ซับซ้อน
- [ ] ตรวจสอบว่าไม่มีการ hardcode ข้อมูลลับ
- [ ] ใช้ TypeScript types อย่างถูกต้อง
- [ ] ทดสอบ edge cases

### ก่อน Commit
- [ ] รัน linter
  ```bash
  npm run lint:backend  # หรือ lint:frontend
  ```
- [ ] รัน formatter
  ```bash
  npm run format:all
  ```
- [ ] ทดสอบว่าโค้ดทำงานได้
- [ ] ตรวจสอบว่า commit เฉพาะไฟล์ที่เกี่ยวข้อง
  ```bash
  git status
  git diff
  ```
- [ ] เขียน commit message ตาม convention
  ```bash
  git commit -m "feat(scope): description"
  ```

---

## 🔍 ก่อนสร้าง Pull Request

### Code Quality
- [ ] โค้ดผ่าน linter โดยไม่มี error
- [ ] โค้ดถูก format ด้วย Prettier
- [ ] ไม่มี TypeScript errors
- [ ] ไม่มี console.log หรือ debug code
- [ ] ไม่มี commented code ที่ไม่จำเป็น

### Testing
- [ ] ทดสอบบน Chrome
- [ ] ทดสอบบน Firefox
- [ ] ทดสอบบน Safari (ถ้าเกี่ยวกับ UI)
- [ ] ทดสอบบนมือถือ (ถ้าเกี่ยวกับ UI)
- [ ] ทดสอบ offline mode (ถ้าเกี่ยวข้อง)
- [ ] ทดสอบ edge cases
- [ ] ทดสอบ error handling

### Documentation
- [ ] อัปเดต README (ถ้าจำเป็น)
- [ ] อัปเดต API docs (ถ้าเปลี่ยน API)
- [ ] เขียน JSDoc/TSDoc สำหรับ functions สำคัญ
- [ ] อัปเดต CHANGELOG (ถ้ามี)

### Security
- [ ] ไม่มีการ commit `.env` file
- [ ] ไม่มี API keys หรือ secrets ใน code
- [ ] ตรวจสอบ SQL injection (ถ้าเกี่ยวกับ database)
- [ ] ตรวจสอบ XSS vulnerabilities (ถ้าเกี่ยวกับ input)
- [ ] ตรวจสอบ authentication/authorization

### Performance
- [ ] ไม่มี unnecessary re-renders (React)
- [ ] ใช้ lazy loading ที่เหมาะสม
- [ ] Optimize images (ถ้ามี)
- [ ] ตรวจสอบ bundle size (ถ้าเพิ่ม dependencies)

---

## 📤 สร้าง Pull Request

- [ ] Push branch ขึ้น GitHub
  ```bash
  git push origin feat/feature-name
  ```
- [ ] สร้าง PR จาก branch ไปยัง `develop`
- [ ] กรอก PR template ให้ครบถ้วน
  - [ ] Description ชัดเจน
  - [ ] Type of change ถูกต้อง
  - [ ] Checklist ครบ
  - [ ] Screenshots (ถ้าเกี่ยวกับ UI)
  - [ ] How to test ชัดเจน
- [ ] Link related issue
- [ ] Tag reviewers
- [ ] ตรวจสอบว่า CI/CD ผ่าน

---

## 👀 Review Pull Request (เมื่อเป็น Reviewer)

### Code Review
- [ ] อ่าน description และ acceptance criteria
- [ ] ตรวจสอบว่าโค้ดทำตาม requirements
- [ ] ตรวจสอบ code quality
- [ ] ตรวจสอบ naming conventions
- [ ] ตรวจสอบ error handling
- [ ] ตรวจสอบ edge cases

### Testing
- [ ] Pull branch มาทดสอบบนเครื่องตัวเอง
  ```bash
  git fetch origin
  git checkout feat/feature-name
  npm install
  ```
- [ ] ทดสอบตาม "How to test" ใน PR
- [ ] ทดสอบ edge cases เพิ่มเติม

### Feedback
- [ ] ให้ feedback ที่สร้างสรรค์
- [ ] ใช้ "Suggest changes" สำหรับ minor fixes
- [ ] Approve หรือ Request changes
- [ ] Comment ชัดเจนและเป็นมิตร

---

## 🌙 สิ้นวัน (End of Day)

- [ ] Commit และ push งานที่ทำค้างไว้
- [ ] อัปเดต status ของ tasks
- [ ] Comment progress ใน issues
- [ ] ตอบ comments ใน PRs
- [ ] Stop Docker services (ถ้าต้องการ)
  ```bash
  docker-compose down
  ```
- [ ] สรุปงานที่ทำวันนี้ (ถ้ามี daily standup)

---

## 🆘 เมื่อเจอปัญหา

### ลำดับการแก้ปัญหา
1. [ ] อ่าน error message ให้ละเอียด
2. [ ] ตรวจสอบ console/logs
3. [ ] Google error message
4. [ ] ดูใน documentation
5. [ ] ถามในทีม (Slack/Discord)
6. [ ] สร้าง issue (ถ้าเป็น bug ของระบบ)

### ข้อมูลที่ควรให้เมื่อถามปัญหา
- [ ] Error message แบบเต็ม
- [ ] Steps to reproduce
- [ ] Environment (OS, Browser, Version)
- [ ] Screenshots/Screen recording
- [ ] สิ่งที่ลองแก้ไปแล้ว

---

## 📊 Weekly Checklist

- [ ] อัปเดต dependencies
  ```bash
  npm outdated
  npm update
  ```
- [ ] ตรวจสอบ security vulnerabilities
  ```bash
  npm audit
  ```
- [ ] ทำความสะอาด branches ที่ merge แล้ว
  ```bash
  git branch --merged | grep -v "main\|develop" | xargs git branch -d
  ```
- [ ] Review open PRs
- [ ] Update project documentation
- [ ] Backup important data

---

## 💡 Best Practices

### Git
- ✅ Commit บ่อยๆ แต่ละ commit ทำเรื่องเดียว
- ✅ เขียน commit message ให้ชัดเจน
- ✅ Pull ก่อน push เสมอ
- ✅ ใช้ feature branches
- ✅ ไม่ commit ลง `main` โดยตรง

### Code
- ✅ DRY (Don't Repeat Yourself)
- ✅ KISS (Keep It Simple, Stupid)
- ✅ YAGNI (You Aren't Gonna Need It)
- ✅ เขียน code ที่อ่านง่าย
- ✅ ใช้ meaningful variable names

### Communication
- ✅ ถามเมื่อไม่แน่ใจ
- ✅ แชร์ความรู้กับทีม
- ✅ ให้ feedback ที่สร้างสรรค์
- ✅ อัปเดต progress เป็นประจำ

---

**Remember:** Quality over quantity! 🎯
