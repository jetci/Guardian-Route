# Test Script: ตรวจสอบพิกัดแผนที่
# วันที่: 15 ธันวาคม 2568

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🗺️  ตรวจสอบพิกัดแผนที่" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$CORRECT_LAT = "19.9167"
$CORRECT_LNG = "99.2333"
$WRONG_LAT = "19.9263"
$WRONG_LNG = "99.8832"

$errors = 0
$warnings = 0

Write-Host "📍 พิกัดที่ถูกต้อง: [$CORRECT_LAT, $CORRECT_LNG]" -ForegroundColor Green
Write-Host "❌ พิกัดที่ผิด: [$WRONG_LAT, $WRONG_LNG]" -ForegroundColor Red
Write-Host ""

# ตรวจสอบไฟล์ Frontend
Write-Host "🔍 ตรวจสอบไฟล์ Frontend..." -ForegroundColor Yellow

$frontendFiles = @(
    "frontend\src\components\maps\BaseMap.tsx",
    "frontend\src\components\maps\DrawingMap.tsx",
    "frontend\src\components\maps\BaseMapWithGPS.tsx",
    "frontend\src\components\VillageBoundaryMap.tsx",
    "frontend\src\components\incidents\IncidentForm.tsx",
    "frontend\src\services\weatherService.ts",
    "frontend\src\pages\admin\SettingsPage.tsx",
    "frontend\src\pages\admin\ManageVillagesPage.tsx"
)

foreach ($file in $frontendFiles) {
    $fullPath = "d:\Guardian-Route\$file"
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        
        # ตรวจสอบพิกัดผิด
        if ($content -match $WRONG_LAT -or $content -match $WRONG_LNG) {
            Write-Host "  ❌ $file - พบพิกัดผิด!" -ForegroundColor Red
            $errors++
        } else {
            Write-Host "  ✅ $file" -ForegroundColor Green
        }
    } else {
        Write-Host "  ⚠️  $file - ไม่พบไฟล์" -ForegroundColor Yellow
        $warnings++
    }
}

Write-Host ""

# ตรวจสอบไฟล์ Backend
Write-Host "🔍 ตรวจสอบไฟล์ Backend..." -ForegroundColor Yellow

$backendFiles = @(
    "backend\src\survey\dto\field-officer-survey.dto.ts",
    "backend\src\incidents\dto\field-officer-incident.dto.ts",
    "backend\src\incidents\dto\create-incident.dto.ts",
    "backend\src\villages\dto\create-village.dto.ts",
    "backend\src\settings\settings.service.ts"
)

foreach ($file in $backendFiles) {
    $fullPath = "d:\Guardian-Route\$file"
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        
        # ตรวจสอบพิกัดผิด
        if ($content -match $WRONG_LAT -or $content -match $WRONG_LNG) {
            Write-Host "  ❌ $file - พบพิกัดผิด!" -ForegroundColor Red
            $errors++
        } else {
            Write-Host "  ✅ $file" -ForegroundColor Green
        }
    } else {
        Write-Host "  ⚠️  $file - ไม่พบไฟล์" -ForegroundColor Yellow
        $warnings++
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# สรุปผล
if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "✅ ผ่านการตรวจสอบทั้งหมด!" -ForegroundColor Green
    Write-Host "   พิกัดทั้งหมดถูกต้องแล้ว" -ForegroundColor Green
    exit 0
} elseif ($errors -eq 0) {
    Write-Host "⚠️  มีคำเตือน $warnings รายการ" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "❌ พบข้อผิดพลาด $errors รายการ" -ForegroundColor Red
    Write-Host "   กรุณาแก้ไขพิกัดที่ผิดให้ถูกต้อง" -ForegroundColor Red
    exit 1
}
