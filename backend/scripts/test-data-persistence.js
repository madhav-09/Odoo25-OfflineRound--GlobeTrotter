const sequelize = require('../config/database');
const { User, Trip, City, Activity } = require('../models');

const testDataPersistence = async () => {
  try {
    console.log('🧪 Testing data persistence...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Check if tables exist
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('📋 Existing tables:', tables);
    
    if (tables.length === 0) {
      console.log('❌ No tables found. Run migrations first: npm run db:migrate');
      return;
    }
    
    // Test data creation
    console.log('\n🔄 Testing data creation...');
    
    // Create test user
    const testUser = await User.create({
      cognitoId: 'test-user-' + Date.now(),
      email: `test-${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User'
    });
    console.log('✅ Test user created:', testUser.id);
    
    // Create test trip
    const testTrip = await Trip.create({
      name: 'Test Trip',
      description: 'Testing data persistence',
      startDate: '2024-12-01',
      endDate: '2024-12-05',
      userId: testUser.id
    });
    console.log('✅ Test trip created:', testTrip.id);
    
    // Create test city
    const testCity = await City.create({
      name: 'Test City',
      country: 'Test Country',
      order: 1,
      tripId: testTrip.id
    });
    console.log('✅ Test city created:', testCity.id);
    
    // Create test activity
    const testActivity = await Activity.create({
      name: 'Test Activity',
      description: 'Testing activity persistence',
      category: 'sightseeing',
      cost: 50.00,
      date: '2024-12-01',
      cityId: testCity.id
    });
    console.log('✅ Test activity created:', testActivity.id);
    
    // Test data retrieval
    console.log('\n🔄 Testing data retrieval...');
    
    const retrievedTrip = await Trip.findByPk(testTrip.id, {
      include: [
        { model: City, as: 'cities', include: [{ model: Activity, as: 'activities' }] }
      ]
    });
    
    if (retrievedTrip) {
      console.log('✅ Trip retrieved successfully');
      console.log('   - Name:', retrievedTrip.name);
      console.log('   - Cities:', retrievedTrip.cities.length);
      console.log('   - Activities:', retrievedTrip.cities.reduce((acc, city) => acc + city.activities.length, 0));
    } else {
      console.log('❌ Failed to retrieve trip');
    }
    
    // Test data persistence after reload
    console.log('\n🔄 Testing data persistence after reload...');
    
    // Simulate server restart by reconnecting
    await sequelize.close();
    await sequelize.authenticate();
    
    const persistedTrip = await Trip.findByPk(testTrip.id, {
      include: [
        { model: City, as: 'cities', include: [{ model: Activity, as: 'activities' }] }
      ]
    });
    
    if (persistedTrip) {
      console.log('✅ Data persisted successfully after reload');
      console.log('   - Trip:', persistedTrip.name);
      console.log('   - Cities:', persistedTrip.cities.length);
      console.log('   - Activities:', persistedTrip.cities.reduce((acc, city) => acc + city.activities.length, 0));
    } else {
      console.log('❌ Data not persisted after reload');
    }
    
    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...');
    await testActivity.destroy();
    await testCity.destroy();
    await testTrip.destroy();
    await testUser.destroy();
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 Data persistence test completed successfully!');
    
  } catch (error) {
    console.error('❌ Data persistence test failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run test if called directly
if (require.main === module) {
  testDataPersistence()
    .then(() => {
      console.log('✅ Test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = testDataPersistence; 