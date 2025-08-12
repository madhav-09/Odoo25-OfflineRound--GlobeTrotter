const { Activity, City, Trip, User } = require('../models');

const addActivity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { name, description, category, cost, date, time, order } = req.body;
    
    const city = await City.findOne({
      where: { id: cityId },
      include: [{ 
        model: Trip, 
        as: 'trip',
        include: [{ model: User, as: 'user' }]
      }]
    });
    
    if (!city || city.trip.user.cognitoId !== req.user.cognitoId) {
      return res.status(404).json({ error: 'City not found' });
    }

    const activity = await Activity.create({
      name,
      description,
      category,
      cost,
      date,
      time,
      order,
      cityId
    });

    res.status(201).json({ activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    
    const activity = await Activity.findOne({
      where: { id: activityId },
      include: [{
        model: City,
        as: 'city',
        include: [{
          model: Trip,
          as: 'trip',
          include: [{ model: User, as: 'user' }]
        }]
      }]
    });
    
    if (!activity || activity.city.trip.user.cognitoId !== req.user.cognitoId) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    await activity.update(req.body);
    res.json({ activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    
    const activity = await Activity.findOne({
      where: { id: activityId },
      include: [{
        model: City,
        as: 'city',
        include: [{
          model: Trip,
          as: 'trip',
          include: [{ model: User, as: 'user' }]
        }]
      }]
    });
    
    if (!activity || activity.city.trip.user.cognitoId !== req.user.cognitoId) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    await activity.destroy();
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBudgetBreakdown = async (req, res) => {
  try {
    const { tripId } = req.params;
    
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    const trip = await Trip.findOne({ where: { id: tripId, userId: user.id } });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const activities = await Activity.findAll({
      include: [{
        model: City,
        as: 'city',
        where: { tripId }
      }]
    });

    const breakdown = activities.reduce((acc, activity) => {
      const category = activity.category;
      acc[category] = (acc[category] || 0) + parseFloat(activity.cost);
      return acc;
    }, {});

    const total = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);
    const dailyAverage = activities.length > 0 ? total / Math.max(1, new Set(activities.map(a => a.date?.toDateString())).size) : 0;

    res.json({ breakdown, total, dailyAverage, activityCount: activities.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getActivityTemplates = async (req, res) => {
  try {
    const { activityTemplates } = require('../seeders/activities');
    const { category, search } = req.query;
    
    let filtered = activityTemplates;
    
    if (category && category !== 'all') {
      filtered = filtered.filter(activity => activity.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.name.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower)
      );
    }
    
    res.json({ activities: filtered });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addActivity,
  updateActivity,
  deleteActivity,
  getBudgetBreakdown,
  getActivityTemplates
};