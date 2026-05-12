const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { protect } = require('../middleware/auth');

router.get('/search', flightController.searchFlights);
router.get('/', flightController.getAllFlights);
router.get('/:id', flightController.getFlightById);
router.post('/', protect, flightController.createFlight); // Protected - admin only

module.exports = router;
