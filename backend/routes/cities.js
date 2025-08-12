const express = require('express');
const { getCities, getCityTemplates, addCity, updateCityOrder, deleteCity } = require('../controllers/cityController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', getCities);
router.get('/templates', getCityTemplates);
router.post('/trip/:tripId', authenticateToken, addCity);
router.put('/trip/:tripId/order', authenticateToken, updateCityOrder);
router.delete('/trip/:tripId/:cityId', authenticateToken, deleteCity);

module.exports = router;