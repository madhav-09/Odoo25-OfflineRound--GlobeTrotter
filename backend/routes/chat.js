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

module.exports = router;