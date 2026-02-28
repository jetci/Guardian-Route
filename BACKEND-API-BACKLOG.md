# 🔧 Backend API Backlog - Admin Data Management

**Created**: 29 พฤศจิกายน 2568 เวลา 13:33 น.  
**Owner**: Team W - Backend Development  
**Priority**: 🔴 **CRITICAL - UAT Blocker**  
**Target Completion**: ภายใน 1-2 วัน (30 พ.ย. - 1 ธ.ค. 2568)

---

## 📊 Executive Summary

### Current Status:
- ✅ **Frontend**: 100% Complete (UI/UX, Navigation, Client-side Validation)
- ❌ **Backend**: 0% Complete (All API endpoints missing)
- 🔴 **Impact**: Cannot complete Functionality Testing (Phase 3)
- 🔴 **Risk**: UAT may be delayed if not completed soon

### Required APIs:
- **Total**: 7 endpoints
- **Priority**: All Critical
- **Estimated Time**: 12-16 hours total

---

## 🎯 API Endpoints Required

### 1. Upload GeoJSON Data 📥

**Endpoint**: `POST /api/data/upload`

**Priority**: 🔴 **Critical** (P0)  
**Estimate**: 2-3 hours  
**Complexity**: Medium

#### Request:
```json
POST /api/data/upload
Content-Type: multipart/form-data

{
  "file": File (GeoJSON/JSON),
  "dataType": "villages" | "flood_risk" | "fire_risk" | "custom",
  "description": "string (optional)",
  "replaceExisting": boolean
}
```

#### Response (Success):
```json
{
  "success": true,
  "message": "อัปโหลดไฟล์สำเร็จ",
  "data": {
    "id": "uuid",
    "filename": "villages.geojson",
    "dataType": "villages",
    "size": 1024576,
    "featuresCount": 20,
    "uploadedAt": "2024-11-29T13:33:00Z",
    "uploadedBy": "admin@example.com"
  }
}
```

#### Response (Error):
```json
{
  "success": false,
  "error": "INVALID_FILE_TYPE",
  "message": "กรุณาอัปโหลดไฟล์ .geojson หรือ .json เท่านั้น"
}
```

#### Validation:
- ✅ File type: `.geojson`, `.json` only
- ✅ File size: Max 10MB
- ✅ GeoJSON structure: Must have `type` and `features`
- ✅ Features validation: Valid coordinates, properties
- ✅ Duplicate check: If `replaceExisting=false`

#### Business Logic:
1. Validate file type and size
2. Parse and validate GeoJSON structure
3. Check for duplicates (if needed)
4. Store file in storage (S3/local)
5. Save metadata to database
6. Create audit log entry
7. Return success response

#### Database Schema:
```sql
CREATE TABLE geojson_data (
  id UUID PRIMARY KEY,
  filename VARCHAR(255),
  data_type VARCHAR(50),
  description TEXT,
  file_path VARCHAR(500),
  file_size BIGINT,
  features_count INT,
  uploaded_at TIMESTAMP,
  uploaded_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### 2. Download GeoJSON Data 📤

**Endpoint**: `GET /api/data/download/:type`

**Priority**: 🔴 **Critical** (P0)  
**Estimate**: 1-2 hours  
**Complexity**: Low

#### Request:
```
GET /api/data/download/villages
GET /api/data/download/flood_risk
GET /api/data/download/fire_risk
```

#### Response:
```
Content-Type: application/json
Content-Disposition: attachment; filename="villages.geojson"

{
  "type": "FeatureCollection",
  "features": [...]
}
```

#### Business Logic:
1. Validate data type parameter
2. Check user permissions
3. Retrieve file from storage
4. Set appropriate headers
5. Stream file to client
6. Create audit log entry

---

### 3. Delete GeoJSON Data 🗑️

**Endpoint**: `DELETE /api/data/:type`

**Priority**: 🔴 **Critical** (P0)  
**Estimate**: 1-2 hours  
**Complexity**: Low

#### Request:
```
DELETE /api/data/villages
```

#### Response (Success):
```json
{
  "success": true,
  "message": "ลบข้อมูล villages สำเร็จ",
  "data": {
    "deletedType": "villages",
    "deletedAt": "2024-11-29T13:33:00Z",
    "deletedBy": "admin@example.com"
  }
}
```

#### Business Logic:
1. Validate data type
2. Check user permissions (ADMIN only)
3. Confirm data exists
4. Delete file from storage
5. Delete metadata from database
6. Create audit log entry
7. Return success response

---

### 4. Import CSV/Excel Data 📊

**Endpoint**: `POST /api/data/import`

**Priority**: 🟡 **High** (P1)  
**Estimate**: 3-4 hours  
**Complexity**: High

#### Request:
```json
POST /api/data/import
Content-Type: multipart/form-data

