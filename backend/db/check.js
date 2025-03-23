require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function checkDatabase() {
  try {
    // Check users
    const usersResult = await pool.query('SELECT * FROM users');
    console.log('\nUsers:');
    console.log(usersResult.rows);

    // Check games
    const gamesResult = await pool.query('SELECT * FROM games');
    console.log('\nGames:');
    console.log(gamesResult.rows);
  } catch (err) {
    console.error('Error checking database:', err);
  } finally {
    await pool.end();
  }
}

checkDatabase(); 