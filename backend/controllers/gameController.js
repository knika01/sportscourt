const pool = require('../db/pool');

// Fetch all games
const fetchAllGames = async (req, res) => {
    try {
      console.log('Fetching games...');  // Debugging
      const result = await pool.query('SELECT * FROM games');
      console.log('Games fetched:', result.rows);  // Debugging
      res.json(result.rows);
    } catch (err) {
      console.error('Database error:', err); // Log full error
      res.status(500).json({ error: 'Server Error', details: err.message });
    }
  };

// Create a new game
const createGame = async (req, res) => {
  const { title, location, date_time, skill_level, max_players, created_by } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO games (title, location, date_time, skill_level, max_players, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, location, date_time, skill_level, max_players, created_by]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a game
const deleteGame = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM games WHERE id = $1', [id]);
    res.send('Game deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  fetchAllGames,
  createGame,
  deleteGame,
};
