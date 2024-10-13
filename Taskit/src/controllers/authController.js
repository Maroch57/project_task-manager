const User = require('../models/User'); // Your User model
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Signup Logic
const signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findUnique({ where: { email } }); // Adjust this if using a different database
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            data: { email, password: hashedPassword }
        });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
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
    googleAuth
};
