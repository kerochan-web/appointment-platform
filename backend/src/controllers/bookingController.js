const db = require('../db');

// @desc    Book a specific slot
// @route   POST /api/bookings
// @access  Private (User)
exports.bookSlot = async (req, res) => {
  const { time_slot_id } = req.body;
  const user_id = req.user.id; // From auth middleware

  if (!time_slot_id) {
    return res.status(400).json({ message: 'time_slot_id is required' });
  }

  try {
    // Attempt the insert.
    // The Database UNIQUE constraint on (time_slot_id) handles the race condition.
    const result = await db.query(
      'INSERT INTO bookings (user_id, time_slot_id) VALUES ($1, $2) RETURNING *',
      [user_id, time_slot_id]
    );

    res.status(201).json({
      message: 'Slot booked successfully',
      booking: result.rows[0]
    });

  } catch (err) {
    // Postgres error code '23505' is "unique_violation"
    if (err.code === '23505') {
      return res.status(409).json({ message: 'This slot is already booked.' });
    }
    
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT b.id, b.created_at, t.start_time, t.end_time 
       FROM bookings b
       JOIN time_slots t ON b.time_slot_id = t.id
       WHERE b.user_id = $1`,
      [req.user.id]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;
  const isAdminUser = req.user.role === 'admin'; // adjust if needed

  try {
    // First check if booking exists
    const bookingResult = await db.query(
      'SELECT * FROM bookings WHERE id = $1',
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const booking = bookingResult.rows[0];

    // If not admin, ensure booking belongs to user
    if (!isAdminUser && booking.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this booking.' });
    }

    // Delete booking
    await db.query(
      'DELETE FROM bookings WHERE id = $1',
      [bookingId]
    );

    res.status(200).json({ message: 'Booking deleted successfully.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get ALL bookings (Admin only)
// @route   GET /api/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT b.id, b.user_id, b.created_at, t.start_time, t.end_time 
       FROM bookings b
       JOIN time_slots t ON b.time_slot_id = t.id
       ORDER BY t.start_time ASC`
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
