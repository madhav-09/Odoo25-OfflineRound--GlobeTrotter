const express = require('express');
const { User, Trip } = require('../models');
const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalTrips = await Trip.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    
    const popularCities = [
      { name: 'Paris', count: 45 },
      { name: 'Tokyo', count: 38 },
      { name: 'New York', count: 32 },
      { name: 'London', count: 28 },
      { name: 'Dubai', count: 25 }
    ];

    res.json({
      stats: {
        totalUsers,
        totalTrips,
        activeUsers,
        popularCities
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id/toggle', async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.update({ isActive });
    res.json({ message: 'User status updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const analytics = {
      userMetrics: {
        newUsersThisMonth: 45,
        growthRate: 12.5,
        activeUsersToday: 23,
        retentionRate: 78,
        avgSessionTime: '12m 34s'
      },
      tripMetrics: {
        tripsCreatedToday: 8,
        avgTripsPerUser: 2.3,
        completedTrips: 156,
        avgTripDuration: 5.2,
        mostPopularMonth: 'July'
      },
      financialMetrics: {
        monthlyRevenue: 2450,
        revenueGrowth: 15.2,
        avgRevenuePerUser: 45.60,
        subscriptions: 89,
        conversionRate: 3.4
      },
      platformMetrics: {
        totalPageViews: 12450,
        bounceRate: 23.5,
        avgLoadTime: '1.2s',
        errorRate: 0.8,
        uptime: 99.9
      },
      geographicData: {
        topCountries: ['USA', 'India', 'UK', 'Canada', 'Australia'],
        topCities: ['New York', 'Mumbai', 'London', 'Toronto', 'Sydney']
      }
    };
    res.json({ analytics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;