const { User, UserFollow, Friendship, Chat, ChatParticipant } = require('../models');
const { Op } = require('sequelize');

async function fixFriendshipSystem() {
  console.log('🔧 Starting friendship system cleanup...');
  
  try {
    // 1. Create Friendship table if it doesn't exist
    await Friendship.sync({ force: false });
    console.log('✅ Friendship table created/verified');
    
    // 2. Migrate existing UserFollow data to Friendship
    const existingFollows = await UserFollow.findAll({
      where: { status: 'accepted' }
    });
    
    console.log(`📊 Found ${existingFollows.length} accepted follows to migrate`);
    
    const friendshipData = [];
    const processedPairs = new Set();
    
    for (const follow of existingFollows) {
      const pairKey = [follow.followerId, follow.followingId].sort().join('-');
      
      if (!processedPairs.has(pairKey)) {
        // Check if mutual follow exists
        const mutualFollow = await UserFollow.findOne({
          where: {
            followerId: follow.followingId,
            followingId: follow.followerId,
            status: 'accepted'
          }
        });
        
        if (mutualFollow) {
          // Create friendship record
          friendshipData.push({
            requesterId: follow.followerId,
            addresseeId: follow.followingId,
            status: 'accepted',
            createdAt: follow.createdAt,
            updatedAt: follow.updatedAt
          });
          
          processedPairs.add(pairKey);
        }
      }
    }
    
    if (friendshipData.length > 0) {
      await Friendship.bulkCreate(friendshipData, { ignoreDuplicates: true });
      console.log(`✅ Migrated ${friendshipData.length} friendships`);
    }
    
    // 3. Clean up invalid chats (where users are no longer friends)
    const individualChats = await Chat.findAll({
      where: { chatType: 'individual' },
      include: [{
        model: ChatParticipant,
        as: 'participants'
      }]
    });
    
    let invalidChatsCount = 0;
    
    for (const chat of individualChats) {
      if (chat.participants.length === 2) {
        const [user1, user2] = chat.participants;
        
        // Check if they're still friends
        const friendship = await Friendship.findOne({
          where: {
            status: 'accepted',
            [Op.or]: [
              { requesterId: user1.userId, addresseeId: user2.userId },
              { requesterId: user2.userId, addresseeId: user1.userId }
            ]
          }
        });
        
        if (!friendship) {
          // Deactivate chat instead of deleting (preserve message history)
          await chat.update({ isActive: false });
          await ChatParticipant.update(
            { isActive: false },
            { where: { chatId: chat.id } }
          );
          invalidChatsCount++;
        }
      }
    }
    
    console.log(`🧹 Deactivated ${invalidChatsCount} invalid individual chats`);
    
    // 4. Show summary
    const totalFriendships = await Friendship.count({ where: { status: 'accepted' } });
    const activeChats = await Chat.count({ where: { chatType: 'individual', isActive: true } });
    
    console.log('\n📈 Summary:');
    console.log(`- Total active friendships: ${totalFriendships}`);
    console.log(`- Active individual chats: ${activeChats}`);
    console.log(`- Invalid chats deactivated: ${invalidChatsCount}`);
    
    console.log('\n✅ Friendship system cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing friendship system:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  fixFriendshipSystem()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { fixFriendshipSystem };