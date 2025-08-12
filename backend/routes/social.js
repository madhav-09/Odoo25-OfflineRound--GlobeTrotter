const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  createProfile, 
  sendFriendRequest, 
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
router.post('/users/:userId/friend-request', authenticateToken, sendFriendRequest);
router.get('/friend-requests', authenticateToken, async (req, res) => {
  const { getFriendRequests } = require('../controllers/socialController');
  await getFriendRequests(req, res);
});
router.post('/friend-requests/:requestId', authenticateToken, async (req, res) => {
  const { handleFriendRequest } = require('../controllers/socialController');
  await handleFriendRequest(req, res);
});



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
    const { User, Friendship } = require('../models');
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const friendships = await Friendship.findAll({
      where: {
        status: 'accepted',
        [require('sequelize').Op.or]: [
          { requesterId: user.id },
          { addresseeId: user.id }
        ]
      },
      include: [
        { model: User, as: 'requester', attributes: ['id', 'firstName', 'lastName'] },
        { model: User, as: 'addressee', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });
    
    const friends = friendships.map(friendship => {
      return friendship.requesterId === user.id ? friendship.addressee : friendship.requester;
    });
    
    res.json({ friends });
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

// Get specific user profile
router.get('/users/:userId', authenticateToken, async (req, res) => {
  try {
    const { User } = require('../models');
    const user = await User.findByPk(req.params.userId, {
      attributes: ['id', 'firstName', 'lastName', 'bio', 'profilePicture', 'createdAt', 'location']
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user trips
router.get('/users/:userId/trips', authenticateToken, async (req, res) => {
  try {
    const { Trip } = require('../models');
    const trips = await Trip.findAll({
      where: { userId: req.params.userId },
      attributes: ['id', 'name', 'destination', 'startDate', 'endDate'],
      limit: 10,
      order: [['createdAt', 'DESC']]
    });
    res.json({ trips });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user stories
router.get('/users/:userId/stories', authenticateToken, async (req, res) => {
  try {
    const { Story } = require('../models');
    const stories = await Story.findAll({
      where: { userId: req.params.userId },
      attributes: ['id', 'title', 'content', 'mediaUrl', 'likesCount', 'viewsCount'],
      limit: 10,
      order: [['createdAt', 'DESC']]
    });
    res.json({ stories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check friendship status
router.get('/users/:userId/friendship-status', authenticateToken, async (req, res) => {
  try {
    const { User, Friendship } = require('../models');
    const currentUser = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    const targetUserId = req.params.userId;
    
    if (currentUser.id.toString() === targetUserId) {
      return res.json({ status: 'self' });
    }
    
    const friendship = await Friendship.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { requesterId: currentUser.id, addresseeId: targetUserId },
          { requesterId: targetUserId, addresseeId: currentUser.id }
        ]
      }
    });
    
    if (!friendship) {
      return res.json({ status: 'none' });
    }
    
    if (friendship.status === 'accepted') {
      return res.json({ status: 'friends' });
    }
    
    if (friendship.status === 'pending') {
      if (friendship.requesterId === currentUser.id) {
        return res.json({ status: 'pending_sent' });
      } else {
        return res.json({ status: 'pending_received' });
      }
    }
    
    if (friendship.status === 'blocked') {
      return res.json({ status: 'blocked' });
    }
    
    res.json({ status: friendship.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Social sync routes
router.get('/sync', authenticateToken, async (req, res) => {
  try {
    const { User, UserFollow, Story, Message, Chat } = require('../models');
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    // Get unread chats count
    const unreadChats = await Chat.count({
      where: { 
        '$participants.userId$': user.id,
        lastMessageAt: { [require('sequelize').Op.gt]: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      },
      include: [{ model: require('../models').ChatParticipant, as: 'participants' }]
    });
    
    // Get new stories count (last 24 hours)
    const newStories = await Story.count({
      where: {
        createdAt: { [require('sequelize').Op.gt]: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        userId: { [require('sequelize').Op.ne]: user.id }
      }
    });
    
    // Get pending friend requests
    const friendRequests = await require('../models').Friendship.count({
      where: { addresseeId: user.id, status: 'pending' }
    });
    

    
    res.json({
      unreadChats: Math.min(unreadChats, 99),
      newStories: Math.min(newStories, 99),
      friendRequests: Math.min(friendRequests, 99)
    });
  } catch (error) {
    console.error('Social sync error:', error);
    res.json({ unreadChats: 0, newStories: 0, friendRequests: 0 });
  }
});

// Individual sync endpoints
router.get('/stories/new', authenticateToken, async (req, res) => {
  try {
    const { User, Story } = require('../models');
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    const stories = await Story.findAll({
      where: {
        createdAt: { [require('sequelize').Op.gt]: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        userId: { [require('sequelize').Op.ne]: user.id }
      },
      limit: 10
    });
    res.json(stories);
  } catch (error) {
    res.json([]);
  }
});

router.put('/stories/mark-viewed', authenticateToken, async (req, res) => {
  res.json({ success: true });
});





// Following endpoints
router.get('/following', authenticateToken, async (req, res) => {
  try {
    const { User, UserFollow } = require('../models');
    const currentUser = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const following = await UserFollow.findAll({
      where: { followerId: currentUser.id, status: 'accepted' },
      include: [{
        model: User,
        as: 'following',
        attributes: ['id', 'firstName', 'lastName', 'profilePicture', 'bio']
      }]
    });
    
    const followingUsers = following.map(f => f.following);
    res.json({ following: followingUsers });
  } catch (error) {
    console.error('Following fetch error:', error);
    res.json({ following: [] });
  }
});



module.exports = router;