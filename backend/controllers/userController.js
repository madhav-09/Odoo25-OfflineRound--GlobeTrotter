const { User, Trip, City, Activity } = require('../models');
const { Op } = require('sequelize');

const getAllUsers = async (req, res) => {
  try {
    const { search, filter } = req.query;
    
    let whereClause = { isActive: true };
    
    // Add search functionality
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { bio: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Add date filter for new users
    if (filter === 'new') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      whereClause.createdAt = { [Op.gte]: sixMonthsAgo };
    }
    
    const users = await User.findAll({
      where: whereClause,
      attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture', 'bio', 'createdAt', 'lastLoginAt'],
      include: [{
        model: Trip,
        as: 'trips',
        attributes: ['id', 'name', 'startDate', 'endDate'],
        include: [{
          model: City,
          as: 'cities',
          attributes: ['id', 'name', 'country']
        }]
      }],
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    
    // Calculate stats for each user
    const usersWithStats = users.map(user => {
      const trips = user.trips || [];
      const cities = trips.flatMap(trip => trip.cities || []);
      const countries = [...new Set(cities.map(city => city.country))];
      
      // Filter for active users if requested
      const tripsCount = trips.length;
      if (filter === 'active' && tripsCount <= 2) {
        return null;
      }
      
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio || 'Travel enthusiast exploring the world',
        tripsCount,
        citiesVisited: cities.length,
        countriesVisited: countries.length,
        joinDate: user.createdAt,
        lastActive: user.lastLoginAt,
        recentTrip: trips[0]?.name || 'No trips yet'
      };
    }).filter(Boolean);
    
    res.json({ users: usersWithStats });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture', 'bio', 'createdAt', 'lastLoginAt'],
      include: [{
        model: Trip,
        as: 'trips',
        attributes: ['id', 'name', 'startDate', 'endDate', 'isPublic'],
        include: [{
          model: City,
          as: 'cities',
          attributes: ['id', 'name', 'country']
        }]
      }]
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const trips = user.trips || [];
    const cities = trips.flatMap(trip => trip.cities || []);
    const countries = [...new Set(cities.map(city => city.country))];
    
    const userProfile = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      tripsCount: trips.length,
      citiesVisited: cities.length,
      countriesVisited: countries.length,
      joinDate: user.createdAt,
      lastActive: user.lastLoginAt,
      publicTrips: trips.filter(trip => trip.isPublic)
    };
    
    res.json({ user: userProfile });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById
};