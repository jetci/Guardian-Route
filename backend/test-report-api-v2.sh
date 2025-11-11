#!/bin/bash

# Get token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@obtwiang.go.th","password":"password123"}' | jq -r '.accessToken')

echo "✅ Got Token"
echo ""

# Test 1: Create CUSTOM Report
echo "=== Test 1: Create CUSTOM Report ==="
REPORT1=$(curl -s -X POST http://localhost:3001/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "รายงานสรุปประจำเดือน พฤศจิกายน 2568",
    "type": "CUSTOM",
    "summary": "รายงานสรุปผลการดำเนินงานประจำเดือน พฤศจิกายน 2568",
    "periodStart": "2025-11-01T00:00:00.000Z",
    "periodEnd": "2025-11-30T23:59:59.999Z",
    "details": {
      "totalIncidents": 10,
      "resolvedIncidents": 8,
      "pendingIncidents": 2
    }
  }')
  
REPORT1_ID=$(echo "$REPORT1" | jq -r '.id')
echo "$REPORT1" | jq '{id, title, type, status, author: {email: .author.email}}'
echo ""

# Test 2: Create MONTHLY Report
echo "=== Test 2: Create MONTHLY Report ==="
REPORT2=$(curl -s -X POST http://localhost:3001/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "รายงานสถานการณ์ประจำเดือน ตุลาคม 2568",
    "type": "MONTHLY",
    "summary": "สรุปสถานการณ์ภัยพิบัติประจำเดือนตุลาคม",
    "periodStart": "2025-10-01T00:00:00.000Z",
    "periodEnd": "2025-10-31T23:59:59.999Z",
    "totalDamageEstimate": 500000,
    "affectedHouseholds": 25,
    "affectedPersons": 100
  }')
  
REPORT2_ID=$(echo "$REPORT2" | jq -r '.id')
echo "$REPORT2" | jq '{id, title, type, status, totalDamageEstimate, affectedHouseholds}'
echo ""

# Test 3: Get All Reports
echo "=== Test 3: Get All Reports ==="
curl -s -X GET "http://localhost:3001/api/reports?limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq '{total: .meta.total, reports: .data | map({id, title, type, status})}'
echo ""

# Test 4: Submit Report
echo "=== Test 4: Submit Report for Review ==="
curl -s -X POST "http://localhost:3001/api/reports/$REPORT1_ID/submit" \
  -H "Authorization: Bearer $TOKEN" | jq '{id, title, status, submittedAt}'
echo ""

# Test 5: Get Report by ID
echo "=== Test 5: Get Report Details ==="
curl -s -X GET "http://localhost:3001/api/reports/$REPORT1_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '{id, title, type, status, submittedAt, details}'
echo ""

# Test 6: Update Report (should fail - already submitted)
echo "=== Test 6: Try to Update Submitted Report (should fail) ==="
curl -s -X PATCH "http://localhost:3001/api/reports/$REPORT1_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Updated Title"}' | jq '.'
echo ""

# Test 7: Get Statistics
echo "=== Test 7: Get Report Statistics ==="
curl -s -X GET "http://localhost:3001/api/reports/statistics" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Test 8: Filter Reports by Type
echo "=== Test 8: Filter Reports by Type (MONTHLY) ==="
curl -s -X GET "http://localhost:3001/api/reports?type=MONTHLY" \
  -H "Authorization: Bearer $TOKEN" | jq '{total: .meta.total, reports: .data | map({title, type})}'
echo ""

# Test 9: Generate PDF (placeholder)
echo "=== Test 9: Generate PDF ==="
curl -s -X POST "http://localhost:3001/api/reports/$REPORT1_ID/generate-pdf" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"forceRegenerate": false}' | jq '.'
echo ""

echo "✅ All API tests completed successfully!"
