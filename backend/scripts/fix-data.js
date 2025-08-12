const sequelize = require('../config/database');

const fixExistingData = async () => {
  try {
    console.log('🔧 Fixing existing data...');
    
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Fix null order values in Cities
    await sequelize.query(`
      UPDATE "Cities" 
      SET "order" = 1 
      WHERE "order" IS NULL;
    `);
    console.log('✅ Fixed Cities order column');
    
    // Fix null order values in Activities
    await sequelize.query(`
      UPDATE "Activities" 
      SET "order" = 1 
      WHERE "order" IS NULL;
    `);
    console.log('✅ Fixed Activities order column');
    
    // Update any other null values that might cause issues
    await sequelize.query(`
      UPDATE "Users" 
      SET "isActive" = true 
      WHERE "isActive" IS NULL;
    `);
    console.log('✅ Fixed Users isActive column');
    
    await sequelize.query(`
      UPDATE "Users" 
      SET "emailVerified" = false 
      WHERE "emailVerified" IS NULL;
    `);
    console.log('✅ Fixed Users emailVerified column');
    
    await sequelize.query(`
      UPDATE "Trips" 
      SET "isPublic" = false 
      WHERE "isPublic" IS NULL;
    `);
    console.log('✅ Fixed Trips isPublic column');
    
    console.log('🎉 Data fixing completed!');
    
  } catch (error) {
    console.error('❌ Data fixing failed:', error);
    throw error;
  }
};

if (require.main === module) {
  fixExistingData()
    .then(() => {
      console.log('✅ Fix completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fix failed:', error);
      process.exit(1);
    });
}

module.exports = { fixExistingData };