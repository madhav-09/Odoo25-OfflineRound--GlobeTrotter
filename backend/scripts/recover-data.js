const sequelize = require('../config/database');
const { User, Trip, City, Activity } = require('../models');

const recoverData = async () => {
  try {
    console.log('🔄 Attempting data recovery...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Check for existing data
    const userCount = await User.count();
    const tripCount = await Trip.count();
    const cityCount = await City.count();
    const activityCount = await Activity.count();
    
    console.log('📊 Current data status:');
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Trips: ${tripCount}`);
    console.log(`   - Cities: ${cityCount}`);
    console.log(`   - Activities: ${activityCount}`);
    
    if (userCount === 0 && tripCount === 0) {
      console.log('❌ No data found. This might indicate:');
      console.log('   1. Database tables are empty');
      console.log('   2. Data was lost due to sync issues');
      console.log('   3. Migration problems');
      
      // Check if tables exist
      const tables = await sequelize.getQueryInterface().showAllTables();
      console.log('\n📋 Existing tables:', tables);
      
      if (tables.length === 0) {
        console.log('\n🔄 No tables found. Running migrations...');
        const runMigrations = require('../migrations/run-migrations');
        await runMigrations();
        console.log('✅ Migrations completed');
      }
      
      // Try to restore from seeders
      console.log('\n🔄 Attempting to restore from seeders...');
      try {
        const { seedCityTemplates } = require('../seeders/city-templates');
        await seedCityTemplates();
        console.log('✅ City templates restored');
      } catch (error) {
        console.log('⚠️  Could not restore city templates:', error.message);
      }
      
      try {
        const { seedActivities } = require('../seeders/activities');
        await seedActivities();
        console.log('✅ Activity templates restored');
      } catch (error) {
        console.log('⚠️  Could not restore activity templates:', error.message);
      }
      
    } else {
      console.log('✅ Data exists in database');
      
      // Check for orphaned records
      console.log('\n🔍 Checking for orphaned records...');
      
      const orphanedCities = await City.findAll({
        include: [{ model: Trip, as: 'trip', required: false }],
        where: { '$trip.id$': null }
      });
      
      const orphanedActivities = await Activity.findAll({
        include: [{ model: City, as: 'city', required: false }],
        where: { '$city.id$': null }
      });
      
      if (orphanedCities.length > 0) {
        console.log(`⚠️  Found ${orphanedCities.length} orphaned cities`);
        // Optionally clean up orphaned records
        // await City.destroy({ where: { id: orphanedCities.map(c => c.id) } });
      }
      
      if (orphanedActivities.length > 0) {
        console.log(`⚠️  Found ${orphanedActivities.length} orphaned activities`);
        // Optionally clean up orphaned records
        // await Activity.destroy({ where: { id: orphanedActivities.map(a => a.id) } });
      }
      
      if (orphanedCities.length === 0 && orphanedActivities.length === 0) {
        console.log('✅ No orphaned records found');
      }
    }
    
    // Verify data integrity
    console.log('\n🔍 Verifying data integrity...');
    
    try {
      // Test a simple query to ensure relationships work
      const testTrip = await Trip.findOne({
        include: [
          { model: City, as: 'cities', include: [{ model: Activity, as: 'activities' }] }
        ]
      });
      
      if (testTrip) {
        console.log('✅ Data relationships are working correctly');
        console.log(`   - Trip: ${testTrip.name}`);
        console.log(`   - Cities: ${testTrip.cities.length}`);
        console.log(`   - Activities: ${testTrip.cities.reduce((acc, city) => acc + city.activities.length, 0)}`);
      } else {
        console.log('⚠️  No trips found to test relationships');
      }
    } catch (error) {
      console.log('❌ Data integrity check failed:', error.message);
    }
    
    console.log('\n🎉 Data recovery process completed');
    
  } catch (error) {
    console.error('❌ Data recovery failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run recovery if called directly
if (require.main === module) {
  recoverData()
    .then(() => {
      console.log('✅ Recovery completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Recovery failed:', error);
      process.exit(1);
    });
}

module.exports = recoverData; 