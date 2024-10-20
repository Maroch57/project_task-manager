// ./src/controllers/auth.js

const { Prisma, PrismaClient } = require('@prisma/client');
const User = require('../models/User'); // Your User model
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient(); //instatiate Prisma Client

// In-memory token blacklist (can be replaced with Redis or DB for production)
const tokenBlacklist = new Set();

// Signup Logic
const signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await prisma.User.findUnique({ where: { email } }); // Check if the user already exists
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
         // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = await Prisma.User.create({
            data: { email, password: hashedPassword }
        });
       // Log in the user (if you want to log in immediately after signup)
req.login(newUser, (err) => {
       if (err) {
           return res.status(500).json({ message: 'Login after signup failed' });
       }
       return res.status(201).json({ message: 'User created successfully', user: newUser });
   });
   } catch (error) {
       console.error(error); // Logging the error for debugging
       res.status(500).json({ message: 'Server error' });
   }

// Login Logic for Email
const login = async (req, res, next) => {
       const { email, password } = req.body; // Extract email and password from the request body
   
       try {
           // Find the user by email
           const user = await prisma.user.findUnique({
               where: { email },
           });
   
           // Check if the user exists
           if (!user) {
               return res.status(401).json({ message: 'Invalid credentials' });
           }
   
           // Compare the provided password with the stored hashed password
           const isMatch = await bcrypt.compare(password, user.password);
           if (!isMatch) {
               return res.status(401).json({ message: 'Invalid credentials' });
           }
   
           // Log in the user using Passport
           req.logIn(user, (err) => {
               if (err) return next(err);
               return res.status(200).json({ message: 'Logged in successfully', user });
           });
       } catch (error) {
           console.error(error); // Log the error for debugging
           return res.status(500).json({ message: 'Server error' });
       }
   };
   // Get user  Info logic
   const getUserDetails = async (userId) => {
       try {
           // Fetch the user from the database using the userId
           const user = await prisma.user.findUnique({
               where: { id: Number(userId) }, // Ensure userId is a number
               select: {
                   id: true,
                   email: true,
                   createdAt: true,
                   // Exclude sensitive information like password
               },
           });
           return user;
       } catch (error) {
           console.error('Error fetching user details:', error);
           throw error; // Propagate error for handling in the route
       }
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

// Middleware to check if token is blacklisted
const authMiddleware = (req, res, next) => {
       const token = req.headers.authorization?.split(' ')[1];
   
       if (!token) {
           return res.status(401).json({ message: 'No token provided.' });
       }
   
       if (tokenBlacklist.has(token)) {
           return res.status(401).json({ message: 'Token has been invalidated. Please log in again.' });
       }
   
       try {
           const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
           req.user = decoded; // Attach user info to the request object
           next();
       } catch (error) {
           return res.status(401).json({ message: 'Invalid token.' });
       }
   };
   
   // Function to blacklist tokens (for logout functionality)
   const logoutUser = (token) => {
       tokenBlacklist.add(token);
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