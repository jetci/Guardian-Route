// Script to update villages.ts with boundary data from backend
const fs = require('fs');
const path = require('path');

// Import backend data
const backendData = require('../../../backend/prisma/villages-with-geojson-seed.ts');

// Convert GeoJSON coordinates to Leaflet format [lat, lng]
function convertBoundary(geoJsonBoundary) {
  if (!geoJsonBoundary || !geoJsonBoundary.coordinates || !geoJsonBoundary.coordinates[0]) {
    return null;
  }
  
  // GeoJSON format: [lng, lat]
  // Leaflet format: [lat, lng]
  return geoJsonBoundary.coordinates[0].map(coord => [coord[1], coord[0]]);
}

// Generate villages data
const villages = backendData.villagesWithGeoJSONData.map(v => {
  const centerLat = v.centerPoint.coordinates[1];
  const centerLng = v.centerPoint.coordinates[0];
  const boundary = convertBoundary(v.boundary);
  
  return {
    id: v.villageNo,
    name: v.name,
    moo: v.villageNo,
    lat: centerLat,
    lng: centerLng,
    population: v.population,
    households: v.households,
    boundary: boundary
  };
});

// Generate TypeScript file content
const tsContent = `/**
 * ข้อมูลหมู่บ้านในตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
 * ทั้งหมด 20 หมู่บ้าน พร้อมขอบเขต (boundary)
 * 
 * ข้อมูลอ้างอิงจาก: กรมการปกครอง กระทรวงมหาดไทย
 * พิกัดศูนย์กลางตำบล: 19.9167°N, 99.2333°E
 * 
 * Auto-generated from backend data
 */

export interface Village {
  id: number;
  name: string;
  moo: number; // หมู่ที่
  lat: number;
  lng: number;
  population?: number;
  households?: number;
  boundary?: [number, number][]; // ขอบเขตหมู่บ้าน (lat, lng pairs)
}

/**
 * รายชื่อหมู่บ้านทั้ง 20 หมู่ ในตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
 */
export const VILLAGES: Village[] = ${JSON.stringify(villages, null, 2)};

/**
 * รายชื่อหมู่บ้าน (ชื่ออย่างเดียว)
 */
export const VILLAGE_NAMES = VILLAGES.map(v => v.name);

/**
 * ข้อมูลตำบล
 */
export const TAMBON_INFO = {
  name: 'เวียง',
  amphoe: 'ฝาง',
  province: 'เชียงใหม่',
  fullName: 'ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่',
  centerLat: 19.9167,
  centerLng: 99.2333,
  totalVillages: ${villages.length},
  totalPopulation: ${villages.reduce((sum, v) => sum + (v.population || 0), 0)},
  totalHouseholds: ${villages.reduce((sum, v) => sum + (v.households || 0), 0)},
};
`;

// Write to file
const outputPath = path.join(__dirname, 'villages.ts');
fs.writeFileSync(outputPath, tsContent, 'utf8');

console.log('✅ Updated villages.ts with boundary data!');
console.log(`📁 File: ${outputPath}`);
console.log(`📊 Villages: ${villages.length}`);
console.log(`🗺️ With boundaries: ${villages.filter(v => v.boundary).length}`);
