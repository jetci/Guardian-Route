// Villages Seed Data with GeoJSON for ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
// 20 หมู่บ้าน พร้อมพิกัดและขอบเขต

export const villagesWithGeoJSONData = [
  {
    villageNo: 1,
    name: 'หนองตุ้ม',
    alternateNames: [],
    households: 120,
    population: 450,
    area: 5.2,
    description: 'หมู่บ้านหนองตุ้ม ตั้งอยู่ทางทิศเหนือของตำบล',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2145, 19.9300], // [lng, lat] - Fang District
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2080, 19.9350],
          [99.2180, 19.9350],
          [99.2180, 19.9280],
          [99.2120, 19.9250],
          [99.2080, 19.9280],
          [99.2080, 19.9350],
        ],
      ],
    },
  },
  {
    villageNo: 2,
    name: 'ป่าบง',
    alternateNames: [],
    households: 95,
    population: 380,
    area: 4.8,
    description: 'หมู่บ้านป่าบง พื้นที่เกษตรกรรม',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2400, 19.9200],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2150, 19.9250],
          [99.2250, 19.9250],
          [99.2250, 19.9180],
          [99.2200, 19.9150],
          [99.2150, 19.9180],
          [99.2150, 19.9250],
        ],
      ],
    },
  },
  {
    villageNo: 3,
    name: 'เต๋าดิน',
    alternateNames: ['เวียงสุทโธ'],
    households: 150,
    population: 520,
    area: 6.5,
    description: 'หมู่บ้านเต๋าดิน มีชื่อเรียกอีกชื่อว่า เวียงสุทโธ',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2500, 19.9167],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2240, 19.9220],
          [99.2360, 19.9220],
          [99.2360, 19.9140],
          [99.2300, 19.9110],
          [99.2240, 19.9140],
          [99.2240, 19.9220],
        ],
      ],
    },
  },
  {
    villageNo: 4,
    name: 'สวนดอก',
    alternateNames: [],
    households: 110,
    population: 420,
    area: 5.0,
    description: 'หมู่บ้านสวนดอก พื้นที่ทำสวนดอกไม้',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2250, 19.9100],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2000, 19.9150],
          [99.2100, 19.9150],
          [99.2100, 19.9080],
          [99.2050, 19.9050],
          [99.2000, 19.9080],
          [99.2000, 19.9150],
        ],
      ],
    },
  },
  {
    villageNo: 5,
    name: 'ต้นหนุน',
    alternateNames: [],
    households: 85,
    population: 340,
    area: 4.2,
    description: 'หมู่บ้านต้นหนุน',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2150, 19.9200],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.1900, 19.9240],
          [99.2000, 19.9240],
          [99.2000, 19.9180],
          [99.1950, 19.9160],
          [99.1900, 19.9180],
          [99.1900, 19.9240],
        ],
      ],
    },
  },
  {
    villageNo: 6,
    name: 'สันทรายคองน้อย',
    alternateNames: [],
    households: 130,
    population: 480,
    area: 5.8,
    description: 'หมู่บ้านสันทรายคองน้อย',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2600, 19.9250],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
        ],
      ],
    },
  },
  {
    villageNo: 7,
    name: 'แม่ใจใต้',
    alternateNames: [],
    households: 140,
    population: 510,
    area: 6.2,
    description: 'หมู่บ้านแม่ใจใต้ ตั้งอยู่ริมแม่น้ำแม่ใจ',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2200, 19.9000],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.8950],
          [99.2, 19.8950],
          [99.2, 19.9],
        ],
      ],
    },
  },
  {
    villageNo: 8,
    name: 'แม่ใจเหนือ',
    alternateNames: [],
    households: 125,
    population: 465,
    area: 5.5,
    description: 'หมู่บ้านแม่ใจเหนือ ตั้งอยู่ริมแม่น้ำแม่ใจ',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2300, 19.9050],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
        ],
      ],
    },
  },
  {
    villageNo: 9,
    name: 'ริมฝาง',
    alternateNames: ['สันป่าไหน่'],
    households: 160,
    population: 580,
    area: 7.0,
    description: 'หมู่บ้านริมฝาง มีชื่อเรียกอีกชื่อว่า สันป่าไหน่',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2450, 19.9300],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
        ],
      ],
    },
  },
  {
    villageNo: 10,
    name: 'ห้วยเฮี่ยน',
    alternateNames: ['สันป่ายางยาง'],
    households: 105,
    population: 410,
    area: 4.9,
    description: 'หมู่บ้านห้วยเฮี่ยน มีชื่อเรียกอีกชื่อว่า สันป่ายางยาง',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2100, 19.9300],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
        ],
      ],
    },
  },
  {
    villageNo: 11,
    name: 'ท่าสะแล',
    alternateNames: [],
    households: 115,
    population: 440,
    area: 5.3,
    description: 'หมู่บ้านท่าสะแล',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2350, 19.8950],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.8900],
          [99.2, 19.8900],
          [99.2, 19.9],
        ],
      ],
    },
  },
  {
    villageNo: 12,
    name: 'โป่งถืบ',
    alternateNames: [],
    households: 135,
    population: 495,
    area: 6.0,
    description: 'หมู่บ้านโป่งถืบ',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2550, 19.9100],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
        ],
      ],
    },
  },
  {
    villageNo: 13,
    name: 'ห้วยบอน',
    alternateNames: [],
    households: 90,
    population: 360,
    area: 4.5,
    description: 'หมู่บ้านห้วยบอน',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2050, 19.9100],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
        ],
      ],
    },
  },
  {
    villageNo: 14,
    name: 'เสาหิน',
    alternateNames: [],
    households: 100,
    population: 390,
    area: 4.7,
    description: 'หมู่บ้านเสาหิน',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2400, 19.9000],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.8960],
          [99.2, 19.8960],
          [99.2, 19.9],
        ],
      ],
    },
  },
  {
    villageNo: 15,
    name: 'โป่งถืบใน',
    alternateNames: [],
    households: 80,
    population: 320,
    area: 4.0,
    description: 'หมู่บ้านโป่งถืบใน',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2650, 19.9050],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
        ],
      ],
    },
  },
  {
    villageNo: 16,
    name: 'ปางผึ้ง',
    alternateNames: [],
    households: 95,
    population: 375,
    area: 4.6,
    description: 'หมู่บ้านปางผึ้ง',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2500, 19.8900],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2450, 19.8940],
          [99.2, 19.8940],
          [99.2, 19.8860],
          [99.2, 19.8860],
          [99.2, 19.8940],
        ],
      ],
    },
  },
  {
    villageNo: 17,
    name: 'ใหม่คองน้อย',
    alternateNames: [],
    households: 110,
    population: 425,
    area: 5.1,
    description: 'หมู่บ้านใหม่คองน้อย',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2700, 19.9200],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.9],
        ],
      ],
    },
  },
  {
    villageNo: 18,
    name: 'ศรีดอนชัย',
    alternateNames: [],
    households: 120,
    population: 455,
    area: 5.4,
    description: 'หมู่บ้านศรีดอนชัย',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2150, 19.8900],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2100, 19.8950],
          [99.2, 19.8950],
          [99.2, 19.8850],
          [99.2, 19.8850],
          [99.2, 19.8950],
        ],
      ],
    },
  },
  {
    villageNo: 19,
    name: 'ใหม่ชยาราม',
    alternateNames: [],
    households: 105,
    population: 405,
    area: 4.8,
    description: 'หมู่บ้านใหม่ชยาราม',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2250, 19.8850],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2200, 19.8890],
          [99.2, 19.8890],
          [99.2, 19.8810],
          [99.2, 19.8810],
          [99.2, 19.8890],
        ],
      ],
    },
  },
  {
    villageNo: 20,
    name: 'สระนิคม',
    alternateNames: [],
    households: 125,
    population: 470,
    area: 5.6,
    description: 'หมู่บ้านสระนิคม',
    centerPoint: {
      type: 'Point',
      coordinates: [99.2600, 19.8950],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.2, 19.9],
          [99.2, 19.9],
          [99.2, 19.8900],
          [99.2, 19.8900],
          [99.2, 19.9],
        ],
      ],
    },
  },
];
