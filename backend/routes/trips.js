const express = require('express');
const router = express.Router();
const { 
  createTrip, 
  getUserTrips, 
  getTripById, 
  updateTrip, 
  deleteTrip,
  shareTrip,
  getSharedTrip,
  copySharedTrip,
  getAllSharedTrips
} = require('../controllers/tripController');
const { authenticateToken } = require('../middleware/auth');

// Public routes for shared trips (no auth required)
router.get('/shared', getAllSharedTrips);
router.get('/shared/:token', getSharedTrip);
router.post('/shared/:token/copy', authenticateToken, copySharedTrip);

// Protected routes
router.post('/', authenticateToken, createTrip);
router.get('/', authenticateToken, getUserTrips);
router.get('/:id', authenticateToken, getTripById);
router.post('/:id/share', authenticateToken, shareTrip);
router.put('/:id', authenticateToken, updateTrip);
router.delete('/:id', authenticateToken, deleteTrip);

module.exports = router;