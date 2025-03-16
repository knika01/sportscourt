const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

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

async function testDbConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Connected to database:', result.rows[0].now);
  } catch (err) {
    console.error('Failed to connect to database', err);
  }
}

testDbConnection();
