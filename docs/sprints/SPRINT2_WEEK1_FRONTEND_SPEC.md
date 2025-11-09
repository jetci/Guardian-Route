# Sprint 2 Week 1 - Frontend Technical Specification

**Project:** Guardian Route - Disaster Management System  
**Sprint:** 2  
**Week:** 1  
**Focus:** Dashboard Layout & Library Setup  
**Date:** November 9, 2025

---

## 1. Overview

เอกสารนี้เป็นข้อกำหนดทางเทคนิค (Technical Specification) สำหรับ Frontend Team ในการสร้าง Dashboard Layout และติดตั้ง Libraries ที่จำเป็น ตาม Task ที่ได้รับมอบหมายใน Sprint 2, Week 1

**Tasks:**
1. สร้างหน้า `/dashboard` และ Layout พร้อม Dummy Components
2. ติดตั้งและ Setup `Recharts` และ `Leaflet`

---

## 2. Task 1: Dashboard Page & Layout

### 2.1. Routing (`App.tsx`)

เพิ่ม Route ใหม่สำหรับหน้า Dashboard โดยต้องเป็น Protected Route ที่เข้าถึงได้เฉพาะผู้ใช้ที่มี Role ที่เหมาะสม

```typescript
// src/App.tsx

import { DashboardPage } from "./pages/DashboardPage";
// ... other imports

function App() {
  // ...
  return (
    <Routes>
      {/* ... other routes */}
      <Route element={<ProtectedRoute roles={[Role.ADMIN, Role.SUPERVISOR, Role.EXECUTIVE]} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}
```

### 2.2. File Structure

สร้างไฟล์และโฟลเดอร์สำหรับ Dashboard โดยเฉพาะ

```
/src
  ├── pages/
  │   └── DashboardPage.tsx
  ├── components/
  │   └── dashboard/
  │       ├── KPISummaryBar.tsx
  │       ├── IncidentsByStatusChart.tsx
  │       ├── IncidentsByPriorityChart.tsx
  │       ├── IncidentHotspotsMap.tsx
  │       ├── IncidentTrendChart.tsx
  │       ├── FieldOfficerWorkloadTable.tsx
  │       └── ExportToPDFButton.tsx
  └── test-pages/
      ├── ChartsTestPage.tsx
      └── MapTestPage.tsx
```

### 2.3. Dashboard Page (`pages/DashboardPage.tsx`)

หน้าหลักที่จะรวม widget ทั้งหมดเข้าด้วยกันโดยใช้ Grid Layout

```typescript
// src/pages/DashboardPage.tsx

import { Box, Grid, GridItem, Heading } from "@chakra-ui/react";
import { KPISummaryBar } from "../components/dashboard/KPISummaryBar";
// ... import other dummy widgets

export const DashboardPage = () => {
  return (
    <Box p={4}>
      <Heading mb={4}>Executive Dashboard</Heading>
      <Grid
        templateAreas={{
          base: `"kpi" "status" "priority" "trend" "map" "workload" "export"`,
          lg: `"kpi kpi" "status trend" "priority map" "workload workload" "export export"`,
        }}
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={4}
      >
        <GridItem area="kpi"><KPISummaryBar /></GridItem>
        <GridItem area="status"><IncidentsByStatusChart /></GridItem>
        <GridItem area="trend"><IncidentTrendChart /></GridItem>
        <GridItem area="priority"><IncidentsByPriorityChart /></GridItem>
        <GridItem area="map"><IncidentHotspotsMap /></GridItem>
        <GridItem area="workload"><FieldOfficerWorkloadTable /></GridItem>
        <GridItem area="export"><ExportToPDFButton /></GridItem>
      </Grid>
    </Box>
  );
};
```

### 2.4. Dummy Widget Components

สร้างไฟล์สำหรับแต่ละ widget โดยใช้ Placeholder text ง่ายๆ

**ตัวอย่าง:** `components/dashboard/KPISummaryBar.tsx`

```typescript
import { Box, Card, CardBody, Text } from "@chakra-ui/react";

export const KPISummaryBar = () => {
  return (
    <Card>
      <CardBody>
        <Text>Widget: KPI Summary Bar</Text>
      </CardBody>
    </Card>
  );
};
```

ให้สร้างไฟล์ที่เหลือในลักษณะเดียวกัน

---

## 3. Task 2: Library Installation & Setup

### 3.1. Installation

ใช้ `pnpm` ในการติดตั้ง dependencies

```bash
pnpm add recharts leaflet react-leaflet react-leaflet-cluster
pnpm add -D @types/leaflet
```

### 3.2. Leaflet CSS Setup

Import Leaflet CSS ในไฟล์ `main.tsx` เพื่อให้แน่ใจว่าถูกโหลดในทุกหน้า

```typescript
// src/main.tsx

import "leaflet/dist/leaflet.css";
// ... other imports

ReactDOM.createRoot(document.getElementById("root")!).render(
  // ...
);
```

### 3.3. Test Page: Charts (`test-pages/ChartsTestPage.tsx`)

สร้างหน้าสำหรับทดสอบ Recharts components เพื่อให้แน่ใจว่าทำงานได้ถูกต้อง

```typescript
// src/test-pages/ChartsTestPage.tsx

import { Box, Heading } from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
];

export const ChartsTestPage = () => {
  return (
    <Box p={4}>
      <Heading mb={4}>Recharts Test Page</Heading>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" />
          <Bar dataKey="uv" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
```

### 3.4. Test Page: Map (`test-pages/MapTestPage.tsx`)

สร้างหน้าสำหรับทดสอบ Leaflet map

```typescript
// src/test-pages/MapTestPage.tsx

import { Box, Heading } from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const position: [number, number] = [13.7563, 100.5018]; // Bangkok

export const MapTestPage = () => {
  return (
    <Box p={4}>
      <Heading mb={4}>Leaflet Map Test Page</Heading>
      <Box h="500px">
        <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution=\"&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors\"
          />
          <Marker position={position}>
            <Popup>A pretty CSS3 popup. <br /> Easily customizable.</Popup>
          </Marker>
        </MapContainer>
      </Box>
    </Box>
  );
};
```

### 3.5. เพิ่ม Routes สำหรับ Test Pages

เพิ่ม Routes สำหรับ Test Pages ใน `App.tsx` (อาจจะใส่ไว้ใน `if (import.meta.env.DEV)`) เพื่อให้เข้าถึงได้เฉพาะใน development mode

```typescript
// src/App.tsx

// ...
{import.meta.env.DEV && (
  <>
    <Route path="/test/charts" element={<ChartsTestPage />} />
    <Route path="/test/map" element={<MapTestPage />} />
  </>
)}
// ...
```

---

## 4. Unit & Integration Testing

- สร้างไฟล์ test สำหรับ `DashboardPage.tsx` เพื่อตรวจสอบว่า dummy widgets ทั้ง 7 ถูก render
- ไม่จำเป็นต้อง test library components (Recharts, Leaflet) โดยตรง
- ตรวจสอบว่า Test Pages render ได้โดยไม่มี error

---

**Status:** 📝 **Ready for Development**
