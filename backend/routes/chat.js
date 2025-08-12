const express = require('express');
const router = express.Router();
const { 
  createIndividualChat, 
  createGroupChat, 
  sendMessage, 
  getChatMessages, 
  getUserChats 
} = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');

// Chat creation routes
router.post('/chats/individual', authenticateToken, createIndividualChat);
router.post('/chats/group', authenticateToken, createGroupChat);

// Message routes
router.post('/chats/:chatId/messages', authenticateToken, sendMessage);
router.get('/chats/:chatId/messages', authenticateToken, getChatMessages);

// User chats
router.get('/chats', authenticateToken, getUserChats);

// Unread chats
router.get('/unread', authenticateToken, async (req, res) => {
  try {
    const { User, Chat, ChatParticipant } = require('../models');
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const unreadChats = await Chat.findAll({
      where: {
        lastMessageAt: { [require('sequelize').Op.gt]: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      },
      include: [{
        model: ChatParticipant,
        as: 'participants',
        where: { userId: user.id }
      }],
      limit: 10
    });
    
    res.json(unreadChats);
  } catch (error) {
    console.error('Unread chats error:', error);
    res.json([]);
  }
});

// Mark chats as read
router.put('/mark-read', authenticateToken, async (req, res) => {
  try {
    // In a real app, you'd update read status for specific chats
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;