const sequelize = require('./backend/config/database');

const checkImages = async () => {
  try {
    console.log('🔍 Checking profile images in RDS database...\n');
    
    // Raw SQL query to check Users table
    const [users] = await sequelize.query(`
      SELECT "firstName", "lastName", "email", "profilePicture", "createdAt" 
      FROM "Users" 
      WHERE "profilePicture" IS NOT NULL
    `);
    
    console.log('📋 Users with profile pictures in RDS:');
    if (users.length === 0) {
      console.log('❌ No users found with profile pictures');
    } else {
      users.forEach(user => {
        console.log(`✅ ${user.firstName} ${user.lastName} (${user.email})`);
        console.log(`   📸 Image: ${user.profilePicture}`);
        console.log(`   📅 Created: ${user.createdAt}\n`);
      });
    }
    
    // Check UserProfiles table if it exists
    try {
      const [profiles] = await sequelize.query(`
        SELECT up."displayName", up."username", up."profilePicture", u."email"
        FROM "UserProfiles" up
        JOIN "Users" u ON up."userId" = u."id"
        WHERE up."profilePicture" IS NOT NULL
      `);
      
      console.log('📋 UserProfiles with profile pictures:');
      if (profiles.length === 0) {
        console.log('❌ No profiles found with profile pictures');
      } else {
        profiles.forEach(profile => {
          console.log(`✅ ${profile.displayName} (@${profile.username})`);
          console.log(`   📸 Image: ${profile.profilePicture}\n`);
        });
      }
    } catch (error) {
      console.log('ℹ️  UserProfiles table not found or empty');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    process.exit(1);
  }
};

checkImages();