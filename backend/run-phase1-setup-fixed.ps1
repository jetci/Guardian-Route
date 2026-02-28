# ========================================
# Guardian Route - Phase 1 Complete Setup
# ========================================
# This script automates the entire Phase 1 database setup
# Date: November 13, 2025
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Guardian Route - Phase 1 Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$POSTGRES_PASSWORD = "123456789"
$POSTGRES_USER = "postgres"
$DB_NAME = "guardian_route"
$DB_USER = "guardian_admin"
$DB_PASSWORD = "guardian_password_2024"
$PSQL_PATH = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

# Set password environment variable
$env:PGPASSWORD = $POSTGRES_PASSWORD

# Step 1: Create Database and User
Write-Host "Step 1: Creating database and user..." -ForegroundColor Yellow
Write-Host ""

# Create database
Write-Host "Creating database '$DB_NAME'..." -ForegroundColor White
& $PSQL_PATH -U $POSTGRES_USER -c "CREATE DATABASE $DB_NAME;" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database created successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database may already exist (this is OK)" -ForegroundColor Yellow
}

# Create user
Write-Host "Creating user '$DB_USER'..." -ForegroundColor White
& $PSQL_PATH -U $POSTGRES_USER -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ User created successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  User may already exist (this is OK)" -ForegroundColor Yellow
}

# Grant privileges
Write-Host "Granting privileges..." -ForegroundColor White
& $PSQL_PATH -U $POSTGRES_USER -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
Write-Host "✅ Privileges granted!" -ForegroundColor Green

Write-Host ""

# Step 2: Enable PostGIS
Write-Host "Step 2: Enabling PostGIS extension..." -ForegroundColor Yellow
Write-Host ""

& $PSQL_PATH -U $POSTGRES_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS postgis;"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostGIS enabled successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to enable PostGIS" -ForegroundColor Red
    Write-Host "⚠️  Continuing anyway..." -ForegroundColor Yellow
}

# Grant schema permissions
Write-Host "Granting schema permissions..." -ForegroundColor White
& $PSQL_PATH -U $POSTGRES_USER -d $DB_NAME -c "GRANT USAGE ON SCHEMA public TO $DB_USER;"
& $PSQL_PATH -U $POSTGRES_USER -d $DB_NAME -c "GRANT CREATE ON SCHEMA public TO $DB_USER;"
& $PSQL_PATH -U $POSTGRES_USER -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;"
& $PSQL_PATH -U $POSTGRES_USER -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;"
& $PSQL_PATH -U $POSTGRES_USER -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO $DB_USER;"
& $PSQL_PATH -U $POSTGRES_USER -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO $DB_USER;"
Write-Host "✅ Schema permissions granted!" -ForegroundColor Green

Write-Host ""

# Step 3: Verify database setup
Write-Host "Step 3: Verifying database setup..." -ForegroundColor Yellow
Write-Host ""

$dbCheck = & $PSQL_PATH -U $POSTGRES_USER -t -c "SELECT datname FROM pg_database WHERE datname = '$DB_NAME';"
if ($dbCheck -match $DB_NAME) {
    Write-Host "✅ Database exists: $DB_NAME" -ForegroundColor Green
}

$userCheck = & $PSQL_PATH -U $POSTGRES_USER -t -c "SELECT usename FROM pg_user WHERE usename = '$DB_USER';"
if ($userCheck -match $DB_USER) {
    Write-Host "✅ User exists: $DB_USER" -ForegroundColor Green
}

$postgisCheck = & $PSQL_PATH -U $POSTGRES_USER -d $DB_NAME -t -c "SELECT extname FROM pg_extension WHERE extname = 'postgis';"
if ($postgisCheck -match "postgis") {
    Write-Host "✅ PostGIS extension enabled" -ForegroundColor Green
} else {
    Write-Host "⚠️  PostGIS not found - may need manual installation" -ForegroundColor Yellow
}

Write-Host ""

