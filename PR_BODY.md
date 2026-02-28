Branch: chore/remove-secrets-add-ci

สรุปย่อ (Thai):

ทำการปรับปรุงเพื่อความพร้อมใช้งานใน production:

- เอาไฟล์ `backend/.env` ที่มีความลับออกจาก repository และเพิ่ม `backend/.env.example` เป็นตัวอย่าง
- เพิ่มไฟล์ `SECURITY.md` พร้อมคำแนะนำการ rotate secrets และวิธีล้างประวัติหากจำเป็น
- เพิ่มสคริปต์ช่วยเปลี่ยนรหัส `scripts/rotate-db-password.sh`
- เพิ่ม/แก้ไข CI: `.github/workflows/ci.yml` เพื่อรัน `npx prisma generate` และ `npm test` โดยรับ `DATABASE_URL` จาก GitHub Secrets
- ปรับ `backend/Dockerfile` เป็น multi-stage build และรันเป็น non-root
- เพิ่ม healthchecks ใน `docker-compose.yml` สำหรับ postgres, redis และ backend (`/api/health`)
- เพิ่ม `vercel.json` และคำแนะนำ `DEPLOYMENT.md` กับตัวอย่างสำหรับ Kubernetes/Render

เหตุผล: ลดความเสี่ยงการรั่วไหลของความลับ ปรับปรุงกระบวนการ build/test และเตรียม assets สำหรับ deployment

สิ่งที่ต้องทำโดยผู้ดูแลก่อน merge:
- ตั้งค่า GitHub Secrets: `DATABASE_URL`, `JWT_SECRET` (Settings → Secrets)
- (แนะนำ) Rotate DB password ถ้าค่าที่เคยอยู่ใน `backend/.env` ถูกเปิดเผย

ตรวจสอบ/ทดสอบ locally:
```
# build & run locally with docker-compose
docker compose up --build

# run backend tests locally
cd backend && npm ci && npm test
```

Reviewer checklist:
- [ ] Confirm that CI passes on this branch
- [ ] Confirm secrets are set in repository settings
- [ ] Approve and merge
