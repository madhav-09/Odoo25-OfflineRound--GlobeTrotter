// Quick script to check database contents
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

async function checkDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Check tables
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\n📋 Tables in database:');
    results.forEach(row => console.log(`  - ${row.table_name}`));
    
    // Check cities data
    const [cities] = await sequelize.query('SELECT * FROM "Cities" LIMIT 5');
    console.log('\n🏙️ Sample cities data:');
    cities.forEach(city => console.log(`  - ${city.name}, ${city.country}`));
    
    // Check users
    const [users] = await sequelize.query('SELECT COUNT(*) as count FROM "Users"');
    console.log(`\n👥 Users in database: ${users[0].count}`);
    
    // Check trips
    const [trips] = await sequelize.query('SELECT COUNT(*) as count FROM "Trips"');
    console.log(`🧳 Trips in database: ${trips[0].count}`);
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

checkDatabase();