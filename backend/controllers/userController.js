const pool = require('../db/pool');

// Helper function for success responses
const handleSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    status: 'success',
    data
  });
};

// Helper function for error responses
const handleError = (res, error, statusCode = 500) => {
  console.error('Error:', error);
  res.status(statusCode).json({
    status: 'error',
    message: error.message || 'An error occurred'
  });
};

// Get a single user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return handleError(res, new Error('User not found'), 404);
    }
    handleSuccess(res, result.rows[0]);
  } catch (err) {
    handleError(res, err);
  }
};

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
            "FROM game_participants",
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
  try {
    const { username, email, password_hash } = req.body;

    // Basic validation
    if (!username || !email || !password_hash) {
      return res.status(400).json({
        status: 'error',
        message: 'Username, email, and password_hash are required'
      });
    }

    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [username, email, password_hash]
    );

    res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create user'
    });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.send('User deleted');
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
  getUserById,
};
