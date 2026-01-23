# Clear All Cache Script for Vite + React
# This will force a complete rebuild

Write-Host "🧹 Starting complete cache clear..." -ForegroundColor Cyan

# 1. Stop all Node processes
Write-Host "`n1️⃣ Stopping all Node processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "   ✅ Node processes stopped" -ForegroundColor Green

# 2. Clear Vite cache
Write-Host "`n2️⃣ Clearing Vite cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".vite" -ErrorAction SilentlyContinue
Write-Host "   ✅ Vite cache cleared" -ForegroundColor Green

# 3. Clear dist folder
Write-Host "`n3️⃣ Clearing dist folder..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
Write-Host "   ✅ Dist folder cleared" -ForegroundColor Green

# 4. Clear TypeScript cache
Write-Host "`n4️⃣ Clearing TypeScript cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force ".tsbuildinfo" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "tsconfig.tsbuildinfo" -ErrorAction SilentlyContinue
Write-Host "   ✅ TypeScript cache cleared" -ForegroundColor Green

# 5. Clear ESLint cache
Write-Host "`n5️⃣ Clearing ESLint cache..." -ForegroundColor Yellow
Remove-Item -Force ".eslintcache" -ErrorAction SilentlyContinue
Write-Host "   ✅ ESLint cache cleared" -ForegroundColor Green

Write-Host "`n✅ All cache cleared successfully!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Run: npm run dev" -ForegroundColor White
Write-Host "   2. Open: http://localhost:5173/supervisor" -ForegroundColor White
Write-Host "   3. Press: Ctrl + Shift + R (Hard Refresh)" -ForegroundColor White
Write-Host "`n🎯 You should now see V5 with:" -ForegroundColor Cyan
Write-Host "   - Gradient header (indigo to violet)" -ForegroundColor White
Write-Host "   - Emoji everywhere" -ForegroundColor White
Write-Host "   - Stats inside header" -ForegroundColor White
Write-Host "   - Always visible filters" -ForegroundColor White
Write-Host "   - 4 tabs with horizontal scroll" -ForegroundColor White
