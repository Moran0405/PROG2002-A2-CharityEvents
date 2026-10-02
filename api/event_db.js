// ============================================================
// event_db.js
// Database connection module for the charity events website.
// Creates a MySQL connection pool for the charityevents_db
// database and exports it for use by the API endpoints.
// ============================================================

const mysql = require('mysql2/promise');

// Connection pool configuration.
// NOTE: Update 'user' and 'password' to match your local MySQL setup.
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'charityevents_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
