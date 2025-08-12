const { BudgetItem, Trip, User } = require('../models');

const createBudgetItem = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { category, description, amount, currency } = req.body;
    
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    const trip = await Trip.findOne({ where: { id: tripId, userId: user.id } });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const budgetItem = await BudgetItem.create({
      tripId,
      name: description || `${category} expense`,
      category: category || 'others',
      description: description || '',
      budgetedAmount: 0,
      actualAmount: parseFloat(amount) || 0,
      currency: currency || 'USD',
      date: new Date(),
      notes: ''
    });

    // Update trip's total spent and category breakdown
    const budgetItems = await BudgetItem.findAll({ where: { tripId } });
    const totalSpent = budgetItems.reduce((sum, item) => sum + parseFloat(item.actualAmount || 0), 0);
    
    const categoryBreakdown = budgetItems.reduce((acc, item) => {
      const category = item.category || 'others';
      acc[category] = (acc[category] || 0) + parseFloat(item.actualAmount || 0);
      return acc;
    }, {});
    
    await trip.update({ 
      totalSpent: totalSpent,
      categoryBreakdown: categoryBreakdown
    });

    res.status(201).json({ budgetItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBudgetItems = async (req, res) => {
  try {
    const { tripId } = req.params;
    
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    const trip = await Trip.findOne({ where: { id: tripId, userId: user.id } });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const budgetItems = await BudgetItem.findAll({
      where: { tripId },
      order: [['createdAt', 'DESC']]
    });

    // Calculate comprehensive summary with category breakdown
    const summary = budgetItems.reduce((acc, item) => {
      const amount = parseFloat(item.actualAmount) || 0;
      acc.totalBudgeted += parseFloat(item.budgetedAmount) || 0;
      acc.totalActual += amount;
      acc.byCategory[item.category] = (acc.byCategory[item.category] || 0) + amount;
      return acc;
    }, { totalBudgeted: 0, totalActual: 0, byCategory: {} });

    // Store summary in database for persistence
    await trip.update({ 
      totalSpent: summary.totalActual,
      categoryBreakdown: summary.byCategory
    });

    res.json({ budgetItems, summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBudgetItem = async (req, res) => {
  try {
    const { budgetItemId } = req.params;
    
    const budgetItem = await BudgetItem.findOne({
      where: { id: budgetItemId },
      include: [{
        model: Trip,
        as: 'trip',
        include: [{ model: User, as: 'user' }]
      }]
    });
    
    if (!budgetItem || budgetItem.trip.user.cognitoId !== req.user.cognitoId) {
      return res.status(404).json({ error: 'Budget item not found' });
    }

    await budgetItem.update(req.body);
    res.json({ budgetItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBudgetItem = async (req, res) => {
  try {
    const { budgetItemId } = req.params;
    
    const budgetItem = await BudgetItem.findOne({
      where: { id: budgetItemId },
      include: [{
        model: Trip,
        as: 'trip',
        include: [{ model: User, as: 'user' }]
      }]
    });
    
    if (!budgetItem || budgetItem.trip.user.cognitoId !== req.user.cognitoId) {
      return res.status(404).json({ error: 'Budget item not found' });
    }

    await budgetItem.destroy();
    res.json({ message: 'Budget item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get budget summary for a trip
const getBudgetSummary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const budgetItems = await BudgetItem.findAll({ where: { tripId } });
    const trip = await Trip.findOne({ where: { id: tripId, userId: user.id } });
    
    const totalSpent = budgetItems.reduce((sum, item) => sum + parseFloat(item.actualAmount), 0);
    const breakdown = budgetItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + parseFloat(item.actualAmount);
      return acc;
    }, {});
    
    res.json({ 
      summary: {
        totalBudget: parseFloat(trip?.totalBudget) || 0,
        totalSpent,
        remaining: (parseFloat(trip?.totalBudget) || 0) - totalSpent,
        breakdown
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get budget summaries for all trips
const getBudgetSummaries = async (req, res) => {
  try {
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    
    const trips = await Trip.findAll({
      where: { userId: user.id },
      include: [{ model: BudgetItem, as: 'budgetItems' }]
    });
    
    const summaries = trips.map(trip => {
      // Use stored data from RDS or calculate if not available
      const totalSpent = trip.totalSpent || trip.budgetItems?.reduce((sum, item) => sum + parseFloat(item.actualAmount), 0) || 0;
      const breakdown = trip.categoryBreakdown || trip.budgetItems?.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + parseFloat(item.actualAmount);
        return acc;
      }, {}) || {};
      
      // Update RDS if calculated data differs from stored data
      if (!trip.categoryBreakdown || trip.totalSpent !== totalSpent) {
        trip.update({ totalSpent, categoryBreakdown: breakdown });
      }
      
      return {
        tripId: trip.id,
        tripName: trip.name,
        totalBudget: trip.totalBudget || 0,
        totalSpent,
        breakdown
      };
    });
    
    res.json({ summaries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get budget notifications
const getBudgetNotifications = async (req, res) => {
  try {
    // Simple fallback - just return empty array for now to prevent errors
    res.json({ notifications: [] });
  } catch (error) {
    console.error('Budget notifications error:', error);
    res.json({ notifications: [] });
  }
};

// Get notification count
const getNotificationCount = async (req, res) => {
  try {
    // Simple fallback - just return 0 for now to prevent errors
    res.json({ count: 0 });
  } catch (error) {
    console.error('Budget notification count error:', error);
    res.json({ count: 0 });
  }
};

module.exports = {
  createBudgetItem,
  getBudgetItems,
  getBudgetSummary,
  getBudgetSummaries,
  getBudgetNotifications,
  getNotificationCount,
  updateBudgetItem,
  deleteBudgetItem
};