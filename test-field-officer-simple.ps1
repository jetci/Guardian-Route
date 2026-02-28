# Field Officer API Testing Script (Simple Version)
# Test API endpoints for Field Officer module

Write-Host "Field Officer API Testing Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001/api"

# Step 1: Login
Write-Host "[1/6] Testing Login..." -ForegroundColor Yellow

$loginBody = @{
    email = "field@obtwiang.go.th"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.access_token
    Write-Host "SUCCESS: Login successful" -ForegroundColor Green
    Write-Host "User: $($loginResponse.user.fullName)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
}

# Step 2: Get My Tasks
Write-Host "[2/6] Testing Get My Tasks..." -ForegroundColor Yellow

try {
    $tasks = Invoke-RestMethod -Uri "$baseUrl/tasks/my-tasks" -Method GET -Headers $headers
    Write-Host "SUCCESS: Retrieved $($tasks.Count) tasks" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 3: Get Villages
Write-Host "[3/6] Testing Get Villages..." -ForegroundColor Yellow

try {
    $villages = Invoke-RestMethod -Uri "$baseUrl/villages" -Method GET -Headers $headers
    Write-Host "SUCCESS: Retrieved $($villages.Count) villages" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Get My Surveys
Write-Host "[4/6] Testing Get My Surveys..." -ForegroundColor Yellow

try {
    $surveys = Invoke-RestMethod -Uri "$baseUrl/field-officer/surveys/my-surveys" -Method GET -Headers $headers
    Write-Host "SUCCESS: Retrieved $($surveys.Count) surveys" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Note: This endpoint may not exist yet" -ForegroundColor Yellow
    Write-Host ""
}

# Step 5: Test Health Check
Write-Host "[5/6] Testing Health Check..." -ForegroundColor Yellow

try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "SUCCESS: API is healthy" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 6: Test Database Health
Write-Host "[6/6] Testing Database Health..." -ForegroundColor Yellow

try {
    $dbHealth = Invoke-RestMethod -Uri "$baseUrl/health/database" -Method GET
    Write-Host "SUCCESS: Database is connected" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
