const sequelize = require('../config/database');
const models = require('../models');

const syncDatabase = async (force = false) => {
  try {
    console.log('🔄 Starting database synchronization...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync all models
    if (force) {
      console.log('⚠️  Force sync - this will drop existing tables!');
      await sequelize.sync({ force: true });
      console.log('✅ Database schema recreated');
    } else {
      await sequelize.sync({ alter: true });
      console.log('✅ Database schema synchronized');
    }
    
    // Verify tables exist
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('📋 Tables in database:', tables);
    
    // Seed initial data if needed
    await seedInitialData();
    
    console.log('🎉 Database synchronization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    throw error;
  }
};

const seedInitialData = async () => {
  try {
    console.log('🌱 Seeding initial data...');
    
    // Seed city templates if needed
    const { seedCityTemplates } = require('../seeders/city-templates');
    await seedCityTemplates();
    
    // Seed activities if needed
    const { seedActivities } = require('../seeders/activities');
    await seedActivities();
    
    console.log('✅ Initial data seeded');
  } catch (error) {
    console.log('⚠️  Seeding failed (this is usually okay):', error.message);
  }
};

// Run if called directly
if (require.main === module) {
  const force = process.argv.includes('--force');
  
  syncDatabase(force)
    .then(() => {
      console.log('✅ Sync completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Sync failed:', error);
      process.exit(1);
    });
}

module.exports = { syncDatabase };