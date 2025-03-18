require('dotenv').config();  // Ensure this is at the top
const { Pool } = require('pg');

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

module.exports = pool;