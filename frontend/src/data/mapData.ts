/**
 * Map Data - Tambon Wiang Boundaries
 * ข้อมูลขอบเขตตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
 */

export interface TambonBoundaryFeature {
  type: 'Feature';
  properties: {
    name: string;
    type: 'tambon';
    district: string;
    province: string;
    area?: number;
    population?: number;
    villages?: number;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

/**
 * ขอบเขตตำบลเวียง
 * พิกัดประมาณการจากข้อมูล 20 หมู่บ้าน
 */
export const tambonWiangBoundary: TambonBoundaryFeature = {
  type: 'Feature',
  properties: {
    name: 'ตำบลเวียง',
    type: 'tambon',
    district: 'อำเภอฝาง',
    province: 'จังหวัดเชียงใหม่',
    area: 120.5, // ตร.กม. (ประมาณการ)
    population: 9000, // คน (ประมาณการ)
    villages: 20, // หมู่บ้าน
  },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      // ขอบเขตรอบนอกของตำบล (ครอบคลุม 20 หมู่บ้าน)
      [99.1800, 19.9500], // มุมซ้ายบน (Northwest)
      [99.2800, 19.9500], // มุมขวาบน (Northeast)
      [99.2900, 19.9400], // ขวาบน-กลาง
      [99.2900, 19.9200], // ขวากลาง
      [99.2800, 19.9000], // ขวากลาง-ล่าง
      [99.2700, 19.8800], // มุมขวาล่าง (Southeast)
      [99.2500, 19.8750], // ล่างขวา-กลาง
      [99.2200, 19.8750], // ล่างกลาง
      [99.1900, 19.8800], // มุมซ้ายล่าง (Southwest)
      [99.1800, 19.9000], // ซ้ายล่าง-กลาง
      [99.1800, 19.9200], // ซ้ายกลาง
      [99.1800, 19.9500], // กลับมาจุดเริ่มต้น (Close polygon)
    ]],
  },
};

/**
 * Style สำหรับ Tambon Boundary
 */
export const tambonBoundaryStyle = {
  color: '#e53e3e', // สีแดง
  weight: 3, // เส้นหนา
  opacity: 0.8,
  fillColor: '#feb2b2', // สีแดงอ่อน
  fillOpacity: 0.1,
  dashArray: '10, 5', // เส้นประ
};

/**
 * Style สำหรับ Village Boundary
 */
export const villageBoundaryStyle = {
  color: '#3388ff', // สีน้ำเงิน
  weight: 2,
  opacity: 0.8,
  fillColor: '#3388ff',
  fillOpacity: 0.3,
};

/**
 * ตรวจสอบว่า feature เป็นขอบเขตตำบลหรือไม่
 */
export function isTambonBoundary(feature: any): boolean {
  return feature?.properties?.type === 'tambon';
}

/**
 * ดึง style ตามประเภทของ boundary
 */
export function getBoundaryStyle(feature: any) {
  return isTambonBoundary(feature) ? tambonBoundaryStyle : villageBoundaryStyle;
}

/**
 * ข้อมูลเพิ่มเติมเกี่ยวกับตำบลเวียง
 */
export const tambonWiangInfo = {
  fullName: 'ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่',
  englishName: 'Wiang Subdistrict, Fang District, Chiang Mai Province',
  center: [19.9169, 99.2145] as [number, number],
  zoom: 13,
  villages: [
    { no: 1, name: 'หนองตุ้ม' },
    { no: 2, name: 'ป่าบง' },
    { no: 3, name: 'หนองอึ่ง (เวียงสุทโธ)' },
    { no: 4, name: 'สวนดอก' },
    { no: 5, name: 'ต้นหนุน' },
    { no: 6, name: 'สันทรายคองน้อย' },
    { no: 7, name: 'แม่ใจใต้' },
    { no: 8, name: 'แม่ใจเหนือ' },
    { no: 9, name: 'สันป่าไหน' },
    { no: 10, name: 'สันป่ายาง' },
    { no: 11, name: 'ท่าสะแล' },
    { no: 12, name: 'โป่งถืบ' },
    { no: 13, name: 'ห้วยบอน' },
    { no: 14, name: 'เสาหิน' },
    { no: 15, name: 'โป่งถืบใน' },
    { no: 16, name: 'ปางผึ้ง' },
    { no: 17, name: 'ใหม่คองน้อย' },
    { no: 18, name: 'ศรีดอนชัย' },
    { no: 19, name: 'ใหม่ชยาราม' },
    { no: 20, name: 'สระนิคม' },
  ],
};
