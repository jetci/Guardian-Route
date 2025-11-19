# 💻 Developer Documentation - Village Boundaries Module

**Guardian Route System**  
**Version:** 1.0  
**Last Updated:** November 18, 2025

---

## 🏗️ Architecture Overview

### Tech Stack

```
Frontend:
├── React 18.2.0
├── TypeScript 5.0
├── Vite 4.3
├── Leaflet 1.9.4
├── Leaflet-Draw
├── SweetAlert2
├── React Hot Toast
└── Axios

Backend:
├── NestJS 10.0
├── Prisma ORM 5.0
├── PostgreSQL 15
├── PostGIS Extension
└── TypeScript 5.0

Maps & GIS:
├── Leaflet (Base map library)
├── Leaflet-Draw (Drawing tools)
├── Leaflet-Geoman (Advanced drawing)
├── OpenStreetMap (Street tiles)
├── Esri ArcGIS (Satellite tiles)
└── GeoJSON (Data format)
```

---

## 📁 Project Structure

### Frontend Structure

```
frontend/src/
├── pages/admin/
│   ├── VillageBoundariesPage.tsx      # Main page component
│   ├── VillageBoundariesPage.css      # Page styles
│   └── ManageUsersPage.tsx            # User management
│
├── components/
│   ├── VillageBoundaryMap.tsx         # Map component
│   ├── VillageBoundaryMap.css         # Map styles
│   ├── GeoJSONUploader.tsx            # Upload component
│   └── layout/
│       └── DashboardLayout.tsx        # Layout wrapper
│
├── services/
│   ├── boundariesService.ts           # API service
│   └── userService.ts                 # User API
│
└── stores/
    └── authStore.ts                   # Auth state
```

### Backend Structure

```
backend/src/
├── admin/
│   ├── admin.controller.ts            # API endpoints
│   ├── admin.service.ts               # Business logic
│   └── dto/
│       ├── create-boundary.dto.ts     # Create DTO
│       └── update-boundary.dto.ts     # Update DTO
│
├── prisma/
│   ├── schema.prisma                  # Database schema
│   └── migrations/                    # DB migrations
│
└── scripts/
    ├── clear-boundaries.js            # Clear script
    └── check-villages.js              # Check script
```

---

## 🗄️ Database Schema

### Village Model

```prisma
model Village {
  id          String   @id @default(uuid())
  villageNo   Int      @unique
  name        String
  tambonId    String
  
  // GeoJSON fields
  boundary    Json?    // Polygon GeoJSON
  centerPoint Json?    // Point GeoJSON
  
  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  tambon      Tambon   @relation(fields: [tambonId], references: [id])
  incidents   Incident[]
  
  @@map("villages")
}
```

### GeoBoundary Model

```prisma
model GeoBoundary {
  id         String   @id @default(uuid())
  name       String
  type       String   // 'village' | 'tambon' | 'custom'
  geojson    Json     // GeoJSON geometry
  properties Json?    // Additional properties
  villageId  String?  // Optional village link
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  createdBy  String
  
  @@map("geo_boundaries")
}
```

### GeoJSON Format

```typescript
// Polygon GeoJSON
{
  type: 'Polygon',
  coordinates: [
    [
      [lng1, lat1],
      [lng2, lat2],
      [lng3, lat3],
      [lng1, lat1]  // Close the polygon
    ]
  ]
}

// Point GeoJSON
{
  type: 'Point',
  coordinates: [lng, lat]
}
```

---

## 🔌 API Endpoints

### Village Boundaries

#### **GET /api/admin/villages**
Get all villages with boundaries

```typescript
Response: VillageBoundary[]

interface VillageBoundary {
  id: string;
  villageNo: number;
  name: string;
  boundary: GeoJSON | null;
  centerPoint: GeoJSON | null;
  createdAt: string;
  updatedAt: string;
}
```

#### **PUT /api/admin/villages/:villageId/boundary**
Update village boundary

```typescript
Request Body:
{
  boundary: GeoJSON,      // Polygon geometry
  centerPoint: GeoJSON    // Point geometry
}

Response: Village
```

#### **DELETE /api/admin/villages/:villageId/boundary**
Delete village boundary

```typescript
Response: { message: string }
```

### Tambon Boundary

