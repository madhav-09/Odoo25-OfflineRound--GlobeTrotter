const { Trip, City, Activity, User, SharedTrip } = require('../models');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const sequelize = require('../config/database');

const createTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { name, startDate, endDate, totalBudget, cities, description, currency, tripType } = req.body;
    const cognitoId = req.user.cognitoId;

    // Validate required fields
    if (!name || !startDate || !endDate) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'Missing required fields: name, startDate, endDate' 
      });
    }

    // Find user by cognitoId
    const user = await User.findOne({ 
      where: { cognitoId },
      transaction
    });
    
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: 'User not found' });
    }

    // Create trip with validation
    const tripData = {
      id: uuidv4(),
      name: name.trim(),
      description: description?.trim() || null,
      startDate,
      endDate,
      totalBudget: parseFloat(totalBudget) || 0,
      currency: currency || 'USD',
      tripType: tripType || 'solo',
      userId: user.id
    };

    const trip = await Trip.create(tripData, { transaction });

    // Add cities if provided
    if (cities && Array.isArray(cities) && cities.length > 0) {
      for (let i = 0; i < cities.length; i++) {
        const cityData = cities[i];
        
        // Validate city data
        if (!cityData.name || !cityData.country) {
          await transaction.rollback();
          return res.status(400).json({ 
            error: `City at index ${i} missing required fields: name, country` 
          });
        }

        const city = await City.create({
          id: uuidv4(),
          name: cityData.name.trim(),
          country: cityData.country.trim(),
          state: cityData.state?.trim() || null,
          order: i + 1,
          arrivalDate: cityData.arrivalDate || null,
          departureDate: cityData.departureDate || null,
          notes: cityData.notes?.trim() || null,
          estimatedBudget: parseFloat(cityData.estimatedBudget) || 0,
          tripId: trip.id
        }, { transaction });

        // Add activities if provided
        if (cityData.activities && Array.isArray(cityData.activities)) {
          for (let j = 0; j < cityData.activities.length; j++) {
            const activityData = cityData.activities[j];
            
            if (!activityData.name || !activityData.date) {
              await transaction.rollback();
              return res.status(400).json({ 
                error: `Activity at city ${i}, activity ${j} missing required fields: name, date` 
              });
            }

            await Activity.create({
              id: uuidv4(),
              name: activityData.name.trim(),
              description: activityData.description?.trim() || null,
              category: activityData.category || 'sightseeing',
              cost: parseFloat(activityData.cost) || 0,
              date: activityData.date,
              time: activityData.time || null,
              duration: parseInt(activityData.duration) || null,
              location: activityData.location?.trim() || null,
              priority: activityData.priority || 'medium',
              order: j + 1,
              cityId: city.id
            }, { transaction });
          }
        }
      }
    }

    await transaction.commit();

    // Fetch complete trip with cities and activities
    const completeTrip = await Trip.findByPk(trip.id, {
      include: [{
        model: City,
        as: 'cities',
        include: [{
          model: Activity,
          as: 'activities',
          order: [['order', 'ASC']]
        }],
        order: [['order', 'ASC']]
      }]
    });

    console.log('✅ Trip created successfully:', trip.id);
    res.status(201).json({ 
      success: true,
      trip: completeTrip,
      message: 'Trip created successfully'
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Create trip error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create trip',
      message: error.message 
    });
  }
};

