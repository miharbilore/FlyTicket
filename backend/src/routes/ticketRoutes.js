/**
 * routes/ticketRoutes.js
 * 
 * Biletlerle ilgili API uç noktalarını tanımlar.
 */

const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// POST /api/tickets - Yeni bilet satın al
router.get('/detail/:id', ticketController.getTicketDetail); // Detail daha spesifik olduğu için üstte olmalı
router.post('/', ticketController.bookTicket);
router.get('/:email', ticketController.getMyTickets);

module.exports = router;
