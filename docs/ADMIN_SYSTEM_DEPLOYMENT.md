# Admin System v2.1.0 - Deployment Guide

**Version:** 2.1.0  
**Last Updated:** November 9, 2025  
**Status:** Ready for Deployment

---

## 📋 Pre-Deployment Checklist

### Environment Setup

- [ ] PostgreSQL database running
- [ ] Node.js 18+ installed
- [ ] pnpm package manager installed
- [ ] Environment variables configured
- [ ] SSL certificates ready (production)

### Code Verification

- [ ] All files committed to Git
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Dependencies up to date
- [ ] Build successful

### Database

- [ ] Backup existing database
- [ ] Migration files ready
- [ ] Test migration on staging

---

## 🗄️ Database Migration

### Step 1: Review Prisma Schema Changes

**Location:** `backend/prisma/schema.prisma`

**Changes:**
1. Added `AuditLog` model
2. Added `GeoBoundary` model
3. Modified `User` model (added username, fullName, department)

### Step 2: Generate Migration

```bash
cd backend
npx prisma migrate dev --name admin_system_v2_1_0
```

**Expected Output:**
```
✔ Generated Prisma Client
✔ The migration has been created successfully
```

### Step 3: Apply Migration to Staging

```bash
# Staging
npx prisma migrate deploy
```

### Step 4: Verify Migration

```bash
npx prisma studio
```

**Verify:**
- ✅ AuditLog table exists
- ✅ GeoBoundary table exists
- ✅ User table has new columns (username, fullName, department)

### Step 5: Seed Initial Data (Optional)

**Create Admin User:**

```typescript
// backend/prisma/seed-admin.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@guardianroute.com' },
    update: {},
    create: {
      email: 'admin@guardianroute.com',
      username: 'admin',
      password: hashedPassword,
      fullName: 'System Administrator',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run Seed:**
```bash
npx ts-node prisma/seed-admin.ts
```

---

## 🚀 Backend Deployment

### Step 1: Install Dependencies

```bash
cd backend
pnpm install
```

### Step 2: Build

```bash
pnpm build
```

**Expected Output:**
```
✔ Build successful
```

### Step 3: Environment Variables

**Create `.env.production`:**

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/guardian_route?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=production

# CORS
CORS_ORIGIN="https://your-frontend-domain.com"

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### Step 4: Start Server

**Development:**
```bash
pnpm start:dev
```

**Production:**
```bash
pnpm start:prod
```

**PM2 (Recommended):**
```bash
pm2 start dist/main.js --name guardian-route-api
pm2 save
pm2 startup
```

### Step 5: Verify Backend

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-09T06:00:00.000Z"
}
```

**Test Admin Endpoint:**
```bash
# Login first
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@guardianroute.com","password":"admin123"}'

# Get token from response, then:
curl http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎨 Frontend Deployment

### Step 1: Install Dependencies

```bash
cd frontend
pnpm install
```

### Step 2: Environment Variables

**Create `.env.production`:**

```env
VITE_API_URL=https://api.guardianroute.com
VITE_APP_NAME=Guardian Route
VITE_APP_VERSION=2.1.0
```

### Step 3: Build

```bash
pnpm build
```

**Expected Output:**
```
✔ Build successful
dist/ directory created
```

### Step 4: Deploy Static Files

**Option 1: Nginx**

```nginx
server {
    listen 80;
    server_name guardianroute.com;
    
    root /var/www/guardian-route/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Option 2: Vercel**

```bash
pnpm add -g vercel
vercel --prod
```

**Option 3: Netlify**

```bash
pnpm add -g netlify-cli
netlify deploy --prod
```

### Step 5: Verify Frontend

**Access:**
```
https://guardianroute.com/admin
```

**Expected:**
- ✅ Admin Dashboard loads
- ✅ Can login with admin credentials
- ✅ All tabs functional
- ✅ API calls successful

---

## 🔒 Security Configuration

### SSL/TLS Setup

**Let's Encrypt (Certbot):**

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d guardianroute.com -d www.guardianroute.com
```

### Firewall Rules

```bash
# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH
sudo ufw allow 22/tcp

# Block direct access to backend port
sudo ufw deny 3000/tcp

# Enable firewall
sudo ufw enable
```

### Rate Limiting

**Nginx:**

```nginx
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    
    server {
        location /api {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://localhost:3000;
        }
    }
}
```

### CORS Configuration

**Backend (main.ts):**

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

---

## 📊 Monitoring Setup

### Application Monitoring

**PM2 Monitoring:**

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

pm2 monit
```

### Database Monitoring

**PostgreSQL Logging:**

