# Fix all placeholder pages to include DashboardLayout wrapper

$files = @(
    "frontend/src/pages/supervisor/TeamOverviewPage.tsx",
    "frontend/src/pages/supervisor/OperationalReportsPage.tsx",
    "frontend/src/pages/executive/ReportsStatisticsPage.tsx",
    "frontend/src/pages/field-officer/SurveyAreaPage.tsx",
    "frontend/src/pages/analysis/SurveyAnalysisPage.tsx"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $fullPath) {
        Write-Host "Processing: $file" -ForegroundColor Cyan
        
        $content = Get-Content $fullPath -Raw
        
        # Check if already has DashboardLayout
        if ($content -match "DashboardLayout") {
            Write-Host "  ✓ Already has DashboardLayout" -ForegroundColor Green
            continue
        }
        
        # Add import after the comment block
        $content = $content -replace '(\*\/\s*\n)', "`$1`nimport { DashboardLayout } from '../../components/layout/DashboardLayout';`n"
        
        # Wrap return content with DashboardLayout
        $content = $content -replace '(return \(\s*\n\s*)<div', "`$1<DashboardLayout>`n      <div"
        $content = $content -replace '(\s*</div>\s*\n\s*\);)', "    </div>`n    </DashboardLayout>`n  );"
        
        Set-Content $fullPath $content -NoNewline
        Write-Host "  ✓ Added DashboardLayout" -ForegroundColor Green
    } else {
        Write-Host "  ✗ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n✅ All files processed!" -ForegroundColor Green