#### **GET /api/admin/tambon/boundary**
Get tambon boundary

```typescript
Response: GeoBoundary | null
```

#### **POST /api/admin/tambon/boundary**
Create/Update tambon boundary

```typescript
Request Body:
{
  name: string,
  geojson: GeoJSON
}

Response: GeoBoundary
```

---

## 🎨 Component Architecture

### VillageBoundariesPage

Main page component with state management.

```typescript
// State Management
const [villageBoundaries, setVillageBoundaries] = useState<VillageBoundary[]>([]);
const [drawnBoundary, setDrawnBoundary] = useState<any>(null);
const [selectedVillageNo, setSelectedVillageNo] = useState<number | '' | 'tambon'>('');
const [coordinateMarkers, setCoordinateMarkers] = useState<CoordinateMarker[]>([]);
const [mapLayerType, setMapLayerType] = useState<'street' | 'satellite' | 'hybrid'>('street');

// Key Functions
loadBoundaries()           // Load all boundaries from API
handleBoundaryDrawn()      // Handle new boundary drawn
handleSaveDrawnBoundary()  // Save boundary to database
handleEditBoundary()       // Edit existing boundary
handleDeleteBoundary()     // Delete boundary (with confirmation)
handleAddMarker()          // Add coordinate marker
handleRemoveMarker()       // Remove marker (with confirmation)
```

### VillageBoundaryMap

Map component using Leaflet.

```typescript
// Props
interface VillageBoundaryMapProps {
  onBoundaryDrawn?: (geojson: any) => void;
  existingBoundaries?: any[];
  coordinateMarkers?: CoordinateMarker[];
  mapLayerType?: 'street' | 'satellite' | 'hybrid';
  showLegendOnMap?: boolean;
  georeferenceOverlay?: GeoreferenceOverlay | null;
  flyToMarker?: CoordinateMarker | null;
  onFlyToComplete?: () => void;
}

// Key Features
- Leaflet map initialization
- Drawing tools (Polygon, Rectangle, Circle)
- Layer control (Street, Satellite, Hybrid)
- Color-coded boundaries (20 colors)
- Coordinate markers
- Georeference overlay
- Legend control
```

---

## 🎨 Color System

### Village Color Palette

```typescript
const getVillageColor = (villageNo: number): string => {
  const colors = [
    '#e74c3c',  // 1 - Red
    '#3498db',  // 2 - Blue
    '#2ecc71',  // 3 - Green
    '#f39c12',  // 4 - Orange
    '#9b59b6',  // 5 - Purple
    '#1abc9c',  // 6 - Turquoise
    '#e67e22',  // 7 - Carrot
    '#34495e',  // 8 - Dark Gray
    '#16a085',  // 9 - Green Sea
    '#c0392b',  // 10 - Dark Red
    '#27ae60',  // 11 - Nephritis
    '#2980b9',  // 12 - Belize Hole
    '#8e44ad',  // 13 - Wisteria
    '#f1c40f',  // 14 - Yellow
    '#d35400',  // 15 - Pumpkin
    '#7f8c8d',  // 16 - Asbestos
    '#e91e63',  // 17 - Pink
    '#00bcd4',  // 18 - Cyan
    '#4caf50',  // 19 - Light Green
    '#ff5722',  // 20 - Deep Orange
  ];
  return colors[(villageNo - 1) % colors.length];
};
```

### Usage

```typescript
// On map
const layer = L.geoJSON(geojson, {
  style: {
    color: getVillageColor(boundary.villageNo),
    weight: 3,
    opacity: 0.8,
    fillOpacity: 0.2,
  },
});

// In list
<div style={{ background: getVillageColor(villageNo) }} />
```

---

## 🔐 Security Features

### Delete Confirmations

All destructive actions require confirmation using SweetAlert2:

```typescript
const confirmDelete = async (item: any) => {
  const result = await Swal.fire({
    title: '⚠️ ยืนยันการลบ',
    html: `<p>คุณแน่ใจหรือไม่ที่จะลบ:</p>
           <strong>${item.name}</strong>
           <p class="text-danger">การดำเนินการนี้ไม่สามารถย้อนกลับได้!</p>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: '🗑️ ยืนยันลบ',
    cancelButtonText: '❌ ยกเลิก',
    focusCancel: true,  // Safety: focus on cancel
  });

  if (result.isConfirmed) {
    // Proceed with deletion
  }
};
```

### Authorization

```typescript
// Backend: Admin only
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'DEVELOPER')
@Put('villages/:villageId/boundary')
async updateVillageBoundary() { ... }

