# Guardian Route - Final Setup Script
# Updates .env and completes Phase 1 setup

Write-Host "========================================"
Write-Host "Guardian Route - Final Setup"
Write-Host "========================================"
Write-Host ""

# Step 1: Update .env
Write-Host "Step 1: Updating .env file..."
$envPath = "d:\Guardian-Route\backend\.env"

if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    $envContent = $envContent -replace 'guardian_admin:guardian_password_2024', 'postgres:123456789'
    $envContent | Set-Content $envPath -NoNewline
    Write-Host "[OK] .env updated to use postgres user"
} else {
    Copy-Item "d:\Guardian-Route\backend\.env.example" $envPath
    $envContent = Get-Content $envPath -Raw
    $envContent = $envContent -replace 'guardian_admin:guardian_password_2024', 'postgres:123456789'
    $envContent | Set-Content $envPath -NoNewline
    Write-Host "[OK] .env created with postgres user"
}

Write-Host ""

# Step 2: Generate Prisma Client
Write-Host "Step 2: Generating Prisma Client..."
Set-Location "d:\Guardian-Route\backend"
npx prisma generate
Write-Host ""

# Step 3: Run Migrations
Write-Host "Step 3: Running migrations..."
npx prisma migrate dev --name init
Write-Host ""

# Step 4: Seed Database
Write-Host "Step 4: Seeding database..."
npx prisma db seed
Write-Host ""

# Step 5: Start Backend
Write-Host "Step 5: Starting backend server..."
Write-Host "Server will start in new window..."
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\Guardian-Route\backend; npm run start:dev"

Write-Host "Waiting 20 seconds for server to start..."
Start-Sleep -Seconds 20

# Step 6: Test Health
Write-Host ""
Write-Host "Step 6: Testing health endpoint..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET -TimeoutSec 5
    Write-Host "[OK] Backend is running!"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "[WAIT] Server may still be starting..."
    Write-Host "Check backend window or try: http://localhost:3001/health"
}

Write-Host ""
Write-Host "========================================"
Write-Host "Setup Complete!"
Write-Host "========================================"
Write-Host ""
Write-Host "Database: guardian_route"
Write-Host "User: postgres"
Write-Host "Backend: http://localhost:3001"
Write-Host ""
Write-Host "Test Users:"
Write-Host "  admin@obtwiang.go.th (password123)"
Write-Host "  executive@obtwiang.go.th (password123)"
Write-Host "  supervisor@obtwiang.go.th (password123)"
Write-Host "  field@obtwiang.go.th (password123)"
Write-Host ""
Write-Host "Ready for Phase 2 Testing!"
Write-Host ""
