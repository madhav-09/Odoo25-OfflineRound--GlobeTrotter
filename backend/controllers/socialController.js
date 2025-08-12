const { User, UserProfile, UserFollow, Post, PostComment, Story, UserGroup, GroupMember, Chat, ChatParticipant, Message, StoryLike } = require('../models');
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
const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const follower = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const existingFollow = await UserFollow.findOne({
      where: { followerId: follower.id, followingId: userId }
    });
    
    if (existingFollow) {
      await existingFollow.destroy();
      return res.json({ message: 'Friend request cancelled', status: 'none' });
    }
    
    await UserFollow.create({
      followerId: follower.id,
      followingId: userId,
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
    const { action } = req.body; // 'accept' or 'reject'
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const friendRequest = await UserFollow.findOne({
      where: { id: requestId, followingId: user.id, status: 'pending' }
    });
    
    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }
    
    if (action === 'accept') {
      await friendRequest.update({ status: 'accepted' });
      res.json({ message: 'Friend request accepted' });
    } else {
      await friendRequest.destroy();
      res.json({ message: 'Friend request rejected' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Friend Requests
const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const requests = await UserFollow.findAll({
      where: { followingId: user.id, status: 'pending' },
      include: [{ model: User, as: 'follower', attributes: ['id', 'firstName', 'lastName'] }]
    });
    
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Post
const createPost = async (req, res) => {
  try {
    const { content, images, location, privacy, tripId, groupId } = req.body;
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const post = await Post.create({
      userId: user.id,
      content,
      images: images || [],
      location,
      privacy: privacy || 'public',
      tripId,
      groupId
    });
    
    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Feed Posts (Public - all users can see)
const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { privacy: 'public', isActive: true },
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['id', 'firstName', 'lastName'],
          include: [{ model: UserProfile, as: 'profile', attributes: ['profilePicture'] }]
        },
        { 
          model: PostComment, 
          as: 'comments', 
          limit: 3, 
          include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }] 
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    });
    
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if users are friends (mutual accepted follows)
const checkFriendship = async (userId1, userId2) => {
  const friendship1 = await UserFollow.findOne({
    where: { followerId: userId1, followingId: userId2, status: 'accepted' }
  });
  const friendship2 = await UserFollow.findOne({
    where: { followerId: userId2, followingId: userId1, status: 'accepted' }
  });
  return !!(friendship1 && friendship2);
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
  followUser,
  handleFriendRequest,
  getFriendRequests,
  createPost,
  getFeedPosts,
  createStory,
  getStories,
  likeStory,
  createGroup,
  getUserGroups,
  joinGroup,
  checkFriendship
};