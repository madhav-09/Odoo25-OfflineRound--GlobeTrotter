const { User, Message, CommunityMember } = require('../models');

const seedCommunityMessages = async () => {
  try {
    console.log('Seeding community messages...');

    // Get all users
    const users = await User.findAll();
    if (users.length === 0) {
      console.log('No users found. Run seed-community-data.js first.');
      return;
    }

    // Sample messages for different communities
    const communityMessages = [
      // General Travel
      { groupId: 'general', content: 'Hey everyone! Just got back from an amazing trip to Iceland. The Northern Lights were incredible!', userId: users[0].id },
      { groupId: 'general', content: 'Anyone been to Bali recently? Planning a trip there next month and looking for recommendations.', userId: users[1].id },
      { groupId: 'general', content: 'Pro tip: Always pack a portable charger when traveling. Saved me countless times!', userId: users[2].id },
      { groupId: 'general', content: 'The cherry blossoms in Japan are starting to bloom. Perfect timing for a spring trip!', userId: users[3].id },

      // Backpacking
      { groupId: 'backpacking', content: 'Just finished a 3-month backpacking trip through Southeast Asia on $2000 total. AMA!', userId: users[1].id },
      { groupId: 'backpacking', content: 'Best hostels in Europe? Looking for budget-friendly options with good vibes.', userId: users[5].id },
      { groupId: 'backpacking', content: 'Packing light is an art. Here\'s my 30L backpack setup for 6 months of travel.', userId: users[1].id },

      // Photography
      { groupId: 'photography', content: 'Golden hour at Santorini never gets old. Here are my camera settings for the perfect sunset shot.', userId: users[0].id },
      { groupId: 'photography', content: 'Street photography tips for shy travelers: Start with architecture, then work your way up to people.', userId: users[6].id },
      { groupId: 'photography', content: 'The colors in Morocco are unreal. Every corner is a photo opportunity!', userId: users[2].id },

      // Foodie
      { groupId: 'foodie', content: 'Just tried authentic ramen in Tokyo. The broth was so rich and flavorful. Food heaven!', userId: users[2].id },

      // Solo Travel
      { groupId: 'solo', content: 'Solo female traveler here! Just completed a month in India. Happy to share safety tips.', userId: users[3].id },
      { groupId: 'solo', content: 'The freedom of solo travel is unmatched. You can change plans on a whim and follow your heart.', userId: users[5].id },
      { groupId: 'solo', content: 'Best apps for solo travelers: Maps.me for offline maps, Google Translate, and TripIt for organization.', userId: users[7].id },

      // Luxury
      { groupId: 'luxury', content: 'The Ritz Carlton in Kyoto exceeded all expectations. The service was impeccable and the views stunning.', userId: users[4].id }
    ];

    // Create messages with timestamps spread over the last few days
    for (let i = 0; i < communityMessages.length; i++) {
      const messageData = communityMessages[i];
      const hoursAgo = Math.floor(Math.random() * 72) + 1; // Random time in last 3 days
      const createdAt = new Date(Date.now() - (hoursAgo * 60 * 60 * 1000));

      await Message.create({
        chatId: null, // Community message
        senderId: messageData.userId,
        content: messageData.content,
        messageType: 'text',
        groupId: messageData.groupId,
        createdAt,
        updatedAt: createdAt
      });
    }

    console.log(`Created ${communityMessages.length} community messages`);
    console.log('Community messages seeded successfully!');

  } catch (error) {
    console.error('Error seeding community messages:', error);
  }
};

// Run if called directly
if (require.main === module) {
  seedCommunityMessages().then(() => process.exit(0));
}

module.exports = seedCommunityMessages;