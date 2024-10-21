// app.js
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');//.env import and config
dotenv.config();

// import files
const { User } = require('./src/models/User'); // Adjust the path to your User model accordingly
const passportConfig = require('./src/middleware/passportConfig'); // Import passport configuration
//const jwtAuth = require('./src/middleware/jwtAuth');
const { jwtAuth, logUserInfo } = require('./src/middleware/jwtAuth');

//catch google OAuth25Strategy errors
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

// import routes
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();


// Middleware
app.use(cors());
app.use(express.json());// Middleware to parse JSON request bodies
app.use('/tasks', taskRoutes); // Use task routes at /tasks endpoint
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(logUserInfo);
app.use(jwtAuth);
// Routes
app.use('/auth', userRoutes);
app.use('/tasks', taskRoutes);
app.use ('/', userRoutes); 

// Protected route example clear

app.get('/profile', jwtAuth, (req, res) => {
       // find user by Id from user model
       User.findById(req.userId, (err, user) => {
              // if error or not the user .
              if (err || !user) {
                  return res.status(404).json({ message: 'User not found.' });
              }
               // Send the user's email in the response
              res.status(200).json({ email: user.email });
          });
   }); 

// port configuration
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//export app.js
module.exports = app;
