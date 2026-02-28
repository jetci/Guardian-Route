/**
 * Test script for incident creation API
 * Run with: node test-incident-api.js
 */

const axios = require('axios');

// Test data matching the new GeoJSON format
const testPayload = {
    title: "OTHER - หนองตุ้ม",
    description: "ทดสอบการบันทึกข้อมูล - น้ำไม่ไหล",
    disasterType: "OTHER",
    severity: 2,
    location: {
        type: "Point",
        coordinates: [99.237785, 19.958989] // [longitude, latitude]
    },
    address: "หนองตุ้ม",
    affectedArea: null
};

async function testIncidentCreation() {
    try {
        console.log('🧪 Testing incident creation API...\n');
        console.log('📦 Payload:');
        console.log(JSON.stringify(testPayload, null, 2));
        console.log('\n');

        // You need to replace this with actual JWT token from login
        const token = 'YOUR_JWT_TOKEN_HERE';

        const response = await axios.post(
            'http://localhost:3001/api/incidents',
            testPayload,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ SUCCESS! Incident created:');
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('❌ ERROR:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

// Run test
testIncidentCreation();
