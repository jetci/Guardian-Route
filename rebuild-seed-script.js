const fs = require('fs');
const path = require('path');

// Constants
const RADIUS = 0.005; // ~550m

function generateHexagon(lng, lat) {
    const coords = [];
    for (let i = 0; i <= 6; i++) {
        const angle = (i * 60) * (Math.PI / 180);
        const dx = RADIUS * Math.cos(angle);
        const dy = RADIUS * Math.sin(angle);
        // Adjust for longitude scaling based on latitude (cos(19.9) ~ 0.94)
        const adjustedDx = dx / Math.cos(lat * Math.PI / 180);
        coords.push([lng + adjustedDx, lat + dy]);
    }
    return {
        type: 'Polygon',
        coordinates: [coords]
    };
}

const extractedPath = path.join(__dirname, 'backend/extracted-boundaries.json');
const extractedData = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));

// Villages base data to preserve
const villagesData = [
    { villageNo: 1, name: 'หนองตุ้ม', alternateNames: [], households: 120, population: 450, area: 5.2, description: 'หมู่บ้านหนองตุ้ม ตั้งอยู่ทางทิศเหนือของตำบล', centerPoint: { type: 'Point', coordinates: [99.2145, 19.9300] } },
    { villageNo: 2, name: 'ป่าบง', alternateNames: [], households: 95, population: 380, area: 4.8, description: 'หมู่บ้านป่าบง พื้นที่เกษตรกรรม', centerPoint: { type: 'Point', coordinates: [99.2400, 19.9200] } },
    { villageNo: 3, name: 'หนองอึ่ง', alternateNames: ['เวียงสุทโธ'], households: 150, population: 520, area: 6.5, description: 'หมู่บ้านหนองอึ่ง มีชื่อเรียกอีกชื่อว่า เวียงสุทโธ', centerPoint: { type: 'Point', coordinates: [99.2500, 19.9167] } },
    { villageNo: 4, name: 'สวนดอก', alternateNames: [], households: 110, population: 420, area: 5.0, description: 'หมู่บ้านสวนดอก พื้นที่ทำสวนดอกไม้', centerPoint: { type: 'Point', coordinates: [99.2250, 19.9100] } },
    { villageNo: 5, name: 'ต้นหนุน', alternateNames: [], households: 85, population: 340, area: 4.2, description: 'หมู่บ้านต้นหนุน', centerPoint: { type: 'Point', coordinates: [99.2150, 19.9200] } },
    { villageNo: 6, name: 'สันทรายคองน้อย', alternateNames: [], households: 130, population: 480, area: 5.8, description: 'หมู่บ้านสันทรายคองน้อย', centerPoint: { type: 'Point', coordinates: [99.2600, 19.9250] } },
    { villageNo: 7, name: 'แม่ใจใต้', alternateNames: [], households: 140, population: 510, area: 6.2, description: 'หมู่บ้านแม่ใจใต้ ตั้งอยู่ริมแม่น้ำแม่ใจ', centerPoint: { type: 'Point', coordinates: [99.2200, 19.9000] } },
    { villageNo: 8, name: 'แม่ใจเหนือ', alternateNames: [], households: 125, population: 465, area: 5.5, description: 'หมู่บ้านแม่ใจเหนือ ตั้งอยู่ริมแม่น้ำแม่ใจ', centerPoint: { type: 'Point', coordinates: [99.2300, 19.9050] } },
    { villageNo: 9, name: 'สันป่าไหน่', alternateNames: [], households: 160, population: 580, area: 7.0, description: 'หมู่บ้านสันป่าไหน', centerPoint: { type: 'Point', coordinates: [99.2450, 19.9300] } },
    { villageNo: 10, name: 'สันป่ายาง', alternateNames: [], households: 105, population: 410, area: 4.9, description: 'หมู่บ้านสันป่ายาง', centerPoint: { type: 'Point', coordinates: [99.2100, 19.9300] } },
    { villageNo: 11, name: 'ท่าสะแล', alternateNames: [], households: 115, population: 440, area: 5.3, description: 'หมู่บ้านท่าสะแล', centerPoint: { type: 'Point', coordinates: [99.2350, 19.8950] } },
    { villageNo: 12, name: 'โป่งถืบ', alternateNames: [], households: 135, population: 495, area: 6.0, description: 'หมู่บ้านโป่งถืบ', centerPoint: { type: 'Point', coordinates: [99.2550, 19.9100] } },
    { villageNo: 13, name: 'ห้วยบอน', alternateNames: [], households: 90, population: 360, area: 4.5, description: 'หมู่บ้านห้วยบอน', centerPoint: { type: 'Point', coordinates: [99.2050, 19.9100] } },
    { villageNo: 14, name: 'เสาหิน', alternateNames: [], households: 100, population: 390, area: 4.7, description: 'หมู่บ้านเสาหิน', centerPoint: { type: 'Point', coordinates: [99.2400, 19.9000] } },
    { villageNo: 15, name: 'โป่งถืบใน', alternateNames: [], households: 80, population: 320, area: 4.0, description: 'หมู่บ้านโป่งถืบใน', centerPoint: { type: 'Point', coordinates: [99.2650, 19.9050] } },
    { villageNo: 16, name: 'ปางผึ้ง', alternateNames: [], households: 95, population: 375, area: 4.6, description: 'หมู่บ้านปางผึ้ง', centerPoint: { type: 'Point', coordinates: [99.2500, 19.8900] } },
    { villageNo: 17, name: 'ใหม่คองน้อย', alternateNames: [], households: 110, population: 425, area: 5.1, description: 'หมู่บ้านใหม่คองน้อย', centerPoint: { type: 'Point', coordinates: [99.2700, 19.9200] } },
    { villageNo: 18, name: 'ศรีดอนชัย', alternateNames: [], households: 120, population: 455, area: 5.4, description: 'หมู่บ้านศรีดอนชัย', centerPoint: { type: 'Point', coordinates: [99.2150, 19.8900] } },
    { villageNo: 19, name: 'ใหม่ชยาราม', alternateNames: [], households: 105, population: 405, area: 4.8, description: 'หมู่บ้านใหม่ชยาราม', centerPoint: { type: 'Point', coordinates: [99.2250, 19.8850] } },
    { villageNo: 20, name: 'สระนิคม', alternateNames: [], households: 125, population: 470, area: 5.6, description: 'หมู่บ้านสระนิคม', centerPoint: { type: 'Point', coordinates: [99.2600, 19.8950] } },
];

const processedVillages = villagesData.map(village => {
    // Check if we have extracted real boundary
    const extracted = extractedData.find(e => e.villageNo === village.villageNo);

    if (extracted && extracted.boundary) {
        console.log(`✅ Using real boundary for Village ${village.villageNo}: ${village.name}`);
        return {
            ...village,
            centerPoint: extracted.centerPoint || village.centerPoint,
            boundary: extracted.boundary
        };
    } else {
        console.log(`⚪ Setting boundary to null for Village ${village.villageNo}: ${village.name}`);
        return {
            ...village,
            boundary: null
        };
    }
});

const outputContent = `// Villages Seed Data with GeoJSON for ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
// 20 หมู่บ้าน พร้อมพิกัดและขอบเขต
// ⚠️ AUTO-GENERATED - Real boundaries for 1,2,3; null for others.

export const villagesWithGeoJSONData = ${JSON.stringify(processedVillages, null, 2)};
`;

const seedPath = path.join(__dirname, 'backend/prisma/villages-with-geojson-seed.ts');
fs.writeFileSync(seedPath, outputContent, 'utf8');

console.log(`\n🎉 Successfully rebuilt ${seedPath}`);
