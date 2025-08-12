const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadProfilePicture, upload } = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/profile/picture', authenticateToken, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;