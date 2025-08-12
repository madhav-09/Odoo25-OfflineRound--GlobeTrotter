const express = require('express');
const router = express.Router();
const { Activity } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Update activity cost
router.put('/activities/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { cost } = req.body;
    
    const activity = await Activity.findByPk(id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    await activity.update({ cost: parseFloat(cost) || 0 });
    res.json({ activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;