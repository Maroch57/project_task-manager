// ./src/controllers/authcontroller.js

const { Prisma } = require('@prisma/client');
const User = require('../models/User'); // Your User model
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Signup Logic
const signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findUnique({ where: { email } }); // Check if the user already exists
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
         // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = await Prisma.user.create({
            data: { email, password: hashedPassword }
        });
        // Log in the user (if you want to log in immediately after signup)
        req.login(newUser, (err) => {
              if (err) {
                  return res.status(500).json({ message: 'Login after signup failed' });
              }
                  return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
       console.error(error); // Logging the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
};

// Login Logic for Email
const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        req.logIn(user, (err) => {
            if (err) return next(err);
            res.json({ message: 'Logged in successfully', user });
        });
    })(req, res, next);
};

// Logout Logic
const logout = (req, res) => {
       req.logout((err) => {
           if (err) {
               return res.status(500).json({ message: 'Logout error', err });
           }
           res.json({ message: 'Logged out successfully' });
       });
   };

// Google Authentication Callback
const googleAuth = (req, res) => {
    res.json({ message: 'Logged in with Google successfully', user: req.user });
};

// Google Authentication Logic
const googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

module.exports = {
    signup,
    login,
    googleLogin,
    googleAuth,
    logout
}}; 