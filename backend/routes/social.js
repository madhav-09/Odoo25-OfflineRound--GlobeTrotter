const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  createProfile, 
  followUser, 
  createPost, 
  getFeedPosts, 
  createStory, 
  getStories, 
  createGroup, 
  getUserGroups 
} = require('../controllers/socialController');
const { authenticateToken } = require('../middleware/auth');

// Story media upload configuration
const storyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/stories/');
  },
  filename: (req, file, cb) => {
    cb(null, `story-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});

const uploadStory = multer({ 
  storage: storyStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

// Profile routes
router.post('/profile/create', authenticateToken, createProfile);

// Friend request routes
router.post('/users/:userId/follow', authenticateToken, async (req, res) => {
  const { followUser } = require('../controllers/socialController');
  await followUser(req, res);
});
router.get('/friend-requests', authenticateToken, async (req, res) => {
  const { getFriendRequests } = require('../controllers/socialController');
  await getFriendRequests(req, res);
});
router.post('/friend-requests/:requestId', authenticateToken, async (req, res) => {
  const { handleFriendRequest } = require('../controllers/socialController');
  await handleFriendRequest(req, res);
});

// Post routes
router.post('/posts', authenticateToken, createPost);
router.get('/feed', authenticateToken, getFeedPosts);

// Story routes
router.post('/stories', authenticateToken, createStory);
router.get('/stories', authenticateToken, getStories);
router.post('/stories/upload', authenticateToken, uploadStory.single('storyMedia'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ mediaUrl: `uploads/stories/${req.file.filename}` });
});
router.post('/stories/:id/like', authenticateToken, async (req, res) => {
  try {
    const { Story } = require('../models');
    const story = await Story.findByPk(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    await story.increment('likesCount');
    res.json({ message: 'Story liked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Group routes
router.post('/groups', authenticateToken, createGroup);
router.get('/groups', authenticateToken, getUserGroups);
router.post('/groups/:groupId/join', authenticateToken, async (req, res) => {
  const { joinGroup } = require('../controllers/socialController');
  await joinGroup(req, res);
});

// Individual chat route
router.post('/chats/individual', authenticateToken, async (req, res) => {
  const { createIndividualChat } = require('../controllers/chatController');
  await createIndividualChat(req, res);
});

// Get user's friends
router.get('/friends', authenticateToken, async (req, res) => {
  try {
    const { User, UserFollow } = require('../models');
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    // Get mutual friends (both users follow each other with accepted status)
    const friendships = await UserFollow.findAll({
      where: { followerId: user.id, status: 'accepted' }
    });
    
    const mutualFriends = [];
    for (const friendship of friendships) {
      const mutualFollow = await UserFollow.findOne({
        where: { 
          followerId: friendship.followingId, 
          followingId: user.id, 
          status: 'accepted' 
        }
      });
      if (mutualFollow) {
        const friend = await User.findByPk(friendship.followingId, {
          attributes: ['id', 'firstName', 'lastName']
        });
        if (friend) {
          mutualFriends.push(friend);
        }
      }
    }
    
    res.json({ friends: mutualFriends });
  } catch (error) {
    console.error('Friends fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user chats
router.get('/chats', authenticateToken, async (req, res) => {
  try {
    const { getUserChats } = require('../controllers/chatController');
    await getUserChats(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Community chat routes
router.get('/community/messages', authenticateToken, async (req, res) => {
  try {
    const { Message, User } = require('../models');
    const messages = await Message.findAll({
      where: { chatId: null }, // Community messages have no specific chat
      include: [{ model: User, as: 'sender', attributes: ['firstName', 'lastName'] }],
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json({ messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/community/messages', authenticateToken, uploadStory.single('messageImage'), async (req, res) => {
  try {
    const { content } = req.body;
    const user = await require('../models').User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    let attachments = [];
    if (req.file) {
      attachments = [{ type: 'image', url: `uploads/stories/${req.file.filename}` }];
    }
    
    const message = await require('../models').Message.create({
      chatId: null, // Community message
      senderId: user.id,
      content: content || '',
      messageType: req.file ? 'image' : 'text',
      attachments
    });
    
    const messageWithSender = await require('../models').Message.findByPk(message.id, {
      include: [{ model: require('../models').User, as: 'sender', attributes: ['firstName', 'lastName'] }]
    });
    
    res.status(201).json({ message: messageWithSender });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;