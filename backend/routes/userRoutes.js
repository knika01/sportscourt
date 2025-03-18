const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.fetchAllUsers);  // Matches GET /users
router.get('/', userController.fetchAllPlayers);  // Matches GET /users
router.get('/', userController.groupAllPlayers);  // Matches GET /users
router.post('/', userController.createUser);    // Matches POST /users
router.delete('/:id', userController.deleteUser); // Matches DELETE /users/:id

module.exports = router;
