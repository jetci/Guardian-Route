# Field Officer API Testing Script
# ทดสอบ API endpoints สำหรับ Field Officer

Write-Host "🧪 Field Officer API Testing Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001/api"
$testResults = @()

# Function to test API endpoint
function Test-ApiEndpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [hashtable]$Headers = @{},
        [object]$Body = $null
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "  Method: $Method" -ForegroundColor Gray
    Write-Host "  Endpoint: $Endpoint" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = "$baseUrl$Endpoint"
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "  ✅ SUCCESS" -ForegroundColor Green
        Write-Host "  Response: $($response | ConvertTo-Json -Depth 2 -Compress)" -ForegroundColor Gray
        Write-Host ""
        
        return @{
            Name = $Name
            Status = "PASS"
            Response = $response
        }
    }
    catch {
        Write-Host "  ❌ FAILED" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        
        return @{
            Name = $Name
            Status = "FAIL"
            Error = $_.Exception.Message
        }
    }
}

# Step 1: Login as Field Officer
Write-Host "📝 Step 1: Login as Field Officer" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$loginBody = @{
    email = "field@obtwiang.go.th"
    password = "password123"
}

$loginResult = Test-ApiEndpoint `
    -Name "Login Field Officer" `
    -Method "POST" `
    -Endpoint "/auth/login" `
    -Body $loginBody

if ($loginResult.Status -eq "PASS") {
    $token = $loginResult.Response.access_token
    $userId = $loginResult.Response.user.id
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "  User ID: $userId" -ForegroundColor Gray
    Write-Host "  Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
    
    $authHeaders = @{
        "Authorization" = "Bearer $token"
    }
} else {
    Write-Host "❌ Login failed! Cannot proceed with tests." -ForegroundColor Red
    exit 1
}

# Step 2: Test My Tasks API
Write-Host "📋 Step 2: Test My Tasks API" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

$tasksResult = Test-ApiEndpoint `
    -Name "Get My Tasks" `
    -Method "GET" `
    -Endpoint "/tasks/my-tasks" `
    -Headers $authHeaders

$testResults += $tasksResult

# Step 3: Test Villages API
Write-Host "🏘️ Step 3: Test Villages API" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

$villagesResult = Test-ApiEndpoint `
    -Name "Get All Villages" `
    -Method "GET" `
    -Endpoint "/villages" `
    -Headers $authHeaders

$testResults += $villagesResult

# Step 4: Test Field Survey API - Get My Surveys
Write-Host "📊 Step 4: Test Field Survey API" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$surveysResult = Test-ApiEndpoint `
    -Name "Get My Surveys" `
    -Method "GET" `
    -Endpoint "/field-officer/surveys/my-surveys" `
    -Headers $authHeaders

$testResults += $surveysResult

# Step 5: Test Submit Survey (with mock data)
Write-Host "📝 Step 5: Test Submit Survey" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

$surveyBody = @{
    villageName = "Nong Tum"
    villageId = "1"
    disasterType = "Flood"
    severity = 3
    estimatedHouseholds = 10
    notes = "Test survey submission from API test script"
    gpsLocation = @{
        lat = 19.9167
        lng = 99.2333
    }
    photoUrls = @()
    additionalData = @{
        testMode = $true
        submittedBy = "API Test Script"
    }
}

$submitSurveyResult = Test-ApiEndpoint `
    -Name "Submit Field Survey" `
    -Method "POST" `
    -Endpoint "/field-officer/surveys" `
    -Headers $authHeaders `
    -Body $surveyBody

$testResults += $submitSurveyResult

# Step 6: Test Health Check
Write-Host "💚 Step 6: Test Health Check" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

$healthResult = Test-ApiEndpoint `
    -Name "Health Check" `
    -Method "GET" `
    -Endpoint "/health"

$testResults += $healthResult

$dbHealthResult = Test-ApiEndpoint `
    -Name "Database Health Check" `
    -Method "GET" `
    -Endpoint "/health/database"

$testResults += $dbHealthResult

# Summary
Write-Host ""
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host ""

$passCount = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failCount = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$totalCount = $testResults.Count

Write-Host "Total Tests: $totalCount" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "❌ Some tests failed. Please review the results above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Failed Tests:" -ForegroundColor Red
    $testResults | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  - $($_.Name): $($_.Error)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 Test Results Details:" -ForegroundColor Cyan
$testResults | ForEach-Object {
    $status = if ($_.Status -eq "PASS") { "✅" } else { "❌" }
    Write-Host "$status $($_.Name)" -ForegroundColor $(if ($_.Status -eq "PASS") { "Green" } else { "Red" })
}

Write-Host ""
$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
Write-Host "Testing completed at $timestamp" -ForegroundColor Gray