const getUserTrips = async (req, res) => {
  try {
    const cognitoId = req.user.cognitoId;
    
    // Find user by cognitoId
    const user = await User.findOne({ where: { cognitoId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const trips = await Trip.findAll({
      where: { userId: user.id },
      include: [{
        model: City,
        as: 'cities',
        include: [{
          model: Activity,
          as: 'activities',
          order: [['order', 'ASC']]
        }],
        order: [['order', 'ASC']]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ trips });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const cognitoId = req.user.cognitoId;

    // Find user by cognitoId
    const user = await User.findOne({ where: { cognitoId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const trip = await Trip.findOne({
      where: { id, userId: user.id },
      include: [{
        model: City,
        as: 'cities',
        include: [{
          model: Activity,
          as: 'activities',
          order: [['order', 'ASC']]
        }],
        order: [['order', 'ASC']]
      }]
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({ trip });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const cognitoId = req.user.cognitoId;
    const { 
      name, 
      description,
      startDate, 
      endDate, 
      totalBudget, 
      totalSpent, 
      categoryBreakdown, 
      cities, 
      customBudgets,
      currency,
      tripType,
      status
    } = req.body;

    console.log('⚙️ Update trip request:', { id, fieldsToUpdate: Object.keys(req.body) });

    // Find user by cognitoId
    const user = await User.findOne({ 
      where: { cognitoId },
      transaction
    });
    
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: 'User not found' });
    }

    const trip = await Trip.findOne({ 
      where: { id, userId: user.id },
      transaction
    });
    
    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Trip not found or access denied' });
    }

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (totalBudget !== undefined) updateData.totalBudget = parseFloat(totalBudget) || 0;
    if (totalSpent !== undefined) updateData.totalSpent = parseFloat(totalSpent) || 0;
    if (categoryBreakdown !== undefined) updateData.categoryBreakdown = categoryBreakdown;
    if (customBudgets !== undefined) updateData.customBudgets = customBudgets;
    if (currency !== undefined) updateData.currency = currency;
    if (tripType !== undefined) updateData.tripType = tripType;
    if (status !== undefined) updateData.status = status;

    // Update trip details
    await trip.update(updateData, { transaction });

    // Update cities if provided
    if (cities && Array.isArray(cities)) {
      console.log('⚙️ Updating cities:', cities.length);
      
      // Get existing cities and activities for cleanup
      const existingCities = await City.findAll({ 
        where: { tripId: id },
        include: [{ model: Activity, as: 'activities' }],
        transaction
      });
      
      // Delete existing activities and cities
      for (const city of existingCities) {
        await Activity.destroy({ 
          where: { cityId: city.id },
          transaction
        });
      }
      
      await City.destroy({ 
        where: { tripId: id },
        transaction
      });

      // Add new cities and activities
      for (let i = 0; i < cities.length; i++) {
        const cityData = cities[i];
        
        if (!cityData.name || !cityData.country) {
          await transaction.rollback();
          return res.status(400).json({ 
            error: `City at index ${i} missing required fields: name, country` 
          });
        }

        const city = await City.create({
          id: uuidv4(),
          name: cityData.name.trim(),
          country: cityData.country.trim(),
          state: cityData.state?.trim() || null,
          order: i + 1,
          arrivalDate: cityData.arrivalDate || null,
          departureDate: cityData.departureDate || null,
          notes: cityData.notes?.trim() || null,
          estimatedBudget: parseFloat(cityData.estimatedBudget) || 0,
          actualSpent: parseFloat(cityData.actualSpent) || 0,
          tripId: trip.id
        }, { transaction });

        // Add activities
        if (cityData.activities && Array.isArray(cityData.activities)) {
          for (let j = 0; j < cityData.activities.length; j++) {
            const activityData = cityData.activities[j];
            
            if (!activityData.name || !activityData.date) {
              await transaction.rollback();
              return res.status(400).json({ 
                error: `Activity at city ${i}, activity ${j} missing required fields: name, date` 
              });
            }

            await Activity.create({
              id: uuidv4(),
              name: activityData.name.trim(),
              description: activityData.description?.trim() || null,
              category: activityData.category || 'sightseeing',
              cost: parseFloat(activityData.cost) || 0,
              date: activityData.date,
              time: activityData.time || null,
              duration: parseInt(activityData.duration) || null,
              location: activityData.location?.trim() || null,
              priority: activityData.priority || 'medium',
              isBooked: activityData.isBooked || false,
              bookingReference: activityData.bookingReference?.trim() || null,
              order: j + 1,
              cityId: city.id
            }, { transaction });
          }
        }
      }
    }

    await transaction.commit();

    // Fetch updated trip with all relations
    const updatedTrip = await Trip.findByPk(trip.id, {
      include: [{
        model: City,
        as: 'cities',
        include: [{
          model: Activity,
          as: 'activities',
          order: [['order', 'ASC']]
        }],
        order: [['order', 'ASC']]
      }]
    });

    console.log('✅ Trip updated successfully:', trip.id);
    res.json({ 
      success: true,
      trip: updatedTrip,
      message: 'Trip updated successfully'
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Update trip error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to update trip',
      message: error.message 
    });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const cognitoId = req.user.cognitoId;

    // Find user by cognitoId
    const user = await User.findOne({ where: { cognitoId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const trip = await Trip.findOne({ where: { id, userId: user.id } });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // First get all cities for this trip
    const existingCities = await City.findAll({ where: { tripId: id } });
    
    // Delete all activities for these cities
    for (const city of existingCities) {
      await Activity.destroy({ where: { cityId: city.id } });
    }
    
    // Then delete all cities
    await City.destroy({ where: { tripId: id } });

    // Delete trip
    await trip.destroy();

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ error: error.message });
  }
};

const shareTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const cognitoId = req.user.cognitoId;

    const user = await User.findOne({ where: { cognitoId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const trip = await Trip.findOne({ where: { id, userId: user.id } });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if already shared
    let sharedTrip = await SharedTrip.findOne({ where: { tripId: id } });
    
    if (!sharedTrip) {
      const shareToken = crypto.randomBytes(16).toString('hex');
      sharedTrip = await SharedTrip.create({
        tripId: id,
        shareToken,
        isPublic: true
      });
    }

    const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/shared/${sharedTrip.shareToken}`;
    res.json({ shareUrl, shareToken: sharedTrip.shareToken });
  } catch (error) {
    console.error('Share trip error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getSharedTrip = async (req, res) => {
  try {
    const { token } = req.params;

    const sharedTrip = await SharedTrip.findOne({
      where: { shareToken: token, isPublic: true },
      include: [{
        model: Trip,
        as: 'trip',
        include: [{
          model: City,
          as: 'cities',
          include: [{
            model: Activity,
            as: 'activities',
            order: [['order', 'ASC']]
          }],
          order: [['order', 'ASC']]
        }, {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName']
        }]
      }]
    });

    if (!sharedTrip) {
      return res.status(404).json({ error: 'Shared trip not found' });
    }

    // Increment view count
    await sharedTrip.increment('views');

    res.json({ trip: sharedTrip.trip, views: sharedTrip.views + 1 });
  } catch (error) {
    console.error('Get shared trip error:', error);
    res.status(500).json({ error: error.message });
  }
};

const copySharedTrip = async (req, res) => {
  try {
    const { token } = req.params;
    const cognitoId = req.user.cognitoId;

    const user = await User.findOne({ where: { cognitoId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const sharedTrip = await SharedTrip.findOne({
      where: { shareToken: token, isPublic: true },
      include: [{
        model: Trip,
        as: 'trip',
        include: [{
          model: City,
          as: 'cities',
          include: [{
            model: Activity,
            as: 'activities',
            order: [['order', 'ASC']]
          }],
          order: [['order', 'ASC']]
        }]
      }]
    });

    if (!sharedTrip) {
      return res.status(404).json({ error: 'Shared trip not found' });
    }

    const originalTrip = sharedTrip.trip;
    
    // Create new trip copy
    const newTrip = await Trip.create({
      id: uuidv4(),
      name: `${originalTrip.name} (Copy)`,
      startDate: originalTrip.startDate,
      endDate: originalTrip.endDate,
      totalBudget: originalTrip.totalBudget,
      userId: user.id
    });

    // Copy cities and activities
    for (const city of originalTrip.cities) {
      const newCity = await City.create({
        id: uuidv4(),
        name: city.name,
        country: city.country,
        order: city.order,
        arrivalDate: city.arrivalDate,
        departureDate: city.departureDate,
        tripId: newTrip.id
      });

      for (const activity of city.activities) {
        await Activity.create({
          id: uuidv4(),
          name: activity.name,
          description: activity.description,
          category: activity.category,
          cost: activity.cost,
          date: activity.date,
          time: activity.time,
          order: activity.order,
          cityId: newCity.id
        });
      }
    }

    res.json({ trip: newTrip, message: 'Trip copied successfully' });
  } catch (error) {
    console.error('Copy shared trip error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAllSharedTrips = async (req, res) => {
  try {
    const sharedTrips = await SharedTrip.findAll({
      where: { isPublic: true },
      include: [{
        model: Trip,
        as: 'trip',
        include: [{
          model: City,
          as: 'cities',
          attributes: ['name', 'country']
        }, {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName']
        }]
      }],
      order: [['views', 'DESC']]
    });

    const formattedTrips = sharedTrips.map(shared => ({
      id: shared.trip.id,
      name: shared.trip.name,
      description: shared.trip.description,
      author: `${shared.trip.user.firstName} ${shared.trip.user.lastName}`,
      authorAvatar: `${shared.trip.user.firstName[0]}${shared.trip.user.lastName[0]}`,
      startDate: shared.trip.startDate,
      endDate: shared.trip.endDate,
      cities: shared.trip.cities.map(city => city.name),
      views: shared.views,
      likes: 0, // TODO: implement likes
      shareToken: shared.shareToken
    }));

    res.json({ trips: formattedTrips });
  } catch (error) {
    console.error('Get all shared trips error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  shareTrip,
  getSharedTrip,
  copySharedTrip,
  getAllSharedTrips
};