const sequelize = require('../config/database');

const resetMigrations = async () => {
  try {
    console.log('🔄 Resetting migrations...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Check if migrations table exists
    const [migrationsTable] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'SequelizeMeta'
    `);
    
    if (migrationsTable.length > 0) {
      console.log('🗑️  Dropping migrations table...');
      await sequelize.query('DROP TABLE "SequelizeMeta"');
      console.log('✅ Migrations table dropped');
    }
    
    // Check what tables exist
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name NOT LIKE 'pg_%'
      AND table_name NOT IN ('SequelizeMeta')
      ORDER BY table_name
    `);
    
    if (tables.length > 0) {
      console.log('\n⚠️  WARNING: The following tables exist and will be dropped:');
      tables.forEach(table => console.log(`   - ${table.table_name}`));
      
      console.log('\n⚠️  This will DELETE ALL DATA in these tables!');
      console.log('⚠️  Are you sure you want to continue? (y/N)');
      
      // For safety, require manual confirmation
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      
      process.stdin.on('data', async (data) => {
        const input = data.trim().toLowerCase();
        
        if (input === 'y' || input === 'yes') {
          console.log('🗑️  Dropping all existing tables...');
          
          // Drop tables in reverse dependency order
          for (let i = tables.length - 1; i >= 0; i--) {
            try {
              await sequelize.query(`DROP TABLE IF EXISTS "${tables[i].table_name}" CASCADE`);
              console.log(`   ✅ Dropped table: ${tables[i].table_name}`);
            } catch (error) {
              console.log(`   ⚠️  Could not drop table ${tables[i].table_name}: ${error.message}`);
            }
          }
          
          console.log('\n✅ All tables dropped successfully');
          console.log('🔄 You can now run: npm run db:migrate');
          
        } else {
          console.log('❌ Operation cancelled');
        }
        
        process.exit(0);
      });
      
      // Auto-cancel after 30 seconds
      setTimeout(() => {
        console.log('\n⏰ Timeout - operation cancelled');
        process.exit(1);
      }, 30000);
      
    } else {
      console.log('✅ No existing tables found');
      console.log('🔄 You can now run: npm run db:migrate');
    }
    
  } catch (error) {
    console.error('❌ Migration reset failed:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run reset if called directly
if (require.main === module) {
  resetMigrations()
    .catch((error) => {
      console.error('❌ Reset failed:', error);
      process.exit(1);
    });
}

module.exports = resetMigrations; 