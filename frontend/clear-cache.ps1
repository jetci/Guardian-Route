# Clear All Cache Script
Write-Host "Clearing all cache..." -ForegroundColor Cyan

# Stop Node
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Clear cache folders
Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".vite" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue
Remove-Item -Force ".eslintcache" -ErrorAction SilentlyContinue

Write-Host "Cache cleared!" -ForegroundColor Green
Write-Host "Now run: npm run dev" -ForegroundColor Yellow
