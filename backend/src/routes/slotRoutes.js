const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Public: Users need to see what's available to book them
router.get('/', slotController.getAvailableSlots);

// Admin Only: Only Keiichi-level authority can open new slots
router.post('/', authenticateToken, isAdmin, slotController.createSlot);

module.exports = router;
