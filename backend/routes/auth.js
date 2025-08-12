const express = require('express');
const { getOrCreateUser, getProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/user', getOrCreateUser);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;