const sequelize = require('../config/database');
const path = require('path');
const fs = require('fs');

const runMigrations = async () => {
  try {
    console.log('🔄 Starting database migrations...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Get migration files
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js') && file !== 'run-migrations.js')
      .sort();
    
    console.log(`📋 Found ${migrationFiles.length} migration files`);
    
    // Check if migrations table exists
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'SequelizeMeta'
    `);
    
    const migrationsTableExists = results.length > 0;
    
    if (!migrationsTableExists) {
      console.log('🔄 Creating migrations table...');
      await sequelize.query(`
        CREATE TABLE "SequelizeMeta" (
          "name" VARCHAR(255) NOT NULL PRIMARY KEY
        )
      `);
    }
    
    // Get executed migrations
    const [executedMigrations] = await sequelize.query('SELECT name FROM "SequelizeMeta"');
    const executedMigrationNames = executedMigrations.map(m => m.name);
    
    // Run pending migrations
    for (const migrationFile of migrationFiles) {
      if (!executedMigrationNames.includes(migrationFile)) {
        console.log(`🔄 Running migration: ${migrationFile}`);
        
        const migration = require(path.join(migrationsDir, migrationFile));
        await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
        
        // Mark as executed
        await sequelize.query('INSERT INTO "SequelizeMeta" (name) VALUES (?)', {
          replacements: [migrationFile]
        });
        
        console.log(`✅ Migration completed: ${migrationFile}`);
      } else {
        console.log(`⏭️  Migration already executed: ${migrationFile}`);
      }
    }
    
    console.log('🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Run migrations if called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('✅ Migrations completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migrations failed:', error);
      process.exit(1);
    });
}

module.exports = runMigrations; 