// Frontend: Check role
const isAdmin = user?.role === 'ADMIN' || user?.role === 'DEVELOPER';
if (!isAdmin) {
  return <Navigate to="/unauthorized" />;
}
```

---

## 📱 Responsive Design

### Mobile-First Approach

```css
/* Desktop (default) */
.external-map-controls {
  padding: 1.5rem;
}

.layer-options {
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

/* Mobile (≤ 768px) */
@media (max-width: 768px) {
  .external-map-controls {
    padding: 1rem;
  }
  
  .layer-options {
    grid-template-columns: 1fr;  /* Stack vertically */
  }
  
  .village-color-legend {
    grid-template-columns: 1fr;
    max-height: 200px;
  }
}
```

### Touch Optimization

```typescript
// Leaflet touch events
map.on('touchstart', handleTouchStart);
map.on('touchmove', handleTouchMove);
map.on('touchend', handleTouchEnd);

// Larger touch targets
.layer-option {
  padding: 12px 16px;  /* Minimum 44x44px for touch */
  cursor: pointer;
}
```

---

## 🧪 Testing

### Unit Tests

```typescript
// Example: Color function test
describe('getVillageColor', () => {
  it('should return correct color for village 1', () => {
    expect(getVillageColor(1)).toBe('#e74c3c');
  });
  
  it('should wrap around for village > 20', () => {
    expect(getVillageColor(21)).toBe('#e74c3c');  // Same as village 1
  });
});
```

### Integration Tests

```typescript
// Example: Boundary save test
describe('Save Boundary', () => {
  it('should save boundary successfully', async () => {
    const boundary = { /* GeoJSON */ };
    const result = await boundariesService.updateVillageBoundary(
      'village-id',
      boundary,
      centerPoint
    );
    expect(result.boundary).toEqual(boundary);
  });
});
```

### Manual Testing Checklist

```
✅ Draw boundary → Save → Verify in list
✅ Edit boundary → Save → Verify changes
✅ Delete boundary → Confirm → Verify deletion
✅ Add marker → Verify on map
✅ Remove marker → Confirm → Verify deletion
✅ Change layer type → Verify map updates
✅ Toggle legend → Verify show/hide
✅ Mobile: Touch gestures work
✅ Mobile: Controls accessible
✅ Export GeoJSON → Verify file
```

---

## 🚀 Deployment

### Environment Variables

```env
# Frontend (.env)
VITE_API_URL=http://localhost:3001/api

# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/guardian_route
JWT_SECRET=your-secret-key
PORT=3001
```

### Build Commands

```bash
# Frontend
cd frontend
npm run build
# Output: dist/

# Backend
cd backend
npm run build
# Output: dist/

# Database
npx prisma migrate deploy
npx prisma generate
```

### Production Checklist

```
✅ Environment variables set
✅ Database migrations run
✅ PostGIS extension enabled
✅ CORS configured
✅ HTTPS enabled
✅ Error logging configured
✅ Backup strategy in place
✅ Monitoring enabled
```

---

## 🐛 Debugging

### Common Issues

#### **1. Boundary not saving**

```typescript
// Debug: Check payload
console.log('Saving boundary:', {
  villageId,
  boundary,
  centerPoint
});

// Debug: Check response
try {
  const result = await api.put(`/villages/${villageId}/boundary`, data);
  console.log('Save result:', result);
} catch (error) {
  console.error('Save error:', error.response?.data);
}
```

#### **2. Map not rendering**

```typescript
// Debug: Check map initialization
useEffect(() => {
  console.log('Map ref:', mapRef.current);
  console.log('Is ready:', isReady);
}, [isReady]);

// Debug: Check Leaflet loaded
console.log('Leaflet version:', L.version);
```

#### **3. Colors not showing**

```typescript
// Debug: Check color function
const color = getVillageColor(villageNo);
console.log(`Village ${villageNo} color:`, color);

// Debug: Check boundary data
console.log('Boundary:', boundary);
console.log('Has villageNo:', boundary.villageNo);
```

### Logging

```typescript
// Frontend: Console logging
console.log('[VillageBoundaries] Loading boundaries...');
console.error('[VillageBoundaries] Error:', error);

// Backend: NestJS Logger
import { Logger } from '@nestjs/common';

private readonly logger = new Logger(AdminService.name);

this.logger.log('Updating village boundary');
this.logger.error('Failed to update boundary', error.stack);
```

---

## 📊 Performance Optimization

### Frontend Optimization

```typescript
// 1. Memoize expensive calculations
const villageColors = useMemo(() => {
  return villageBoundaries.map(v => ({
    ...v,
    color: getVillageColor(v.villageNo)
  }));
}, [villageBoundaries]);

// 2. Debounce map events
const handleMapMove = useMemo(
  () => debounce((e) => {
    // Handle move
  }, 300),
  []
);

// 3. Lazy load components
const GeoJSONUploader = lazy(() => import('./GeoJSONUploader'));
```

### Backend Optimization

```typescript
// 1. Database indexing
@@index([villageNo])
@@index([tambonId])

// 2. Select only needed fields
const villages = await prisma.village.findMany({
  select: {
    id: true,
    villageNo: true,
    name: true,
    boundary: true,
    centerPoint: true,
  },
});

// 3. Caching
@UseInterceptors(CacheInterceptor)
@CacheTTL(300)  // 5 minutes
@Get('villages')
async getVillages() { ... }
```

---

## 🔄 State Management

### React State Flow

```
User Action
    ↓
Event Handler
    ↓
setState()
    ↓
Re-render
    ↓
useEffect (if needed)
    ↓
API Call (if needed)
    ↓
Update State
    ↓
Re-render
```

### Example Flow: Save Boundary

```typescript
// 1. User clicks save
handleSaveDrawnBoundary()

// 2. Validate input
if (!selectedVillageNo) return;

// 3. Find village
const village = villageBoundaries.find(v => v.villageNo === selectedVillageNo);

// 4. Call API
await boundariesService.updateVillageBoundary(village.id, boundary, centerPoint);

// 5. Show success
toast.success('บันทึกสำเร็จ');

// 6. Reload data
loadBoundaries();

// 7. Reset form
setDrawnBoundary(null);
setBoundaryName('');
setSelectedVillageNo('');
```

---

## 📚 External Libraries

### Leaflet

```typescript
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

// Initialize map
const map = L.map('map-id').setView([lat, lng], zoom);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Add GeoJSON
L.geoJSON(geojson, { style: {...} }).addTo(map);
```

### SweetAlert2

```typescript
import Swal from 'sweetalert2';

// Confirmation dialog
const result = await Swal.fire({
  title: 'Title',
  html: 'Content',
  icon: 'warning',
  showCancelButton: true,
});

if (result.isConfirmed) {
  // Confirmed
}
```

### React Hot Toast

```typescript
import toast from 'react-hot-toast';

// Success
toast.success('Success message');

// Error
toast.error('Error message');

// Custom
toast('Custom message', { icon: '🔥' });
```

---

## 🔧 Development Tools

### Recommended VS Code Extensions

```
- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Prisma
- GitLens
- Thunder Client (API testing)
```

### Useful Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript check

# Backend
npm run start:dev    # Start dev server
npm run build        # Build for production
npm run test         # Run tests
npx prisma studio    # Open Prisma Studio

# Database
npx prisma migrate dev     # Create migration
npx prisma migrate deploy  # Deploy migration
npx prisma generate        # Generate client
npx prisma db seed         # Seed database
```

---

## 📖 References

### Documentation Links

- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/
- **Leaflet**: https://leafletjs.com/
- **NestJS**: https://nestjs.com/
- **Prisma**: https://www.prisma.io/
- **PostGIS**: https://postgis.net/
- **GeoJSON**: https://geojson.org/

### Useful Resources

- **Leaflet Tutorials**: https://leafletjs.com/examples.html
- **GeoJSON Validator**: https://geojsonlint.com/
- **Color Picker**: https://flatuicolors.com/

---

**Maintained by:** Team W  
**For:** Guardian Route System  
**Date:** November 18, 2025
