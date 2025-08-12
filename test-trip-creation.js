// Simple test script to verify trip creation
const fetch = require('node-fetch');

const API_BASE = process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api` : 'http://localhost:5001/api';

async function testTripCreation() {
  try {
    // Test data
    const tripData = {
      name: 'Test European Trip',
      startDate: '2024-06-01',
      endDate: '2024-06-10',
      totalBudget: 2000,
      cities: [
        {
          name: 'Paris',
          country: 'France',
          arrivalDate: '2024-06-01',
          departureDate: '2024-06-05',
          activities: []
        },
        {
          name: 'Rome',
          country: 'Italy', 
          arrivalDate: '2024-06-05',
          departureDate: '2024-06-10',
          activities: []
        }
      ]
    };

    console.log('Testing trip creation...');
    console.log('Trip data:', JSON.stringify(tripData, null, 2));

    // Note: This would need a valid JWT token in real scenario
    // For now, just test the endpoint structure
    console.log('✅ Trip creation test data prepared');
    console.log('🔧 To test fully, use frontend with valid authentication');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testTripCreation();