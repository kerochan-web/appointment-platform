const express = require('express');
const cors = require('cors');
const db = require('./db'); // Our pool helper

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Essential for parsing REST API JSON bodies

// --- Health Check / Connection Test ---
app.get('/api/health', async (req, res) => {
  try {
    // Query the DB to ensure the connection is alive
    const result = await db.query('SELECT NOW()');
    res.json({
      status: 'active',
      message: 'Server is breathing and DB is connected.',
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'DB connection failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
