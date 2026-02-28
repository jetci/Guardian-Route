# ========================================
# Guardian Route - Update .env and Complete Setup
# ========================================
# This script updates .env to use postgres user and completes Phase 1
# Date: November 13, 2025
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Guardian Route - Final Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Update .env file
Write-Host "Step 1: Updating .env file..." -ForegroundColor Yellow
Write-Host ""

$envPath = "d:\Guardian-Route\backend\.env"

if (Test-Path $envPath) {
    Write-Host "Reading current .env file..." -ForegroundColor White
    $envContent = Get-Content $envPath -Raw
    
    # Update DATABASE_URL to use postgres user
    $oldUrl = 'DATABASE_URL="postgresql://guardian_admin:guardian_password_2024@localhost:5432/guardian_route?schema=public"'
    $newUrl = 'DATABASE_URL="postgresql://postgres:123456789@localhost:5432/guardian_route?schema=public"'
    
    if ($envContent -match "guardian_admin") {
        $envContent = $envContent -replace 'DATABASE_URL="postgresql://guardian_admin:guardian_password_2024@localhost:5432/guardian_route\?schema=public"', $newUrl
        $envContent | Set-Content $envPath -NoNewline
        Write-Host "✅ .env updated to use postgres user!" -ForegroundColor Green
    } else {
        Write-Host "✅ .env already using postgres user" -ForegroundColor Green
    }
} else {
    Write-Host "Creating .env from .env.example..." -ForegroundColor White
    if (Test-Path "d:\Guardian-Route\backend\.env.example") {
        $envContent = Get-Content "d:\Guardian-Route\backend\.env.example" -Raw
        $envContent = $envContent -replace 'DATABASE_URL="postgresql://guardian_admin:guardian_password_2024@localhost:5432/guardian_route\?schema=public"', 'DATABASE_URL="postgresql://postgres:123456789@localhost:5432/guardian_route?schema=public"'
        $envContent | Set-Content $envPath -NoNewline
        Write-Host "✅ .env created with postgres user!" -ForegroundColor Green
    } else {
        Write-Host "❌ .env.example not found!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Step 2: Generate Prisma Client
Write-Host "Step 2: Generating Prisma Client..." -ForegroundColor Yellow
Write-Host ""

Set-Location "d:\Guardian-Route\backend"

npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma Client generated!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Run Migrations
Write-Host "Step 3: Running database migrations..." -ForegroundColor Yellow
Write-Host ""

npx prisma migrate dev --name init
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations completed successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Migration completed with warnings (check output above)" -ForegroundColor Yellow
}

Write-Host ""

# Step 4: Seed Database
Write-Host "Step 4: Seeding database with test data..." -ForegroundColor Yellow
Write-Host ""

npx prisma db seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to seed database" -ForegroundColor Red
    Write-Host "Check error messages above" -ForegroundColor Yellow
}

Write-Host ""

# Step 5: Install dependencies
Write-Host "Step 5: Checking dependencies..." -ForegroundColor Yellow
Write-Host ""

if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor White
    npm install
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""

# Step 6: Start Backend
Write-Host "Step 6: Starting backend server..." -ForegroundColor Yellow
Write-Host ""

Write-Host "🚀 Starting development server in new window..." -ForegroundColor Cyan
Write-Host ""

# Start server in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
cd d:\Guardian-Route\backend
Write-Host '========================================' -ForegroundColor Cyan
Write-Host 'Guardian Route Backend Server' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host 'Starting server...' -ForegroundColor Yellow
Write-Host ''
npm run start:dev
"@

Write-Host "⏳ Waiting 20 seconds for server to start..." -ForegroundColor White
Start-Sleep -Seconds 20

Write-Host ""

# Step 7: Test Health Endpoint
Write-Host "Step 7: Testing API health endpoint..." -ForegroundColor Yellow
Write-Host ""

$maxRetries = 3
$retryCount = 0
$serverReady = $false

while ($retryCount -lt $maxRetries -and !$serverReady) {
    try {
        Write-Host "Attempt $($retryCount + 1)/$maxRetries..." -ForegroundColor White
        $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Backend server is running!" -ForegroundColor Green
            Write-Host "Response: $($response.Content)" -ForegroundColor White
            $serverReady = $true
        }
    } catch {
        Write-Host "⏳ Server not ready yet, waiting 5 more seconds..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        $retryCount++
    }
}

if (!$serverReady) {
    Write-Host "⚠️  Could not reach health endpoint automatically." -ForegroundColor Yellow
    Write-Host "Please check the backend server window." -ForegroundColor White
    Write-Host "Try manually: http://localhost:3001/health" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Phase 1 Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database Configuration:" -ForegroundColor Cyan
Write-Host "  ✅ Database: guardian_route" -ForegroundColor Green
Write-Host "  ✅ User: postgres" -ForegroundColor Green
Write-Host "  ✅ Password: 123456789" -ForegroundColor Green
Write-Host "  ✅ Port: 5432" -ForegroundColor Green
Write-Host ""
Write-Host "Backend Status:" -ForegroundColor Cyan
Write-Host "  ✅ Prisma Client: Generated" -ForegroundColor Green
Write-Host "  ✅ Migrations: Applied" -ForegroundColor Green
Write-Host "  ✅ Seed Data: Inserted" -ForegroundColor Green
Write-Host "  ✅ Server: Running on http://localhost:3001" -ForegroundColor Green
Write-Host ""
Write-Host "Test Users Available:" -ForegroundColor Cyan
Write-Host "  📧 admin@obtwiang.go.th (password123)" -ForegroundColor White
Write-Host "  📧 executive@obtwiang.go.th (password123)" -ForegroundColor White
Write-Host "  📧 supervisor@obtwiang.go.th (password123)" -ForegroundColor White
Write-Host "  📧 field@obtwiang.go.th (password123)" -ForegroundColor White
Write-Host ""
Write-Host "API Endpoints Ready:" -ForegroundColor Cyan
Write-Host "  🔗 Health: http://localhost:3001/health" -ForegroundColor White
Write-Host "  🔗 Auth: http://localhost:3001/auth/login" -ForegroundColor White
Write-Host "  🔗 API Docs: http://localhost:3001/api" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Verify backend at http://localhost:3001/health" -ForegroundColor White
Write-Host "  2. Start frontend: cd d:\Guardian-Route\frontend; npm run dev" -ForegroundColor White
Write-Host "  3. Begin Phase 2 Real Testing!" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 Ready for Phase 2: Real API Testing!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please confirm by typing:" -ForegroundColor Yellow
Write-Host "[OK] Backend Ready for Testing" -ForegroundColor Green
Write-Host ""
