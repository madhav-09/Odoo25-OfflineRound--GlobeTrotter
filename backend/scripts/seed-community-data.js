const { User, CommunityMember } = require('../models');
const { v4: uuidv4 } = require('uuid');

const seedCommunityData = async () => {
  try {
    console.log('Seeding community data...');

    // Create dummy users
    const dummyUsers = [
      { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com', bio: 'Adventure seeker and photographer' },
      { firstName: 'Mike', lastName: 'Chen', email: 'mike@example.com', bio: 'Backpacker exploring Asia' },
      { firstName: 'Emma', lastName: 'Wilson', email: 'emma@example.com', bio: 'Food lover and travel blogger' },
      { firstName: 'David', lastName: 'Brown', email: 'david@example.com', bio: 'Solo traveler and writer' },
      { firstName: 'Lisa', lastName: 'Garcia', email: 'lisa@example.com', bio: 'Luxury travel enthusiast' },
      { firstName: 'Tom', lastName: 'Anderson', email: 'tom@example.com', bio: 'Budget traveler and hiker' },
      { firstName: 'Anna', lastName: 'Martinez', email: 'anna@example.com', bio: 'Travel photographer' },
      { firstName: 'James', lastName: 'Taylor', email: 'james@example.com', bio: 'Digital nomad' }
    ];

    const createdUsers = [];
    for (const userData of dummyUsers) {
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: {
          id: uuidv4(),
          cognitoId: `dummy_${userData.email}`,
          ...userData
        }
      });
      createdUsers.push(user);
      if (created) {
        console.log(`Created user: ${user.firstName} ${user.lastName}`);
      }
    }

    // Add users to communities
    const communityMemberships = [
      { userId: createdUsers[0].id, communityId: 'general' },
      { userId: createdUsers[0].id, communityId: 'photography' },
      { userId: createdUsers[1].id, communityId: 'backpacking' },
      { userId: createdUsers[1].id, communityId: 'general' },
      { userId: createdUsers[2].id, communityId: 'foodie' },
      { userId: createdUsers[2].id, communityId: 'photography' },
      { userId: createdUsers[3].id, communityId: 'solo' },
      { userId: createdUsers[3].id, communityId: 'general' },
      { userId: createdUsers[4].id, communityId: 'luxury' },
      { userId: createdUsers[5].id, communityId: 'backpacking' },
      { userId: createdUsers[5].id, communityId: 'solo' },
      { userId: createdUsers[6].id, communityId: 'photography' },
      { userId: createdUsers[7].id, communityId: 'general' },
      { userId: createdUsers[7].id, communityId: 'solo' }
    ];

    for (const membership of communityMemberships) {
      await CommunityMember.findOrCreate({
        where: membership,
        defaults: membership
      });
    }

    console.log('Community data seeded successfully!');
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${communityMemberships.length} community memberships`);

  } catch (error) {
    console.error('Error seeding community data:', error);
  }
};

// Run if called directly
if (require.main === module) {
  seedCommunityData().then(() => process.exit(0));
}

module.exports = seedCommunityData;