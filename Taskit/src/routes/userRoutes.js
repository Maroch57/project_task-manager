// src/routes/userRoutes.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

const jwtAuth = require('../middleware/jwtAuth');
const tokenBlacklist = new Set(); // In-memory jwt token blacklist for demo 

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
        const user = await prisma.user.findUnique({
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

// Protected route (only accessible if authenticated)
router.get('/protected', jwtAuth, (req, res) => {
       res.status(200).json({ message: `Hello ${req.user.email}, this is a protected route.` });
   });

// User logout route
router.post('/logout', (req, res) => {
       const token = req.headers.authorization?.split(' ')[1];
   
       if (token) {
           // Optionally, invalidate the token
           tokenBlacklist.add(token); // Add the token to the blacklist
   
           // You can also handle token invalidation in a more robust way,
           // such as by storing invalidated tokens in a database with an expiration time.
           
           return res.status(200).json({ message: 'User logged out successfully.' });
       } else {
           return res.status(401).json({ message: 'No token provided.' });
       }

       logoutUser(token); // Blacklist the token
    res.status(200).json({ message: 'User logged out successfully.' });
   });
   
router.post('/signin', async (req, res) => {
       const { email, password } = req.body;
   
       try {
           // Find the user by email
           const user = await prisma.user.findUnique({
               where: { email: email }
           });
   
           // Check if user exists
           if (!user) {
               return res.status(401).json({ message: "Invalid email or password" });
           }
   
           // Compare the provided password with the stored hashed password
           const passwordMatch = await bcrypt.compare(password, user.password);
   
           if (!passwordMatch) {
               return res.status(401).json({ message: "Invalid email or password" });
           }
   
           // Respond with success message and user info (excluding password)
           res.status(200).json({
               message: "Signin successful",
               user: {
                   id: user.id,
                   email: user.email,
                   createdAt: user.createdAt
               }
           });
       } catch (error) {
           console.error("Error during signin:", error);
           res.status(500).json({ message: "Internal server error" });
       }
   });
// Get User profile route (protected)
router.get('/profile', jwtAuth ,async (req, res) => {
    const userId = req.user.id; // Get User ID from request after validation

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true } // Exclude password
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Respond with filtered user data (excluding sensitive info)
        const { password, ...filteredUser } = user; // Exclude password or any other sensitive fields
        res.json(filteredUser);

    } catch (error) {
        res.status(500).json({ message: 'Error retrieving User profile.', error: error.message });
    }
});

// Export the router
module.exports = router;