const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const auth = require('../middleware/auth');

// Input validation middleware
const validateGameInput = (req, res, next) => {
  const { title, location, date_time, skill_level, max_players } = req.body;
  
  if (!title || !location || !date_time || !skill_level || !max_players) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields'
    });
  }

  // Validate date format
  const gameDate = new Date(date_time);
  if (isNaN(gameDate.getTime())) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid date format'
    });
  }

  // Validate max_players
  if (max_players < 2) {
    return res.status(400).json({
      status: 'error',
      message: 'Maximum players must be at least 2'
    });
  }

  next();
};

// Public routes
router.get('/search', gameController.fetchAllGames);
router.get('/hosted/:userId', gameController.getUserHostedGames);
router.get('/joined/:userId', gameController.getUserJoinedGames);

// Protected routes
router.use(auth);
router.post('/', validateGameInput, gameController.createGame);
router.get('/:id', gameController.getGameById);
router.put('/:id', validateGameInput, gameController.updateGame);
router.delete('/:id', gameController.deleteGame);

module.exports = router;
