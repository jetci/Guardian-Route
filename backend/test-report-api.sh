#!/bin/bash

# Get token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@obtwiang.go.th","password":"password123"}' | jq -r '.accessToken')

echo "Token: ${TOKEN:0:50}..."
echo ""

# Test 1: Create Report
echo "=== Test 1: Create Report ==="
REPORT_ID=$(curl -s -X POST http://localhost:3001/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "รายงานทดสอบระบบ",
    "type": "CUSTOM",
    "description": "รายงานทดสอบการทำงานของ Report Module",
    "periodStart": "2025-11-01T00:00:00.000Z",
    "periodEnd": "2025-11-30T23:59:59.999Z"
  }' | tee /tmp/create-report.json | jq -r '.id')

echo "Created Report ID: $REPORT_ID"
echo ""

# Test 2: Get All Reports
echo "=== Test 2: Get All Reports ==="
curl -s -X GET "http://localhost:3001/api/reports" \
  -H "Authorization: Bearer $TOKEN" | jq '.meta'
echo ""

# Test 3: Get Report by ID
echo "=== Test 3: Get Report by ID ==="
curl -s -X GET "http://localhost:3001/api/reports/$REPORT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '{id, title, type, status}'
echo ""

# Test 4: Submit Report
echo "=== Test 4: Submit Report ==="
curl -s -X POST "http://localhost:3001/api/reports/$REPORT_ID/submit" \
  -H "Authorization: Bearer $TOKEN" | jq '{id, status, submittedAt}'
echo ""

# Test 5: Get Statistics
echo "=== Test 5: Get Statistics ==="
curl -s -X GET "http://localhost:3001/api/reports/statistics" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

echo "✅ All tests completed!"
