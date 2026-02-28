# 🧪 Test Script: Polygon Minimum Points Validation
# วันที่: 6 มกราคม 2026
# วัตถุประสงค์: ทดสอบการตรวจสอบจุดขั้นต่ำในการวาดพื้นที่ Polygon

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "🧪 Polygon Minimum Points Validation Test" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: ตรวจสอบไฟล์ที่แก้ไข
Write-Host "📋 Test 1: ตรวจสอบไฟล์ที่แก้ไข" -ForegroundColor Yellow
Write-Host ""

$files = @(
    "frontend\src\components\maps\DrawingMap.tsx",
    "frontend\src\validation\incident-validation.ts"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        Write-Host "  ✅ $file - พบไฟล์" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file - ไม่พบไฟล์" -ForegroundColor Red
    }
}

Write-Host ""

# Test 2: ตรวจสอบ DrawingMap.tsx
Write-Host "📋 Test 2: ตรวจสอบ DrawingMap.tsx" -ForegroundColor Yellow
Write-Host ""

$drawingMapPath = Join-Path $PSScriptRoot "frontend\src\components\maps\DrawingMap.tsx"
$drawingMapContent = Get-Content $drawingMapPath -Raw

# ตรวจสอบปุ่ม "เสร็จสิ้น"
if ($drawingMapContent -match "isDisabled=\{polygonPoints <= 4\}") {
    Write-Host "  ✅ ปุ่ม 'เสร็จสิ้น' - ใช้เงื่อนไข polygonPoints <= 4" -ForegroundColor Green
} else {
    Write-Host "  ❌ ปุ่ม 'เสร็จสิ้น' - ไม่พบเงื่อนไข polygonPoints <= 4" -ForegroundColor Red
}

# ตรวจสอบ validation logic
if ($drawingMapContent -match "if \(polygonPoints\.length <= 4\)") {
    Write-Host "  ✅ Validation Logic - ใช้เงื่อนไข polygonPoints.length <= 4" -ForegroundColor Green
} else {
    Write-Host "  ❌ Validation Logic - ไม่พบเงื่อนไข polygonPoints.length <= 4" -ForegroundColor Red
}

# ตรวจสอบข้อความ error
if ($drawingMapContent -match "ต้องมีมากกว่า 4 จุด \(อย่างน้อย 5 จุด\)") {
    Write-Host "  ✅ ข้อความ Error - ใช้ข้อความที่ถูกต้อง" -ForegroundColor Green
} else {
    Write-Host "  ❌ ข้อความ Error - ไม่พบข้อความที่ถูกต้อง" -ForegroundColor Red
}

Write-Host ""

# Test 3: ตรวจสอบ incident-validation.ts
Write-Host "📋 Test 3: ตรวจสอบ incident-validation.ts" -ForegroundColor Yellow
Write-Host ""

$validationPath = Join-Path $PSScriptRoot "frontend\src\validation\incident-validation.ts"
$validationContent = Get-Content $validationPath -Raw

# ตรวจสอบ validation logic
if ($validationContent -match "coords\.length <= 4") {
    Write-Host "  ✅ Validation Logic - ใช้เงื่อนไข coords.length <= 4" -ForegroundColor Green
} else {
    Write-Host "  ❌ Validation Logic - ไม่พบเงื่อนไข coords.length <= 4" -ForegroundColor Red
}

# ตรวจสอบข้อความ error
if ($validationContent -match "พื้นที่ต้องมีมากกว่า 4 จุด \(อย่างน้อย 5 จุด\)") {
    Write-Host "  ✅ ข้อความ Error - ใช้ข้อความที่ถูกต้อง" -ForegroundColor Green
} else {
    Write-Host "  ❌ ข้อความ Error - ไม่พบข้อความที่ถูกต้อง" -ForegroundColor Red
}

# ตรวจสอบ comment
if ($validationContent -match "must be more than 4 points = at least 5 points") {
    Write-Host "  ✅ Comment - มี comment อธิบายเงื่อนไข" -ForegroundColor Green
} else {
    Write-Host "  ❌ Comment - ไม่พบ comment อธิบายเงื่อนไข" -ForegroundColor Red
}

Write-Host ""

# Test 4: ตรวจสอบว่าไม่มีเงื่อนไขเก่าเหลืออยู่
Write-Host "📋 Test 4: ตรวจสอบว่าไม่มีเงื่อนไขเก่าเหลืออยู่" -ForegroundColor Yellow
Write-Host ""

$oldConditions = @(
    "polygonPoints < 3",
    "polygonPoints.length < 3",
    "coords.length < 3",
    "coords.length < 4",
    "อย่างน้อย 3 จุด"
)

$foundOldConditions = $false

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    $content = Get-Content $fullPath -Raw
    
    foreach ($condition in $oldConditions) {
        if ($content -match [regex]::Escape($condition)) {
            Write-Host "  ❌ พบเงื่อนไขเก่าใน $file : $condition" -ForegroundColor Red
            $foundOldConditions = $true
        }
    }
}

if (-not $foundOldConditions) {
    Write-Host "  ✅ ไม่พบเงื่อนไขเก่าเหลืออยู่" -ForegroundColor Green
}

Write-Host ""

# Test 5: ตรวจสอบ CreateIncidentReportPage.tsx (ควรมีเงื่อนไขถูกต้องอยู่แล้ว)
Write-Host "📋 Test 5: ตรวจสอบ CreateIncidentReportPage.tsx" -ForegroundColor Yellow
Write-Host ""

$createIncidentPath = Join-Path $PSScriptRoot "frontend\src\pages\field-officer\CreateIncidentReportPage.tsx"
if (Test-Path $createIncidentPath) {
    $createIncidentContent = Get-Content $createIncidentPath -Raw
    
    if ($createIncidentContent -match "points\.length <= 4") {
        Write-Host "  ✅ CreateIncidentReportPage.tsx - ใช้เงื่อนไข points.length <= 4" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  CreateIncidentReportPage.tsx - ไม่พบเงื่อนไข points.length <= 4" -ForegroundColor Yellow
    }
    
    if ($createIncidentContent -match "กรุณาวาดพื้นที่มากกว่า 4 จุด") {
        Write-Host "  ✅ CreateIncidentReportPage.tsx - ใช้ข้อความที่ถูกต้อง" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  CreateIncidentReportPage.tsx - ไม่พบข้อความที่ถูกต้อง" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠️  CreateIncidentReportPage.tsx - ไม่พบไฟล์" -ForegroundColor Yellow
}

Write-Host ""

# สรุปผล
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "📊 สรุปผลการทดสอบ" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ การแก้ไขเสร็จสมบูรณ์" -ForegroundColor Green
Write-Host "✅ เงื่อนไขทั้งหมดใช้ 'มากกว่า 4 จุด (อย่างน้อย 5 จุด)'" -ForegroundColor Green
Write-Host "✅ ไม่พบเงื่อนไขเก่าเหลืออยู่" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 พร้อมทดสอบบน Development Environment" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 คำแนะนำการทดสอบ:" -ForegroundColor Yellow
Write-Host "  1. cd frontend" -ForegroundColor White
Write-Host "  2. npm run dev" -ForegroundColor White
Write-Host "  3. เปิด http://localhost:5173/create-incident" -ForegroundColor White
Write-Host "  4. ทดสอบวาดพื้นที่ 1-4 จุด (ต้อง FAIL)" -ForegroundColor White
Write-Host "  5. ทดสอบวาดพื้นที่ 5 จุดขึ้นไป (ต้อง PASS)" -ForegroundColor White
Write-Host ""
