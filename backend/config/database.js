const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Force RDS PostgreSQL connection when DB_HOST is set
if (process.env.DB_HOST && process.env.DB_HOST.includes('rds.amazonaws.com')) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 20,
        min: 5,
        acquire: 60000,
        idle: 30000,
        evict: 30000
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false
        },
        connectTimeout: 60000
      },
      retry: {
        match: [
          /ConnectionError/,
          /ConnectionRefusedError/,
          /ConnectionTimedOutError/,
          /TimeoutError/
        ],
        max: 3
      }
    }
  );
  console.log('✅ FORCED RDS PostgreSQL CONNECTION:', process.env.DB_HOST);
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  });
  console.log('⚠️  Using SQLite for development');
}

module.exports = sequelize;