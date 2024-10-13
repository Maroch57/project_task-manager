// ./src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { login, signup, logout } = require('../controllers/authController.js');

// Define routes
router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);

module.exports = router;
