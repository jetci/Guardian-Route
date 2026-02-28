#!/usr/bin/env pwsh
# Guardian Route - Full Integration Test
# Team W - Test Flow Script

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  GUARDIAN ROUTE - INTEGRATION TEST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3001/api"
$results = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    Write-Host "Testing: $Name..." -NoNewline
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = 'application/json'
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-WebRequest @params -ErrorAction Stop
        Write-Host " ✅ PASS" -ForegroundColor Green
        return @{ Name = $Name; Status = "PASS"; Code = $response.StatusCode }
    }
    catch {
        Write-Host " ❌ FAIL" -ForegroundColor Red
        return @{ Name = $Name; Status = "FAIL"; Error = $_.Exception.Message }
    }
}

# Test 1: Health Check
Write-Host "`n[1/8] Health Check" -ForegroundColor Yellow
$results += Test-Endpoint -Name "API Health" -Method GET -Url "$baseUrl/health"

# Test 2: Login as Field Officer
Write-Host "`n[2/8] Authentication" -ForegroundColor Yellow
$loginBody = @{
    email = "field@obtwiang.go.th"
    password = "password123"
} | ConvertTo-Json

$loginResult = Test-Endpoint -Name "Login (Field Officer)" -Method POST -Url "$baseUrl/auth/login" -Body $loginBody

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType 'application/json' -UseBasicParsing
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.accessToken
    if ($token) {
        $headers = @{ Authorization = "Bearer $token" }
        Write-Host "  Token obtained: $($token.Substring(0,20))..." -ForegroundColor Gray
    } else {
        Write-Host "  ⚠️  No token in response" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "  ⚠️  Cannot proceed without token: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Get My Tasks
Write-Host "`n[3/8] Tasks" -ForegroundColor Yellow
$results += Test-Endpoint -Name "Get My Tasks" -Method GET -Url "$baseUrl/tasks/my" -Headers $headers

# Test 4: Get My Incidents
Write-Host "`n[4/8] Incidents" -ForegroundColor Yellow
$results += Test-Endpoint -Name "Get My Incidents" -Method GET -Url "$baseUrl/incidents/my" -Headers $headers

# Test 5: Get All Incidents
$results += Test-Endpoint -Name "Get All Incidents" -Method GET -Url "$baseUrl/incidents" -Headers $headers

# Test 6: Get My Reports
Write-Host "`n[5/8] Reports" -ForegroundColor Yellow
$results += Test-Endpoint -Name "Get My Reports" -Method GET -Url "$baseUrl/reports/my" -Headers $headers

# Test 7: Login as Admin
Write-Host "`n[6/8] Admin Access" -ForegroundColor Yellow
$adminLoginBody = @{
    email = "admin@obtwiang.go.th"
    password = "password123"
} | ConvertTo-Json

$adminLoginResult = Test-Endpoint -Name "Login (Admin)" -Method POST -Url "$baseUrl/auth/login" -Body $adminLoginBody

try {
    $adminResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $adminLoginBody -ContentType 'application/json' -UseBasicParsing
    $adminData = $adminResponse.Content | ConvertFrom-Json
    $adminToken = $adminData.accessToken
    if ($adminToken) {
        $adminHeaders = @{ Authorization = "Bearer $adminToken" }
    }
}
catch {
    Write-Host "  ⚠️  Admin login failed" -ForegroundColor Red
    $adminHeaders = @{}
}

# Test 8: Get Users (Admin only)
Write-Host "`n[7/8] User Management" -ForegroundColor Yellow
$results += Test-Endpoint -Name "Get All Users" -Method GET -Url "$baseUrl/users" -Headers $adminHeaders

# Test 9: Create Incident
Write-Host "`n[8/8] Create Operations" -ForegroundColor Yellow
$incidentBody = @{
    title = "Test Incident - Integration Test"
    description = "Automated test incident"
    disasterType = "FLOOD"
    priority = "MEDIUM"
    location = @{
        type = "Point"
        coordinates = @(99.2195, 19.9422)
    }
    address = "Test Location"
} | ConvertTo-Json

$results += Test-Endpoint -Name "Create Incident" -Method POST -Url "$baseUrl/incidents" -Headers $headers -Body $incidentBody

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$passed = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($results | Where-Object { $_.Status -eq "FAIL" }).Count
$total = $results.Count

Write-Host "Total Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round(($passed/$total)*100, 2))%`n" -ForegroundColor Cyan

if ($failed -gt 0) {
    Write-Host "Failed Tests:" -ForegroundColor Red
    $results | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  - $($_.Name): $($_.Error)" -ForegroundColor Red
    }
}

Write-Host "`n========================================`n" -ForegroundColor Cyan

# Return exit code
if ($failed -eq 0) { exit 0 } else { exit 1 }
