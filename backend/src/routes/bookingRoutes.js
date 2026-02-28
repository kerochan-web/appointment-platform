const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// --- User Endpoints ---

// GET /api/my-bookings
router.get('/my-bookings', authenticateToken, bookingController.getUserBookings);

// POST /api/bookings
router.post('/bookings', authenticateToken, bookingController.bookSlot);

// DELETE /api/bookings/:id (Handled by a shared controller that checks ownership or admin)
router.delete('/bookings/:id', authenticateToken, bookingController.deleteBooking);

// --- Admin Endpoints ---

// GET /api/bookings (Admin sees everything)
router.get('/bookings', authenticateToken, isAdmin, bookingController.getAllBookings);

module.exports = router;
