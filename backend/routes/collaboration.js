const express = require('express');
const router = express.Router();
const { 
  inviteCollaborator, 
  getCollaborators, 
  addComment, 
  getComments 
} = require('../controllers/collaborationController');
const { authenticateToken } = require('../middleware/auth');

router.post('/trips/:tripId/collaborators', authenticateToken, inviteCollaborator);
router.get('/trips/:tripId/collaborators', authenticateToken, getCollaborators);
router.post('/trips/:tripId/comments', authenticateToken, addComment);
router.get('/trips/:tripId/comments', authenticateToken, getComments);

module.exports = router;