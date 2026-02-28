const db = require('../db');

// @desc    Create a new time slot
// @route   POST /api/slots
// @access  Admin only
exports.createSlot = async (req, res) => {
  const { start_time, end_time } = req.body;

  // Basic validation: End time must be after start time
  if (new Date(start_time) >= new Date(end_time)) {
    return res.status(400).json({ message: 'End time must be after start time' });
  }

  try {
    // req.user.id comes from your authenticateToken middleware
    const result = await db.query(
      'INSERT INTO time_slots (start_time, end_time, created_by) VALUES ($1, $2, $3) RETURNING *',
      [start_time, end_time, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get ONLY available slots
// @route   GET /api/slots
// @access  Public
exports.getAvailableSlots = async (req, res) => {
  try {
    // This is the "infer from bookings" part of your blueprint.
    // We only want slots that DO NOT have a matching entry in the bookings table.
    const query = `
      SELECT t.* FROM time_slots t
      LEFT JOIN bookings b ON t.id = b.time_slot_id
      WHERE b.id IS NULL
      ORDER BY t.start_time ASC;
    `;
    
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
