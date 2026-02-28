@echo off
REM ========================================
REM Create .env file with SA specifications
REM Guardian Route - Phase 1
REM ========================================

echo Creating .env file...
echo.

(
echo # Guardian Route Backend Environment Variables
echo # Created: November 13, 2025
echo # Phase: 1 - Database Setup
echo.
echo # ========================================
echo # Database Configuration
echo # ========================================
echo DATABASE_URL="postgresql://guardian_admin:guardian_password_2024@localhost:5432/guardian_route?schema=public"
echo.
echo # ========================================
echo # JWT Authentication
echo # ========================================
echo JWT_SECRET="guardianroute2025"
echo JWT_EXPIRATION="8h"
echo REFRESH_TOKEN_SECRET="guardianroute2025-refresh"
echo REFRESH_TOKEN_EXPIRATION="7d"
echo.
echo # ========================================
echo # Server Configuration
echo # ========================================
echo PORT=3001
echo NODE_ENV=development
echo CORS_ORIGIN="http://localhost:5173"
echo.
echo # ========================================
echo # File Upload Configuration
echo # ========================================
echo MAX_FILE_SIZE=10485760
echo UPLOAD_DIR="./uploads"
echo.
echo # ========================================
echo # Logging ^& Monitoring
echo # ========================================
echo LOG_LEVEL="debug"
echo.
echo # ========================================
echo # External API Keys ^(Optional^)
echo # ========================================
echo GEMINI_API_KEY=""
echo GOOGLE_MAPS_API_KEY=""
echo.
echo # ========================================
echo # Email Configuration ^(Optional^)
echo # ========================================
echo SMTP_HOST=""
echo SMTP_PORT=587
echo SMTP_USER=""
echo SMTP_PASSWORD=""
echo SMTP_FROM="noreply@guardianroute.local"
) > .env

echo ✅ .env file created successfully!
echo.
echo Configuration:
echo - Database: guardian_route
echo - User: guardian_admin
echo - Port: 3001
echo - JWT Secret: guardianroute2025
echo.
echo ⚠️  SECURITY NOTE:
echo - .env file is gitignored (correct!)
echo - Never commit .env to Git
echo - Keep credentials secure
echo.
pause
