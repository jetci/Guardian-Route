# Guardian Route - Developer Handbook

**Version:** 1.0  
**Last Updated:** November 15, 2025  
**For:** Internal Development Team

---

## 📚 Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Architecture Overview](#architecture-overview)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Development Workflow](#development-workflow)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Testing Guide](#testing-guide)
10. [Deployment Guide](#deployment-guide)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)

---

## 🎯 Introduction

Welcome to the Guardian Route Developer Handbook! This document serves as the central reference for all development-related information for the Guardian Route system.

### What is Guardian Route?

Guardian Route is a comprehensive incident management and analysis system designed for field operations, emergency response, and public safety management in Thailand.

### Key Features

- **Incident Management**: Create, track, and manage incidents
- **Geographic Analysis**: Overlay analysis for identifying high-risk areas
- **Role-Based Access Control**: Different interfaces for different user roles
- **Export Capabilities**: Professional PDF and Excel reports
- **Real-time Notifications**: SSE-based event streaming
- **Developer Mode**: Advanced debugging and testing tools

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 22.13.0 or higher
- **pnpm**: 9.0.0 or higher
- **PostgreSQL**: 15.0 or higher with PostGIS extension
- **Docker**: 24.0 or higher (for containerized development)

### Quick Start

```bash
# Clone repository
git clone https://github.com/jetci/Guardian-Route.git
cd Guardian-Route

# Install dependencies
cd backend && npm install
cd ../frontend && pnpm install

# Setup environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start development servers
cd backend && npm run start:dev
cd frontend && pnpm dev
```

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/guardian_route
JWT_SECRET=your-secret-key
PORT=3000
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=Guardian Route
```

---

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  Database   │
│   (React)   │◀────│  (NestJS)   │◀────│ (PostgreSQL)│
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   PostGIS   │
                    │  (Spatial)  │
                    └─────────────┘
```

### Component Architecture

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Leaflet for maps
- Context API for state management

**Backend:**
- NestJS framework
- Prisma ORM
- PostgreSQL + PostGIS
- JWT authentication
- SSE for real-time events

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2 | UI framework |
| TypeScript | 5.0 | Type safety |
| Vite | 4.4 | Build tool |
| Tailwind CSS | 3.3 | Styling |
| Leaflet | 1.9 | Maps |
| React Router | 6.x | Routing |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 10.0 | Framework |
| TypeScript | 5.0 | Type safety |
| Prisma | 5.3 | ORM |
| PostgreSQL | 15.0 | Database |
| PostGIS | 3.3 | Spatial data |
| Puppeteer | 21.0 | PDF generation |
| ExcelJS | 4.3 | Excel generation |

---

## 📁 Project Structure

### Frontend Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── dev/        # Developer mode components
│   │   ├── layout/     # Layout components
│   │   ├── overlay/    # Overlay analysis components
│   │   └── ...
│   ├── pages/          # Page components
│   ├── hooks/          # Custom hooks
│   ├── context/        # React contexts
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   ├── api/            # API client
│   └── App.tsx         # Root component
├── public/             # Static assets
└── package.json
```

### Backend Structure

```
backend/
├── src/
│   ├── auth/           # Authentication module
│   ├── users/          # User management
│   ├── incidents/      # Incident management
│   ├── overlay/        # Overlay analysis
│   ├── export/         # Export services
│   ├── events/         # SSE events
│   ├── audit-log/      # Audit logging
│   └── main.ts         # Entry point
├── prisma/
│   └── schema.prisma   # Database schema
└── package.json
```

---

## 🔄 Development Workflow

### Git Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

---

## 📡 API Documentation

### Authentication

**POST /auth/login**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "1",
    "username": "admin",
    "role": "ADMIN"
  }
}
```

### Overlay Analysis

**POST /overlay/analyze**
```json
{
  "incidentIds": ["1", "2", "3"]
}
```

**Response:**
```json
{
  "results": [
    {
      "geometry": {...},
      "riskLevel": "HIGH",
      "incidentCount": 3,
      "area": 1234.56
    }
  ]
}
```

### Export

**POST /export/overlay/pdf**
```json
{
  "analysisName": "Weekly Risk Assessment",
  "results": [...]
}
```

**Response:** PDF file download

---

## 🗄️ Database Schema

### Key Tables

**users**
- id: UUID
- username: String
- email: String
- role: Enum (ADMIN, SUPERVISOR, etc.)
- password_hash: String

**incidents**
- id: UUID
- title: String
- description: String
- location: Geography (Point)
- status: Enum
- severity: Enum
- created_at: DateTime

**audit_logs**
- id: UUID
- user_id: UUID
- action: String
- data: JSON
- created_at: DateTime

---

## 🧪 Testing Guide

### Frontend Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

### Backend Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

---

## 🚀 Deployment Guide

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Production Deployment

See [Deployment Guide](../docs/sprint13_staging_guide.md) for detailed instructions.

---

## 🔧 Troubleshooting

### Common Issues

**Issue: Database connection failed**
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify PostGIS extension is installed

**Issue: Frontend can't connect to backend**
- Check VITE_API_URL in .env
- Ensure backend is running on correct port
- Check CORS configuration

**Issue: Maps not loading**
- Check Leaflet CSS is imported
- Verify GeoJSON data format
- Check browser console for errors

---

## ✅ Best Practices

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful comments

### Performance

- Use React.memo for expensive components
- Implement pagination for large lists
- Optimize database queries with indexes
- Use caching where appropriate

### Security

- Never commit secrets to Git
- Use environment variables
- Validate all user input
- Implement proper authentication
- Use HTTPS in production

---

## 📞 Support

**Development Team:**
- Email: dev@guardian-route.com
- Slack: #guardian-route-dev

**Documentation:**
- GitHub Wiki
- API Documentation
- Sprint Reports

---

**Last Updated:** November 15, 2025  
**Version:** 1.0
