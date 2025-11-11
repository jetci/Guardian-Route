# 🔄 CI/CD Pipeline Proposal - Guardian Route

**ทีม:** w + DevOps  
**SA Requested:** ✅  
**วันที่:** 11 พฤศจิกายน 2025

---

## 🎯 Overview

แผนการสร้าง CI/CD Pipeline สำหรับ Guardian Route เพื่อ Automate Testing, Building, และ Deployment

---

## 🏗️ Pipeline Architecture

```
┌─────────────┐
│   GitHub    │
│  Repository │
└──────┬──────┘
       │
       ├─── Push/PR ───┐
       │               │
       ▼               ▼
┌─────────────┐  ┌─────────────┐
│   Backend   │  │  Frontend   │
│   Pipeline  │  │   Pipeline  │
└──────┬──────┘  └──────┬──────┘
       │               │
       ├───────┬───────┤
       │       │       │
       ▼       ▼       ▼
    ┌────┐ ┌────┐ ┌────┐
    │Test│ │Lint│ │Build│
    └─┬──┘ └─┬──┘ └─┬──┘
      │      │      │
      └──────┴──────┘
             │
             ▼
      ┌─────────────┐
      │   Deploy    │
      │   Staging   │
      └──────┬──────┘
             │
             ▼
      ┌─────────────┐
      │   Manual    │
      │   Approval  │
      └──────┬──────┘
             │
             ▼
      ┌─────────────┐
      │   Deploy    │
      │ Production  │
      └─────────────┘
```

---

## 📋 Pipeline Stages

### Stage 1: Code Quality
- Linting (ESLint, Prettier)
- Type checking (TypeScript)
- Code formatting validation

### Stage 2: Testing
- Unit tests
- Integration tests
- E2E tests (optional)
- Coverage report

### Stage 3: Build
- Backend build
- Frontend build
- Docker image build

### Stage 4: Deploy Staging
- Deploy to staging environment
- Run smoke tests
- Health check

### Stage 5: Manual Approval
- Review staging
- Approve for production

### Stage 6: Deploy Production
- Deploy to production
- Run health checks
- Notify team

---

## 🔧 GitHub Actions Workflows

### 1. Backend Pipeline

**File:** `.github/workflows/backend-ci.yml`

