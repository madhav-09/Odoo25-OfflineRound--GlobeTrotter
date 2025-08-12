const { User, UserProfile, UserFollow, Post, PostComment, Story, UserGroup, GroupMember, Chat, ChatParticipant, Message, StoryLike, Friendship } = require('../models');
const { Op } = require('sequelize');

// Profile Management
const createProfile = async (req, res) => {
  try {
    const { displayName, username, bio, location, website } = req.body;
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const profile = await UserProfile.create({
      userId: user.id,
      displayName,
      username,
      bio,
      location,
      website
    });
    
    res.status(201).json({ profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send Friend Request
const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const requester = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    if (requester.id === userId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }
    
    const existingFriendship = await Friendship.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { requesterId: requester.id, addresseeId: userId },
          { requesterId: userId, addresseeId: requester.id }
        ]
      }
    });
    
    if (existingFriendship) {
      if (existingFriendship.status === 'accepted') {
        return res.json({ message: 'Already friends', status: 'accepted' });
      }
      if (existingFriendship.status === 'pending') {
        return res.json({ message: 'Friend request already sent', status: 'pending' });
      }
      if (existingFriendship.status === 'blocked') {
        return res.status(403).json({ error: 'Cannot send friend request' });
      }
    }
    
    await Friendship.create({
      requesterId: requester.id,
      addresseeId: userId,
      status: 'pending'
    });
    
    res.json({ message: 'Friend request sent', status: 'pending' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Accept/Reject Friend Request
const handleFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // 'accept', 'decline', or 'block'
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const friendRequest = await Friendship.findOne({
      where: { id: requestId, addresseeId: user.id, status: 'pending' }
    });
    
    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }
    
    if (action === 'accept') {
      await friendRequest.update({ status: 'accepted' });
      res.json({ message: 'Friend request accepted' });
    } else if (action === 'block') {
      await friendRequest.update({ status: 'blocked' });
      res.json({ message: 'User blocked' });
    } else {
      await friendRequest.update({ status: 'declined' });
      res.json({ message: 'Friend request declined' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Friend Requests
const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const requests = await Friendship.findAll({
      where: { addresseeId: user.id, status: 'pending' },
      include: [{ model: User, as: 'requester', attributes: ['id', 'firstName', 'lastName'] }]
    });
    
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Check if users are friends
const checkFriendship = async (userId1, userId2) => {
  const friendship = await Friendship.findOne({
    where: {
      status: 'accepted',
      [require('sequelize').Op.or]: [
        { requesterId: userId1, addresseeId: userId2 },
        { requesterId: userId2, addresseeId: userId1 }
      ]
    }
  });
  return !!friendship;
};

// Create Story
const createStory = async (req, res) => {
  try {
    const { content, mediaUrl, mediaType, backgroundColor, location, tripId } = req.body;
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    const story = await Story.create({
      userId: user.id,
      content,
      mediaUrl,
      mediaType,
      backgroundColor,
      location,
      tripId,
      expiresAt
    });
    
    res.status(201).json({ story });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Active Stories (Public - all users can see)
const getStories = async (req, res) => {
  try {
    const stories = await Story.findAll({
      where: { 
        isActive: true,
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [{ 
        model: User, 
        as: 'user', 
        attributes: ['id', 'firstName', 'lastName'],
        include: [{ model: UserProfile, as: 'profile', attributes: ['profilePicture'] }]
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ stories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like Story (One-time only)
const likeStory = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const story = await Story.findByPk(id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    const { StoryLike } = require('../models');
    const [like, created] = await StoryLike.findOrCreate({
      where: { storyId: id, userId: user.id }
    });
    
    if (!created) {
      return res.json({ message: 'Already liked this story', liked: true });
    }
    
    await story.increment('likesCount');
    res.json({ message: 'Story liked successfully', liked: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Group
const createGroup = async (req, res) => {
  try {
    const { name, description, groupType } = req.body;
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const group = await UserGroup.create({
      name,
      description,
      groupType: groupType || 'public',
      createdBy: user.id
    });
    
    // Add creator as admin member
    await GroupMember.create({
      groupId: group.id,
      userId: user.id,
      role: 'admin',
      status: 'active'
    });
    
    res.status(201).json({ group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Public Groups
const getUserGroups = async (req, res) => {
  try {
    const groups = await UserGroup.findAll({
      where: { 
        isActive: true,
        groupType: { [Op.in]: ['public', 'private'] }
      },
      include: [{
        model: User,
        as: 'creator',
        attributes: ['firstName', 'lastName']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ groups });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Join Group
const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const [membership, created] = await GroupMember.findOrCreate({
      where: { groupId, userId: user.id },
      defaults: { role: 'member', status: 'active' }
    });
    
    if (!created) {
      return res.json({ message: 'Already a member' });
    }
    
    // Update group member count
    await UserGroup.increment('membersCount', { where: { id: groupId } });
    
    // Create group chat if it doesn't exist
    const [groupChat] = await Chat.findOrCreate({
      where: { groupId, chatType: 'group' },
      defaults: { name: `Group Chat` }
    });
    
    // Add user to group chat
    await ChatParticipant.findOrCreate({
      where: { chatId: groupChat.id, userId: user.id },
      defaults: { isActive: true }
    });
    
    res.json({ message: 'Joined group successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProfile,
  sendFriendRequest,
  handleFriendRequest,
  getFriendRequests,

  createStory,
  getStories,
  likeStory,
  createGroup,
  getUserGroups,
  joinGroup,
  checkFriendship
};