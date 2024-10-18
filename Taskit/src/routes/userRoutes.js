// src/routes/userRoutes.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Middleware to validate request body
const validateSignup = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    next();
};

// User signup route
router.post('/signup', validateSignup, async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if User already exists
        const existingUser = await prisma.User.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new User
        const newUser = await prisma.User.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({ message: 'User signed up successfully!', email: newUser.email });
    } catch (error) {
        res.status(500).json({ message: 'Error signing up User.', error: error.message });
    }
});

// User login route
router.post('/login', validateSignup, async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find User
        const user = await prisma.User.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'User logged in successfully!', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in User.', error: error.message });
    }
});

// Get User profile route (protected)
router.get('/profile', async (req, res) => {
    const userId = req.user.id; // Get User ID from request after validation

    try {
        const user = await prisma.User.findUnique({
            where: { id: userId },
            select: { email: true } // Exclude password
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving User profile.', error: error.message });
    }
});

// Export the router
module.exports = router;
