const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login...');
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@obtwiang.go.th',
      password: 'password123'
    });
    
    console.log('✅ Login successful!');
    console.log('User:', response.data.user);
    console.log('Token:', response.data.accessToken.substring(0, 20) + '...');
  } catch (error) {
    console.error('❌ Login failed!');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.error('Full error:', error.response?.data);
  }
}

testLogin();
