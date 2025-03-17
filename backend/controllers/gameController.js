const pool = require('../db');

// Fetch all games
const fetchAllGames = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new game
const createGame = async (req, res) => {
  const { name, genre, release_date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO games (name, genre, release_date) VALUES ($1, $2, $3) RETURNING *',
      [name, genre, release_date]
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