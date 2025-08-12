const { User, Story } = require('../models');

const seedTravelStories = async () => {
  try {
    console.log('🌟 Seeding travel stories and users...');

    // Sample users for stories
    const sampleUsers = [
      {
        cognitoId: 'sample-user-1',
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@example.com',
        role: 'user'
      },
      {
        cognitoId: 'sample-user-2',
        firstName: 'Kenji',
        lastName: 'Tanaka',
        email: 'kenji.tanaka@example.com',
        role: 'user'
      },
      {
        cognitoId: 'sample-user-3',
        firstName: 'Lars',
        lastName: 'Andersen',
        email: 'lars.andersen@example.com',
        role: 'user'
      },
      {
        cognitoId: 'sample-user-4',
        firstName: 'Linh',
        lastName: 'Nguyen',
        email: 'linh.nguyen@example.com',
        role: 'user'
      },
      {
        cognitoId: 'sample-user-5',
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        email: 'carlos.rodriguez@example.com',
        role: 'user'
      },
      {
        cognitoId: 'sample-user-6',
        firstName: 'Amara',
        lastName: 'Okafor',
        email: 'amara.okafor@example.com',
        role: 'user'
      },
      {
        cognitoId: 'sample-user-7',
        firstName: 'Sophie',
        lastName: 'Mitchell',
        email: 'sophie.mitchell@example.com',
        role: 'user'
      },
      {
        cognitoId: 'sample-user-8',
        firstName: 'Omar',
        lastName: 'Hassan',
        email: 'omar.hassan@example.com',
        role: 'user'
      }
    ];

    // Create users
    for (const userData of sampleUsers) {
      const [user, created] = await User.findOrCreate({
        where: { cognitoId: userData.cognitoId },
        defaults: userData
      });
      if (created) {
        console.log(`✅ Created user: ${user.firstName} ${user.lastName}`);
      }
    }

    // Sample stories
    const sampleStories = [
      {
        content: "Watching the sunrise over Santorini's blue domes was pure magic! The golden light dancing on the white buildings made me feel like I was in a dream. Sometimes the most beautiful moments happen when you wake up early. 🌅",
        location: "Oia, Santorini, Greece",
        backgroundColor: '#06b6d4',
        cognitoId: 'sample-user-1',
        viewsCount: 1247,
        likesCount: 89,
        expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000)
      },
      {
        content: "Lost in the bamboo forests of Kyoto 🎋 The way the light filters through creates the most serene atmosphere. Every step feels like meditation. This is why I travel - to find these pockets of peace in our chaotic world.",
        location: "Arashiyama Bamboo Grove, Kyoto, Japan",
        backgroundColor: '#10b981',
        cognitoId: 'sample-user-2',
        viewsCount: 892,
        likesCount: 156,
        expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000)
      },
      {
        content: "The Northern Lights decided to put on a show tonight! 💚 Dancing across the Arctic sky like nature's own disco. Three hours of standing in -20°C was totally worth it. Some experiences are worth freezing for!",
        location: "Tromsø, Norway",
        backgroundColor: '#8b5cf6',
        cognitoId: 'sample-user-3',
        viewsCount: 2156,
        likesCount: 234,
        expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000)
      },
      {
        content: "Floating through Ha Long Bay feels like sailing through a fairy tale 🛥️ These limestone karsts have been standing guard for millions of years. Feeling so small yet so connected to something ancient and eternal.",
        location: "Ha Long Bay, Vietnam",
        backgroundColor: '#f59e0b',
        cognitoId: 'sample-user-4',
        viewsCount: 1543,
        likesCount: 198,
        expiresAt: new Date(Date.now() + 16 * 60 * 60 * 1000)
      },
      {
        content: "Machu Picchu at dawn - no words can capture this moment 🏔️ After hiking the Inca Trail for 4 days, seeing this ancient wonder emerge from the mist brought tears to my eyes. Some journeys change you forever.",
        location: "Machu Picchu, Peru",
        backgroundColor: '#ef4444',
        cognitoId: 'sample-user-5',
        viewsCount: 3421,
        likesCount: 445,
        expiresAt: new Date(Date.now() + 14 * 60 * 60 * 1000)
      },
      {
        content: "Safari sunrise in the Serengeti 🦁 Just witnessed the Great Migration - thousands of wildebeest moving like a living river across the plains. Nature's greatest show on Earth! Feeling grateful to witness this incredible spectacle.",
        location: "Serengeti National Park, Tanzania",
        backgroundColor: '#f97316',
        cognitoId: 'sample-user-6',
        viewsCount: 1876,
        likesCount: 267,
        expiresAt: new Date(Date.now() + 19 * 60 * 60 * 1000)
      },
      {
        content: "Diving the Great Barrier Reef today! 🐠 Swimming alongside sea turtles and colorful coral gardens feels like exploring an underwater rainbow. Every dive reminds me why we need to protect these ocean treasures.",
        location: "Great Barrier Reef, Australia",
        backgroundColor: '#06b6d4',
        cognitoId: 'sample-user-7',
        viewsCount: 1234,
        likesCount: 178,
        expiresAt: new Date(Date.now() + 21 * 60 * 60 * 1000)
      },
      {
        content: "Camping under the Milky Way in the Sahara Desert ✨ The silence is profound, broken only by the whisper of sand in the wind. Looking up at billions of stars makes you realize how vast and beautiful our universe is.",
        location: "Sahara Desert, Morocco",
        backgroundColor: '#8b5cf6',
        cognitoId: 'sample-user-8',
        viewsCount: 2987,
        likesCount: 356,
        expiresAt: new Date(Date.now() + 17 * 60 * 60 * 1000)
      }
    ];

    // Create stories
    for (const storyData of sampleStories) {
      // Find the user by cognitoId
      const user = await User.findOne({ where: { cognitoId: storyData.cognitoId } });
      if (user) {
        const [story, created] = await Story.findOrCreate({
          where: { 
            userId: user.id,
            content: storyData.content
          },
          defaults: {
            ...storyData,
            userId: user.id
          }
        });
        if (created) {
          console.log(`✅ Created story: ${storyData.location}`);
        }
      }
    }

    console.log('🎉 Travel stories seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding travel stories:', error);
  }
};

module.exports = { seedTravelStories };