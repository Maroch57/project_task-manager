// ./src/routes/authRoutes.js

const express = require('express');
const passport = require('passport');
const { signup, login, logout } = require('../controllers/authController');
const router = express.Router();
const { login, signup, googleLogin, logout, googleAuth } = require('../controllers/authController.js');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library


// Email Authentication Routes
router.post('/signup', signup);
router.post('/login', login);

// Google Authentication Routes
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        // Create a JWT token
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token in the response
        res.json({ message: 'Logged in with Google successfully', token });
        res.cookie('token', token, { httpOnly: true }); // Set cookie with JWT (optional)

        // Redirect to a dashboard or home page after successful login
        res.redirect('/dashboard'); // Adjust this path based on your routing and
    }
);

// Logout Route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed', error: err });
        }
        res.redirect('/'); // Redirect after logout
    });
});

module.exports = router;
