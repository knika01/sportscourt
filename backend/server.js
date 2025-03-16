// Import required libraries
const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Initialize the app and load environment variables
dotenv.config();
const app = express();

// Set up the PostgreSQL connection pool
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: {
    rejectUnauthorized: false, // This is necessary for Neon (or other cloud providers)
  },
});

// Middleware to parse JSON bodies
app.use(express.json());

// Example route to test database connection
app.get('/', async (req, res) => {
  try {
    // Test if the connection to the database is successful
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      message: 'Connected to the database!',
      time: result.rows[0].now,  // This will show the current time from PostgreSQL
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to connect to database' });
  }
});

// Example API route to fetch games (you can replace with your actual routes)
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');  // Adjust table name if needed
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Set up the server to listen on a specified port
const PORT = process.env.PORT || 5000;  // Default to port 5000 if not specified in .env
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
