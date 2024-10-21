const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for JWT handling

// Import controllers
const authController = require('../controllers/authController');

// Destructure functions from the controller
const { 
  signup, 
  login, 
  logout, 
  googleLogin, 
  googleAuth 
} = authController;

// Import individual function from `auth.js`
const { getUserDetails } = require('../controllers/auth');

// Email Authentication Routes
router.post('/signup', signup); // Use correct imports for functions
router.post('/login', login);
router.post('/logout', logout);

// Google Authentication Routes
router.get('/auth/google', googleLogin);
router.get('/auth/google/callback', googleAuth);

// Google Callback with JWT Handling
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Optionally set the JWT as a cookie
    res.cookie('token', token, { httpOnly: true });

    // Send the token in the response or redirect to a dashboard/home page
    res.json({ message: 'Logged in with Google successfully', token });
  }
);

// Route to fetch user details by ID
router.get('/user/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, createdAt: true } // Exclude sensitive fields
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

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
