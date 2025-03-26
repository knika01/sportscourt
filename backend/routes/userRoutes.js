const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Protected routes
router.use(auth);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);

router.get('/', userController.fetchAllUsers);  // Matches GET /users
router.get('/players', userController.fetchAllPlayers);  // Matches GET /users/players
router.get('/groups', userController.groupAllPlayers);  // Matches GET /users/groups
router.post('/', userController.createUser);    // Matches POST /users
router.delete('/:id', userController.deleteUser); // Matches DELETE /users/:id

module.exports = router;
