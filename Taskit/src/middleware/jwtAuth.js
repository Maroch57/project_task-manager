// ./src/middleware/jwtAuth.js
const jwt = require('jsonwebtoken');
const { expressjwt:expressJwt } = require('express-jwt');

// Middleware function to authenticate JWT tokens
const jwtAuth = expressJwt({
    secret: process.env.JWT_SECRET,  // Your secret key
    algorithms: ['HS256'],            // Algorithm used to sign the token
}).unless({path: ['/login', '/signup']});//// Exclude these routes from JWT verification

// Example middleware function to log user info
const logUserInfo = (req, res, next) => {
    console.log('Decoded JWT:', req.user); // Log decoded JWT payload
    next(); // Call the next middleware
};

module.exports = { jwtAuth, logUserInfo };

/*// Middleware function to authenticate JWT tokens
const jwtAuth = (req, res, next) => {
       const token = req.headers['authorization']?.split(' ')[1]; // Get the token from the header
       if (!token) {
           return res.status(403).json({ message: 'No token provided.' });
       }
   
       jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
           if (err) {
               return res.status(401).json({ message: 'Unauthorized!' });
           }
           req.userId = decoded.id; // Store the user ID from the token
           next(); // Call the next middleware
       });
   };

module.exports = jwtAuth;*/