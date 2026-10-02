// ============================================================
// server.js
// Express server for the charity events website RESTful API.
// Provides endpoints for the home page, search page and
// event details page.
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

// ------------------------------------------------------------
// GET /api/events/search
// Searches active events by date, location and/or category.
// All three criteria are optional and can be combined.
// Query parameters:
//   date     (YYYY-MM-DD) - exact event date
//   location (string)     - matches city or venue name
//   category (number)     - category_id
// ------------------------------------------------------------
app.get('/api/events/search', async (req, res) => {
  try {
    const { date, location, category } = req.query;

    const conditions = ["e.event_status = 'active'"];
    const params = [];

    if (date) {
      conditions.push('e.event_date = ?');
      params.push(date);
    }
    if (location) {
      conditions.push('(e.location_city LIKE ? OR e.location_venue LIKE ?)');
      const like = `%${location}%`;
      params.push(like, like);
    }
    if (category) {
      conditions.push('e.category_id = ?');
      params.push(category);
    }

    const sql = `
      SELECT e.event_id, e.event_name, e.event_date, e.event_time,
             e.location_venue, e.location_city, e.ticket_price,
             e.goal_amount, e.progress_amount,
             c.category_name
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY e.event_date ASC
    `;
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('GET /api/events/search error:', err.message);
    res.status(500).json({ error: 'Failed to search events.' });
  }
});

// ------------------------------------------------------------
// GET /api/events/:id
// Returns the full details of a single event (including the
// organisation information) for the event details page.
// NOTE: Must be declared AFTER /api/events/search so that
// "search" is not treated as an :id.
// ------------------------------------------------------------
app.get('/api/events/:id', async (req, res) => {
  try {
    const sql = `
      SELECT e.event_id, e.event_name, e.event_date, e.event_time,
             e.location_venue, e.location_city,
             e.event_description, e.purpose,
             e.ticket_price, e.goal_amount, e.progress_amount,
             e.event_status,
             c.category_name,
             o.org_name, o.org_description, o.contact_email,
             o.contact_phone, o.website
      FROM events e
      JOIN categories c ON e.category_id = c.category_id
      JOIN organisations o ON e.organisation_id = o.organisation_id
      WHERE e.event_id = ?
    `;
    const [rows] = await db.query(sql, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /api/events/:id error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve event details.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Charity Events API server running at http://localhost:${PORT}`);
});
