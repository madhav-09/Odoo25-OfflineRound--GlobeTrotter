require('dotenv').config();
const sequelize = require('../config/database');
const { seedTravelStories } = require('../seeders/travel-stories');

const runSeeder = async () => {
  try {
    console.log('🚀 Starting travel stories seeder...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Ensure models are loaded
    require('../models');
    
    // Run the seeder
    await seedTravelStories();
    
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeeder();