const sequelize = require('../config/database');
const User = require('../models/User');

const makeAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    const [user, created] = await User.findOrCreate({
      where: { email: 'patelrahul3105@gmail.com' },
      defaults: {
        cognitoId: 'admin-' + Date.now(),
        firstName: 'Rahul',
        lastName: 'Patel',
        role: 'admin',
        emailVerified: true,
        isActive: true
      }
    });

    if (!created) {
      await user.update({ role: 'admin' });
      console.log('✅ Updated existing user to admin');
    } else {
      console.log('✅ Created new admin user');
    }

    console.log(`Admin user: ${user.email} (${user.role})`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();