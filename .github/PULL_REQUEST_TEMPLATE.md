# Pull Request

## 📋 Description
<!-- อธิบายสิ่งที่เปลี่ยนแปลงในครั้งนี้ -->



## 🎯 Type of Change
<!-- ใส่ [x] ในช่องที่ตรงกับประเภทการเปลี่ยนแปลง -->

- [ ] 🐛 Bug fix (การแก้ไขที่ไม่ทำให้ฟีเจอร์เดิมเสีย)
- [ ] ✨ New feature (การเพิ่มฟีเจอร์ใหม่)
- [ ] 💥 Breaking change (การเปลี่ยนแปลงที่ทำให้ฟีเจอร์เดิมทำงานไม่ได้)
- [ ] 📝 Documentation update (การอัปเดตเอกสาร)
- [ ] 🎨 UI/UX improvement (การปรับปรุง UI/UX)
- [ ] ♻️ Code refactoring (การปรับปรุงโครงสร้างโค้ด)
- [ ] ⚡ Performance improvement (การปรับปรุงประสิทธิภาพ)
- [ ] 🧪 Test (การเพิ่มหรือแก้ไข test)
- [ ] 🔧 Configuration change (การเปลี่ยนแปลง config)

## 🔗 Related Issue
<!-- ระบุ Issue ที่เกี่ยวข้อง (ถ้ามี) -->

Closes #(issue number)

## 📸 Screenshots (ถ้ามี)
<!-- แนบภาพหน้าจอหรือ GIF แสดงการเปลี่ยนแปลง -->



## ✅ Checklist
<!-- ตรวจสอบรายการต่อไปนี้ก่อน submit PR -->

### Code Quality
- [ ] โค้ดผ่าน linter (`npm run lint`) โดยไม่มี error
- [ ] โค้ดถูก format ด้วย Prettier แล้ว
- [ ] ไม่มีการ hardcode ข้อมูลลับ (API keys, passwords, etc.)
- [ ] ไม่มีการ console.log หรือ debug code ที่ไม่จำเป็น
- [ ] ทุก endpoint มี `isAuthorized` เช็คสิทธิ์
- [ ] ไม่มีการแก้ไข Schema โดยไม่แจ้ง SA ก่อน

### Testing (บังคับ)
- [ ] เพิ่ม/อัปเดต Unit Tests (ครอบคลุมอย่างน้อย 80%)
- [ ] ทดสอบ Login + Incident Report ครบ flow
- [ ] ทดสอบการทำงานบนเบราว์เซอร์หลัก (Chrome, Firefox, Safari)
- [ ] ทดสอบบนอุปกรณ์มือถือ (Responsive - **บังคับ**)

### Error Handling
- [ ] เพิ่ม Error Logging (Sentry หรือ Console)
- [ ] มี Loading State สำหรับทุก action ที่รอ server
- [ ] มี Toast Notification สำหรับ success/error
- [ ] มี Recovery Strategy (retry/local storage) สำหรับ API failures

### Documentation
- [ ] เพิ่ม/อัปเดตเอกสาร (ถ้าจำเป็น)
- [ ] Commit Message ตาม Convention (feat/fix/docs/refactor)
- [ ] PR Description ชัดเจนและครบถ้วน

## 🧪 How to Test
<!-- อธิบายวิธีทดสอบการเปลี่ยนแปลงนี้ -->

1. 
2. 
3. 

## 📝 Additional Notes
<!-- ข้อมูลเพิ่มเติมที่ reviewer ควรรู้ -->



## 👀 Reviewers
<!-- Tag ผู้ที่ต้องการให้ review -->

@<!-- username -->
