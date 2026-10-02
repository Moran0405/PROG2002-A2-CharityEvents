// ============================================================
// server.js
// Express server for the charity events website RESTful API.
// Provides the endpoints required by the home page.
// ============================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./event_db');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow the client-side website to call the API
app.use(express.json());

// Serve the client-side website (static files)
app.use(express.static(path.join(__dirname, '..', 'clientside')));

// ------------------------------------------------------------
// GET /api/events
// Returns all active, upcoming charity events (for the home page).
// Events with a date before today or with a 'suspended' status
// are excluded.
// ------------------------------------------------------------
app.get('/api/events', async (req, res) => {
  try {
    const sql = `
      SELECT e.event_id, e.event_name, e.event_date, e.event_time,
             e.location_venue, e.location_city, e.ticket_price,
             e.goal_amount, e.progress_amount,
             c.category_name
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      WHERE e.event_status = 'active'
        AND e.event_date >= CURDATE()
      ORDER BY e.event_date ASC
    `;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/events error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve events.' });
  }
});

// ------------------------------------------------------------
// GET /api/categories
// Returns all event categories (for the search page filter).
// ------------------------------------------------------------
app.get('/api/categories', async (req, res) => {
  try {
    const sql = 'SELECT category_id, category_name FROM categories ORDER BY category_name ASC';
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/categories error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Charity Events API server running at http://localhost:${PORT}`);
});
