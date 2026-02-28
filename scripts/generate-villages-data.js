/**
 * Script to generate villages.ts from backend data
 * Run: node scripts/generate-villages-data.js
 */

const fs = require('fs');
const path = require('path');

// Import backend data directly
const backendDataPath = path.join(__dirname, '../backend/prisma/villages-with-geojson-seed.ts');
const backendDataContent = fs.readFileSync(backendDataPath, 'utf8');

// Extract villagesWithGeoJSONData array using regex
const dataMatch = backendDataContent.match(/export const villagesWithGeoJSONData = (\[[\s\S]*?\]);/);
if (!dataMatch) {
  console.error('❌ Cannot find villagesWithGeoJSONData in backend file');
  process.exit(1);
}

// Parse the data (using eval - safe because it's our own code)
const villagesData = eval(dataMatch[1]);

// Convert to frontend format
const villages = villagesData.map(v => {
  // Convert GeoJSON boundary [lng, lat] to Leaflet [lat, lng]
  let boundary = null;
  if (v.boundary && v.boundary.coordinates && v.boundary.coordinates[0]) {
    boundary = v.boundary.coordinates[0].map(coord => [coord[1], coord[0]]);
  }
  
  return {
    id: v.villageNo,
    name: v.name,
    moo: v.villageNo,
    lat: v.centerPoint.coordinates[1], // GeoJSON: [lng, lat]
    lng: v.centerPoint.coordinates[0],
    population: v.population,
    households: v.households,
    boundary: boundary
  };
});

// Helper function to format number with fixed decimals
function formatCoord(num) {
  return num.toFixed(4);
}

// Helper function to format village object
function formatVillage(v) {
  const boundaryStr = v.boundary 
    ? `[\n      ${v.boundary.map(coord => `[${formatCoord(coord[0])}, ${formatCoord(coord[1])}]`).join(',\n      ')}\n    ]`
    : 'undefined';
  
  return `  {
    id: ${v.id},
    name: '${v.name}',
    moo: ${v.moo},
    lat: ${formatCoord(v.lat)},
    lng: ${formatCoord(v.lng)},
    population: ${v.population},
    households: ${v.households},
    boundary: ${boundaryStr}
  }`;
}

// Generate TypeScript file content
const tsContent = `/**
 * ข้อมูลหมู่บ้านในตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
 * ทั้งหมด ${villages.length} หมู่บ้าน พร้อมขอบเขต (boundary)
 * 
 * ข้อมูลอ้างอิงจาก: กรมการปกครอง กระทรวงมหาดไทย
 * พิกัดศูนย์กลางตำบล: 19.9167°N, 99.2333°E
 * 
 * ⚠️ Auto-generated from backend data
 * ⚠️ DO NOT EDIT MANUALLY - Run: node scripts/generate-villages-data.js
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
 * รายชื่อหมู่บ้านทั้ง ${villages.length} หมู่ ในตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
 */
export const VILLAGES: Village[] = [
${villages.map(formatVillage).join(',\n')}
];

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
const outputPath = path.join(__dirname, '../frontend/src/data/villages.ts');
fs.writeFileSync(outputPath, tsContent, 'utf8');

console.log('✅ Generated villages.ts successfully!');
console.log(`📁 File: ${outputPath}`);
console.log(`📊 Villages: ${villages.length}`);
console.log(`🗺️  With boundaries: ${villages.filter(v => v.boundary).length}`);
console.log('');
console.log('📋 Summary:');
villages.forEach(v => {
  const hasBoundary = v.boundary ? '✅' : '⚪';
  console.log(`  ${hasBoundary} หมู่ ${v.moo}: ${v.name} (${v.households} ครัวเรือน, ${v.population} คน)`);
});
