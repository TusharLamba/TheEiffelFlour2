const express = require('express');
// Router middleware in express
const router = express.Router();
const usersController = require('../controller/users');

router.post('/register', usersController.handleSignUp);
router.post('/login', usersController.handleLogin);

module.exports = router;