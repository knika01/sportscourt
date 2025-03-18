const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/', gameController.fetchAllGames);  // Matches GET /games
router.post('/', gameController.createGame);    // Matches POST /games
router.delete('/:id', gameController.deleteGame); // Matches DELETE /games/:id

module.exports = router;
