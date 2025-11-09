# Sprint 2 Week 1 - Backend Technical Specification

**Project:** Guardian Route - Disaster Management System  
**Sprint:** 2  
**Week:** 1  
**Focus:** Analytics API Endpoints (Initial)  
**Date:** November 9, 2025

---

## 1. Overview

เอกสารนี้เป็นข้อกำหนดทางเทคนิค (Technical Specification) สำหรับ Backend Team ในการพัฒนา Analytics API Endpoints 2 ตัวแรกสำหรับ Executive Dashboard ตาม Task ที่ได้รับมอบหมายใน Sprint 2, Week 1

**Endpoints:**
1. `GET /api/analytics/kpi-summary`
2. `GET /api/analytics/by-status`

---

## 2. Module & File Structure

ให้สร้าง Module ใหม่สำหรับจัดการ Analytics โดยเฉพาะ

```
/src
  ├── analytics/
  │   ├── dto/
  │   │   ├── kpi-summary.dto.ts
  │   │   └── incidents-by-status.dto.ts
  │   ├── analytics.controller.ts
  │   ├── analytics.service.ts
  │   └── analytics.module.ts
  └── app.module.ts (import AnalyticsModule)
```

---

## 3. General Implementation Notes

### 3.1. Authentication & Authorization

- ทุก Endpoint ใน `AnalyticsController` ต้องถูกป้องกันด้วย `AuthGuard`
- ต้องมีการตรวจสอบ Role-based access, อนุญาตเฉพาะ `ADMIN`, `SUPERVISOR`, `EXECUTIVE`

### 3.2. Caching Strategy

- **แนะนำ:** ใช้ `@nestjs/cache-manager` (Redis) เพื่อ cache ผลลัพธ์ของ API calls
- **Cache Key:** `analytics:kpi-summary`, `analytics:by-status`
- **TTL (Time-to-Live):** 5-10 นาที เพื่อลดภาระของฐานข้อมูล

### 3.3. Error Handling

- ใช้ `try...catch` block ใน service methods
- หากเกิดข้อผิดพลาดในการ query ฐานข้อมูล ให้ throw `InternalServerErrorException`

---

## 4. Endpoint 1: `GET /api/analytics/kpi-summary`

### 4.1. Controller (`analytics.controller.ts`)

```typescript
@Controller("analytics")
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERVISOR, Role.EXECUTIVE)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("kpi-summary")
  @HttpCode(HttpStatus.OK)
  async getKpiSummary(): Promise<KpiSummaryDto> {
    return this.analyticsService.getKpiSummary();
  }
}
```

### 4.2. Response DTO (`dto/kpi-summary.dto.ts`)

```typescript
import { ApiProperty } from "@nestjs/swagger";

export class KpiSummaryDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  pending: number;

  @ApiProperty()
  investigating: number;

  @ApiProperty()
  resolved: number;

  @ApiProperty({ description: "Average resolution time in hours (e.g., 3.5h)" })
  avgResolutionTime: string;
}
```

### 4.3. Service (`analytics.service.ts`)

```typescript
@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getKpiSummary(): Promise<KpiSummaryDto> {
    const [total, pending, investigating, resolved, resolvedIncidents] = await Promise.all([
      this.prisma.incident.count(),
      this.prisma.incident.count({ where: { status: "PENDING" } }),
      this.prisma.incident.count({ where: { status: "INVESTIGATING" } }),
      this.prisma.incident.count({ where: { status: "RESOLVED" } }),
      this.prisma.incident.findMany({
        where: { status: "RESOLVED", resolvedAt: { not: null } },
        select: { createdAt: true, resolvedAt: true },
      }),
    ]);

    let avgMillis = 0;
    if (resolvedIncidents.length > 0) {
      const totalMillis = resolvedIncidents.reduce((sum, inc) => {
        return sum + (inc.resolvedAt.getTime() - inc.createdAt.getTime());
      }, 0);
      avgMillis = totalMillis / resolvedIncidents.length;
    }

    const avgHours = (avgMillis / (1000 * 60 * 60)).toFixed(1);

    return {
      total,
      pending,
      investigating,
      resolved,
      avgResolutionTime: `${avgHours}h`,
    };
  }
}
```

**หมายเหตุ:** การใช้ `Promise.all` จะช่วยให้ query ทั้งหมดทำงานพร้อมกัน เพิ่มประสิทธิภาพ

---

## 5. Endpoint 2: `GET /api/analytics/by-status`

### 5.1. Controller (`analytics.controller.ts`)

```typescript
// ... (inside AnalyticsController)

@Get("by-status")
@HttpCode(HttpStatus.OK)
async getIncidentsByStatus(): Promise<IncidentsByStatusDto[]> {
  return this.analyticsService.getIncidentsByStatus();
}
```

### 5.2. Response DTO (`dto/incidents-by-status.dto.ts`)

```typescript
import { ApiProperty } from "@nestjs/swagger";
import { IncidentStatus } from "@prisma/client";

export class IncidentsByStatusDto {
  @ApiProperty({ enum: IncidentStatus })
  status: IncidentStatus;

  @ApiProperty()
  count: number;
}
```

### 5.3. Service (`analytics.service.ts`)

```typescript
// ... (inside AnalyticsService)

async getIncidentsByStatus(): Promise<IncidentsByStatusDto[]> {
  const statusCounts = await this.prisma.incident.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  // Initialize all statuses with count 0
  const allStatuses = Object.values(IncidentStatus).reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as Record<IncidentStatus, number>);

  // Populate with actual counts
  for (const item of statusCounts) {
    allStatuses[item.status] = item._count.status;
  }

  // Convert to array and sort
  const result = Object.entries(allStatuses).map(([status, count]) => ({
    status: status as IncidentStatus,
    count,
  }));

  // Optional: Sort for consistent order
  const statusOrder: IncidentStatus[] = ["PENDING", "INVESTIGATING", "RESOLVED", "REJECTED"];
  result.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

  return result;
}
```

**หมายเหตุ:** Logic นี้จะทำให้มั่นใจได้ว่าทุกสถานะจะถูกส่งกลับไปเสมอ แม้ว่าจะมี count เป็น 0 ก็ตาม

---

## 6. Unit Testing

- สร้าง `analytics.service.spec.ts` และ `analytics.controller.spec.ts`
- Mock `PrismaService` เพื่อทดสอบ logic ของ service โดยไม่ต้องเชื่อมต่อฐานข้อมูลจริง
- ตรวจสอบว่า `getKpiSummary` คำนวณ `avgResolutionTime` ได้ถูกต้อง (รวมถึงกรณีที่ไม่มี incident ที่ resolved)
- ตรวจสอบว่า `getIncidentsByStatus` return ทุกสถานะและมี count ที่ถูกต้อง
- ตั้งเป้าหมาย Coverage ที่ 80% ขึ้นไปสำหรับไฟล์ใหม่

---

**Status:** 📝 **Ready for Development**
