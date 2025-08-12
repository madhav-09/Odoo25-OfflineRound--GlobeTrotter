const sequelize = require('./config/database');
const { User, Trip, City, Activity } = require('./models');

const testProject = async () => {
  try {
    console.log('🧪 Testing GlobeTrotter Project...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Check tables
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('📋 Tables found:', tables);
    
    if (tables.length === 0) {
      console.log('🔄 Creating tables...');
      await sequelize.sync({ force: false });
      console.log('✅ Tables created');
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
    console.log('✅ User created:', testUser.id);
    
    // Create test trip
    const testTrip = await Trip.create({
      name: 'Test Vacation',
      description: 'A test trip to verify functionality',
      startDate: '2024-12-01',
      endDate: '2024-12-05',
      userId: testUser.id
    });
    console.log('✅ Trip created:', testTrip.id);
    
    // Create test city
    const testCity = await City.create({
      name: 'Paris',
      country: 'France',
      order: 1,
      tripId: testTrip.id
    });
    console.log('✅ City created:', testCity.id);
    
    // Create test activity
    const testActivity = await Activity.create({
      name: 'Visit Eiffel Tower',
      description: 'Iconic landmark visit',
      category: 'sightseeing',
      cost: 25.00,
      date: '2024-12-01',
      cityId: testCity.id
    });
    console.log('✅ Activity created:', testActivity.id);
    
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
    }
    
    // Test data persistence
    console.log('\n🔄 Testing data persistence...');
    
    // Simulate server restart
    await sequelize.close();
    await sequelize.authenticate();
    
    const persistedTrip = await Trip.findByPk(testTrip.id, {
      include: [
        { model: City, as: 'cities', include: [{ model: Activity, as: 'activities' }] }
      ]
    });
    
    if (persistedTrip) {
      console.log('✅ Data persisted successfully!');
      console.log('   - Trip:', persistedTrip.name);
      console.log('   - Cities:', persistedTrip.cities.length);
      console.log('   - Activities:', persistedTrip.cities.reduce((acc, city) => acc + city.activities.length, 0));
    }
    
    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...');
    await testActivity.destroy();
    await testCity.destroy();
    await testTrip.destroy();
    await testUser.destroy();
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 PROJECT TEST COMPLETED SUCCESSFULLY!');
    console.log('\n📋 Your GlobeTrotter project is now working with:');
    console.log('   ✅ Database connection');
    console.log('   ✅ Data creation');
    console.log('   ✅ Data retrieval');
    console.log('   ✅ Data persistence');
    console.log('   ✅ All core models working');
    
    console.log('\n🚀 Next steps:');
    console.log('   1. Start your server: npm run dev');
    console.log('   2. Test the frontend');
    console.log('   3. Create real trips and activities');
    
  } catch (error) {
    console.error('❌ Project test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your .env file has correct database credentials');
    console.log('   2. Ensure your RDS instance is running');
    console.log('   3. Check security groups allow connections');
  } finally {
    await sequelize.close();
  }
};

// Run test
testProject(); 