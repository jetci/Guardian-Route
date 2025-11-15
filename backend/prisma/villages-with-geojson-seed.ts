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
      coordinates: [99.9333, 19.9300], // [lng, lat]
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9280, 19.9350],
          [99.9380, 19.9350],
          [99.9380, 19.9250],
          [99.9280, 19.9250],
          [99.9280, 19.9350],
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
      coordinates: [99.9400, 19.9200],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9350, 19.9250],
          [99.9450, 19.9250],
          [99.9450, 19.9150],
          [99.9350, 19.9150],
          [99.9350, 19.9250],
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
      coordinates: [99.9500, 19.9167],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9440, 19.9220],
          [99.9560, 19.9220],
          [99.9560, 19.9110],
          [99.9440, 19.9110],
          [99.9440, 19.9220],
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
      coordinates: [99.9250, 19.9100],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9200, 19.9150],
          [99.9300, 19.9150],
          [99.9300, 19.9050],
          [99.9200, 19.9050],
          [99.9200, 19.9150],
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
      coordinates: [99.9150, 19.9200],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9100, 19.9240],
          [99.9200, 19.9240],
          [99.9200, 19.9160],
          [99.9100, 19.9160],
          [99.9100, 19.9240],
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
      coordinates: [99.9600, 19.9250],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9540, 19.9300],
          [99.9660, 19.9300],
          [99.9660, 19.9200],
          [99.9540, 19.9200],
          [99.9540, 19.9300],
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
      coordinates: [99.9200, 19.9000],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9140, 19.9050],
          [99.9260, 19.9050],
          [99.9260, 19.8950],
          [99.9140, 19.8950],
          [99.9140, 19.9050],
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
      coordinates: [99.9300, 19.9050],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9250, 19.9100],
          [99.9350, 19.9100],
          [99.9350, 19.9000],
          [99.9250, 19.9000],
          [99.9250, 19.9100],
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
      coordinates: [99.9450, 19.9300],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9380, 19.9360],
          [99.9520, 19.9360],
          [99.9520, 19.9240],
          [99.9380, 19.9240],
          [99.9380, 19.9360],
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
      coordinates: [99.9100, 19.9300],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9050, 19.9340],
          [99.9150, 19.9340],
          [99.9150, 19.9260],
          [99.9050, 19.9260],
          [99.9050, 19.9340],
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
      coordinates: [99.9350, 19.8950],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9300, 19.9000],
          [99.9400, 19.9000],
          [99.9400, 19.8900],
          [99.9300, 19.8900],
          [99.9300, 19.9000],
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
      coordinates: [99.9550, 19.9100],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9490, 19.9150],
          [99.9610, 19.9150],
          [99.9610, 19.9050],
          [99.9490, 19.9050],
          [99.9490, 19.9150],
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
      coordinates: [99.9050, 19.9100],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9000, 19.9140],
          [99.9100, 19.9140],
          [99.9100, 19.9060],
          [99.9000, 19.9060],
          [99.9000, 19.9140],
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
      coordinates: [99.9400, 19.9000],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9350, 19.9040],
          [99.9450, 19.9040],
          [99.9450, 19.8960],
          [99.9350, 19.8960],
          [99.9350, 19.9040],
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
      coordinates: [99.9650, 19.9050],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9600, 19.9090],
          [99.9700, 19.9090],
          [99.9700, 19.9010],
          [99.9600, 19.9010],
          [99.9600, 19.9090],
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
      coordinates: [99.9500, 19.8900],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9450, 19.8940],
          [99.9550, 19.8940],
          [99.9550, 19.8860],
          [99.9450, 19.8860],
          [99.9450, 19.8940],
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
      coordinates: [99.9700, 19.9200],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9650, 19.9240],
          [99.9750, 19.9240],
          [99.9750, 19.9160],
          [99.9650, 19.9160],
          [99.9650, 19.9240],
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
      coordinates: [99.9150, 19.8900],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9100, 19.8950],
          [99.9200, 19.8950],
          [99.9200, 19.8850],
          [99.9100, 19.8850],
          [99.9100, 19.8950],
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
      coordinates: [99.9250, 19.8850],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9200, 19.8890],
          [99.9300, 19.8890],
          [99.9300, 19.8810],
          [99.9200, 19.8810],
          [99.9200, 19.8890],
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
      coordinates: [99.9600, 19.8950],
    },
    boundary: {
      type: 'Polygon',
      coordinates: [
        [
          [99.9550, 19.9000],
          [99.9650, 19.9000],
          [99.9650, 19.8900],
          [99.9550, 19.8900],
          [99.9550, 19.9000],
        ],
      ],
    },
  },
];
