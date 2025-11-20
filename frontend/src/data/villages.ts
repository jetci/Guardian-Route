/**
 * ข้อมูลหมู่บ้านในตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
 * ทั้งหมด 20 หมู่บ้าน
 * 
 * ข้อมูลอ้างอิงจาก: กรมการปกครอง กระทรวงมหาดไทย
 * พิกัดศูนย์กลางตำบล: 19.9167°N, 99.2333°E
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
export const VILLAGES: Village[] = [
  { 
    id: 1, 
    name: 'หนองตุ้ม', 
    moo: 1, 
    lat: 19.9300, 
    lng: 99.2145, 
    population: 450, 
    households: 120,
    boundary: [
      [19.9350, 99.2080],
      [19.9350, 99.2180],
      [19.9280, 99.2180],
      [19.9250, 99.2120],
      [19.9280, 99.2080],
      [19.9350, 99.2080]
    ]
  },
  { id: 2, name: 'ป่าบง', moo: 2, lat: 19.9500, lng: 99.2100, population: 520, households: 145 },
  { id: 3, name: 'เต๋าดิน (เวียงสุทโธ)', moo: 3, lat: 19.9422, lng: 99.2195, population: 380, households: 95 },
  { id: 4, name: 'สวนดอก', moo: 4, lat: 19.9450, lng: 99.2300, population: 410, households: 110 },
  { id: 5, name: 'ต้นหนุน', moo: 5, lat: 19.9350, lng: 99.2150, population: 390, households: 105 },
  { id: 6, name: 'สันทรายคองน้อย', moo: 6, lat: 19.9400, lng: 99.2050, population: 340, households: 88 },
  { id: 7, name: 'แม่ใจใต้', moo: 7, lat: 19.9300, lng: 99.2200, population: 360, households: 92 },
  { id: 8, name: 'แม่ใจเหนือ', moo: 8, lat: 19.9330, lng: 99.2250, population: 320, households: 85 },
  { id: 9, name: 'ริมฝาง (สันป่าไหน่)', moo: 9, lat: 19.9600, lng: 99.2200, population: 480, households: 125 },
  { id: 10, name: 'ห้วยเฮี่ยน (สันป่ายางยาง)', moo: 10, lat: 19.9570, lng: 99.2100, population: 350, households: 90 },
  { id: 11, name: 'ท่าสะแล', moo: 11, lat: 19.9250, lng: 99.2100, population: 420, households: 115 },
  { id: 12, name: 'โป่งถืบ', moo: 12, lat: 19.9280, lng: 99.2350, population: 380, households: 100 },
  { id: 13, name: 'ห้วยบอน', moo: 13, lat: 19.9150, lng: 99.2200, population: 310, households: 82 },
  { id: 14, name: 'เสาหิน', moo: 14, lat: 19.9200, lng: 99.2400, population: 290, households: 75 },
  { id: 15, name: 'โป่งถืบใน', moo: 15, lat: 19.9320, lng: 99.2450, population: 270, households: 70 },
  { id: 16, name: 'ปางผึ้ง', moo: 16, lat: 19.9100, lng: 99.2300, population: 330, households: 87 },
  { id: 17, name: 'ใหม่คองน้อย', moo: 17, lat: 19.9050, lng: 99.2150, population: 360, households: 95 },
  { id: 18, name: 'ศรีดอนชัย', moo: 18, lat: 19.9650, lng: 99.2150, population: 400, households: 108 },
  { id: 19, name: 'ใหม่ชยาราม', moo: 19, lat: 19.9230, lng: 99.2250, population: 320, households: 84 },
  { id: 20, name: 'สระนิคม', moo: 20, lat: 19.9470, lng: 99.2400, population: 350, households: 92 },
];

/**
 * รายชื่อหมู่บ้านเป็น array ของ string (สำหรับ dropdown)
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
  totalVillages: 20,
  totalPopulation: VILLAGES.reduce((sum, v) => sum + (v.population || 0), 0),
  totalHouseholds: VILLAGES.reduce((sum, v) => sum + (v.households || 0), 0),
};

/**
 * หาหมู่บ้านจาก ID
 */
export function getVillageById(id: number): Village | undefined {
  return VILLAGES.find(v => v.id === id);
}

/**
 * หาหมู่บ้านจากชื่อ
 */
export function getVillageByName(name: string): Village | undefined {
  return VILLAGES.find(v => v.name === name);
}

/**
 * หาหมู่บ้านจากหมู่ที่
 */
export function getVillageByMoo(moo: number): Village | undefined {
  return VILLAGES.find(v => v.moo === moo);
}
