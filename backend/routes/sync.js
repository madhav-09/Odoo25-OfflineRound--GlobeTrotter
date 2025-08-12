const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Sync data endpoint
router.post('/:key', authenticateToken, async (req, res) => {
  try {
    const { key } = req.params;
    const data = req.body;
    const userId = req.user.id;

    console.log(`📡 Syncing ${key} for user ${userId}`);

    // For now, just acknowledge the sync
    // In production, you'd save to database
    res.json({ 
      success: true, 
      message: `${key} synced successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Sync failed' });
  }
});

module.exports = router;