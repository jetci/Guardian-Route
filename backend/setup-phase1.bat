@echo off
REM ========================================
REM Guardian Route - Phase 1 Setup Script
REM ========================================
REM Date: November 13, 2025
REM Team: W
REM ========================================

echo.
echo ========================================
echo Guardian Route - Phase 1 Setup
echo ========================================
echo.

REM Check if .env exists
if not exist ".env" (
    echo [1/5] Creating .env file from .env.example...
    copy .env.example .env
    echo ✅ .env file created
    echo ⚠️  Please update DATABASE_URL in .env if needed
    echo.
) else (
    echo [1/5] .env file already exists
    echo.
)

REM Install dependencies
echo [2/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)
echo ✅ Dependencies installed
echo.

REM Generate Prisma Client
echo [3/5] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma Client
    exit /b 1
)
echo ✅ Prisma Client generated
echo.

REM Run migrations
echo [4/5] Running database migrations...
echo ⚠️  Make sure PostgreSQL is running and database is created!
echo.
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo ❌ Failed to run migrations
    echo.
    echo Troubleshooting:
    echo 1. Check if PostgreSQL is running
    echo 2. Check if database 'guardian_route' exists
    echo 3. Check if user 'guardian_admin' has correct permissions
    echo 4. Verify DATABASE_URL in .env file
    exit /b 1
)
echo ✅ Migrations completed
echo.

REM Seed database
echo [5/5] Seeding database with initial data...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo ❌ Failed to seed database
    exit /b 1
)
echo ✅ Database seeded
echo.

REM Success message
echo ========================================
echo ✅ Phase 1 Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start backend: npm run start:dev
echo 2. Test API: curl http://localhost:3001/health
echo 3. Report to SA: Phase 1 ✅ Complete
echo.
echo Test Users:
echo - admin@obtwiang.go.th (password123)
echo - executive@obtwiang.go.th (password123)
echo - supervisor@obtwiang.go.th (password123)
echo - field@obtwiang.go.th (password123)
echo.
echo ========================================
pause
