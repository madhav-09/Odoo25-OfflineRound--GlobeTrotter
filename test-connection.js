// Quick test to verify backend is responding
const fetch = require('node-fetch');

async function testConnection() {
  try {
    console.log('Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5001'}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test cities endpoint
    const citiesResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5001'}/api/cities`);
    const citiesData = await citiesResponse.json();
    console.log('✅ Cities endpoint:', citiesData);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();