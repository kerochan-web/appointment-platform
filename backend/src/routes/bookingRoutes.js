const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Normal protected route
router.get('/my-bookings', authenticateToken, (req, res) => {
  res.json({ message: `Fetching bookings for user ${req.user.id}` });
});

// Admin-only route
router.get('/admin-bookings', authenticateToken, isAdmin, (req, res) => {
  res.json({ message: 'Fetching ALL bookings (admin access)' });
});

module.exports = router;
