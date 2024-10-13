// ./src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { login, signup, googleLogin, logout, googleAuth } = require('../controllers/authController.js');

// Define routes
router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.get('/google', googleLogin); // Start Google authentication
router.get('/google/callback', googleAuth); // Callback after Google authentication

module.exports = router;
