const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../backend/prisma/villages-with-geojson-seed.ts');
console.log(`Reading file: ${filePath}`);

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex to match the boundary object block
    // Matches "boundary: {" followed by anything until "}," at the start of a line (with indentation)
    const regex = /boundary:\s*\{[\s\S]*?^\s*\},/gm;

    // Check if we find matches
    const matches = content.match(regex);
    if (matches) {
        console.log(`Found ${matches.length} boundary objects to replace.`);

        // Replace with boundary: null
        const newContent = content.replace(regex, 'boundary: null,');

        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('✅ Successfully replaced boundaries with null.');
    } else {
        console.log('⚠️ No boundary objects found to replace.');
    }
} catch (error) {
    console.error('❌ Error:', error);
}
