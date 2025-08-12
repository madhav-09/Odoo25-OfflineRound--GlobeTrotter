const sequelize = require('../config/database');
const models = require('../models');

const syncDatabase = async () => {
  try {
    console.log('🔄 Starting database synchronization...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync all models with force: false to preserve existing data
    await sequelize.sync({ alter: true });
    console.log('✅ Database schema synchronized');
    
    // Verify all tables exist
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('📋 Existing tables:', tables);
    
    // Check for required tables
    const requiredTables = ['Users', 'Trips', 'Cities', 'Activities', 'SharedTrips', 'TripCollaborators', 'BudgetItems', 'TripComments'];
    const missingTables = requiredTables.filter(table => !tables.includes(table));
    
    if (missingTables.length > 0) {
      console.log('⚠️  Missing tables:', missingTables);
      console.log('🔄 Creating missing tables...');
      await sequelize.sync({ force: false });
    }
    
    console.log('✅ Database synchronization completed successfully');
    
    // Seed initial data
    const seedCities = require('../seeders/cities');
    await seedCities();
    
    const { seedActivities } = require('../seeders/activities');
    await seedActivities();
    
    console.log('✅ Initial data seeded');
    
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  syncDatabase()
    .then(() => {
      console.log('🎉 Database setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = syncDatabase;