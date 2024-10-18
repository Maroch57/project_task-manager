// ./src/routes/authRoutes.js

const express = require('express');
const passport = require('passport');
//const { signup, login, logout } = require('../controllers/authController');
const router = express.Router();
//const { login, signup, googleLogin, logout, googleAuth } = require('../controllers/authController.js');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const {
       signup,
       login,
       logout,
       googleLogin,
       googleAuth
     } = require('../controllers/authController.js');

// Email Authentication Routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// Google Authentication Routes
router.get('/auth/google', googleLogin);
router.get('/auth/google/callback', googleAuth);

//router.get(
 //   '/google',
 ///   passport.authenticate('google', { scope: ['profile', 'email'] })
//);

router.get(
       '/auth/google/callback',
       passport.authenticate('google', { session: false }), // Ensure session handling aligns with your use case
       (req, res) => {
           // Create a JWT token
           const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
   
           // Optional: Set cookie with JWT
           res.cookie('token', token, { httpOnly: true });
   
           // Send the token in the response or redirect as needed
           res.json({ message: 'Logged in with Google successfully', token });
           
           // Redirect to a dashboard or home page after successful login
           // res.redirect('/dashboard'); // Uncomment this line if you prefer to redirect
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