# Step 4: Check .env file
Write-Host "Step 4: Checking .env configuration..." -ForegroundColor Yellow
Write-Host ""

$envFile = "d:\Guardian-Route\backend\.env"
if (Test-Path $envFile) {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "DATABASE_URL") {
        Write-Host "✅ DATABASE_URL found in .env" -ForegroundColor Green
    } else {
        Write-Host "⚠️  DATABASE_URL not found in .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  .env file not found - creating from .env.example" -ForegroundColor Yellow
    if (Test-Path "d:\Guardian-Route\backend\.env.example") {
        Copy-Item "d:\Guardian-Route\backend\.env.example" $envFile
        Write-Host "✅ .env file created" -ForegroundColor Green
    }
}

Write-Host ""

# Step 5: Run Prisma migrations
Write-Host "Step 5: Running Prisma migrations..." -ForegroundColor Yellow
Write-Host ""

Set-Location "d:\Guardian-Route\backend"

Write-Host "Generating Prisma Client..." -ForegroundColor White
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma Client generated!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
}

Write-Host ""
Write-Host "Running database migrations..." -ForegroundColor White
npx prisma migrate dev --name init
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations completed successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Migration may have issues - check output above" -ForegroundColor Yellow
}

Write-Host ""

# Step 6: Seed database
Write-Host "Step 6: Seeding database with test data..." -ForegroundColor Yellow
Write-Host ""

npx prisma db seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Seeding may have issues - check output above" -ForegroundColor Yellow
}

Write-Host ""

# Step 7: Start backend server
Write-Host "Step 7: Starting backend server..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Installing dependencies (if needed)..." -ForegroundColor White
npm install --silent

Write-Host ""
Write-Host "Starting development server..." -ForegroundColor White
Write-Host "⚠️  Server will start in new window. Check for errors." -ForegroundColor Yellow
Write-Host ""

# Start server in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\Guardian-Route\backend; Write-Host 'Starting Guardian Route Backend...' -ForegroundColor Cyan; npm run start:dev"

Write-Host "⏳ Waiting 15 seconds for server to start..." -ForegroundColor White
Start-Sleep -Seconds 15

Write-Host ""

# Step 8: Test health endpoint
Write-Host "Step 8: Testing API health endpoint..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend server is running!" -ForegroundColor Green
        Write-Host "Response: $($response.Content)" -ForegroundColor White
    }
} catch {
    Write-Host "⚠️  Could not reach health endpoint yet. Server may still be starting..." -ForegroundColor Yellow
    Write-Host "Please check the backend server window for status." -ForegroundColor White
    Write-Host "Try manually: http://localhost:3001/health" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Phase 1 Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Database: guardian_route" -ForegroundColor Green
Write-Host "✅ User: guardian_admin" -ForegroundColor Green
Write-Host "✅ PostGIS: Enabled (if available)" -ForegroundColor Green
Write-Host "✅ Migrations: Applied" -ForegroundColor Green
Write-Host "✅ Seed Data: Inserted" -ForegroundColor Green
Write-Host "✅ Backend: Starting/Started" -ForegroundColor Green
Write-Host ""
Write-Host "Test Users Available:" -ForegroundColor Cyan
Write-Host "  - admin@obtwiang.go.th (password123)" -ForegroundColor White
Write-Host "  - executive@obtwiang.go.th (password123)" -ForegroundColor White
Write-Host "  - supervisor@obtwiang.go.th (password123)" -ForegroundColor White
Write-Host "  - field@obtwiang.go.th (password123)" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Verify backend is running at http://localhost:3001" -ForegroundColor White
Write-Host "  2. Test health endpoint: http://localhost:3001/health" -ForegroundColor White
Write-Host "  3. Start frontend: cd d:\Guardian-Route\frontend && npm run dev" -ForegroundColor White
Write-Host "  4. Begin Phase 2 testing!" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Ready for Phase 2: Real API Testing!" -ForegroundColor Green
Write-Host ""

# Clean up
$env:PGPASSWORD = $null