```sql
-- Enable logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1s

-- Reload configuration
SELECT pg_reload_conf();
```

### Error Tracking

**Sentry (Optional):**

```bash
pnpm add @sentry/node @sentry/nestjs
```

**Configure in main.ts:**

```typescript
import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## 🧪 Post-Deployment Testing

### Backend API Tests

**User Management:**

```bash
# Create user
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "role": "FIELD_OFFICER"
  }'

# Get users
curl http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer TOKEN"

# Update user
curl -X PATCH http://localhost:3000/api/admin/users/USER_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Updated Name"}'

# Delete user
curl -X DELETE http://localhost:3000/api/admin/users/USER_ID \
  -H "Authorization: Bearer TOKEN"
```

**GeoJSON Management:**

```bash
# Upload GeoJSON
curl -X POST http://localhost:3000/api/admin/geojson \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Boundary",
    "type": "village",
    "geojson": {...},
    "mode": "merge"
  }'

# Get GeoJSON list
curl http://localhost:3000/api/admin/geojson \
  -H "Authorization: Bearer TOKEN"
```

**Audit Logs:**

```bash
# Get audit logs
curl http://localhost:3000/api/admin/audit-logs \
  -H "Authorization: Bearer TOKEN"

# Export CSV
curl http://localhost:3000/api/admin/audit-logs/export/csv \
  -H "Authorization: Bearer TOKEN" \
  -o audit-logs.csv
```

**System Settings:**

```bash
# Get settings
curl http://localhost:3000/api/admin/settings \
  -H "Authorization: Bearer TOKEN"

# Update settings
curl -X PATCH http://localhost:3000/api/admin/settings \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mapConfig": {
      "centerLat": 18.7883,
      "centerLng": 98.9853,
      "defaultZoom": 13
    }
  }'
```

### Frontend UI Tests

**Manual Testing Checklist:**

- [ ] Login as ADMIN
- [ ] Navigate to Admin Dashboard
- [ ] Create new user
- [ ] Edit user
- [ ] Change user role
- [ ] Suspend/Activate user
- [ ] Delete user
- [ ] Upload GeoJSON file
- [ ] View GeoJSON list
- [ ] Download GeoJSON
- [ ] Delete GeoJSON
- [ ] View audit logs
- [ ] Filter audit logs
- [ ] Export audit logs to CSV
- [ ] Update system settings
- [ ] Reset system settings
- [ ] Logout

---

## 🔧 Troubleshooting

### Common Issues

**Issue 1: Database Connection Failed**

```
Error: Can't reach database server
```

**Solution:**
- Check DATABASE_URL in .env
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check firewall rules
- Test connection: `psql -h host -U user -d database`

**Issue 2: JWT Authentication Failed**

```
Error: Unauthorized
```

**Solution:**
- Check JWT_SECRET in .env
- Verify token is valid and not expired
- Check Authorization header format: `Bearer <token>`
- Clear browser cookies and login again

**Issue 3: CORS Error**

```
Error: CORS policy blocked
```

**Solution:**
- Check CORS_ORIGIN in backend .env
- Verify frontend URL matches CORS_ORIGIN
- Check Nginx proxy configuration
- Add credentials: true in CORS config

**Issue 4: File Upload Failed**

```
Error: File too large
```

**Solution:**
- Check MAX_FILE_SIZE in .env
- Increase Nginx client_max_body_size
- Update System Settings > Max Upload Size

**Issue 5: Migration Failed**

```
Error: Migration failed to apply
```

**Solution:**
- Backup database first
- Check migration file for errors
- Manually apply migration: `npx prisma migrate deploy`
- Rollback if needed: `npx prisma migrate reset`

---

## 📦 Backup & Recovery

### Database Backup

**Manual Backup:**

```bash
pg_dump -h localhost -U user -d guardian_route > backup_$(date +%Y%m%d).sql
```

**Automated Backup (Cron):**

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * pg_dump -h localhost -U user -d guardian_route > /backups/guardian_route_$(date +\%Y\%m\%d).sql
```

### Database Restore

```bash
psql -h localhost -U user -d guardian_route < backup_20251109.sql
```

### Application Backup

**Backend:**
```bash
tar -czf backend_backup_$(date +%Y%m%d).tar.gz backend/
```

**Frontend:**
```bash
tar -czf frontend_backup_$(date +%Y%m%d).tar.gz frontend/dist/
```

---

## 🔄 Rollback Plan

### Step 1: Stop Services

```bash
pm2 stop guardian-route-api
sudo systemctl stop nginx
```

### Step 2: Restore Database

