const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.fetchAllUsers);  // Matches GET /users
router.get('/players', userController.fetchAllPlayers);  // Matches GET /users/players
router.get('/groups', userController.groupAllPlayers);  // Matches GET /users/groups
router.get('/:id', userController.getUserById);  // Matches GET /users/:id
router.post('/', userController.createUser);    // Matches POST /users
router.delete('/:id', userController.deleteUser); // Matches DELETE /users/:id

module.exports = router;