{
  "file": File (CSV/Excel),
  "dataType": "villages" | "incidents" | "users",
  "mapping": {
    "column1": "field1",
    "column2": "field2"
  },
  "skipFirstRow": boolean
}
```

#### Response:
```json
{
  "success": true,
  "message": "นำเข้าข้อมูล 100 รายการสำเร็จ",
  "data": {
    "totalRows": 100,
    "successRows": 98,
    "failedRows": 2,
    "errors": [
      {
        "row": 5,
        "error": "Invalid email format"
      }
    ]
  }
}
```

#### Business Logic:
1. Validate file type (CSV, XLSX, XLS)
2. Parse file
3. Validate column mapping
4. Process each row with validation
5. Insert valid rows to database
6. Collect errors for failed rows
7. Create audit log
8. Return summary

---

### 5. Export All Data 📦

**Endpoint**: `POST /api/data/export`

**Priority**: 🟡 **High** (P1)  
**Estimate**: 2-3 hours  
**Complexity**: Medium

#### Request:
```json
POST /api/data/export
{
  "dataTypes": ["villages", "flood_risk", "fire_risk"],
  "format": "geojson" | "csv" | "excel",
  "includeMetadata": boolean
}
```

#### Response:
```json
{
  "success": true,
  "message": "สร้างไฟล์ export สำเร็จ",
  "data": {
    "downloadUrl": "/api/data/download-export/abc123",
    "filename": "guardian_route_export_20241129.zip",
    "expiresAt": "2024-11-29T14:33:00Z"
  }
}
```

#### Business Logic:
1. Validate data types and format
2. Retrieve all requested data
3. Convert to requested format
4. Create ZIP archive
5. Store temporarily
6. Generate download URL
7. Create audit log
8. Return download link

---

### 6. Sync Data with External System 🔄

**Endpoint**: `POST /api/data/sync`

**Priority**: 🟢 **Medium** (P2)  
**Estimate**: 3-4 hours  
**Complexity**: High

#### Request:
```json
POST /api/data/sync
{
  "source": "external_gis_system",
  "dataTypes": ["villages", "flood_risk"],
  "syncMode": "full" | "incremental"
}
```

#### Response:
```json
{
  "success": true,
  "message": "ซิงค์ข้อมูลสำเร็จ",
  "data": {
    "syncedAt": "2024-11-29T13:33:00Z",
    "totalRecords": 50,
    "newRecords": 5,
    "updatedRecords": 10,
    "deletedRecords": 2
  }
}
```

#### Business Logic:
1. Connect to external system
2. Fetch data based on sync mode
3. Compare with local data
4. Apply changes (insert/update/delete)
5. Handle conflicts
6. Create audit log
7. Return sync summary

---

### 7. Backup Data 💾

**Endpoint**: `POST /api/data/backup`

**Priority**: 🟢 **Medium** (P2)  
**Estimate**: 2-3 hours  
**Complexity**: Medium

#### Request:
```json
POST /api/data/backup
{
  "includeFiles": boolean,
  "includeDatabase": boolean,
  "compression": "zip" | "tar.gz"
}
```

#### Response:
```json
{
  "success": true,
  "message": "สร้าง backup สำเร็จ",
  "data": {
    "backupId": "backup_20241129_133300",
    "filename": "guardian_route_backup_20241129.zip",
    "size": 10485760,
    "downloadUrl": "/api/data/download-backup/backup_20241129_133300",
    "createdAt": "2024-11-29T13:33:00Z"
  }
}
```

#### Business Logic:
1. Create backup directory
2. Export database (if requested)
3. Copy files (if requested)
4. Compress to archive
5. Store backup
6. Create audit log
7. Return backup info

---

## 📊 Priority & Estimation Summary

| Priority | Endpoint | Estimate | Complexity | Dependencies |
|----------|----------|----------|------------|--------------|
| 🔴 P0 | Upload GeoJSON | 2-3h | Medium | Database, Storage |
| 🔴 P0 | Download GeoJSON | 1-2h | Low | Storage |
| 🔴 P0 | Delete GeoJSON | 1-2h | Low | Database, Storage |
| 🟡 P1 | Import CSV/Excel | 3-4h | High | CSV Parser, Database |
| 🟡 P1 | Export All | 2-3h | Medium | Database, Storage |
| 🟢 P2 | Sync Data | 3-4h | High | External API |
| 🟢 P2 | Backup | 2-3h | Medium | Database, Storage |

**Total Estimate**: 14-21 hours

---

## 🎯 Development Plan

### Phase 1: Critical APIs (P0) - Day 1
**Target**: 30 พ.ย. 2568  
**Duration**: 4-7 hours

1. ✅ Setup database schema
2. ✅ Implement Upload GeoJSON API
3. ✅ Implement Download GeoJSON API
4. ✅ Implement Delete GeoJSON API
5. ✅ Write unit tests
6. ✅ Test with frontend

**Deliverable**: Core data management working

---

### Phase 2: High Priority APIs (P1) - Day 1-2
**Target**: 30 พ.ย. - 1 ธ.ค. 2568  
**Duration**: 5-7 hours

1. ✅ Implement Import CSV/Excel API
2. ✅ Implement Export All API
3. ✅ Write unit tests
4. ✅ Integration testing

**Deliverable**: Import/Export features working

---

### Phase 3: Medium Priority APIs (P2) - Day 2
**Target**: 1 ธ.ค. 2568  
**Duration**: 5-7 hours

1. ✅ Implement Sync Data API
2. ✅ Implement Backup API
3. ✅ Write unit tests
4. ✅ Full system testing

**Deliverable**: All features complete

---

## 🔧 Technical Requirements

### Database:
- PostgreSQL with PostGIS extension (for GeoJSON)
- Tables: `geojson_data`, `audit_logs`

### Storage:
- Local filesystem or AWS S3
- Directory structure: `/uploads/geojson/{type}/{filename}`

### Libraries:
- **Node.js**: `multer` (file upload), `geojson-validation` (validation)
- **Python**: `geopandas`, `shapely` (GeoJSON processing)
- **CSV/Excel**: `csv-parser`, `xlsx`, `exceljs`

### Security:
- ✅ Authentication: JWT token required
- ✅ Authorization: ADMIN role only
- ✅ File validation: Type, size, structure
- ✅ SQL injection prevention: Parameterized queries
- ✅ Path traversal prevention: Sanitize filenames

### Audit Logging:
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  action VARCHAR(50), -- 'upload', 'download', 'delete', 'import', 'export'
  resource_type VARCHAR(50), -- 'geojson_data'
  resource_id UUID,
  user_id UUID,
  user_email VARCHAR(100),
  ip_address VARCHAR(50),
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ✅ Testing Checklist

### Unit Tests:
- [ ] Upload validation (file type, size, format)
- [ ] GeoJSON structure validation
- [ ] Download file streaming
- [ ] Delete with permissions check
- [ ] Import CSV parsing and validation
- [ ] Export format conversion
- [ ] Sync conflict resolution
- [ ] Backup creation and compression

### Integration Tests:
- [ ] Upload → Download → Delete flow
- [ ] Import → Export flow
- [ ] Sync → Verify data consistency
- [ ] Backup → Restore flow

### Security Tests:
- [ ] Unauthorized access (no token)
- [ ] Wrong role (SUPERVISOR trying to upload)
- [ ] File size limit (>10MB)
- [ ] Invalid file type (.exe, .zip)
- [ ] SQL injection attempts
- [ ] Path traversal attempts

---

## 📋 API Documentation

### Swagger/OpenAPI Spec:
```yaml
openapi: 3.0.0
info:
  title: Guardian Route - Data Management API
  version: 1.0.0
