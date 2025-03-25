const express = require('express');
const router = express.Router();
const gameParticipantController = require('../controllers/gameParticipantController');

// Input validation middleware
const validateJoinGame = (req, res, next) => {
  const { game_id, user_id } = req.body;
  
  if (!game_id || !user_id) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields: game_id and user_id'
    });
  }

  // Validate that IDs are numbers
  if (!Number.isInteger(Number(game_id)) || !Number.isInteger(Number(user_id))) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid game_id or user_id format'
    });
  }

  next();
};

// Routes
router.post('/', validateJoinGame, gameParticipantController.joinGame);
router.delete('/:gameId/user/:userId', gameParticipantController.leaveGame);
router.get('/:gameId/users', gameParticipantController.getGameParticipants);
router.get('/user/:userId', gameParticipantController.getUserGames);

module.exports = router; 