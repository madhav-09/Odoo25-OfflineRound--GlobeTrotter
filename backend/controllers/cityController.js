const { City, Trip, Activity, User } = require('../models');
const { cityTemplates } = require('../seeders/city-templates');

const getCities = async (req, res) => {
  try {
    const cities = await City.findAll({
      where: { tripId: null },
      attributes: ['id', 'name', 'country']
    });
    res.json({ cities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCityTemplates = async (req, res) => {
  try {
    res.json({ cities: cityTemplates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addCity = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { name, country, order, arrivalDate, departureDate } = req.body;
    
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    const trip = await Trip.findOne({ where: { id: tripId, userId: user.id } });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const city = await City.create({
      name,
      country,
      order,
      arrivalDate,
      departureDate,
      tripId
    });

    res.status(201).json({ city });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCityOrder = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { cities } = req.body;
    
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    const trip = await Trip.findOne({ where: { id: tripId, userId: user.id } });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    for (const cityData of cities) {
      await City.update(
        { order: cityData.order },
        { where: { id: cityData.id, tripId } }
      );
    }

    res.json({ message: 'City order updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCity = async (req, res) => {
  try {
    const { tripId, cityId } = req.params;
    
    const user = await User.findOne({ where: { cognitoId: req.user.cognitoId } });
    const trip = await Trip.findOne({ where: { id: tripId, userId: user.id } });
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const city = await City.findOne({ where: { id: cityId, tripId } });
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    await city.destroy();
    res.json({ message: 'City deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCities,
  getCityTemplates,
  addCity,
  updateCityOrder,
  deleteCity
};