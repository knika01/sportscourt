const pool = require('../db/pool');

// Helper function for consistent error responses
const handleError = (res, error, status = 500) => {
  console.error('Error:', error);
  res.status(status).json({
    status: 'error',
    message: error.message || 'Internal Server Error'
  });
};

// Helper function for successful responses
const handleSuccess = (res, data, status = 200) => {
  res.status(status).json({
    status: 'success',
    data
  });
};

// Fetch all games with optional filters
const fetchAllGames = async (req, res) => {
  try {
    const { location, skill_level, date } = req.query;
    let query = 'SELECT * FROM games';
    const params = [];
    let paramCount = 1;

    if (location || skill_level || date) {
      query += ' WHERE';
      if (location) {
        query += ` location ILIKE $${paramCount}`;
        params.push(`%${location}%`);
        paramCount++;
      }
      if (skill_level) {
        query += location ? ' AND' : '';
        query += ` skill_level = $${paramCount}`;
        params.push(skill_level);
        paramCount++;
      }
      if (date) {
        query += (location || skill_level) ? ' AND' : '';
        query += ` DATE(date_time) = $${paramCount}`;
        params.push(date);
      }
    }

    query += ' ORDER BY date_time ASC';
    const result = await pool.query(query, params);
    handleSuccess(res, result.rows);
  } catch (err) {
    handleError(res, err);
  }
};

// Create a new game
const createGame = async (req, res) => {
  const { title, sport, location, date_time, skill_level, max_players, created_by, description } = req.body;

  // Input validation
  if (!title || !sport || !location || !date_time || !skill_level || !max_players || !created_by) {
    return handleError(res, new Error('Missing required fields'), 400);
  }

  // Validate date format
  const gameDate = new Date(date_time);
  if (isNaN(gameDate.getTime())) {
    return handleError(res, new Error('Invalid date format'), 400);
  }

  // Validate max_players
  if (max_players < 2) {
    return handleError(res, new Error('Maximum players must be at least 2'), 400);
  }

  try {
    const result = await pool.query(
      `INSERT INTO games (title, sport, location, date_time, skill_level, max_players, created_by, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, sport, location, gameDate, skill_level, max_players, created_by, description]
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
  const { title, sport, location, date_time, skill_level, max_players, description } = req.body;

  try {
    // Check if game exists
    const gameExists = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
    if (gameExists.rows.length === 0) {
      return handleError(res, new Error('Game not found'), 404);
    }

    const result = await pool.query(
      `UPDATE games 
       SET title = COALESCE($1, title),
           sport = COALESCE($2, sport),
           location = COALESCE($3, location),
           date_time = COALESCE($4, date_time),
           skill_level = COALESCE($5, skill_level),
           max_players = COALESCE($6, max_players),
           description = COALESCE($7, description)
       WHERE id = $8
       RETURNING *`,
      [title, sport, location, date_time, skill_level, max_players, description, id]
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

// Get games for a specific user
const getUserGames = async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
      SELECT g.* 
      FROM games g
      JOIN game_participants gp ON g.id = gp.game_id
      WHERE gp.user_id = $1
      ORDER BY g.date_time DESC
    `;
    const result = await pool.query(query, [userId]);
    
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching user games:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user games'
    });
  }
};

// Get games where user is the host
const getUserHostedGames = async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
      SELECT * FROM games
      WHERE created_by = $1
      ORDER BY date_time DESC
    `;
    const result = await pool.query(query, [userId]);
    
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching user hosted games:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user hosted games'
    });
  }
};

module.exports = {
  fetchAllGames,
  createGame,
  getGameById,
  updateGame,
  deleteGame,
  getUserGames,
  getUserHostedGames
};
