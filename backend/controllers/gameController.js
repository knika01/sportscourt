const pool = require('../db/pool');

const handleError = (res, error, status = 500) => {
  console.error('Error:', error);
  res.status(status).json({
    status: 'error',
    message: error.message || 'Internal Server Error'
  });
};

const handleSuccess = (res, data, status = 200) => {
  res.status(status).json({
    status: 'success',
    data
  });
};

// Fetch all games
const fetchAllGames = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games ORDER BY date_time ASC');
    handleSuccess(res, result.rows);
  } catch (err) {
    handleError(res, err);
  }
};

// Create a new game
const createGame = async (req, res) => {
  const {
    title,
    sport,
    location,
    latitude,
    longitude,
    date_time,
    skill_level,
    max_players,
    created_by,
    description
  } = req.body;

  if (!title || !sport || !location || latitude == null || longitude == null || !date_time || !skill_level || !max_players || !created_by) {
    return handleError(res, new Error('Missing required fields'), 400);
  }

  const gameDate = new Date(date_time);
  if (isNaN(gameDate.getTime())) {
    return handleError(res, new Error('Invalid date format'), 400);
  }

  if (max_players < 2) {
    return handleError(res, new Error('Maximum players must be at least 2'), 400);
  }

  try {
    const result = await pool.query(
      `INSERT INTO games (title, sport, location, latitude, longitude, date_time, skill_level, max_players, created_by, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [title, sport, location, latitude, longitude, gameDate, skill_level, max_players, created_by, description]
    );
    handleSuccess(res, result.rows[0], 201);
  } catch (err) {
    handleError(res, err);
  }
};

// Get a single game by ID
const getGameById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return handleError(res, new Error('Game not found'), 404);
    }
    handleSuccess(res, result.rows[0]);
  } catch (err) {
    handleError(res, err);
  }
};

// Update a game
const updateGame = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    sport,
    location,
    latitude,
    longitude,
    date_time,
    skill_level,
    max_players,
    description
  } = req.body;

  try {
    const gameExists = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
    if (gameExists.rows.length === 0) {
      return handleError(res, new Error('Game not found'), 404);
    }

    const result = await pool.query(
      `UPDATE games 
       SET title = COALESCE($1, title),
           sport = COALESCE($2, sport),
           location = COALESCE($3, location),
           latitude = COALESCE($4, latitude),
           longitude = COALESCE($5, longitude),
           date_time = COALESCE($6, date_time),
           skill_level = COALESCE($7, skill_level),
           max_players = COALESCE($8, max_players),
           description = COALESCE($9, description)
       WHERE id = $10
       RETURNING *`,
      [title, sport, location, latitude, longitude, date_time, skill_level, max_players, description, id]
    );
    handleSuccess(res, result.rows[0]);
  } catch (err) {
    handleError(res, err);
  }
};

// Delete a game
const deleteGame = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM games WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return handleError(res, new Error('Game not found'), 404);
    }
    handleSuccess(res, { message: 'Game deleted successfully' });
  } catch (err) {
    handleError(res, err);
  }
};

// Get games where user is the host
const getUserHostedGames = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT * FROM games WHERE created_by = $1 ORDER BY date_time DESC`,
      [userId]
    );
    handleSuccess(res, result.rows);
  } catch (err) {
    handleError(res, err);
  }
};

// Get games where user is a participant
const getUserJoinedGames = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT g.* FROM games g
       JOIN game_participants gp ON g.id = gp.game_id
       WHERE gp.user_id = $1
       ORDER BY g.date_time DESC`,
      [userId]
    );
    handleSuccess(res, result.rows);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  fetchAllGames,
  createGame,
  getGameById,
  updateGame,
  deleteGame,
  getUserHostedGames,
  getUserJoinedGames
};
