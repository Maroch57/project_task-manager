// ./src/middleware/jwtAuth.js
const jwt = require('jsonwebtoken');

// Middleware function to authenticate JWT tokens
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

module.exports = jwtAuth;