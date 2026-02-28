# 🔧 Backend Implementation Guide - Data Management APIs

**Created**: 29 พฤศจิกายน 2568 เวลา 13:45 น.  
**Status**: 🟢 **Skeleton Code Ready**  
**Priority**: 🔴 **CRITICAL - Start Immediately**

---

## ✅ What's Been Created

### Files Created (Skeleton Code):
1. ✅ `backend/src/models/GeoJSONData.ts` - Database model
2. ✅ `backend/src/models/AuditLog.ts` - Audit log model
3. ✅ `backend/src/middleware/validateGeoJSON.ts` - Validation middleware
4. ✅ `backend/src/controllers/dataController.ts` - API controllers
5. ✅ `backend/src/routes/dataRoutes.ts` - API routes
6. ✅ `backend/src/utils/errors.ts` - Error classes
7. ✅ `backend/src/utils/auditLogger.ts` - Audit logging utility

---

## 🚀 Quick Start (5 Steps)

### Step 1: Install Dependencies (5 minutes)

```bash
cd backend
npm install --save multer uuid
npm install --save-dev @types/multer @types/uuid
```

**Note**: If using NestJS, you may need different packages.

---

### Step 2: Adjust for Your Architecture (10 minutes)

#### If Using Express:
- ✅ Files are ready to use
- Just need to add routes to your main app

#### If Using NestJS:
- Convert controllers to NestJS format
- Use `@Controller`, `@Post`, `@Get`, `@Delete` decorators
- Use `@UseGuards`, `@UseInterceptors` for auth/validation
- Convert Sequelize models to Prisma (if using Prisma)

---

### Step 3: Create Database Tables (10 minutes)

#### Option A: Using Sequelize Migration

```bash
npx sequelize-cli migration:generate --name create-geojson-data-table
```

Then add to migration file:

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('geojson_data', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      filename: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      dataType: {
        type: Sequelize.ENUM('villages', 'flood_risk', 'fire_risk', 'custom'),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      filePath: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      fileSize: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      featuresCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      uploadedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      uploadedBy: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      action: {
        type: Sequelize.ENUM('upload', 'download', 'delete', 'import', 'export', 'sync', 'backup'),
        allowNull: false,
      },
      resourceType: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      resourceId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      userEmail: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      ipAddress: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      details: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('audit_logs');
    await queryInterface.dropTable('geojson_data');
  },
};
```

Run migration:
```bash
npx sequelize-cli db:migrate
```

#### Option B: Using Prisma

Add to `schema.prisma`:

```prisma
model GeoJSONData {
  id             String   @id @default(uuid())
  filename       String
  dataType       DataType
  description    String?
  filePath       String
  fileSize       BigInt
  featuresCount  Int
  uploadedAt     DateTime
  uploadedBy     String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("geojson_data")
}

model AuditLog {
  id           String      @id @default(uuid())
  action       AuditAction
  resourceType String
  resourceId   String?
  userId       String
  userEmail    String
  ipAddress    String?
  details      Json?
  createdAt    DateTime    @default(now())

  @@map("audit_logs")
}

enum DataType {
  villages
  flood_risk
  fire_risk
  custom
}

enum AuditAction {
  upload
  download
  delete
  import
  export
  sync
  backup
}
```

Run migration:
```bash
npx prisma migrate dev --name add-data-management-tables
```

---

### Step 4: Add Routes to Main App (5 minutes)

#### Express:
```typescript
// app.ts or server.ts
import dataRoutes from './routes/dataRoutes';

app.use('/api/data', dataRoutes);
```

#### NestJS:
```typescript
// app.module.ts
import { DataModule } from './data/data.module';

@Module({
  imports: [
    // ... other modules
    DataModule,
  ],
})
export class AppModule {}
```

---

### Step 5: Test APIs (10 minutes)

#### Test Upload:
```bash
curl -X POST http://localhost:3001/api/data/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.geojson" \
  -F "dataType=villages" \
  -F "description=Test upload"
```

#### Test Download:
```bash
curl -X GET http://localhost:3001/api/data/download/villages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o downloaded.geojson
```

#### Test Delete:
```bash
curl -X DELETE http://localhost:3001/api/data/villages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 TODO List for Backend Team

### Priority 0 (Critical - Do First):
- [ ] Install dependencies
- [ ] Adjust code for your architecture (Express/NestJS)
- [ ] Create database tables (migration)
- [ ] Add routes to main app
- [ ] Test upload API
- [ ] Test download API
- [ ] Test delete API

### Priority 1 (High - Do Next):
- [ ] Implement import CSV/Excel (currently returns 501)
- [ ] Implement export all data (currently returns 501)
- [ ] Add unit tests
- [ ] Add integration tests

### Priority 2 (Medium - Do Later):
- [ ] Implement sync API
- [ ] Implement backup API
- [ ] Add performance optimization
- [ ] Add caching

---

## 🔧 Customization Points

### 1. Authentication Middleware

The skeleton code assumes you have:
```typescript
// middleware/auth.ts
export const authenticate = (req, res, next) => {
  // Your JWT verification logic
  // Set req.user = { id, email, role }
  next();
};
```

**Adjust to match your existing auth system.**

