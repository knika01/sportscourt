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

// Join a game
const joinGame = async (req, res) => {
  const { game_id, user_id } = req.body;

  try {
    // Check if game exists and has space
    const gameResult = await pool.query(
      `SELECT g.*, COUNT(gp.id) as current_players
       FROM games g
       LEFT JOIN game_participants gp ON g.id = gp.game_id
       WHERE g.id = $1
       GROUP BY g.id`,
      [game_id]
    );

    if (gameResult.rows.length === 0) {
      return handleError(res, new Error('Game not found'), 404);
    }

    const game = gameResult.rows[0];
    if (game.current_players >= game.max_players) {
      return handleError(res, new Error('Game is full'), 400);
    }

    // Add participant
    const result = await pool.query(
      'INSERT INTO game_participants (game_id, user_id) VALUES ($1, $2) RETURNING *',
      [game_id, user_id]
    );

    handleSuccess(res, result.rows[0], 201);
  } catch (err) {
    if (err.constraint === 'game_participants_game_id_user_id_key') {
      handleError(res, new Error('User already joined this game'), 400);
    } else {
      handleError(res, err);
    }
  }
};

// Leave a game
const leaveGame = async (req, res) => {
  const { game_id, user_id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM game_participants WHERE game_id = $1 AND user_id = $2 RETURNING *',
      [game_id, user_id]
    );

    if (result.rows.length === 0) {
      return handleError(res, new Error('Participant not found'), 404);
    }

    handleSuccess(res, { message: 'Successfully left the game' });
  } catch (err) {
    handleError(res, err);
  }
};

// Get all participants for a game with user details
const getGameParticipants = async (req, res) => {
  const { gameId } = req.params;
  try {
    const result = await pool.query(
      `SELECT gp.id, gp.user_id, gp.joined_at, u.first_name, u.last_name, u.username 
       FROM game_participants gp
       JOIN users u ON gp.user_id = u.id
       WHERE gp.game_id = $1
       ORDER BY gp.joined_at ASC`,
      [gameId]
    );
    handleSuccess(res, result.rows);
  } catch (err) {
    handleError(res, err);
  }
};

// Get games for a user
const getUserGames = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT g.*, gp.joined_at
       FROM games g
       JOIN game_participants gp ON g.id = gp.game_id
       WHERE gp.user_id = $1
       ORDER BY g.date_time ASC`,
      [user_id]
    );

    handleSuccess(res, result.rows);
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  joinGame,
  leaveGame,
  getGameParticipants,
  getUserGames
}; 