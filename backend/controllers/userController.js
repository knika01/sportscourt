const pool = require('../db/pool');

// Fetch all users
const fetchAllUsers = async (req, res) => {
    try {
      console.log('Fetching users...');  // Debugging
      const result = await pool.query('SELECT * FROM users');
      console.log('Users fetched:', result.rows);  // Debugging
      res.json(result.rows);
    } catch (err) {
      console.error('Database error:', err); // Log full error
      res.status(500).json({ error: 'Server Error', details: err.message });
    }
  };

// Fetch all users in a specified game
const fetchAllPlayers = async (req, res) => {
    try {
        console.log('Fetching players...');
        const result = pool.query(
            "SELECT DISTINCT t1.user_id AS user1, t2.user_id AS user2",
            "FROM game_participants t1",
            "JOIN game_participants t2 ON, t1.game_id = t2.game_id",
            "WHERE t1.user_id != t2.user_id",
            "ORDER BY t1.user_id t2.user_id)"
        ); // query to find all user_ids that share the same game_id
        console.log('Users fetched:', result.rows);
        res.json(result.rows);
    } catch(err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Server Error', details: err.message});
    }
};

// Group users by game_id
const groupAllPlayers = async (req, res) => {
    try {
        console.log('Fetching players...');
        const result = pool.query(
            "SELECT game_id, GROUP_CONCAT(user_id ORDER BY user_id) AS users",
            "FROM your_table",
            "GROUP BY game_id",
        ); // query to group users by game_id
        console.log('Users fetched:', result.rows);
        res.json(result.rows);
    } catch(err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Server Error', details: err.message});
    }
};

// Create a new user
const createUser = async (req, res) => {
  const { username, email, password_hash, created_at } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, password_hash, created_at]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.send('Game deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  fetchAllUsers,
  fetchAllPlayers,
  groupAllPlayers,
  createUser,
  deleteUser,
};