```yaml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'backend/**'

jobs:
  lint:
    name: Lint Backend
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Run ESLint
        run: |
          cd backend
          npm run lint
      
      - name: Check formatting
        run: |
          cd backend
          npm run format:check

  test:
    name: Test Backend
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgis/postgis:14-3.2
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: guardian_route_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Generate Prisma Client
        run: |
          cd backend
          npx prisma generate
      
      - name: Run migrations
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/guardian_route_test
        run: |
          cd backend
          npx prisma migrate deploy
      
      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/guardian_route_test
          JWT_SECRET: test-secret
          JWT_EXPIRES_IN: 1h
        run: |
          cd backend
          npm run test:cov
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info
          flags: backend
          name: backend-coverage

  build:
    name: Build Backend
    runs-on: ubuntu-latest
    needs: [lint, test]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Generate Prisma Client
        run: |
          cd backend
          npx prisma generate
      
      - name: Build
        run: |
          cd backend
          npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: backend-dist
          path: backend/dist

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: backend-dist
          path: backend/dist
      
      - name: Deploy to staging
        env:
          STAGING_SERVER: ${{ secrets.STAGING_SERVER }}
          STAGING_USER: ${{ secrets.STAGING_USER }}
          STAGING_KEY: ${{ secrets.STAGING_SSH_KEY }}
        run: |
          # Deploy script here
          echo "Deploying to staging..."
      
      - name: Run smoke tests
        run: |
          # Smoke test script
          echo "Running smoke tests..."
      
      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Backend deployed to staging'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://guardian-route.obtwiang.go.th
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: backend-dist
          path: backend/dist
      
      - name: Deploy to production
        env:
          PROD_SERVER: ${{ secrets.PROD_SERVER }}
          PROD_USER: ${{ secrets.PROD_USER }}
          PROD_KEY: ${{ secrets.PROD_SSH_KEY }}
        run: |
          # Deploy script here
          echo "Deploying to production..."
      
      - name: Health check
        run: |
          # Health check script
          curl -f https://guardian-route.obtwiang.go.th/api/health || exit 1
      
      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Backend deployed to production 🚀'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

### 2. Frontend Pipeline

**File:** `.github/workflows/frontend-ci.yml`

```yaml
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'frontend/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'frontend/**'

jobs:
  lint:
    name: Lint Frontend
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run ESLint
        run: |
          cd frontend
          npm run lint
      
      - name: Type check
        run: |
          cd frontend
          npm run type-check

  test:
    name: Test Frontend
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run tests
        run: |
          cd frontend
          npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/lcov.info
          flags: frontend
          name: frontend-coverage

  build:
    name: Build Frontend
    runs-on: ubuntu-latest
    needs: [lint, test]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
        run: |
          cd frontend
          npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: frontend-dist
          path: frontend/dist

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: frontend-dist
          path: frontend/dist
      
      - name: Deploy to Netlify/Vercel
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        run: |
          npx netlify-cli deploy --dir=frontend/dist --prod=false
      
      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Frontend deployed to staging'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://guardian-route.obtwiang.go.th
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: frontend-dist
          path: frontend/dist
      
      - name: Deploy to production
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID_PROD }}
        run: |
          npx netlify-cli deploy --dir=frontend/dist --prod
      
      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Frontend deployed to production 🚀'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🔐 Required Secrets

### GitHub Repository Secrets

```
# Backend Staging
STAGING_SERVER=staging.guardian-route.obtwiang.go.th
STAGING_USER=deploy
STAGING_SSH_KEY=<private-key>

# Backend Production
PROD_SERVER=guardian-route.obtwiang.go.th
PROD_USER=deploy
PROD_SSH_KEY=<private-key>

# Frontend Deployment
NETLIFY_AUTH_TOKEN=<token>
NETLIFY_SITE_ID=<staging-site-id>
NETLIFY_SITE_ID_PROD=<prod-site-id>

# Environment Variables
VITE_API_URL=https://api.guardian-route.obtwiang.go.th

# Notifications
SLACK_WEBHOOK=<webhook-url>

# Code Coverage
CODECOV_TOKEN=<token>
```

---

## 📊 Monitoring & Alerts

### 1. Build Status Badge

```markdown
[![Backend CI](https://github.com/jetci/Guardian-Route/workflows/Backend%20CI%2FCD/badge.svg)](https://github.com/jetci/Guardian-Route/actions)
[![Frontend CI](https://github.com/jetci/Guardian-Route/workflows/Frontend%20CI%2FCD/badge.svg)](https://github.com/jetci/Guardian-Route/actions)
[![codecov](https://codecov.io/gh/jetci/Guardian-Route/branch/main/graph/badge.svg)](https://codecov.io/gh/jetci/Guardian-Route)
```

### 2. Slack Notifications

- Build started
- Build success/failure
- Deployment started
- Deployment success/failure
- Test coverage report

### 3. Email Notifications

- Production deployment
- Critical failures
- Security alerts

---

## 🚀 Deployment Strategy

### Blue-Green Deployment

```
┌─────────────┐
│   Load      │
│  Balancer   │
└──────┬──────┘
       │
       ├─────────┬─────────┐
       │         │         │
       ▼         ▼         ▼
   ┌─────┐   ┌─────┐   ┌─────┐
   │Blue │   │Green│   │Green│
   │(Old)│   │(New)│   │(New)│
   └─────┘   └─────┘   └─────┘
```

**Steps:**
1. Deploy new version to Green
2. Run health checks
3. Switch traffic to Green
4. Monitor for issues
5. Keep Blue for rollback

---

## 🔄 Rollback Strategy

### Automatic Rollback Triggers
- Health check failures
- Error rate > 5%
- Response time > 2s
- CPU/Memory > 90%

### Manual Rollback
```bash
# Rollback to previous version
gh workflow run deploy-production.yml \
  --ref previous-release-tag
```

---

## 📈 Success Metrics

### Pipeline Performance
- Build time < 10 minutes
- Test time < 5 minutes
- Deploy time < 3 minutes
- Total pipeline < 20 minutes

### Quality Metrics
- Test coverage ≥ 80%
- Zero critical vulnerabilities
- Lint errors = 0
- Type errors = 0

### Deployment Metrics
- Deployment frequency: Daily
- Lead time: < 1 hour
- MTTR (Mean Time To Recovery): < 15 minutes
- Change failure rate: < 5%

---

## 🛠️ Tools & Services

### CI/CD
- **GitHub Actions** - Primary CI/CD
- **Docker** - Containerization
- **Kubernetes** - Orchestration (optional)

### Testing
- **Jest** - Backend unit tests
- **Vitest** - Frontend unit tests
- **Supertest** - API integration tests
- **Playwright** - E2E tests

### Code Quality
- **ESLint** - Linting
- **Prettier** - Formatting
- **SonarQube** - Code analysis
- **Codecov** - Coverage tracking

### Deployment
- **Netlify/Vercel** - Frontend hosting
- **AWS/GCP/Azure** - Backend hosting
- **PM2** - Process management
- **Nginx** - Reverse proxy

### Monitoring
- **Sentry** - Error tracking
- **Datadog/New Relic** - APM
- **Prometheus** - Metrics
- **Grafana** - Dashboards

---

## 📋 Implementation Checklist

### Phase 1: Setup (Week 1)
- [ ] Create GitHub Actions workflows
- [ ] Configure repository secrets
- [ ] Setup staging environment
- [ ] Configure Slack notifications

### Phase 2: Testing (Week 2)
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Configure code coverage
- [ ] Setup SonarQube

### Phase 3: Deployment (Week 3)
- [ ] Configure staging deployment
- [ ] Configure production deployment
- [ ] Setup blue-green deployment
- [ ] Test rollback procedure

### Phase 4: Monitoring (Week 4)
- [ ] Setup Sentry
- [ ] Configure APM
- [ ] Create dashboards
- [ ] Setup alerts

---

## 🎯 Next Steps

1. **Week 1:** Create and test workflows
2. **Week 2:** Add comprehensive tests
3. **Week 3:** Setup deployment environments
4. **Week 4:** Configure monitoring and alerts

---

**รายงานจาก w**  
**สถานะ:** 📋 CI/CD Pipeline Proposal พร้อม  
**ขั้นตอนถัดไป:** รอ SA approval เพื่อเริ่ม implementation
