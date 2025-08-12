const { User } = require('./backend/models');

const checkProfilePaths = async () => {
  try {
    const users = await User.findAll({
      where: { profilePicture: { [require('sequelize').Op.ne]: null } },
      attributes: ['firstName', 'lastName', 'profilePicture']
    });
    
    console.log('Users with profile pictures:');
    users.forEach(user => {
      console.log(`${user.firstName} ${user.lastName}: ${user.profilePicture}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkProfilePaths();