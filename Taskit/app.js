const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const passportConfig = require('./middleware/passportConfig'); // Import passport configuration
const authRoutes = require('./routes/authRoutes');
const jwtAuth = require('./middleware/jwtAuth');

dotenv.config();

// import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes'); // Include user routes

const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes); 

// Protected route example
app.get('/profile', jwtAuth, (req, res) => {
       res.json({ message: `Welcome, ${req.user.email}` });
   });
   
//export app.js
module.exports = app;
