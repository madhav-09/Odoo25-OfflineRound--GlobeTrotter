const { TripCollaborator, TripComment, Trip, User } = require('../models');

const inviteCollaborator = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { email, role } = req.body;
    
    const inviter = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    const trip = await Trip.findOne({ where: { id: tripId, userId: inviter.id } });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const invitee = await User.findOne({ where: { email } });
    if (!invitee) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingCollaboration = await TripCollaborator.findOne({
      where: { tripId, userId: invitee.id }
    });

    if (existingCollaboration) {
      return res.status(400).json({ error: 'User already invited to this trip' });
    }

    const collaboration = await TripCollaborator.create({
      tripId,
      userId: invitee.id,
      role: role || 'viewer',
      invitedBy: inviter.id
    });

    res.status(201).json({ collaboration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCollaborators = async (req, res) => {
  try {
    const { tripId } = req.params;
    
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    const trip = await Trip.findOne({ where: { id: tripId, userId: user.id } });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const collaborators = await TripCollaborator.findAll({
      where: { tripId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'inviter', attributes: ['firstName', 'lastName'] }
      ]
    });

    res.json({ collaborators });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { content, parentId } = req.body;
    
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    // Check if user has access to trip
    const hasAccess = await Trip.findOne({ where: { id: tripId, userId: user.id } }) ||
                     await TripCollaborator.findOne({ where: { tripId, userId: user.id, status: 'accepted' } });
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const comment = await TripComment.create({
      tripId,
      userId: user.id,
      content,
      parentId
    });

    const commentWithUser = await TripComment.findByPk(comment.id, {
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
    });

    res.status(201).json({ comment: commentWithUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { tripId } = req.params;
    
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    // Check if user has access to trip
    const hasAccess = await Trip.findOne({ where: { id: tripId, userId: user.id } }) ||
                     await TripCollaborator.findOne({ where: { tripId, userId: user.id, status: 'accepted' } });
    
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const comments = await TripComment.findAll({
      where: { tripId, parentId: null },
      include: [
        { model: User, as: 'user', attributes: ['firstName', 'lastName'] },
        {
          model: TripComment,
          as: 'replies',
          include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  inviteCollaborator,
  getCollaborators,
  addComment,
  getComments
};