paths:
  /api/data/upload:
    post:
      summary: Upload GeoJSON file
      security:
        - bearerAuth: []
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                dataType:
                  type: string
                  enum: [villages, flood_risk, fire_risk]
      responses:
        200:
          description: Upload successful
        400:
          description: Invalid file
        401:
          description: Unauthorized
        403:
          description: Forbidden
```

---

## 🎯 Success Criteria

### Phase 1 (P0 APIs):
- ✅ Upload GeoJSON works with validation
- ✅ Download returns correct file
- ✅ Delete removes file and metadata
- ✅ All actions logged in audit_logs
- ✅ Frontend integration successful

### Phase 2 (P1 APIs):
- ✅ Import CSV/Excel with error handling
- ✅ Export creates ZIP with multiple formats
- ✅ All features tested end-to-end

### Phase 3 (P2 APIs):
- ✅ Sync works with external system
- ✅ Backup creates complete archive
- ✅ All APIs documented

---

## 📊 Risk Assessment

### High Risk:
- ⚠️ **Time Constraint**: 1-2 days is tight for 7 APIs
- ⚠️ **External Dependencies**: Sync API needs external system access

### Medium Risk:
- ⚠️ **GeoJSON Complexity**: Large files may cause performance issues
- ⚠️ **Storage**: Need to decide S3 vs local filesystem

### Low Risk:
- ✅ **Technology Stack**: Familiar tools (Node.js, PostgreSQL)
- ✅ **Team Capability**: Team W has experience

---

## 💡 Recommendations

### Priority 1 (Do First):
1. **Implement P0 APIs** (Upload, Download, Delete) - 4-7 hours
2. **Test with Frontend** - Ensure Phase 3 testing can proceed
3. **Deploy to Dev** - Let QA start testing

### Priority 2 (Do Next):
4. **Implement P1 APIs** (Import, Export) - 5-7 hours
5. **Full Integration Testing**
6. **Deploy to Staging**

### Priority 3 (Do Last):
7. **Implement P2 APIs** (Sync, Backup) - 5-7 hours
8. **Performance Testing**
9. **Production Deployment**

---

## 📞 Contact & Support

**Backend Team Lead**: [Assign Developer]  
**QA Lead**: Team W - Cascade AI Developer  
**Timeline**: 30 พ.ย. - 1 ธ.ค. 2568  
**Status Updates**: Every 4 hours

---

**Created**: 29 พฤศจิกายน 2568 เวลา 13:33 น.  
**Last Updated**: 29 พฤศจิกายน 2568 เวลา 13:33 น.  
**Status**: 🔴 **URGENT - Start Immediately**

---

**"Backend APIs Required! 7 Endpoints! 14-21 Hours! Start Now!"** 🔧⚡💪
