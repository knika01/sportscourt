const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const cors = require('cors');

// Import game routes
const gameRoutes = require('./routes/gameRoutes');  // Ensure this is correct

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
app.use(cors());  // Enable CORS if you need to interact with frontend on different domains

// Test route to verify database connection
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      message: 'Connected to the database!',
      time: result.rows[0].now,  // Display the current time from PostgreSQL
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to connect to database' });
  }
});

// User routes (you can modify as needed)
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');  // Fetch all users from the database
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Register game routes
app.use('/games', gameRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));