```bash
psql -h localhost -U user -d guardian_route < backup_before_v2_1_0.sql
```

### Step 3: Restore Code

```bash
git checkout v2.0.0
cd backend && pnpm install && pnpm build
cd frontend && pnpm install && pnpm build
```

### Step 4: Restart Services

```bash
pm2 start guardian-route-api
sudo systemctl start nginx
```

---

## 📈 Performance Optimization

### Database Optimization

**Add Indexes:**

```sql
-- User table
CREATE INDEX idx_user_username ON "User"(username);
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_role ON "User"(role);

-- AuditLog table
CREATE INDEX idx_audit_log_user_id ON "AuditLog"("userId");
CREATE INDEX idx_audit_log_action ON "AuditLog"(action);
CREATE INDEX idx_audit_log_created_at ON "AuditLog"("createdAt");

-- GeoBoundary table
CREATE INDEX idx_geo_boundary_type ON "GeoBoundary"(type);
CREATE INDEX idx_geo_boundary_village_id ON "GeoBoundary"("villageId");
```

**Vacuum Database:**

```sql
VACUUM ANALYZE;
```

### Application Optimization

**Enable Compression:**

```typescript
// main.ts
import * as compression from 'compression';
app.use(compression());
```

**Enable Caching:**

```typescript
// Cache settings endpoint
@Get('settings')
@CacheKey('system-settings')
@CacheTTL(300) // 5 minutes
async getSettings() {
  return this.systemSettingsService.getAll();
}
```

### Nginx Optimization

```nginx
# Enable gzip compression
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;

# Enable caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## ✅ Deployment Verification

### Checklist

**Backend:**
- [ ] Server running on correct port
- [ ] Database connected
- [ ] All endpoints responding
- [ ] Authentication working
- [ ] Authorization working
- [ ] Audit logging working
- [ ] Error handling working

**Frontend:**
- [ ] Application loads
- [ ] Login working
- [ ] Admin dashboard accessible
- [ ] All components rendering
- [ ] API calls successful
- [ ] No console errors
- [ ] Responsive design working

**Security:**
- [ ] SSL/TLS enabled
- [ ] CORS configured
- [ ] Rate limiting active
- [ ] Firewall configured
- [ ] Passwords hashed
- [ ] API keys encrypted

**Monitoring:**
- [ ] Application logs working
- [ ] Database logs working
- [ ] Error tracking active
- [ ] Performance monitoring active

**Documentation:**
- [ ] User guide available
- [ ] API documentation available
- [ ] Deployment guide available
- [ ] Troubleshooting guide available

---

## 🎓 Training & Handover

### Admin User Training

**Schedule:** 2 hours session

**Agenda:**
1. System overview (15 min)
2. User management demo (30 min)
3. GeoJSON upload demo (30 min)
4. Audit logs review (15 min)
5. System settings (15 min)
6. Q&A (15 min)

**Materials:**
- User guide (ADMIN_SYSTEM_GUIDE.md)
- Video tutorials
- Hands-on exercises

### Developer Handover

**Schedule:** 4 hours session

**Agenda:**
1. Architecture overview (30 min)
2. Code walkthrough (60 min)
3. API demonstration (30 min)
4. Database schema (30 min)
5. Deployment process (30 min)
6. Troubleshooting (30 min)
7. Q&A (30 min)

**Materials:**
- Technical documentation (ADMIN_SYSTEM_SUMMARY.md)
- Deployment guide (this document)
- Code repository access

---

## 📞 Support

### Production Issues

**Priority 1 (Critical):**
- System down
- Data loss
- Security breach

**Contact:** Emergency hotline

**Priority 2 (High):**
- Feature not working
- Performance issues
- Authentication problems

**Contact:** Support email

**Priority 3 (Medium):**
- UI bugs
- Minor issues
- Enhancement requests

**Contact:** Issue tracker

### Maintenance Windows

**Scheduled Maintenance:**
- Every Sunday 2:00 AM - 4:00 AM GMT+7
- Notification 48 hours in advance

**Emergency Maintenance:**
- As needed
- Notification as soon as possible

---

## 🎉 Deployment Complete!

**Congratulations!** Admin System v2.1.0 is now deployed and ready for production use.

**Next Steps:**
1. Monitor system for 24 hours
2. Collect user feedback
3. Address any issues
4. Plan for v2.2.0 enhancements

---

**Deployed by:** Guardian Route DevOps Team  
**Deployment Date:** November 9, 2025  
**Version:** 2.1.0  
**Status:** ✅ Production Ready

---

**© 2025 Guardian Route - Admin System v2.1.0**
