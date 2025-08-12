const sequelize = require('./config/database');

const quickFix = async () => {
  try {
    console.log('🚀 Quick Fix: Getting your project running...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Check what tables exist
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('📋 Existing tables:', tables);
    
    if (tables.length === 0) {
      console.log('🔄 No tables found, creating basic schema...');
      
      // Create basic tables without complex migrations
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS "Users" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "cognitoId" VARCHAR(255) UNIQUE NOT NULL,
          "email" VARCHAR(255) UNIQUE NOT NULL,
          "firstName" VARCHAR(255) NOT NULL,
          "lastName" VARCHAR(255) NOT NULL,
          "profilePicture" VARCHAR(255),
          "bio" TEXT,
          "role" VARCHAR(50) DEFAULT 'user',
          "isActive" BOOLEAN DEFAULT true,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        )
      `);
      
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS "Trips" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "name" VARCHAR(255) NOT NULL,
          "description" TEXT,
          "startDate" DATE NOT NULL,
          "endDate" DATE NOT NULL,
          "totalBudget" DECIMAL(10,2) DEFAULT 0,
          "actualCost" DECIMAL(10,2) DEFAULT 0,
          "currency" VARCHAR(3) DEFAULT 'USD',
          "status" VARCHAR(50) DEFAULT 'planning',
          "userId" UUID REFERENCES "Users"("id") ON DELETE CASCADE,
          "shareToken" VARCHAR(255) UNIQUE,
          "isPublic" BOOLEAN DEFAULT false,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        )
      `);
      
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS "Cities" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "name" VARCHAR(255) NOT NULL,
          "country" VARCHAR(255) NOT NULL,
          "state" VARCHAR(255),
          "order" INTEGER DEFAULT 1,
          "tripId" UUID REFERENCES "Trips"("id") ON DELETE CASCADE,
          "arrivalDate" DATE,
          "departureDate" DATE,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        )
      `);
      
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS "Activities" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "name" VARCHAR(255) NOT NULL,
          "description" TEXT,
          "category" VARCHAR(50) NOT NULL,
          "cost" DECIMAL(10,2),
          "date" DATE NOT NULL,
          "time" TIME,
          "order" INTEGER DEFAULT 1,
          "cityId" UUID REFERENCES "Cities"("id") ON DELETE CASCADE,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        )
      `);
      
      console.log('✅ Basic tables created successfully');
    } else {
      console.log('✅ Tables already exist');
    }
    
    // Test data creation
    console.log('\n🧪 Testing data creation...');
    
    // Create test user if none exists
    const [users] = await sequelize.query('SELECT COUNT(*) as count FROM "Users"');
    if (users[0].count === 0) {
      await sequelize.query(`
        INSERT INTO "Users" ("cognitoId", "email", "firstName", "lastName")
        VALUES ('test-user-${Date.now()}', 'test@example.com', 'Test', 'User')
      `);
      console.log('✅ Test user created');
    }
    
    console.log('\n🎉 Quick fix completed! Your project should now work.');
    console.log('\n📋 Next steps:');
    console.log('   1. Start your server: npm run dev');
    console.log('   2. Test creating a trip');
    console.log('   3. Data should now persist!');
    
  } catch (error) {
    console.error('❌ Quick fix failed:', error.message);
    console.log('\n🔧 Alternative: Use SQLite for development');
    console.log('   Edit backend/config/database.js to use SQLite temporarily');
  } finally {
    await sequelize.close();
  }
};

// Run quick fix
quickFix(); 