
const description = `เกิดการเผาไหม้ขนาดกลาง

[พิกัดจุดเกิดเหตุทั้งหมด (2 จุด)]
1. 19.961248, 99.228687
2. 19.957376, 99.235468`;

console.log("Testing description parsing...");
console.log("Input text:\n" + description);
console.log("\n--------------------------------\n");

const markers = [];
// Regex to match "1. 19.961248, 99.228687" pattern
const regex = /(\d+)\.\s*(\d+\.\d+),\s*(\d+\.\d+)/g;
let match;

while ((match = regex.exec(description)) !== null) {
    markers.push({
        label: `จุดที่ ${match[1]}`,
        lat: parseFloat(match[2]),
        lng: parseFloat(match[3])
    });
}

console.log("Extracted Markers:", JSON.stringify(markers, null, 2));

if (markers.length === 2 && markers[0].lat === 19.961248 && markers[1].lng === 99.235468) {
    console.log("\n✅ TEST PASSED: Successfully extracted 2 markers.");
} else {
    console.log("\n❌ TEST FAILED: Extraction did not match expected output.");
}
