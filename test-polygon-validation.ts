
// จำลอง Class LatLng ของ Leaflet (แก้ไข Syntax ให้รองรับ strip-only mode)
class LatLng {
    public lat: number;
    public lng: number;
    constructor(lat: number, lng: number) {
        this.lat = lat;
        this.lng = lng;
    }
}

// จำลองข้อมูลที่ Leaflet ส่งกลับมา (มีทั้งแบบ Array ชั้นเดียว และ Nested Array)
const mockLeafletData = {
    // กรณี 3 จุด (สามเหลี่ยม) - Nested Array (Rings)
    triangle: [
        [new LatLng(1, 1), new LatLng(2, 2), new LatLng(3, 3)]
    ],

    // กรณี 4 จุด (สี่เหลี่ยม) - Nested Array
    rectangle: [
        [new LatLng(1, 1), new LatLng(1, 2), new LatLng(2, 2), new LatLng(2, 1)]
    ],

    // กรณี 5 จุด (Pentagon) - Nested Array
    pentagon: [
        [new LatLng(1, 1), new LatLng(1, 2), new LatLng(2, 3), new LatLng(3, 2), new LatLng(2, 1)]
    ],

    // กรณี Simple Array (บางเวอร์ชั่นหรือบาง Plugin)
    simpleTriangle: [new LatLng(1, 1), new LatLng(2, 2), new LatLng(3, 3)]
};

function validatePolygon(latlngs: any[], caseName: string) {
    console.log(`\n--- Testing Case: ${caseName} ---`);
    console.log(`Input structure depth: ${Array.isArray(latlngs[0]) ? (Array.isArray(latlngs[0][0]) ? 'Double Nested' : 'Nested') : 'Flat'}`);

    // Logic ที่ผมเขียนไปใน CreateIncidentReportPage.tsx
    // ใช้ flat(Infinity) เพื่อจัดการ nested arrays
    // @ts-ignore
    const points = latlngs.flat ? latlngs.flat(Infinity) : (Array.isArray(latlngs[0]) ? latlngs[0] : latlngs);

    console.log(`Counted points: ${points.length}`);

    // เงื่อนไข: ต้องมากกว่า 4 จุด (<= 4 คือไม่ผ่าน)
    if (points.length <= 4) {
        console.log("❌ Result: REJECTED (Correct for <= 4 points)");
        return false; // Rejected
    } else {
        console.log("✅ Result: ACCEPTED (Correct for > 4 points)");
        return true; // Accepted
    }
}

// Run Tests
console.log("STARTING VALIDATION TESTS...");

let allPassed = true;

// 1. Test Triangle (3 points) -> Should REJECT
const res1 = validatePolygon(mockLeafletData.triangle, "Triangle (3 points, Nested)");
if (res1 === true) { console.error("FAILED: Should have rejected triangle"); allPassed = false; }

// 2. Test Rectangle (4 points) -> Should REJECT (เพราะคุณต้องการ > 4)
const res2 = validatePolygon(mockLeafletData.rectangle, "Rectangle (4 points, Nested)");
if (res2 === true) { console.error("FAILED: Should have rejected rectangle"); allPassed = false; }

// 3. Test Pentagon (5 points) -> Should ACCEPT
const res3 = validatePolygon(mockLeafletData.pentagon, "Pentagon (5 points, Nested)");
if (res3 === false) { console.error("FAILED: Should have accepted pentagon"); allPassed = false; }

// 4. Test Simple Triangle (3 points) -> Should REJECT
const res4 = validatePolygon(mockLeafletData.simpleTriangle, "Triangle (3 points, Flat)");
if (res4 === true) { console.error("FAILED: Should have rejected simple triangle"); allPassed = false; }

console.log("\n---------------------------------------------------");
if (allPassed) {
    console.log("🏆 ALL TESTS PASSED: Logic is correct.");
} else {
    console.log("💀 SOME TESTS FAILED: Logic is incorrect.");
}
console.log("---------------------------------------------------");
