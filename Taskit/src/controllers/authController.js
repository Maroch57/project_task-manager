// ./src/controllers/authController.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const prisma = new PrismaClient();

// Signup Logic
const signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword }
        });

        req.login(newUser, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Login after signup failed' });
            }
            return res.status(201).json({ message: 'User created successfully', user: newUser });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login Logic
/* const login = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        req.logIn(user, (err) => {
            if (err) return next(err);
            res.json({ message: 'Logged in successfully', user });
        });
    })(req, res, next);
};
*/
const login = async (req, res) => {
       const { email, password } = req.body;
   
       try {
           const user = await prisma.user.findUnique({
               where: { email }
           });
   
           if (!user || !(await bcrypt.compare(password, user.password))) {
               return res.status(401).json({ message: 'Invalid credentials' });
           }
   
           // Generate JWT token with user ID
           const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
               expiresIn: '1h', // or any duration you prefer
           });
   
           res.status(200).json({ message: 'Login successful', token });
       } catch (error) {
           console.error(error);
           res.status(500).json({ message: 'Login failed' });
       }
   };  
// Logout Logic
const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed', error: err });
        }
        res.json({ message: 'Logged out successfully' });
    });
};

// Google Authentication Logic
const googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

// Google Authentication Callback
const googleAuth = (req, res) => {
    res.json({ message: 'Logged in with Google successfully', user: req.user });
};

module.exports = {
    signup,
    login,
    logout,
    googleLogin,
    googleAuth
};
