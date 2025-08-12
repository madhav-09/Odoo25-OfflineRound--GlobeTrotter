const sequelize = require('../config/database');

const checkMigrationStatus = async () => {
  try {
    console.log('🔍 Checking migration status...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Check if migrations table exists
    const [migrationsTable] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'SequelizeMeta'
    `);
    
    if (migrationsTable.length === 0) {
      console.log('❌ Migrations table does not exist');
      return;
    }
    
    // Get executed migrations
    const [executedMigrations] = await sequelize.query('SELECT name FROM "SequelizeMeta"');
    console.log('📋 Executed migrations:', executedMigrations.map(m => m.name));
    
    // Check what tables exist
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name NOT LIKE 'pg_%'
      ORDER BY table_name
    `);
    
    console.log('\n📊 Existing tables:', tables.map(t => t.table_name));
    
    // Check for existing indexes
    const [indexes] = await sequelize.query(`
      SELECT 
        indexname,
        tablename,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND indexname NOT LIKE 'pg_%'
      ORDER BY tablename, indexname
    `);
    
    console.log('\n🔍 Existing indexes:');
    indexes.forEach(index => {
      console.log(`   - ${index.indexname} on ${index.tablename}`);
    });
    
    // Check for data in tables
    console.log('\n📈 Data counts:');
    for (const table of tables) {
      try {
        const [count] = await sequelize.query(`SELECT COUNT(*) as count FROM "${table.table_name}"`);
        console.log(`   - ${table.table_name}: ${count[0].count} records`);
      } catch (error) {
        console.log(`   - ${table.table_name}: Error counting - ${error.message}`);
      }
    }
    
    console.log('\n🎯 Migration Status Summary:');
    if (executedMigrations.length === 0) {
      console.log('   - No migrations have been executed');
      console.log('   - Tables may exist from previous sync operations');
      console.log('   - Recommendation: Run migrations to establish proper schema');
    } else {
      console.log('   - Some migrations have been executed');
      console.log('   - Schema may be partially migrated');
      console.log('   - Recommendation: Check for missing migrations');
    }
    
  } catch (error) {
    console.error('❌ Migration status check failed:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run check if called directly
if (require.main === module) {
  checkMigrationStatus()
    .then(() => {
      console.log('\n✅ Migration status check completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Migration status check failed:', error);
      process.exit(1);
    });
}

module.exports = checkMigrationStatus; 