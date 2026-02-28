const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'supervisor', 'SupervisorDashboardV2.tsx');
const content = fs.readFileSync(filePath, 'utf8');

const checks = [
    { pattern: 'min-h-[220px]', message: 'KPI Cards must have increased min-height (220px)' },
    { pattern: 'gap-8', message: 'Grid gap must be increased to gap-8 for better spacing' },
    { pattern: 'min-w-0', message: 'Grid columns must have min-width: 0 for overflow protection' },
    { pattern: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4', message: 'Grid must be responsive' },
    { pattern: 'flex flex-col justify-between', message: 'KPI Cards must use flex column layout' }
];

let passed = true;
console.log('Running Layout Verification...');

checks.forEach(check => {
    if (content.includes(check.pattern)) {
        console.log(`✅ PASS: ${check.message}`);
    } else {
        console.error(`❌ FAIL: ${check.message}`);
        passed = false;
    }
});

if (passed) {
    console.log('\n✨ ALL CHECKS PASSED');
    process.exit(0);
} else {
    console.error('\n💀 CHECKS FAILED');
    process.exit(1);
}
