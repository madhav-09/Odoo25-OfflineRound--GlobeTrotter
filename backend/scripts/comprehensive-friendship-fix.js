const { User, UserFollow, Friendship, Chat, ChatParticipant, Message } = require('../models');
const { Op } = require('sequelize');

async function comprehensiveFriendshipFix() {
  console.log('🔧 Starting comprehensive friendship system fix...');
  
  try {
    // 1. Remove invalid self-friendships
    const selfFriendships = await Friendship.findAll({
      where: {
        [Op.and]: [
          { requesterId: { [Op.col]: 'addresseeId' } }
        ]
      }
    });
    
    if (selfFriendships.length > 0) {
      await Friendship.destroy({
        where: {
          [Op.and]: [
            { requesterId: { [Op.col]: 'addresseeId' } }
          ]
        }
      });
      console.log(`🗑️  Removed ${selfFriendships.length} invalid self-friendships`);
    }
    
    // 2. Clean up orphaned individual chats (no participants or invalid participants)
    const orphanedChats = await Chat.findAll({
      where: { chatType: 'individual' },
      include: [{
        model: ChatParticipant,
        as: 'participants',
        required: false
      }]
    });
    
    let cleanedChats = 0;
    for (const chat of orphanedChats) {
      if (chat.participants.length !== 2) {
        // Deactivate chats that don't have exactly 2 participants
        await chat.update({ isActive: false });
        cleanedChats++;
      } else {
        // Check if participants are still friends
        const [p1, p2] = chat.participants;
        const friendship = await Friendship.findOne({
          where: {
            status: 'accepted',
            [Op.or]: [
              { requesterId: p1.userId, addresseeId: p2.userId },
              { requesterId: p2.userId, addresseeId: p1.userId }
            ]
          }
        });
        
        if (!friendship) {
          // Deactivate chat if users are no longer friends
          await chat.update({ isActive: false });
          await ChatParticipant.update(
            { isActive: false },
            { where: { chatId: chat.id } }
          );
          cleanedChats++;
        }
      }
    }
    
    console.log(`🧹 Cleaned up ${cleanedChats} invalid individual chats`);
    
    // 3. Create sample friendships for testing (if no valid friendships exist)
    const validFriendships = await Friendship.count({
      where: {
        status: 'accepted',
        requesterId: { [Op.ne]: { [Op.col]: 'addresseeId' } }
      }
    });
    
    if (validFriendships === 0) {
      const users = await User.findAll({ limit: 4 });
      if (users.length >= 2) {
        // Create a friendship between first two users
        await Friendship.create({
          requesterId: users[0].id,
          addresseeId: users[1].id,
          status: 'accepted'
        });
        
        if (users.length >= 3) {
          // Create a pending friendship request
          await Friendship.create({
            requesterId: users[0].id,
            addresseeId: users[2].id,
            status: 'pending'
          });
        }
        
        console.log('✅ Created sample friendships for testing');
      }
    }
    
    // 4. Show final summary
    const totalUsers = await User.count();
    const totalFriendships = await Friendship.count({ where: { status: 'accepted' } });
    const pendingRequests = await Friendship.count({ where: { status: 'pending' } });
    const activeChats = await Chat.count({ where: { chatType: 'individual', isActive: true } });
    
    console.log('\n📊 Final Summary:');
    console.log(`- Total users: ${totalUsers}`);
    console.log(`- Active friendships: ${totalFriendships}`);
    console.log(`- Pending friend requests: ${pendingRequests}`);
    console.log(`- Active individual chats: ${activeChats}`);
    
    // 5. Show all friendships
    const allFriendships = await Friendship.findAll({
      include: [
        { model: User, as: 'requester', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'addressee', attributes: ['firstName', 'lastName'] }
      ]
    });
    
    console.log('\n👥 All friendships:');
    allFriendships.forEach(f => {
      console.log(`- ${f.requester.firstName} ${f.requester.lastName} → ${f.addressee.firstName} ${f.addressee.lastName}: ${f.status}`);
    });
    
    console.log('\n✅ Comprehensive friendship system fix completed!');
    
  } catch (error) {
    console.error('❌ Error in comprehensive fix:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  comprehensiveFriendshipFix()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { comprehensiveFriendshipFix };