---

### 2. Authorization Middleware

The skeleton code assumes:
```typescript
// middleware/authorize.ts
export const authorize = (roles: string[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};
```

**Adjust to match your existing authorization.**

---

### 3. Database Configuration

The skeleton code assumes:
```typescript
// config/database.ts
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(/* your config */);

export default sequelize;
```

**Adjust to match your existing database setup.**

---

### 4. File Storage

Currently uses local filesystem:
```typescript
const uploadDir = path.join(__dirname, '../../uploads/geojson', dataType);
```

**To use S3**:
```typescript
import AWS from 'aws-sdk';

const s3 = new AWS.S3();

const uploadToS3 = async (file, key) => {
  await s3.putObject({
    Bucket: 'your-bucket',
    Key: key,
    Body: file.buffer,
  }).promise();
};
```

---

## 🧪 Testing Checklist

### Manual Testing:
- [ ] Upload valid GeoJSON file
- [ ] Upload invalid file type (should fail)
- [ ] Upload file > 10MB (should fail)
- [ ] Upload invalid GeoJSON structure (should fail)
- [ ] Download existing file
- [ ] Download non-existent file (should fail)
- [ ] Delete existing file
- [ ] Delete non-existent file (should fail)
- [ ] List all files
- [ ] Test without authentication (should fail)
- [ ] Test with wrong role (should fail)

### Unit Tests:
```typescript
// Example test
describe('Data Controller', () => {
  describe('uploadGeoJSON', () => {
    it('should upload valid GeoJSON file', async () => {
      // Test logic
    });

    it('should reject invalid file type', async () => {
      // Test logic
    });

    it('should reject file > 10MB', async () => {
      // Test logic
    });
  });
});
```

---

## 📊 API Documentation

### Upload GeoJSON
```
POST /api/data/upload
Content-Type: multipart/form-data

Body:
- file: File (required)
- dataType: string (required) - 'villages' | 'flood_risk' | 'fire_risk' | 'custom'
- description: string (optional)
- replaceExisting: boolean (optional)

Response 200:
{
  "success": true,
  "message": "อัปโหลดไฟล์สำเร็จ",
  "data": {
    "id": "uuid",
    "filename": "villages.geojson",
    "dataType": "villages",
    "size": 1024576,
    "featuresCount": 20,
    "uploadedAt": "2024-11-29T13:45:00Z",
    "uploadedBy": "admin@example.com"
  }
}

Response 400:
{
  "success": false,
  "error": "กรุณาเลือกไฟล์ .geojson หรือ .json เท่านั้น"
}
```

### Download GeoJSON
```
GET /api/data/download/:type

Response 200:
Content-Type: application/json
Content-Disposition: attachment; filename="villages.geojson"

{
  "type": "FeatureCollection",
  "features": [...]
}

Response 404:
{
  "success": false,
  "error": "ไม่พบข้อมูล villages"
}
```

### Delete GeoJSON
```
DELETE /api/data/:type

Response 200:
{
  "success": true,
  "message": "ลบข้อมูล villages สำเร็จ",
  "data": {
    "deletedType": "villages",
    "deletedAt": "2024-11-29T13:45:00Z",
    "deletedBy": "admin@example.com"
  }
}

Response 404:
{
  "success": false,
  "error": "ไม่พบข้อมูล villages"
}
```

---

## 💡 Tips & Best Practices

### 1. Error Handling
- Always use try-catch blocks
- Return consistent error format
- Log errors for debugging

### 2. Validation
- Validate file type before processing
- Validate file size before saving
- Validate GeoJSON structure thoroughly

### 3. Security
- Always check authentication
- Always check authorization (ADMIN only)
- Sanitize file names to prevent path traversal
- Limit file size to prevent DoS

### 4. Performance
- Use streaming for large files
- Add pagination for list endpoints
- Consider caching frequently accessed data

### 5. Audit Logging
- Log all data management actions
- Include user info, timestamp, IP address
- Store detailed information for debugging

---

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot find module 'sequelize'"
**Solution**: Install Sequelize
```bash
npm install sequelize
npm install --save-dev @types/sequelize
```

### Issue 2: "Property 'user' does not exist on type 'Request'"
**Solution**: Extend Express Request type
```typescript
// types/express.d.ts
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}
```

### Issue 3: TypeScript errors in models
**Solution**: Make sure Sequelize is properly configured
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

---

## ✅ Success Criteria

### Phase 1 Complete When:
- ✅ All 3 P0 APIs working (Upload, Download, Delete)
- ✅ Database tables created
- ✅ Validation working correctly
- ✅ Audit logging working
- ✅ Manual tests passing
- ✅ Frontend can upload/download/delete files

### Ready for QA When:
- ✅ All APIs implemented
- ✅ Unit tests written
- ✅ Integration tests passing
- ✅ API documentation complete
- ✅ Error handling robust

---

**Created**: 29 พฤศจิกายน 2568 เวลา 13:45 น.  
**Status**: 🟢 **Ready for Implementation**  
**Estimate**: 4-7 hours for P0 APIs

---

**"Skeleton Code Ready! Start Building Now! APIs Waiting!"** 🔧⚡💪
