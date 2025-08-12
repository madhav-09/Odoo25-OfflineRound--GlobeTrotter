const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

router.get('/users', authenticateToken, getAllUsers);
router.get('/users/:id', authenticateToken, getUserById);

module.exports = router;