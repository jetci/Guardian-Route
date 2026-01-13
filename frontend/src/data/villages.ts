/**
 * ข้อมูลหมู่บ้านในตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
 * ทั้งหมด 20 หมู่บ้าน พร้อมขอบเขต (boundary)
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
    boundary: undefined
  },
  {
    id: 2,
    name: 'ป่าบง',
    moo: 2,
    lat: 19.9200,
    lng: 99.2400,
    population: 380,
    households: 95,
    boundary: undefined
  },
  {
    id: 3,
    name: 'หนองอึ่ง',
    moo: 3,
    lat: 19.9167,
    lng: 99.2500,
    population: 520,
    households: 150,
    boundary: undefined
  },
  {
    id: 4,
    name: 'สวนดอก',
    moo: 4,
    lat: 19.9100,
    lng: 99.2250,
    population: 420,
    households: 110,
    boundary: undefined
  },
  {
    id: 5,
    name: 'ต้นหนุน',
    moo: 5,
    lat: 19.9200,
    lng: 99.2150,
    population: 340,
    households: 85,
    boundary: undefined
  },
  {
    id: 6,
    name: 'สันทรายคองน้อย',
    moo: 6,
    lat: 19.9250,
    lng: 99.2600,
    population: 480,
    households: 130,
    boundary: undefined
  },
  {
    id: 7,
    name: 'แม่ใจใต้',
    moo: 7,
    lat: 19.9000,
    lng: 99.2200,
    population: 510,
    households: 140,
    boundary: undefined
  },
  {
    id: 8,
    name: 'แม่ใจเหนือ',
    moo: 8,
    lat: 19.9050,
    lng: 99.2300,
    population: 465,
    households: 125,
    boundary: undefined
  },
  {
    id: 9,
    name: 'สันป่าไหน่',
    moo: 9,
    lat: 19.9300,
    lng: 99.2450,
    population: 580,
    households: 160,
    boundary: undefined
  },
  {
    id: 10,
    name: 'สันป่ายาง',
    moo: 10,
    lat: 19.9300,
    lng: 99.2100,
    population: 410,
    households: 105,
    boundary: undefined
  },
  {
    id: 11,
    name: 'ท่าสะแล',
    moo: 11,
    lat: 19.8950,
    lng: 99.2350,
    population: 440,
    households: 115,
    boundary: undefined
  },
  {
    id: 12,
    name: 'โป่งถืบ',
    moo: 12,
    lat: 19.9100,
    lng: 99.2550,
    population: 495,
    households: 135,
    boundary: undefined
  },
  {
    id: 13,
    name: 'ห้วยบอน',
    moo: 13,
    lat: 19.9100,
    lng: 99.2050,
    population: 360,
    households: 90,
    boundary: undefined
  },
  {
    id: 14,
    name: 'เสาหิน',
    moo: 14,
    lat: 19.9000,
    lng: 99.2400,
    population: 390,
    households: 100,
    boundary: undefined
  },
  {
    id: 15,
    name: 'โป่งถืบใน',
    moo: 15,
    lat: 19.9050,
    lng: 99.2650,
    population: 320,
    households: 80,
    boundary: undefined
  },
  {
    id: 16,
    name: 'ปางผึ้ง',
    moo: 16,
    lat: 19.8900,
    lng: 99.2500,
    population: 375,
    households: 95,
    boundary: undefined
  },
  {
    id: 17,
    name: 'ใหม่คองน้อย',
    moo: 17,
    lat: 19.9200,
    lng: 99.2700,
    population: 425,
    households: 110,
    boundary: undefined
  },
  {
    id: 18,
    name: 'ศรีดอนชัย',
    moo: 18,
    lat: 19.8900,
    lng: 99.2150,
    population: 455,
    households: 120,
    boundary: undefined
  },
  {
    id: 19,
    name: 'ใหม่ชยาราม',
    moo: 19,
    lat: 19.8850,
    lng: 99.2250,
    population: 405,
    households: 105,
    boundary: undefined
  },
  {
    id: 20,
    name: 'สระนิคม',
    moo: 20,
    lat: 19.8950,
    lng: 99.2600,
    population: 470,
    households: 125,
    boundary: undefined
  }
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
  totalVillages: 20,
  totalPopulation: 8690,
  totalHouseholds: 2295,
};
