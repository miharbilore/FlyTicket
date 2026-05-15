/**
 * routes/adminRoutes.js
 * 
 * Sadece admin yetkisi olanların erişebileceği rotalar.
 * Tüm rotalar 'protect' middleware'i ile korunur.
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Tüm admin rotalarını korumaya alıyoruz
router.use(protect);

// Uçuş yönetimi
router.post('/flights', adminController.createFlight);
router.put('/flights/:id', adminController.updateFlight);
router.delete('/flights/:id', adminController.deleteFlight);

// Bilet yönetimi
router.get('/tickets', adminController.getAllTickets);

module.exports = router;
