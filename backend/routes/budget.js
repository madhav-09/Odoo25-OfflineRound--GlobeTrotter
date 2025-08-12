const express = require('express');
const router = express.Router();
const { 
  createBudgetItem, 
  getBudgetItems,
  getBudgetSummary,
  getBudgetSummaries,
  getBudgetNotifications,
  getNotificationCount,
  updateBudgetItem, 
  deleteBudgetItem 
} = require('../controllers/budgetController');
const { authenticateToken } = require('../middleware/auth');

router.post('/trips/:tripId/budget', authenticateToken, createBudgetItem);
router.get('/trips/:tripId/budget', authenticateToken, getBudgetItems);
router.get('/trips/:tripId/budget/summary', authenticateToken, getBudgetSummary);
router.get('/budget/summaries', authenticateToken, getBudgetSummaries);
router.get('/budget/notifications', authenticateToken, getBudgetNotifications);
router.get('/budget/notifications/count', authenticateToken, getNotificationCount);
router.put('/budget/:budgetItemId', authenticateToken, updateBudgetItem);
router.delete('/budget/:budgetItemId', authenticateToken, deleteBudgetItem);

module.exports = router;