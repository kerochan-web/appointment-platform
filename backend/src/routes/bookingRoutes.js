const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// This route is now protected.
// Only users with a valid JWT can see "their" bookings.
router.get('/my-bookings', auth, (req, res) => {
  // Because of the middleware, we have access to req.user.id here!
  res.json({ message: `Fetching bookings for user ${req.user.id}` });
});

module.exports = router;
