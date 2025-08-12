const { Chat, ChatParticipant, Message, User, UserGroup, Friendship } = require('../models');

// Create Individual Chat (Friends Only)
const createIndividualChat = async (req, res) => {
  try {
    const { participantId } = req.body;
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    // Check if users are friends (mutual accepted friendship)
    const friendship = await Friendship.findOne({
      where: {
        status: 'accepted',
        [require('sequelize').Op.or]: [
          { requesterId: user.id, addresseeId: participantId },
          { requesterId: participantId, addresseeId: user.id }
        ]
      }
    });
    
    const areFriends = !!friendship;
    
    if (!areFriends) {
      return res.status(403).json({ error: 'You can only chat privately with friends. Follow each other first.' });
    }
    
    // Check if chat already exists
    const existingChat = await Chat.findOne({
      where: { chatType: 'individual' },
      include: [{
        model: ChatParticipant,
        as: 'participants',
        where: { userId: { [require('sequelize').Op.in]: [user.id, participantId] } }
      }]
    });
    
    if (existingChat && existingChat.participants.length === 2) {
      return res.json({ chat: existingChat });
    }
    
    const chat = await Chat.create({
      chatType: 'individual'
    });
    
    await ChatParticipant.bulkCreate([
      { chatId: chat.id, userId: user.id },
      { chatId: chat.id, userId: participantId }
    ]);
    
    res.status(201).json({ chat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Group Chat
const createGroupChat = async (req, res) => {
  try {
    const { groupId, name } = req.body;
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const chat = await Chat.create({
      chatType: 'group',
      groupId,
      name
    });
    
    // Add all group members to chat
    const groupMembers = await require('../models').GroupMember.findAll({
      where: { groupId, status: 'active' }
    });
    
    const participants = groupMembers.map(member => ({
      chatId: chat.id,
      userId: member.userId
    }));
    
    await ChatParticipant.bulkCreate(participants);
    
    res.status(201).json({ chat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send Message
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, messageType, attachments, replyToId } = req.body;
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const message = await Message.create({
      chatId,
      senderId: user.id,
      content,
      messageType: messageType || 'text',
      attachments: attachments || [],
      replyToId
    });
    
    // Update chat last message time
    await Chat.update(
      { lastMessageAt: new Date() },
      { where: { id: chatId } }
    );
    
    const messageWithSender = await Message.findByPk(message.id, {
      include: [{ model: User, as: 'sender', attributes: ['firstName', 'lastName'] }]
    });
    
    res.status(201).json({ message: messageWithSender });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Chat Messages
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.findAll({
      where: { chatId, isDeleted: false },
      include: [
        { model: User, as: 'sender', attributes: ['firstName', 'lastName'] },
        { model: Message, as: 'replyTo', include: [{ model: User, as: 'sender', attributes: ['firstName', 'lastName'] }] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    res.json({ messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Chats
const getUserChats = async (req, res) => {
  try {
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const chats = await Chat.findAll({
      include: [{
        model: ChatParticipant,
        as: 'participants',
        where: { userId: user.id, isActive: true },
        include: [{
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName']
        }]
      }],
      order: [['lastMessageAt', 'DESC']]
    });
    
    res.json({ chats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createIndividualChat,
  createGroupChat,
  sendMessage,
  getChatMessages,
  getUserChats
};