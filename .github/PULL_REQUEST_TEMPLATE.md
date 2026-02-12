# Pull Request — Guardian Route

สรุปการเปลี่ยนแปลง
- ลบ `backend/.env` ที่มีข้อมูลความลับ
- เพิ่ม `backend/.env.example`
- เพิ่ม `SECURITY.md` และสคริปต์ `scripts/rotate-db-password.sh`
- เพิ่ม CI workflow (`.github/workflows/ci.yml`) ให้รันทดสอบและ `prisma generate` (ใช้ GitHub Secrets)
- ปรับ `backend/Dockerfile` เป็น multi-stage และ non-root
- เพิ่ม healthcheck สำหรับ backend ใน `docker-compose.yml`
- เพิ่ม `vercel.json`, `DEPLOYMENT.md`, และตัวอย่าง `deploy/` สำหรับ k8s/Render

ผลกระทบ
- ไม่มีฟีเจอร์ใหม่ต่อผู้ใช้ปลายทาง
- จำเป็นต้องตั้งค่า Secrets ใน GitHub (DATABASE_URL, JWT_SECRET)

การตรวจสอบก่อน Merge
- [ ] CI (backend tests) ผ่าน
- [ ] Secrets ถูกตั้งค่าใน repository (Settings → Secrets)
- [ ] เจ้าของระบบยืนยันการ rotate credential แล้ว

คำแนะนำเพิ่มเติม
- ดู `SECURITY.md` สำหรับขั้นตอน rotate และ `DEPLOYMENT.md` สำหรับการ deploy production
## 📋 Pull Request Summary

**Issue:** Closes #[issue_number]  
**Sprint:** Sprint 2  
**Week:** Week [1-4]  
**Type:** [ ] Feature [ ] Bugfix [ ] Refactor [ ] Documentation [ ] Testing

---

## 🎯 Description

<!-- Provide a brief description of the changes -->

---

## ✅ Changes Made

<!-- List the main changes in this PR -->

- 
- 
- 

---

## 🧪 Testing

<!-- Describe how you tested these changes -->

### Manual Testing

- [ ] Tested locally
- [ ] Tested on staging
- [ ] Tested edge cases

### Automated Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests pass locally
- [ ] Coverage meets threshold (Backend ≥80%, Frontend ≥70%)

---

## 📸 Screenshots (if applicable)

<!-- Add screenshots for UI changes -->

---

## 🔗 Related

<!-- Link to related PRs, issues, or documentation -->

- Related to: #
- Depends on: #
- Documentation: 

---

## ✅ Checklist

### Code Quality

- [ ] Code follows project style guidelines
- [ ] No console.log or debug statements
- [ ] No commented-out code
- [ ] Proper error handling implemented
- [ ] TypeScript types are correct (no `any` unless necessary)

### Documentation

- [ ] Code comments added where necessary
- [ ] API documentation updated (if applicable)
- [ ] README updated (if applicable)

### Testing

- [ ] Unit tests pass
- [ ] Integration tests pass (if applicable)
- [ ] Manual testing completed
- [ ] No breaking changes (or documented if necessary)

### Sprint 2 Specific

- [ ] Follows Technical Spec (Backend or Frontend)
- [ ] Matches acceptance criteria in Issue
- [ ] No scope creep (only implements what's in the Issue)

---

## 🚀 Deployment Notes

<!-- Any special deployment instructions or considerations -->

---

## 📝 Reviewer Notes

<!-- Any specific areas you want reviewers to focus on -->

---

**Ready for Review:** [ ] Yes [ ] No (WIP)
