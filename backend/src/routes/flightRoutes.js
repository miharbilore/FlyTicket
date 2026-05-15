/**
 * routes/flightRoutes.js
 * 
 * Uçuşlarla ilgili API uç noktalarını tanımlar.
 */

const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

// GET /api/flights - Uçuş arama ve listeleme
router.get('/', flightController.getFlights);

// GET /api/flights/:id - Tek bir uçuş detayı
router.get('/:id', flightController.getFlightById);

module.exports = router;
