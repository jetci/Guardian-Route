# Test Developer Login
$baseUrl = "http://localhost:3001"

Write-Host "Testing Developer Login..." -ForegroundColor Cyan
Write-Host ""

$loginData = @{
    email = "jetci.jm@gmail.com"
    password = "g0KEk,^],k;yo"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    
    Write-Host "Login Successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "User Info:" -ForegroundColor Yellow
    Write-Host "  Email: $($response.user.email)"
    Write-Host "  Name: $($response.user.firstName) $($response.user.lastName)"
    Write-Host "  Role: $($response.user.role)"
    Write-Host ""
    Write-Host "Access Token: $($response.accessToken.Substring(0, 50))..." -ForegroundColor Gray
    
} catch {
    Write-Host "Login Failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error Details:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Gray
    }
}
